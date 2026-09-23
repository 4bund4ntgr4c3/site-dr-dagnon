import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const tmpServer = path.join(root, 'node_modules', '.tmp', 'prerender-server');

// Use already-built entry-server (no rebuild needed)
const { renderPage } = await import(pathToFileURL(path.join(tmpServer, 'entry-server.mjs')).href + '?v=' + Date.now());

for (const path2 of ['/', '/fr']) {
  const html = renderPage(path2);
  const hasMain = html.includes('<main');
  const hasH1 = html.toLowerCase().includes('<h1');
  const hasHero = html.includes('hero-reveal');
  console.log(`renderPage('${path2}'): length=${html.length} hasMain=${hasMain} hasH1=${hasH1} hasHero=${hasHero}`);
  if (!hasMain) {
    // Print first 300 chars
    console.log('  output:', html.slice(0, 300));
  }
}
