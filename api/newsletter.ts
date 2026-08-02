import { rateLimit } from './_rate-limit.js';
import { originAllowed } from './_origin.js';
import { issueToken } from './_tokens.js';

/* ── Shared email template helpers ────────────────────────────────
   Inline copies of the ones in contact.ts: an earlier attempt at sharing
   them through a plain-named module made it both a route and a module, so
   each handler keeps its own copy. See the comment atop _rate-limit.ts.  */

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

/* ── subscriber store ─────────────────────────────────────────────
   Double opt-in: a new address is staged in a pending key with its
   expiry, never added to the subscriber set itself — the confirmation
   link in the email (api/newsletter-confirm) does that. Addresses
   already in the set are told they are subscribed and asked nothing.
   When no KV store is configured — or it is down — the flow still
   works: the confirmation link itself is the gate. */

type StageVerdict = 'already' | 'staged' | 'unavailable';

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

/* ── newsletter handler ─────────────────────────────────────────── */

const MAX_EMAIL = 254;
const IP_WINDOW_MS = 10 * 60_000;
const MAX_IP_HITS = 5;
const EMAIL_WINDOW_MS = 60 * 60_000;
const MAX_EMAIL_HITS = 3;

interface Req { method: string; headers: Record<string, string | string[] | undefined>; socket?: { remoteAddress?: string }; body?: { email?: string; lang?: string; website?: string } }
interface Res { status(c: number): Res; json(d: unknown): void }

export default async function handler(req: Req, res: Res) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }
  if (!originAllowed(req.headers)) { res.status(403).json({ error: 'Forbidden' }); return; }

  const ip = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').toString().split(',')[0].trim();
  if (!(await rateLimit(`newsletter:ip:${ip}`, MAX_IP_HITS, IP_WINDOW_MS))) { res.status(429).json({ error: 'Too many requests' }); return; }

  try {
    const { email, lang, website } = req.body || {};

    /* Honeypot: same contract as the contact form — filled by bots only,
       answered 200 so they cannot tell they were caught. */
    if (website) { res.status(200).json({ ok: true }); return; }

    if (!email) { res.status(400).json({ error: 'Missing required fields' }); return; }

    const cleanEmail = email.replace(/[\r\n\t]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, MAX_EMAIL).toLowerCase();
    if (!cleanEmail) { res.status(400).json({ error: 'Missing required fields' }); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) { res.status(400).json({ error: 'Invalid email' }); return; }

    if (!(await rateLimit(`newsletter:email:${cleanEmail}`, MAX_EMAIL_HITS, EMAIL_WINDOW_MS))) { res.status(429).json({ error: 'Too many requests' }); return; }

    /* only our two languages — anything else falls back to English */
    const cleanLang: 'fr' | 'en' = lang === 'fr' ? 'fr' : 'en';

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.CONTACT_FROM_EMAIL || 'Portfolio <admin@seynudedagnon.com>';
    if (!apiKey) { res.status(500).json({ error: 'Email service not configured' }); return; }

    const staged = await stageSubscriber(cleanEmail, cleanLang);
    if (staged === 'already') { res.status(200).json({ ok: true, already: true }); return; }

    const token = issueToken('nl-confirm', cleanEmail);
    if (!token) { res.status(500).json({ error: 'Verification not configured' }); return; }

    const href = `${SITE_URL}/api/newsletter-confirm?email=${encodeURIComponent(cleanEmail)}&token=${encodeURIComponent(token)}&lang=${cleanLang}`;

    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
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
    if (!r.ok) { const err = await r.text(); console.error('Resend error', err); res.status(500).json({ error: 'Failed to send' }); return; }

    res.status(200).json({ ok: true, pending: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
}
