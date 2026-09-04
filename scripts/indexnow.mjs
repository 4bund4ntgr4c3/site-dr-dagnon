/* scripts/indexnow.mjs
 * Submits all sitemap URLs to the IndexNow protocol (notifying Bing, ChatGPT Search,
 * Microsoft Copilot, Naver, Yandex, and Seznam simultaneously).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const sitemapPath = path.join(dist, 'sitemap.xml');

const HOST = 'seynudedagnon.com';
const KEY = '92d9c43333334113b7144ad3b6688a8c';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const fetch = (input, init = {}) => globalThis.fetch(input, {
  ...init,
  signal: init.signal ?? AbortSignal.timeout(10_000),
});

async function main() {
  if (!fs.existsSync(sitemapPath)) {
    console.error('[indexnow] sitemap.xml not found in dist/. Please run `npm run build` first.');
    process.exit(1);
  }

  const xml = fs.readFileSync(sitemapPath, 'utf-8');
  const urlMatches = xml.matchAll(/<loc>([^<]+)<\/loc>/g);
  const urlList = Array.from(urlMatches, (m) => m[1]);

  if (urlList.length === 0) {
    console.warn('[indexnow] No URLs found in sitemap.xml.');
    return;
  }

  console.log(`[indexnow] Submitting ${urlList.length} URLs to IndexNow for host ${HOST}...`);

  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList,
  };

  try {
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok || response.status === 200 || response.status === 202) {
      console.log(`[indexnow] Successfully submitted ${urlList.length} URLs to IndexNow! (Status: ${response.status})`);
    } else {
      const text = await response.text();
      console.warn(`[indexnow] Submission returned status ${response.status}: ${text}`);
    }
  } catch (err) {
    console.error(`[indexnow] Error sending request to IndexNow: ${err.message}`);
  }
}

main();
