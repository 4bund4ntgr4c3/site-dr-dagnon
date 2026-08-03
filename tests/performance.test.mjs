/* Performance budget: LCP and CLS measured in a real Chromium against the
   built site served from dist/ — every external origin (fonts, gtag, Vercel
   analytics) is stubbed out, so the numbers are the site's own. The budgets
   are deliberately generous: this suite exists to catch a regression that
   ships a bloated chunk or a layout that jumps, not to benchmark. Run as
   part of `npm test` (build first). */

/* global window */
/* the addInitScript and evaluate callbacks below run inside the page */
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
/* ephemeral: fixed ports collide when two suites run at once */
let PORT;

/* the heaviest pages in the app: the code-split article pages and the
   image-rich listing pages are where a regression would show up first */
const ROUTES = ['/', '/publications', '/tribunes/from-malaria-control-to-elimination', '/impact', '/fr'];

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

before(async () => {
  server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    let abs = path.join(dist, url.pathname);
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
    /* like production: hashed assets and fonts are immutable, so Chromium
       does not re-fetch them (without cache headers the memory cache evicts
       them under load and the portrait re-downloads, inflating LCP) */
    const immutable = /^\/(assets|fonts)\//.test(url.pathname);
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(abs)] ?? 'application/octet-stream',
      ...(immutable ? { 'Cache-Control': 'public, max-age=31536000, immutable' } : {}),
    });
    fs.createReadStream(abs).pipe(res);
  });
  await new Promise((resolve) => server.listen(0, resolve));
  PORT = server.address().port;
  browser = await chromium.launch();
});

after(async () => {
  await browser?.close();
  await new Promise((resolve) => server.close(resolve));
});

test('key routes meet the LCP and CLS budgets', async () => {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  /* hermetic: Google Fonts, gtag and Vercel analytics are all external —
     the budgets must measure the site itself, not the CDNs' mood */
  await context.route('**://fonts.googleapis.com/**', (r) => r.abort());
  await context.route('**://fonts.gstatic.com/**', (r) => r.abort());
  await context.route('**://www.googletagmanager.com/**', (r) => r.abort());
  await context.route('**://www.google-analytics.com/**', (r) => r.abort());
  await context.route('**://va.vercel-scripts.com/**', (r) => r.abort());
  const report = [];
  try {
    for (const route of ROUTES) {
      const page = await context.newPage();
      try {
        /* observers must be registered before the document loads; Chromium
           only appends LCP/CLS entries to the performance buffer at
           finalization time, so getEntriesByType() cannot be trusted here */
        await page.addInitScript(() => {
          window.__perf = { lcp: [], cls: 0 };
          new PerformanceObserver((list) => {
            for (const e of list.getEntries()) window.__perf.lcp.push(e.startTime);
          }).observe({ type: 'largest-contentful-paint' });
          new PerformanceObserver((list) => {
            for (const e of list.getEntries()) {
              if (!e.hadRecentInput) window.__perf.cls += e.value;
            }
          }).observe({ type: 'layout-shift' });
        });
        const response = await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'networkidle' });
        assert.ok(response && response.ok(), `${route} did not load`);
        /* let the client mount and fonts settle — most CLS happens there */
        await page.waitForTimeout(1200);
        const { lcp, cls } = await page.evaluate(() => ({
          lcp: Math.round(window.__perf.lcp[window.__perf.lcp.length - 1] ?? 0),
          cls: Math.round(window.__perf.cls * 1000) / 1000,
        }));
        report.push({ route, lcp, cls });
        assert.ok(lcp > 0, `${route}: no LCP entry recorded`);
        /* measured range on this hardware: 1.3-2.2s idle, up to ~4.2s under
           concurrent CI load — the budget must catch a regression (a
           render-blocking chunk costs seconds), not machine noise. Since the
           fonts were self-hosted, LCP lands on the web-font hero text and the
           portrait (measured 3.5s idle / ~5.1s under concurrent load), so the
           cap is sized accordingly. */
        assert.ok(lcp < 5500, `${route}: LCP ${lcp}ms is over the 5500ms budget`);
        assert.ok(cls < 0.1, `${route}: CLS ${cls} is over the 0.1 budget`);
      } finally {
        await page.close();
      }
    }
  } finally {
    await context.close();
  }
  /* the table is printed even on success — the budget should trend down,
     not just hover under the cap */
  console.table(report);
});
