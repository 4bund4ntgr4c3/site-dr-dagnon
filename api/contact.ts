import crypto from 'node:crypto';
import { rateLimit } from './_rate-limit.js';
import { originAllowed } from './_origin.js';
import { alertOwner } from './_alert.js';
import { clientIp } from './_ip.js';
import { applyJsonHeaders } from './_headers.js';

/* Two endpoints in one function, so the deploy stays under the 12-function
 * Hobby limit: /api/contact (the contact form: admin notification +
 * auto-reply) and /api/verify-phone (the code-gated phone reveal on the
 * contact page). Split on the request path — Vercel preserves the original
 * URL through the rewrites in vercel.json.
 *
 * ── Shared email template helpers ──────────────────────────────── */

const SITE_URL = 'https://seynudedagnon.com';
const C = { pine950: '#0c2e2a', pine900: '#133e38', gold500: '#c9a24b', gold400: '#d4b36a', ivory: '#faf8f4', white: '#ffffff', ink: '#3a3a3a', muted: '#6b7280' };

/* Visitor-supplied values are interpolated into HTML emails, so every
   one of them must be escaped — otherwise a name like
   `<a href="…">Click</a>` renders as a live link in the inbox.       */
const ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ESCAPES[c]);

function wrap(body: string): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;padding:0;background:${C.ivory};font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif"><table width="100%" cellpadding="0" cellspacing="0" style="background:${C.ivory};padding:32px 16px"><tr><td align="center"><table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${C.white};border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(12,46,42,.08)">${body}</table><p style="margin:20px 0 0;font-size:11px;color:${C.muted};text-align:center"><a href="${SITE_URL}" style="color:${C.gold500};text-decoration:none">seynudedagnon.com</a></p></td></tr></table></body></html>`;
}
function hdr(title: string): string {
  return `<tr><td style="background:${C.pine950};padding:28px 32px"><table width="100%" cellpadding="0" cellspacing="0"><tr><td><p style="margin:0;font-size:13px;font-weight:600;letter-spacing:.12em;color:${C.gold400};text-transform:uppercase">Dr. Seynudé Dagnon</p><h1 style="margin:6px 0 0;font-size:20px;font-weight:600;color:${C.white};line-height:1.3">${title}</h1></td></tr></table></td></tr>`;
}
function ftr(): string {
  return `<tr><td style="background:${C.pine900};padding:20px 32px"><p style="margin:0;font-size:11px;color:rgba(255,255,255,.5);text-align:center">Public Health &amp; Malaria Program Leader &middot; <a href="${SITE_URL}" style="color:${C.gold400};text-decoration:none">Website</a></p></td></tr>`;
}

function adminHtml(name: string, email: string, phone: string, subject: string, message: string, typeLabel: string): string {
  const subCard = subject ? `<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px"><tr><td style="padding:10px 14px;background:${C.ivory};border-radius:8px;border-left:3px solid ${C.gold500}"><p style="margin:0;font-size:11px;font-weight:600;color:${C.muted};text-transform:uppercase;letter-spacing:.08em">Subject</p><p style="margin:2px 0 0;font-size:14px;font-weight:600;color:${C.ink}">${esc(subject)}</p></td></tr></table>` : '';
  const typeCard = typeLabel ? `<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px"><tr><td style="padding:10px 14px;background:${C.pine950};border-radius:8px"><p style="margin:0;font-size:11px;font-weight:600;color:${C.gold400};text-transform:uppercase;letter-spacing:.08em">Request type</p><p style="margin:2px 0 0;font-size:14px;font-weight:600;color:${C.white}">${esc(typeLabel)}</p></td></tr></table>` : '';
  const contactLine = `${esc(email)}${phone ? ` &middot; ${esc(phone)}` : ''}`;
  return wrap(hdr('New message received') + `<tr><td style="padding:28px 32px">${typeCard}<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px"><tr><td style="padding:10px 14px;background:${C.ivory};border-radius:8px;border-left:3px solid ${C.gold500}"><p style="margin:0;font-size:11px;font-weight:600;color:${C.muted};text-transform:uppercase;letter-spacing:.08em">From</p><p style="margin:2px 0 0;font-size:14px;font-weight:600;color:${C.ink}">${esc(name)}</p><p style="margin:2px 0 0;font-size:13px;color:${C.muted}">${contactLine}</p></td></tr></table>${subCard}<table width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding:14px;background:${C.ivory};border-radius:8px"><p style="margin:0;font-size:11px;font-weight:600;color:${C.muted};text-transform:uppercase;letter-spacing:.08em">Message</p><p style="margin:6px 0 0;font-size:14px;line-height:1.65;color:${C.ink};white-space:pre-wrap">${esc(message)}</p></td></tr></table><table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px"><tr><td align="center"><a href="mailto:${esc(email)}?subject=Re:%20${encodeURIComponent(subject || 'Your message')}" style="display:inline-block;background:${C.gold500};color:${C.pine950};font-size:13px;font-weight:600;padding:12px 28px;border-radius:999px;text-decoration:none">Reply to ${esc(name)}</a></td></tr></table></td></tr>` + ftr());
}

