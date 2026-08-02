/* Contract tests for the weekly agenda-reminder cron handler.
 * Compiled to node_modules/.tmp/api by scripts/run-tests.mjs — run via
 * `npm test`, not directly.
 *
 * Nothing here talks to Resend or Redis: fetch is stubbed so every outgoing
 * email and KV pipeline is captured, mirroring tests/api.test.mjs. */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

process.env.RESEND_API_KEY = 'test-key';
process.env.CRON_SECRET = 'test-cron';
process.env.NEWSLETTER_TO_EMAIL = 'admin@example.test';
process.env.NEWSLETTER_FROM_EMAIL = 'Portfolio <admin@example.test>';
process.env.KV_REST_API_URL = 'https://fake-kv.upstash.io/';
process.env.KV_REST_API_TOKEN = 'fake-token';

/** every payload handed to the Resend API */
const sent = [];
/** every pipeline sent to the Upstash/Vercel KV REST endpoint */
const kvCalls = [];
/** what the fake KV stores for agenda:reminded */
let reminded = [];
/** the fake subscriber set */
let subscribers = ['sub@example.test'];
/** whether the fake Resend accepts the send */
let resendOk = true;

globalThis.fetch = async (url, opts) => {
  if (String(url).includes('/pipeline')) {
    const commands = JSON.parse(opts.body);
    kvCalls.push({ commands, auth: opts.headers.Authorization });
    const results = commands.map(([op]) =>
      op === 'GET' ? { result: JSON.stringify({ ids: reminded }) }
        : op === 'SMEMBERS' ? { result: subscribers }
          : { result: 'OK' });
    return { ok: true, json: async () => results };
  }
  sent.push(JSON.parse(opts.body));
  return resendOk ? { ok: true, text: async () => '' } : { ok: false, text: async () => 'boom' };
};

const mod = await import(pathToFileURL(path.resolve('node_modules/.tmp/api/agenda-reminders.js')).href);
const handler = mod.default;
const { upcoming, plan, chunk, subjectLine, reminderText, run } = mod;

/* fixed "today": 2026-08-03, local time — see tests/calendar-links.test.mjs */
const FROM = new Date(2026, 7, 3);
const ITEMS = [
  { id: 'soon', date: '2026-08-10', type: 'speaking', title: { fr: 'Titre A', en: 'Title A' }, location: { fr: 'Cotonou', en: 'Cotonou' }, description: { fr: 'Descr A', en: 'Descr A' } },
  { id: 'later', date: '2026-09-05', type: 'conference', title: { fr: 'Titre B', en: 'Title B' }, location: { fr: 'Dakar', en: 'Dakar' }, description: { fr: 'Descr B', en: 'Descr B' } },
  { id: 'past', date: '2026-01-01', type: 'community', title: { fr: 'Titre C', en: 'Title C' }, location: { fr: 'Paris', en: 'Paris' }, description: { fr: 'Descr C', en: 'Descr C' } },
];

const call = async (handler, { method = 'GET', authorization } = {}) => {
  const out = { code: 0, body: null };
  const res = {
    status(c) { out.code = c; return res; },
    json(d) { out.body = d; },
  };
  const headers = { 'x-forwarded-for': '10.0.0.1' };
  if (authorization !== undefined) headers.authorization = authorization;
  await handler({ method, headers }, res);
  return out;
};

/* ── pure logic ─────────────────────────────────────────────────── */

test('upcoming keeps only the events within the horizon, soonest first', () => {
  const due = upcoming(ITEMS, FROM);
  assert.deepEqual(due.map((e) => e.id), ['soon']);
  assert.equal(due[0].days, 7);
});

test('an event happening today is included', () => {
  const items = [{ id: 'today', date: '2026-08-03', type: 'speaking', title: { fr: 'T', en: 'T' }, location: { fr: 'L', en: 'L' }, description: { fr: 'D', en: 'D' } }];
  const due = upcoming(items, FROM);
  assert.equal(due.length, 1);
  assert.equal(due[0].days, 0);
});

test('plan skips events already reminded and keeps their ids', () => {
  const used = plan(ITEMS, { ids: ['soon'] }, FROM);
  assert.deepEqual(used.send.map((e) => e.id), []);
  assert.deepEqual(used.nextIds, ['soon']);
});

test('plan with a fresh state sends the due events and records them', () => {
  const fresh = plan(ITEMS, { ids: [] }, FROM);
  assert.deepEqual(fresh.send.map((e) => e.id), ['soon']);
  assert.deepEqual(fresh.nextIds, ['soon']);
});

test('plan tolerates a null state (no store yet)', () => {
  const fresh = plan(ITEMS, null, FROM);
  assert.deepEqual(fresh.send.map((e) => e.id), ['soon']);
});

