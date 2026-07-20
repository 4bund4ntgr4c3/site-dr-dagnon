import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dist = fs.readFileSync(path.join(root, 'dist', 'index.html'), 'utf-8');
const m = dist.match(/<div id="root">([\s\S]*?)<\/div>/);
if (!m) {
  console.error('no #root in dist/index.html');
  process.exit(1);
}
const inner = m[1];
const src = fs.readFileSync(path.join(root, 'index.html'), 'utf-8');
const next = src.replace(/<div id="root">[\s\S]*?<\/div>/, () => `<div id="root">${inner}</div>`);
if (next === src) {
  console.error('replace noop — check source');
  process.exit(1);
}
fs.writeFileSync(path.join(root, 'index.html'), next);
console.log('embedded root inner length:', inner.length);
