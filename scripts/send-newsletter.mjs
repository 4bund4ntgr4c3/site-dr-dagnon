/* Sends the newsletter digest — run at the end of the Vercel production
 * build (appended to the `build` script), i.e. on every deploy that ships
 * new content. Nothing runs on preview deployments or local builds.
 *
 * What it does:
 *   1. compiles the publication/tribune data files to plain JS (same trick
 *      as scripts/run-tests.mjs: tsc, no bundler involved)
 *   2. diffs their ids/slugs against the state stored in KV
 *      (`newsletter:last-sent`) and keeps only the new items
 *   3. reads the subscribers (`newsletter:emails`, set by api/newsletter.ts)
 *   4. emails the digest to the owner with the subscribers in bcc, in
 *      batches of 50 recipients
 *   5. records the sent ids in KV — only after every batch went out, so a
 *      failed send is retried by the next deploy
 *
 * First run with no state establishes a baseline (everything already on the
 * site counts as sent) so nobody gets spammed with the whole archive.
 *
 * Nothing is sent when the environment is not a Vercel production build or
 * when the secrets are missing — the build skips cleanly.
 */

import { execFileSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import webPush from 'web-push';

/* ── constants ──────────────────────────────────────────────────── */

const SITE_URL = 'https://seynudedagnon.com';
const STATE_KEY = 'newsletter:last-sent';
const SUBS_KEY = 'newsletter:emails';
const PUSH_KEY = 'push:subs';
const PUSH_PREFIX = 'push:sub:';
const LANG_KEY = 'newsletter:lang:';

const C = { pine950: '#0c2e2a', pine900: '#133e38', gold500: '#c9a24b', gold400: '#d4b36a', ivory: '#faf8f4', white: '#ffffff', ink: '#3a3a3a', muted: '#6b7280' };
const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = (s) => s.replace(/[&<>"']/g, (c) => ESCAPES[c]);

/* Per-language copy for the digest. 'both' (the legacy default, and the
   owner's copy) keeps the old bilingual card. */
const L = {
  fr: {
    publication: 'Publication',
    tribune: 'Tribune',
    read: 'Lire la suite',
    hello: 'Bonjour,',
    intro: 'Nouvelles publications et tribunes sur seynudedagnon.com :',
    pubOne: 'nouvelle publication',
    pubMany: 'nouvelles publications',
    tribOne: 'nouvelle tribune',
    tribMany: 'nouvelles tribunes',
  },
  en: {
    publication: 'Publication',
    tribune: 'Op-ed',
    read: 'Read more',
    hello: 'Hello,',
    intro: 'New publications and op-eds on seynudedagnon.com:',
    pubOne: 'new publication',
    pubMany: 'new publications',
    tribOne: 'new tribune',
    tribMany: 'new tribunes',
  },
};

/* ── one-click unsubscribe tokens ─────────────────────────────────
   Same scheme as api/_tokens.ts (which this script cannot import — it is
   TypeScript): a stateless HMAC payload bound to a purpose and an address,
   so each recipient of the digest gets a link that only unsubscribes
   them, valid for 90 days. */

const TOKEN_SECRET = () => process.env.VERIFY_SECRET || process.env.RESEND_API_KEY || '';
const b64url = (b) => Buffer.from(b).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

function issueToken(email) {
  const secret = TOKEN_SECRET();
  if (!secret) return null;
  const hmac = (data) => b64url(crypto.createHmac('sha256', secret).update(data).digest());
  const exp = Date.now() + 90 * 24 * 60 * 60 * 1000;
  const payload = b64url(Buffer.from(JSON.stringify({ p: 'nl-unsub', e: email, x: exp, h: hmac(`nl-unsub|${email}|${exp}`) })));
  return `${payload}.${hmac(payload)}`;
}

function unsubHref(email) {
  const token = issueToken(email) || '';
  return `${SITE_URL}/api/newsletter-unsubscribe?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`;
}

/* ── pure logic (unit-tested in tests/newsletter-send.test.mjs) ─── */

/** ids are namespaced so a publication id can never collide with a tribune slug */
export const itemId = (item) => (item.kind === 'publication' ? `pub:${item.id}` : `trib:${item.id}`);

/**
 * @param items  the site's current content, each { id, slug?, kind, url, title, description }
 * @param state  parsed KV state, or null when nothing was ever recorded
 * @returns what to send; a null state means first run → baseline, nothing sent
 */
export function plan(items, state) {
  const known = state?.ids;
  if (!Array.isArray(known)) return { firstRun: true, send: [] };
  const sent = new Set(known);
  return { firstRun: false, send: items.filter((i) => !sent.has(itemId(i))) };
}

export function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

/** builds the digest items from the compiled data files */
export function buildItems(pubs, tribunes) {
  return [
    ...tribunes.map((t) => ({
      id: t.slug,
      kind: 'tribune',
      url: `${SITE_URL}/tribunes/${t.slug}`,
      title: t.title,
      description: t.description,
    })),
    ...pubs.map((p) => ({
      id: p.id,
      kind: 'publication',
      url: `${SITE_URL}/publications`,
      title: p.title,
      description: p.description,
    })),
  ];
}

function itemHtml(item, lang = 'both') {
  const label = item.kind === 'tribune' ? (lang === 'fr' ? L.fr.tribune : lang === 'en' ? L.en.tribune : 'Tribune / Op-ed') : (lang === 'fr' ? L.fr.publication : lang === 'en' ? L.en.publication : 'Publication');
  const read = lang === 'fr' ? L.fr.read : lang === 'en' ? L.en.read : 'Lire la suite / Read more';
  const title = lang === 'fr' ? item.title.fr : lang === 'en' ? item.title.en : `${item.title.fr} / ${item.title.en}`;
  const description = lang === 'fr' ? item.description.fr : lang === 'en' ? item.description.en : `${item.description.fr} / ${item.description.en}`;
  return `<table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px"><tr><td style="padding:20px 22px;background:${C.ivory};border-radius:12px;border-left:3px solid ${C.gold500}"><p style="margin:0 0 6px;font-size:10.5px;font-weight:600;color:${C.muted};text-transform:uppercase;letter-spacing:.1em">${label}</p><p style="margin:0;font-size:16px;font-weight:600;line-height:1.4;color:${C.pine900}">${esc(title)}</p><p style="margin:6px 0 0;font-size:13px;line-height:1.6;color:${C.ink}">${esc(description)}</p><p style="margin:12px 0 0"><a href="${item.url}" style="display:inline-block;background:${C.pine950};color:${C.gold400};font-size:12.5px;font-weight:600;padding:10px 22px;border-radius:999px;text-decoration:none">${read}</a></p></td></tr></table>`;
}

export function digestHtml(items, lang = 'both') {
  const copy = lang === 'fr' ? L.fr : lang === 'en' ? L.en : null;
  const hello = copy ? copy.hello : 'Bonjour, / Hello,';
  const intro = copy ? copy.intro : 'Nouvelles publications et tribunes sur seynudedagnon.com : / New publications and op-eds on seynudedagnon.com:';
  return `<tr><td style="padding:28px 32px"><p style="margin:0;font-size:14px;line-height:1.7;color:${C.ink}">${hello}</p><p style="margin:12px 0 0;font-size:14px;line-height:1.7;color:${C.ink}">${intro}</p><table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0 0">${items.map((i) => itemHtml(i, lang)).join('')}</table></td></tr>`;
}

export function digestText(items, lang = 'both') {
  if (lang === 'fr') {
    const lines = ['Bonjour,', 'Nouvelles publications et tribunes sur seynudedagnon.com :', ''];
    for (const item of items) {
      lines.push(`${item.kind === 'tribune' ? 'TRIBUNE' : 'PUBLICATION'}: ${item.title.fr}`);
      lines.push(item.url);
      lines.push('');
    }
    return lines.join('\n');
  }
  if (lang === 'en') {
    const lines = ['Hello,', 'New publications and op-eds on seynudedagnon.com:', ''];
    for (const item of items) {
      lines.push(`${item.kind === 'tribune' ? 'OP-ED' : 'PUBLICATION'}: ${item.title.en}`);
      lines.push(item.url);
      lines.push('');
    }
    return lines.join('\n');
  }
  const lines = ['Hello,', 'New publications and op-eds on seynudedagnon.com:', ''];
  for (const item of items) {
    lines.push(`${item.kind === 'tribune' ? 'TRIBUNE' : 'PUBLICATION'}: ${item.title.fr} / ${item.title.en}`);
    lines.push(item.url);
    lines.push('');
  }
  return lines.join('\n');
}

export function subjectLine(items, lang = 'both') {
  const pubs = items.filter((i) => i.kind === 'publication').length;
  const tribs = items.length - pubs;
  const copy = lang === 'fr' ? L.fr : lang === 'en' ? L.en : null;
  const pubWord = copy ? (pubs > 1 ? copy.pubMany : copy.pubOne) : pubs > 1 ? 'new publications' : 'new publication';
  const tribWord = copy ? (tribs > 1 ? copy.tribMany : copy.tribOne) : tribs > 1 ? 'new tribunes' : 'new tribune';
  const parts = [];
  if (pubs) parts.push(`${pubs} ${pubWord}`);
  if (tribs) parts.push(`${tribs} ${tribWord}`);
  return `Newsletter — ${parts.join(' & ') || 'New content'}`;
}

function wrap(body) {
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;padding:0;background:${C.ivory};font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif"><table width="100%" cellpadding="0" cellspacing="0" style="background:${C.ivory};padding:32px 16px"><tr><td align="center"><table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${C.white};border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(12,46,42,.08)">${body}</table><p style="margin:20px 0 0;font-size:11px;color:${C.muted};text-align:center">Vous recevez cet email car vous êtes inscrit à la newsletter du Dr. Seynudé Dagnon. &middot; <a href="${SITE_URL}" style="color:${C.gold500};text-decoration:none">seynudedagnon.com</a></p></td></tr></table></body></html>`;
}
function hdr() {
  return `<tr><td style="background:${C.pine950};padding:28px 32px"><p style="margin:0;font-size:13px;font-weight:600;letter-spacing:.12em;color:${C.gold400};text-transform:uppercase">Dr. Seynudé Dagnon</p><h1 style="margin:6px 0 0;font-size:20px;font-weight:600;color:${C.white};line-height:1.3">Les dernières actualités / Latest news</h1></td></tr>`;
}
function ftr(unsubHref) {
  return `<tr><td style="background:${C.pine900};padding:20px 32px"><p style="margin:0;font-size:11px;color:rgba(255,255,255,.5);text-align:center">Public Health &amp; Malaria Program Leader &middot; <a href="${SITE_URL}" style="color:${C.gold400};text-decoration:none">Website</a> &middot; <a href="${unsubHref}" style="color:${C.gold400};text-decoration:none">Se désinscrire / Unsubscribe</a></p></td></tr>`;
}

/* ── KV ─────────────────────────────────────────────────────────── */

function kvCredentials() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ''), token } : null;
}

async function kvPipeline(commands) {
  const kv = kvCredentials();
  if (!kv) return null;
  try {
    const response = await fetch(`${kv.url}/pipeline`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${kv.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(commands),
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

async function loadState() {
  const results = await kvPipeline([['GET', STATE_KEY]]);
  const raw = results?.[0]?.result;
  if (typeof raw !== 'string') return null;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed?.ids) ? parsed : null;
  } catch {
    return null;
  }
}

async function saveState(ids) {
  const results = await kvPipeline([['SET', STATE_KEY, JSON.stringify({ ids }), 'EX', '7884000']]);
  return results?.[0]?.result === 'OK';
}

async function loadSubscribers() {
  const results = await kvPipeline([['SMEMBERS', SUBS_KEY]]);
  return Array.isArray(results?.[0]?.result) ? results[0].result.filter((s) => typeof s === 'string') : [];
}

/* The language each subscriber confirmed in (`newsletter:lang:<email>`,
   written by api/newsletter-confirm.ts). Missing entries — legacy
   subscribers, or a KV miss — fall back to the bilingual digest. */
async function loadSubscriberLangs(subscribers) {
  const langs = new Map();
  if (subscribers.length === 0) return langs;
  const results = await kvPipeline(subscribers.map((e) => ['GET', `${LANG_KEY}${e}`]));
  if (!results) return langs;
  subscribers.forEach((e, i) => {
    const raw = results[i]?.result;
    if (raw === 'fr' || raw === 'en') langs.set(e, raw);
  });
  return langs;
}

/* ── sending ────────────────────────────────────────────────────── */

async function sendDigest({ send, owner, apiKey }) {
  const subscribers = await loadSubscribers();
  const langs = await loadSubscriberLangs(subscribers);
  /* per-recipient sends so each copy carries its own one-click unsubscribe
     link (bcc batches used to share a single mailto:) — the owner gets a
     copy too, they may not be in the subscriber set */
  const recipients = [
    { email: owner, lang: 'both' },
    ...subscribers.map((email) => ({ email, lang: langs.get(email) ?? 'both' })),
  ];
  const from = process.env.NEWSLETTER_FROM_EMAIL || 'Portfolio <admin@seynudedagnon.com>';
  for (const [i, r] of recipients.entries()) {
    const href = unsubHref(r.email);
    const body = {
      from,
      to: [r.email],
      subject: subjectLine(send, r.lang),
      html: wrap(hdr() + digestHtml(send, r.lang) + ftr(href)),
      text: `${digestText(send, r.lang)}\n\n—\nUnsubscribe: ${href}`,
    };
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Resend recipient ${i + 1}/${recipients.length} failed: ${err}`);
    }
    console.log(`[newsletter] sent to ${i + 1}/${recipients.length}`);
  }
  return recipients.length;
}

