import { checkToken } from './_tokens.js';
import { alertOwner } from './_alert.js';
import { applyPageHeaders } from './_headers.js';

/* Double opt-in confirmation endpoint — the link inside the confirmation
 * email. Clicking it moves the address from the pending key into the
 * subscriber set (`newsletter:emails`) and sends the welcome email, which
 * is why the welcome template lives here and not in api/newsletter.ts:
 * that handler only ever sends the confirmation request now.
 *
 * A GET on purpose: mail clients fetch links with plain GETs. The token is
 * the gate — it carries its purpose, the address, an expiry and an HMAC, so
 * an invalid, expired, forged or repurposed link is refused before any
 * store write. Clicking an already-consumed link is idempotent: SADD
 * reports 0 and no second welcome email goes out.
 *
 * Template helpers are inline copies of the ones in newsletter.ts — see
 * the comment atop _rate-limit.ts. */

const SITE_URL = 'https://seynudedagnon.com';
const C = { pine950: '#0c2e2a', pine900: '#133e38', gold500: '#c9a24b', gold400: '#d4b36a', ivory: '#faf8f4', white: '#ffffff', ink: '#3a3a3a', muted: '#6b7280' };
const ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ESCAPES[c]);

function page(title: string, body: string): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"></head><body style="margin:0;padding:0;background:${C.ivory};font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif"><table width="100%" cellpadding="0" cellspacing="0" style="background:${C.ivory};padding:32px 16px"><tr><td align="center"><table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:${C.white};border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(12,46,42,.08)"><tr><td style="background:${C.pine950};padding:28px 32px"><p style="margin:0;font-size:13px;font-weight:600;letter-spacing:.12em;color:${C.gold400};text-transform:uppercase">Dr. Seynudé Dagnon</p><h1 style="margin:6px 0 0;font-size:20px;font-weight:600;color:${C.white};line-height:1.3">${esc(title)}</h1></td></tr><tr><td style="padding:28px 32px"><p style="margin:0;font-size:14px;line-height:1.7;color:${C.ink}">${body}</p><table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0 0"><tr><td align="center"><a href="${SITE_URL}" style="display:inline-block;background:${C.gold500};color:${C.pine950};font-size:13px;font-weight:600;padding:12px 28px;border-radius:999px;text-decoration:none">seynudedagnon.com</a></td></tr></table></td></tr></table></td></tr></table></body></html>`;
}

function wrap(body: string): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;padding:0;background:${C.ivory};font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif"><table width="100%" cellpadding="0" cellspacing="0" style="background:${C.ivory};padding:32px 16px"><tr><td align="center"><table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${C.white};border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(12,46,42,.08)">${body}</table><p style="margin:20px 0 0;font-size:11px;color:${C.muted};text-align:center"><a href="${SITE_URL}" style="color:${C.gold500};text-decoration:none">seynudedagnon.com</a></p></td></tr></table></body></html>`;
}
function hdr(title: string): string {
  return `<tr><td style="background:${C.pine950};padding:28px 32px"><table width="100%" cellpadding="0" cellspacing="0"><tr><td><p style="margin:0;font-size:13px;font-weight:600;letter-spacing:.12em;color:${C.gold400};text-transform:uppercase">Dr. Seynudé Dagnon</p><h1 style="margin:6px 0 0;font-size:20px;font-weight:600;color:${C.white};line-height:1.3">${title}</h1></td></tr></table></td></tr>`;
}
function ftr(): string {
  return `<tr><td style="background:${C.pine900};padding:20px 32px"><p style="margin:0;font-size:11px;color:rgba(255,255,255,.5);text-align:center">Public Health &amp; Malaria Program Leader &middot; <a href="${SITE_URL}" style="color:${C.gold400};text-decoration:none">Website</a></p></td></tr>`;
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

type StoreVerdict = 'added' | 'exists' | 'unavailable';

/* Persists the language the subscriber signed up in (`newsletter:lang:<email>`),
   read from the pending key staged at subscribe time — the digest then goes
   out in that language only. The 90-day TTL matches the unsubscribe token's
   lifetime: an address that stays subscribed past it re-lands on the
   bilingual digest, which is the safe default. */
const LANG_TTL_S = 90 * 24 * 60 * 60;

async function confirmSubscriber(email: string, lang: 'fr' | 'en'): Promise<StoreVerdict> {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return 'unavailable';
  try {
    const response = await fetch(`${url.replace(/\/$/, '')}/pipeline`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify([
        ['GET', `newsletter:pending:${email}`],
        ['SADD', 'newsletter:emails', email],
        ['DEL', `newsletter:pending:${email}`],
        ['SET', `newsletter:lang:${email}`, lang, 'EX', String(LANG_TTL_S)],
      ]),
    });
    if (!response.ok) return 'unavailable';
    const results = (await response.json()) as { result?: unknown }[];
    const pendingLang = typeof results?.[0]?.result === 'string' ? results[0].result : null;
    const added = Number(results?.[1]?.result);
    if (!Number.isFinite(added)) return 'unavailable';
    /* the pending key is the authoritative language: it was written at
       subscribe time from the form, the ?lang param is only its echo */
    if (pendingLang === 'fr' || pendingLang === 'en') {
      if (pendingLang !== lang) {
        await fetch(`${url.replace(/\/$/, '')}/pipeline`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify([['SET', `newsletter:lang:${email}`, pendingLang, 'EX', String(LANG_TTL_S)]]),
        }).catch(() => {});
      }
    }
    return added > 0 ? 'added' : 'exists';
  } catch {
    return 'unavailable';
  }
}

/* ── handler ────────────────────────────────────────────────────── */

const MAX_EMAIL = 254;

interface Req { method: string; url?: string; headers: Record<string, string | string[] | undefined>; socket?: { remoteAddress?: string } }
interface Res { status(c: number): Res; send(d: string): void; json(d: unknown): void; setHeader(k: string, v: string): void }

export default async function handler(req: Req, res: Res) {
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
    if (stored === 'added') {
      const from = process.env.CONTACT_FROM_EMAIL || 'Portfolio <admin@seynudedagnon.com>';
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
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
