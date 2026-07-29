/* Rate limiting shared by the two handlers.
 *
 * The underscore prefix keeps Vercel from turning this file into a route
 * while still bundling it into the functions that import it. That matters
 * here: an earlier attempt at sharing code used `api/email-templates.ts`,
 * with no underscore, so the same file was both a route and a module — and
 * it was reverted to inline copies. This is the documented way to do it.
 *
 * Two backends:
 *   - Upstash / Vercel KV over REST when the environment provides it. Counts
 *     are then shared by every lambda instance, which is the only way a limit
 *     actually holds — in-memory counters are per instance, so a burst spread
 *     across instances sails past them.
 *   - an in-memory fallback otherwise, so the endpoints keep working with no
 *     infrastructure at all.
 *
 * To switch the shared backend on, set either pair (Vercel KV sets the first
 * for you when you attach a store):
 *   KV_REST_API_URL + KV_REST_API_TOKEN
 *   UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN
 */

/* ── in-memory fallback ─────────────────────────────────────────── */

const MAX_ENTRIES = 5000;
const hits = new Map<string, { count: number; resetAt: number }>();

function memoryLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  /* prune on the way in so the map cannot grow without bound */
  for (const [k, v] of hits) if (now > v.resetAt) hits.delete(k);
  if (hits.size > MAX_ENTRIES) hits.clear();
  const entry = hits.get(key);
  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  entry.count++;
  return entry.count <= max;
}

/* ── shared store ───────────────────────────────────────────────── */

function credentials(): { url: string; token: string } | null {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ''), token } : null;
}

/** Returns null when the shared store is unavailable, so the caller falls back. */
async function sharedLimit(key: string, max: number, windowMs: number): Promise<boolean | null> {
  const creds = credentials();
  if (!creds) return null;
  const ttl = Math.ceil(windowMs / 1000);
  try {
    /* SET NX EX creates the counter with its expiry only if absent, then INCR
       bumps it. Avoids `EXPIRE ... NX`, which needs Redis 7. */
    const response = await fetch(`${creds.url}/pipeline`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${creds.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify([
        ['SET', key, '0', 'EX', String(ttl), 'NX'],
        ['INCR', key],
      ]),
    });
    if (!response.ok) return null;
    const results = (await response.json()) as { result?: unknown; error?: string }[];
    const count = Number(results?.[1]?.result);
    if (!Number.isFinite(count)) return null;
    return count <= max;
  } catch {
    /* a store outage must not take the contact form down with it */
    return null;
  }
}

/* ── public API ─────────────────────────────────────────────────── */

/**
 * @param key      caller-namespaced, e.g. `contact:ip:1.2.3.4`
 * @param max      requests allowed per window
 * @param windowMs window length in milliseconds
 * @returns whether the request is within its allowance
 */
export async function rateLimit(key: string, max: number, windowMs: number): Promise<boolean> {
  const namespaced = `rl:${key}`;
  const shared = await sharedLimit(namespaced, max, windowMs);
  return shared === null ? memoryLimit(namespaced, max, windowMs) : shared;
}

/** True when counts are shared across instances rather than per-lambda. */
export const usingSharedStore = () => credentials() !== null;
