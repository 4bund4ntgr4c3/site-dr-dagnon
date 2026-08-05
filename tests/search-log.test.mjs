/* Contract tests for the search log endpoint: api/search-log.ts.
 * Compiled to node_modules/.tmp/api by scripts/run-tests.mjs — run via
 * `npm test`, not directly. */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

process.env.KV_REST_API_URL = 'https://fake-kv.upstash.io/';
process.env.KV_REST_API_TOKEN = 'fake-token';

/* the fake KV */
const store = { hashes: new Map(), strings: new Map(), counters: new Map() };

function reset() {
  store.hashes.clear();
  store.strings.clear();
  store.counters.clear();
}

globalThis.fetch = async (url, opts) => {
  if (String(url).includes('/pipeline')) {
    const commands = JSON.parse(opts.body);
    const results = commands.map(([op, key, ...rest]) => {
      if (op === 'INCR') {
        const prev = store.counters.get(key) ?? 0;
        store.counters.set(key, prev + 1);
        return { result: prev + 1 };
      }
      if (op === 'HINCRBY') {
        const field = rest[0];
        const inc = Number(rest[1]) || 1;
        const hash = store.hashes.get(key) ?? {};
        hash[field] = (hash[field] ?? 0) + inc;
        store.hashes.set(key, hash);
        return { result: hash[field] };
      }
      if (op === 'HGETALL') {
        const hash = store.hashes.get(key) ?? {};
        return { result: hash };
      }
      if (op === 'GET') return { result: store.strings.get(key) ?? null };
      if (op === 'SET') {
        store.strings.set(key, rest[0]);
        return { result: 'OK' };
      }
      if (op === 'SET' && rest.includes('NX')) return { result: 'OK' };
      return { result: 'OK' };
    });
    return { ok: true, json: async () => results };
  }
  throw new Error(`unexpected fetch: ${url}`);
};

const searchLog = await import(pathToFileURL(path.resolve('node_modules/.tmp/api/search-log.js')).href);
const handler = searchLog.default;

const call = async ({ method = 'POST', body = {}, ip } = {}) => {
  const out = { code: 0, payload: null };
  const res = {
    status(c) { out.code = c; return res; },
    json(d) { out.payload = d; },
    setHeader() {},
  };
  const headers = {};
  if (ip) headers['x-forwarded-for'] = ip;
  await handler({ method, body, headers }, res);
  return out;
};

/* ── handler contract ───────────────────────────────────────────── */

test('refuses anything but POST', async () => {
  assert.equal((await call({ method: 'GET' })).code, 405);
});

test('refuses a query shorter than 2 characters', async () => {
  reset();
  const out = await call({ body: { query: 'a' } });
  assert.equal(out.code, 400);
});

test('accepts a valid query and stores it', async () => {
  reset();
  const out = await call({ body: { query: 'expertise' } });
  assert.equal(out.code, 200);
  assert.equal(out.payload.ok, true);
  assert.equal(store.counters.get('search:total'), 1);
  const counts = store.hashes.get('search:counts');
  assert.equal(counts['expertise'], 1);
  const recent = JSON.parse(store.strings.get('search:recent'));
  assert.deepEqual(recent, ['expertise']);
});

test('increments the count for repeated queries', async () => {
  reset();
  await call({ body: { query: 'dagnon' } });
  await call({ body: { query: 'dagnon' } });
  await call({ body: { query: 'dagnon' } });
  assert.equal(store.counters.get('search:total'), 3);
  assert.equal(store.hashes.get('search:counts')['dagnon'], 3);
});

test('deduplicates recent queries', async () => {
  reset();
  await call({ body: { query: 'alpha' } });
  await call({ body: { query: 'beta' } });
  await call({ body: { query: 'alpha' } });
  const recent = JSON.parse(store.strings.get('search:recent'));
  assert.deepEqual(recent, ['alpha', 'beta']);
});

test('normalizes queries to lowercase and trims', async () => {
  reset();
  await call({ body: { query: '  Dagnon  ' } });
  assert.equal(store.hashes.get('search:counts')['dagnon'], 1);
});

test('truncates queries longer than 200 characters', async () => {
  reset();
  const long = 'a'.repeat(300);
  await call({ body: { query: long } });
  const recent = JSON.parse(store.strings.get('search:recent'));
  assert.equal(recent[0].length, 200);
});

test('caps recent queries at 20', async () => {
  reset();
  for (let i = 0; i < 25; i++) {
    await call({ body: { query: `q${i}` } });
  }
  const recent = JSON.parse(store.strings.get('search:recent'));
  assert.equal(recent.length, 20);
  assert.equal(recent[0], 'q24');
});
