import { AGENDA_ITEMS, type AgendaEntry } from '../src/data/agenda.js';
import { daysUntil, gcalUrl, outlookUrl } from '../src/lib/calendar-links.js';
import { issueToken } from './_tokens.js';

/* Weekly cron endpoint: reminds newsletter subscribers of upcoming public
 * events. Wired in vercel.json (`crons`) — Vercel attaches
 * `Authorization: Bearer <CRON_SECRET>` to cron requests when the
 * CRON_SECRET environment variable is configured, and this handler only
 * answers to that credential. Each event is reminded exactly once: the ids
 * are recorded in KV (`agenda:reminded`) after a successful send, mirroring
 * the newsletter digest's state pattern.
 *
 * Template helpers are inline copies of the ones in newsletter.ts /
 * send-newsletter.mjs — see the comment atop _rate-limit.ts. */

const SITE_URL = 'https://seynudedagnon.com';
const HORIZON_DAYS = 14;
const STATE_KEY = 'agenda:reminded';
const SUBS_KEY = 'newsletter:emails';

const C = { pine950: '#0c2e2a', pine900: '#133e38', gold500: '#c9a24b', gold400: '#d4b36a', ivory: '#faf8f4', white: '#ffffff', ink: '#3a3a3a', muted: '#6b7280' };
const ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = (s: string): string => s.replace(/[&<>"']/g, (c) => ESCAPES[c]);

function wrap(body: string): string {
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;padding:0;background:${C.ivory};font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif"><table width="100%" cellpadding="0" cellspacing="0" style="background:${C.ivory};padding:32px 16px"><tr><td align="center"><table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${C.white};border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(12,46,42,.08)">${body}</table><p style="margin:20px 0 0;font-size:11px;color:${C.muted};text-align:center">Vous recevez cet email car vous êtes inscrit à la newsletter du Dr. Seynudé Dagnon. &middot; <a href="${SITE_URL}" style="color:${C.gold500};text-decoration:none">seynudedagnon.com</a></p></td></tr></table></body></html>`;
}
function hdr(): string {
  return `<tr><td style="background:${C.pine950};padding:28px 32px"><p style="margin:0;font-size:13px;font-weight:600;letter-spacing:.12em;color:${C.gold400};text-transform:uppercase">Dr. Seynudé Dagnon</p><h1 style="margin:6px 0 0;font-size:20px;font-weight:600;color:${C.white};line-height:1.3">Agenda — événements à venir / Upcoming events</h1></td></tr>`;
}
function ftr(unsubHref: string): string {
  return `<tr><td style="background:${C.pine900};padding:20px 32px"><p style="margin:0;font-size:11px;color:rgba(255,255,255,.5);text-align:center">Public Health &amp; Malaria Program Leader &middot; <a href="${SITE_URL}" style="color:${C.gold400};text-decoration:none">Website</a> &middot; <a href="${unsubHref}" style="color:${C.gold400};text-decoration:none">Se désinscrire / Unsubscribe</a></p></td></tr>`;
}

/** one-click unsubscribe link bound to a single address (see _tokens.ts) */
function unsubHref(email: string): string {
  const token = issueToken('nl-unsub', email) || '';
  return `${SITE_URL}/api/newsletter-unsubscribe?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`;
}

/* ── pure logic (unit-tested) ───────────────────────────────────── */

/** events happening between today (inclusive) and today + horizon days */
export function upcoming(items: AgendaEntry[], from: Date = new Date(), horizonDays: number = HORIZON_DAYS): (AgendaEntry & { days: number })[] {
  return items
    .map((e) => ({ ...e, days: daysUntil(e.date, from) }))
    .filter((e) => e.days >= 0 && e.days <= horizonDays)
    .sort((a, b) => a.days - b.days);
}

/** keeps only events not yet reminded; returns them plus the ids to record */
export function plan(items: AgendaEntry[], state: ReminderState | null | undefined, from: Date = new Date(), horizonDays: number = HORIZON_DAYS): { send: (AgendaEntry & { days: number })[]; nextIds: string[] } {
  const due = upcoming(items, from, horizonDays);
  const reminded = new Set(Array.isArray(state?.ids) ? state.ids : []);
  const send = due.filter((e) => !reminded.has(e.id));
  return { send, nextIds: [...reminded, ...send.map((e) => e.id)] };
}

export function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export function subjectLine(items: AgendaEntry[]): string {
  const n = items.length;
  return `Agenda — ${n} événement${n > 1 ? 's' : ''} à venir / ${n} upcoming event${n > 1 ? 's' : ''}`;
}

function eventHtml(e: AgendaEntry): string {
  const cal = { date: e.date, title: e.title.fr, description: e.description.fr, location: e.location.fr };
  return `<table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px"><tr><td style="padding:20px 22px;background:${C.ivory};border-radius:12px;border-left:3px solid ${C.gold500}"><p style="margin:0 0 6px;font-size:10.5px;font-weight:600;color:${C.muted};text-transform:uppercase;letter-spacing:.1em">${esc(e.date)}</p><p style="margin:0;font-size:16px;font-weight:600;line-height:1.4;color:${C.pine900}">${esc(e.title.fr)}</p><p style="margin:4px 0 0;font-size:12.5px;color:${C.muted}">${esc(e.location.fr)}</p><p style="margin:10px 0 0;font-size:13px;line-height:1.6;color:${C.ink}">${esc(e.description.fr)}</p><p style="margin:14px 0 0;padding-top:12px;border-top:1px solid rgba(12,46,42,.12);font-size:16px;font-weight:600;line-height:1.4;color:${C.pine900}">${esc(e.title.en)}</p><p style="margin:4px 0 0;font-size:12.5px;color:${C.muted}">${esc(e.location.en)}</p><p style="margin:10px 0 0;font-size:13px;line-height:1.6;color:${C.ink}">${esc(e.description.en)}</p><p style="margin:14px 0 0"><a href="${gcalUrl(cal)}" style="display:inline-block;background:${C.pine950};color:${C.gold400};font-size:12px;font-weight:600;padding:9px 18px;border-radius:999px;text-decoration:none;margin:0 6px 0 0">Google Agenda</a><a href="${outlookUrl(cal)}" style="display:inline-block;background:${C.pine950};color:${C.gold400};font-size:12px;font-weight:600;padding:9px 18px;border-radius:999px;text-decoration:none;margin:0 6px 0 0">Outlook</a><a href="${SITE_URL}/agenda" style="display:inline-block;background:${C.pine900};color:${C.gold400};font-size:12px;font-weight:600;padding:9px 18px;border-radius:999px;text-decoration:none">Voir l'agenda / See agenda</a></p></td></tr></table>`;
}

export function reminderHtml(items: AgendaEntry[]): string {
  return `<tr><td style="padding:28px 32px"><p style="margin:0;font-size:14px;line-height:1.7;color:${C.ink}">Bonjour, / Hello,</p><p style="margin:12px 0 0;font-size:14px;line-height:1.7;color:${C.ink}">Événements publics à venir sur seynudedagnon.com : / Upcoming public events on seynudedagnon.com:</p><table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0 0">${items.map(eventHtml).join('')}</table></td></tr>`;
}

export function reminderText(items: AgendaEntry[]): string {
  const lines = ['Hello,', 'Upcoming public events on seynudedagnon.com:', ''];
  for (const e of items) {
    lines.push(`${e.date} — ${e.title.fr} / ${e.title.en}`);
    lines.push(e.location.fr);
    lines.push(`Agenda: ${SITE_URL}/agenda`);
    lines.push('');
  }
  return lines.join('\n');
}

/* ── KV ─────────────────────────────────────────────────────────── */

interface ReminderState { ids?: string[] }

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

async function loadState(): Promise<ReminderState> {
  const results = await kvPipeline([['GET', STATE_KEY]]);
  const raw = results?.[0]?.result;
  if (typeof raw !== 'string') return { ids: [] };
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed?.ids) ? parsed : { ids: [] };
  } catch {
    return { ids: [] };
  }
}

