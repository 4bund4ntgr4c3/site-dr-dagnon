/* Search log endpoint: records what visitors search for so the owner can
 * see which topics draw interest. Called from SearchModal.tsx on every
 * debounced search (≥ 2 chars). No auth required — the data is
 * non-sensitive — but rate-limited per IP to prevent flooding.
 *
 * KV structure:
 *   search:total   — INCR counter (total searches logged)
 *   search:counts  — Redis hash { query → count } via HINCRBY
 *   search:recent  — GET/SET JSON array of the last 20 queries
 */

import { rateLimit } from './_rate-limit.js';
import { applyJsonHeaders } from './_headers.js';

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

interface Req {
  method: string;
  headers: Record<string, string | string[] | undefined>;
  body?: { query?: string; results?: number };
}
interface Res {
  status(c: number): Res;
  json(d: unknown): void;
  setHeader(k: string, v: string): void;
}

export default async function handler(req: Req, res: Res) {
  applyJsonHeaders(res);
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

  const forwarded = req.headers['x-forwarded-for'];
  const ip = (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : '') || 'unknown';
  const allowed = await rateLimit(`search:${ip}`, 30, 60_000);
  if (!allowed) { res.status(429).json({ error: 'Too many requests' }); return; }

  const rawQuery = (req.body?.query ?? '').trim().toLowerCase().slice(0, 200);
  if (!rawQuery || rawQuery.length < 2) { res.status(400).json({ error: 'Query too short' }); return; }

  try {
    const recentRaw = await kvPipeline([['GET', 'search:recent']]);
    const recent = parseJsonArray(recentRaw?.[0]?.result);
    recent.unshift(rawQuery);
    const deduped = [...new Set(recent)].slice(0, 20);

    await kvPipeline([
      ['INCR', 'search:total'],
      ['HINCRBY', 'search:counts', rawQuery, 1],
      ['SET', 'search:recent', JSON.stringify(deduped)],
    ]);

    res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
}

function parseJsonArray(raw: unknown): string[] {
  if (typeof raw !== 'string') return [];
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((x: unknown) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}
