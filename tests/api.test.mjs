/* Contract tests for the two serverless handlers.
 * Compiled to node_modules/.tmp/api by scripts/run-tests.mjs — run via
 * `npm test`, not directly.
 *
 * Nothing here talks to Resend: fetch is stubbed and every outgoing email is
 * captured so the templates can be inspected. */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
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
/** whether the fake Resend accepts the send (false → provider outage) */
let resendOk = true;

globalThis.fetch = async (url, opts) => {
  if (String(url).includes('/pipeline')) {
    kvCalls.push({ url: String(url), commands: JSON.parse(opts.body), auth: opts.headers.Authorization });
    return kvResponder ? kvResponder() : { ok: true, json: async () => [{ result: 'OK' }, { result: 1 }] };
  }
  sent.push(JSON.parse(opts.body));
  return resendOk ? { ok: true, text: async () => '' } : { ok: false, text: async () => 'provider down' };
};

const load = async (name) => {
  const file = path.resolve('node_modules/.tmp/api', name);
  return (await import(pathToFileURL(file).href)).default;
};
const verifyPhone = await load('contact.js');
const contact = await load('contact.js');
const newsletter = await load('newsletter.js');
const { rateLimit, usingSharedStore } = await import(
  pathToFileURL(path.resolve('node_modules/.tmp/api/_rate-limit.js')).href
);

const SITE_ORIGIN = 'https://seynudedagnon.com';

const call = async (handler, body, { ip = '10.0.0.1', method = 'POST', origin = SITE_ORIGIN, headers, url } = {}) => {
  const out = { code: 0, body: null };
  const res = {
    status(c) { out.code = c; return res; },
    json(d) { out.body = d; },
    setHeader() {},
  };
  const base = { 'x-forwarded-for': ip };
  if (origin !== null) base.origin = origin;
  await handler({ method, url, headers: headers ?? base, body }, res);
  return out;
};

/** requests a code and digs it back out of the captured email */
const requestCode = async (email, ip) => {
  const res = await call(verifyPhone, { action: 'send', email }, { ip, url: '/api/verify-phone' });
  const code = sent.at(-1)?.text.match(/code is: ([A-Z0-9]+)/)?.[1];
  return { res, code };
};

/* ── verify-phone: the phone number must never leave without a valid code ── */

