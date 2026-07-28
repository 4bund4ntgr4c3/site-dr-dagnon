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

function adminHtml(name: string, email: string, subject: string, message: string): string {
  const subCard = subject ? `<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px"><tr><td style="padding:10px 14px;background:${C.ivory};border-radius:8px;border-left:3px solid ${C.gold500}"><p style="margin:0;font-size:11px;font-weight:600;color:${C.muted};text-transform:uppercase;letter-spacing:.08em">Subject</p><p style="margin:2px 0 0;font-size:14px;font-weight:600;color:${C.ink}">${subject}</p></td></tr></table>` : '';
  return wrap(hdr('New message received') + `<tr><td style="padding:28px 32px"><table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px"><tr><td style="padding:10px 14px;background:${C.ivory};border-radius:8px;border-left:3px solid ${C.gold500}"><p style="margin:0;font-size:11px;font-weight:600;color:${C.muted};text-transform:uppercase;letter-spacing:.08em">From</p><p style="margin:2px 0 0;font-size:14px;font-weight:600;color:${C.ink}">${name}</p><p style="margin:2px 0 0;font-size:13px;color:${C.muted}">${email}</p></td></tr></table>${subCard}<table width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding:14px;background:${C.ivory};border-radius:8px"><p style="margin:0;font-size:11px;font-weight:600;color:${C.muted};text-transform:uppercase;letter-spacing:.08em">Message</p><p style="margin:6px 0 0;font-size:14px;line-height:1.65;color:${C.ink};white-space:pre-wrap">${message}</p></td></tr></table><table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px"><tr><td align="center"><a href="mailto:${email}?subject=Re:%20${encodeURIComponent(subject || 'Your message')}" style="display:inline-block;background:${C.gold500};color:${C.pine950};font-size:13px;font-weight:600;padding:12px 28px;border-radius:999px;text-decoration:none">Reply to ${name}</a></td></tr></table></td></tr>` + ftr());
}

function autoReplyHtml(name: string, subject: string): string {
  return wrap(hdr('Thank you for your message') + `<tr><td style="padding:28px 32px"><p style="margin:0;font-size:14px;line-height:1.7;color:${C.ink}">Dear <strong>${name}</strong>,</p><p style="margin:14px 0 0;font-size:14px;line-height:1.7;color:${C.ink}">Thank you for reaching out. I have received your message${subject ? ` regarding <strong>"${subject}"</strong>` : ''} and will get back to you as soon as possible.</p><p style="margin:14px 0 0;font-size:14px;line-height:1.7;color:${C.ink}">In the meantime, feel free to explore my work:</p><table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0"><tr><td align="center" style="padding:4px"><a href="${SITE_URL}/publications" style="display:inline-block;background:${C.pine950};color:${C.gold400};font-size:12px;font-weight:600;padding:10px 22px;border-radius:999px;text-decoration:none;letter-spacing:.03em">Publications</a></td><td align="center" style="padding:4px"><a href="${SITE_URL}/media" style="display:inline-block;background:${C.pine950};color:${C.gold400};font-size:12px;font-weight:600;padding:10px 22px;border-radius:999px;text-decoration:none;letter-spacing:.03em">Media</a></td></tr></table><p style="margin:18px 0 0;font-size:14px;line-height:1.7;color:${C.ink}">Best regards,<br><strong>Dr. Seynudé Jean-Fortuné Dagnon</strong><br><span style="font-size:13px;color:${C.muted}">Public Health &amp; Malaria Program Leader</span></p></td></tr>` + ftr());
}

function verifyHtml(code: string): string {
  return wrap(hdr('Your verification code') + `<tr><td style="padding:28px 32px"><p style="margin:0;font-size:14px;line-height:1.7;color:${C.ink}">Use the code below to verify your identity and view the phone number on the contact page.</p><table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0"><tr><td align="center" style="padding:18px;background:${C.ivory};border-radius:12px;border:2px dashed ${C.gold500}"><p style="margin:0;font-size:32px;font-weight:700;letter-spacing:.25em;color:${C.pine950};font-family:'Courier New',monospace">${code}</p></td></tr></table><p style="margin:0;font-size:13px;color:${C.muted};text-align:center">This code expires in <strong>5 minutes</strong>.</p><p style="margin:14px 0 0;font-size:12px;color:${C.muted};text-align:center">If you didn't request this code, please ignore this email.</p></td></tr>` + ftr());
}

/* ── Contact handler ───────────────────────────────────────────── */

const MAX_NAME = 200;
const MAX_EMAIL = 254;
const MAX_SUBJECT = 500;
const MAX_MESSAGE = 5000;
const sanitize = (s: string) => s.replace(/[\r\n\t]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, MAX_MESSAGE);

const ipHits = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_HITS = 5;
function rateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipHits.get(ip);
  if (!entry || now > entry.resetAt) { ipHits.set(ip, { count: 1, resetAt: now + WINDOW_MS }); return true; }
  entry.count++;
  return entry.count <= MAX_HITS;
}

interface Req { method: string; headers: Record<string, string | string[] | undefined>; socket?: { remoteAddress?: string }; body?: { name?: string; email?: string; subject?: string; message?: string } }
interface Res { status(c: number): Res; json(d: unknown): void }

export default async function handler(req: Req, res: Res) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

  const ip = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').toString().split(',')[0].trim();
  if (!rateLimit(ip)) { res.status(429).json({ error: 'Too many requests' }); return; }

  try {
    const { name, email, subject, message } = req.body || {};
    if (!name || !email || !message) { res.status(400).json({ error: 'Missing required fields' }); return; }

    const cleanName = sanitize(String(name)).slice(0, MAX_NAME);
    const cleanEmail = sanitize(String(email)).slice(0, MAX_EMAIL);
    const cleanSubject = sanitize(String(subject || '')).slice(0, MAX_SUBJECT);
    const cleanMessage = sanitize(String(message)).slice(0, MAX_MESSAGE);

    if (!cleanName || !cleanEmail || !cleanMessage) { res.status(400).json({ error: 'Missing required fields' }); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) { res.status(400).json({ error: 'Invalid email' }); return; }

    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.CONTACT_TO_EMAIL;
    const from = process.env.CONTACT_FROM_EMAIL || 'Portfolio <admin@seynudedagnon.com>';
    if (!apiKey || !to) { res.status(500).json({ error: 'Email service not configured' }); return; }

    // 1) admin notification
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from, to: [to], reply_to: cleanEmail,
        subject: `Website contact — ${cleanSubject || cleanName}`,
        html: adminHtml(cleanName, cleanEmail, cleanSubject, cleanMessage),
        text: `New message from ${cleanName} <${cleanEmail}>${cleanSubject ? `\nSubject: ${cleanSubject}` : ''}\n\n${cleanMessage}`,
      }),
    });
    if (!r.ok) { const err = await r.text(); console.error('Resend error', err); res.status(500).json({ error: 'Failed to send' }); return; }

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
    res.status(500).json({ error: 'Server error' });
  }
}
