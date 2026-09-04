import { rateLimit } from './_rate-limit.js';
import { originAllowed } from './_origin.js';
import { issueToken, checkToken } from './_tokens.js';
import { alertOwner } from './_alert.js';
import { clientIp } from './_ip.js';
import { applyJsonHeaders, applyPageHeaders } from './_headers.js';
import { fetchWithTimeout as fetch } from './_fetch.js';
import crypto from 'node:crypto';

/* Four endpoints in one function, so the deploy stays under the 12-function
 * Hobby limit: /api/newsletter (double opt-in subscribe), /api/newsletter-confirm
 * (the confirmation click), /api/newsletter-unsubscribe (one-click opt-out)
 * and /api/newsletter-prefs (the preferences SPA). Split on the request
 * path — Vercel preserves the original URL through the rewrites in
 * vercel.json.
 *
 * Subscribing uses double opt-in: a new address is staged in a pending key
 * with its expiry, never added to the subscriber set itself — the
 * confirmation link in the email does that. Addresses already in the set
 * are told they are subscribed and asked nothing. When no KV store is
 * configured — or it is down — the request fails before sending an unusable
 * confirmation link.
 *
 * The confirm click is a GET on purpose: mail clients fetch links with
 * plain GETs. The token is the gate — it carries its purpose, the address,
 * an expiry and an HMAC, so an invalid, expired, forged or repurposed link
 * is refused before any store write. Clicking an already-consumed link is
 * idempotent: SADD reports 0 and no second welcome email goes out.
 *
 * The unsubscribe link carries a stateless token bound to its own address
 * (purpose 'nl-unsub'), so it can only ever unsubscribe that address, and
 * it stops working after 90 days. The address is removed from the
 * subscriber set; the pending key, the per-language key and the
 * preferences are cleared too. The page is served regardless of KV being
 * up: the token itself is the proof of intent.
 *
 * The preferences endpoint answers with JSON because the preferences page
 * is a SPA, unlike the plain HTML the confirm and unsubscribe pages serve.
 * It stores newsletter:prefs:<email> = { "frequency", "sections" } with a
 * one-year TTL, refreshed on every save (the sender only reads the key when
 * it exists — the default is weekly, all sections).
 *
 * Template helpers are inline copies of the ones in contact.ts — see the
 * comment atop _rate-limit.ts. */

const SITE_URL = 'https://seynudedagnon.com';
const C = { pine950: '#0c2e2a', pine900: '#133e38', gold500: '#c9a24b', gold400: '#d4b36a', ivory: '#faf8f4', white: '#ffffff', ink: '#3a3a3a', muted: '#6b7280' };

function wrap(body: string): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;padding:0;background:${C.ivory};font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif"><table width="100%" cellpadding="0" cellspacing="0" style="background:${C.ivory};padding:32px 16px"><tr><td align="center"><table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${C.white};border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(12,46,42,.08)">${body}</table><p style="margin:20px 0 0;font-size:11px;color:${C.muted};text-align:center"><a href="${SITE_URL}" style="color:${C.gold500};text-decoration:none">seynudedagnon.com</a></p></td></tr></table></body></html>`;
}
function hdr(title: string): string {
  return `<tr><td style="background:${C.pine950};padding:28px 32px"><table width="100%" cellpadding="0" cellspacing="0"><tr><td><p style="margin:0;font-size:13px;font-weight:600;letter-spacing:.12em;color:${C.gold400};text-transform:uppercase">Dr. Seynudé Dagnon</p><h1 style="margin:6px 0 0;font-size:20px;font-weight:600;color:${C.white};line-height:1.3">${title}</h1></td></tr></table></td></tr>`;
}
function ftr(): string {
  return `<tr><td style="background:${C.pine900};padding:20px 32px"><p style="margin:0;font-size:11px;color:rgba(255,255,255,.5);text-align:center">Public Health &amp; Malaria Program Leader &middot; <a href="${SITE_URL}" style="color:${C.gold400};text-decoration:none">Website</a></p></td></tr>`;
}

const ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ESCAPES[c]);

function page(title: string, body: string): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"></head><body style="margin:0;padding:0;background:${C.ivory};font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif"><table width="100%" cellpadding="0" cellspacing="0" style="background:${C.ivory};padding:32px 16px"><tr><td align="center"><table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:${C.white};border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(12,46,42,.08)"><tr><td style="background:${C.pine950};padding:28px 32px"><p style="margin:0;font-size:13px;font-weight:600;letter-spacing:.12em;color:${C.gold400};text-transform:uppercase">Dr. Seynudé Dagnon</p><h1 style="margin:6px 0 0;font-size:20px;font-weight:600;color:${C.white};line-height:1.3">${esc(title)}</h1></td></tr><tr><td style="padding:28px 32px"><p style="margin:0;font-size:14px;line-height:1.7;color:${C.ink}">${body}</p><table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0 0"><tr><td align="center"><a href="${SITE_URL}" style="display:inline-block;background:${C.gold500};color:${C.pine950};font-size:13px;font-weight:600;padding:12px 28px;border-radius:999px;text-decoration:none">seynudedagnon.com</a></td></tr></table></td></tr></table></td></tr></table></body></html>`;
}

