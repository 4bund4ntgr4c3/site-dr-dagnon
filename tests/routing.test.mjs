/* Language routing: URL ↔ language mapping, and the first-visit redirect.
 * Compiled to node_modules/.tmp/i18n by scripts/run-tests.mjs. */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const { splitPath, localePath, shouldRedirectToFrench, DEFAULT_LANG } = await import(
  pathToFileURL(path.resolve('node_modules/.tmp/i18n/routing.js')).href
);
/* src/seo/meta.ts uses the `@` alias, which plain tsc cannot resolve — so
   reuse the ESM bundle scripts/prerender.mjs already builds during the build
   step. That also means these assertions run against the exact module that
   generated dist/, not a re-compiled lookalike. */
const metaBundle = path.resolve('node_modules/.tmp/prerender/meta.mjs');
if (!fs.existsSync(metaBundle)) {
  throw new Error('prerender metadata bundle missing — run `npm test`, which builds first.');
}
const { pageMeta } = await import(pathToFileURL(metaBundle).href);

test('splitPath reads the language off the URL', () => {
  assert.deepEqual(splitPath('/'), { lang: 'en', path: '/' });
  assert.deepEqual(splitPath('/contact'), { lang: 'en', path: '/contact' });
  assert.deepEqual(splitPath('/media/press'), { lang: 'en', path: '/media/press' });
  assert.deepEqual(splitPath('/fr'), { lang: 'fr', path: '/' });
  assert.deepEqual(splitPath('/fr/contact'), { lang: 'fr', path: '/contact' });
  assert.deepEqual(splitPath('/fr/media/press'), { lang: 'fr', path: '/media/press' });
});

test('splitPath does not mistake a lookalike path for French', () => {
  /* /french-guiana must stay English, not become path "ench-guiana" */
  assert.deepEqual(splitPath('/french-guiana'), { lang: 'en', path: '/french-guiana' });
  assert.deepEqual(splitPath('/frontiers'), { lang: 'en', path: '/frontiers' });
});

test('localePath builds the URL for a language', () => {
  assert.equal(localePath('en', '/'), '/');
  assert.equal(localePath('en', '/contact'), '/contact');
  assert.equal(localePath('fr', '/'), '/fr');
  assert.equal(localePath('fr', '/contact'), '/fr/contact');
  assert.equal(localePath('fr', '/media/press'), '/fr/media/press');
});

test('localePath and splitPath are inverses', () => {
  for (const lang of ['en', 'fr']) {
    for (const route of ['/', '/contact', '/media', '/media/press', '/publications']) {
      const url = localePath(lang, route);
      assert.deepEqual(splitPath(url), { lang, path: route }, `${lang} ${route} → ${url}`);
    }
  }
});

/* ── first-visit redirect ──────────────────────────────────────────────
   Every case below exists to stop the redirect fighting the visitor. */

test('a French-speaking first-time visitor is sent to /fr', () => {
  assert.equal(shouldRedirectToFrench('en', null, ['fr-FR', 'fr']), true);
  assert.equal(shouldRedirectToFrench('en', null, ['fr']), true);
  assert.equal(shouldRedirectToFrench('en', null, ['FR-ca']), true);
});

test('an English-speaking visitor is left alone', () => {
  assert.equal(shouldRedirectToFrench('en', null, ['en-US', 'fr']), false);
  assert.equal(shouldRedirectToFrench('en', null, ['de']), false);
  assert.equal(shouldRedirectToFrench('en', null, []), false);
});

test('an explicit choice always wins over the browser language', () => {
  assert.equal(shouldRedirectToFrench('en', 'en', ['fr-FR']), false, 'chose English, must stay English');
  assert.equal(shouldRedirectToFrench('en', 'fr', ['fr-FR']), false, 'already decided, no redirect needed');
});

test('a /fr URL is never redirected — this is the loop guard', () => {
  assert.equal(shouldRedirectToFrench('fr', null, ['fr-FR']), false);
  assert.equal(shouldRedirectToFrench('fr', 'en', ['fr-FR']), false);
});

test('the check runs at most once per page load', () => {
  assert.equal(shouldRedirectToFrench('en', null, ['fr-FR'], true), false);
});

test('switching to English from /fr cannot bounce back', () => {
  /* the exact sequence: visitor lands on /, gets redirected to /fr, clicks EN.
     The click stores 'en' and navigates to '/', where the check runs again. */
  assert.equal(shouldRedirectToFrench(DEFAULT_LANG, null, ['fr-FR']), true, 'first landing redirects');
  assert.equal(shouldRedirectToFrench('fr', null, ['fr-FR']), false, 'no redirect while on /fr');
  assert.equal(shouldRedirectToFrench('en', 'en', ['fr-FR']), false, 'back on / with a stored choice: stays');
});


/* ── metadata for unknown routes ───────────────────────────────────────
   <Seo /> reasserts robots on every navigation so a noindex cannot outlive
   its page. That is only safe if an unknown route reports itself as one —
   otherwise a client-side visit to a 404 would flip it back to indexable. */

test('a known route is indexable and canonical', () => {
  for (const route of ['/', '/contact', '/media', '/media/press', '/publications']) {
    for (const lang of ['en', 'fr']) {
      const meta = pageMeta(lang, route);
      assert.equal(meta.notFound, false, `${lang} ${route} should be a known route`);
      assert.ok(meta.url.startsWith('https://seynudedagnon.com'), `${lang} ${route} url`);
    }
  }
});

test('an unknown route reports itself as not found', () => {
  for (const route of ['/nope', '/media/bogus', '/publications/42', '/contact/extra']) {
    const meta = pageMeta('en', route);
    assert.equal(meta.notFound, true, `${route} should be flagged`);
    assert.match(meta.title, /^404 — /, `${route} title: ${meta.title}`);
    assert.equal(meta.jsonLd.page, null, `${route} must not describe itself as a real page`);
  }
});

test('the 404 title is translated', () => {
  assert.match(pageMeta('fr', '/nope').title, /Page introuvable/);
  assert.match(pageMeta('en', '/nope').title, /Page not found/);
});

test('a trailing slash does not make a known route look unknown', () => {
  assert.equal(pageMeta('en', '/contact/').notFound, false);
  assert.equal(pageMeta('fr', '/media/press/').notFound, false);
});
