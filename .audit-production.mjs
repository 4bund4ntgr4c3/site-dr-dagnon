/* Temporary production probe. Removed after the audit. */
/* global window */
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const base = 'https://seynudedagnon.com';
const browser = await chromium.launch();
const results = { routes: [], consent: {}, language: {}, serviceWorker: {}, screenshots: [] };

async function measure(path, viewport = { width: 390, height: 844 }) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  const failures = [];
  page.on('requestfailed', (request) => failures.push({ url: request.url(), error: request.failure()?.errorText }));
  await page.addInitScript(() => {
    window.__auditPerf = { lcp: [], cls: 0 };
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) window.__auditPerf.lcp.push(entry.startTime);
    }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__auditPerf.cls += entry.value;
    }).observe({ type: 'layout-shift', buffered: true });
  });
  const started = Date.now();
  const response = await page.goto(`${base}${path}`, { waitUntil: 'networkidle', timeout: 45_000 });
  await page.waitForTimeout(1200);
  const perf = await page.evaluate(() => ({
    lcp: Math.round(window.__auditPerf.lcp.at(-1) ?? 0),
    cls: Math.round(window.__auditPerf.cls * 1000) / 1000,
    nav: performance.getEntriesByType('navigation')[0]?.toJSON(),
  }));
  const axe = await new AxeBuilder({ page }).analyze();
  results.routes.push({
    path,
    status: response?.status(),
    wallMs: Date.now() - started,
    title: await page.title(),
    h1: await page.locator('h1').first().textContent().catch(() => null),
    lcpMs: perf.lcp,
    cls: perf.cls,
    ttfbMs: Math.round(perf.nav?.responseStart ?? 0),
    domContentLoadedMs: Math.round(perf.nav?.domContentLoadedEventEnd ?? 0),
    loadMs: Math.round(perf.nav?.loadEventEnd ?? 0),
    seriousAxe: axe.violations.filter((v) => ['serious', 'critical'].includes(v.impact)).map((v) => ({
      id: v.id,
      nodes: v.nodes.slice(0, 8).map((node) => ({ target: node.target, html: node.html, failureSummary: node.failureSummary })),
    })),
    failedRequests: failures.slice(0, 10),
  });
  await context.close();
}

for (const path of ['/', '/fr', '/publications', '/impact']) await measure(path);

{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const analytics = [];
  page.on('request', (request) => {
    if (/google-analytics|googletagmanager|vercel-insights|va\.vercel-scripts/.test(request.url())) analytics.push(request.url());
  });
  await page.goto(base, { waitUntil: 'networkidle', timeout: 45_000 });
  await page.screenshot({ path: 'C:/Users/Studio26/.codex/visualizations/2026/09/04/01a06cee-e7eb-7203-a55c-fddf98074585/production/home-mobile-viewport.png' });
  results.consent.before = [...analytics];
  await page.getByRole('button', { name: 'Accept' }).click();
  await page.waitForTimeout(1500);
  results.consent.after = [...analytics];
  results.consent.storage = await page.evaluate(() => localStorage.getItem('consent-analytics'));
  await page.screenshot({ path: 'C:/Users/Studio26/.codex/visualizations/2026/09/04/01a06cee-e7eb-7203-a55c-fddf98074585/production/home-mobile.png', fullPage: true });
  results.screenshots.push('home-mobile.png');
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  await page.goto(`${base}/contact?email=reader%40example.test&token=signed-token#settings`, { waitUntil: 'networkidle', timeout: 45_000 });
  await page.getByRole('button', { name: 'FR' }).click();
  await page.waitForTimeout(500);
  results.language.url = page.url();
  await page.goto(base, { waitUntil: 'networkidle', timeout: 45_000 });
  await page.screenshot({ path: 'C:/Users/Studio26/.codex/visualizations/2026/09/04/01a06cee-e7eb-7203-a55c-fddf98074585/production/home-desktop-viewport.png' });
  await page.screenshot({ path: 'C:/Users/Studio26/.codex/visualizations/2026/09/04/01a06cee-e7eb-7203-a55c-fddf98074585/production/home-desktop.png', fullPage: true });
  results.screenshots.push('home-desktop.png');
  results.serviceWorker.controlled = await page.evaluate(() => Boolean(navigator.serviceWorker?.controller));
  results.serviceWorker.registration = await page.evaluate(async () => Boolean(await navigator.serviceWorker?.getRegistration()));
  await context.close();
}

await browser.close();
console.log(JSON.stringify(results, null, 2));