test('chunk splits into fixed-size batches', () => {
  assert.deepEqual(chunk([1, 2, 3, 4, 5], 2), [[1, 2], [3, 4], [5]]);
  assert.deepEqual(chunk([], 50), []);
});

test('subjectLine agrees in number and language', () => {
  assert.equal(subjectLine([ITEMS[0]]), 'Agenda — 1 événement à venir / 1 upcoming event');
  assert.equal(subjectLine(ITEMS), 'Agenda — 3 événements à venir / 3 upcoming events');
});

test('reminderText lists every event with the agenda link', () => {
  const text = reminderText([ITEMS[0]]);
  assert.match(text, /2026-08-10 — Titre A \/ Title A/);
  assert.match(text, /Cotonou/);
  assert.match(text, /https:\/\/seynudedagnon.com\/agenda/);
});

/* ── run: full send through the stubbed stores ──────────────────── */

test('run sends one email per batch of subscribers and records the ids', async () => {
  reminded = [];
  sent.length = 0;
  kvCalls.length = 0;
  const result = await run({ items: ITEMS, from: FROM, owner: 'admin@example.test', apiKey: 'test-key' });
  assert.deepEqual(result, { sent: 1, recipients: 1 });

  const mail = sent.at(-1);
  assert.equal(mail.from, 'Portfolio <admin@example.test>');
  assert.deepEqual(mail.to, ['admin@example.test']);
  assert.deepEqual(mail.bcc, ['sub@example.test']);
  assert.equal(mail.subject, 'Agenda — 1 événement à venir / 1 upcoming event');
  assert.match(mail.html, /Titre A/);
  assert.match(mail.html, /google\.com\/calendar\/render/);
  assert.match(mail.html, /outlook\.live\.com\/calendar/);
  assert.match(mail.text, /Agenda: https:\/\/seynudedagnon.com\/agenda/);

  const set = kvCalls.find((c) => c.commands[0]?.[0] === 'SET');
  assert.deepEqual(set.commands, [['SET', 'agenda:reminded', JSON.stringify({ ids: ['soon'] }), 'EX', '7884000']]);
  assert.equal(set.auth, 'Bearer fake-token');
});

test('run splits a large subscriber set into 50-recipient batches', async () => {
  subscribers = Array.from({ length: 120 }, (_, i) => `sub${i}@example.test`);
  reminded = [];
  sent.length = 0;
  kvCalls.length = 0;
  await run({ items: ITEMS, from: FROM, owner: 'admin@example.test', apiKey: 'test-key' });
  assert.equal(sent.length, 3);
  assert.equal(sent[0].bcc.length, 50);
  assert.equal(sent[1].bcc.length, 50);
  assert.equal(sent[2].bcc.length, 20);
  subscribers = ['sub@example.test'];
});

test('run sends nothing when every due event was already reminded', async () => {
  reminded = ['soon'];
  sent.length = 0;
  kvCalls.length = 0;
  const result = await run({ items: ITEMS, from: FROM, owner: 'admin@example.test', apiKey: 'test-key' });
  assert.deepEqual(result, { sent: 0, recipients: 1 });
  assert.equal(sent.length, 0, 'no email should go out');
  assert.ok(!kvCalls.some((c) => c.commands[0]?.[0] === 'SET'), 'nothing should be recorded');
});

test('run skips when the owner or the api key is missing', async () => {
  assert.deepEqual(await run({ items: ITEMS, from: FROM }), { skipped: true });
});

test('run fails loudly when Resend refuses a batch', async () => {
  reminded = [];
  resendOk = false;
  try {
    await assert.rejects(
      () => run({ items: ITEMS, from: FROM, owner: 'admin@example.test', apiKey: 'test-key' }),
      /Resend batch 1\/1 failed: boom/,
    );
  } finally {
    resendOk = true;
  }
});

/* ── handler: cron contract ─────────────────────────────────────── */

test('the handler refuses anything but GET', async () => {
  const out = await call(handler, { method: 'POST' });
  assert.equal(out.code, 405);
});

test('the handler refuses requests without the cron secret', async () => {
  assert.equal((await call(handler, { method: 'GET' })).code, 401);
  assert.equal((await call(handler, { method: 'GET', authorization: 'Bearer wrong' })).code, 401);
});

test('a signed request answers with what was sent', async () => {
  reminded = [];
  sent.length = 0;
  kvCalls.length = 0;
  const out = await call(handler, { method: 'GET', authorization: 'Bearer test-cron' });
  assert.equal(out.code, 200);
  /* every real agenda entry is in the past, so a real run sends nothing */
  assert.deepEqual(out.body, { ok: true, sent: 0, recipients: 1 });
  assert.equal(sent.length, 0);
});
