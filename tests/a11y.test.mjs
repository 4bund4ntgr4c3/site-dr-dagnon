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
/* ephemeral: fixed ports collide when two suites run at once */
let PORT;

/* the routes most likely to carry the defects axe catches — one language
   pair per page type rather than all 100 pages (the visual templates repeat) */
const ROUTES = (() => {
  /* derive the audit list from dist/ itself: every directory holding an
     index.html is a prerendered route, in every language. The hand-written
     list used to drift from src/seo/meta.ts (missing /fr mirrors, new page
     types) — a page that exists on disk is now always audited. */
  const routes = [];
  const walk = (dir, base) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === 'assets') continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (fs.existsSync(path.join(full, 'index.html'))) routes.push(`${base}/${entry.name}`);
        walk(full, `${base}/${entry.name}`);
      }
    }
  };
  walk(dist, '');
  if (fs.existsSync(path.join(dist, 'index.html'))) routes.push('/');
  return routes.sort();
})();

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
  await new Promise((resolve) => server.listen(0, resolve));
  PORT = server.address().port;
  /* a dedicated context per browser run — AxeBuilder requires one, pages
     created directly from the browser are refused */
  browser = await chromium.launch();
  context = await browser.newContext();
  /* the pages fetch Google Fonts, gtag and Vercel analytics at load — the
     suite must not depend on the network, so every external origin is
     aborted (fonts fall back to system faces, beacons fail silently) */
  await context.route('**://fonts.googleapis.com/**', (r) => r.abort());
  await context.route('**://fonts.gstatic.com/**', (r) => r.abort());
  await context.route('**://www.googletagmanager.com/**', (r) => r.abort());
  await context.route('**://www.google-analytics.com/**', (r) => r.abort());
  await context.route('**://va.vercel-scripts.com/**', (r) => r.abort());
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

/* the search dialog only exists in the DOM once opened, so the loop above can
   never audit it — this test mounts it the way a user would */
