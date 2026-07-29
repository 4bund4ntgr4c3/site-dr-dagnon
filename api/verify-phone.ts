import crypto from 'node:crypto';
import { rateLimit } from './_rate-limit.js';
import { originAllowed } from './_origin.js';

/* ── Shared email template helpers ──────────────────────────────── */

const SITE_URL = 'https://seynudedagnon.com';
const C = { pine950: '#0c2e2a', pine900: '#133e38', gold500: '#c9a24b', gold400: '#d4b36a', ivory: '#faf8f4', white: '#ffffff', ink: '#3a3a3a', muted: '#6b7280' };

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

function verifyHtml(code: string): string {
  return wrap(hdr('Your verification code') + `<tr><td style="padding:28px 32px"><p style="margin:0;font-size:14px;line-height:1.7;color:${C.ink}">Use the code below to verify your identity and view the phone number on the contact page.</p><table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0"><tr><td align="center" style="padding:18px;background:${C.ivory};border-radius:12px;border:2px dashed ${C.gold500}"><p style="margin:0;font-size:32px;font-weight:700;letter-spacing:.25em;color:${C.pine950};font-family:'Courier New',monospace">${esc(code)}</p></td></tr></table><p style="margin:0;font-size:13px;color:${C.muted};text-align:center">This code expires in <strong>5 minutes</strong>.</p><p style="margin:14px 0 0;font-size:12px;color:${C.muted};text-align:center">If you didn't request this code, please ignore this email.</p></td></tr>` + ftr());
}

/* ── Protected data ─────────────────────────────────────────────
   The phone number lives here, never in the client bundle. It is
   only ever returned by a `verify` call carrying a valid code.     */

const PHONE = process.env.CONTACT_PHONE || '+229 01 66 99 32 47 - +221 77 385 60 89';

/* ── Stateless verification tokens ──────────────────────────────
   Serverless instances do not share memory, so a code kept in a
   Map is unreachable from the instance that handles the follow-up
   `verify` call. Instead the server hands the client an opaque
   token holding the email, the expiry and an HMAC of the code —
   keyed by a server-only secret, so it can be validated anywhere
   and reveals nothing about the code itself.                       */

const SECRET = process.env.VERIFY_SECRET || process.env.RESEND_API_KEY || '';
const CODE_TTL_MS = 5 * 60 * 1000;
/* 31^6 ≈ 8.9e8 combinations, ambiguous glyphs (0/O/1/I/L) removed. */
const CODE_ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
const CODE_LENGTH = 6;

function generateCode(): string {
  return Array.from({ length: CODE_LENGTH }, () => CODE_ALPHABET[crypto.randomInt(CODE_ALPHABET.length)]).join('');
}

const b64url = (b: Buffer) => b.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const hmac = (data: string) => b64url(crypto.createHmac('sha256', SECRET).update(data).digest());

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

function issueToken(email: string, code: string): string {
  const exp = Date.now() + CODE_TTL_MS;
  const payload = b64url(Buffer.from(JSON.stringify({ e: email, x: exp, h: hmac(`${code}|${email}|${exp}`) })));
  return `${payload}.${hmac(payload)}`;
}

function checkToken(token: string, email: string, code: string): 'ok' | 'expired' | 'invalid' {
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return 'invalid';
  if (!safeEqual(sig, hmac(payload))) return 'invalid';
  let data: { e?: string; x?: number; h?: string };
  try {
    data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'));
  } catch {
    return 'invalid';
  }
  if (!data.e || !data.x || !data.h) return 'invalid';
  if (data.e !== email) return 'invalid';
  if (Date.now() > data.x) return 'expired';
  return safeEqual(data.h, hmac(`${code}|${email}|${data.x}`)) ? 'ok' : 'invalid';
}

const WINDOW_MS = 10 * 60 * 1000;
const LIMITS = { sendIp: 5, sendEmail: 3, verifyIp: 10 };

/* ── Verify handler ────────────────────────────────────────────── */

interface Req { method: string; headers: Record<string, string | string[] | undefined>; socket?: { remoteAddress?: string }; body?: { action?: string; email?: string; code?: string; token?: string } }
interface Res { status(c: number): Res; json(d: unknown): void }

export default async function handler(req: Req, res: Res) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }
  if (!originAllowed(req.headers)) { res.status(403).json({ error: 'Forbidden' }); return; }
  if (!SECRET) { res.status(500).json({ error: 'Verification not configured' }); return; }

  const ip = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').toString().split(',')[0].trim();
  const { action, email, code, token } = req.body || {};
  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { res.status(400).json({ error: 'Invalid email' }); return; }
  const cleanEmail = email.toLowerCase().trim().slice(0, 254);

  if (action === 'send') {
    const withinIpLimit = await rateLimit(`verify:send:ip:${ip}`, LIMITS.sendIp, WINDOW_MS);
    const withinEmailLimit = await rateLimit(`verify:send:mail:${cleanEmail}`, LIMITS.sendEmail, WINDOW_MS);
    if (!withinIpLimit || !withinEmailLimit) {
      res.status(429).json({ error: 'Too many requests' });
      return;
    }
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.CONTACT_FROM_EMAIL || 'Portfolio <admin@seynudedagnon.com>';
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
      res.status(200).json({ ok: true, token: issueToken(cleanEmail, verificationCode) });
    } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }
    return;
  }

  if (action === 'verify') {
    if (!(await rateLimit(`verify:check:ip:${ip}`, LIMITS.verifyIp, WINDOW_MS))) { res.status(429).json({ error: 'Too many requests' }); return; }
    if (!code || typeof code !== 'string' || !token || typeof token !== 'string') { res.status(400).json({ error: 'Missing code' }); return; }
    const cleanCode = code.trim().toUpperCase().slice(0, CODE_LENGTH);
    const result = checkToken(token, cleanEmail, cleanCode);
    if (result === 'expired') { res.status(400).json({ error: 'Code expired' }); return; }
    if (result !== 'ok') { res.status(400).json({ error: 'Invalid code' }); return; }
    res.status(200).json({ ok: true, phone: PHONE });
    return;
  }

  res.status(400).json({ error: 'Invalid action' });
}
