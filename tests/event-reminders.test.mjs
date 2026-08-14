/* Contract tests for the per-event reminder feature:
 *   - api/event-reminders.ts serves both the /api/event-remind opt-in
 *     button + opt-out page and the daily cron that mails the reminders
 * Compiled to node_modules/.tmp/api by scripts/run-tests.mjs — run via
 * `npm test`, not directly.
 *
 * Nothing here talks to Resend or Redis: fetch is stubbed so every outgoing
 * email and KV pipeline is captured, mirroring tests/api.test.mjs and
 * tests/agenda-reminders.test.mjs. */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

process.env.RESEND_API_KEY = 'test-key';
process.env.CRON_SECRET = 'test-cron';
process.env.VERIFY_SECRET = 'test-secret';
process.env.NEWSLETTER_TO_EMAIL = 'admin@example.test';
process.env.NEWSLETTER_FROM_EMAIL = 'Portfolio <admin@example.test>';
process.env.KV_REST_API_URL = 'https://fake-kv.upstash.io/';
process.env.KV_REST_API_TOKEN = 'fake-token';

/* every email payload handed to the Resend API */
const sent = [];
/* every pipeline sent to the Upstash/Vercel KV REST endpoint */
const kvCalls = [];
/* the fake KV: sets (SMEMBERS/SADD/SREM), counters (SET NX/INCR for the
   rate limiter) and plain GET strings */
const store = { sets: new Map(), counters: new Map(), strings: new Map() };

function reset() {
  sent.length = 0;
  kvCalls.length = 0;
  store.sets.clear();
  store.counters.clear();
  store.strings.clear();
}

globalThis.fetch = async (url, opts) => {
  if (String(url).includes('/pipeline')) {
    const commands = JSON.parse(opts.body);
    kvCalls.push({ commands, auth: opts.headers.Authorization });
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
      if (op === 'EXPIRE') return { result: 'OK' };
      if (op === 'SET') {
        if (!store.counters.has(key)) store.counters.set(key, 0);
        return { result: 'OK' };
      }
      if (op === 'INCR') {
        const next = (store.counters.get(key) ?? 0) + 1;
        store.counters.set(key, next);
        return { result: next };
      }
      if (op === 'GET') return { result: store.strings.get(key) ?? null };
      return { result: 'OK' };
    });
    return { ok: true, json: async () => results };
  }
  sent.push(JSON.parse(opts.body));
  return { ok: true, text: async () => '' };
};

const remind = await import(pathToFileURL(path.resolve('node_modules/.tmp/api/event-reminders.js')).href);
const remindHandler = remind.default;
const { parseEventId } = remind;
const cron = await import(pathToFileURL(path.resolve('node_modules/.tmp/api/event-reminders.js')).href);
const cronHandler = cron.default;
const { dueTomorrow, pendingAddresses, subjectLine, pushPayload, run } = cron;

/* fixed "today": 2026-08-03, local time — see tests/calendar-links.test.mjs */
const FROM = new Date(2026, 7, 3);
const ITEMS = [
  { id: 'tomorrow', date: '2026-08-04', type: 'speaking', title: { fr: 'Titre A', en: 'Title A' }, location: { fr: 'Cotonou', en: 'Cotonou' }, description: { fr: 'Descr A', en: 'Descr A' } },
  { id: 'later', date: '2026-09-05', type: 'conference', title: { fr: 'Titre B', en: 'Title B' }, location: { fr: 'Dakar', en: 'Dakar' }, description: { fr: 'Descr B', en: 'Descr B' } },
  { id: 'past', date: '2026-01-01', type: 'community', title: { fr: 'Titre C', en: 'Title C' }, location: { fr: 'Paris', en: 'Paris' }, description: { fr: 'Descr C', en: 'Descr C' } },
];

/* a real agenda id, so the opt-out GET has something to point at — the
   module is already loaded by the handlers, sharing the same instance */
const agenda = await import(pathToFileURL(path.resolve('node_modules/.tmp/src/data/agenda.js')).href);
const REAL_ID = agenda.AGENDA_ITEMS[0]?.id;
const TOKENS = await import(pathToFileURL(path.resolve('node_modules/.tmp/api/_tokens.js')).href);

/* ── event-remind: parseEventId ─────────────────────────────────── */

test('parseEventId accepts a known, future event id', () => {
  assert.equal(parseEventId('tomorrow', { items: ITEMS, from: FROM }), 'tomorrow');
});

test('parseEventId refuses unknown or past ids, and emptiness', () => {
  assert.equal(parseEventId('no-such-event', { items: ITEMS, from: FROM }), null);
  assert.equal(parseEventId('past', { items: ITEMS, from: FROM }), null);
  assert.equal(parseEventId('', { items: ITEMS, from: FROM }), null);
});

/* ── event-reminders: pure logic ────────────────────────────────── */

test('dueTomorrow keeps only the events one day from today', () => {
  assert.deepEqual(dueTomorrow(ITEMS, FROM).map((e) => e.id), ['tomorrow']);
  assert.equal(dueTomorrow([], FROM).length, 0);
});

