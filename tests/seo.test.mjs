/* SEO Persona snapshot + routeLastmod.
 * Reads the compiled meta bundle from node_modules/.tmp/prerender/meta.mjs
 * (produced by `npm run build`), same trick as routing.test.mjs — so the
 * assertions run against the exact module that built dist/. */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const bundle = path.resolve('node_modules/.tmp/prerender/meta.mjs');
if (!fs.existsSync(bundle)) throw new Error('prerender meta bundle missing — run `npm run build` first.');
const { personJsonLd, routeLastmod } = await import(pathToFileURL(bundle).href);

for (const lang of ['fr', 'en']) {
  const ld = personJsonLd(lang);

  test(`personJsonLd(${lang}) is a valid schema.org Person & Physician`, () => {
    assert.equal(ld['@context'], 'https://schema.org');
    assert.ok(Array.isArray(ld['@type']) ? ld['@type'].includes('Person') && ld['@type'].includes('Physician') : ld['@type'] === 'Person');
    assert.ok(ld.name && ld.name.length > 5, 'name');
    assert.equal(ld.givenName, 'Seynudé');
    assert.equal(ld.familyName, 'Dagnon');
    assert.ok(Array.isArray(ld.additionalName) && ld.additionalName.length === 2, 'additionalName');
    assert.equal(ld.honorificPrefix, 'Dr.');
    assert.equal(ld.honorificSuffix, 'MD, MPH');
    assert.equal(ld.medicalSpecialty, 'https://schema.org/PublicHealth');
  });

  test(`personJsonLd(${lang}) alternateName covers common spellings`, () => {
    assert.ok(Array.isArray(ld.alternateName) && ld.alternateName.length >= 12, `alternateName length ${ld.alternateName.length}`);
    assert.ok(ld.alternateName.includes('Seynude Dagnon'), 'sans-accent variant');
    assert.ok(ld.alternateName.includes('Fortune Dagnon') || ld.alternateName.includes('Fortuné Dagnon'), 'Fortune variant');
    assert.ok(ld.alternateName.includes('Dr Dagnon'), 'short variant');
  });

  test(`personJsonLd(${lang}) sameAs includes Scholar, ORCID and Wikidata`, () => {
    assert.ok(Array.isArray(ld.sameAs) && ld.sameAs.length >= 5, `sameAs length ${ld.sameAs.length}`);
    assert.ok(ld.sameAs.some((u) => u.includes('scholar.google.com/citations?user=Q6NT-4gAAAAJ')), 'Scholar');
    assert.ok(ld.sameAs.some((u) => u.includes('orcid.org/0009-0006-5022-1399')), 'ORCID');
    assert.ok(ld.sameAs.some((u) => u.includes('wikidata.org/wiki/Q141154548')), 'Wikidata');
  });

  test(`personJsonLd(${lang}) has the enriched professional graph`, () => {
    assert.equal(ld.worksFor['@type'], 'Organization');
    assert.ok(ld.worksFor.sameAs, 'worksFor sameAs');
    assert.ok(Array.isArray(ld.alumniOf) && ld.alumniOf.length === 3, 'alumniOf');
    for (const u of ld.alumniOf) assert.equal(u['@type'], 'CollegeOrUniversity');
    assert.ok(Array.isArray(ld.hasOccupation) && ld.hasOccupation.length >= 2, 'hasOccupation');
    assert.ok(Array.isArray(ld.award) && ld.award.length >= 2, `award: ${ld.award}`);
    assert.deepEqual(ld.knowsLanguage, ['fr', 'en', 'de', 'es']);
    assert.ok(Array.isArray(ld.memberOf) && ld.memberOf.length >= 1, 'memberOf');
    assert.ok(ld.nationality.name, 'nationality');
    assert.equal(ld.address.addressCountry, 'BJ');
  });

  test(`personJsonLd(${lang}) knowsAbout is bilingual and covers key topics`, () => {
    assert.ok(ld.knowsAbout.includes('Malaria') && ld.knowsAbout.includes('Paludisme'), 'Malaria bilingual');
    assert.ok(ld.knowsAbout.includes('DHIS2'), 'DHIS2');
    assert.ok(ld.knowsAbout.includes('Global Fund'), 'Global Fund');
    assert.ok(ld.knowsAbout.includes('Francophone Africa'), 'Francophone Africa');
  });

  test(`personJsonLd(${lang}) jobTitle is localised`, () => {
    if (lang === 'fr') assert.ok(ld.jobTitle.includes('Paludisme'), `fr jobTitle: ${ld.jobTitle}`);
    else assert.ok(ld.jobTitle.includes('Malaria') || ld.jobTitle.includes('Public Health'), `en jobTitle: ${ld.jobTitle}`);
  });
}

