/* Accessibility audit: runs axe-core (via Playwright) against the built
   site served from dist/, and fails on critical or serious violations.
   Run as part of `npm test` — it needs the production build first, exactly
   like the prerender suites. The server is a local static file server so
   the test has no dependency on vite or network access. */

import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const PORT = 4317;

/* the routes most likely to carry the defects axe catches — one language
   pair per page type rather than all 100 pages (the visual templates repeat) */
const ROUTES = [
  '/',
  '/fr',
  '/contact',
  '/cv',
  '/fr/cv',
  '/media',
  '/media/press',
  '/media/community',
  '/media/community/nuit-paludisme-1',
  '/publications',
  '/tribunes',
  '/tribunes/from-malaria-control-to-elimination',
  '/fr/tribunes/from-malaria-control-to-elimination',
  '/projets',
  '/projets/irs-nord-benin',
  '/agenda',
  '/presse',
  '/inviter',
  '/newsletter',
];

/* mime map for the few types dist/ contains */
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.webmanifest': 'application/manifest+json',
  '.xml': 'application/xml',
  '.ics': 'text/calendar',
  '.zip': 'application/zip',
};

let server;
let browser;
let context;

before(async () => {
  server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    let abs = path.join(dist, url.pathname);
    /* /fr, /tribunes/<slug>… are directories containing index.html */
    if (fs.existsSync(abs) && fs.statSync(abs).isDirectory()) {
      abs = path.join(abs, 'index.html');
    } else if (!fs.existsSync(abs)) {
      abs = abs + '.html';
    }
    if (!fs.existsSync(abs)) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(abs)] ?? 'application/octet-stream' });
    fs.createReadStream(abs).pipe(res);
  });
  await new Promise((resolve) => server.listen(PORT, resolve));
  /* a dedicated context per browser run — AxeBuilder requires one, pages
     created directly from the browser are refused */
  browser = await chromium.launch();
  context = await browser.newContext();
});

after(async () => {
  await context?.close();
  await browser?.close();
  await new Promise((resolve) => server.close(resolve));
});

for (const route of ROUTES) {
  test(`axe: no critical or serious violations on ${route}`, async () => {
    const page = await context.newPage();
    try {
      const response = await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'domcontentloaded' });
      assert.ok(response && response.ok(), `${route} did not load`);
      const results = await new AxeBuilder({ page }).analyze();
      const bad = results.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious');
      assert.deepEqual(
        bad.map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`),
        [],
        `${route}: ${bad.length} critical/serious violations`,
      );
    } finally {
      await page.close();
    }
  });
}
