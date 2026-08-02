/* Styled PDFs for the press kit and the CV, printed from the prerendered
 * pages in dist/ — the same static HTML a visitor gets, so the PDF can
 * never drift from the live site, and the @media print stylesheet (see
 * src/index.css) turns it into clean A4 documents in the site colors.
 *
 * Run AFTER `npm run build` (the pages must exist in dist/) and commit the
 * output under public/ — vite copies it into dist/ on the next build, and
 * the service worker precache in scripts/prerender.mjs lists them.
 *
 * The CV page is already print-ready (A4 sheet, site chrome hidden). The
 * press kit page hides its FAQ block when printing (print:hidden) so the
 * PDF stays one clean document.
 */

import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');

const jobs = [
  { lang: 'en', route: '/cv', out: 'public/cv/cv-en.pdf' },
  { lang: 'fr', route: '/cv', out: 'public/cv/cv-fr.pdf' },
  { lang: 'en', route: '/presse', out: 'public/presse/press-kit-en.pdf' },
  { lang: 'fr', route: '/presse', out: 'public/presse/press-kit-fr.pdf' },
];

const htmlFile = (job) => path.join(dist, ...job.route.split('/').filter(Boolean), 'index.html');

for (const job of jobs) {
  if (!fs.existsSync(htmlFile(job))) {
    console.error(`[gen-pdfs] ${htmlFile(job)} missing — run \`npm run build\` first.`);
    process.exit(1);
  }
}

const browser = await chromium.launch({
  /* chromium resolved from playwright's own registry — no machine-specific path */
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const page = await browser.newPage();
for (const job of jobs) {
  /* page.pdf() applies the @media print rules; @page { size: A4; margin }
     from src/index.css is honored when no margin option is passed */
  await page.goto('file://' + htmlFile(job).replace(/\\/g, '/'), { waitUntil: 'networkidle' });
  await page.pdf({ path: path.join(root, job.out), printBackground: true });
  console.log(`[gen-pdfs] wrote ${job.out} (${job.lang} ${job.route})`);
}
await browser.close();
