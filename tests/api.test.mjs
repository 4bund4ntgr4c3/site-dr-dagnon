/* Contract tests for the two serverless handlers.
 * Compiled to node_modules/.tmp/api by scripts/run-tests.mjs — run via
 * `npm test`, not directly.
 *
 * Nothing here talks to Resend: fetch is stubbed and every outgoing email is
 * captured so the templates can be inspected. */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const FAKE_PHONE = '+000 11 22 33 44 - +000 55 66 77 88';

process.env.RESEND_API_KEY = 'test-key';
process.env.VERIFY_SECRET = 'test-secret';
process.env.CONTACT_PHONE = FAKE_PHONE;
process.env.CONTACT_TO_EMAIL = 'admin@example.test';

/** every payload handed to the Resend API */
const sent = [];
/** every pipeline sent to the Upstash/Vercel KV REST endpoint */
const kvCalls = [];
/** set by a test to control what the fake KV replies */
let kvResponder = null;

globalThis.fetch = async (url, opts) => {
  if (String(url).includes('/pipeline')) {
    kvCalls.push({ url: String(url), commands: JSON.parse(opts.body), auth: opts.headers.Authorization });
    return kvResponder ? kvResponder() : { ok: true, json: async () => [{ result: 'OK' }, { result: 1 }] };
  }
  sent.push(JSON.parse(opts.body));
  return { ok: true, text: async () => '' };
};

const load = async (name) => {
  const file = path.resolve('node_modules/.tmp/api', name);
  return (await import(pathToFileURL(file).href)).default;
};
const verifyPhone = await load('verify-phone.js');
const contact = await load('contact.js');
const newsletter = await load('newsletter.js');
const { rateLimit, usingSharedStore } = await import(
  pathToFileURL(path.resolve('node_modules/.tmp/api/_rate-limit.js')).href
);

const SITE_ORIGIN = 'https://seynudedagnon.com';

const call = async (handler, body, { ip = '10.0.0.1', method = 'POST', origin = SITE_ORIGIN, headers } = {}) => {
  const out = { code: 0, body: null };
  const res = {
    status(c) { out.code = c; return res; },
    json(d) { out.body = d; },
  };
  const base = { 'x-forwarded-for': ip };
  if (origin !== null) base.origin = origin;
  await handler({ method, headers: headers ?? base, body }, res);
  return out;
};

/** requests a code and digs it back out of the captured email */
const requestCode = async (email, ip) => {
  const res = await call(verifyPhone, { action: 'send', email }, { ip });
  const code = sent.at(-1)?.text.match(/code is: ([A-Z0-9]+)/)?.[1];
  return { res, code };
};

/* ── verify-phone: the phone number must never leave without a valid code ── */

