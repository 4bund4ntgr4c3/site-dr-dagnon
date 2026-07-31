import { rateLimit } from './_rate-limit.js';
import { originAllowed } from './_origin.js';

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

/* ── subscriber store ─────────────────────────────────────────────
   Addresses go into a Redis set (`newsletter:emails`) so a re-subscription
   is detected and does not re-send a welcome email. When no KV store is
   configured — or it is down — the subscription still works, minus the
   storage. */

type StoreVerdict = 'added' | 'exists' | 'unavailable';

async function storeSubscriber(email: string): Promise<StoreVerdict> {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return 'unavailable';
  try {
    const response = await fetch(`${url.replace(/\/$/, '')}/pipeline`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify([['SADD', 'newsletter:emails', email]]),
    });
    if (!response.ok) return 'unavailable';
    const results = (await response.json()) as { result?: unknown }[];
    const added = Number(results?.[0]?.result);
    if (!Number.isFinite(added)) return 'unavailable';
    return added > 0 ? 'added' : 'exists';
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

    /* store first: an address that is already in the set is a re-subscription
       and must not receive a second welcome email */
    const stored = await storeSubscriber(cleanEmail);
    if (stored === 'exists') { res.status(200).json({ ok: true, already: true }); return; }

    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [cleanEmail],
        subject: cleanLang === 'fr' ? 'Bienvenue dans la newsletter du Dr. Dagnon' : 'Welcome to Dr. Dagnon’s newsletter',
        html: welcomeHtml(cleanLang),
        text: cleanLang === 'fr'
          ? 'Merci de votre inscription à la newsletter du Dr. Seynudé Dagnon.\n\nPublications : https://seynudedagnon.com/publications\nMédias : https://seynudedagnon.com/media\n\nCordialement,\nDr. Seynudé Jean-Fortuné Dagnon'
          : 'Thank you for subscribing to Dr. Seynudé Dagnon’s newsletter.\n\nPublications: https://seynudedagnon.com/publications\nMedia: https://seynudedagnon.com/media\n\nBest regards,\nDr. Seynudé Jean-Fortuné Dagnon',
      }),
    });
    if (!r.ok) { const err = await r.text(); console.error('Resend error', err); res.status(500).json({ error: 'Failed to send' }); return; }

    res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
}