test('pendingAddresses keeps only addresses not yet mailed for the event', () => {
  assert.deepEqual(pendingAddresses(['a@example.test', 'b@example.test'], ['a@example.test']), ['b@example.test']);
  assert.deepEqual(pendingAddresses(['a@example.test'], null), ['a@example.test']);
  assert.deepEqual(pendingAddresses(['a@example.test'], undefined), ['a@example.test']);
});

test('subjectLine names the event in the subject', () => {
  assert.equal(subjectLine(ITEMS[0]), 'Rappel — 2026-08-04 — Titre A');
});

test('pushPayload announces tomorrow with a per-event tag', () => {
  const payload = JSON.parse(pushPayload(ITEMS[0]));
  assert.equal(payload.title, 'Agenda — demain : Titre A');
  assert.equal(payload.body, '2026-08-04 — Cotonou');
  assert.equal(payload.url, 'https://seynudedagnon.com/agenda');
  assert.equal(payload.tag, 'event-remind-tomorrow');
});

/* ── event-remind handler: POST opt-in ──────────────────────────── */

const call = async (handler, { method = 'POST', body = {}, headers = {} } = {}) => {
  const out = { code: 0, payload: null };
  const res = {
    status(c) { out.code = c; return res; },
    json(d) { out.payload = d; },
    send(d) { out.payload = d; },
    setHeader() {},
  };
  await handler(
    { method, body, url: '/api/event-remind', headers: { origin: 'https://seynudedagnon.com', 'x-forwarded-for': '10.0.0.1', ...headers }, socket: { remoteAddress: '10.0.0.2' } },
    res,
  );
  return out;
};

test('POST refuses anything but POST', async () => {
  const out = await call(remindHandler, { method: 'DELETE' });
  assert.equal(out.code, 405);
});

test('POST refuses cross-origin callers', async () => {
  const out = await call(remindHandler, { headers: { origin: 'https://evil.example' } });
  assert.equal(out.code, 403);
});

test('POST refuses an unknown or past event', async () => {
  reset();
  const unknown = await call(remindHandler, { body: { eventId: 'no-such-event', email: 'a@example.test' } });
  assert.equal(unknown.code, 400);
  /* the real agenda has no future events at test time, so a real id is
     refused too — the validator must reject before any store write.
     Rate-limit pipeline calls (SET+INCR) are allowed, but no SADD/SREM
     for event:remind:* must appear */
  const real = await call(remindHandler, { body: { eventId: REAL_ID, email: 'a@example.test' } });
  assert.equal(real.code, 400);
  const eventWrites = kvCalls.flatMap((c) => c.commands).filter((cmd) => cmd[1]?.startsWith?.('event:remind:'));
  assert.equal(eventWrites.length, 0, 'nothing must touch the event store on a refusal');
});

test('POST refuses a malformed email', async () => {
  reset();
  const out = await call(remindHandler, { body: { eventId: 'tomorrow', email: 'not-an-email' } });
  assert.equal(out.code, 400);
});

test('POST rate-limits the IP after five attempts', async () => {
  reset();
  for (let i = 0; i < 5; i++) {
    const out = await call(remindHandler, { body: { eventId: 'no-such-event', email: `a${i}@example.test` } });
    assert.equal(out.code, 400, `attempt ${i + 1} should pass the limiter`);
  }
  const sixth = await call(remindHandler, { body: { eventId: 'no-such-event', email: 'a6@example.test' } });
  assert.equal(sixth.code, 429);
});

/* ── event-remind handler: GET opt-out ──────────────────────────── */

const callGet = async (url) => {
  const out = { code: 0, payload: null };
  const res = {
    status(c) { out.code = c; return res; },
    send(d) { out.payload = d; },
    setHeader() {},
  };
  await remindHandler({ method: 'GET', headers: {}, url }, res);
  return out;
};

test('GET refuses a link without email or token', async () => {
  assert.equal((await callGet(`/api/event-remind?event=${REAL_ID}`)).code, 400);
  assert.equal((await callGet(`/api/event-remind?event=${REAL_ID}&email=a%40example.test`)).code, 400);
});

test('GET refuses an unknown event even with a valid token', async () => {
  const token = TOKENS.issueToken('ev-remind', 'a@example.test');
  const out = await callGet(`/api/event-remind?event=no-such&email=a%40example.test&token=${encodeURIComponent(token)}`);
  assert.equal(out.code, 400);
});

test('GET refuses a forged token', async () => {
  const out = await callGet(`/api/event-remind?event=${REAL_ID}&email=a%40example.test&token=deadbeef`);
  assert.equal(out.code, 400);
});

test('GET with a valid token removes the address and serves the page', async () => {
  reset();
  const email = 'a@example.test';
  const token = TOKENS.issueToken('ev-remind', email);
  store.sets.set(`event:remind:${REAL_ID}`, [email]);
  const out = await callGet(`/api/event-remind?event=${REAL_ID}&email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`);
  assert.equal(out.code, 200);
  assert.match(String(out.payload), /Rappel supprimé/);
  const srem = kvCalls.flatMap((c) => c.commands).find((cmd) => cmd[0] === 'SREM' && cmd[1] === `event:remind:${REAL_ID}`);
  assert.ok(srem, 'the address must be removed from the event set');
  assert.deepEqual(store.sets.get(`event:remind:${REAL_ID}`), [], 'the address is gone from the set');
});

