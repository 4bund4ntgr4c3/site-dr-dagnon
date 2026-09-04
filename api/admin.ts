import { fetchWithTimeout as fetch } from './_fetch.js';

/* Private dashboard endpoint: aggregate health figures for the newsletter,
 * push and agenda state, fetched by the /admin page. Protected by a bearer
 * secret — ADMIN_SECRET, falling back to CRON_SECRET so the owner can reuse
 * the cron credential Vercel already knows about (a dedicated ADMIN_SECRET
 * is preferred: it keeps the dashboard off the cron credential). No rate
 * limiting on purpose: the secret is long and the endpoint leaks nothing
 * without it.
 *
 *  Reads only, one pipeline to KV: subscriber count and sample, push
 *  subscription count, last digest state and reminded-event state. Counts
 *  use SCARD and the sample SRANDMEMBER, so a large set never gets
 *  transferred in full. */

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

const SECRET = process.env.ADMIN_SECRET || process.env.CRON_SECRET || '';
if (!process.env.ADMIN_SECRET && process.env.CRON_SECRET) {
  console.warn('[admin] ADMIN_SECRET is not set — the dashboard shares the CRON_SECRET credential. Set a dedicated ADMIN_SECRET.');
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

/** Parses a JSON array string into a string array. */
function parseJsonArray(raw: unknown): string[] {
  if (typeof raw !== 'string') return [];
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((x: unknown) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

/** Converts a Redis hash result (object or array) into sorted [query, count] pairs. */
function hashToSortedPairs(raw: unknown): [string, number][] {
  if (!raw || typeof raw !== 'object') return [];
  let entries: [string, number][];
  if (Array.isArray(raw)) {
    entries = [];
    for (let i = 0; i < raw.length - 1; i += 2) {
      entries.push([String(raw[i]), Number(raw[i + 1])]);
    }
  } else {
    entries = Object.entries(raw as Record<string, unknown>).map(([k, v]) => [k, Number(v)]);
  }
  return entries
    .filter((pair) => Number.isFinite(pair[1]) && pair[1] > 0)
    .sort((a, b) => b[1] - a[1]);
}

interface Req { method: string; url?: string; headers: Record<string, string | string[] | undefined> }
interface Res { status(c: number): Res; json(d: unknown): void; setHeader(k: string, v: string): void }

export default async function handler(req: Req, res: Res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  /* subscriber addresses ride in this response — nothing may cache it */
  res.setHeader('Cache-Control', 'private, no-store');
  if (req.method !== 'GET') { res.status(405).json({ error: 'Method not allowed' }); return; }

  if (!SECRET) { res.status(503).json({ error: 'Not configured' }); return; }
  const auth = typeof req.headers?.authorization === 'string' ? req.headers.authorization : '';
  if (!safeEqual(`Bearer ${SECRET}`, auth)) { res.status(401).json({ error: 'Unauthorized' }); return; }

  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) { res.status(503).json({ error: 'KV not configured' }); return; }

  try {
    const response = await fetch(`${url.replace(/\/$/, '')}/pipeline`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify([
        ['SCARD', 'newsletter:emails'],
        ['SCARD', 'push:subs'],
        ['SRANDMEMBER', 'newsletter:emails', 20],
        ['GET', 'newsletter:last-sent'],
        ['GET', 'agenda:reminded'],
        ['GET', 'search:total'],
        ['HGETALL', 'search:counts'],
        ['GET', 'search:recent'],
      ]),
    });
    if (!response.ok) { res.status(502).json({ error: 'KV unavailable' }); return; }
    const results = (await response.json()) as { result?: unknown }[];
    const subscribers = Number(results[0]?.result) || 0;
    const pushSubs = Number(results[1]?.result) || 0;
    const sample = Array.isArray(results[2]?.result) ? results[2].result : [];
    const lastDigest = parseJson<{ ids?: unknown }>(results[3]?.result, {});
    const reminded = parseJson<{ ids?: unknown }>(results[4]?.result, {});
    const searchTotal = Number(results[5]?.result) || 0;
    const searchCountsRaw = results[6]?.result;
    const topQueries = hashToSortedPairs(searchCountsRaw).slice(0, 20).map(([query, count]) => ({ query, count }));
    const recentQueries = parseJsonArray(results[7]?.result);
    res.status(200).json({
      ok: true,
      subscribers,
      subscribersSample: sample.slice(0, 20),
      pushSubs,
      lastDigest: {
        ids: Array.isArray(lastDigest.ids) ? lastDigest.ids : [],
      },
      remindedEvents: {
        ids: Array.isArray(reminded.ids) ? reminded.ids : [],
      },
      searchTotal,
      topQueries,
      recentQueries,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
}
