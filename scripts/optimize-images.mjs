/* One-off asset conversion for the photographs in public/.
 *
 * Run with `npm run images` after adding or replacing a photo, then point the
 * reference in src/ at the .webp name. Not part of the build: the converted
 * files are committed, so a deploy never depends on sharp being installable.
 *
 * Choices, from measuring these actual files rather than from habit:
 *   - the sources are already tightly compressed JPEGs at modest dimensions
 *     (960x1280 and smaller), so re-encoding at a high quality *grew* several
 *     of them. Quality 72 is where WebP starts paying for itself: −23%.
 *   - mozjpeg saved 1% — not worth a format change.
 *   - AVIF saved 39%, but leaves older devices with no image at all unless a
 *     <picture> fallback ships too. WebP has been universal since 2020.
 *   - no downscaling: at 960x1280 these are already about right for a
 *     lightbox on a high-density screen.
 *
 * Cover images are the exception: they are displayed in ~400px cards, so they
 * also get a -thumb variant instead of making a card pull a full-size photo.
 *
 * Deliberately left alone:
 *   og-image.jpg  — link unfurlers are unreliable with WebP, JPEG is safest
 *   favicon.png / icon-512.png — PNG is what the manifest and browsers expect
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(root, 'public');

const SKIP = new Set(['og-image.jpg', 'favicon.png', 'icon-512.png']);
const QUALITY = 72;

/* shown in ~400px cards — a 2x thumbnail is plenty */
const THUMB_SOURCES = new Set([
  'community/nuit-paludisme-1',
  'community/nuit-paludisme-5e-1',
  'community/philantropie-1',
  'community/genies-1',
]);
const THUMB_WIDTH = 800;
const THUMB_QUALITY = 60;

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return /\.(jpe?g|png)$/i.test(entry.name) && !SKIP.has(entry.name) ? [full] : [];
  });

const kb = (bytes) => `${(bytes / 1024).toFixed(0)} kB`;
const rel = (p) => path.relative(publicDir, p).replace(/\\/g, '/');

const sources = walk(publicDir);
if (sources.length === 0) {
  console.log('[images] nothing to convert');
  process.exit(0);
}

let before = 0;
let after = 0;

for (const source of sources) {
  const stem = rel(source).replace(/\.(jpe?g|png)$/i, '');
  const target = source.replace(/\.(jpe?g|png)$/i, '.webp');

  await sharp(source).rotate().webp({ quality: QUALITY }).toFile(target);

  if (THUMB_SOURCES.has(stem)) {
    await sharp(source)
      .rotate()
      .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
      .webp({ quality: THUMB_QUALITY })
      .toFile(source.replace(/\.(jpe?g|png)$/i, '-thumb.webp'));
  }

  const sizeIn = fs.statSync(source).size;
  const sizeOut = fs.statSync(target).size;
  before += sizeIn;
  after += sizeOut;
  fs.unlinkSync(source);
  console.log(`[images] ${rel(source).padEnd(34)} ${kb(sizeIn).padStart(8)} → ${kb(sizeOut).padStart(8)}`);
}

for (const stem of THUMB_SOURCES) {
  const thumb = path.join(publicDir, `${stem}-thumb.webp`);
  if (fs.existsSync(thumb)) console.log(`[images] ${`${stem}-thumb.webp`.padEnd(34)} ${''.padStart(8)}   ${kb(fs.statSync(thumb).size)}`);
}

console.log(
  `[images] ${sources.length} files: ${kb(before)} → ${kb(after)} (−${Math.round((1 - after / before) * 100)}%)`,
);
