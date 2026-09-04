import crypto from 'node:crypto';
import { rateLimit } from './_rate-limit.js';
import { originAllowed } from './_origin.js';
import { clientIp } from './_ip.js';
import { applyJsonHeaders } from './_headers.js';
import { isAllowedPushEndpoint, isSafePushEndpoint } from './_push-guard.js';
import { alertOwner } from './_alert.js';
import webPush from 'web-push';
import { fetchWithTimeout as fetch } from './_fetch.js';

/* Two endpoints in one function, so the deploy stays under the 12-function
 * Hobby limit: /api/push-subscribe (the browser registers a push
 * subscription, or reads the VAPID public key) and /api/push-send (the
 * admin composes a notification from /admin and this delivers it). Split
 * on the request path — Vercel preserves the original URL through the
 * rewrites in vercel.json.
 *
 * Subscriptions live in a set of hashes (`push:subs`) with the payload
 * beside them (`push:sub:<hash>`), so removing one is a plain SREM+DEL
 * instead of a scan. The payload expires after two years — browser push
 * subscriptions rotate, and stale ones are dropped by the sender when the
 * push service answers 404/410.
 *
 * The send loop follows the same marks as api/agenda-reminders.ts and
 * scripts/send-newsletter.mjs: dead subscriptions (404/410) are dropped,
 * missing VAPID keys fail closed, and the owner is alerted on unexpected
 * errors. A single bad subscription never blocks the rest. */

const SUBS_KEY = 'push:subs';
const SUB_PREFIX = 'push:sub:';
const SUB_TTL_S = 2 * 365 * 24 * 60 * 60;

const hashOf = (endpoint: string) => crypto.createHash('sha256').update(endpoint).digest('hex').slice(0, 32);

interface PushSubscription { endpoint: string; keys: { p256dh: string; auth: string } }

/* generous but bounded — browser push endpoints and keys never grow past
   these, and caps keep a single subscription from bloating the store.
   The endpoint itself is further restricted by isAllowedPushEndpoint
   (_push-guard.ts): the senders POST to it from the server, so only
   well-known push service hosts may be stored (SSRF guard). */
const MAX_ENDPOINT_LEN = 2048;
const MAX_KEY_LEN = 512;

function validSubscription(s: unknown): s is PushSubscription {
  if (!s || typeof s !== 'object') return false;
  const sub = s as Record<string, unknown>;
  const keys = sub.keys as Record<string, unknown> | undefined;
  return (
    typeof sub.endpoint === 'string' &&
    sub.endpoint.length <= MAX_ENDPOINT_LEN &&
    isAllowedPushEndpoint(sub.endpoint) &&
    !!keys &&
    typeof keys.p256dh === 'string' &&
    keys.p256dh.length > 0 &&
    keys.p256dh.length <= MAX_KEY_LEN &&
    typeof keys.auth === 'string' &&
    keys.auth.length > 0 &&
    keys.auth.length <= MAX_KEY_LEN
  );
}

async function kvPipeline(commands: (string | number)[][]): Promise<{ result?: unknown; error?: unknown }[] | null> {
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
    return (await response.json()) as { result?: unknown; error?: unknown }[];
  } catch {
    return null;
  }
}

const WINDOW_MS = 10 * 60_000;
const MAX_IP_HITS = 20;

const SECRET = process.env.ADMIN_SECRET || process.env.CRON_SECRET || '';

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

interface Req { method: string; url?: string; headers: Record<string, string | string[] | undefined>; socket?: { remoteAddress?: string }; body?: { subscription?: unknown; unsubscribe?: boolean; endpoint?: string; title?: string; body?: string; url?: string } }
interface Res { status(c: number): Res; json(d: unknown): void; setHeader(k: string, v: string): void }

/* /api/push-subscribe — the browser-facing half. */
async function subscribeHandler(req: Req, res: Res): Promise<void> {
  applyJsonHeaders(res);
  if (req.method === 'GET') {
    const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
    if (!vapidPublicKey) { res.status(500).json({ error: 'Push not configured' }); return; }
    res.status(200).json({ ok: true, vapidPublicKey });
    return;
  }

  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }
  if (!originAllowed(req.headers)) { res.status(403).json({ error: 'Forbidden' }); return; }

  const ip = clientIp(req.headers, req.socket?.remoteAddress);
  if (!ip) { res.status(403).json({ error: 'Forbidden' }); return; }
  if (!(await rateLimit(`push:ip:${ip}`, MAX_IP_HITS, WINDOW_MS))) { res.status(429).json({ error: 'Too many requests' }); return; }

  const { subscription, unsubscribe, endpoint } = req.body || {};

  if (unsubscribe) {
    if (!endpoint || typeof endpoint !== 'string') { res.status(400).json({ error: 'Missing endpoint' }); return; }
    const hash = hashOf(endpoint);
    const stored = await kvPipeline([
      ['SREM', SUBS_KEY, hash],
      ['DEL', `${SUB_PREFIX}${hash}`],
    ]);
    if (!stored || stored.some((entry) => entry.error !== undefined || entry.result === undefined)) {
      res.status(503).json({ error: 'Storage unavailable' }); return;
    }
    res.status(200).json({ ok: true });
    return;
  }

  if (!validSubscription(subscription)) { res.status(400).json({ error: 'Invalid subscription' }); return; }
  const hash = hashOf(subscription.endpoint);
  const stored = await kvPipeline([
    ['SADD', SUBS_KEY, hash],
    ['SET', `${SUB_PREFIX}${hash}`, JSON.stringify(subscription), 'EX', String(SUB_TTL_S)],
  ]);
  if (!stored || stored.some((entry) => entry.error !== undefined || entry.result === undefined)) {
    res.status(503).json({ error: 'Storage unavailable' }); return;
  }
  res.status(200).json({ ok: true });
}

/* /api/push-send — the admin-facing half. */
async function sendHandler(req: Req, res: Res): Promise<void> {
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

export default async function handler(req: Req, res: Res) {
  const path = new URL(req.url || '/', 'https://seynudedagnon.com').pathname;
  if (path === '/api/push-send' || path.endsWith('/push-send')) {
    await sendHandler(req, res);
    return;
  }
  await subscribeHandler(req, res);
}
