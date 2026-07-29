/* Asserts what the build actually put in dist/.
 *
 * Everything a link unfurler or a crawler reads is generated at build time by
 * scripts/prerender.mjs, and none of it is exercised by the app at runtime —
 * so this suite is the only thing standing between a refactor and a silently
 * broken <head>. Run via `npm test`, which builds first.
 *
 * ROUTES and LANGS are declared here on purpose rather than imported from
 * src/seo/meta.ts: this file is the checklist. Adding a route should mean
 * adding it in both places, deliberately. */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const SITE = 'https://seynudedagnon.com';
const LANGS = ['en', 'fr'];
const ROUTES = [
  '/',
  '/contact',
  '/media',
  '/media/interview',
  '/media/conference',
  '/media/speaking',
  '/media/press',
  '/media/community',
  '/publications',
];

const dist = path.resolve('dist');
const localePath = (lang, route) => (lang === 'fr' ? `/fr${route === '/' ? '' : route}` : route);
const absUrl = (lang, route) => SITE + localePath(lang, route);
const fileFor = (lang, route) => {
  const p = localePath(lang, route);
  return p === '/' ? path.join(dist, 'index.html') : path.join(dist, p, 'index.html');
};

if (!fs.existsSync(path.join(dist, 'index.html'))) {
  throw new Error('dist/ is missing — run `npm run build` (or `npm test`, which builds first).');
}

const pages = new Map();
for (const lang of LANGS) {
  for (const route of ROUTES) {
    const file = fileFor(lang, route);
    pages.set(`${lang} ${route}`, fs.existsSync(file) ? fs.readFileSync(file, 'utf-8') : null);
  }
}

const attr = (html, re) => html.match(re)?.[1];
const eachPage = (fn) => {
  for (const lang of LANGS) {
    for (const route of ROUTES) {
      const html = pages.get(`${lang} ${route}`);
      assert.ok(html, `missing page: ${lang} ${route}`);
      fn({ lang, route, html, id: `${lang} ${route}` });
    }
  }
};

test('every route is written for every language', () => {
  eachPage(({ id, html }) => assert.ok(html.length > 1000, `${id} looks empty`));
});

test('<html lang> follows the page language', () => {
  eachPage(({ id, lang, html }) => assert.equal(attr(html, /<html lang="([^"]*)"/), lang, id));
});

test('each page carries its own canonical, matching og:url', () => {
  const seen = new Set();
  eachPage(({ id, lang, route, html }) => {
    const canonical = attr(html, /<link rel="canonical" href="([^"]+)"/);
    assert.equal(canonical, absUrl(lang, route), id);
    assert.equal(attr(html, /<meta property="og:url" content="([^"]+)"/), canonical, `${id} og:url`);
    assert.ok(!seen.has(canonical), `duplicate canonical: ${canonical}`);
    seen.add(canonical);
    assert.equal((html.match(/rel="canonical"/g) || []).length, 1, `${id} has more than one canonical`);
  });
});

test('hreflang points at the real per-language URLs', () => {
  eachPage(({ id, route, html }) => {
    const alts = Object.fromEntries(
      [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => [m[1], m[2]]),
    );
    assert.equal(Object.keys(alts).length, 3, `${id} alternates: ${JSON.stringify(alts)}`);
    assert.equal(alts.en, absUrl('en', route), `${id} hreflang=en`);
    assert.equal(alts.fr, absUrl('fr', route), `${id} hreflang=fr`);
    assert.equal(alts['x-default'], absUrl('en', route), `${id} x-default`);
    assert.notEqual(alts.en, alts.fr, `${id}: the two languages share a URL, hreflang is meaningless`);
  });
});

test('titles and descriptions are unique, present and translated', () => {
  const byLang = { en: new Set(), fr: new Set() };
  eachPage(({ id, lang, html }) => {
    const title = attr(html, /<title>([^<]*)<\/title>/);
    const description = attr(html, /<meta name="description" content="([^"]+)"/);
    assert.ok(title && title.length > 10, `${id} title`);
    assert.ok(description && description.length > 50, `${id} description`);
    assert.ok(!byLang[lang].has(title), `${lang}: duplicate title "${title}"`);
    byLang[lang].add(title);
    assert.equal((html.match(/<title>/g) || []).length, 1, `${id} has more than one title`);
  });
  for (const route of ROUTES) {
    const en = attr(pages.get(`en ${route}`), /<title>([^<]*)<\/title>/);
    const fr = attr(pages.get(`fr ${route}`), /<title>([^<]*)<\/title>/);
    assert.notEqual(en, fr, `${route}: EN and FR titles are identical`);
  }
});

test('og:locale matches the page and names the other language', () => {
  eachPage(({ id, lang, html }) => {
    assert.equal(attr(html, /<meta property="og:locale" content="([^"]+)"/), lang === 'fr' ? 'fr_FR' : 'en_US', id);
    assert.equal(attr(html, /<meta property="og:locale:alternate" content="([^"]+)"/), lang === 'fr' ? 'en_US' : 'fr_FR', id);
  });
});