function confirmHtml(lang: 'fr' | 'en', href: string): string {
  const isFr = lang === 'fr';
  const title = isFr ? 'Confirmez votre inscription' : 'Confirm your subscription';
  const p1 = isFr
    ? 'Merci pour votre intérêt pour la newsletter du Dr. Seynudé Dagnon.'
    : 'Thank you for your interest in Dr. Seynudé Dagnon’s newsletter.';
  const p2 = isFr ? 'Cliquez sur le bouton ci-dessous pour confirmer votre inscription :' : 'Click the button below to confirm your subscription:';
  const cta = isFr ? 'Confirmer mon inscription' : 'Confirm my subscription';
  const alt = isFr
    ? 'Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :'
    : 'If the button does not work, copy this link into your browser:';
  return wrap(
    hdr(title) +
      `<tr><td style="padding:28px 32px"><p style="margin:0;font-size:14px;line-height:1.7;color:${C.ink}">${p1}</p><p style="margin:12px 0 0;font-size:14px;line-height:1.7;color:${C.ink}">${p2}</p><table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0"><tr><td align="center"><a href="${href}" style="display:inline-block;background:${C.gold500};color:${C.pine950};font-size:13px;font-weight:600;padding:12px 28px;border-radius:999px;text-decoration:none">${esc(cta)}</a></td></tr></table><p style="margin:0;font-size:12px;line-height:1.6;color:${C.muted}">${esc(alt)}<br><span style="word-break:break-all">${esc(href)}</span></p><p style="margin:18px 0 0;font-size:12px;color:${C.muted};text-align:center">Ce lien est valable 7 jours. / This link is valid for 7 days.</p></td></tr>` +
      ftr(),
  );
}

function welcomeHtml(lang: 'fr' | 'en'): string {
  const isFr = lang === 'fr';
  const title = isFr ? 'Bienvenue dans la newsletter' : 'Welcome to the newsletter';
  const p1 = isFr
    ? 'Merci de votre inscription. Vous recevrez de temps en temps les publications, tribunes et actualités du Dr. Seynudé Dagnon sur la lutte contre le paludisme et les systèmes de santé.'
    : 'Thank you for subscribing. From time to time, you will receive publications, op-eds and news from Dr. Seynudé Dagnon on malaria control and health systems.';
  const p2 = isFr ? 'En attendant, explorez ses travaux :' : 'In the meantime, explore his work:';
  const signoff = isFr ? 'Cordialement,' : 'Best regards,';
  const role = isFr ? 'Leader de programme en santé publique et paludisme' : 'Public Health & Malaria Program Leader';
  return wrap(
    hdr(title) +
      `<tr><td style="padding:28px 32px"><p style="margin:0;font-size:14px;line-height:1.7;color:${C.ink}">${p1}</p><p style="margin:14px 0 0;font-size:14px;line-height:1.7;color:${C.ink}">${p2}</p><table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0"><tr><td align="center" style="padding:4px"><a href="${SITE_URL}/publications" style="display:inline-block;background:${C.pine950};color:${C.gold400};font-size:12px;font-weight:600;padding:10px 22px;border-radius:999px;text-decoration:none;letter-spacing:.03em">Publications</a></td><td align="center" style="padding:4px"><a href="${SITE_URL}/media" style="display:inline-block;background:${C.pine950};color:${C.gold400};font-size:12px;font-weight:600;padding:10px 22px;border-radius:999px;text-decoration:none;letter-spacing:.03em">Media</a></td></tr></table><p style="margin:18px 0 0;font-size:14px;line-height:1.7;color:${C.ink}">${signoff}<br><strong>Dr. Seynudé Jean-Fortuné Dagnon</strong><br><span style="font-size:13px;color:${C.muted}">${role}</span></p></td></tr>` +
      ftr(),
  );
}

