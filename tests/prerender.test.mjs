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

/* Google truncates a SERP snippet past roughly 60 chars of title or 155-160
   of description — not at a sentence boundary, wherever the pixel budget runs
   out. These budgets are on the decoded text (what a reader actually sees),
   not the HTML-escaped attribute value, since "&amp;" reads as one character
   wide, not five. */
const decodeEntities = (s) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

test('titles and descriptions stay inside the SERP snippet budget', () => {
  eachPage(({ id, html }) => {
    const title = decodeEntities(attr(html, /<title>([^<]*)<\/title>/) ?? '');
    const description = decodeEntities(attr(html, /<meta name="description" content="([^"]+)"/) ?? '');
    assert.ok(title.length <= 60, `${id}: title is ${title.length} chars, over the ~60 budget — "${title}"`);
    assert.ok(description.length <= 160, `${id}: description is ${description.length} chars, over the ~160 budget — "${description}"`);
  });
});

test('the H1 differs by page, not just by language', () => {
  /* every page used to render the exact same <h1><NameHighlight /></h1> —
     verified live in production across five routes before this was fixed.
     The name may still anchor every H1, but the page's own topic has to be
     in there too, or Google has nothing to tell the pages apart by. */
  eachPage(({ id, html }) => {
    const h1 = decodeEntities((html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? '').replace(/<[^>]*>/g, '').trim());
    assert.ok(h1.length > 0, `${id}: no H1 text`);
  });
  for (const lang of LANGS) {
    const h1sByRoute = new Map();
    eachPage(({ route, lang: l, html }) => {
      if (l !== lang) return;
      const h1 = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? '').replace(/<[^>]*>/g, '').trim();
      h1sByRoute.set(route, h1);
    });
    /* home is allowed to be just the name — every other route must not match it */
    const homeH1 = h1sByRoute.get('/');
    for (const [route, h1] of h1sByRoute) {
      if (route === '/') continue;
      assert.notEqual(h1, homeH1, `${lang} ${route}: H1 is identical to the homepage's — "${h1}"`);
    }
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

test('structured data does not advertise a search box that does not exist', () => {
  /* the WebSite schema used to declare a SearchAction targeting /?q=..., but
     nothing on the site reads that query param — the filters on /media and
     /publications are client-side React state, not URL-addressable */
  eachPage(({ id, html }) => {
    const websiteBlock = html.match(/<script id="website-jsonld"[^>]*>([\s\S]*?)<\/script>/)?.[1];
    assert.ok(websiteBlock, `${id}: no website-jsonld block`);
    assert.ok(!JSON.parse(websiteBlock).potentialAction, `${id}: website-jsonld still declares a SearchAction`);
  });
});

test('the Person schema carries no unreachable university URL', () => {
  eachPage(({ id, html }) => {
    const personBlock = html.match(/<script id="person-jsonld"[^>]*>([\s\S]*?)<\/script>/)?.[1];
    const alumniOf = JSON.parse(personBlock).alumniOf ?? [];
    const conakry = alumniOf.find((a) => a.name === 'University of Conakry');
    assert.ok(conakry, `${id}: University of Conakry entry missing`);
    assert.ok(!conakry.url, `${id}: still links to the dead univconakry.edu.gn — remove until a working URL is known`);
  });
});

test('attribute values are escaped', () => {
  eachPage(({ id, html }) => {
    assert.doesNotMatch(html, /content="[^"]*&(?!amp;|quot;|lt;|gt;|#)[^"]*"/, `${id} has a raw & in an attribute`);
  });
});

test('every page still boots the app', () => {
  eachPage(({ id, html }) => {
    assert.match(html, /<div id="root">/, `${id} lost its mount point`);
    assert.match(html, /<script type="module"[^>]*src="\/assets\/index-[^"]+\.js"/, `${id} lost its entry script`);
    assert.match(html, /href="\/assets\/index-[^"]+\.css"/, `${id} lost its stylesheet`);
  });
});

/* src/entry-server.tsx server-renders <App> into <div id="root">, which used
   to be shipped empty — Search Console reported every non-home route as
   "Discovered — currently not indexed" because Googlebot's first fetch saw no
   text and no links to follow. These assertions are the regression test for
   that: real visible text, real internal links, and — the specific bug this
   caught once already — genuinely different content per route rather than
   every page rendering the same <Suspense> fallback. */
test('the server-rendered body has substantial, page-specific text', () => {
  /* Vite hoists the entry <script type="module"> into <head> for production
     builds, so the root div's real closing tag is the one right before
     </body> — not one followed by a <script>, which is what an earlier
     version of this assertion assumed. */
  const bodyOf = (html) => html.match(/<div id="root">([\s\S]*)<\/div>\s*<\/body>/)?.[1] ?? '';
  const textOf = (html) => bodyOf(html).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

  eachPage(({ id, html }) => {
    const text = textOf(html);
    assert.ok(text.length > 150, `${id}: only ${text.length} chars of server-rendered text`);
  });

  const seen = new Map();
  eachPage(({ id, lang, route, html }) => {
    const text = textOf(html);
    const key = `${lang} ${text.length}`;
    const dupe = seen.get(key);
    assert.ok(!dupe || dupe.route === route, `${id} rendered identically to ${dupe?.id} — likely the <Suspense> fallback again`);
    seen.set(key, { id, route });
  });
});

test('the server-rendered body contains real internal links', () => {
  const bodyOf = (html) => html.match(/<div id="root">([\s\S]*)<\/div>\s*<\/body>/)?.[1] ?? '';
  eachPage(({ id, lang, html }) => {
    const hrefs = [...bodyOf(html).matchAll(/<a [^>]*href="([^"]+)"/g)].map((m) => m[1]);
    const internal = hrefs.filter((h) => h.startsWith('/') || h.startsWith(absUrl(lang, '/')));
    assert.ok(internal.length >= 3, `${id}: only ${internal.length} internal links in the server-rendered body`);
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
  /* the app still boots so React Router can render the branded 404 view,
     server-rendered like every other page rather than left empty */
  assert.match(html, /<div id="root">/);
  assert.match(html, /404/, '404.html body should say 404 somewhere');
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

test('sitemap.xml is exempt from the CSP applied to every other path', () => {
  /* The blanket `/(.*)` rule's Content-Security-Policy breaks Chrome's native
     XML pretty-printer: blocked from the internal resource it needs, Chrome
     falls back to parsing the response as HTML, discarding the unrecognised
     <urlset>/<url>/<loc> tags but keeping their text — and since the
     generated sitemap has no whitespace between sibling tags, that renders as
     one unreadable wall of concatenated dates and priorities. Googlebot is
     unaffected (it parses the XML directly), but a human sanity-checking the
     sitemap in a browser sees garbage. This asserts the override is still
     there and still wins: Vercel applies later array entries' header values
     over earlier ones for the same key, so this rule must both exist and
     come after the general `/(.*)` rule. */
  const config = JSON.parse(fs.readFileSync(path.resolve('vercel.json'), 'utf-8'));
  const indexOf = (source) => config.headers.findIndex((h) => h.source === source);

  const generalIdx = indexOf('/(.*)');
  const sitemapIdx = indexOf('/sitemap.xml');
  assert.ok(generalIdx !== -1, 'no general CSP rule found — has vercel.json been restructured?');
  assert.ok(sitemapIdx !== -1, 'no /sitemap.xml header rule found');
  assert.ok(sitemapIdx > generalIdx, '/sitemap.xml header rule must come after /(.*) to override it');

  const sitemapCsp = config.headers[sitemapIdx].headers.find((h) => h.key === 'Content-Security-Policy');
  assert.ok(sitemapCsp, '/sitemap.xml must explicitly override Content-Security-Policy');
  assert.equal(sitemapCsp.value, '', 'an empty value is what neutralises the policy for this path');
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

test('every publication and press article has a real, non-generic description', () => {
  /* PubEntry.description and MediaEntry.description used to not exist at all —
     cards showed only a title, authors/journal, and a date. Google Search
     Console flagging thin content on these pages is what prompted adding
     them; this guards against a future edit silently dropping one. */
  const pubSource = fs.readFileSync(path.resolve('src/data/publications.ts'), 'utf-8');
  const pubIds = [...pubSource.matchAll(/id: '([\w-]+)'/g)].map((m) => m[1]);
  assert.ok(pubIds.length >= 15, `expected ~17 publications, found ${pubIds.length}`);

  const descFieldRe = new RegExp(
    "description: \\{ fr: '((?:[^'\\\\]|\\\\.)*)', en: '((?:[^'\\\\]|\\\\.)*)' \\}",
  );
  const unescape = (s) => s.replace(/\\(.)/g, '$1');

  const pubBlocks = pubSource.split(/\n {2}\{\n/).slice(1);
  assert.equal(pubBlocks.length, pubIds.length, 'publication block count does not match id count');
  for (const [i, block] of pubBlocks.entries()) {
    const id = pubIds[i];
    const desc = block.match(descFieldRe);
    assert.ok(desc, `${id}: no description field`);
    assert.ok(desc[1].length >= 40, `${id}: French description too short (${desc[1].length} chars)`);
    assert.ok(desc[2].length >= 40, `${id}: English description too short (${desc[2].length} chars)`);
    assert.notEqual(desc[1], desc[2], `${id}: French and English descriptions are identical`);
  }

  /* every rendered publication card must show its description, not just its title */
  for (const lang of LANGS) {
    const html = pages.get(`${lang} /publications`);
    const bodyText = decodeEntities((html.match(/<div id="root">([\s\S]*)<\/div>\s*<\/body>/)?.[1] ?? '').replace(/<[^>]*>/g, ' '));
    for (const block of pubBlocks) {
      const id = block.match(/id: '([\w-]+)'/)[1];
      const descMatch = block.match(descFieldRe);
      const raw = lang === 'fr' ? descMatch[1] : descMatch[2];
      const text = unescape(raw).slice(0, 40);
      assert.ok(bodyText.includes(text), `${lang} /publications: ${id}'s description is not rendered on its card`);
    }
  }

  /* press documents: at least the ones known to carry a description must render it.
     Split into per-entry blocks first, same as the publications check above —
     a single regex spanning the whole file risks a lazy match skipping past an
     id-less entry (e.g. the one press video with no description) and pairing
     its id with a later, unrelated entry's description. */
  const mediaSource = fs.readFileSync(path.resolve('src/data/media.ts'), 'utf-8');
  const mediaBlocks = mediaSource.split(/\n {2}\{\n/).slice(1);
  const pressWithDesc = mediaBlocks
    .map((block) => ({ id: block.match(/id: '([\w-]+)'/)?.[1], desc: block.match(descFieldRe) }))
    .filter((e) => e.id && e.desc)
    .map((e) => [null, e.id, e.desc[1], e.desc[2]]);
  assert.ok(pressWithDesc.length >= 9, `expected 9 press descriptions, found ${pressWithDesc.length}`);
  for (const lang of LANGS) {
    const html = pages.get(`${lang} /media/press`);
    const bodyText = decodeEntities((html.match(/<div id="root">([\s\S]*)<\/div>\s*<\/body>/)?.[1] ?? '').replace(/<[^>]*>/g, ' '));
    for (const [, id, fr, en] of pressWithDesc) {
      const raw = lang === 'fr' ? fr : en;
      const text = unescape(raw).slice(0, 40);
      assert.ok(bodyText.includes(text), `${lang} /media/press: ${id}'s description is not rendered on its card`);
    }
  }
});
