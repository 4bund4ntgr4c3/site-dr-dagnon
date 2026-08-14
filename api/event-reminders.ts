import { AGENDA_ITEMS, type AgendaEntry } from '../src/data/agenda.js';
import { daysUntil, gcalUrl, outlookUrl } from '../src/lib/calendar-links.js';
import { issueToken, checkToken } from './_tokens.js';
import { alertOwner } from './_alert.js';
import { isSafePushEndpoint } from './_push-guard.js';
import { rateLimit } from './_rate-limit.js';
import { originAllowed } from './_origin.js';
import { clientIp } from './_ip.js';
import { applyJsonHeaders, applyPageHeaders } from './_headers.js';
import crypto from 'node:crypto';
import webPush from 'web-push';

/* Two endpoints in one function, so the deploy stays under the 12-function
 * Hobby limit: /api/event-remind (the "Remind me" opt-in button + the
 * one-click opt-out page) and /api/event-reminders (the daily cron that
 * mails the reminders). They are split on the request path — Vercel
 * preserves the original URL through the rewrite in vercel.json.
 *
 * The daily cron mails the per-event reminders people opted into via
 * /api/event-remind when an event is one day away. Wired in vercel.json
 * (`crons`) and guarded by the same bearer CRON_SECRET as the
 * agenda-reminders cron.
 *
 * Events are reminded exactly once per address: a per-event set
 * (`event:remind-sent:<eventId>`) holds the addresses already mailed, and
 * only the *newest* additions are sent — matching the "each event is
 * reminded exactly once" contract the weekly digest uses.
 *
 * The web push channel follows the marks of api/agenda-reminders.ts: a
 * notification fires when a reminder actually went out, dead subscriptions
 * (404/410) are dropped, and missing VAPID keys skip the channel entirely.
 *
 * Template helpers are inline copies of the ones in agenda-reminders.ts /
 * newsletter-confirm.ts — see the comment atop _rate-limit.ts. */

const SITE_URL = 'https://seynudedagnon.com';
const REMIND_KEY = 'event:remind:';
const SENT_KEY = 'event:remind-sent:';
const PUSH_KEY = 'push:subs';
const PUSH_PREFIX = 'push:sub:';

const C = { pine950: '#0c2e2a', pine900: '#133e38', gold500: '#c9a24b', gold400: '#d4b36a', ivory: '#faf8f4', white: '#ffffff', ink: '#3a3a3a', muted: '#6b7280' };
const ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ESCAPES[c]);

function wrap(body: string): string {
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;padding:0;background:${C.ivory};font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif"><table width="100%" cellpadding="0" cellspacing="0" style="background:${C.ivory};padding:32px 16px"><tr><td align="center"><table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${C.white};border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(12,46,42,.08)">${body}</table><p style="margin:20px 0 0;font-size:11px;color:${C.muted};text-align:center">Vous recevez cet email car vous avez demandé un rappel pour cet événement sur seynudedagnon.com. &middot; <a href="${SITE_URL}/agenda" style="color:${C.gold500};text-decoration:none">Agenda</a></p></td></tr></table></body></html>`;
}
function hdr(): string {
  return `<tr><td style="background:${C.pine950};padding:28px 32px"><p style="margin:0;font-size:13px;font-weight:600;letter-spacing:.12em;color:${C.gold400};text-transform:uppercase">Dr. Seynudé Dagnon</p><h1 style="margin:6px 0 0;font-size:20px;font-weight:600;color:${C.white};line-height:1.3">Rappel d'événement / Event reminder</h1></td></tr>`;
}

/** one-click removal link bound to a single address + event (see _tokens). */
function offKeyHref(email: string, event: AgendaEntry): string {
  const token = issueToken('ev-remind', email);
  if (!token) throw new Error('unable to mint reminder token — VERIFY_SECRET missing');
  return `${SITE_URL}/api/event-remind?event=${encodeURIComponent(event.id)}&email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`;
}

/* ── pure logic (unit-tested) ───────────────────────────────────── */

/** events happening exactly one day from today — the reminder's timing */
export function dueTomorrow(items: AgendaEntry[], from: Date = new Date()): (AgendaEntry & { days: number })[] {
  return items
    .map((e) => ({ ...e, days: daysUntil(e.date, from) }))
    .filter((e) => e.days === 1)
    .sort((a, b) => a.date.localeCompare(b.date));
}

/** keeps only addresses not yet mailed for the event */
export function pendingAddresses(optIns: string[], sent: string[] | null | undefined): string[] {
  const done = new Set(Array.isArray(sent) ? sent : []);
  return optIns.filter((e) => !done.has(e));
}