/* ── cron: run ──────────────────────────────────────────────────── */

test('run mails each opted-in address once and records it, without push', async () => {
  reset();
  store.sets.set('event:remind:tomorrow', ['a@example.test', 'b@example.test']);
  const result = await run({ items: ITEMS, from: FROM, apiKey: 'test-key' });
  assert.deepEqual(result, { sent: 1, recipients: 2, pushed: 0 });

  assert.equal(sent.length, 2, 'one email per opted-in address');
  for (const mail of sent) {
    assert.equal(mail.from, 'Portfolio <admin@example.test>');
    assert.equal(mail.subject, 'Rappel — 2026-08-04 — Titre A');
    assert.match(mail.html, /Titre A/);
    assert.match(mail.html, /google\.com\/calendar\/render/);
    assert.match(mail.html, /outlook\.live\.com\/calendar/);
    const href = mail.html.match(/href="(https:\/\/seynudedagnon\.com\/api\/event-remind\?[^"]+)"/)?.[1];
    assert.ok(href, 'every copy must carry its own removal link');
    assert.ok(href.includes(`event=${ITEMS[0].id}`), 'the link must name the event');
    assert.ok(href.includes(`email=${encodeURIComponent(mail.to[0])}`), 'the link must be bound to the recipient');
    assert.ok(href.includes('&token='), 'the link must carry a token');
  }

  const add = kvCalls.flatMap((c) => c.commands).find((cmd) => cmd[0] === 'SADD' && cmd[1] === 'event:remind-sent:tomorrow');
  assert.ok(add, 'the mailed addresses must be recorded so the event is reminded exactly once');
  assert.deepEqual(add.slice(2), ['a@example.test', 'b@example.test']);
});

test('run skips addresses already mailed for the event', async () => {
  reset();
  store.sets.set('event:remind:tomorrow', ['a@example.test', 'b@example.test']);
  store.sets.set('event:remind-sent:tomorrow', ['a@example.test']);
  const result = await run({ items: ITEMS, from: FROM, apiKey: 'test-key' });
  assert.deepEqual(result, { sent: 1, recipients: 1, pushed: 0 });
  assert.deepEqual(sent.map((m) => m.to[0]), ['b@example.test']);
});

test('run sends nothing when no event is due or nobody opted in', async () => {
  reset();
  store.sets.set('event:remind:later', ['a@example.test']);
  const later = await run({ items: ITEMS, from: FROM, apiKey: 'test-key' });
  assert.deepEqual(later, { sent: 0, recipients: 0, pushed: 0 });
  assert.equal(sent.length, 0);
});

test('run skips when the api key is missing', async () => {
  reset();
  assert.deepEqual(await run({ items: ITEMS, from: FROM }), { skipped: true });
});

test('run skips when no token secret is set — dead removal links must never be mailed', () => {
  /* _tokens.ts reads VERIFY_SECRET at module scope, so the secret must be
     absent from a fresh module instance — a stripped child process */
  const script = `
    import { run } from ${JSON.stringify(pathToFileURL(path.resolve('node_modules/.tmp/api/event-reminders.js')).href)};
    const out = await run({ items: [], apiKey: 'test-key' });
    console.log(JSON.stringify(out));
  `;
  const child = spawnSync(process.execPath, ['--input-type=module', '-e', script], {
    encoding: 'utf8',
    env: { ...process.env, VERIFY_SECRET: '', RESEND_API_KEY: '' },
  });
  assert.equal(child.status, 0, child.stderr);
  assert.equal(child.stdout.trim(), JSON.stringify({ skipped: true }), 'a missing VERIFY_SECRET must skip the whole send');
});

/* ── cron handler: contract ─────────────────────────────────────── */

const callCron = async ({ method = 'GET', authorization } = {}) => {
  const out = { code: 0, payload: null };
  const res = {
    status(c) { out.code = c; return res; },
    json(d) { out.payload = d; },
    setHeader() {},
  };
  const headers = {};
  if (authorization !== undefined) headers.authorization = authorization;
  await cronHandler({ method, url: '/api/event-reminders', headers }, res);
  return out;
};

test('the cron refuses anything but GET', async () => {
  assert.equal((await callCron({ method: 'POST' })).code, 405);
});

test('the cron refuses requests without the secret', async () => {
  assert.equal((await callCron()).code, 401);
  assert.equal((await callCron({ authorization: 'Bearer wrong' })).code, 401);
});

test('a signed cron request answers with what was sent', async () => {
  reset();
  const out = await callCron({ authorization: 'Bearer test-cron' });
  assert.equal(out.code, 200);
  /* the real agenda has no event one day out at test time, and no opt-in
     sets exist for it — so a real run must send nothing */
  assert.deepEqual(out.payload, { ok: true, sent: 0, recipients: 0, pushed: 0 });
  assert.equal(sent.length, 0);
});