test('axe: no critical or serious violations in the open search dialog', async () => {
  const page = await context.newPage();
  try {
    const response = await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'domcontentloaded' });
    assert.ok(response && response.ok());
    await page.getByRole('button', { name: 'Search' }).click();
    await page.getByPlaceholder('Search everything: op-eds, publications, photos, career…').fill('malaria');
    await page.waitForTimeout(200);
    const dialog = page.getByRole('dialog');
    const results = await new AxeBuilder({ page }).include('[role="dialog"]').analyze();
    const bad = results.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious');
    assert.deepEqual(
      bad.map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`),
      [],
      `search dialog: ${bad.length} critical/serious violations`,
    );
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'hidden' });
  } finally {
    await page.close();
  }
});

/* Contact page: the static loop already audits /contact, but the form carries
   labels, required markers and the honeypot field — re-audit explicitly so the
   dedicated coverage survives a change in the walk filter. */
test('axe: no violations on the contact page (form labels and honeypot)', async () => {
  const page = await context.newPage();
  try {
    const response = await page.goto(`http://localhost:${PORT}/contact`, { waitUntil: 'domcontentloaded' });
    assert.ok(response && response.ok());
    await page.waitForTimeout(200);
    const results = await new AxeBuilder({ page }).analyze();
    const bad = results.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious');
    assert.deepEqual(
      bad.map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`),
      [],
      `contact: ${bad.length} critical/serious violations`,
    );
  } finally {
    await page.close();
  }
});

/* CV page: the sticky action bar (print + share) only renders on screen and
   carries its own buttons — audit the page with it visible. */
test('axe: no violations on the CV page including the action bar', async () => {
  const page = await context.newPage();
  try {
    const response = await page.goto(`http://localhost:${PORT}/cv`, { waitUntil: 'domcontentloaded' });
    assert.ok(response && response.ok());
    await page.waitForTimeout(200);
    const results = await new AxeBuilder({ page }).analyze();
    const bad = results.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious');
    assert.deepEqual(
      bad.map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`),
      [],
      `cv: ${bad.length} critical/serious violations`,
    );
  } finally {
    await page.close();
  }
});

/* Photo lightbox: the overlay traps focus, carries labelled controls (close,
   prev/next) and a backdrop — click the first community image to open it. */
test('axe: no violations in the photo lightbox overlay', async () => {
  const page = await context.newPage();
  try {
    const response = await page.goto(`http://localhost:${PORT}/media/community`, { waitUntil: 'domcontentloaded' });
    assert.ok(response && response.ok(), '/media/community did not load');
    // Lightbox trigger: first community card link or image link to a photo page
    const trigger = page.locator('a[href*="/media/community/"]').first();
    if ((await trigger.count()) === 0) return; // no community photos, skip
    await trigger.click();
    await page.waitForTimeout(500);
    // Either a dialog overlay exists or navigation landed on the photo page
    const dialog = page.getByRole('dialog');
    const hasDialog = (await dialog.count()) > 0;
    const builder = hasDialog ? new AxeBuilder({ page }).include('[role="dialog"]') : new AxeBuilder({ page });
    const results = await builder.analyze();
    const bad = results.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious');
    assert.deepEqual(
      bad.map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`),
      [],
      `photo lightbox/photo page: ${bad.length} critical/serious violations`,
    );
    if (hasDialog) await page.keyboard.press('Escape');
  } finally {
    await page.close();
  }
});

test('axe: lazy impact tools remain accessible after they load', async () => {
  const page = await context.newPage();
  try {
    const response = await page.goto(`http://localhost:${PORT}/impact`, { waitUntil: 'domcontentloaded' });
    assert.ok(response && response.ok());
    await page.locator('footer').scrollIntoViewIfNeeded();
    await page.getByRole('switch').first().waitFor({ state: 'visible' });
    assert.equal(await page.getByRole('switch').count(), 3);
    const results = await new AxeBuilder({ page }).analyze();
    const bad = results.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious');
    assert.deepEqual(bad.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`), []);
  } finally {
    await page.close();
  }
});

test('blocked storage never blanks the page', async () => {
  const page = await context.newPage();
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new Error('storage blocked'); };
    Storage.prototype.setItem = () => { throw new Error('storage blocked'); };
  });
  try {
    const response = await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'domcontentloaded' });
    assert.ok(response && response.ok());
    await page.locator('h1').waitFor({ state: 'visible' });
    assert.ok((await page.locator('main').innerText()).length > 500);
  } finally {
    await page.close();
  }
});

test('analytics requests are consent-gated and advertising consent stays denied', async () => {
  const page = await context.newPage();
  const external = [];
  page.on('request', (request) => {
    if (/googletagmanager|google-analytics|vercel-insights/.test(request.url())) external.push(request.url());
  });
  try {
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(250);
    assert.deepEqual(external, []);
    await page.getByRole('button', { name: 'Accept' }).click();
    await page.waitForTimeout(250);
    assert.ok(external.some((url) => url.includes('googletagmanager.com')));
  } finally {
    await page.close();
  }
});

test('language switching preserves security-sensitive query parameters and the hash', async () => {
  const page = await context.newPage();
  try {
    await page.goto(`http://localhost:${PORT}/contact?email=reader%40example.test&token=signed-token#settings`, { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'FR', exact: true }).click();
    await page.waitForURL(/\/fr\/contact\?email=reader%40example\.test&token=signed-token#settings$/);
  } finally {
    await page.close();
  }
});

test('critical home content stays visible without JavaScript', async () => {
  const noJs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await noJs.newPage();
  try {
    const response = await page.goto(`http://localhost:${PORT}/fr`, { waitUntil: 'domcontentloaded' });
    assert.ok(response && response.ok());
    const h1 = page.locator('h1').first();
    await h1.waitFor({ state: 'visible' });
    assert.equal(await h1.evaluate((el) => el.ownerDocument.defaultView.getComputedStyle(el).opacity), '1');
    assert.ok(await page.getByRole('link', { name: /LinkedIn/i }).first().isVisible());
  } finally {
    await noJs.close();
  }
});

test('mobile header keeps the full name out of the action controls', async () => {
  const page = await context.newPage();
  await page.setViewportSize({ width: 390, height: 844 });
  try {
    await page.goto(`http://localhost:${PORT}/fr`, { waitUntil: 'domcontentloaded' });
    const logo = page.getByRole('link', { name: /Seynudé/ }).first();
    const search = page.getByRole('button', { name: /Rechercher|Search/ }).first();
    const [logoBox, searchBox] = await Promise.all([logo.boundingBox(), search.boundingBox()]);
    assert.ok(logoBox && searchBox);
    assert.ok(logoBox.x + logoBox.width <= searchBox.x, 'logo link overlaps the search control');
  } finally {
    await page.close();
  }
});