function eventHtml(e: AgendaEntry): string {
  const cal = { date: e.date, title: e.title.fr, description: e.description.fr, location: e.location.fr };
  return `<tr><td style="padding:28px 32px"><p style="margin:0;font-size:14px;line-height:1.7;color:${C.ink}">Bonjour, / Hello,</p><p style="margin:12px 0 0;font-size:14px;line-height:1.7;color:${C.ink}">Cet événement a lieu demain : / This event happens tomorrow:</p><table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0 0"><tr><td style="background:${C.ivory};border-radius:12px;border-left:3px solid ${C.gold500};padding:18px 20px"><p style="margin:0 0 8px;font-size:10.5px;font-weight:600;color:${C.muted};text-transform:uppercase;letter-spacing:.1em">${esc(e.date)}</p><p style="margin:0;font-size:16px;font-weight:600;line-height:1.4;color:${C.pine900}">${esc(e.title.fr)} / ${esc(e.title.en)}</p><p style="margin:6px 0 0;font-size:12.5px;color:${C.muted}">${esc(e.location.fr)} / ${esc(e.location.en)}</p><p style="margin:12px 0 0;font-size:13px;line-height:1.6;color:${C.ink}">${esc(e.description.fr)}</p><p style="margin:16px 0 0"><a href="${gcalUrl(cal)}" style="display:inline-block;background:${C.pine950};color:${C.gold400};font-size:12px;font-weight:600;padding:9px 18px;border-radius:999px;text-decoration:none;margin:0 6px 0 0">Google Agenda</a><a href="${outlookUrl(cal)}" style="display:inline-block;background:${C.pine950};color:${C.gold400};font-size:12px;font-weight:600;padding:9px 18px;border-radius:999px;text-decoration:none">Outlook</a></p></td></tr></table></td></tr>`;
}
function ftr(offHref: string): string {
  return `<tr><td style="background:${C.pine900};padding:20px 32px"><p style="margin:0;font-size:11px;color:rgba(255,255,255,.5);text-align:center">Public Health &amp; Malaria Program Leader &middot; <a href="${SITE_URL}" style="color:${C.gold400};text-decoration:none">Website</a> &middot; <a href="${offHref}" style="color:${C.gold400};text-decoration:none">Ne plus me rappeler cet événement / Stop this reminder</a></p></td></tr>`;
}

export function reminderHtml(e: AgendaEntry): string {
  return eventHtml(e);
}
export function reminderText(e: AgendaEntry): string {
  return `Hello,\nThis event happens tomorrow:\n\n${e.date} — ${e.title.fr} / ${e.title.en}\n${e.location.fr} / ${e.location.en}\n\nAgenda: ${SITE_URL}/agenda`;
}
export function subjectLine(e: AgendaEntry): string {
  return `Rappel — ${e.date} — ${e.title.fr}`;
}

/** notification payload for the web push channel; fixed tag replaces the previous one */
export function pushPayload(e: AgendaEntry): string {
  return JSON.stringify({ title: `Agenda — demain : ${e.title.fr}`, body: `${e.date} — ${e.location.fr}`, url: `${SITE_URL}/agenda`, tag: `event-remind-${e.id}` });
}

/* ── per-event opt-in (/api/event-remind) ───────────────────────── */

const MAX_EMAIL = 254;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const IP_WINDOW_MS = 10 * 60_000;
const MAX_IP_HITS = 5;
const EMAIL_WINDOW_MS = 60 * 60_000;
const MAX_EMAIL_HITS = 5;

/** validation shared by the opt-in POST — an event that isn't one of the
 *  site's, or that is already past, is refused before any store write.
 *  `items` is injectable for the unit tests, like run() in the cron.
 *  `from` defaults to now — inject a stable date in tests. */
export function parseEventId(raw: string, { items = AGENDA_ITEMS, from = new Date() }: { items?: { id: string; date: string }[]; from?: Date } = {}): string | null {
  if (!raw) return null;
  const event = items.find((e) => e.id === raw);
  if (!event) return null;
  if (daysUntil(event.date, from) < 0) return null;
  return event.id;
}

async function storeOptIn(email: string, eventId: string): Promise<boolean> {
  /* the key dies a few days after the event, so the store can't accumulate
     past-event reminders forever */
  const event = AGENDA_ITEMS.find((e) => e.id === eventId);
  const ttlDays = event ? Math.max(daysUntil(event.date) + 3, 1) : 7;
  const results = await kvPipeline([
    ['SADD', `${REMIND_KEY}${eventId}`, email],
    ['EXPIRE', `${REMIND_KEY}${eventId}`, String(ttlDays * 86400)],
  ]);
  return Number(results?.[0]?.result) > 0;
}