async function saveState(ids: string[]): Promise<boolean> {
  const results = await kvPipeline([['SET', STATE_KEY, JSON.stringify({ ids }), 'EX', '7884000']]);
  return results?.[0]?.result === 'OK';
}

async function loadSubscribers(): Promise<string[]> {
  const results = await kvPipeline([['SMEMBERS', SUBS_KEY]]);
  return Array.isArray(results?.[0]?.result) ? results[0].result.filter((s) => typeof s === 'string') : [];
}

/* ── run ────────────────────────────────────────────────────────── */

interface RunResult { skipped?: boolean; sent?: number; recipients?: number }

export async function run({ items = AGENDA_ITEMS, from = new Date(), owner, apiKey }: { items?: AgendaEntry[]; from?: Date; owner?: string; apiKey?: string }): Promise<RunResult> {
  if (!apiKey || !owner) return { skipped: true };
  const [state, subscribers] = await Promise.all([loadState(), loadSubscribers()]);
  const { send, nextIds } = plan(items, state, from);
  /* per-recipient sends: each copy carries its own one-click unsubscribe
     link (the old bcc batches all shared a single mailto:). The owner gets
     their own copy — they may not be in the subscriber set. */
  const recipients = Array.from(new Set([owner, ...subscribers]));
  if (send.length === 0) return { sent: 0, recipients: recipients.length };

  const subject = subjectLine(send);
  const sender = process.env.NEWSLETTER_FROM_EMAIL || 'Portfolio <admin@seynudedagnon.com>';
  for (const [i, to] of recipients.entries()) {
    const href = unsubHref(to);
    const body: { from: string; to: string[]; subject: string; html: string; text: string } = {
      from: sender,
      to: [to],
      subject,
      html: wrap(hdr() + reminderHtml(send) + ftr(href)),
      text: `${reminderText(send)}\n\n—\nUnsubscribe: ${href}`,
    };
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Resend recipient ${i + 1}/${recipients.length} failed: ${err}`);
    }
    console.log(`[agenda-reminders] sent to ${i + 1}/${recipients.length}`);
  }

  if (!(await saveState(nextIds))) {
    throw new Error('reminder sent but state not saved — the next cron run will resend it');
  }
  return { sent: send.length, recipients: recipients.length };
}

/* ── handler ────────────────────────────────────────────────────── */

interface Req { method: string; headers: Record<string, string | string[] | undefined> }
interface Res { status(c: number): Res; json(d: unknown): void }

export default async function handler(req: Req, res: Res) {
  if (req.method !== 'GET') { res.status(405).json({ error: 'Method not allowed' }); return; }
  const secret = process.env.CRON_SECRET;
  const auth = (req.headers['authorization'] || '').toString();
  if (!secret || auth !== `Bearer ${secret}`) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  try {
    const result = await run({
      owner: process.env.NEWSLETTER_TO_EMAIL,
      apiKey: process.env.RESEND_API_KEY,
    });
    if (result.skipped) {
      res.status(200).json({ ok: true, skipped: true });
      return;
    }
    res.status(200).json({ ok: true, sent: result.sent, recipients: result.recipients });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
}
