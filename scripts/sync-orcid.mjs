/* One-off / cron: fetch the public ORCID works for the site owner and
 * refresh the BibTeX file that the Publications page links to.
 *
 * No secrets, no KV — ORCID public API is unauthenticated. Run locally with
 * `npm run sync:orcid` or from a GitHub Action on a schedule. The script
 * never overwrites src/data: it writes public/dagnon-publications.bib (the
 * same file the ORCID/Manual flow already maintains) so a diff is reviewable. */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ORCID = '0009-0006-5022-1399';
const outBib = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'dagnon-publications.bib');
const fetch = (input, init = {}) => globalThis.fetch(input, {
  ...init,
  signal: init.signal ?? AbortSignal.timeout(10_000),
});

async function fetchWorks() {
  const url = `https://pub.orcid.org/v3.0/${ORCID}/works`;
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`ORCID ${res.status} ${await res.text()}`);
  return res.json();
}

async function main() {
  console.log(`[sync:orcid] fetching ORCID ${ORCID} …`);
  const data = await fetchWorks();
  const groups = data.group ?? [];
  const entries = [];
  for (const g of groups) {
    const w = g['work-summary']?.[0];
    if (!w) continue;
    const title = w.title?.title?.value ?? '';
    const journal = w['journal-title']?.value ?? '';
    const year = w['publication-date']?.year?.value ?? '';
    const url = w.url?.value ?? '';
    const doi = (w['external-ids']?.['external-id'] ?? []).find((e) => e['external-id-type'] === 'doi')?.['external-id-value'] ?? '';
    if (!title) continue;
    // Build a minimal BibTeX @article
    const key = `${ORCID.replace(/-/g, '')}-${year}-${entries.length + 1}`;
    const bib = [
      `@article{${key},`,
      `  title = {${title.replace(/[{}]/g, '')}},`,
      journal ? `  journal = {${journal}},` : null,
      year ? `  year = {${year}},` : null,
      doi ? `  doi = {${doi}},` : null,
      url ? `  url = {${url}},` : null,
      `  author = {Dagnon, Seynude Jean-Fortune},`,
      `}`,
    ]
      .filter(Boolean)
      .join('\n');
    entries.push(bib);
  }

  if (entries.length === 0) {
    console.warn('[sync:orcid] no works found — leaving existing bib untouched');
    return;
  }

  const header = `% Auto-generated from https://orcid.org/${ORCID} on ${new Date().toISOString().slice(0, 10)}\n% Do not hand-edit — run \`npm run sync:orcid\` to refresh\n\n`;
  const content = header + entries.join('\n\n') + '\n';
  fs.mkdirSync(path.dirname(outBib), { recursive: true });
  fs.writeFileSync(outBib, content, 'utf-8');
  console.log(`[sync:orcid] wrote ${entries.length} entries to ${path.relative(process.cwd(), outBib)}`);

  // Also emit a tiny JSON for the barometer / any widget that wants a live count
  const meta = { orcid: ORCID, count: entries.length, updated: new Date().toISOString(), works: entries.length };
  fs.writeFileSync(path.resolve(path.dirname(outBib), 'orcid-meta.json'), JSON.stringify(meta, null, 2) + '\n', 'utf-8');
}

main().catch((e) => {
  console.error(`[sync:orcid] ${e.stack || e.message}`);
  process.exit(1);
});