async function removeOptIn(email: string, eventId: string): Promise<boolean> {
  const results = await kvPipeline([['SREM', `${REMIND_KEY}${eventId}`, email]]);
  return Number(results?.[0]?.result) >= 0;
}

function page(title: string, body: string): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"></head><body style="margin:0;padding:0;background:${C.ivory};font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif"><table width="100%" cellpadding="0" cellspacing="0" style="background:${C.ivory};padding:32px 16px"><tr><td align="center"><table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:${C.white};border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(12,46,42,.08)"><tr><td style="background:${C.pine950};padding:28px 32px"><p style="margin:0;font-size:13px;font-weight:600;letter-spacing:.12em;color:${C.gold400};text-transform:uppercase">Dr. Seynudé Dagnon</p><h1 style="margin:6px 0 0;font-size:20px;font-weight:600;color:${C.white};line-height:1.3">${esc(title)}</h1></td></tr><tr><td style="padding:28px 32px"><p style="margin:0;font-size:14px;line-height:1.7;color:${C.ink}">${body}</p><table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0 0"><tr><td align="center"><a href="${SITE_URL}/agenda" style="display:inline-block;background:${C.gold500};color:${C.pine950};font-size:13px;font-weight:600;padding:12px 28px;border-radius:999px;text-decoration:none">Agenda</a></td></tr></table></td></tr></table></td></tr></table></body></html>`;
}

/** the opt-in/opt-out half of this function — the "Me rappeler / Remind
 *  me" button on the agenda page (POST) and the one-click removal page
 *  bound to a single address + event by a token (GET). */
async function remindHandler(req: Req, res: Res): Promise<void> {
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
    await removeOptIn(email, event.id);
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

    await storeOptIn(cleanEmail, event);
    /* the near events page is the endpoint failure budget — a store that
       drops the record still answers ok, the button is a low-stakes opt-in */
    res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
}

/* ── KV ─────────────────────────────────────────────────────────── */

function kvCredentials(): { url: string; token: string } | null {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ''), token } : null;
}

async function kvPipeline(commands: (string | number)[][]): Promise<{ result?: unknown }[] | null> {
  const kv = kvCredentials();
  if (!kv) return null;
  try {
    const response = await fetch(`${kv.url}/pipeline`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${kv.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(commands),
    });
    if (!response.ok) return null;
    return (await response.json()) as { result?: unknown }[];
  } catch {
    return null;
  }
}

async function loadOptIns(eventId: string): Promise<string[]> {
  const results = await kvPipeline([['SMEMBERS', `${REMIND_KEY}${eventId}`]]);
  return Array.isArray(results?.[0]?.result) ? results[0].result.filter((s) => typeof s === 'string') : [];
}
async function loadSent(eventId: string): Promise<string[]> {
  const results = await kvPipeline([['SMEMBERS', `${SENT_KEY}${eventId}`]]);
  return Array.isArray(results?.[0]?.result) ? results[0].result.filter((s) => typeof s === 'string') : [];
}
async function recordSent(eventId: string, addresses: string[]): Promise<void> {
  if (addresses.length === 0) return;
  const commands: (string | number)[][] = [['SADD', `${SENT_KEY}${eventId}`, ...addresses]];
  commands.push(['EXPIRE', `${SENT_KEY}${eventId}`, '1209600']);
  await kvPipeline(commands);
}

/* ── web push (same contract as agenda-reminders) ───────────────── */

async function sendPushNotifications(event: AgendaEntry): Promise<number> {
  const pub = process.env.VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  if (!pub || !priv) return 0;
  webPush.setVapidDetails(`mailto:${process.env.NEWSLETTER_TO_EMAIL || 'admin@seynudedagnon.com'}`, pub, priv);

  const results = await kvPipeline([['SMEMBERS', PUSH_KEY]]);
  const hashes = Array.isArray(results?.[0]?.result) ? results[0].result.filter((s) => typeof s === 'string') : [];
  const payload = pushPayload(event);
  let sent = 0;
  for (const hash of hashes) {
    const subResults = await kvPipeline([['GET', `${PUSH_PREFIX}${hash}`]]);
    const raw = subResults?.[0]?.result;
    if (typeof raw !== 'string') { await kvPipeline([['SREM', PUSH_KEY, hash], ['DEL', `${PUSH_PREFIX}${hash}`]]); continue; }
    let sub;
    try { sub = JSON.parse(raw); } catch { await kvPipeline([['SREM', PUSH_KEY, hash], ['DEL', `${PUSH_PREFIX}${hash}`]]); continue; }
    if (!sub?.endpoint || !(await isSafePushEndpoint(sub.endpoint))) { await kvPipeline([['SREM', PUSH_KEY, hash], ['DEL', `${PUSH_PREFIX}${hash}`]]); continue; }
    try { await webPush.sendNotification(sub, payload); sent++; }
    catch (e) {
      if ((e as { statusCode?: number } | null)?.statusCode === 404 || (e as { statusCode?: number } | null)?.statusCode === 410) {
        await kvPipeline([['SREM', PUSH_KEY, hash], ['DEL', `${PUSH_PREFIX}${hash}`]]);
      }
    }
  }
  return sent;
}