/* ── subscriber store ───────────────────────────────────────────── */

type StageVerdict = 'already' | 'staged' | 'unavailable';
type StoreVerdict = 'added' | 'exists' | 'missing' | 'unavailable';

const PENDING_TTL_S = 7 * 24 * 60 * 60;

async function stageSubscriber(email: string, lang: string): Promise<StageVerdict> {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return 'unavailable';
  try {
    const response = await fetch(`${url.replace(/\/$/, '')}/pipeline`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify([
        ['SISMEMBER', 'newsletter:emails', email],
        ['SET', `newsletter:pending:${email}`, lang, 'EX', String(PENDING_TTL_S)],
      ]),
    });
    if (!response.ok) return 'unavailable';
    const results = (await response.json()) as { result?: unknown }[];
    const member = Number(results?.[0]?.result);
    if (!Number.isFinite(member)) return 'unavailable';
    return member === 1 ? 'already' : 'staged';
  } catch {
    return 'unavailable';
  }
}

/* Persists the confirmed language for the lifetime of the subscription. */

async function confirmSubscriber(email: string, lang: 'fr' | 'en'): Promise<StoreVerdict> {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return 'unavailable';
  try {
    const pendingResponse = await fetch(`${url.replace(/\/$/, '')}/pipeline`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify([
        ['GET', `newsletter:pending:${email}`],
        ['SISMEMBER', 'newsletter:emails', email],
      ]),
    });
    if (!pendingResponse.ok) return 'unavailable';
    const pendingResults = (await pendingResponse.json()) as { result?: unknown }[];
    const pendingLang = pendingResults?.[0]?.result;
    if (pendingLang !== 'fr' && pendingLang !== 'en') {
      return Number(pendingResults?.[1]?.result) === 1 ? 'exists' : 'missing';
    }

    const response = await fetch(`${url.replace(/\/$/, '')}/pipeline`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify([
        ['SADD', 'newsletter:emails', email],
        ['DEL', `newsletter:pending:${email}`],
        ['SET', `newsletter:lang:${email}`, pendingLang],
      ]),
    });
    if (!response.ok) return 'unavailable';
    const results = (await response.json()) as { result?: unknown }[];
    const added = Number(results?.[0]?.result);
    if (!Number.isFinite(added)) return 'unavailable';
    void lang;
    return added > 0 ? 'added' : 'exists';
  } catch {
    return 'unavailable';
  }
}

/* Removes the address from the subscriber set and clears the pending,
   per-language and preference keys so a stale confirmation link cannot
   resurrect the subscription. The page is served regardless of KV being
   up: the token itself is the proof of intent. */
async function removeSubscriber(email: string): Promise<boolean> {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return false;
  try {
    const response = await fetch(`${url.replace(/\/$/, '')}/pipeline`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify([
        ['SREM', 'newsletter:emails', email],
        ['DEL', `newsletter:pending:${email}`],
        ['DEL', `newsletter:lang:${email}`],
        ['DEL', `newsletter:prefs:${email}`],
      ]),
    });
    if (!response.ok) return false;
    const results = (await response.json()) as { result?: unknown }[];
    return results?.[0]?.result !== undefined;
  } catch {
    return false;
  }
}

/* ── subscribe handler (/api/newsletter) ────────────────────────── */

const MAX_EMAIL = 254;
const IP_WINDOW_MS = 10 * 60_000;
const MAX_IP_HITS = 5;
const EMAIL_WINDOW_MS = 60 * 60_000;
const MAX_EMAIL_HITS = 3;

