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
import { originAllowed } from './_origin.js';
import { clientIp } from './_ip.js';
import { fetchWithTimeout as fetch } from './_fetch.js';

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
  socket?: { remoteAddress?: string };
  body?: unknown;
}
interface Res {
  status(c: number): Res;
  json(d: unknown): void;
  setHeader(k: string, v: string): void;
}

export default async function handler(req: Req, res: Res) {
  applyJsonHeaders(res);
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }
  if (!originAllowed(req.headers)) { res.status(403).json({ error: 'Forbidden' }); return; }

  const ip = clientIp(req.headers, req.socket?.remoteAddress);
  if (!ip) { res.status(403).json({ error: 'Forbidden' }); return; }
  const allowed = await rateLimit(`search:${ip}`, 30, 60_000);
  if (!allowed) { res.status(429).json({ error: 'Too many requests' }); return; }

  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    res.status(400).json({ error: 'Invalid request' }); return;
  }
  const query = (req.body as { query?: unknown }).query;
  if (typeof query !== 'string') { res.status(400).json({ error: 'Invalid query' }); return; }
  const rawQuery = redactSensitiveQuery(query).trim().toLowerCase().slice(0, 80);
  if (!rawQuery || rawQuery.length < 2) { res.status(400).json({ error: 'Query too short' }); return; }

  try {
    const recentRaw = await kvPipeline([['GET', 'search:recent']]);
    const recent = parseJsonArray(recentRaw?.[0]?.result);
    recent.unshift(rawQuery);
    const deduped = [...new Set(recent)].slice(0, 20);

    const stored = await kvPipeline([
      ['INCR', 'search:total'],
      ['HINCRBY', 'search:counts', rawQuery, 1],
      ['SET', 'search:recent', JSON.stringify(deduped), 'EX', String(90 * 24 * 60 * 60)],
      ['EXPIRE', 'search:total', String(90 * 24 * 60 * 60)],
      ['EXPIRE', 'search:counts', String(90 * 24 * 60 * 60)],
    ]);
    if (!stored) { res.status(503).json({ error: 'Storage unavailable' }); return; }

    res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
}

function redactSensitiveQuery(value: string): string {
  return value
    .replace(/[^\p{L}\p{N}\s'’-]/gu, ' ')
    .replace(/\b\d{5,}\b/g, 'number')
    .replace(/\s+/g, ' ');
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
