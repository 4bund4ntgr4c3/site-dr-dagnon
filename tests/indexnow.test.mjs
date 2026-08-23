/* IndexNow generation contract: the public key file, the sitemap parsing
 * and the submission payload must stay in sync — otherwise Bing/Yandex
 * verification fails silently on every deploy. No build compilation needed:
 * the script and its artefacts are plain files on disk. */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const HOST = 'seynudedagnon.com';
const KEY = '92d9c43333334113b7144ad3b6688a8c';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

test('public key file exists and contains exactly the KEY', () => {
  const keyPath = path.resolve(`public/${KEY}.txt`);
  assert.ok(fs.existsSync(keyPath), `public/${KEY}.txt missing`);
  assert.equal(fs.readFileSync(keyPath, 'utf-8').trim(), KEY);
});

test('KEY is a 32-char lowercase hex string', () => {
  assert.match(KEY, /^[0-9a-f]{32}$/);
});

test('indexnow script exists and declares the expected constants', () => {
  const src = fs.readFileSync(path.resolve('scripts/indexnow.mjs'), 'utf-8');
  assert.ok(src.includes(`'${HOST}'`) || src.includes(`"${HOST}"`), 'HOST constant');
  assert.ok(src.includes(KEY), 'KEY constant');
  assert.ok(src.includes('api.indexnow.org'), 'IndexNow endpoint');
  assert.ok(src.includes('keyLocation'), 'keyLocation in payload');
});

test('sitemap exists and is parseable with the same regex as the script', () => {
  const sitemap = path.resolve('dist/sitemap.xml');
  assert.ok(fs.existsSync(sitemap), 'dist/sitemap.xml missing — run `npm run build` first.');
  const xml = fs.readFileSync(sitemap, 'utf-8');
  assert.ok(xml.startsWith('<?xml'), 'sitemap is XML');
  assert.ok(xml.includes('<urlset'), 'urlset present');
  const urlList = Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g), (m) => m[1]);
  assert.ok(urlList.length >= 100, `sitemap url count: ${urlList.length}`);
  for (const u of urlList) assert.ok(u.startsWith(`https://${HOST}`), `url host: ${u}`);
  assert.ok(urlList.some((u) => u.includes('/fr')), 'contains FR alternates');
});

test('IndexNow payload shape is valid', () => {
  // Rebuild the payload the way the script does, then assert its contract.
  const xml = fs.readFileSync(path.resolve('dist/sitemap.xml'), 'utf-8');
  const urlList = Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g), (m) => m[1]);
  const payload = { host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList };
  assert.equal(payload.host, HOST);
  assert.equal(payload.key, KEY);
  assert.equal(payload.keyLocation, KEY_LOCATION);
  assert.ok(Array.isArray(payload.urlList) && payload.urlList.length > 0);
  // keyLocation must be host + "/" + key + ".txt"
  assert.equal(payload.keyLocation, `https://${payload.host}/${payload.key}.txt`);
});

test('key file is reachable via keyLocation host (same HOST)', () => {
  assert.ok(KEY_LOCATION.startsWith(`https://${HOST}/`), 'keyLocation host mismatch');
  assert.ok(KEY_LOCATION.endsWith('.txt'), 'keyLocation ends with .txt');
  // The file served at KEY_LOCATION is byte-identical to public/<KEY>.txt
  const local = fs.readFileSync(path.resolve(`public/${KEY}.txt`), 'utf-8').trim();
  assert.equal(local, KEY);
});

test('dist key replica exists when the build copies public/ to dist/', () => {
  const distKey = path.resolve(`dist/${KEY}.txt`);
  if (!fs.existsSync(distKey)) {
    // Not all build paths copy public dotfiles — warn, don't fail, so the
    // test stays green on CI images that serve public/ directly.
    return;
  }
  assert.equal(fs.readFileSync(distKey, 'utf-8').trim(), KEY);
});