async function subscribeHandler(req: Req, res: Res): Promise<void> {
  applyJsonHeaders(res);
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }
  if (!originAllowed(req.headers)) { res.status(403).json({ error: 'Forbidden' }); return; }

  const ip = clientIp(req.headers, req.socket?.remoteAddress);
  if (!ip) { res.status(403).json({ error: 'Forbidden' }); return; }
  if (!(await rateLimit(`newsletter:ip:${ip}`, MAX_IP_HITS, IP_WINDOW_MS))) { res.status(429).json({ error: 'Too many requests' }); return; }

  try {
    const body = (req.body ?? {}) as { email?: unknown; lang?: unknown; website?: unknown };
    const { email, lang, website } = body;

    /* Honeypot: same contract as the contact form — filled by bots only,
       answered 200 so they cannot tell they were caught. */
    if (website) { res.status(200).json({ ok: true }); return; }

    if (!email || typeof email !== 'string') { res.status(400).json({ error: 'Missing required fields' }); return; }

    const cleanEmail = email.replace(/[\r\n\t]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, MAX_EMAIL).toLowerCase();
    if (!cleanEmail) { res.status(400).json({ error: 'Missing required fields' }); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) { res.status(400).json({ error: 'Invalid email' }); return; }

    if (!(await rateLimit(`newsletter:email:${cleanEmail}`, MAX_EMAIL_HITS, EMAIL_WINDOW_MS))) { res.status(429).json({ error: 'Too many requests' }); return; }

    /* only our two languages — anything else falls back to English */
    const cleanLang: 'fr' | 'en' = lang === 'fr' ? 'fr' : 'en';

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.CONTACT_FROM_EMAIL || 'Dr. Seynudé Dagnon <admin@seynudedagnon.com>';
    if (!apiKey) { res.status(500).json({ error: 'Email service not configured' }); return; }

    const staged = await stageSubscriber(cleanEmail, cleanLang);
    /* identical body on every branch: whether the address was already on the
       list must not be answerable by an unauthenticated probe */
    if (staged === 'already') { res.status(200).json({ ok: true, pending: true }); return; }
    if (staged === 'unavailable') { res.status(503).json({ error: 'Storage unavailable' }); return; }

    const token = issueToken('nl-confirm', cleanEmail);
    if (!token) { res.status(500).json({ error: 'Verification not configured' }); return; }

    const href = `${SITE_URL}/api/newsletter-confirm?email=${encodeURIComponent(cleanEmail)}&token=${encodeURIComponent(token)}&lang=${cleanLang}`;

    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': `confirm-${crypto.createHash('sha256').update(token).digest('hex').slice(0, 48)}`,
      },
      body: JSON.stringify({
        from,
        to: [cleanEmail],
        subject: cleanLang === 'fr' ? 'Confirmez votre inscription à la newsletter' : 'Confirm your newsletter subscription',
        html: confirmHtml(cleanLang, href),
        text: cleanLang === 'fr'
          ? `Merci pour votre intérêt pour la newsletter du Dr. Seynudé Dagnon.\n\nCliquez sur ce lien pour confirmer votre inscription (valable 7 jours) :\n${href}\n\nSi vous n'avez pas demandé cette inscription, ignorez cet email.`
          : `Thank you for your interest in Dr. Seynudé Dagnon’s newsletter.\n\nClick this link to confirm your subscription (valid for 7 days):\n${href}\n\nIf you did not request this subscription, ignore this email.`,
      }),
    });
    if (!r.ok) { const err = await r.text(); console.error('Resend error', err); await alertOwner('newsletter confirmation', `Resend refused the send: ${err}`); res.status(500).json({ error: 'Failed to send' }); return; }

    res.status(200).json({ ok: true, pending: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
}

/* ── confirm handler (/api/newsletter-confirm) ──────────────────── */

async function confirmHandler(req: Req, res: Res): Promise<void> {
  applyPageHeaders(res);
  if (req.method !== 'GET') { res.status(405).json({ error: 'Method not allowed' }); return; }

  const params = new URL(req.url || '/', SITE_URL).searchParams;
  const rawEmail = params.get('email') || '';
  const token = params.get('token') || '';
  const lang: 'fr' | 'en' = params.get('lang') === 'fr' ? 'fr' : 'en';

  const cleanEmail = rawEmail.trim().slice(0, MAX_EMAIL).toLowerCase();
  if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) || !token) {
    res.status(400).send(page('Invalid link', 'This confirmation link is invalid. Please try subscribing again from the website.'));
    return;
  }

  const result = checkToken('nl-confirm', token, cleanEmail);
  if (result === 'expired') {
    res.status(400).send(page('Link expired', 'This confirmation link has expired. Please subscribe again from the website to receive a new one.'));
    return;
  }
  if (result !== 'ok') {
    res.status(400).send(page('Invalid link', 'This confirmation link is invalid. Please try subscribing again from the website.'));
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) { res.status(500).json({ error: 'Email service not configured' }); return; }

  try {
    const stored = await confirmSubscriber(cleanEmail, lang);
    if (stored === 'unavailable') {
      /* the SADD never happened — telling the visitor they are subscribed
         would be a false success */
      res.status(503).send(page(
        'Something went wrong',
        'We could not confirm your subscription right now. Please try again in a few minutes. / Impossible de confirmer votre inscription pour le moment. Veuillez réessayer dans quelques minutes.',
      ));
      return;
    }
    if (stored === 'missing') {
      res.status(400).send(page(
        'Link already used or expired',
        'This confirmation request is no longer active. Please subscribe again from the website if you want to join the newsletter.',
      ));
      return;
    }
    if (stored === 'added') {
      const from = process.env.CONTACT_FROM_EMAIL || 'Dr. Seynudé Dagnon <admin@seynudedagnon.com>';
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'Idempotency-Key': `welcome-${crypto.createHash('sha256').update(token).digest('hex').slice(0, 48)}`,
        },
        body: JSON.stringify({
          from,
          to: [cleanEmail],
          subject: lang === 'fr' ? 'Bienvenue dans la newsletter du Dr. Dagnon' : 'Welcome to Dr. Dagnon’s newsletter',
          html: welcomeHtml(lang),
          text: lang === 'fr'
            ? 'Merci de votre inscription à la newsletter du Dr. Seynudé Dagnon.\n\nPublications : https://seynudedagnon.com/publications\nMédias : https://seynudedagnon.com/media\n\nCordialement,\nDr. Seynudé Jean-Fortuné Dagnon'
            : 'Thank you for subscribing to Dr. Seynudé Dagnon’s newsletter.\n\nPublications: https://seynudedagnon.com/publications\nMedia: https://seynudedagnon.com/media\n\nBest regards,\nDr. Seynudé Jean-Fortuné Dagnon',
        }),
      });
      if (!r.ok) {
        const err = await r.text();
        console.error('Resend welcome error', err);
        await alertOwner('newsletter welcome', `Resend refused the send: ${err}`);
        /* roll the subscription back so a later click on the same link
           retries cleanly — otherwise the address would be subscribed but
           never welcomed */
        await fetch(`${(process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '').replace(/\/$/, '')}/pipeline`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || ''}`, 'Content-Type': 'application/json' },
          body: JSON.stringify([['SREM', 'newsletter:emails', cleanEmail]]),
        }).catch(() => {});
        res.status(500).json({ error: 'Failed to send' });
        return;
      }
    }

    const done = lang === 'fr'
      ? 'Votre inscription est confirmée. Bienvenue dans la newsletter du Dr. Seynudé Dagnon — vous pouvez fermer cette page.'
      : 'Your subscription is confirmed. Welcome to Dr. Seynudé Dagnon’s newsletter — you can close this page.';
    res.status(200).send(page(lang === 'fr' ? 'Inscription confirmée' : 'Subscription confirmed', done));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
}

/* ── unsubscribe handler (/api/newsletter-unsubscribe) ──────────── */

async function unsubscribeHandler(req: Req, res: Res): Promise<void> {
  const params = new URL(req.url || '/', SITE_URL).searchParams;
  const rawEmail = params.get('email') || '';
  const token = params.get('token') || '';

  const cleanEmail = rawEmail.trim().slice(0, MAX_EMAIL).toLowerCase();
  if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) || !token) {
    res.status(400).send(page('Invalid link', 'This link is invalid. You can manage your subscription from the newsletter page on the website.'));
    return;
  }

  const result = checkToken('nl-unsub', token, cleanEmail);
  if (result !== 'ok') {
    res.status(400).send(page('Invalid link', 'This unsubscribe link is invalid or expired. You can manage your subscription from the newsletter page on the website.'));
    return;
  }

  try {
    const removed = await removeSubscriber(cleanEmail);
    if (!removed) {
      res.status(503).send(page('Something went wrong', 'We could not update your subscription right now. Please try again in a few minutes.'));
      return;
    }
    res.status(200).send(page(
      'Unsubscribed',
      'You have been unsubscribed from the newsletter of Dr. Seynudé Dagnon. You will no longer receive the digest or event reminders. If this was a mistake, you can subscribe again at any time.',
    ));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
}

/* ── preferences handler (/api/newsletter-prefs) ────────────────── */

const FREQUENCIES = ['weekly', 'monthly'] as const;
type Frequency = (typeof FREQUENCIES)[number];

const VALID_SECTIONS = ['publications', 'tribunes', 'agenda', 'projets'] as const;
type Section = (typeof VALID_SECTIONS)[number];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function kv() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ''), token } : null;
}

interface StoredPrefs { frequency?: Frequency; sections?: Section[] }

async function loadPrefs(email: string): Promise<StoredPrefs> {
  const store = kv();
  const defaults: StoredPrefs = { frequency: 'weekly', sections: [...VALID_SECTIONS] };
  if (!store) return defaults;
  try {
    const response = await fetch(`${store.url}/pipeline`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${store.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify([['GET', `newsletter:prefs:${email}`]]),
    });
    if (!response.ok) return defaults;
    const results = (await response.json()) as { result?: unknown }[];
    const raw = results[0]?.result;
    if (typeof raw !== 'string') return defaults;
    const parsed = JSON.parse(raw) as StoredPrefs;
    return {
      frequency: parsed.frequency === 'monthly' ? 'monthly' : 'weekly',
      sections: Array.isArray(parsed.sections) && parsed.sections.length > 0
        ? parsed.sections.filter((s): s is Section => VALID_SECTIONS.includes(s as Section))
        : [...VALID_SECTIONS],
    };
  } catch {
    return defaults;
  }
}

async function savePrefs(email: string, frequency: Frequency, sections: Section[]): Promise<boolean> {
  const store = kv();
  if (!store) return false;
  try {
    const response = await fetch(`${store.url}/pipeline`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${store.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify([
        ['SET', `newsletter:prefs:${email}`, JSON.stringify({ frequency, sections })],
      ]),
    });
    if (!response.ok) return false;
    const results = (await response.json()) as { result?: unknown }[];
    return results[0]?.result === 'OK';
  } catch {
    return false;
  }
}

/** Shared by both methods: reads email+token, validates shape and the
 *  HMAC, and normalizes the address. Returns null on failure. */
function authenticate(req: Req): { email: string; token: string } | null {
  const params = new URL(req.url || '/', SITE_URL).searchParams;
  const email = params.get('email')?.trim().slice(0, MAX_EMAIL).toLowerCase() ?? '';
  const token = params.get('token') ?? '';
  if (!email || !EMAIL_RE.test(email) || !token) return null;
  return checkToken('nl-prefs', token, email) === 'ok' ? { email, token } : null;
}

async function prefsHandler(req: Req, res: Res): Promise<void> {
  applyJsonHeaders(res);
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const auth = authenticate(req);
  if (!auth) {
    res.status(400).json({ error: 'Invalid link' });
    return;
  }

  if (req.method === 'GET') {
    const prefs = await loadPrefs(auth.email);
    res.status(200).json({ email: auth.email, frequency: prefs.frequency, sections: prefs.sections });
    return;
  }

  /* POST — save preferences */
  let body: { frequency?: unknown; sections?: unknown };
  try {
    body = (typeof req.body === 'string' ? JSON.parse(req.body) : req.body) as { frequency?: unknown; sections?: unknown };
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('invalid body');
  } catch {
    res.status(400).json({ error: 'Invalid request' });
    return;
  }
  const frequency = body.frequency;
  if (!FREQUENCIES.includes(frequency as Frequency)) {
    res.status(400).json({ error: 'Invalid frequency' });
    return;
  }
  const sections: Section[] = Array.isArray(body.sections) && body.sections.length > 0
    ? (body.sections as unknown[]).filter((s): s is Section => VALID_SECTIONS.includes(s as Section))
    : [...VALID_SECTIONS];
  const saved = await savePrefs(auth.email, frequency as Frequency, sections);
  if (!saved) {
    res.status(502).json({ error: 'Storage unavailable' });
    return;
  }
  res.status(200).json({ ok: true, email: auth.email, frequency, sections });
}

/* ── handler ────────────────────────────────────────────────────── */

interface Req { method: string; url?: string; headers: Record<string, string | string[] | undefined>; socket?: { remoteAddress?: string }; body?: unknown }
interface Res { status(c: number): Res; send(d: string): void; json(d: unknown): void; setHeader(k: string, v: string): void }

export default async function handler(req: Req, res: Res) {
  /* Vercel preserves the original URL through the rewrites, so the path
     picks the right endpoint. Everything else is the subscribe flow. */
  const path = new URL(req.url || '/', SITE_URL).pathname;
  if (path === '/api/newsletter-confirm' || path.endsWith('/newsletter-confirm')) {
    await confirmHandler(req, res);
    return;
  }
  if (path === '/api/newsletter-unsubscribe' || path.endsWith('/newsletter-unsubscribe')) {
    await unsubscribeHandler(req, res);
    return;
  }
  if (path === '/api/newsletter-prefs' || path.endsWith('/newsletter-prefs') || path.endsWith('/newsletter/preferences')) {
    await prefsHandler(req, res);
    return;
  }
  await subscribeHandler(req, res);
}