test('send issues a token and never returns the phone number', async () => {
  const { res, code } = await requestCode('reader@example.test', '10.1.0.1');
  assert.equal(res.code, 200);
  assert.ok(res.body.token, 'expected a token');
  assert.doesNotMatch(JSON.stringify(res.body), /\d{2} \d{2} \d{2} \d{2}/, 'phone leaked in the send response');
  assert.match(code, /^[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{6}$/, `unexpected code shape: ${code}`);
  assert.ok(!res.body.token.includes(code), 'token must not carry the code in clear');
});

test('a valid code returns the phone number', async () => {
  const { res, code } = await requestCode('ok@example.test', '10.1.0.2');
  const verified = await call(verifyPhone, { action: 'verify', email: 'ok@example.test', code, token: res.body.token }, { ip: '10.1.0.2' });
  assert.equal(verified.code, 200);
  assert.equal(verified.body.phone, FAKE_PHONE);
});

test('the code is case-insensitive and tolerates whitespace', async () => {
  const { res, code } = await requestCode('case@example.test', '10.1.0.3');
  const verified = await call(verifyPhone, { action: 'verify', email: 'case@example.test', code: `  ${code.toLowerCase()} `, token: res.body.token }, { ip: '10.1.0.3' });
  assert.equal(verified.code, 200);
});

test('a wrong code is rejected without revealing the phone number', async () => {
  const { res } = await requestCode('wrong@example.test', '10.1.0.4');
  const verified = await call(verifyPhone, { action: 'verify', email: 'wrong@example.test', code: 'AAAAAA', token: res.body.token }, { ip: '10.1.0.4' });
  assert.equal(verified.code, 400);
  assert.equal(verified.body.error, 'Invalid code');
  assert.ok(!verified.body.phone);
});

test('a code without its token is rejected', async () => {
  const { code } = await requestCode('notoken@example.test', '10.1.0.5');
  const verified = await call(verifyPhone, { action: 'verify', email: 'notoken@example.test', code }, { ip: '10.1.0.5' });
  assert.equal(verified.code, 400);
  assert.ok(!verified.body.phone);
});

test('a token is bound to the email it was issued for', async () => {
  const { res, code } = await requestCode('owner@example.test', '10.1.0.6');
  const verified = await call(verifyPhone, { action: 'verify', email: 'attacker@example.test', code, token: res.body.token }, { ip: '10.1.0.6' });
  assert.equal(verified.code, 400);
  assert.ok(!verified.body.phone);
});

test('a tampered token payload fails the signature check', async () => {
  const { res, code } = await requestCode('tamper@example.test', '10.1.0.7');
  const [payload, signature] = res.body.token.split('.');
  const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'));
  /* push the expiry far into the future and keep the original signature */
  const forged = Buffer.from(JSON.stringify({ ...decoded, x: Date.now() + 9e9 })).toString('base64url');
  const verified = await call(verifyPhone, { action: 'verify', email: 'tamper@example.test', code, token: `${forged}.${signature}` }, { ip: '10.1.0.7' });
  assert.equal(verified.code, 400);
  assert.ok(!verified.body.phone);
});

test('an expired token is reported as expired, not accepted', async () => {
  const payload = Buffer.from(JSON.stringify({ e: 'old@example.test', x: Date.now() - 1000, h: 'whatever' })).toString('base64url');
  const verified = await call(verifyPhone, { action: 'verify', email: 'old@example.test', code: 'ABCDEF', token: `${payload}.bogus-signature` }, { ip: '10.1.0.8' });
  assert.equal(verified.code, 400);
  assert.ok(!verified.body.phone);
});

test('non-POST methods are refused', async () => {
  const out = await call(verifyPhone, {}, { method: 'GET' });
  assert.equal(out.code, 405);
});

test('fails closed when CONTACT_PHONE is not configured', async () => {
  const prev = process.env.CONTACT_PHONE;
  delete process.env.CONTACT_PHONE;
  try {
    /* a fresh module instance (cache-busted), so the module-scope
       PHONE constant is recomputed without the env var */
    const url = pathToFileURL(path.resolve('node_modules/.tmp/api/verify-phone.js')).href + `?nophone=${Date.now()}`;
    const handler = (await import(url)).default;
    const out = await call(handler, { action: 'send', email: 'nophone@example.test' }, { ip: '10.1.0.10' });
    assert.equal(out.code, 500);
    assert.equal(out.body.error, 'Phone not configured');
    assert.ok(!out.body.phone);
  } finally {
    process.env.CONTACT_PHONE = prev;
  }
});

test('an invalid email is refused before any email is sent', async () => {
  const before = sent.length;
  const out = await call(verifyPhone, { action: 'send', email: 'not-an-email' }, { ip: '10.1.0.9' });
  assert.equal(out.code, 400);
  assert.equal(sent.length, before, 'no email should have been sent');
});

/* ── contact: visitor input is interpolated into HTML emails ──────────── */

test('injected markup cannot become live HTML in the emails', async () => {
  const before = sent.length;
  const out = await call(contact, {
    name: '<a href="https://phish.example">Click me</a>',
    email: 'evil"onmouseover="alert(1)@example.test',
    phone: '+229 01 02 03 04',
    subject: '<img src=x onerror=alert(1)>',
    message: '<script>alert(1)</script>',
  }, { ip: '10.2.0.1' });
  assert.equal(out.code, 200);

  const html = sent.slice(before).map((m) => m.html).join('\n');
  assert.ok(html, 'expected at least one HTML email');
  assert.doesNotMatch(html, /<a href="https:\/\/phish\.example/i, 'injected anchor became live');
  assert.doesNotMatch(html, /<script>/i, 'injected script tag survived');
  assert.doesNotMatch(html, /<img/i, 'injected img tag survived');
  assert.doesNotMatch(html, /<[^>]*onerror=/i, 'an event handler attribute was formed');
  assert.doesNotMatch(html, /onmouseover="/, 'the quote broke out of an attribute');
  /* the text is still readable, just inert */
  assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  for (const href of html.match(/href="[^"]*"/g) || []) {
    assert.ok(!href.slice(6, -1).includes('"'), `malformed href: ${href}`);
  }
});

test('the auto-reply is escaped as well as the admin notification', async () => {
  const before = sent.length;
  await call(contact, {
    name: '<b>bold</b>',
    email: 'visitor@example.test',
    phone: '+229 01 02 03 04',
    subject: '<i>subject</i>',
    message: 'hello',
  }, { ip: '10.2.0.2' });
  const autoReply = sent.slice(before).find((m) => m.subject?.startsWith('Thank you'));
  assert.ok(autoReply, 'no auto-reply was sent');
  assert.doesNotMatch(autoReply.html, /<b>bold<\/b>/);
  assert.match(autoReply.html, /&lt;b&gt;bold&lt;\/b&gt;/);
});

test('a recognized request type prefixes the subject and is labelled in the email', async () => {
  const before = sent.length;
  const out = await call(contact, {
    name: 'Reporter',
    email: 'press@example.test',
    phone: '+229 01 02 03 04',
    subject: 'Press inquiry about the campaign',
    message: 'Hello',
    type: 'press',
    typeLabel: 'Press',
  }, { ip: '10.2.0.4' });
  assert.equal(out.code, 200);
  const admin = sent.slice(before).find((m) => m.subject?.startsWith('Website contact'));
  assert.ok(admin, 'no admin notification was sent');
  assert.match(admin.subject, /\[Press\]/, 'the request type should prefix the subject');
  assert.match(admin.html, /Request type/, 'the admin email should label the request type');
  assert.match(admin.html, />Press</);
});

test('an unknown request type falls back to a general message', async () => {
  const before = sent.length;
  await call(contact, {
    name: 'A',
    email: 'a@example.test',
    phone: '+229 01 02 03 04',
    message: 'hi',
    type: 'not-a-real-type',
    typeLabel: 'Impostor',
  }, { ip: '10.2.0.5' });
  const admin = sent.slice(before).find((m) => m.subject?.startsWith('Website contact'));
  assert.ok(admin, 'no admin notification was sent');
  assert.doesNotMatch(admin.subject, /Impostor/);
  assert.doesNotMatch(admin.html, /Request type/);
});

test('missing required fields are refused', async () => {
  const before = sent.length;
  const out = await call(contact, { name: 'A', email: 'a@example.test' }, { ip: '10.2.0.3' });
  assert.equal(out.code, 400);
  assert.equal(sent.length, before);
});

test('an invalid phone number is refused', async () => {
  const before = sent.length;
  const out = await call(contact, { name: 'A', email: 'a@example.test', phone: 'not-a-phone', message: 'hi' }, { ip: '10.2.0.6' });
  assert.equal(out.code, 400);
  assert.equal(out.body.error, 'Invalid phone');
  assert.equal(sent.length, before, 'no email should have been sent');
});

/* ── newsletter: subscribe once, welcome once ─────────────────────────── */

/** sets the fake KV up and makes the SADD pipeline reply with `saddResult` */
const withNewsletterKv = async (fn, saddResult = 1) => {
  process.env.KV_REST_API_URL = 'https://fake-kv.upstash.io/';
  process.env.KV_REST_API_TOKEN = 'fake-token';
  kvCalls.length = 0;
  kvResponder = () => ({ ok: true, json: async () => [{ result: saddResult }] });
  try {
    return await fn();
  } finally {
    delete process.env.KV_REST_API_URL;
    delete process.env.KV_REST_API_TOKEN;
    kvResponder = null;
  }
};

const saddCalls = () => kvCalls.filter((c) => c.commands?.[0]?.[0] === 'SADD');
const lastEmail = () => sent.at(-1);

test('a valid subscription stores the address and sends a welcome email', async () => {
  await withNewsletterKv(async () => {
    const before = sent.length;
    const out = await call(newsletter, { email: 'Sub@Example.COM', lang: 'en' }, { ip: '10.6.0.1' });
    assert.equal(out.code, 200);
    assert.deepEqual(out.body, { ok: true });

    const sadd = saddCalls();
    assert.equal(sadd.length, 1, 'expected exactly one SADD pipeline');
    assert.equal(sadd[0].url, 'https://fake-kv.upstash.io/pipeline');
    assert.equal(sadd[0].auth, 'Bearer fake-token');
    assert.deepEqual(sadd[0].commands[0], ['SADD', 'newsletter:emails', 'sub@example.com'], 'the address is stored lowercased');

    const mail = lastEmail();
    assert.equal(sent.length, before + 1, 'expected exactly one welcome email');
    assert.match(mail.subject, /Welcome to Dr\. Dagnon/);
    assert.match(mail.html, /Thank you for subscribing/);
    assert.equal(mail.to[0], 'sub@example.com');
  });
});

test('a known address is not welcomed twice', async () => {
  await withNewsletterKv(async () => {
    const before = sent.length;
    const out = await call(newsletter, { email: 'old@example.test', lang: 'en' }, { ip: '10.6.0.2' });
    assert.equal(out.code, 200);
    assert.deepEqual(out.body, { ok: true, already: true });
    assert.equal(sent.length, before, 'a re-subscription must not send another welcome email');
  }, 0);
});

test('the welcome email follows the visitor language', async () => {
  await withNewsletterKv(async () => {
    const out = await call(newsletter, { email: 'fr@example.test', lang: 'fr' }, { ip: '10.6.0.3' });
    assert.equal(out.code, 200);
    const mail = lastEmail();
    assert.match(mail.subject, /Bienvenue/);
    assert.match(mail.html, /Merci de votre inscription/);
  });
});

test('an invalid email is refused before anything is stored or sent', async () => {
  await withNewsletterKv(async () => {
    const beforeSent = sent.length;
    const out = await call(newsletter, { email: 'not-an-email' }, { ip: '10.6.0.4' });
    assert.equal(out.code, 400);
    assert.equal(out.body.error, 'Invalid email');
    assert.equal(sent.length, beforeSent);
    assert.equal(saddCalls().length, 0, 'nothing should reach the store');
  });
});

test('a missing email is refused', async () => {
  const out = await call(newsletter, { lang: 'fr' }, { ip: '10.6.0.5' });
  assert.equal(out.code, 400);
});

test('a filled honeypot is dropped silently, without storing or sending', async () => {
  await withNewsletterKv(async () => {
    const beforeSent = sent.length;
    const out = await call(newsletter, { email: 'bot@example.test', website: 'http://spam.example' }, { ip: '10.6.0.6' });
    assert.equal(out.code, 200);
    assert.deepEqual(out.body, { ok: true });
    assert.equal(sent.length, beforeSent);
    assert.equal(saddCalls().length, 0);
  });
});

test('subscriptions still work when the store is down', async () => {
  await withNewsletterKv(async () => {
    kvResponder = () => ({ ok: false, json: async () => ({}) });
    const before = sent.length;
    const out = await call(newsletter, { email: 'outage@example.test' }, { ip: '10.6.0.7' });
    assert.equal(out.code, 200, 'a store outage must not block the subscription');
    assert.equal(sent.length, before + 1, 'the welcome email should still go out');
  });
});

test('subscriptions still work with no store configured at all', async () => {
  const beforeSent = sent.length;
  const beforeKv = kvCalls.length;
  const out = await call(newsletter, { email: 'nokv@example.test' }, { ip: '10.6.0.8' });
  assert.equal(out.code, 200);
  assert.equal(sent.length, beforeSent + 1);
  assert.equal(kvCalls.length, beforeKv, 'no store configured, so nothing should be sent');
});

test('newsletter is capped per IP', async () => {
  const results = [];
  for (let i = 0; i < 8; i++) {
    results.push(await call(newsletter, { email: `ip${i}@example.test` }, { ip: '10.6.1.1' }));
  }
  assert.ok(results.some((r) => r.code === 429), 'expected at least one 429');
});

test('newsletter is capped per email address', async () => {
  const results = [];
  for (let i = 0; i < 4; i++) {
    results.push(await call(newsletter, { email: 'flood-sub@example.test' }, { ip: `10.6.2.${i}` }));
  }
  assert.ok(results.some((r) => r.code === 429), 'expected at least one 429');
});

/* ── rate limiting — last, because the counters are module state ──────── */

test('send is capped per email address', async () => {
  const before = sent.length;
  const results = [];
  for (let i = 0; i < 5; i++) {
    results.push(await call(verifyPhone, { action: 'send', email: 'flood@example.test' }, { ip: '10.3.0.1' }));
  }
  assert.ok(results.some((r) => r.code === 429), 'expected at least one 429');
  assert.ok(sent.length - before <= 3, `sent ${sent.length - before} emails, cap is 3`);
});

test('contact is capped per IP', async () => {
  const results = [];
  for (let i = 0; i < 8; i++) {
    results.push(await call(contact, { name: 'A', email: 'a@example.test', phone: '+229 01 02 03 04', message: 'hi' }, { ip: '10.3.0.2' }));
  }
  assert.ok(results.some((r) => r.code === 429), 'expected at least one 429');
});


/* ── origin gate and honeypot ─────────────────────────────────────────── */

test('a request with no Origin header is refused', async () => {
  const before = sent.length;
  for (const handler of [contact, verifyPhone, newsletter]) {
    const out = await call(handler, { action: 'send', email: 'x@example.test', name: 'A', message: 'hi' }, { origin: null, ip: '10.4.0.1' });
    assert.equal(out.code, 403);
  }
  assert.equal(sent.length, before, 'nothing should have been sent');
});

test('a request from another site is refused', async () => {
  const before = sent.length;
  for (const handler of [contact, verifyPhone, newsletter]) {
    const out = await call(handler, { action: 'send', email: 'x@example.test', name: 'A', message: 'hi' }, { origin: 'https://evil.example', ip: '10.4.0.2' });
    assert.equal(out.code, 403);
  }
  assert.equal(sent.length, before, 'nothing should have been sent');
});

test('a lookalike origin does not slip through', async () => {
  for (const origin of ['https://seynudedagnon.com.evil.example', 'http://seynudedagnon.com', 'https://notseynudedagnon.com']) {
    const out = await call(contact, { name: 'A', email: 'a@example.test', phone: '+229 01 02 03 04', message: 'hi' }, { origin, ip: '10.4.0.3' });
    assert.equal(out.code, 403, `${origin} should be refused`);
  }
});

test('previews and local development are allowed', async () => {
  /* sd.studio26.online is this project's actual staging domain — a same-origin
     POST from it was rejected by an earlier version of this allowlist that
     only knew about *.vercel.app, which is the exact bug this test exists to
     catch a second time. */
  for (const origin of [
    'http://localhost:3000',
    'https://site-dr-dagnon-abc123.vercel.app',
    'https://www.seynudedagnon.com',
    'https://sd.studio26.online',
    'https://any-project.studio26.online',
  ]) {
    const out = await call(contact, { name: 'A', email: 'a@example.test', phone: '+229 01 02 03 04', message: 'hi' }, { origin, ip: `10.4.1.${origin.length}` });
    assert.notEqual(out.code, 403, `${origin} should be allowed`);
  }
});

test('a studio26.online lookalike does not slip through', async () => {
  for (const origin of ['https://studio26.online.evil.example', 'http://sd.studio26.online', 'https://sd.studio26.online.evil.example']) {
    const out = await call(contact, { name: 'A', email: 'a@example.test', phone: '+229 01 02 03 04', message: 'hi' }, { origin, ip: '10.4.1.9' });
    assert.equal(out.code, 403, `${origin} should be refused`);
  }
});

test('the Referer header is accepted when Origin is absent', async () => {
  const out = await call(contact, { name: 'A', email: 'a@example.test', phone: '+229 01 02 03 04', message: 'hi' }, {
    headers: { 'x-forwarded-for': '10.4.2.1', referer: 'https://seynudedagnon.com/contact' },
  });
  assert.notEqual(out.code, 403);
});

test('a filled honeypot is dropped silently, without sending anything', async () => {
  const before = sent.length;
  const out = await call(contact, {
    name: 'Spam Bot',
    email: 'bot@example.test',
    message: 'buy things',
    website: 'http://spam.example',
  }, { ip: '10.5.0.1' });
  /* 200 on purpose: a bot must not learn that it was caught */
  assert.equal(out.code, 200);
  assert.deepEqual(out.body, { ok: true });
  assert.equal(sent.length, before, 'the honeypot submission must not send email');
});

test('an empty honeypot field does not block a real visitor', async () => {
  const before = sent.length;
  const out = await call(contact, { name: 'Real Person', email: 'real@example.test', phone: '+229 01 02 03 04', message: 'hello', website: '' }, { ip: '10.5.0.2' });
  assert.equal(out.code, 200);
  assert.ok(sent.length > before, 'a genuine message should still be sent');
});


/* ── shared rate-limit store ──────────────────────────────────────────
   In-memory counters live in one lambda instance, so they only slow a
   single client down. These cover the shared backend and, just as
   importantly, what happens when it is unavailable. */

const withKv = async (fn) => {
  process.env.KV_REST_API_URL = 'https://fake-kv.upstash.io/';
  process.env.KV_REST_API_TOKEN = 'fake-token';
  kvCalls.length = 0;
  try {
    return await fn();
  } finally {
    delete process.env.KV_REST_API_URL;
    delete process.env.KV_REST_API_TOKEN;
    kvResponder = null;
  }
};

test('the shared store is off until credentials are provided', async () => {
  assert.equal(usingSharedStore(), false);
  await withKv(async () => assert.equal(usingSharedStore(), true));
  assert.equal(usingSharedStore(), false, 'credentials must not leak between requests');
});

test('with credentials, counting happens in the shared store', async () => {
  await withKv(async () => {
    let count = 0;
    kvResponder = () => ({ ok: true, json: async () => [{ result: 'OK' }, { result: ++count }] });
    const verdicts = [];
    for (let i = 0; i < 4; i++) verdicts.push(await rateLimit('demo:key', 3, 60_000));
    assert.deepEqual(verdicts, [true, true, true, false], 'should allow exactly max requests');
    assert.equal(kvCalls.length, 4, 'every check must reach the store');
  });
});

test('the pipeline creates the counter with its expiry, then increments', async () => {
  await withKv(async () => {
    await rateLimit('contact:ip:9.9.9.9', 5, 60_000);
    const { url, commands, auth } = kvCalls[0];
    assert.equal(url, 'https://fake-kv.upstash.io/pipeline', 'trailing slash must be normalised');
    assert.equal(auth, 'Bearer fake-token');
    assert.deepEqual(commands[0], ['SET', 'rl:contact:ip:9.9.9.9', '0', 'EX', '60', 'NX'], 'SET NX EX seeds the window');
    assert.deepEqual(commands[1], ['INCR', 'rl:contact:ip:9.9.9.9']);
  });
});

test('a store outage falls back to counting in memory rather than failing', async () => {
  await withKv(async () => {
    kvResponder = () => ({ ok: false, json: async () => ({}) });
    assert.equal(await rateLimit('outage:http-error', 2, 60_000), true, 'must not block the request');
  });
  await withKv(async () => {
    kvResponder = () => { throw new Error('network down'); };
    assert.equal(await rateLimit('outage:thrown', 2, 60_000), true, 'a thrown fetch must be caught');
  });
});

test('a malformed store reply is treated as unavailable', async () => {
  await withKv(async () => {
    kvResponder = () => ({ ok: true, json: async () => [{ result: 'OK' }, { result: 'not-a-number' }] });
    assert.equal(await rateLimit('garbage:reply', 2, 60_000), true);
  });
});

test('the fallback still enforces a limit', async () => {
  /* no credentials here: this is the in-memory path */
  const before = kvCalls.length;
  const verdicts = [];
  for (let i = 0; i < 4; i++) verdicts.push(await rateLimit('memory:only', 2, 60_000));
  assert.deepEqual(verdicts, [true, true, false, false]);
  assert.equal(kvCalls.length, before, 'no store configured, so nothing should be sent');
});