function autoReplyHtml(name: string, subject: string): string {
  return wrap(hdr('Thank you for your message') + `<tr><td style="padding:28px 32px"><p style="margin:0;font-size:14px;line-height:1.7;color:${C.ink}">Dear <strong>${esc(name)}</strong>,</p><p style="margin:14px 0 0;font-size:14px;line-height:1.7;color:${C.ink}">Thank you for reaching out. I have received your message${subject ? ` regarding <strong>"${esc(subject)}"</strong>` : ''} and will get back to you as soon as possible.</p><p style="margin:14px 0 0;font-size:14px;line-height:1.7;color:${C.ink}">In the meantime, feel free to explore my work:</p><table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0"><tr><td align="center" style="padding:4px"><a href="${SITE_URL}/publications" style="display:inline-block;background:${C.pine950};color:${C.gold400};font-size:12px;font-weight:600;padding:10px 22px;border-radius:999px;text-decoration:none;letter-spacing:.03em">Publications</a></td><td align="center" style="padding:4px"><a href="${SITE_URL}/media" style="display:inline-block;background:${C.pine950};color:${C.gold400};font-size:12px;font-weight:600;padding:10px 22px;border-radius:999px;text-decoration:none;letter-spacing:.03em">Media</a></td></tr></table><p style="margin:18px 0 0;font-size:14px;line-height:1.7;color:${C.ink}">Best regards,<br><strong>Dr. Seynudé Jean-Fortuné Dagnon</strong><br><span style="font-size:13px;color:${C.muted}">Public Health &amp; Malaria Program Leader</span></p></td></tr>` + ftr());
}

/* ── Contact handler ───────────────────────────────────────────── */

const MAX_NAME = 200;
const MAX_EMAIL = 254;
const MAX_PHONE = 30;
const MAX_SUBJECT = 500;
const MAX_MESSAGE = 5000;
const sanitize = (s: string) => s.replace(/[\r\n\t]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, MAX_MESSAGE);
const validPhone = (s: string) => {
  const digits = (s.match(/\d/g) || []).length;
  return /^[+\d][\d\s().-]*$/.test(s) && digits >= 6 && digits <= 15;
};

const WINDOW_MS = 60_000;
const MAX_HITS = 5;
/* the auto-reply goes to the sender's address, so per-email limiting stops
   someone rotating IPs from using the form to mail-bomb a victim (the IP
   limit above is per instance, the email limit below is per address) */
const EMAIL_WINDOW_MS = 3_600_000;
const MAX_EMAIL_HITS = 3;
const ALLOWED_TYPES = ['general', 'speaking', 'interview', 'partnership', 'press'];

interface Req { method: string; url?: string; headers: Record<string, string | string[] | undefined>; socket?: { remoteAddress?: string }; body?: { name?: string; email?: string; phone?: string; subject?: string; message?: string; website?: string; type?: string; typeLabel?: string; action?: string; code?: string; token?: string } }
interface Res { status(c: number): Res; json(d: unknown): void; setHeader(k: string, v: string): void }

