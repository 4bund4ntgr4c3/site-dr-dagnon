import { AGENDA_ITEMS } from '../src/data/agenda.js';
import { daysUntil } from '../src/lib/calendar-links.js';
import { rateLimit } from './_rate-limit.js';
import { originAllowed } from './_origin.js';
import { clientIp } from './_ip.js';
import { checkToken } from './_tokens.js';
import { applyJsonHeaders, applyPageHeaders } from './_headers.js';

/* Per-event reminder opt-in — the "Me rappeler / Remind me" button on the
 * agenda page. A visitor picks an event and leaves an email; the address is
 * stored in a per-event set (`event:remind:<eventId>`), and the daily cron
 * (api/event-reminders.ts) mails each opted-in subscriber a reminder with
 * calendar links when the event is one day away. Each stored key expires a
 * few days after the event, so the at-a-glance never grows for past events.
 *
 * Two methods:
 *   POST — subscribe (the button). Origin check, IP + email rate limits,
 *          event validation identical to the agenda page's own rules.
 *   GET  — unsubscribe a single event, bound to the address by a token of
 *          purpose 'ev-remind' (see _tokens.ts). Serves a plain HTML page
 *          like the newsletter unsubscribe, and removes the address from
 *          that event's set only — other reminders the reader set stay.
 *
 * Template helpers are inline copies of the ones in newsletter.ts /
 * newsletter-confirm.ts — see the comment atop _rate-limit.ts. */

const SITE_URL = 'https://seynudedagnon.com';
const MAX_EMAIL = 254;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const IP_WINDOW_MS = 10 * 60_000;
const MAX_IP_HITS = 5;
const EMAIL_WINDOW_MS = 60 * 60_000;
const MAX_EMAIL_HITS = 5;

const C = { pine950: '#0c2e2a', pine900: '#133e38', gold500: '#c9a24b', gold400: '#d4b36a', ivory: '#faf8f4', white: '#ffffff', ink: '#3a3a3a', muted: '#6b7280' };
const ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ESCAPES[c]);

/** validation shared by method synchronously — an event that isn't one of
 *  the site's, or that is already past, is refused before any store write.
 *  `items` is injectable for the unit tests, like run() in the cron handler.
 *  `from` defaults to now — inject a stable date in tests. */
export function parseEventId(raw: string, { items = AGENDA_ITEMS, from = new Date() }: { items?: { id: string; date: string }[]; from?: Date } = {}): string | null {
  if (!raw) return null;
  const event = items.find((e) => e.id === raw);
  if (!event) return null;
  if (daysUntil(event.date, from) < 0) return null;
  return event.id;
}

function kv() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ''), token } : null;
}

async function store(email: string, eventId: string): Promise<boolean> {
  const store = kv();
  if (!store) return false;
  /* the key dies a few days after the event, so the store can't accumulate
     past-event reminders forever */
  const event = AGENDA_ITEMS.find((e) => e.id === eventId);
  const ttlDays = event ? Math.max(daysUntil(event.date) + 3, 1) : 7;
  try {
    const response = await fetch(`${store.url}/pipeline`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${store.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify([
        ['SADD', `event:remind:${eventId}`, email],
        ['EXPIRE', `event:remind:${eventId}`, String(ttlDays * 86400)],
      ]),
    });
    if (!response.ok) return false;
    const results = (await response.json()) as { result?: unknown }[];
    return Number(results?.[0]?.result) > 0;
  } catch {
    return false;
  }
}

async function remove(email: string, eventId: string): Promise<boolean> {
  const store = kv();
  if (!store) return false;
  try {
    const response = await fetch(`${store.url}/pipeline`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${store.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify([['SREM', `event:remind:${eventId}`, email]]),
    });
    if (!response.ok) return false;
    const results = (await response.json()) as { result?: unknown }[];
    return Number(results?.[0]?.result) >= 0;
  } catch {
    return false;
  }
}