/* ── web push ─────────────────────────────────────────────────────
   Runs only when a digest actually went out, so a notification fires
   exactly when there is genuinely new content. Dead subscriptions
   (the push service answered 404/410) are dropped from the store. */

async function sendPushNotifications(items) {
  const pub = process.env.VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  if (!pub || !priv) {
    console.warn('[newsletter] push skipped: VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY not set');
    return 0;
  }
  webPush.setVapidDetails(`mailto:${process.env.NEWSLETTER_TO_EMAIL || 'admin@seynudedagnon.com'}`, pub, priv);

  const results = await kvPipeline([['SMEMBERS', PUSH_KEY]]);
  const hashes = Array.isArray(results?.[0]?.result) ? results[0].result.filter((s) => typeof s === 'string') : [];

  const first = items[0];
  const payload = JSON.stringify({
    title: items.length === 1 ? first.title.fr : 'Nouvelles publications sur seynudedagnon.com',
    body: items.length === 1
      ? first.description.fr
      : `${items.length} nouvelles publications et tribunes / new publications and op-eds`,
    url: first.kind === 'tribune' ? first.url : `${SITE_URL}/publications`,
    tag: `digest-${Date.now()}`,
  });

  let sent = 0;
  for (const hash of hashes) {
    const subResults = await kvPipeline([['GET', `${PUSH_PREFIX}${hash}`]]);
    const raw = subResults?.[0]?.result;
    if (typeof raw !== 'string') continue;
    let sub;
    try {
      sub = JSON.parse(raw);
    } catch {
      continue;
    }
    try {
      await webPush.sendNotification(sub, payload);
      sent++;
    } catch (e) {
      if (e?.statusCode === 404 || e?.statusCode === 410) {
        await kvPipeline([
          ['SREM', PUSH_KEY, hash],
          ['DEL', `${PUSH_PREFIX}${hash}`],
        ]);
        console.log(`[newsletter] push subscription dropped (${e?.statusCode})`);
      }
    }
  }
  return sent;
}

