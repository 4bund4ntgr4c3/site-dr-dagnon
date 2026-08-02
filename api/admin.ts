/* Private dashboard endpoint: aggregate health figures for the newsletter,
 * push and agenda state, fetched by the /admin page. Protected by a bearer
 * secret — ADMIN_SECRET, falling back to CRON_SECRET so the owner can reuse
 * the cron credential Vercel already knows about. No rate limiting on
 * purpose: the secret is long and the endpoint leaks nothing without it.
 *
 *  Reads only, one pipeline to KV: subscriber set, push subscription set,
 *  last digest state and reminded-event state. */

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Parses a JSON blob KV may store (or returns the fallback). */
function parseJson<T>(raw: unknown, fallback: T): T {
  if (typeof raw !== 'string' || !raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

interface Req { method: string; url?: string; headers: Record<string, string | string[] | undefined> }
interface Res { status(c: number): Res; json(d: unknown): void }

export default async function handler(req: Req, res: Res) {
  if (req.method !== 'GET') { res.status(405).json({ error: 'Method not allowed' }); return; }

  const secret = process.env.ADMIN_SECRET || process.env.CRON_SECRET || '';
  if (!secret) { res.status(503).json({ error: 'Not configured' }); return; }
  const auth = typeof req.headers?.authorization === 'string' ? req.headers.authorization : '';
  if (!safeEqual(`Bearer ${secret}`, auth)) { res.status(401).json({ error: 'Unauthorized' }); return; }

  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) { res.status(503).json({ error: 'KV not configured' }); return; }

  try {
    const response = await fetch(`${url.replace(/\/$/, '')}/pipeline`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify([
        ['SMEMBERS', 'newsletter:emails'],
        ['SMEMBERS', 'push:subs'],
        ['GET', 'newsletter:last-sent'],
        ['GET', 'agenda:reminded'],
      ]),
    });
    if (!response.ok) { res.status(502).json({ error: 'KV unavailable' }); return; }
    const results = (await response.json()) as { result?: unknown }[];
    const subscribers = Array.isArray(results[0]?.result) ? results[0].result : [];
    const pushSubs = Array.isArray(results[1]?.result) ? results[1].result : [];
    const lastDigest = parseJson<{ ids?: unknown }>(results[2]?.result, {});
    const reminded = parseJson<{ ids?: unknown }>(results[3]?.result, {});
    res.status(200).json({
      ok: true,
      subscribers: subscribers.length,
      subscribersSample: subscribers.slice(0, 20),
      pushSubs: pushSubs.length,
      lastDigest: {
        ids: Array.isArray(lastDigest.ids) ? lastDigest.ids : [],
      },
      remindedEvents: {
        ids: Array.isArray(reminded.ids) ? reminded.ids : [],
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
}
