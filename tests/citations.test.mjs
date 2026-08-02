/* Citation generators (BibTeX, RIS, APA).
 * Compiled to node_modules/.tmp/citations by scripts/run-tests.mjs. */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const { citationBibtex, citationRis, citationApa } = await import(
  pathToFileURL(path.resolve('node_modules/.tmp/citations/citations.js')).href
);

const paper = {
  id: 'example-2026',
  title: 'Eliminating Malaria in Benin: A Field Report',
  authors: 'Seynude Dagnon',
  journal: 'Journal of Tropical Medicine',
  year: 2026,
  url: 'https://example.com/example-2026',
  type: 'paper',
};

test('bibtex emits a well-formed @article with the url', () => {
  const out = citationBibtex(paper);
  assert.match(out, /^@article\{example-2026,\n/);
  assert.match(out, /author = \{Seynude Dagnon\},/);
  assert.match(out, /title = \{Eliminating Malaria in Benin: A Field Report\},/);
  assert.match(out, /journal = \{Journal of Tropical Medicine\},/);
  assert.match(out, /year = \{2026\},/);
  assert.match(out, /url = \{https:\/\/example\.com\/example-2026\},/);
  assert.ok(out.endsWith('}\n'));
});

test('bibtex escapes characters that would break a .bib file', () => {
  const tricky = {
    ...paper,
    title: 'Ampersands & Braces {100%} of the Time',
    authors: 'Dagnon, S. & Pépin, K.',
    journal: 'Virus & Parasites',
  };
  const out = citationBibtex(tricky);
  assert.ok(out.includes('title = {Ampersands \\& Braces \\{100\\%\\} of the Time},'));
  assert.ok(out.includes('author = {Dagnon, S. \\& Pépin, K.},'));
});

test('bibtex drops the url field when there is none', () => {
  const { url, ...noUrl } = paper;
  const out = citationBibtex(noUrl);
  assert.ok(!out.includes('url'));
  assert.match(out, /^@article\{example-2026,\n.*\}\n$/s);
});

test('ris lists the fields in order with ER at the end', () => {
  const out = citationRis(paper);
  const lines = out.split('\n');
  assert.equal(lines[0], 'TY  - JOUR');
  assert.equal(lines[1], 'TI  - Eliminating Malaria in Benin: A Field Report');
  assert.equal(lines[2], 'AU  - Seynude Dagnon');
  assert.equal(lines[3], 'JO  - Journal of Tropical Medicine');
  assert.equal(lines[4], 'PY  - 2026');
  assert.equal(lines[5], 'UR  - https://example.com/example-2026');
  assert.equal(lines[6], 'ER  - ');
});

test('apa renders author, year, title, journal and url', () => {
  assert.equal(
    citationApa(paper),
    'Seynude Dagnon. (2026). Eliminating Malaria in Benin: A Field Report. Journal of Tropical Medicine. https://example.com/example-2026',
  );
});

test('apa omits the url when there is none', () => {
  const { url, ...noUrl } = paper;
  assert.ok(!citationApa(noUrl).includes('https://'));
});