test('send issues a token and never returns the phone number', async () => {
  const { res, code } = await requestCode('reader@example.test', '10.1.0.1');
  assert.equal(res.code, 200);
  assert.ok(res.body.token, 'expected a token');
  assert.doesNotMatch(JSON.stringify(res.body), /\d{2} \d{2} \d{2} \d{2}/, 'phone leaked in the send response');
  assert.match(code, /^[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{10}$/, `unexpected code shape: ${code}`);
  assert.ok(!res.body.token.includes(code), 'token must not carry the code in clear');
});

test('a valid code returns the phone number', async () => {
  const { res, code } = await requestCode('ok@example.test', '10.1.0.2');
  const verified = await call(verifyPhone, { action: 'verify', email: 'ok@example.test', code, token: res.body.token }, { ip: '10.1.0.2', url: '/api/verify-phone' });
  assert.equal(verified.code, 200);
  assert.equal(verified.body.phone, FAKE_PHONE);
});

test('the code is case-insensitive and tolerates whitespace', async () => {
  const { res, code } = await requestCode('case@example.test', '10.1.0.3');
  const verified = await call(verifyPhone, { action: 'verify', email: 'case@example.test', code: `  ${code.toLowerCase()} `, token: res.body.token }, { ip: '10.1.0.3', url: '/api/verify-phone' });
  assert.equal(verified.code, 200);
});

test('a wrong code is rejected without revealing the phone number', async () => {
  const { res } = await requestCode('wrong@example.test', '10.1.0.4');
  const verified = await call(verifyPhone, { action: 'verify', email: 'wrong@example.test', code: 'AAAAAAAAAA', token: res.body.token }, { ip: '10.1.0.4', url: '/api/verify-phone' });
  assert.equal(verified.code, 400);
  assert.equal(verified.body.error, 'Invalid code');
  assert.ok(!verified.body.phone);
});

test('a token carries a tight guess budget, then refuses further attempts', async () => {
  const { res } = await requestCode('brute@example.test', '10.1.0.11');
  const verdicts = [];
  for (let i = 0; i < 8; i++) {
    const attempt = await call(verifyPhone, { action: 'verify', email: 'brute@example.test', code: `AAAAAAAAA${i}`, token: res.body.token }, { ip: '10.1.0.11', url: '/api/verify-phone' });
    verdicts.push(attempt.code);
  }
  assert.ok(verdicts.filter((c) => c === 400).length >= 5, 'the first guesses are plain refusals');
  assert.ok(verdicts.some((c) => c === 429), 'the token must refuse further guesses');
});

test('a code without its token is rejected', async () => {
  const { code } = await requestCode('notoken@example.test', '10.1.0.5');
  const verified = await call(verifyPhone, { action: 'verify', email: 'notoken@example.test', code }, { ip: '10.1.0.5', url: '/api/verify-phone' });
  assert.equal(verified.code, 400);
  assert.ok(!verified.body.phone);
});

test('a token is bound to the email it was issued for', async () => {
  const { res, code } = await requestCode('owner@example.test', '10.1.0.6');
  const verified = await call(verifyPhone, { action: 'verify', email: 'attacker@example.test', code, token: res.body.token }, { ip: '10.1.0.6', url: '/api/verify-phone' });
  assert.equal(verified.code, 400);
  assert.ok(!verified.body.phone);
});

test('a tampered token payload fails the signature check', async () => {
  const { res, code } = await requestCode('tamper@example.test', '10.1.0.7');
  const [payload, signature] = res.body.token.split('.');
  const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'));
  /* push the expiry far into the future and keep the original signature */
  const forged = Buffer.from(JSON.stringify({ ...decoded, x: Date.now() + 9e9 })).toString('base64url');
  const verified = await call(verifyPhone, { action: 'verify', email: 'tamper@example.test', code, token: `${forged}.${signature}` }, { ip: '10.1.0.7', url: '/api/verify-phone' });
  assert.equal(verified.code, 400);
  assert.ok(!verified.body.phone);
});

test('an expired token is reported as expired, not accepted', async () => {
  const payload = Buffer.from(JSON.stringify({ e: 'old@example.test', x: Date.now() - 1000, h: 'whatever' })).toString('base64url');
  const verified = await call(verifyPhone, { action: 'verify', email: 'old@example.test', code: 'ABCDEF', token: `${payload}.bogus-signature` }, { ip: '10.1.0.8', url: '/api/verify-phone' });
  assert.equal(verified.code, 400);
  assert.ok(!verified.body.phone);
});

test('non-POST methods are refused', async () => {
  const out = await call(verifyPhone, {}, { method: 'GET', url: '/api/verify-phone' });
  assert.equal(out.code, 405);
});

test('fails closed when CONTACT_PHONE is not configured', async () => {
  const prev = process.env.CONTACT_PHONE;
  delete process.env.CONTACT_PHONE;
  try {
    /* a fresh module instance (cache-busted), so the module-scope
       PHONE constant is recomputed without the env var */
    const url = pathToFileURL(path.resolve('node_modules/.tmp/api/contact.js')).href + `?nophone=${Date.now()}`;
    const handler = (await import(url)).default;
    const out = await call(handler, { action: 'send', email: 'nophone@example.test' }, { ip: '10.1.0.10', url: '/api/verify-phone' });
    assert.equal(out.code, 500);
    assert.equal(out.body.error, 'Phone not configured');
    assert.ok(!out.body.phone);
  } finally {
    process.env.CONTACT_PHONE = prev;
  }
});

test('an invalid email is refused before any email is sent', async () => {
  const before = sent.length;
  const out = await call(verifyPhone, { action: 'send', email: 'not-an-email' }, { ip: '10.1.0.9', url: '/api/verify-phone' });
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

/* ── newsletter: double opt-in — stage first, welcome only on confirm ── */

/** sets the fake KV up and makes the SISMEMBER pipeline reply with `memberResult` */
const withNewsletterKv = async (fn, memberResult = 0) => {
  process.env.KV_REST_API_URL = 'https://fake-kv.upstash.io/';
  process.env.KV_REST_API_TOKEN = 'fake-token';
  kvCalls.length = 0;
  kvResponder = () => ({ ok: true, json: async () => [{ result: memberResult }, { result: 'OK' }] });
  try {
    return await fn();
  } finally {
    delete process.env.KV_REST_API_URL;
    delete process.env.KV_REST_API_TOKEN;
    kvResponder = null;
  }
};

const pendingCalls = () => kvCalls.filter((c) => c.commands?.[0]?.[0] === 'SISMEMBER');
const lastEmail = () => sent.at(-1);

/** the confirmation link inside the latest captured email */
const lastConfirmHref = () => sent.at(-1)?.html.match(/href="(https:\/\/seynudedagnon\.com\/api\/newsletter-confirm[^"]+)"/)?.[1];

const callGet = async (handler, url) => {
  const out = { code: 0, html: null, json: null };
  const res = {
    status(c) { out.code = c; return res; },
    send(d) { out.html = d; },
    json(d) { out.json = d; },
    setHeader() {},
  };
  await handler({ method: 'GET', headers: { 'x-forwarded-for': '10.0.0.1' }, url }, res);
  return out;
};

test('a new address is staged for confirmation, not subscribed directly', async () => {
  await withNewsletterKv(async () => {
    const before = sent.length;
    const out = await call(newsletter, { email: 'Sub@Example.COM', lang: 'en' }, { ip: '10.6.0.1' });
    assert.equal(out.code, 200);
    assert.deepEqual(out.body, { ok: true, pending: true });

    const staged = pendingCalls();
    assert.equal(staged.length, 1, 'expected exactly one staging pipeline');
    assert.equal(staged[0].url, 'https://fake-kv.upstash.io/pipeline');
    assert.equal(staged[0].auth, 'Bearer fake-token');
    assert.deepEqual(staged[0].commands[0], ['SISMEMBER', 'newsletter:emails', 'sub@example.com'], 'the address is checked lowercased');
    assert.deepEqual(staged[0].commands[1], ['SET', 'newsletter:pending:sub@example.com', 'en', 'EX', '604800'], 'the address is staged with its expiry');
    assert.equal(kvCalls.filter((c) => c.commands?.[0]?.[0] === 'SADD').length, 0, 'nothing may be subscribed before the click');

    const mail = lastEmail();
    assert.equal(sent.length, before + 1, 'expected exactly one confirmation email');
    assert.match(mail.subject, /Confirm your newsletter subscription/);
    assert.match(mail.html, /Confirm my subscription/);
    assert.equal(mail.to[0], 'sub@example.com');

    const href = lastConfirmHref();
    assert.ok(href, 'the email must carry the confirmation link');
    assert.ok(href.includes('email=sub%40example.com'), 'the link must name the address');
    assert.ok(href.includes('token='), 'the link must carry a token');
    assert.doesNotMatch(JSON.stringify(mail), /Welcome to Dr\. Dagnon/, 'no welcome email before confirmation');
  });
});

test('an already-subscribed address is told so and asked nothing', async () => {
  await withNewsletterKv(async () => {
    const before = sent.length;
    const out = await call(newsletter, { email: 'old@example.test', lang: 'en' }, { ip: '10.6.0.2' });
    assert.equal(out.code, 200);
    assert.deepEqual(out.body, { ok: true, pending: true }, 'the response must not reveal whether the address is subscribed');
    assert.equal(sent.length, before, 'a re-subscription must not send any email');
  }, 1);
});

test('the confirmation email follows the visitor language', async () => {
  await withNewsletterKv(async () => {
    const out = await call(newsletter, { email: 'fr@example.test', lang: 'fr' }, { ip: '10.6.0.3' });
    assert.equal(out.code, 200);
    const mail = lastEmail();
    assert.match(mail.subject, /Confirmez votre inscription/);
    assert.match(mail.html, /Confirmer mon inscription/);
  });
});

test('an invalid email is refused before anything is stored or sent', async () => {
  await withNewsletterKv(async () => {
    const beforeSent = sent.length;
    const out = await call(newsletter, { email: 'not-an-email' }, { ip: '10.6.0.4' });
    assert.equal(out.code, 400);
    assert.equal(out.body.error, 'Invalid email');
    assert.equal(sent.length, beforeSent);
    assert.equal(pendingCalls().length, 0, 'nothing should reach the store');
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
    assert.equal(pendingCalls().length, 0);
  });
});

test('a store outage fails before sending an unusable confirmation link', async () => {
  await withNewsletterKv(async () => {
    kvResponder = () => ({ ok: false, json: async () => ({}) });
    const before = sent.length;
    const out = await call(newsletter, { email: 'outage@example.test' }, { ip: '10.6.0.7' });
    assert.equal(out.code, 503);
    assert.equal(sent.length, before, 'no unusable confirmation email should go out');
  });
});

test('subscriptions fail closed when no store is configured', async () => {
  const beforeSent = sent.length;
  const beforeKv = kvCalls.length;
  const out = await call(newsletter, { email: 'nokv@example.test' }, { ip: '10.6.0.8' });
  assert.equal(out.code, 503);
  assert.equal(sent.length, beforeSent);
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

test('a failed provider send alerts the owner, at most once per window', async () => {
  const before = sent.length;
  resendOk = false;
  try {
    await withKv(async () => {
      let alertChecks = 0;
      kvResponder = () => {
        const commands = kvCalls.at(-1)?.commands ?? [];
        if (commands[0]?.[0] === 'SISMEMBER') {
          return { ok: true, json: async () => [{ result: 0 }, { result: 'OK' }] };
        }
        const isAlertLimit = String(commands[0]?.[1] ?? '').includes('alert:newsletter confirmation');
        return {
          ok: true,
          json: async () => [{ result: 'OK' }, { result: isAlertLimit ? ++alertChecks : 1 }],
        };
      };
      await call(newsletter, { email: 'alert@example.test', lang: 'en' }, { ip: '10.8.0.1' });
      await call(newsletter, { email: 'alert2@example.test', lang: 'en' }, { ip: '10.8.0.2' });
    });
    const alerts = sent.slice(before).filter((m) => m.subject?.startsWith('[Site] API failure'));
    assert.equal(alerts.length, 1, 'a burst of failures must produce one alert, not one per request');
    assert.match(alerts[0].subject, /newsletter confirmation/);
    assert.equal(alerts[0].to[0], 'admin@example.test', 'the alert goes to the owner');
    assert.match(alerts[0].text, /provider down/, 'the alert carries the provider detail');
    assert.match(alerts[0].text, /rate-limited/);
  } finally {
    resendOk = true;
  }
});

/* ── newsletter-confirm: the click completes the subscription ──────────── */

const { issueToken, checkToken } = await import(
  pathToFileURL(path.resolve('node_modules/.tmp/api/_tokens.js')).href
);
const newsletterConfirm = await load('newsletter.js');
/* the confirm and opt-out paths share one function (newsletter.ts),
   split on the request path — so both tests use the same handler */
const newsletterUnsubscribe = newsletterConfirm;

/** subscribes through the full flow and returns { out, href }; the address
 *  is treated as new, so a fresh confirmation email is always the last one */
let confirmRequestIndex = 1;
const subscribeAndGetHref = async (email, { lang = 'en', ip } = {}) => {
  const requestIp = ip ?? `10.7.${Math.floor(confirmRequestIndex / 250)}.${(confirmRequestIndex++ % 250) + 1}`;
  process.env.KV_REST_API_URL = 'https://fake-kv.upstash.io/';
  process.env.KV_REST_API_TOKEN = 'fake-token';
  kvCalls.length = 0;
  kvResponder = () => ({ ok: true, json: async () => [{ result: 0 }, { result: 'OK' }] });
  try {
    const out = await call(newsletter, { email, lang }, { ip: requestIp });
    assert.equal(out.code, 200, `failed to stage ${email}`);
    return { out, href: lastConfirmHref() };
  } finally {
    delete process.env.KV_REST_API_URL;
    delete process.env.KV_REST_API_TOKEN;
    kvResponder = null;
  }
};

/** clicks a confirmation link against the real store contract */
const clickConfirm = async (href, { saddResult = 1, pendingLang = 'en' } = {}) => {
  const url = new URL(href);
  process.env.KV_REST_API_URL = 'https://fake-kv.upstash.io/';
  process.env.KV_REST_API_TOKEN = 'fake-token';
  kvCalls.length = 0;
  let callIndex = 0;
  kvResponder = () => {
    callIndex++;
    return {
      ok: true,
      json: async () => callIndex === 1
        ? [{ result: pendingLang }, { result: pendingLang ? 0 : saddResult === 0 ? 1 : 0 }]
        : [{ result: saddResult }, { result: 1 }, { result: 'OK' }],
    };
  };
  try {
    return await callGet(newsletterConfirm, url.pathname + url.search);
  } finally {
    delete process.env.KV_REST_API_URL;
    delete process.env.KV_REST_API_TOKEN;
    kvResponder = null;
  }
};

test('clicking the confirmation link subscribes the address and sends the welcome email', async () => {
  const { out, href } = await subscribeAndGetHref('clicks@example.test');
  assert.equal(out.code, 200);
  assert.ok(href, 'expected a confirmation link');

  const beforeSent = sent.length;
  const clicked = await clickConfirm(href);
  assert.equal(clicked.code, 200);
  assert.match(clicked.html, /Subscription confirmed/);

  const sadd = kvCalls.find((c) => c.commands?.some((cmd) => cmd[0] === 'SADD'));
  assert.deepEqual(kvCalls[0].commands[0], ['GET', 'newsletter:pending:clicks@example.test'], 'the pending language is checked before writing');
  assert.deepEqual(sadd.commands[0], ['SADD', 'newsletter:emails', 'clicks@example.test']);
  assert.deepEqual(sadd.commands[1], ['DEL', 'newsletter:pending:clicks@example.test']);
  assert.deepEqual(sadd.commands[2][0], 'SET');
  assert.equal(sadd.commands[2][1], 'newsletter:lang:clicks@example.test');
  assert.equal(sadd.commands[2][2], 'en', 'the confirmed language is persisted for the subscription lifetime');

  assert.equal(sent.length, beforeSent + 1, 'the welcome email should go out on confirmation');
  assert.match(lastEmail().subject, /Welcome to Dr\. Dagnon/);
  assert.match(lastEmail().html, /Thank you for subscribing/);
});

test('the pending key is the authoritative language when it differs from the link param', async () => {
  const { href } = await subscribeAndGetHref('authoritative@example.test');
  const url = new URL(href);
  url.searchParams.set('lang', 'en');
  const clicked = await clickConfirm(url.href, { pendingLang: 'fr' });
  assert.equal(clicked.code, 200);
  const kvCallsAfter = kvCalls;
  const setFr = kvCallsAfter.find((c) => c.commands?.some((cmd) => cmd[0] === 'SET' && cmd[1] === 'newsletter:lang:authoritative@example.test' && cmd[2] === 'fr'));
  assert.ok(setFr, 'a corrective SET must persist the pending language');
});

test('a second click is idempotent and does not welcome twice', async () => {
  const { href } = await subscribeAndGetHref('twice@example.test');
  const beforeSent = sent.length;
  const clicked = await clickConfirm(href, { saddResult: 0, pendingLang: null });
  assert.equal(clicked.code, 200);
  assert.match(clicked.html, /Subscription confirmed/);
  assert.equal(sent.length, beforeSent, 'no second welcome email');
});

test('a consumed confirmation link cannot recreate a removed subscription', async () => {
  const { href } = await subscribeAndGetHref('removed@example.test');
  const clicked = await clickConfirm(href, { saddResult: 1, pendingLang: null });
  assert.equal(clicked.code, 400);
  assert.match(clicked.html, /already used or expired/);
  assert.equal(kvCalls.some((c) => c.commands?.some((cmd) => cmd[0] === 'SADD')), false);
});

test('a tampered token is refused before any store write or email', async () => {
  const { href } = await subscribeAndGetHref('tampered@example.test');
  const url = new URL(href);
  url.searchParams.set('token', url.searchParams.get('token').slice(0, -1) + 'X');
  const beforeSent = sent.length;
  const clicked = await callGet(newsletterConfirm, url.pathname + url.search);
  assert.equal(clicked.code, 400);
  assert.match(clicked.html, /Invalid link/);
  assert.equal(kvCalls.filter((c) => c.commands?.[0]?.[0] === 'SADD').length, 0, 'nothing should reach the store');
  assert.equal(sent.length, beforeSent, 'no email should be sent');
});

test('an expired link is refused as expired', async () => {
  const { href } = await subscribeAndGetHref('expired@example.test');
  const url = new URL(href);
  /* Issue a genuine token with the clock moved beyond its TTL. This tests
     expiry without duplicating the private token serialization in the test. */
  const now = Date.now;
  Date.now = () => now() - (8 * 24 * 60 * 60 * 1000);
  let expiredToken;
  try {
    expiredToken = issueToken('nl-confirm', 'expired@example.test');
  } finally {
    Date.now = now;
  }
  url.searchParams.set('token', expiredToken);
  const beforeSent = sent.length;
  const clicked = await callGet(newsletterConfirm, url.pathname + url.search);
  assert.equal(clicked.code, 400);
  assert.match(clicked.html, /Link expired/);
  assert.equal(sent.length, beforeSent, 'no email should be sent');
});

test('a token for another address is refused', async () => {
  const { href } = await subscribeAndGetHref('owner@example.test');
  const url = new URL(href);
  url.searchParams.set('email', 'attacker@example.test');
  const clicked = await callGet(newsletterConfirm, url.pathname + url.search);
  assert.equal(clicked.code, 400);
});

test('the confirm link cannot be reused as an unsubscribe link', async () => {
  const { href } = await subscribeAndGetHref('mixed@example.test');
  const url = new URL(href);
  url.pathname = '/api/newsletter-unsubscribe';
  const unsubbed = await callGet(newsletterUnsubscribe, url.pathname + url.search);
  assert.equal(unsubbed.code, 400, 'the purpose-bound token must be refused');
});

/* ── newsletter-unsubscribe: one click, one address ────────────────────── */

test('a valid unsubscribe link removes the address and clears its pending and language keys', async () => {
  const email = 'leaving@example.test';
  const token = issueToken('nl-unsub', email);
  await withKv(async () => {
    const out = await callGet(newsletterUnsubscribe, `/api/newsletter-unsubscribe?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`);
    assert.equal(out.code, 200);
    assert.match(out.html, /Unsubscribed/);
    const srem = kvCalls.find((c) => c.commands?.[0]?.[0] === 'SREM');
    assert.deepEqual(srem.commands[0], ['SREM', 'newsletter:emails', email]);
    assert.deepEqual(srem.commands[1], ['DEL', `newsletter:pending:${email}`]);
    assert.deepEqual(srem.commands[2], ['DEL', `newsletter:lang:${email}`], 'the language preference must not linger after opting out');
  });
});

test('an unsubscribe token is bound to its address', async () => {
  const token = issueToken('nl-unsub', 'real@example.test');
  await withKv(async () => {
    const out = await callGet(newsletterUnsubscribe, `/api/newsletter-unsubscribe?email=other@example.test&token=${encodeURIComponent(token)}`);
    assert.equal(out.code, 400);
    assert.equal(kvCalls.length, 0, 'no store write for a refused link');
  });
});

test('an expired unsubscribe link is refused', async () => {
  const email = 'old@example.test';
  const secret = process.env.VERIFY_SECRET;
  const hmac = (data) =>
    Buffer.from(crypto.createHmac('sha256', secret).update(data).digest()).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const exp = Date.now() - 1000;
  const payload = Buffer.from(JSON.stringify({
    p: 'nl-unsub', e: email, x: exp,
    h: hmac(`nl-unsub|${email}|${exp}`),
  })).toString('base64url');
  const forged = `${payload}.${hmac(payload)}`;
  await withKv(async () => {
    const out = await callGet(newsletterUnsubscribe, `/api/newsletter-unsubscribe?email=${email}&token=${forged}`);
    assert.equal(out.code, 400);
    assert.equal(kvCalls.length, 0);
  });
});

test('unsubscribe tokens round-trip through the shared checker', () => {
  const email = 'roundtrip@example.test';
  const token = issueToken('nl-unsub', email);
  assert.equal(checkToken('nl-unsub', token, email), 'ok');
  assert.equal(checkToken('nl-unsub', token, 'other@example.test'), 'invalid');
  assert.equal(checkToken('nl-confirm', token, email), 'invalid', 'a purpose must never cross');
});

/* ── rate limiting — last, because the counters are module state ──────── */

test('send is capped per email address', async () => {
  const before = sent.length;
  const results = [];
  for (let i = 0; i < 5; i++) {
    results.push(await call(verifyPhone, { action: 'send', email: 'flood@example.test' }, { ip: '10.3.0.1', url: '/api/verify-phone' }));
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
     catch a second time. Preview origins are matched by project name only:
     `*.vercel.app` and `*.studio26.online` would be open to anyone's project. */
  for (const origin of [
    'http://localhost:3000',
    'https://site-dr-dagnon.vercel.app',
    'https://site-dr-dagnon-abc123.vercel.app',
    'https://www.seynudedagnon.com',
    'https://sd.studio26.online',
  ]) {
    const out = await call(contact, { name: 'A', email: 'a@example.test', phone: '+229 01 02 03 04', message: 'hi' }, { origin, ip: `10.4.1.${origin.length}` });
    assert.notEqual(out.code, 403, `${origin} should be allowed`);
  }
});

test("anyone else's project must not pass the origin check", async () => {
  for (const origin of [
    'https://any-project.vercel.app',
    'https://site-dr-dagnon.evil.example.vercel.app',
    'https://any-project.studio26.online',
    'https://evil.studio26.online',
  ]) {
    const out = await call(contact, { name: 'A', email: 'a@example.test', phone: '+229 01 02 03 04', message: 'hi' }, { origin, ip: `10.4.1.${origin.length}` });
    assert.equal(out.code, 403, `${origin} should be refused`);
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