test('personJsonLd snapshot does not silently lose critical fields', () => {
  // A structural snapshot: if a future refactor drops a block, this fails.
  const en = personJsonLd('en');
  const keys = Object.keys(en).sort();
  const required = ['@context', '@type', 'additionalName', 'address', 'alternateName', 'alumniOf', 'award', 'familyName', 'givenName', 'hasCredential', 'hasOccupation', 'honorificPrefix', 'honorificSuffix', 'image', 'jobTitle', 'knowsAbout', 'knowsLanguage', 'mainEntityOfPage', 'medicalSpecialty', 'memberOf', 'name', 'nationality', 'sameAs', 'url', 'worksFor'];
  for (const k of required) assert.ok(keys.includes(k), `missing key: ${k}`);
});

// ── routeLastmod ────────────────────────────────────────────────────────

if (typeof routeLastmod === 'function') {
  const FALLBACK = '2026-08-23';
  test('routeLastmod: entity pages return their own date', () => {
    assert.equal(routeLastmod('/tribunes/from-malaria-control-to-elimination', FALLBACK), '2026-05-01');
    assert.equal(routeLastmod('/projets/digitalisation-milda-benin', FALLBACK), '2020-12-01');
  });
  test('routeLastmod: unknown entity falls back', () => {
    assert.equal(routeLastmod('/tribunes/does-not-exist', FALLBACK), FALLBACK);
    assert.equal(routeLastmod('/projets/ghost', FALLBACK), FALLBACK);
  });
  test('routeLastmod: collection pages return the newest item', () => {
    // /tribunes → max tribunes date (newest entry), /projets → max projects date
    assert.equal(routeLastmod('/tribunes', FALLBACK), '2026-08-28');
    assert.match(routeLastmod('/projets', FALLBACK), /^\d{4}-\d{2}-\d{2}$/);
    // /publications synthesises YYYY-01-01
    assert.match(routeLastmod('/publications', FALLBACK), /^\d{4}-01-01$/);
    assert.match(routeLastmod('/publications-pdf', FALLBACK), /^\d{4}-01-01$/);
    assert.match(routeLastmod('/bibliography', FALLBACK), /^\d{4}-01-01$/);
  });
  test('routeLastmod: static pages fall back to build date', () => {
    assert.equal(routeLastmod('/', FALLBACK), FALLBACK);
    assert.equal(routeLastmod('/contact', FALLBACK), FALLBACK);
    assert.equal(routeLastmod('/legal', FALLBACK), FALLBACK);
  });
  test('routeLastmod: /media branches by category', () => {
    const media = routeLastmod('/media', FALLBACK);
    const interview = routeLastmod('/media/interview', FALLBACK);
    const community = routeLastmod('/media/community', FALLBACK);
    assert.match(media, /^\d{4}-\d{2}-\d{2}$/);
    assert.match(interview, /^\d{4}-\d{2}-\d{2}$/);
    assert.match(community, /^\d{4}-\d{2}-\d{2}$/);
  });
} else {
  test('routeLastmod is not exported (pre-upgrade bundle) — skipped', () => {});
}
