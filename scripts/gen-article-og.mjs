/* Renders one 1200×630 Open Graph card per tribune and case study, in each
   language, straight from the same data files the pages render — the title
   on the card is therefore the title a crawler would index. Output lands in
   public/og/, ships with the app, and scripts/prerender.mjs precaches it.
   Run manually after adding an article (the build does not regenerate
   images). Usage: node scripts/gen-article-og.mjs */

/* global document */
/* the evaluate callbacks below run inside the rendered page */
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'public', 'og');
const tmpMeta = path.join(root, 'node_modules', '.tmp', 'prerender-meta');

fs.mkdirSync(outDir, { recursive: true });

/* reuse the compiled meta bundle scripts/prerender.mjs already produces, so
   this script needs no TypeScript loader of its own */
const metaBundle = path.join(tmpMeta, 'index.mjs');
if (!fs.existsSync(metaBundle)) {
  await build({
    configFile: false,
    logLevel: 'error',
    resolve: { alias: { '@': path.join(root, 'src') } },
    build: {
      ssr: path.join(root, 'src', 'seo', 'meta.ts'),
      outDir: tmpMeta,
      emptyOutDir: true,
      minify: false,
      rollupOptions: { output: { entryFileNames: 'index.mjs' } },
    },
  });
}
const { TRIBUNES, PROJECTS } = await import(pathToFileURL(metaBundle).href);

const NAME = 'Seynudé Jean-Fortuné <b>DAGNON</b>, PhD';
const DOMAIN = 'seynudedagnon.com';

const card = (kicker, title, lang) => `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><style>
  * { margin:0; box-sizing:border-box; }
  body { width:1200px; height:630px; background:#0c2e2a; color:#f4f1ea;
    font-family: Georgia, 'Times New Roman', serif;
    display:flex; align-items:stretch; }
  .frame { display:flex; width:100%; padding:56px 64px 48px; gap:44px;
    background:
      radial-gradient(1100px 500px at 100% -10%, rgba(18,68,59,.85), transparent 60%),
      radial-gradient(900px 420px at -5% 110%, rgba(201,162,75,.10), transparent 55%); }
  .brand { flex:0 0 250px; display:flex; flex-direction:column; justify-content:space-between; }
  .mono { font-family: Georgia, serif; font-size:56px; line-height:1;
    font-weight:700; color:#c9a24b; letter-spacing:.02em; }
  .domain { font-family: Arial, Helvetica, sans-serif; font-size:13px;
    letter-spacing:.22em; text-transform:uppercase; color:#9fb3ab; }
  .content { flex:1; display:flex; flex-direction:column; justify-content:center; min-width:0; }
  .kicker { font-family: Arial, Helvetica, sans-serif; letter-spacing:.30em;
    text-transform:uppercase; font-size:14px; color:#c9a24b; margin-bottom:22px; }
  h1 { font-size:46px; line-height:1.16; font-weight:700; color:#f4f1ea;
    display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; }
  .name { margin-top:26px; font-family: Arial, Helvetica, sans-serif;
    font-size:19px; color:#dfe7e2; }
  .name b { color:#c9a24b; }
</style></head><body><div class="frame">
  <div class="brand">
    <div class="mono">SD</div>
    <div class="domain">${DOMAIN}</div>
  </div>
  <div class="content">
    <div class="kicker">${kicker}</div>
    <h1 id="title">${title}</h1>
    <div class="name">${NAME}</div>
  </div>
</div></body></html>`;

const escapeHtml = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const items = [
  ...TRIBUNES.map((t) => ({ slug: t.slug, title: t.title, kicker: { fr: 'Tribune', en: 'Op-Ed' } })),
  ...PROJECTS.map((p) => ({ slug: p.slug, title: p.title, kicker: { fr: 'Étude de cas', en: 'Case study' } })),
];

const browser = await chromium.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });

let written = 0;
for (const item of items) {
  for (const lang of ['fr', 'en']) {
    const html = card(item.kicker[lang], escapeHtml(item.title[lang]), lang);
    const tmp = path.join(root, 'scripts', `.og-${item.slug}-${lang}.html`);
    fs.writeFileSync(tmp, html, 'utf-8');
    await page.goto('file://' + tmp.replace(/\\/g, '/'), { waitUntil: 'load' });
    /* shrink the title until it fits its three lines — long titles must not
       overflow the card */
    await page.evaluate(() => {
      const el = document.getElementById('title');
      if (!el) return;
      let size = 46;
      while (el.scrollHeight > el.clientHeight && size > 24) {
        size -= 1;
        el.style.fontSize = `${size}px`;
      }
    });
    await page.waitForTimeout(60);
    const out = path.join(outDir, `${item.slug}.${lang}.jpg`);
    await page.screenshot({ path: out, type: 'jpeg', quality: 90, clip: { x: 0, y: 0, width: 1200, height: 630 } });
    fs.unlinkSync(tmp);
    written++;
  }
}
await browser.close();
console.log(`[gen-article-og] wrote ${written} cards to public/og/`);
