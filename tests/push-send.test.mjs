/* Contract tests for the push notification sender: api/push-send.ts.
 * Compiled to node_modules/.tmp/api by scripts/run-tests.mjs — run via
 * `npm test`, not directly.
 *
 * Nothing here talks to the real push service: web-push is stubbed so
 * every notification is captured, and the KV store is faked like the other
 * API test suites. */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

process.env.ADMIN_SECRET = 'test-admin';
process.env.VAPID_PUBLIC_KEY = 'test-public';
process.env.VAPID_PRIVATE_KEY = 'test-private';
process.env.KV_REST_API_URL = 'https://fake-kv.upstash.io/';
process.env.KV_REST_API_TOKEN = 'fake-token';

/* every notification sent through web-push */
const pushCalls = [];
/* the fake KV */
const store = { sets: new Map(), strings: new Map() };

function reset() {
  pushCalls.length = 0;
  store.sets.clear();
  store.strings.clear();
}

globalThis.fetch = async (url, opts) => {
  if (String(url).includes('/pipeline')) {
    const commands = JSON.parse(opts.body);
    const results = commands.map(([op, key, ...rest]) => {
      if (op === 'SMEMBERS') return { result: store.sets.get(key) ?? [] };
      if (op === 'SADD') {
        const prev = store.sets.get(key) ?? [];
        const added = rest.filter((m) => typeof m === 'string' && !prev.includes(m));
        store.sets.set(key, [...prev, ...added]);
        return { result: added.length };
      }
      if (op === 'SREM') {
        const prev = store.sets.get(key) ?? [];
        const kept = prev.filter((m) => typeof m === 'string' && !rest.includes(m));
        store.sets.set(key, kept);
        return { result: prev.length - kept.length };
      }
      if (op === 'DEL') return { result: 'OK' };
      if (op === 'GET') return { result: store.strings.get(key) ?? null };
      return { result: 'OK' };
    });
    return { ok: true, json: async () => results };
  }
  throw new Error(`unexpected fetch: ${url}`);
};

const pushSend = await import(pathToFileURL(path.resolve('node_modules/.tmp/api/push-send.js')).href);
const handler = pushSend.default;

/* stub web-push: capture calls instead of hitting the real service */
const webPushModule = await import('web-push');
const webPush = webPushModule.default ?? webPushModule;
const keys = webPush.generateVAPIDKeys();
process.env.VAPID_PUBLIC_KEY = keys.publicKey;
process.env.VAPID_PRIVATE_KEY = keys.privateKey;
webPush.setVapidDetails('mailto:test@example.test', keys.publicKey, keys.privateKey);
const stubSend = async (sub, payload) => {
  pushCalls.push({ sub, payload: JSON.parse(payload) });
};
webPush.sendNotification = stubSend;

const call = async ({ method = 'POST', body = {}, authorization } = {}) => {
  const out = { code: 0, payload: null };
  const res = {
    status(c) { out.code = c; return res; },
    json(d) { out.payload = d; },
    setHeader() {},
  };
  await handler({ method, body, headers: { authorization } }, res);
  return out;
};

const FAKE_SUB_1 = { endpoint: 'https://fcm.googleapis.com/fcm/send/abc', keys: { p256dh: 'key1', auth: 'auth1' } };
const FAKE_SUB_2 = { endpoint: 'https://fcm.googleapis.com/fcm/send/def', keys: { p256dh: 'key2', auth: 'auth2' } };

/* ── handler contract ───────────────────────────────────────────── */

test('refuses anything but POST', async () => {
  assert.equal((await call({ method: 'GET' })).code, 405);
});

test('refuses requests without the secret', async () => {
  assert.equal((await call()).code, 401);
  assert.equal((await call({ authorization: 'Bearer wrong' })).code, 401);
});

test('refuses a missing title', async () => {
  reset();
  const out = await call({ authorization: 'Bearer test-admin', body: { body: 'Hello' } });
  assert.equal(out.code, 400);
});

test('refuses a missing body', async () => {
  reset();
  const out = await call({ authorization: 'Bearer test-admin', body: { title: 'Test' } });
  assert.equal(out.code, 400);
});

test('sends to all subscribers and returns counts', async () => {
  reset();
  store.sets.set('push:subs', ['hash1', 'hash2']);
  store.strings.set('push:sub:hash1', JSON.stringify(FAKE_SUB_1));
  store.strings.set('push:sub:hash2', JSON.stringify(FAKE_SUB_2));

  const out = await call({
    authorization: 'Bearer test-admin',
    body: { title: 'Hello', body: 'World', url: 'https://seynudedagnon.com/test' },
  });
  assert.equal(out.code, 200);
  assert.equal(out.payload.ok, true);
  assert.equal(out.payload.sent, 2);
  assert.equal(out.payload.total, 2);
  assert.equal(pushCalls.length, 2);
  for (const call of pushCalls) {
    assert.equal(call.payload.title, 'Hello');
    assert.equal(call.payload.body, 'World');
    assert.equal(call.payload.url, 'https://seynudedagnon.com/test');
  }
});

test('drops dead subscriptions (404) and counts them as failed', async () => {
  reset();
  store.sets.set('push:subs', ['dead']);
  store.strings.set('push:sub:dead', JSON.stringify(FAKE_SUB_1));

  webPush.sendNotification = async () => {
    const err = new Error('not found');
    err.statusCode = 404;
    throw err;
  };

  const out = await call({
    authorization: 'Bearer test-admin',
    body: { title: 'Test', body: 'msg' },
  });
  assert.equal(out.code, 200);
  assert.equal(out.payload.sent, 0);
  assert.equal(out.payload.failed, 1);
  assert.equal((store.sets.get('push:subs') ?? []).length, 0, 'the dead subscription must be removed');

  webPush.sendNotification = stubSend;
});

test('returns 0 sent when no subscribers exist', async () => {
  reset();
  store.sets.set('push:subs', []);

  const out = await call({
    authorization: 'Bearer test-admin',
    body: { title: 'Test', body: 'msg' },
  });
  assert.equal(out.code, 200);
  assert.equal(out.payload.sent, 0);
  assert.equal(out.payload.total, 0);
  assert.equal(pushCalls.length, 0);
});

test('defaults url to seynudedagnon.com when not provided', async () => {
  reset();
  store.sets.set('push:subs', ['h1']);
  store.strings.set('push:sub:h1', JSON.stringify(FAKE_SUB_1));

  const out = await call({
    authorization: 'Bearer test-admin',
    body: { title: 'Alert', body: 'Check this' },
  });
  assert.equal(out.code, 200);
  assert.equal(pushCalls[0].payload.url, 'https://seynudedagnon.com');
});

test('fails closed when VAPID keys are not configured', async () => {
  reset();
  const origPub = process.env.VAPID_PUBLIC_KEY;
  const origPriv = process.env.VAPID_PRIVATE_KEY;
  delete process.env.VAPID_PUBLIC_KEY;
  delete process.env.VAPID_PRIVATE_KEY;

  const out = await call({
    authorization: 'Bearer test-admin',
    body: { title: 'Test', body: 'msg' },
  });
  assert.equal(out.code, 503);

  process.env.VAPID_PUBLIC_KEY = origPub;
  process.env.VAPID_PRIVATE_KEY = origPriv;
});

test('rejects a wrong bearer secret', async () => {
  reset();
  const out = await call({ authorization: 'Bearer wrong-secret', body: { title: 'T', body: 'B' } });
  assert.equal(out.code, 401);
});
