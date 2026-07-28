/* ── Shared email template helpers ──────────────────────────────── */

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

function verifyHtml(code: string): string {
  return wrap(hdr('Your verification code') + `<tr><td style="padding:28px 32px"><p style="margin:0;font-size:14px;line-height:1.7;color:${C.ink}">Use the code below to verify your identity and view the phone number on the contact page.</p><table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0"><tr><td align="center" style="padding:18px;background:${C.ivory};border-radius:12px;border:2px dashed ${C.gold500}"><p style="margin:0;font-size:32px;font-weight:700;letter-spacing:.25em;color:${C.pine950};font-family:'Courier New',monospace">${code}</p></td></tr></table><p style="margin:0;font-size:13px;color:${C.muted};text-align:center">This code expires in <strong>5 minutes</strong>.</p><p style="margin:14px 0 0;font-size:12px;color:${C.muted};text-align:center">If you didn't request this code, please ignore this email.</p></td></tr>` + ftr());
}

/* ── Verify handler ────────────────────────────────────────────── */

const codeStore = new Map<string, { code: string; expiresAt: number }>();
const CODE_TTL_MS = 5 * 60 * 1000;
const CODE_LENGTH = 6;
function generateCode(): string { return Array.from({ length: CODE_LENGTH }, () => Math.floor(Math.random() * 10)).join(''); }
function cleanup() { const now = Date.now(); for (const [k, v] of codeStore) { if (now > v.expiresAt) codeStore.delete(k); } }

interface Req { method: string; headers: Record<string, string | string[] | undefined>; body?: { action?: string; email?: string; code?: string } }
interface Res { status(c: number): Res; json(d: unknown): void }

export default async function handler(req: Req, res: Res) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }
  const { action, email, code } = req.body || {};
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) { res.status(400).json({ error: 'Invalid email' }); return; }
  const cleanEmail = String(email).toLowerCase().trim();

  if (action === 'send') {
    cleanup();
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.CONTACT_FROM_EMAIL || 'Portfolio <admin@seynudedagnon.com>';
    if (!apiKey) { res.status(500).json({ error: 'Email service not configured' }); return; }
    const verificationCode = generateCode();
    codeStore.set(cleanEmail, { code: verificationCode, expiresAt: Date.now() + CODE_TTL_MS });
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
      res.status(200).json({ ok: true });
    } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }
    return;
  }

  if (action === 'verify') {
    cleanup();
    if (!code || typeof code !== 'string') { res.status(400).json({ error: 'Missing code' }); return; }
    const entry = codeStore.get(cleanEmail);
    if (!entry) { res.status(400).json({ error: 'No code requested' }); return; }
    if (Date.now() > entry.expiresAt) { codeStore.delete(cleanEmail); res.status(400).json({ error: 'Code expired' }); return; }
    if (entry.code !== code.trim()) { res.status(400).json({ error: 'Invalid code' }); return; }
    codeStore.delete(cleanEmail);
    res.status(200).json({ ok: true });
    return;
  }

  res.status(400).json({ error: 'Invalid action' });
}