async function contactHandler(req: Req, res: Res): Promise<void> {
  applyJsonHeaders(res);
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }
  if (!originAllowed(req.headers)) { res.status(403).json({ error: 'Forbidden' }); return; }

  const ip = clientIp(req.headers, req.socket?.remoteAddress);
  if (!ip) { res.status(403).json({ error: 'Forbidden' }); return; }
  if (!(await rateLimit(`contact:ip:${ip}`, MAX_HITS, WINDOW_MS))) { res.status(429).json({ error: 'Too many requests' }); return; }

  try {
    const { name, email, phone, subject, message, website, type, typeLabel } = req.body || {};

    /* Honeypot: `website` is hidden from people and invisible to assistive
       tech, so anything in it came from a bot filling every field. Answer 200
       so the bot cannot tell it was caught and start probing around it. */
    if (website) { res.status(200).json({ ok: true }); return; }

    if (!name || !email || !phone || !message) { res.status(400).json({ error: 'Missing required fields' }); return; }

    const cleanName = sanitize(String(name)).slice(0, MAX_NAME);
    const cleanEmail = sanitize(String(email)).slice(0, MAX_EMAIL);
    const cleanPhone = sanitize(String(phone)).slice(0, MAX_PHONE);
    const cleanSubject = sanitize(String(subject || '')).slice(0, MAX_SUBJECT);
    const cleanMessage = sanitize(String(message)).slice(0, MAX_MESSAGE);
    /* a recognized request type from our own list only — anything else is
       treated as a general message; the label is display-only and escaped */
    const cleanType = ALLOWED_TYPES.includes(String(type || 'general')) ? String(type) : 'general';
    const cleanTypeLabel = cleanType !== 'general' ? sanitize(String(typeLabel || '')).slice(0, 60) : '';

    if (!cleanName || !cleanEmail || !cleanPhone || !cleanMessage) { res.status(400).json({ error: 'Missing required fields' }); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) { res.status(400).json({ error: 'Invalid email' }); return; }
    if (!validPhone(cleanPhone)) { res.status(400).json({ error: 'Invalid phone' }); return; }

    /* checked after validation so the key is always a well-formed address */
    if (!(await rateLimit(`contact:email:${cleanEmail.toLowerCase()}`, MAX_EMAIL_HITS, EMAIL_WINDOW_MS))) { res.status(429).json({ error: 'Too many requests' }); return; }

    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.CONTACT_TO_EMAIL;
    const from = process.env.CONTACT_FROM_EMAIL || 'Dr. Seynudé Dagnon <admin@seynudedagnon.com>';
    if (!apiKey || !to) { res.status(500).json({ error: 'Email service not configured' }); return; }

    const subjectLine = `Website contact — ${cleanTypeLabel ? `[${cleanTypeLabel}] ` : ''}${cleanSubject || cleanName}`;

    // 1) admin notification
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from, to: [to], reply_to: cleanEmail,
        subject: subjectLine,
        html: adminHtml(cleanName, cleanEmail, cleanPhone, cleanSubject, cleanMessage, cleanTypeLabel),
        text: `New message from ${cleanName} <${cleanEmail}>\nPhone: ${cleanPhone}${cleanTypeLabel ? `\nRequest type: ${cleanTypeLabel}` : ''}${cleanSubject ? `\nSubject: ${cleanSubject}` : ''}\n\n${cleanMessage}`,
      }),
    });
    if (!r.ok) { const err = await r.text(); console.error('Resend error', err); await alertOwner('contact form', `Resend refused the send: ${err}`); res.status(500).json({ error: 'Failed to send' }); return; }

    // 2) auto-reply
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from, to: [cleanEmail],
          subject: `Thank you for contacting Dr. Dagnon — ${cleanSubject || 'Your message'}`,
          html: autoReplyHtml(cleanName, cleanSubject),
          text: `Dear ${cleanName},\n\nThank you for reaching out. I have received your message and will get back to you as soon as possible.\n\nBest regards,\nDr. Seynudé Jean-Fortuné Dagnon\nPublic Health & Malaria Program Leader\nhttps://seynudedagnon.com`,
        }),
      });
    } catch (e) { console.error('Auto-reply failed (non-blocking)', e); }

    res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    await alertOwner('contact form', `unexpected error: ${e instanceof Error ? e.message : String(e)}`);
    res.status(500).json({ error: 'Server error' });
  }
}

