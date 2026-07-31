/* Sends the newsletter digest — run by the GitHub Action on every push to
 * main (see .github/workflows/newsletter.yml).
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
 *      failed send is retried by the next push
 *
 * First run with no state establishes a baseline (everything already on the
 * site counts as sent) so nobody gets spammed with the whole archive.
 *
 * Nothing is sent when the secrets are missing — the Action skips cleanly
 * until they are configured.
 */

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

/* ── constants ──────────────────────────────────────────────────── */

const SITE_URL = 'https://seynudedagnon.com';
const STATE_KEY = 'newsletter:last-sent';
const SUBS_KEY = 'newsletter:emails';
const BATCH = 50;

const C = { pine950: '#0c2e2a', pine900: '#133e38', gold500: '#c9a24b', gold400: '#d4b36a', ivory: '#faf8f4', white: '#ffffff', ink: '#3a3a3a', muted: '#6b7280' };
const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = (s) => s.replace(/[&<>"']/g, (c) => ESCAPES[c]);

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

function itemHtml(item) {
  const label = item.kind === 'tribune' ? 'Tribune / Op-ed' : 'Publication';
  return `<table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px"><tr><td style="padding:20px 22px;background:${C.ivory};border-radius:12px;border-left:3px solid ${C.gold500}"><p style="margin:0 0 6px;font-size:10.5px;font-weight:600;color:${C.muted};text-transform:uppercase;letter-spacing:.1em">${label}</p><p style="margin:0;font-size:16px;font-weight:600;line-height:1.4;color:${C.pine900}">${esc(item.title.fr)}</p><p style="margin:6px 0 0;font-size:13px;line-height:1.6;color:${C.ink}">${esc(item.description.fr)}</p><p style="margin:12px 0 0;padding-top:12px;border-top:1px solid rgba(12,46,42,.12);font-size:15px;font-weight:600;line-height:1.4;color:${C.pine900}">${esc(item.title.en)}</p><p style="margin:6px 0 0;font-size:13px;line-height:1.6;color:${C.ink}">${esc(item.description.en)}</p><p style="margin:12px 0 0"><a href="${item.url}" style="display:inline-block;background:${C.pine950};color:${C.gold400};font-size:12.5px;font-weight:600;padding:10px 22px;border-radius:999px;text-decoration:none">Lire la suite / Read more</a></p></td></tr></table>`;
}

export function digestHtml(items) {
  return `<tr><td style="padding:28px 32px"><p style="margin:0;font-size:14px;line-height:1.7;color:${C.ink}">Bonjour, / Hello,</p><p style="margin:12px 0 0;font-size:14px;line-height:1.7;color:${C.ink}">Nouvelles publications et tribunes sur seynudedagnon.com : / New publications and op-eds on seynudedagnon.com:</p><table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0 0">${items.map(itemHtml).join('')}</table></td></tr>`;
}

export function digestText(items) {
  const lines = ['Hello,', 'New publications and op-eds on seynudedagnon.com:', ''];
  for (const item of items) {
    lines.push(`${item.kind === 'tribune' ? 'TRIBUNE' : 'PUBLICATION'}: ${item.title.fr} / ${item.title.en}`);
    lines.push(item.url);
    lines.push('');
  }
  return lines.join('\n');
}

export function subjectLine(items) {
  const pubs = items.filter((i) => i.kind === 'publication').length;
  const tribs = items.length - pubs;
  const parts = [];
  if (pubs) parts.push(`${pubs} new publication${pubs > 1 ? 's' : ''}`);
  if (tribs) parts.push(`${tribs} new tribune${tribs > 1 ? 's' : ''}`);
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

/* ── sending ────────────────────────────────────────────────────── */

async function sendDigest({ items, html, text, subject, owner, apiKey }) {
  const subscribers = await loadSubscribers();
  const batches = chunk(subscribers, BATCH);
  for (const [i, batch] of batches.entries()) {
    const body = {
      from: process.env.NEWSLETTER_FROM_EMAIL || 'Portfolio <admin@seynudedagnon.com>',
      to: [owner],
      subject,
      html,
      text,
    };
    if (batch.length) body.bcc = batch;
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Resend batch ${i + 1}/${batches.length} failed: ${err}`);
    }
    console.log(`[newsletter] batch ${i + 1}/${batches.length} sent (${batch.length} bcc)`);
  }
  return subscribers.length;
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

  const unsubHref = `mailto:${owner}?subject=${encodeURIComponent('Unsubscribe')}`;
  const html = wrap(hdr() + digestHtml(send) + ftr(unsubHref));
  const text = `${digestText(send)}\n\n—\nUnsubscribe: ${unsubHref}`;
  const sent = await sendDigest({ items, html, text, subject: subjectLine(send), owner, apiKey });

  const known = state.ids;
  const nextIds = [...known, ...send.map(itemId)];
  if (!(await saveState(nextIds))) {
    throw new Error('digest sent but state not saved — the next push will resend it');
  }
  console.log(`[newsletter] sent ${send.length} item(s) to ${sent} subscriber(s)`);
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
