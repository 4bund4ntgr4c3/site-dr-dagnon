/* Contract tests for the preferences endpoint — now served by
 * api/newsletter.ts at /api/newsletter-prefs — and the monthly partition in
 * scripts/send-newsletter.mjs. Compiled to node_modules/.tmp/api by
 * scripts/run-tests.mjs — run via `npm test`, not directly. fetch is
 * stubbed; the token is issued with the real HMAC from _tokens.ts. */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

process.env.RESEND_API_KEY = 'test-key';
process.env.VERIFY_SECRET = 'test-secret';
process.env.KV_REST_API_URL = 'https://kv.example.test';
process.env.KV_REST_API_TOKEN = 'kv-token';

/** every pipeline sent to the fake KV */
const kvCalls = [];
/** set by a test to control what the fake KV replies */
let kvResponder = null;

globalThis.fetch = async (url, opts) => {
  kvCalls.push({ commands: JSON.parse(opts.body) });
  return kvResponder
    ? kvResponder()
    : { ok: true, json: async () => [{ result: null }] };
};

const prefsHandler = (await import(pathToFileURL(path.resolve('node_modules/.tmp/api/newsletter.js')).href)).default;
const { issueToken } = await import(pathToFileURL(path.resolve('node_modules/.tmp/api/_tokens.js')).href);
const { planRecipients } = await import('../scripts/send-newsletter.mjs');

const call = async (handler, { method = 'GET', url, body } = {}) => {
  const out = { code: 0, body: null };
  const res = {
    status(c) { out.code = c; return res; },
    json(d) { out.body = d; },
    setHeader() {},
  };
  await handler({ method, url, headers: {}, body }, res);
  return out;
};

const prefsUrl = (email, token) => `/newsletter/preferences?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`;

test('GET requires a well-formed email and token', async () => {
  let res = await call(prefsHandler, { url: '/newsletter/preferences' });
  assert.equal(res.code, 400);
  res = await call(prefsHandler, { url: '/newsletter/preferences?email=reader@example.test' });
  assert.equal(res.code, 400);
  res = await call(prefsHandler, { url: prefsUrl('reader@example.test', 'bogus') });
  assert.equal(res.code, 400);
});

test('a token issued for another purpose cannot open the preferences', async () => {
  const token = issueToken('nl-unsub', 'reader@example.test');
  const res = await call(prefsHandler, { url: prefsUrl('reader@example.test', token) });
  assert.equal(res.code, 400);
});

test('GET defaults to weekly when no preference is stored', async () => {
  const token = issueToken('nl-prefs', 'reader@example.test');
  const res = await call(prefsHandler, { url: prefsUrl('reader@example.test', token) });
  assert.equal(res.code, 200);
  assert.equal(res.body.frequency, 'weekly');
  assert.equal(res.body.email, 'reader@example.test');
});

test('GET returns the stored frequency', async () => {
  kvResponder = () => ({ ok: true, json: async () => [{ result: JSON.stringify({ frequency: 'monthly' }) }] });
  const token = issueToken('nl-prefs', 'reader@example.test');
  const res = await call(prefsHandler, { url: prefsUrl('reader@example.test', token) });
  assert.equal(res.code, 200);
  assert.equal(res.body.frequency, 'monthly');
});

test('POST rejects an unknown frequency', async () => {
  const token = issueToken('nl-prefs', 'reader@example.test');
  const res = await call(prefsHandler, {
    method: 'POST',
    url: prefsUrl('reader@example.test', token),
    body: JSON.stringify({ frequency: 'daily' }),
  });
  assert.equal(res.code, 400);
});

test('POST saves the preference with a one-year TTL', async () => {
  kvCalls.length = 0;
  kvResponder = () => ({ ok: true, json: async () => [{ result: 'OK' }] });
  const token = issueToken('nl-prefs', 'reader@example.test');
  const res = await call(prefsHandler, {
    method: 'POST',
    url: prefsUrl('reader@example.test', token),
    body: JSON.stringify({ frequency: 'monthly' }),
  });
  assert.equal(res.code, 200);
  assert.equal(res.body.ok, true);
  assert.equal(res.body.frequency, 'monthly');
  const saved = JSON.parse(kvCalls.at(-1).commands[0][2]);
  assert.equal(saved.frequency, 'monthly');
  assert.ok(Array.isArray(saved.sections));
  assert.equal(saved.sections.length, 4);
  assert.equal(kvCalls.at(-1).commands[0][3], 'EX');
  assert.equal(kvCalls.at(-1).commands[0][4], '31536000');
});

test('POST fails closed when KV is down', async () => {
  kvResponder = () => ({ ok: false });
  const token = issueToken('nl-prefs', 'reader@example.test');
  const res = await call(prefsHandler, {
    method: 'POST',
    url: prefsUrl('reader@example.test', token),
    body: JSON.stringify({ frequency: 'weekly' }),
  });
  assert.equal(res.code, 502);
});

/* ── monthly partition (pure logic) ─────────────────────────────── */

const subs = ['a@example.test', 'b@example.test', 'c@example.test'];

test('everyone gets the digest on a monthly-due send', () => {
  const langs = new Map([['b@example.test', 'fr']]);
  const prefs = new Map([['c@example.test', { frequency: 'monthly', sections: ['publications', 'tribunes'] }]]);
  const { recipients, includedMonthly } = planRecipients(subs, langs, prefs, true);
  assert.equal(recipients.length, 3);
  assert.equal(includedMonthly, true);
  assert.equal(recipients[0].email, 'a@example.test');
  assert.equal(recipients[0].lang, 'both');
  assert.ok(recipients[0].sections.length === 4);
  assert.equal(recipients[1].email, 'b@example.test');
  assert.equal(recipients[1].lang, 'fr');
  assert.equal(recipients[2].email, 'c@example.test');
  assert.deepEqual(recipients[2].sections, ['publications', 'tribunes']);
});

test('monthly subscribers are skipped outside their window', () => {
  const prefs = new Map([['c@example.test', { frequency: 'monthly', sections: ['publications'] }]]);
  const { recipients, includedMonthly } = planRecipients(subs, new Map(), prefs, false);
  assert.equal(recipients.length, 2);
  assert.equal(includedMonthly, false);
  assert.deepEqual(recipients.map((r) => r.email), ['a@example.test', 'b@example.test']);
});

test('no preference means weekly, always included', () => {
  const { recipients, includedMonthly } = planRecipients(subs, new Map(), new Map(), false);
  assert.equal(recipients.length, 3);
  assert.equal(includedMonthly, false);
});

test('an empty subscriber list yields nothing', () => {
  const { recipients, includedMonthly } = planRecipients([], new Map(), new Map(), true);
  assert.equal(recipients.length, 0);
  assert.equal(includedMonthly, false);
});
