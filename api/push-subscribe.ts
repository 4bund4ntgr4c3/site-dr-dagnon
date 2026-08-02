import crypto from 'node:crypto';
import { rateLimit } from './_rate-limit.js';
import { originAllowed } from './_origin.js';

/* Web push subscription store.
 *
 * The browser registers a push subscription (endpoint + public keys) and
 * POSTs it here; scripts/send-newsletter.mjs reads them back at deploy time
 * and fires a notification through the standard Web Push protocol. A GET
 * hands the client the VAPID public key it needs to call
 * pushManager.subscribe() — the private key never leaves the server.
 *
 * Subscriptions live in a set of hashes (`push:subs`) with the payload
 * beside them (`push:sub:<hash>`), so removing one is a plain SREM+DEL
 * instead of a scan. The payload expires after two years — browser push
 * subscriptions rotate, and stale ones are dropped by the sender when the
 * push service answers 404/410.
 *
 * The underscore prefix keeps Vercel from turning this file into a route —
 * see the comment atop _rate-limit.ts. */

const SUBS_KEY = 'push:subs';
const SUB_PREFIX = 'push:sub:';
const SUB_TTL_S = 2 * 365 * 24 * 60 * 60;

const hashOf = (endpoint: string) => crypto.createHash('sha256').update(endpoint).digest('hex').slice(0, 32);

interface PushSubscription { endpoint: string; keys: { p256dh: string; auth: string } }

function validSubscription(s: unknown): s is PushSubscription {
  if (!s || typeof s !== 'object') return false;
  const sub = s as Record<string, unknown>;
  const keys = sub.keys as Record<string, unknown> | undefined;
  return (
    typeof sub.endpoint === 'string' &&
    /^https:\/\/[^\s]+$/.test(sub.endpoint) &&
    !!keys &&
    typeof keys.p256dh === 'string' &&
    keys.p256dh.length > 0 &&
    typeof keys.auth === 'string' &&
    keys.auth.length > 0
  );
}

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

const WINDOW_MS = 10 * 60_000;
const MAX_IP_HITS = 20;

interface Req { method: string; headers: Record<string, string | string[] | undefined>; socket?: { remoteAddress?: string }; body?: { subscription?: unknown; unsubscribe?: boolean; endpoint?: string } }
interface Res { status(c: number): Res; json(d: unknown): void }

export default async function handler(req: Req, res: Res) {
  if (req.method === 'GET') {
    const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
    if (!vapidPublicKey) { res.status(500).json({ error: 'Push not configured' }); return; }
    res.status(200).json({ ok: true, vapidPublicKey });
    return;
  }

  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }
  if (!originAllowed(req.headers)) { res.status(403).json({ error: 'Forbidden' }); return; }

  const ip = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').toString().split(',')[0].trim();
  if (!(await rateLimit(`push:ip:${ip}`, MAX_IP_HITS, WINDOW_MS))) { res.status(429).json({ error: 'Too many requests' }); return; }

  const { subscription, unsubscribe, endpoint } = req.body || {};

  if (unsubscribe) {
    if (!endpoint || typeof endpoint !== 'string') { res.status(400).json({ error: 'Missing endpoint' }); return; }
    const hash = hashOf(endpoint);
    await kvPipeline([
      ['SREM', SUBS_KEY, hash],
      ['DEL', `${SUB_PREFIX}${hash}`],
    ]);
    res.status(200).json({ ok: true });
    return;
  }

  if (!validSubscription(subscription)) { res.status(400).json({ error: 'Invalid subscription' }); return; }
  const hash = hashOf(subscription.endpoint);
  await kvPipeline([
    ['SADD', SUBS_KEY, hash],
    ['SET', `${SUB_PREFIX}${hash}`, JSON.stringify(subscription), 'EX', String(SUB_TTL_S)],
  ]);
  res.status(200).json({ ok: true });
}