/* ── verify-phone (/api/verify-phone) ─────────────────────────────

   The phone number lives here, never in the client bundle. It is only
   ever returned by a `verify` call carrying a valid code. It comes
   solely from CONTACT_PHONE — deliberately no hardcoded default, so
   the number can change (or be withheld) without a code deploy.

   Serverless instances do not share memory, so a code kept in a Map is
   unreachable from the instance that handles the follow-up `verify`
   call. Instead the server hands the client an opaque token holding
   the email, the expiry and an HMAC of the code — keyed by a
   server-only secret, so it can be validated anywhere and reveals
   nothing about the code itself. */

function verifyHtml(code: string): string {
  return wrap(hdr('Your verification code') + `<tr><td style="padding:28px 32px"><p style="margin:0;font-size:14px;line-height:1.7;color:${C.ink}">Use the code below to verify your identity and view the phone number on the contact page.</p><table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0"><tr><td align="center" style="padding:18px;background:${C.ivory};border-radius:12px;border:2px dashed ${C.gold500}"><p style="margin:0;font-size:32px;font-weight:700;letter-spacing:.25em;color:${C.pine950};font-family:'Courier New',monospace">${esc(code)}</p></td></tr></table><p style="margin:0;font-size:13px;color:${C.muted};text-align:center">This code expires in <strong>5 minutes</strong>.</p><p style="margin:14px 0 0;font-size:12px;color:${C.muted};text-align:center">If you didn't request this code, please ignore this email.</p></td></tr>` + ftr());
}

/* Dedicated secret mandatory in production — see the identical guard in
   _tokens.ts. The Resend fallback exists for local dev and previews only. */
const VERIFY_SECRET =
  process.env.VERIFY_SECRET ||
  (process.env.VERCEL_ENV === 'production' ? '' : process.env.RESEND_API_KEY || '');
const CODE_TTL_MS = 5 * 60 * 1000;
/* 31^10 ≈ 8.2e14 combinations — ambiguous glyphs (0/O/1/I/L) removed. The
   code lives in an HMAC the client cannot evaluate offline, but the only
   other throttle on an online guess is per-IP and per-token counting, so the
   code itself must carry the entropy: 2^49.5 makes even an unlimited-rate
   brute force impractical (2^49.5 / 1000 req/s ≈ 17 years). */
const CODE_ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
const CODE_LENGTH = 10;
const PHONE = process.env.CONTACT_PHONE;

function generateCode(): string {
  return Array.from({ length: CODE_LENGTH }, () => CODE_ALPHABET[crypto.randomInt(CODE_ALPHABET.length)]).join('');
}

const b64url = (b: Buffer) => b.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const verifyHmac = (data: string) => b64url(crypto.createHmac('sha256', VERIFY_SECRET).update(data).digest());

function verifySafeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

function issueVerifyToken(email: string, code: string): string {
  const exp = Date.now() + CODE_TTL_MS;
  const payload = b64url(Buffer.from(JSON.stringify({ e: email, x: exp, h: verifyHmac(`${code}|${email}|${exp}`) })));
  return `${payload}.${verifyHmac(payload)}`;
}

function checkVerifyToken(token: string, email: string, code: string): 'ok' | 'expired' | 'invalid' {
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return 'invalid';
  if (!verifySafeEqual(sig, verifyHmac(payload))) return 'invalid';
  let data: { e?: string; x?: number; h?: string };
  try {
    data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'));
  } catch {
    return 'invalid';
  }
  if (!data.e || !data.x || !data.h) return 'invalid';
  if (data.e !== email) return 'invalid';
  if (Date.now() > data.x) return 'expired';
  return verifySafeEqual(data.h, verifyHmac(`${code}|${email}|${data.x}`)) ? 'ok' : 'invalid';
}

const VERIFY_WINDOW_MS = 10 * 60 * 1000;
const VERIFY_LIMITS = { sendIp: 5, sendEmail: 3, verifyIp: 10, verifyMail: 10 };
/* how many guesses one token may carry — each token is only ever delivered
   to one person, so a tight budget per token is the whole brute-force stop */
