/* Read-only HTTP/browser audit. Never submits forms or authenticated actions.
   Usage: node scripts/audit-production.mjs <output-directory> [base-url] */
/* global window, document */
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const output = path.resolve(process.argv[2] || 'node_modules/.tmp/production-audit');
const base = process.argv[3] || 'https://seynudedagnon.com';
fs.mkdirSync(output, { recursive: true });
const results = { base, date: new Date().toISOString(), http: [], pages: [], checks: {}, limitations: [] };
const save = () => fs.writeFileSync(path.join(output, 'audit.json'), JSON.stringify(results, null, 2));
async function check(name, fn) {
  try { await fn(); } catch (error) { results.limitations.push({ name, error: error.message }); }
  save();
  console.log(name);
}
async function get(route) {
  const response = await fetch(new URL(route, base), { signal: AbortSignal.timeout(20000), redirect: 'manual' });
  const html = await response.text();
  const row = {
    route, status: response.status, location: response.headers.get('location'),
    headers: Object.fromEntries(response.headers),
    title: html.match(/<title>([^<]*)<\/title>/)?.[1],
    canonical: html.match(/rel="canonical" href="([^"]+)"/)?.[1],
    robots: html.match(/name="robots" content="([^"]+)"/)?.[1],
    h1Count: (html.match(/<h1[\s>]/g) || []).length,
    jsonLdCount: (html.match(/application\/ld\+json/g) || []).length,
    scripts: [...html.matchAll(/<script[^>]*src="([^"]+)"/g)].map(m => m[1]),
  };
  results.http.push(row);
  return html;
}
const routes = ['/', '/fr', '/contact', '/fr/contact', '/admin', '/fr/admin', '/changelog', '/fr/changelog',
  '/newsletter/preferences', '/fr/newsletter/preferences', '/audit-missing-route', '/en/contact',
  '/robots.txt', '/sitemap.xml', '/feed.xml', '/podcast.xml', '/sw.js', '/manifest.webmanifest', '/llms.txt'];
for (const route of routes) await check(`HTTP ${route}`, async () => {
  const html = await get(route);
  if (['/', '/robots.txt', '/sitemap.xml', '/llms.txt'].includes(route)) {
    fs.writeFileSync(path.join(output, route === '/' ? 'home.html' : route.slice(1)), html);
  }
});
await check('sitemap routes', async () => {
  const xml = fs.readFileSync(path.join(output, 'sitemap.xml'), 'utf8');
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  results.checks.sitemapCount = urls.length;
  for (let i = 0; i < urls.length; i += 4) {
    await Promise.all(urls.slice(i, i + 4).map(url => check(`sitemap ${new URL(url).pathname}`, () => get(new URL(url).pathname))));
  }
});
const browser = await chromium.launch();
try {
  for (const route of ['/', '/fr', '/contact', '/fr/contact', '/publications', '/impact', '/newsletter/preferences']) {
    await check(`browser ${route}`, async () => {
      const context = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'en-US' });
      try {
        const page = await context.newPage();
        const errors = [];
        const failures = [];
        page.on('pageerror', e => errors.push(e.message));
        page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
        page.on('requestfailed', req => failures.push({ url: req.url(), error: req.failure()?.errorText }));
        await page.addInitScript(() => {
          window.__auditPerf = { lcp: 0, cls: 0 };
          new PerformanceObserver(list => { for (const e of list.getEntries()) window.__auditPerf.lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
          new PerformanceObserver(list => { for (const e of list.getEntries()) if (!e.hadRecentInput) window.__auditPerf.cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
        });
        const response = await page.goto(new URL(route, base).href, { waitUntil: 'load', timeout: 30000 });
        await page.waitForTimeout(1800);
        const perf = await page.evaluate(() => ({ ...window.__auditPerf, width: window.innerWidth, scrollWidth: document.documentElement.scrollWidth }));
        const axe = await new AxeBuilder({ page }).analyze();
        const file = `${route.replaceAll('/', '_') || 'home'}-mobile.png`;
        await page.screenshot({ path: path.join(output, file) });
        results.pages.push({ route, status: response.status(), title: await page.title(), perf, errors, failures,
          violations: axe.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n => ({ target: n.target, html: n.html, summary: n.failureSummary })) })), screenshot: file });
      } finally { await context.close(); }
    });
  }
  await check('consent and navigation', async () => {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, locale: 'en-US' });
    try {
      const page = await context.newPage();
      const analytics = [];
      page.on('request', req => { if (/google-analytics|googletagmanager|vercel-insights|va\.vercel-scripts|_vercel\/(insights|speed-insights)/.test(req.url())) analytics.push(req.url()); });
      await page.goto(base, { waitUntil: 'load' });
      await page.waitForTimeout(1200);
      results.checks.analyticsBefore = [...analytics];
      await page.getByRole('button', { name: 'Decline', exact: true }).click();
      await page.waitForTimeout(600);
      results.checks.analyticsDeclined = [...analytics];
      await page.getByRole('button', { name: 'Manage cookies', exact: true }).click();
      await page.getByRole('button', { name: 'Accept', exact: true }).click();
      await page.waitForTimeout(1600);
      results.checks.analyticsAccepted = [...analytics];
      results.checks.consentStorage = await page.evaluate(() => localStorage.getItem('consent-analytics'));
      await page.screenshot({ path: path.join(output, 'home-desktop.png') });
      await page.goto(new URL('/contact?email=reader%40example.test&token=audit-invalid#settings', base).href, { waitUntil: 'load' });
      await page.getByRole('button', { name: 'FR', exact: true }).click();
      await page.waitForURL('**/fr/contact?**');
      results.checks.languageUrl = page.url();
      results.checks.serviceWorker = await page.evaluate(async () => ({ controlled: Boolean(navigator.serviceWorker.controller), registered: Boolean(await navigator.serviceWorker.getRegistration()) }));
    } finally { await context.close(); }
  });
} finally { await browser.close(); save(); }
console.log(JSON.stringify({ pages: results.pages.map(p => ({ route: p.route, status: p.status, perf: p.perf, violations: p.violations.length })), limitations: results.limitations }, null, 2));
