import { checkToken } from './_tokens.js';

/* One-click unsubscribe endpoint — the link in the footer of every
 * newsletter digest and agenda reminder email. Each recipient gets a
 * personalized link carrying a stateless token bound to their own address
 * (see _tokens.ts), so it can only ever unsubscribe that address, and it
 * stops working after 90 days.
 *
 * The address is removed from the subscriber set; the pending key and the
 * per-language key are cleared too, so a stale confirmation link cannot
 * resurrect the subscription and no language preference lingers after
 * opting out. The page is served regardless of KV being up: the token
 * itself is the proof of intent. */

const SITE_URL = 'https://seynudedagnon.com';
const C = { pine950: '#0c2e2a', pine900: '#133e38', gold500: '#c9a24b', gold400: '#d4b36a', ivory: '#faf8f4', white: '#ffffff', ink: '#3a3a3a', muted: '#6b7280' };
const ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ESCAPES[c]);

function page(title: string, body: string): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"></head><body style="margin:0;padding:0;background:${C.ivory};font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif"><table width="100%" cellpadding="0" cellspacing="0" style="background:${C.ivory};padding:32px 16px"><tr><td align="center"><table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:${C.white};border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(12,46,42,.08)"><tr><td style="background:${C.pine950};padding:28px 32px"><p style="margin:0;font-size:13px;font-weight:600;letter-spacing:.12em;color:${C.gold400};text-transform:uppercase">Dr. Seynudé Dagnon</p><h1 style="margin:6px 0 0;font-size:20px;font-weight:600;color:${C.white};line-height:1.3">${esc(title)}</h1></td></tr><tr><td style="padding:28px 32px"><p style="margin:0;font-size:14px;line-height:1.7;color:${C.ink}">${body}</p><table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0 0"><tr><td align="center"><a href="${SITE_URL}" style="display:inline-block;background:${C.gold500};color:${C.pine950};font-size:13px;font-weight:600;padding:12px 28px;border-radius:999px;text-decoration:none">seynudedagnon.com</a></td></tr></table></td></tr></table></td></tr></table></body></html>`;
}

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
      ]),
    });
    if (!response.ok) return false;
    const results = (await response.json()) as { result?: unknown }[];
    return results?.[0]?.result !== undefined;
  } catch {
    return false;
  }
}

const MAX_EMAIL = 254;

interface Req { method: string; url?: string; headers: Record<string, string | string[] | undefined> }
interface Res { status(c: number): Res; send(d: string): void; json(d: unknown): void }

export default async function handler(req: Req, res: Res) {
  if (req.method !== 'GET') { res.status(405).json({ error: 'Method not allowed' }); return; }

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
    await removeSubscriber(cleanEmail);
    res.status(200).send(page(
      'Unsubscribed',
      'You have been unsubscribed from the newsletter of Dr. Seynudé Dagnon. You will no longer receive the digest or event reminders. If this was a mistake, you can subscribe again at any time.',
    ));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
}
