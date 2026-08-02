/* Contract tests for api/admin.ts — the private dashboard endpoint.
 * Compiled to node_modules/.tmp/api by scripts/run-tests.mjs — run via
 * `npm test`, not directly. fetch is stubbed like in api.test.mjs. */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

process.env.ADMIN_SECRET = 'admin-test-secret';
process.env.KV_REST_API_URL = 'https://kv.example.test';
process.env.KV_REST_API_TOKEN = 'kv-token';

/** every pipeline sent to the fake KV */
const kvCalls = [];
/** set by a test to control what the fake KV replies */
let kvResponder = null;

globalThis.fetch = async (url, opts) => {
  kvCalls.push({ url: String(url), commands: JSON.parse(opts.body), auth: opts.headers.Authorization });
  return kvResponder
    ? kvResponder()
    : { ok: true, json: async () => [{ result: ['a@example.test'] }, { result: ['sub-hash'] }, { result: '{"ids":["pub:x"]}' }, { result: '{"ids":["ev-1"]}' }] };
};

const admin = (await import(pathToFileURL(path.resolve('node_modules/.tmp/api/admin.js')).href)).default;

const call = async (handler, { method = 'GET', headers = {} } = {}) => {
  const out = { code: 0, body: null };
  const res = {
    status(c) { out.code = c; return res; },
    json(d) { out.body = d; },
  };
  await handler({ method, headers }, res);
  return out;
};

test('rejects requests without the bearer secret', async () => {
  const res = await call(admin);
  assert.equal(res.code, 401);
  assert.equal(res.body.error, 'Unauthorized');
});

test('rejects a wrong secret', async () => {
  const res = await call(admin, { headers: { authorization: 'Bearer wrong' } });
  assert.equal(res.code, 401);
});

test('rejects non-GET methods', async () => {
  const res = await call(admin, { method: 'POST', headers: { authorization: 'Bearer admin-test-secret' } });
  assert.equal(res.code, 405);
});

test('returns the dashboard aggregates from one KV pipeline', async () => {
  kvCalls.length = 0;
  const res = await call(admin, { headers: { authorization: 'Bearer admin-test-secret' } });
  assert.equal(res.code, 200);
  assert.equal(res.body.ok, true);
  assert.equal(res.body.subscribers, 1);
  assert.deepEqual(res.body.subscribersSample, ['a@example.test']);
  assert.equal(res.body.pushSubs, 1);
  assert.deepEqual(res.body.lastDigest.ids, ['pub:x']);
  assert.deepEqual(res.body.remindedEvents.ids, ['ev-1']);

  assert.equal(kvCalls.length, 1);
  const commands = kvCalls[0].commands;
  assert.deepEqual(commands, [
    ['SMEMBERS', 'newsletter:emails'],
    ['SMEMBERS', 'push:subs'],
    ['GET', 'newsletter:last-sent'],
    ['GET', 'agenda:reminded'],
  ]);
  assert.equal(kvCalls[0].auth, 'Bearer kv-token');
});

test('tolerates missing KV state and a sample capped at 20 emails', async () => {
  kvResponder = () => ({
    ok: true,
    json: async () => [
      { result: Array.from({ length: 30 }, (_, i) => `u${i}@example.test`) },
      { result: [] },
      { result: null },
      { result: 'not-json' },
    ],
  });
  const res = await call(admin, { headers: { authorization: 'Bearer admin-test-secret' } });
  assert.equal(res.code, 200);
  assert.equal(res.body.subscribers, 30);
  assert.equal(res.body.subscribersSample.length, 20);
  assert.equal(res.body.pushSubs, 0);
  assert.deepEqual(res.body.lastDigest.ids, []);
  assert.deepEqual(res.body.remindedEvents.ids, []);
});

test('answers 502 when KV is down and 500 on a network failure', async () => {
  kvResponder = () => ({ ok: false, status: 503 });
  let res = await call(admin, { headers: { authorization: 'Bearer admin-test-secret' } });
  assert.equal(res.code, 502);

  globalThis.fetch = async () => {
    throw new Error('network down');
  };
  res = await call(admin, { headers: { authorization: 'Bearer admin-test-secret' } });
  assert.equal(res.code, 500);
});
