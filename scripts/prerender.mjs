import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');

const PORT = 4319;
const CHROME = 'C:\\Users\\Studio26\\AppData\\Local\\ms-playwright\\chromium-1208\\chrome-win64\\chrome.exe';

const MIME = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webmanifest': 'application/manifest+json',
  '.xml': 'application/xml',
  '.ico': 'image/x-icon',
};

function serve() {
  const server = http.createServer((req, res) => {
    let urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
    if (urlPath === '/') urlPath = '/index.html';
    let filePath = path.join(dist, urlPath);
    if (!filePath.startsWith(dist)) {
      res.writeHead(403).end();
      return;
    }
    fs.stat(filePath, (err, stat) => {
      if (err || !stat.isFile()) filePath = path.join(dist, 'index.html');
      fs.readFile(filePath, (e, data) => {
        if (e) {
          res.writeHead(404).end('not found');
          return;
        }
        res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream' });
        res.end(data);
      });
    });
  });
  return new Promise((r) => server.listen(PORT, r)).then(() => server);
}

async function run() {
  if (!fs.existsSync(dist)) {
    console.warn('[prerender] no dist/ — skipping (run vite build first)');
    return;
  }
  if (!fs.existsSync(CHROME)) {
    console.warn('[prerender] chromium not found — skipping prerender (deploying SPA).');
    return;
  }

  const server = await serve();
  console.log(`[prerender] static server on http://localhost:${PORT}`);

  let chromium;
  try {
    chromium = (await import('playwright')).chromium;
  } catch (e) {
    console.warn('[prerender] playwright not installed — skipping prerender.');
    server.close();
    return;
  }

  let browser;
  try {
    browser = await chromium.launch({
      executablePath: CHROME,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  } catch (e) {
    console.warn('[prerender] chromium launch failed — skipping. ', e.message);
    server.close();
    return;
  }

  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'load' });
  await page.waitForSelector('#root > *', { timeout: 30000 });
  try {
    await page.waitForFunction(() => window.__APP_MOUNTED__ === true, { timeout: 15000 });
  } catch {
    console.warn('[prerender] app mount flag not detected — capturing current DOM');
  }
  await page.waitForTimeout(300);

  const html = await page.content();
  fs.writeFileSync(path.join(dist, 'index.html'), html, 'utf-8');

  const text = await page.evaluate(() => document.body.innerText);
  console.log(`[prerender] rendered #root chars: ${text.length}`);

  await browser.close();
  server.close();
  console.log('[prerender] done');
}

run().catch((e) => {
  console.warn('[prerender] skipped due to error:', e.message);
});