const MAX_VERIFY_ATTEMPTS = 5;

async function verifyHandler(req: Req, res: Res): Promise<void> {
  applyJsonHeaders(res);
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }
  if (!originAllowed(req.headers)) { res.status(403).json({ error: 'Forbidden' }); return; }
  if (!VERIFY_SECRET) { res.status(500).json({ error: 'Verification not configured' }); return; }
  if (!PHONE) { res.status(500).json({ error: 'Phone not configured' }); return; }

  const ip = clientIp(req.headers, req.socket?.remoteAddress);
  if (!ip) { res.status(403).json({ error: 'Forbidden' }); return; }
  const { action, email, code, token } = req.body || {};
  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { res.status(400).json({ error: 'Invalid email' }); return; }
  const cleanEmail = email.toLowerCase().trim().slice(0, 254);

  if (action === 'send') {
    const withinIpLimit = await rateLimit(`verify:send:ip:${ip}`, VERIFY_LIMITS.sendIp, VERIFY_WINDOW_MS);
    const withinEmailLimit = await rateLimit(`verify:send:mail:${cleanEmail}`, VERIFY_LIMITS.sendEmail, VERIFY_WINDOW_MS);
    if (!withinIpLimit || !withinEmailLimit) {
      res.status(429).json({ error: 'Too many requests' });
      return;
    }
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.CONTACT_FROM_EMAIL || 'Dr. Seynudé Dagnon <admin@seynudedagnon.com>';
    if (!apiKey) { res.status(500).json({ error: 'Email service not configured' }); return; }
    const verificationCode = generateCode();
    try {
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from, to: [cleanEmail], subject: 'Your verification code — Seynudé Dagnon',
          html: verifyHtml(verificationCode),
          text: `Your verification code is: ${verificationCode}\n\nThis code expires in 5 minutes.\n\nIf you didn't request this code, please ignore this email.`,
        }),
      });
      if (!r.ok) { const err = await r.text(); console.error('Resend verify error', err); res.status(500).json({ error: 'Failed to send code' }); return; }
      res.status(200).json({ ok: true, token: issueVerifyToken(cleanEmail, verificationCode) });
    } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }
    return;
  }

  if (action === 'verify') {
    if (!(await rateLimit(`verify:check:ip:${ip}`, VERIFY_LIMITS.verifyIp, VERIFY_WINDOW_MS))) { res.status(429).json({ error: 'Too many requests' }); return; }
    if (!(await rateLimit(`verify:check:mail:${cleanEmail}`, VERIFY_LIMITS.verifyMail, VERIFY_WINDOW_MS))) { res.status(429).json({ error: 'Too many requests' }); return; }
    if (!code || typeof code !== 'string' || !token || typeof token !== 'string') { res.status(400).json({ error: 'Missing code' }); return; }
    /* per-token guess budget: the token itself is the only thing a guesser
       can hold onto (tokens are minted only by `send`, which is limited per
       IP and per address), so the counter window matches the token lifetime */
    const tokenKey = crypto.createHash('sha256').update(token).digest('hex');
    if (!(await rateLimit(`verify:check:tok:${tokenKey}`, MAX_VERIFY_ATTEMPTS, CODE_TTL_MS))) { res.status(429).json({ error: 'Too many attempts' }); return; }
    const cleanCode = code.trim().toUpperCase().slice(0, CODE_LENGTH);
    const result = checkVerifyToken(token, cleanEmail, cleanCode);
    if (result === 'expired') { res.status(400).json({ error: 'Code expired' }); return; }
    if (result !== 'ok') { res.status(400).json({ error: 'Invalid code' }); return; }
    res.status(200).json({ ok: true, phone: PHONE });
    return;
  }

  res.status(400).json({ error: 'Invalid action' });
}

export default async function handler(req: Req, res: Res) {
  /* Vercel preserves the original URL through the rewrite, so the path
     picks the right half of this function. Everything else is the form. */
  const path = new URL(req.url || '/', SITE_URL).pathname;
  if (path === '/api/verify-phone' || path.endsWith('/verify-phone')) {
    await verifyHandler(req, res);
    return;
  }
  await contactHandler(req, res);
}