/* ── data compilation ───────────────────────────────────────────── */

/* tsc is needed because the content lives in TypeScript files. The data is
 * copied to a temp project (with `@/` mapped to its own src/) so the module
 * specifiers stay resolvable without a bundler. */
function compileData() {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const tmp = path.join(root, 'node_modules', '.tmp', 'newsletter-data');
  fs.rmSync(tmp, { recursive: true, force: true });
  fs.mkdirSync(path.join(tmp, 'src', 'data'), { recursive: true });
  fs.mkdirSync(path.join(tmp, 'src', 'i18n'), { recursive: true });
  for (const [from, to] of [
    ['src/data/publications.ts', 'src/data/publications.ts'],
    ['src/data/tribunes.ts', 'src/data/tribunes.ts'],
    ['src/i18n/lang.ts', 'src/i18n/lang.ts'],
  ]) {
    fs.copyFileSync(path.join(root, from), path.join(tmp, to));
  }
  fs.writeFileSync(
    path.join(tmp, 'tsconfig.json'),
    JSON.stringify({
      compilerOptions: {
        target: 'es2022',
        module: 'esnext',
        moduleResolution: 'bundler',
        strict: true,
        skipLibCheck: true,
        types: ['node'],
        outDir: 'out',
        rootDir: 'src',
        baseUrl: 'src',
        paths: { '@/*': ['*'] },
      },
      include: ['src/**/*'],
    }),
  );
  execFileSync(
    process.execPath,
    [path.join(root, 'node_modules', 'typescript', 'bin', 'tsc'), '-p', path.join(tmp, 'tsconfig.json')],
    { cwd: root, stdio: 'inherit' },
  );
  return {
    pubsUrl: path.join(tmp, 'out', 'data', 'publications.js'),
    tribunesUrl: path.join(tmp, 'out', 'data', 'tribunes.js'),
  };
}

