/* Contract tests for api/push-subscribe.ts.
 * Compiled to node_modules/.tmp/api by scripts/run-tests.mjs â€” run via
 * `npm test`, not directly.
 *
 * Nothing here talks to a real push service or Redis: fetch is stubbed so
 * every KV pipeline is captured, mirroring tests/api.test.mjs. */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

process.env.VAPID_PUBLIC_KEY = 'test-vapid-public';
process.env.KV_REST_API_URL = 'https://fake-kv.upstash.io/';
process.env.KV_REST_API_TOKEN = 'fake-token';

/** every pipeline sent to the Upstash/Vercel KV REST endpoint */
const kvCalls = [];
/** replies to the shared rate-limit counter: the n-th pipeline is allowed
 *  n times, so a burst of more than the per-IP cap eventually gets 429s */
let pipelineCount = 0;

globalThis.fetch = async (url, opts) => {
  kvCalls.push({ url: String(url), commands: JSON.parse(opts.body), auth: opts.headers.Authorization });
  pipelineCount++;
  return { ok: true, json: async () => [{ result: 'OK' }, { result: pipelineCount }] };
};

const mod = await import(pathToFileURL(path.resolve('node_modules/.tmp/api/push-subscribe.js')).href);
const handler = mod.default;

const SITE_ORIGIN = 'https://seynudedagnon.com';

const call = async (handler, body, { ip = '10.0.0.1', method = 'POST', origin = SITE_ORIGIN } = {}) => {
  const out = { code: 0, body: null };
  const res = {
    status(c) { out.code = c; return res; },
    json(d) { out.body = d; },
    setHeader() {},
  };
  const headers = { 'x-forwarded-for': ip };
  if (origin !== null) headers.origin = origin;
  await handler({ method, headers, body }, res);
  return out;
};

/** every request first hits the shared rate-limit counter — skip those */
const writes = () => kvCalls.filter((c) => !['SET', 'INCR'].includes(c.commands?.[0]?.[0]));

const SUB = {
  endpoint: 'https://fcm.googleapis.com/fcm/send/abc123',
  keys: { p256dh: 'BN4P3P4hFmY', auth: 'k2X3vQzW' },
};

test('a GET hands out the VAPID public key', async () => {
  const out = await call(handler, undefined, { method: 'GET', origin: null });
  assert.equal(out.code, 200);
  assert.deepEqual(out.body, { ok: true, vapidPublicKey: 'test-vapid-public' });
});

test('a GET fails closed when push is not configured', async () => {
  const prev = process.env.VAPID_PUBLIC_KEY;
  delete process.env.VAPID_PUBLIC_KEY;
  try {
    const out = await call(handler, undefined, { method: 'GET', origin: null });
    assert.equal(out.code, 500);
    assert.equal(out.body.error, 'Push not configured');
  } finally {
    process.env.VAPID_PUBLIC_KEY = prev;
  }
});

test('a valid subscription is stored by endpoint hash', async () => {
  kvCalls.length = 0;
  const out = await call(handler, { subscription: SUB });
  assert.equal(out.code, 200);
  assert.deepEqual(out.body, { ok: true });
  const [sadd, set] = writes()[0].commands;
  assert.deepEqual(sadd, ['SADD', 'push:subs', 'd395ac524dac9139c469d2b782e9933f']);
  assert.equal(set[0], 'SET');
  assert.equal(set[1], 'push:sub:d395ac524dac9139c469d2b782e9933f');
  assert.equal(set[3], 'EX');
  assert.equal(Number(set[4]), 2 * 365 * 24 * 60 * 60);
  assert.equal(writes()[0].auth, 'Bearer fake-token');
});

test('unsubscribing removes the hash from the set and the payload', async () => {
  kvCalls.length = 0;
  const out = await call(handler, { unsubscribe: true, endpoint: SUB.endpoint });
  assert.equal(out.code, 200);
  const [srem, del] = writes()[0].commands;
  assert.deepEqual(srem, ['SREM', 'push:subs', 'd395ac524dac9139c469d2b782e9933f']);
  assert.deepEqual(del, ['DEL', 'push:sub:d395ac524dac9139c469d2b782e9933f']);
});

test('an invalid subscription is refused before any store write', async () => {
  kvCalls.length = 0;
  for (const bad of [
    {},
    { subscription: { endpoint: 'http://not-https.example', keys: { p256dh: 'x', auth: 'y' } } },
    { subscription: { endpoint: 'https://ok.example', keys: { p256dh: '', auth: 'y' } } },
    { subscription: null },
    { subscription: { endpoint: 'https://ok.example' } },
  ]) {
    const out = await call(handler, bad);
    assert.equal(out.code, 400, `expected 400 for ${JSON.stringify(bad)}`);
  }
  assert.equal(writes().length, 0);
});

test('SSRF targets are refused before any store write', async () => {
  kvCalls.length = 0;
  const sub = (endpoint) => ({ subscription: { endpoint, keys: { p256dh: 'BN4P3P4hFmY', auth: 'k2X3vQzW' } } });
  for (const endpoint of [
    'https://169.254.169.254/latest/meta-data', // cloud metadata
    'https://[::1]:8443/admin', // loopback, non-443 port
    'https://10.0.0.5/internal', // private range
    'https://192.168.1.1/router', // private range
    'https://internal.corp.example/x', // host not in the push allowlist
    'https://fcm.googleapis.com.evil.example/send', // lookalike host
    'https://fcm.googleapis.com:8443/send', // allowlisted host, wrong port
  ]) {
    const out = await call(handler, sub(endpoint));
    assert.equal(out.code, 400, `expected 400 for ${endpoint}`);
  }
  assert.equal(writes().length, 0);
});

test('an unsubscribe without an endpoint is refused', async () => {
  const out = await call(handler, { unsubscribe: true });
  assert.equal(out.code, 400);
});

test('requests with no Origin header are refused', async () => {
  const out = await call(handler, { subscription: SUB }, { origin: null });
  assert.equal(out.code, 403);
});

test('requests from another site are refused', async () => {
  const out = await call(handler, { subscription: SUB }, { origin: 'https://evil.example' });
  assert.equal(out.code, 403);
});

test('non-POST non-GET methods are refused', async () => {
  const out = await call(handler, undefined, { method: 'DELETE', origin: null });
  assert.equal(out.code, 405);
});

test('subscriptions are capped per IP', async () => {
  const results = [];
  for (let i = 0; i < 25; i++) {
    results.push(await call(handler, { subscription: { ...SUB, endpoint: `https://fcm.googleapis.com/fcm/send/${i}` } }, { ip: '10.8.1.1' }));
  }
  assert.ok(results.some((r) => r.code === 429), 'expected at least one 429');
});
