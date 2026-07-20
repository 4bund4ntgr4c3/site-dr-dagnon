import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const CHROME = 'C:\\Users\\Studio26\\AppData\\Local\\ms-playwright\\chromium-1208\\chrome-win64\\chrome.exe';
const out = path.join(root, 'public', 'icon-512.png');

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  *{margin:0}
  body{width:512px;height:512px;background:#0c2e2a;display:flex;align-items:center;justify-content:center;font-family:Georgia,'Times New Roman',serif}
  .badge{width:360px;height:360px;border-radius:80px;background:#0c2e2a;display:flex;align-items:center;justify-content:center;
    border:6px solid #c9a24b;box-shadow:0 0 0 10px rgba(201,162,75,.25)}
  .sd{color:#c9a24b;font-size:170px;font-weight:600;letter-spacing:-6px}
</style></head><body><div class="badge"><span class="sd">SD</span></div></body></html>`;

const tmp = path.join(root, 'scripts', '.icon-tmp.html');
fs.writeFileSync(tmp, html, 'utf-8');

const browser = await chromium.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});
const page = await browser.newPage({ viewport: { width: 512, height: 512 }, deviceScaleFactor: 1 });
await page.goto('file://' + tmp.replace(/\\/g, '/'), { waitUntil: 'networkidle' });
await page.waitForTimeout(200);
await page.screenshot({ path: out, type: 'png', clip: { x: 0, y: 0, width: 512, height: 512 } });
await browser.close();
fs.unlinkSync(tmp);
console.log('[gen-icon] wrote', out);
