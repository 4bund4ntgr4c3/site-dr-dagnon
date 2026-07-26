/* eslint-disable @typescript-eslint/no-explicit-any */

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
  if (!entry || now > entry.resetAt) {
    ipHits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  entry.count++;
  return entry.count <= MAX_HITS;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const ip = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
  if (!rateLimit(ip)) {
    res.status(429).json({ error: 'Too many requests' });
    return;
  }

  try {
    const { name, email, subject, message } = req.body || {};
    if (!name || !email || !message) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const cleanName = sanitize(String(name)).slice(0, MAX_NAME);
    const cleanEmail = sanitize(String(email)).slice(0, MAX_EMAIL);
    const cleanSubject = sanitize(String(subject || '')).slice(0, MAX_SUBJECT);
    const cleanMessage = sanitize(String(message)).slice(0, MAX_MESSAGE);

    if (!cleanName || !cleanEmail || !cleanMessage) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      res.status(400).json({ error: 'Invalid email' });
      return;
    }

    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.CONTACT_TO_EMAIL;
    const from = process.env.CONTACT_FROM_EMAIL || 'Portfolio <admin@seynudedagnon.com>';
    if (!apiKey || !to) {
      res.status(500).json({ error: 'Email service not configured' });
      return;
    }
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: cleanEmail,
        subject: `Portfolio contact — ${cleanSubject || cleanName}`,
        text: `New message from ${cleanName} <${cleanEmail}>:\n\n${cleanMessage}`,
      }),
    });
    if (!r.ok) {
      const err = await r.text();
      console.error('Resend error', err);
      res.status(500).json({ error: 'Failed to send' });
      return;
    }
    res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
}
