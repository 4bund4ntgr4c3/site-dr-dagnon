import { isSafePushEndpoint } from './_push-guard.js';
import { applyJsonHeaders } from './_headers.js';
import { alertOwner } from './_alert.js';
import webPush from 'web-push';

/* Push notification sender: the admin composes a notification from /admin
 * and this endpoint delivers it to every push subscriber. Protected by the
 * same ADMIN_SECRET (or CRON_SECRET fallback) as the dashboard read.
 *
 * The send loop follows the same marks as api/agenda-reminders.ts and
 * scripts/send-newsletter.mjs: dead subscriptions (404/410) are dropped,
 * missing VAPID keys fail closed, and the owner is alerted on unexpected
 * errors. A single bad subscription never blocks the rest. */

const SUBS_KEY = 'push:subs';
const SUB_PREFIX = 'push:sub:';

const SECRET = process.env.ADMIN_SECRET || process.env.CRON_SECRET || '';

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/* ── KV ─────────────────────────────────────────────────────────── */

async function kvPipeline(commands: (string | number)[][]): Promise<{ result?: unknown }[] | null> {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  try {
    const response = await fetch(`${url.replace(/\/$/, '')}/pipeline`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(commands),
    });
    if (!response.ok) return null;
    return (await response.json()) as { result?: unknown }[];
  } catch {
    return null;
  }
}

/* ── handler ────────────────────────────────────────────────────── */

interface Req { method: string; headers: Record<string, string | string[] | undefined>; body?: { title?: string; body?: string; url?: string } }
interface Res { status(c: number): Res; json(d: unknown): void; setHeader(k: string, v: string): void }

export default async function handler(req: Req, res: Res) {
  applyJsonHeaders(res);
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

  if (!SECRET) { res.status(503).json({ error: 'Not configured' }); return; }
  const auth = typeof req.headers?.authorization === 'string' ? req.headers.authorization : '';
  if (!safeEqual(`Bearer ${SECRET}`, auth)) { res.status(401).json({ error: 'Unauthorized' }); return; }

  const { title, body: msgBody, url: targetUrl } = req.body || {};
  const cleanTitle = (title || '').trim().slice(0, 200);
  const cleanBody = (msgBody || '').trim().slice(0, 500);
  if (!cleanTitle) { res.status(400).json({ error: 'Missing title' }); return; }
  if (!cleanBody) { res.status(400).json({ error: 'Missing body' }); return; }

  const pub = process.env.VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  if (!pub || !priv) { res.status(503).json({ error: 'Push not configured' }); return; }
  webPush.setVapidDetails(`mailto:${process.env.NEWSLETTER_TO_EMAIL || 'admin@seynudedagnon.com'}`, pub, priv);

  try {
    const results = await kvPipeline([['SMEMBERS', SUBS_KEY]]);
    const hashes = Array.isArray(results?.[0]?.result) ? results[0].result.filter((s) => typeof s === 'string') : [];
    if (hashes.length === 0) { res.status(200).json({ ok: true, sent: 0, failed: 0, total: 0 }); return; }

    const payload = JSON.stringify({
      title: cleanTitle,
      body: cleanBody,
      url: targetUrl || 'https://seynudedagnon.com',
      tag: 'admin-push',
    });

    let sent = 0;
    let failed = 0;
    for (const hash of hashes) {
      const subResults = await kvPipeline([['GET', `${SUB_PREFIX}${hash}`]]);
      const raw = subResults?.[0]?.result;
      if (typeof raw !== 'string') { await kvPipeline([['SREM', SUBS_KEY, hash], ['DEL', `${SUB_PREFIX}${hash}`]]); failed++; continue; }
      let sub;
      try { sub = JSON.parse(raw); } catch { await kvPipeline([['SREM', SUBS_KEY, hash], ['DEL', `${SUB_PREFIX}${hash}`]]); failed++; continue; }
      if (!sub?.endpoint || !(await isSafePushEndpoint(sub.endpoint))) { await kvPipeline([['SREM', SUBS_KEY, hash], ['DEL', `${SUB_PREFIX}${hash}`]]); failed++; continue; }
      try { await webPush.sendNotification(sub, payload); sent++; }
      catch (e) {
        if ((e as { statusCode?: number } | null)?.statusCode === 404 || (e as { statusCode?: number } | null)?.statusCode === 410) {
          await kvPipeline([['SREM', SUBS_KEY, hash], ['DEL', `${SUB_PREFIX}${hash}`]]);
        }
        failed++;
      }
    }

    res.status(200).json({ ok: true, sent, failed, total: hashes.length });
  } catch (e) {
    console.error(e);
    await alertOwner('push-send', `unexpected error: ${e instanceof Error ? e.message : String(e)}`);
    res.status(500).json({ error: 'Server error' });
  }
}