/* ── main ───────────────────────────────────────────────────────── */

async function main() {
  /* the digest goes out only from a real production deploy — preview
     deployments (staging, PRs) would otherwise mail drafts to everyone */
  if (process.env.VERCEL_ENV !== 'production') {
    console.warn('[newsletter] skipped: not a Vercel production build');
    return;
  }
  const apiKey = process.env.RESEND_API_KEY;
  const owner = process.env.NEWSLETTER_TO_EMAIL;
  if (!apiKey || !owner) {
    console.warn('[newsletter] skipped: RESEND_API_KEY and NEWSLETTER_TO_EMAIL must be set');
    return;
  }
  if (!kvCredentials()) {
    console.warn('[newsletter] skipped: KV_REST_API_URL / KV_REST_API_TOKEN not set');
    return;
  }

  const { pubsUrl, tribunesUrl } = compileData();
  const { PUB_ITEMS } = await import(pathToFileURL(pubsUrl).href);
  const { TRIBUNES } = await import(pathToFileURL(tribunesUrl).href);
  const items = buildItems(PUB_ITEMS, TRIBUNES);

  const state = await loadState();
  const { firstRun, send } = plan(items, state);
  if (firstRun) {
    await saveState(items.map(itemId));
    console.log(`[newsletter] baseline established (${items.length} items), nothing sent`);
    return;
  }
  if (send.length === 0) {
    console.log('[newsletter] no new content since the last send');
    return;
  }

  const sent = await sendDigest({ send, owner, apiKey });
  const pushed = await sendPushNotifications(send);

  const known = state.ids;
  const nextIds = [...known, ...send.map(itemId)];
  if (!(await saveState(nextIds))) {
    throw new Error('digest sent but state not saved — the next push will resend it');
  }
  console.log(`[newsletter] sent ${send.length} item(s) to ${sent} subscriber(s), ${pushed} push notification(s)`);
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (isMain) {
  main().then(
    () => process.exit(0),
    (e) => {
      console.error(e);
      process.exit(1);
    },
  );
}