function page(title: string, body: string): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"></head><body style="margin:0;padding:0;background:${C.ivory};font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif"><table width="100%" cellpadding="0" cellspacing="0" style="background:${C.ivory};padding:32px 16px"><tr><td align="center"><table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:${C.white};border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(12,46,42,.08)"><tr><td style="background:${C.pine950};padding:28px 32px"><p style="margin:0;font-size:13px;font-weight:600;letter-spacing:.12em;color:${C.gold400};text-transform:uppercase">Dr. Seynudé Dagnon</p><h1 style="margin:6px 0 0;font-size:20px;font-weight:600;color:${C.white};line-height:1.3">${esc(title)}</h1></td></tr><tr><td style="padding:28px 32px"><p style="margin:0;font-size:14px;line-height:1.7;color:${C.ink}">${body}</p><table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0 0"><tr><td align="center"><a href="${SITE_URL}/agenda" style="display:inline-block;background:${C.gold500};color:${C.pine950};font-size:13px;font-weight:600;padding:12px 28px;border-radius:999px;text-decoration:none">Agenda</a></td></tr></table></td></tr></table></td></tr></table></body></html>`;
}

interface Req { method: string; url?: string; headers: Record<string, string | string[] | undefined>; socket?: { remoteAddress?: string }; body?: { email?: string; eventId?: string } }
interface Res { status(c: number): Res; send(d: string): void; json(d: unknown): void; setHeader(k: string, v: string): void }

export default async function handler(req: Req, res: Res) {
  if (req.method === 'GET') {
    applyPageHeaders(res);
    const params = new URL(req.url || '/', SITE_URL).searchParams;
    const eventId = params.get('event') || '';
    const rawEmail = params.get('email') || '';
    const token = params.get('token') || '';
    const email = rawEmail.trim().slice(0, MAX_EMAIL).toLowerCase();
    if (!email || !EMAIL_RE.test(email) || !token) {
      res.status(400).send(page('Invalid link', 'This reminder link is invalid. Please use the link from the email you received.'));
      return;
    }
    const event = AGENDA_ITEMS.find((e) => e.id === eventId);
    if (!event) {
      res.status(400).send(page('Invalid link', 'This reminder link is invalid. Please use the link from the email you received.'));
      return;
    }
    if (checkToken('ev-remind', token, email) !== 'ok') {
      res.status(400).send(page('Invalid link', 'This reminder link is invalid or expired. Please use the link from the email you received.'));
      return;
    }
    await remove(email, event.id);
    res.status(200).send(page('Rappel supprimé / Reminder canceled', 'Vous ne recevrez plus de rappel pour cet événement. | You will no longer receive a reminder for this event.'));
    return;
  }

  applyJsonHeaders(res);
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }
  if (!originAllowed(req.headers)) { res.status(403).json({ error: 'Forbidden' }); return; }

  const ip = clientIp(req.headers, req.socket?.remoteAddress);
  if (!ip) { res.status(403).json({ error: 'Forbidden' }); return; }
  if (!(await rateLimit(`event-remind:ip:${ip}`, MAX_IP_HITS, IP_WINDOW_MS))) { res.status(429).json({ error: 'Too many requests' }); return; }

  try {
    const { eventId, email } = req.body || {};
    const event = parseEventId(eventId || '');
    if (!event) { res.status(400).json({ error: 'Invalid event' }); return; }

    const cleanEmail = (email || '').replace(/[\r\n\t]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, MAX_EMAIL).toLowerCase();
    if (!cleanEmail || !EMAIL_RE.test(cleanEmail)) { res.status(400).json({ error: 'Invalid email' }); return; }
    if (!(await rateLimit(`event-remind:email:${cleanEmail}`, MAX_EMAIL_HITS, EMAIL_WINDOW_MS))) { res.status(429).json({ error: 'Too many requests' }); return; }

    await store(cleanEmail, event);
    /* the near events pages is the endpoint failure budget — a store that
       drops the record still answers ok, the button is a low-stakes opt-in */
    res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
}