test('JSON-LD parses and cannot break out of its script tag', () => {
  eachPage(({ id, lang, route, html }) => {
    const blocks = [...html.matchAll(/<script id="([a-z-]+)" type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
    assert.ok(blocks.length >= 3, `${id} has only ${blocks.length} JSON-LD blocks`);
    for (const [, ldId, body] of blocks) {
      assert.ok(!body.includes('</script'), `${id} ${ldId} can close its own tag`);
      assert.doesNotThrow(() => JSON.parse(body.replace(/\\u003c/g, '<')), `${id} ${ldId} is not valid JSON`);
    }
    const breadcrumb = blocks.find(([, i]) => i === 'breadcrumb-jsonld');
    const items = JSON.parse(breadcrumb[2]).itemListElement;
    const depth = route === '/' ? 1 : route.startsWith('/media/') ? 3 : 2;
    assert.equal(items.length, depth, `${id} breadcrumb depth`);
    assert.equal(items.at(-1).item, absUrl(lang, route), `${id} breadcrumb tail`);
    assert.equal(items[0].item, absUrl(lang, '/'), `${id} breadcrumb root is not localized`);
  });
});

test('attribute values are escaped', () => {
  eachPage(({ id, html }) => {
    assert.doesNotMatch(html, /content="[^"]*&(?!amp;|quot;|lt;|gt;|#)[^"]*"/, `${id} has a raw & in an attribute`);
  });
});

test('every page still boots the app', () => {
  eachPage(({ id, html }) => {
    assert.ok(html.includes('<div id="root"></div>'), `${id} lost its mount point`);
    assert.match(html, /<script type="module"[^>]*src="\/assets\/index-[^"]+\.js"/, `${id} lost its entry script`);
    assert.match(html, /href="\/assets\/index-[^"]+\.css"/, `${id} lost its stylesheet`);
  });
});

test('no phone number is shipped to the browser', () => {
  const client = [
    ...fs.readdirSync(path.join(dist, 'assets')).filter((f) => f.endsWith('.js')).map((f) => fs.readFileSync(path.join(dist, 'assets', f), 'utf-8')),
    ...[...pages.values()],
  ].join('\n');
  /* any +229 / +221-style number, not just today's — the contact page must
     fetch it from /api/verify-phone after a code check */
  assert.doesNotMatch(client, /\+2\d{2}[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}/, 'a phone number is present in the client bundle');
});

test('the sitemap matches what was actually built', () => {
  const sitemap = fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf-8');
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  assert.equal(locs.length, ROUTES.length * LANGS.length, 'sitemap url count');
  assert.equal(new Set(locs).size, locs.length, 'duplicate <loc> in the sitemap');
  for (const lang of LANGS) {
    for (const route of ROUTES) {
      assert.ok(locs.includes(absUrl(lang, route)), `sitemap is missing ${absUrl(lang, route)}`);
    }
  }
  assert.equal((sitemap.match(/xhtml:link/g) || []).length, locs.length * 3, 'each url needs its 3 alternates');
  assert.ok(sitemap.startsWith('<?xml'), 'sitemap must start with the XML declaration');
  assert.ok(sitemap.trim().endsWith('</urlset>'), 'sitemap is truncated');
});

test('404.html is a real error page, not a copy of the home page', () => {
  const html = fs.readFileSync(path.join(dist, '404.html'), 'utf-8');
  assert.match(html, /<title>404 —/, '404.html should announce itself as a 404');
  const homeTitle = attr(pages.get('en /'), /<title>([^<]*)<\/title>/);
  assert.notEqual(attr(html, /<title>([^<]*)<\/title>/), homeTitle, '404.html must not reuse the home title');
  assert.doesNotMatch(html, /"@type":"BreadcrumbList"/, 'a 404 has no place in a breadcrumb trail');
  assert.match(html, /<meta name="robots" content="noindex/, '404.html must not be indexable');
  assert.doesNotMatch(html, /rel="canonical"/, 'an error page must not claim a canonical URL');
  assert.doesNotMatch(html, /rel="alternate"/, 'an error page has no language alternates');
  /* the app still boots so React Router can render the branded 404 view */
  assert.ok(html.includes('<div id="root"></div>'));
  assert.match(html, /<script type="module"[^>]*src="\/assets\/index-[^"]+\.js"/);
});

test('vercel.json serves every prerendered route explicitly', () => {
  const config = JSON.parse(fs.readFileSync(path.resolve('vercel.json'), 'utf-8'));
  const rewrites = new Map(config.rewrites.map((r) => [r.source, r.destination]));

  /* Explicit rather than relying on Vercel resolving directory index files,
     and explicit rather than a catch-all — a catch-all would answer 200 for
     URLs that do not exist, which is what 404.html now handles. */
  for (const lang of LANGS) {
    for (const route of ROUTES) {
      const urlPath = localePath(lang, route);
      if (urlPath === '/') continue; /* the root needs no rewrite */
      assert.equal(rewrites.get(urlPath), `${urlPath}/index.html`, `vercel.json is missing a rewrite for ${urlPath}`);
    }
  }

  assert.ok(!rewrites.has('/(.*)'), 'the catch-all rewrite would turn every 404 into a soft 200');

  /* every rewrite must point at a file the build actually produced */
  for (const [source, destination] of rewrites) {
    const target = path.join(dist, destination);
    assert.ok(fs.existsSync(target), `${source} → ${destination}, which does not exist in dist/`);
  }
});

test('every local image referenced by the app exists in dist/', () => {
  /* catches a renamed or forgotten asset — a 404 image is invisible in a
     build log and only shows up as a hole on the page */
  const sources = ['src/data/media.ts', 'src/i18n/translations.ts', 'src/pages/Media.tsx', 'src/sections/Hero.tsx']
    .map((f) => fs.readFileSync(path.resolve(f), 'utf-8'))
    .join('\n');
  const refs = [...sources.matchAll(/'(\/[\w/-]+\.(?:webp|jpe?g|png|mp4))'/g)].map((m) => m[1]);
  assert.ok(refs.length >= 20, `expected the media data to reference images, found ${refs.length}`);
  for (const ref of new Set(refs)) {
    assert.ok(fs.existsSync(path.join(dist, ref)), `${ref} is referenced but missing from dist/`);
  }
});