/* ── run ────────────────────────────────────────────────────────── */

interface RunResult { skipped?: boolean; sent?: number; recipients?: number; pushed?: number }

/** Sends every due-tomorrow event's reminder to addresses that haven't been
 *  mailed yet. Fail-closed on the same invariant as the newsletter senders:
 *  without VERIFY_SECRET no removal link can be minted, so nothing goes out
 *  with a dead link. */
export async function run({ items = AGENDA_ITEMS, from = new Date(), apiKey }: { items?: AgendaEntry[]; from?: Date; apiKey?: string }): Promise<RunResult> {
  if (!apiKey) return { skipped: true };
  if (!issueToken('ev-remind', 'guard@example.test')) {
    console.error('[event-reminders] skipped: VERIFY_SECRET is not set, reminder links would be dead');
    await alertOwner('event reminders cron', 'skipped: VERIFY_SECRET is not set, reminder links would be dead');
    return { skipped: true };
  }
  const due = dueTomorrow(items, from);
  let sentEvents = 0;
  let recipients = 0;
  let pushed = 0;
  for (const event of due) {
    const [optIns, sent] = await Promise.all([loadOptIns(event.id), loadSent(event.id)]);
    const addresses = pendingAddresses(optIns, sent);
    if (addresses.length === 0) continue;

    const sender = process.env.NEWSLETTER_FROM_EMAIL || 'Portfolio <admin@seynudedagnon.com>';
    const subject = subjectLine(event);
    for (const [i, to] of addresses.entries()) {
      const offHref = offKeyHref(to, event);
      const body: { from: string; to: string[]; subject: string; html: string; text: string } = {
        from: sender,
        to: [to],
        subject,
        html: wrap(hdr() + reminderHtml(event) + ftr(offHref)),
        text: `${reminderText(event)}\n\n—\nStop this reminder: ${offHref}`,
      };
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const err = await response.text();
        throw new Error(`Resend recipient ${i + 1}/${addresses.length} (${event.id}) failed: ${err}`);
      }
      console.log(`[event-reminders] ${event.id} sent to ${i + 1}/${addresses.length}`);
    }
    await recordSent(event.id, addresses);
    sentEvents++;
    recipients += addresses.length;
    pushed += await sendPushNotifications(event);
  }
  console.log(`[event-reminders] sent ${sentEvents} event(s) to ${recipients} recipient(s), ${pushed} push notification(s)`);
  return { sent: sentEvents, recipients, pushed };
}

/* ── handler ────────────────────────────────────────────────────── */

interface Req { method: string; url?: string; headers: Record<string, string | string[] | undefined>; socket?: { remoteAddress?: string }; body?: { email?: string; eventId?: string } }
interface Res { status(c: number): Res; send(d: string): void; json(d: unknown): void; setHeader(k: string, v: string): void }

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

export default async function handler(req: Req, res: Res) {
  /* Vercel preserves the original URL through the rewrite, so the path
     picks the right half of this function. Everything else is the cron. */
  const path = new URL(req.url || '/', SITE_URL).pathname;
  if (path === '/api/event-remind' || path.endsWith('/event-remind')) {
    await remindHandler(req, res);
    return;
  }

  applyJsonHeaders(res);
  if (req.method !== 'GET') { res.status(405).json({ error: 'Method not allowed' }); return; }
  const secret = process.env.CRON_SECRET;
  const auth = (req.headers['authorization'] || '').toString();
  if (!secret || !safeEqual(auth, `Bearer ${secret}`)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  try {
    const result = await run({ apiKey: process.env.RESEND_API_KEY });
    if (result.skipped) {
      res.status(200).json({ ok: true, skipped: true });
      return;
    }
    res.status(200).json({ ok: true, sent: result.sent, recipients: result.recipients, pushed: result.pushed ?? 0 });
  } catch (e) {
    console.error(e);
    await alertOwner('event-reminders cron', `unexpected error: ${e instanceof Error ? e.message : String(e)}`);
    res.status(500).json({ error: 'Server error' });
  }
}