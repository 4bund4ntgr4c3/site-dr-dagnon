import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const CHROME = 'C:\\Users\\Studio26\\AppData\\Local\\ms-playwright\\chromium-1208\\chrome-win64\\chrome.exe';
const photo = path.join(root, 'public', 'dr-seynude-dagnon.jpeg');
const out = path.join(root, 'public', 'og-image.jpg');

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  * { margin:0; box-sizing:border-box; }
  body { width:1200px; height:630px; background:#0c2e2a; color:#f4f1ea;
    font-family: Georgia, 'Times New Roman', serif;
    display:flex; align-items:center; }
  .card { display:flex; align-items:center; width:100%; height:100%; padding:0 0 0 70px; gap:48px; }
  .photo { width:340px; height:430px; border-radius:28px; object-fit:cover;
    border:3px solid #c9a24b; box-shadow:0 20px 50px rgba(0,0,0,.45); }
  .txt { display:flex; flex-direction:column; max-width:620px; }
  .kicker { font-family: Arial, Helvetica, sans-serif; letter-spacing:.32em;
    text-transform:uppercase; font-size:15px; color:#c9a24b; margin-bottom:18px; }
  .name { font-size:54px; line-height:1.08; font-weight:700; color:#f4f1ea; }
  .name b { color:#c9a24b; font-weight:700; }
  .role { margin-top:22px; font-family:Arial, Helvetica, sans-serif; font-size:22px;
    color:#dfe7e2; line-height:1.4; }
  .tag { margin-top:26px; font-family:Arial, Helvetica, sans-serif; font-size:16px;
    letter-spacing:.18em; text-transform:uppercase; color:#9fb3ab; }
</style></head><body><div class="card">
  <img class="photo" src="file://${photo.replace(/\\/g, '/')}" alt="">
  <div class="txt">
    <div class="kicker">Public Health · Malaria</div>
    <div class="name">Seynudé Jean-Fortuné<br><b>DAGNON</b>, PhD</div>
    <div class="role">Senior Program Officer — Malaria / Francophone Africa,<br>Gates Foundation</div>
    <div class="tag">From clinical field to global strategies</div>
  </div>
</div></body></html>`;

const tmp = path.join(root, 'scripts', '.og-tmp.html');
fs.writeFileSync(tmp, html, 'utf-8');

const browser = await chromium.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.goto('file://' + tmp.replace(/\\/g, '/'), { waitUntil: 'networkidle' });
await page.waitForTimeout(300);
await page.screenshot({ path: out, type: 'jpeg', quality: 90, clip: { x: 0, y: 0, width: 1200, height: 630 } });
await browser.close();
fs.unlinkSync(tmp);
console.log('[gen-og] wrote', out);
