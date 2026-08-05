import { checkToken } from './_tokens.js';
import { applyJsonHeaders } from './_headers.js';

/* Newsletter preferences endpoint — GET to read, POST to save. The page
 * /newsletter/preferences calls both, authenticated by the same stateless
 * token bound to the subscriber's address that links in the digest emails
 * carry (purpose 'nl-prefs', see _tokens.ts). The endpoint answers with JSON
 * because the preferences page is a SPA, unlike the plain HTML the confirm
 * and unsubscribe pages serve.
 *
 * Stored value: newsletter:prefs:<email> = { "frequency": "weekly" | "monthly", "sections": ["publications", "tribunes", ...] }
 * (default weekly, all sections — the sender only reads the key when it exists).
 * The key lives 365 days and is refreshed on every save. */

const FREQUENCIES = ['weekly', 'monthly'] as const;
type Frequency = (typeof FREQUENCIES)[number];

const VALID_SECTIONS = ['publications', 'tribunes', 'agenda', 'projets'] as const;
type Section = (typeof VALID_SECTIONS)[number];

const PREFS_TTL_S = 365 * 24 * 60 * 60;
const MAX_EMAIL = 254;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Req { method: string; url?: string; headers: Record<string, string | string[] | undefined>; body?: string }
interface Res { status(c: number): Res; json(d: unknown): void; setHeader(k: string, v: string): void }

function kv() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ''), token } : null;
}

interface StoredPrefs { frequency?: Frequency; sections?: Section[] }

async function loadPrefs(email: string): Promise<StoredPrefs> {
  const store = kv();
  const defaults: StoredPrefs = { frequency: 'weekly', sections: [...VALID_SECTIONS] };
  if (!store) return defaults;
  try {
    const response = await fetch(`${store.url}/pipeline`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${store.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify([['GET', `newsletter:prefs:${email}`]]),
    });
    if (!response.ok) return defaults;
    const results = (await response.json()) as { result?: unknown }[];
    const raw = results[0]?.result;
    if (typeof raw !== 'string') return defaults;
    const parsed = JSON.parse(raw) as StoredPrefs;
    return {
      frequency: parsed.frequency === 'monthly' ? 'monthly' : 'weekly',
      sections: Array.isArray(parsed.sections) && parsed.sections.length > 0
        ? parsed.sections.filter((s): s is Section => VALID_SECTIONS.includes(s as Section))
        : [...VALID_SECTIONS],
    };
  } catch {
    return defaults;
  }
}

async function savePrefs(email: string, frequency: Frequency, sections: Section[]): Promise<boolean> {
  const store = kv();
  if (!store) return false;
  try {
    const response = await fetch(`${store.url}/pipeline`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${store.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify([
        ['SET', `newsletter:prefs:${email}`, JSON.stringify({ frequency, sections }), 'EX', String(PREFS_TTL_S)],
      ]),
    });
    if (!response.ok) return false;
    const results = (await response.json()) as { result?: unknown }[];
    return results[0]?.result === 'OK';
  } catch {
    return false;
  }
}

/** Shared by both methods: reads email+token, validates shape and the
 *  HMAC, and normalizes the address. Returns null on failure. */
function authenticate(req: Req): { email: string; token: string } | null {
  const params = new URL(req.url || '/', 'https://seynudedagnon.com').searchParams;
  const email = params.get('email')?.trim().slice(0, MAX_EMAIL).toLowerCase() ?? '';
  const token = params.get('token') ?? '';
  if (!email || !EMAIL_RE.test(email) || !token) return null;
  return checkToken('nl-prefs', token, email) === 'ok' ? { email, token } : null;
}

export default async function handler(req: Req, res: Res) {
  applyJsonHeaders(res);
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const auth = authenticate(req);
  if (!auth) {
    res.status(400).json({ error: 'Invalid link' });
    return;
  }

  if (req.method === 'GET') {
    const prefs = await loadPrefs(auth.email);
    res.status(200).json({ email: auth.email, frequency: prefs.frequency, sections: prefs.sections });
    return;
  }

  /* POST — save preferences */
  let body: { frequency?: unknown; sections?: unknown };
  try {
    body = JSON.parse(req.body ?? '') as { frequency?: unknown; sections?: unknown };
  } catch {
    res.status(400).json({ error: 'Invalid request' });
    return;
  }
  const frequency = body.frequency;
  if (!FREQUENCIES.includes(frequency as Frequency)) {
    res.status(400).json({ error: 'Invalid frequency' });
    return;
  }
  const sections: Section[] = Array.isArray(body.sections) && body.sections.length > 0
    ? (body.sections as unknown[]).filter((s): s is Section => VALID_SECTIONS.includes(s as Section))
    : [...VALID_SECTIONS];
  const saved = await savePrefs(auth.email, frequency as Frequency, sections);
  if (!saved) {
    res.status(502).json({ error: 'Storage unavailable' });
    return;
  }
  res.status(200).json({ ok: true, email: auth.email, frequency, sections });
}
