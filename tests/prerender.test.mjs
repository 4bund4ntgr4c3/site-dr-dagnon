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
  '/cv',
  '/media',
  '/media/interview',
  '/media/conference',
  '/media/speaking',
  '/media/press',
  '/media/community',
  '/media/community/nuit-paludisme-1',
  '/media/community/nuit-paludisme-2',
  '/media/community/nuit-paludisme-3',
  '/media/community/nuit-paludisme-4',
  '/media/community/nuit-paludisme-5',
  '/media/community/nuit-paludisme-5e-1',
  '/media/community/nuit-paludisme-5e-2',
  '/media/community/nuit-paludisme-5e-3',
  '/media/community/nuit-paludisme-5e-4',
  '/media/community/nuit-paludisme-5e-5',
  '/media/community/nuit-paludisme-5e-6',
  '/media/community/nuit-paludisme-5e-7',
  '/media/community/nuit-paludisme-5e-8',
  '/media/community/philantropie-1',
  '/media/community/philantropie-2',
  '/media/community/philantropie-3',
  '/media/community/philantropie-4',
  '/media/community/philantropie-5',
  '/media/community/philantropie-6',
  '/media/community/philantropie-7',
  '/media/community/genies-1',
  '/media/community/genies-2',
  '/media/community/genies-3',
  '/media/community/genies-4',
  '/media/community/genies-5',
  '/media/community/genies-6',
  '/publications',
  '/tribunes',
  '/tribunes/from-malaria-control-to-elimination',
  '/projets',
  '/projets/digitalisation-milda-benin',
  '/projets/recherche-cps-smc',
  '/projets/malariya-pi-burundi',
  '/projets/arm3-systeme-information-benin',
  '/projets/irs-nord-benin',
  '/projets/reponse-epidemies-benin',
  '/projets/contrat-g2g-pnlp-benin',
  '/agenda',
  '/presse',
  '/inviter',
  '/collaborate',
  '/newsletter',
  '/impact',
  '/legal',
  '/accessibility',
  '/bibliography',
  '/publications-pdf',
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
    /* a photo page has its own rung: Home → Media → Community → Photo */
    const depth =
      route === '/' ? 1 : /^\/media\/community\/[\w-]+$/.test(route) ? 4 : route.startsWith('/media/') || route.startsWith('/tribunes/') || route.startsWith('/projets/') ? 3 : 2;
    assert.equal(items.length, depth, `${id} breadcrumb depth`);
    assert.equal(items.at(-1).item, absUrl(lang, route), `${id} breadcrumb tail`);
    assert.equal(items[0].item, absUrl(lang, '/'), `${id} breadcrumb root is not localized`);
  });
});

test('article pages carry Article JSON-LD pointing at their own OG card', () => {
  eachPage(({ id, lang, route, html }) => {
    const pageBlock = html.match(/<script id="page-jsonld"[^>]*>([\s\S]*?)<\/script>/)?.[1];
    if (!pageBlock) return;
    const parsed = JSON.parse(pageBlock);
    if (parsed['@type'] !== 'Article') return;
    /* only the article routes emit an Article — list pages use CollectionPage */
    assert.ok(
      /^\/tribunes\/[\w-]+$/.test(route) || /^\/projets\/[\w-]+$/.test(route),
      `${id}: Article JSON-LD on a non-article route`,
    );
    const slug = route.split('/').pop();
    assert.equal(parsed.headline.length > 10, true, `${id}: Article headline missing`);
    assert.ok(Array.isArray(parsed.author) || parsed.author, `${id}: Article needs an author`);
    assert.equal(parsed.image, `https://seynudedagnon.com/og/${slug}.${lang}.jpg`, `${id}: Article image is not the per-article OG card`);
    assert.equal(parsed.mainEntityOfPage['@id'], parsed.url, `${id}: Article mainEntityOfPage does not match its url`);
  });
});

test('structured data does not advertise a search box that does not exist', () => {  /* the WebSite schema used to declare a SearchAction targeting /?q=..., but
     nothing on the site reads that query param — the filters on /media and
     /publications are URL-addressable, not a site-wide search box */
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
    // Matches either "University of Conakry" or the full "Gamal Abdel Nasser University of Conakry"
    const conakry = alumniOf.find((a) => a.name.includes('Conakry'));
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
    /* compared in full, not by length — two different pages can legitimately
       come out the same length (Burundi and IRS case studies did, at 2,043
       chars of French body text) while the <Suspense> fallback bug makes two
       pages byte-identical */
    const key = `${lang} ${text}`;
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

test('the RSS feed is well-formed and lists every hosted page', () => {
  const feed = fs.readFileSync(path.join(dist, 'feed.xml'), 'utf-8');
  assert.ok(feed.startsWith('<?xml'), 'feed must start with the XML declaration');
  assert.match(feed, /<rss version="2\.0"/, 'feed must be RSS 2.0');
  assert.match(feed, /<channel>/, 'feed must have a channel');
  assert.ok(feed.trim().endsWith('</rss>'), 'feed is truncated');

  const titles = [...feed.matchAll(/<title>([^<]+)<\/title>/g)].map((m) => m[1]);
  const links = [...feed.matchAll(/<link>([^<]+)<\/link>/g)].map((m) => m[1]);
  assert.ok(titles.length >= 8, `expected a tribune and project per hosted entry, found ${titles.length}`);
  assert.equal(new Set(links).size, links.length, 'duplicate <link> in the feed');

  /* every feed link must be a real prerendered, canonical page URL */
  const tribunesSource = fs.readFileSync(path.resolve('src/data/tribunes.ts'), 'utf-8');
  const projectsSource = fs.readFileSync(path.resolve('src/data/projects.ts'), 'utf-8');
  const slugsOf = (s) => [...s.matchAll(/slug: '([a-z0-9-]+)'/g)].map((m) => m[1]);
  for (const slug of slugsOf(tribunesSource)) {
    assert.ok(links.includes(`${SITE}/tribunes/${slug}`), `feed is missing ${SITE}/tribunes/${slug}`);
  }
  for (const slug of slugsOf(projectsSource)) {
    assert.ok(links.includes(`${SITE}/projets/${slug}`), `feed is missing ${SITE}/projets/${slug}`);
  }
  assert.equal(new Set(titles.slice(1)).size, titles.slice(1).length, 'duplicate <title> in the feed');

  /* the same feeds CSP trap as the sitemap: the blanket rule would break
     Chrome's native XML rendering of the feed too */
  const config = JSON.parse(fs.readFileSync(path.resolve('vercel.json'), 'utf-8'));
  const indexOf = (source) => config.headers.findIndex((h) => h.source === source);
  const generalIdx = indexOf('/(.*)');
  const feedIdx = indexOf('/feed.xml');
  assert.ok(feedIdx > generalIdx, '/feed.xml header rule must come after /(.*) to override it');
  const feedCsp = config.headers[feedIdx].headers.find((h) => h.key === 'Content-Security-Policy');
  assert.ok(feedCsp, '/feed.xml must explicitly override Content-Security-Policy');
  assert.equal(feedCsp.value, '', 'an empty value is what neutralises the policy for this path');
});

test('every page announces the RSS feed in its head', () => {
  eachPage(({ id, html }) => {
    assert.match(
      html,
      /<link rel="alternate" type="application\/rss\+xml" title="[^"]+" href="https:\/\/seynudedagnon\.com\/feed\.xml" \/>/,
      `${id}: missing the feed <link> tag`,
    );
  });
});

test('the agenda pages carry future events as JSON-LD', () => {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  eachPage(({ id, route, html }) => {
    const block = html.match(/<script id="events-jsonld"[^>]*>([\s\S]*?)<\/script>/)?.[1];
    if (route === '/agenda') {
      /* no block is valid too: with no upcoming dates the agenda page shows
         its empty state and must not advertise events that do not exist */
      if (!block) return;
      const events = JSON.parse(block.replace(/\\u003c/g, '<'))['@graph'];
      assert.ok(Array.isArray(events) && events.length > 0, `${id}: events-jsonld with an empty @graph`);
      for (const ev of events) {
        assert.equal(ev['@type'], 'Event', `${id}: a listed event is not typed Event`);
        assert.ok(ev.startDate >= todayStr, `${id}: a past event (${ev.startDate}) is still listed as upcoming`);
        assert.match(ev['@id'], /\/agenda#/, `${id}: an event is not anchored to the agenda page`);
      }
    } else {
      assert.ok(!block, `${id}: events-jsonld leaks onto a non-agenda page`);
    }
  });
});

test('the press kit pages carry FAQPage JSON-LD matching the visible FAQ', () => {
  const faqData = fs.readFileSync(path.resolve('src/data/faq.ts'), 'utf-8');
  const questionCount = (faqData.match(/question: \{/g) ?? []).length;
  assert.ok(questionCount >= 4, 'the FAQ data must hold at least 4 entries');
  /* React escapes quotes and ampersands in the text nodes — decode before
     comparing so the schema and the rendered page are judged verbatim */
  const decode = (html) =>
    html
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'")
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');
  eachPage(({ id, route, html }) => {
    const block = html.match(/<script id="faq-jsonld"[^>]*>([\s\S]*?)<\/script>/)?.[1];
    if (route === '/presse') {
      assert.ok(block, `${id}: missing the FAQPage JSON-LD`);
      const faq = JSON.parse(block.replace(/\\u003c/g, '<'));
      assert.equal(faq['@type'], 'FAQPage', `${id}: not typed FAQPage`);
      assert.equal(faq.mainEntity.length, questionCount, `${id}: FAQPage questions differ from src/data/faq.ts`);
      const rendered = decode(html);
      for (const q of faq.mainEntity) {
        assert.equal(q['@type'], 'Question', `${id}: an entry is not a Question`);
        assert.ok(q.name, `${id}: a question without text`);
        assert.ok(q.acceptedAnswer?.text, `${id}: a question without an answer`);
        /* the visible block and the schema must not drift apart */
        assert.ok(rendered.includes(q.name), `${id}: visible page does not contain the question "${q.name}"`);
        assert.ok(
          rendered.includes(q.acceptedAnswer.text),
          `${id}: visible page does not contain the answer for "${q.name}"`,
        );
      }
    } else {
      assert.ok(!block, `${id}: FAQPage JSON-LD leaks onto a non-presse page`);
    }
  });
});

test('the styled PDFs exist, are well-formed and are precached', () => {
  const pdfs = ['/presse/press-kit-fr.pdf', '/presse/press-kit-en.pdf', '/cv/cv-fr.pdf', '/cv/cv-en.pdf', '/publications/publications-fr.pdf', '/publications/publications-en.pdf'];
  for (const p of pdfs) {
    const file = path.join(dist, ...p.split('/').filter(Boolean));
    assert.ok(fs.existsSync(file), `${p} is missing from dist/ — run scripts/gen-pdfs.mjs and commit the output`);
    const head = fs.readFileSync(file).subarray(0, 8).toString('latin1');
    assert.match(head, /^%PDF-/, `${p} does not start with the PDF magic bytes`);
  }
  const sw = fs.readFileSync(path.join(dist, 'sw.js'), 'utf-8');
  for (const p of pdfs) {
    assert.ok(sw.includes(`"${p}"`), `sw.js does not precache ${p}`);
  }
});

test('the agenda pages announce the subscribable iCal feed', () => {
  eachPage(({ id, route, html }) => {
    const link = /<link rel="alternate" type="text\/calendar" title="[^"]+" href="https:\/\/seynudedagnon\.com\/agenda\.ics" \/>/;
    if (route === '/agenda') {
      assert.match(html, link, `${id}: missing the text/calendar <link> tag`);
    } else {
      assert.doesNotMatch(html, link, `${id}: the iCal feed is announced outside the agenda pages`);
    }
  });
});

test('agenda.ics is a well-formed calendar with one event per agenda item', () => {
  const ics = fs.readFileSync(path.join(dist, 'agenda.ics'), 'utf-8');
  assert.match(ics, /^BEGIN:VCALENDAR\r\n/, 'agenda.ics must start with BEGIN:VCALENDAR');
  assert.match(ics, /END:VCALENDAR\r\n$/, 'agenda.ics must end with END:VCALENDAR');
  assert.match(ics, /VERSION:2\.0/, 'agenda.ics must declare iCal 2.0');
  const events = ics.match(/BEGIN:VEVENT/g) ?? [];
  const agendaData = fs.readFileSync(path.resolve('src/data/agenda.ts'), 'utf-8');
  const ids = [...agendaData.matchAll(/id: '([\w-]+)',/g)].map((m) => m[1]);
  assert.ok(ids.length >= 10, 'agenda data must have been read');
  assert.equal(events.length, ids.length, `agenda.ics has ${events.length} events for ${ids.length} agenda items`);
  /* every item gets a stable UID and a DATE (all-day) start */
  for (const id of ids) {
    assert.ok(ics.includes(`UID:${id}@seynudedagnon.com`), `agenda.ics lost the UID for ${id}`);
  }
  assert.ok(ics.includes('DTSTART;VALUE=DATE:'), 'agenda.ics must use all-day DATE starts');
  /* every physical line stays within the 75-octet limit (74 + trailing CR),
     including continuation lines that carry the leading fold space */
  for (const line of ics.split('\n')) {
    assert.ok(line.replace(/\r$/, '').length <= 75, 'a folded iCal line exceeds the 75-octet limit');
  }
  assert.ok(/^\s/m.test(ics), 'agenda.ics must actually contain a folded continuation line');
  /* the service worker precaches it so the calendar works offline */
  const sw = fs.readFileSync(path.join(dist, 'sw.js'), 'utf-8');
  assert.ok(sw.includes('"/agenda.ics"'), 'sw.js does not precache agenda.ics');
});

test('the service worker exists, is versioned and precaches every route', () => {
  const sw = fs.readFileSync(path.join(dist, 'sw.js'), 'utf-8');
  assert.match(sw, /self\.addEventListener\('install'/, 'sw.js must handle install');
  assert.match(sw, /self\.addEventListener\('activate'/, 'sw.js must handle activate');
  assert.match(sw, /self\.addEventListener\('fetch'/, 'sw.js must handle fetch');
  assert.match(sw, /const CACHE = 'dagnon-v'\s*\+ VERSION/, 'sw.js must use a versioned cache name');
  assert.doesNotMatch(sw, /const VERSION = ''/, 'sw.js version must not be empty');
  for (const lang of LANGS) {
    for (const route of ROUTES) {
      const urlPath = localePath(lang, route);
      assert.ok(sw.includes(`"${urlPath}"`), `sw.js does not precache ${urlPath}`);
    }
  }
  /* the precache must cover the app shell itself, not just the pages */
  const hashedAsset = [...fs.readdirSync(path.join(dist, 'assets'))].find((f) => /^index-.+\.js$/.test(f));
  assert.ok(hashedAsset, 'dist/assets must contain the hashed entry chunk');
  assert.ok(sw.includes(`/assets/${hashedAsset}`), 'sw.js does not precache the entry chunk');
});

test('vercel.json lets service worker updates propagate', () => {
  const config = JSON.parse(fs.readFileSync(path.resolve('vercel.json'), 'utf-8'));
  const generalIdx = config.headers.findIndex((h) => h.source === '/(.*)');
  const swIdx = config.headers.findIndex((h) => h.source === '/sw.js');
  assert.ok(swIdx !== -1, 'no /sw.js header rule found');
  assert.ok(swIdx > generalIdx, '/sw.js header rule must come after /(.*) to override it');
  const cache = config.headers[swIdx].headers.find((h) => h.key === 'Cache-Control');
  assert.ok(cache, '/sw.js must set Cache-Control explicitly');
  assert.match(cache.value, /max-age=0/, 'a stale service worker would never update');
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

  /* every rewrite must point at a file the build actually produced — the
     /api/ rewrites (merged functions, see the dispatch in api/newsletter.ts)
     are exempt: they target serverless functions, not prerendered files */
  for (const [source, destination] of rewrites) {
    if (destination.startsWith('/api/')) continue;
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
  const sources = ['src/data/media.ts', 'src/data/site.ts', 'src/i18n/translations.ts', 'src/pages/Media.tsx', 'src/sections/Hero.tsx']
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
  const pubSource = fs.readFileSync(path.resolve('src/data/publications.ts'), 'utf-8').replace(/\r\n/g, '\n');
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
  const mediaSource = fs.readFileSync(path.resolve('src/data/media.ts'), 'utf-8').replace(/\r\n/g, '\n');
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

test('every agenda event has a real, non-generic description in both languages', () => {
  const source = fs.readFileSync(path.resolve('src/data/agenda.ts'), 'utf-8').replace(/\r\n/g, '\n');
  const ids = [...source.matchAll(/id: '([\w-]+)'/g)].map((m) => m[1]);
  assert.ok(ids.length >= 10, `expected ~13 agenda events, found ${ids.length}`);

  const dateFieldRe = /date: '(\d{4}-\d{2}-\d{2})'/;
  const locFieldRe = /location: \{ fr: '((?:[^'\\]|\\.)*)', en: '((?:[^'\\]|\\.)*)' \}/;
  const descFieldRe = /description: \{ fr: '((?:[^'\\]|\\.)*)', en: '((?:[^'\\]|\\.)*)' \}/;
  const unescape = (s) => s.replace(/\\(.)/g, '$1');

  const blocks = source.split(/\n {2}\{\n/).slice(1);
  assert.equal(blocks.length, ids.length, 'agenda block count does not match id count');
  for (const [i, block] of blocks.entries()) {
    const id = ids[i];
    const date = block.match(dateFieldRe)?.[1];
    assert.ok(date, `${id}: no date field`);
    assert.match(date, /^\d{4}-\d{2}-\d{2}$/, `${id}: bad date — must be an ISO yyyy-mm-dd string`);
    const loc = block.match(locFieldRe);
    assert.ok(loc, `${id}: no location field`);
    assert.ok(loc[1].length >= 3 && loc[2].length >= 3, `${id}: location too short`);
    const desc = block.match(descFieldRe);
    assert.ok(desc, `${id}: no description field`);
    assert.ok(desc[1].length >= 40, `${id}: French description too short (${desc[1].length} chars)`);
    assert.ok(desc[2].length >= 40, `${id}: English description too short (${desc[2].length} chars)`);
    assert.notEqual(desc[1], desc[2], `${id}: French and English descriptions are identical`);
  }

  /* every rendered agenda card must show its description in the body */
  for (const lang of LANGS) {
    const html = pages.get(`${lang} /agenda`);
    assert.ok(html, `${lang} /agenda is missing from the build`);
    const bodyText = decodeEntities((html.match(/<div id="root">([\s\S]*)<\/div>\s*<\/body>/)?.[1] ?? '').replace(/<[^>]*>/g, ' '));
    for (const block of blocks) {
      const id = block.match(/id: '([\w-]+)'/)[1];
      const desc = block.match(descFieldRe);
      const text = unescape(lang === 'fr' ? desc[1] : desc[2]).slice(0, 40);
      assert.ok(bodyText.includes(text), `${lang} /agenda: ${id}'s description is not rendered on its card`);
    }
  }
});

test('the agenda page separates upcoming from past and can show an empty upcoming state', () => {
  for (const lang of LANGS) {
    const html = pages.get(`${lang} /agenda`);
    const bodyText = decodeEntities((html.match(/<div id="root">([\s\S]*)<\/div>\s*<\/body>/)?.[1] ?? '').replace(/<[^>]*>/g, ' '));
    const t = {
      upcoming: lang === 'fr' ? 'À venir' : 'Upcoming',
      past: lang === 'fr' ? 'Passé' : 'Past',
      emptyUpcoming: lang === 'fr' ? 'Aucun événement à venir' : 'No upcoming events',
    };
    assert.ok(bodyText.includes(t.upcoming), `${lang}: missing "upcoming" section heading`);
    assert.ok(bodyText.includes(t.past), `${lang}: missing "past" section heading`);
    /* an event dated today or later lands in upcoming; nothing in the data is
       fabricated, so the empty state may legitimately be what renders */
    assert.ok(
      bodyText.includes(t.emptyUpcoming) || bodyText.includes(lang === 'fr' ? 'Conférence' : 'Conference'),
      `${lang}: agenda should either show upcoming events or the empty state`,
    );
  }
});

test('every hosted tribune is a complete, bilingual, non-generic reprint', () => {
  const source = fs.readFileSync(path.resolve('src/data/tribunes.ts'), 'utf-8').replace(/\r\n/g, '\n');
  const bodiesSource = fs.readFileSync(path.resolve('src/data/tribune-bodies.ts'), 'utf-8').replace(/\r\n/g, '\n');
  const unescape = (s) => s.replace(/\\(.)/g, '$1');

  const slugFieldRe = /slug: '([a-z0-9-]+)'/;
  const dateFieldRe = /date: '(\d{4}-\d{2}-\d{2})'/;
  const titleFieldRe = /title:\s*\{\s*fr: '((?:[^'\\]|\\.)*)',\s*en: '((?:[^'\\]|\\.)*)'\s*,?\s*\}/;
  const descFieldRe = /description:\s*\{\s*fr: '((?:[^'\\]|\\.)*)',\s*en: '((?:[^'\\]|\\.)*)'\s*,?\s*\}/;
  const bodyBlocks = new Map();
  for (const m of bodiesSource.matchAll(/'([a-z0-9-]+)': \{([\s\S]*?)\n {2}\},/g)) {
    bodyBlocks.set(m[1], m[2]);
  }

  const blocks = source.split(/\n {2}\{\n/).slice(1);
  const entries = [];
  for (const [i, block] of blocks.entries()) {
    const slug = block.match(slugFieldRe)?.[1];
    assert.ok(slug, `tribune #${i}: no slug field`);
    const date = block.match(dateFieldRe)?.[1];
    assert.match(date, /^\d{4}-\d{2}-\d{2}$/, `${slug}: bad date — must be an ISO yyyy-mm-dd string`);
    const title = block.match(titleFieldRe);
    assert.ok(title, `${slug}: no title field`);
    assert.ok(title[1].length >= 20 && title[2].length >= 20, `${slug}: title too short`);
    const desc = block.match(descFieldRe);
    assert.ok(desc, `${slug}: no description field`);
    assert.ok(desc[1].length >= 40, `${slug}: French description too short (${desc[1].length} chars)`);
    assert.ok(desc[2].length >= 40, `${slug}: English description too short (${desc[2].length} chars)`);
    assert.notEqual(desc[1], desc[2], `${slug}: French and English descriptions are identical`);
    const body = bodyBlocks.get(slug);
    assert.ok(body, `${slug}: no body entry in tribune-bodies.ts`);
    assert.ok(body.includes('en: [') && body.includes('fr: ['), `${slug}: body must be bilingual (en + fr)`);
    const blockCount = (body.match(/kind: '(?:byline|h2|p|quote)'/g) || []).length;
    assert.ok(blockCount >= 8, `${slug}: body too short (${blockCount} blocks)`);
    entries.push({ slug, title: [title[1], title[2]], desc: [desc[1], desc[2]], block });
  }
  assert.ok(entries.length >= 1, 'expected at least one tribune');

  for (const lang of LANGS) {
    const listHtml = pages.get(`${lang} /tribunes`);
    const listText = decodeEntities((listHtml.match(/<div id="root">([\s\S]*)<\/div>\s*<\/body>/)?.[1] ?? '').replace(/<[^>]*>/g, ' '));
    for (const e of entries) {
      const text = unescape(lang === 'fr' ? e.desc[0] : e.desc[1]).slice(0, 40);
      assert.ok(listText.includes(text), `${lang} /tribunes: ${e.slug}'s description is not rendered on its card`);
    }
  }
});

test('every tribune article page renders the full body in both languages', () => {
  for (const lang of LANGS) {
    const html = pages.get(`${lang} /tribunes/from-malaria-control-to-elimination`);
    const bodyText = decodeEntities((html.match(/<div id="root">([\s\S]*)<\/div>\s*<\/body>/)?.[1] ?? '').replace(/<[^>]*>/g, ' '));
    const markers = [
      ...(lang === 'fr'
        ? ['Dans les petites villes d\'Afrique', 'à faire ce virage']
        : ['In small towns across Africa', 'ready to make that turn']),
      /* the list page and article page must actually link to each other */
      lang === 'fr' ? 'Toutes les tribunes' : 'All op-eds',
    ];
    for (const marker of markers) {
      assert.ok(bodyText.includes(marker), `${lang}: tribune body is missing "${marker}"`);
    }
    /* the reprint must attribute its source in the body */
    assert.ok(bodyText.includes('Africa Health Watch'), `${lang}: no source attribution on the article page`);
  }
});

test('every case study is a complete, bilingual, non-generic entry', () => {
  const source = fs.readFileSync(path.resolve('src/data/projects.ts'), 'utf-8').replace(/\r\n/g, '\n');
  const detailsSource = fs.readFileSync(path.resolve('src/data/project-details.ts'), 'utf-8').replace(/\r\n/g, '\n');
  const unescape = (s) => s.replace(/\\(.)/g, '$1');

  const slugFieldRe = /slug: '([a-z0-9-]+)'/;
  const dateFieldRe = /date: '(\d{4}-\d{2}-\d{2})'/;
  const pairFieldRe = (name) => new RegExp(`${name}: \\{\\s*fr: '((?:[^'\\\\]|\\\\.)*)',\\s*en: '((?:[^'\\\\]|\\\\.)*)'\\s*,?\\s*\\}`);
  const titleFieldRe = pairFieldRe('title');
  const descFieldRe = pairFieldRe('description');
  const contextFieldRe = pairFieldRe('context');
  const approachFieldRe = /approach:\s*\{\s*fr: \[([\s\S]*?)\],\s*en: \[([\s\S]*?)\]\s*,?\s*\}/;
  const resultLineRe = /value: '([^']+)', label: \{ fr: '((?:[^'\\]|\\.)*)', en: '((?:[^'\\]|\\.)*)' \}/g;
  const evidenceLineRe = /label: \{ fr: '((?:[^'\\]|\\.)*)', en: '((?:[^'\\]|\\.)*)' \}, url: '(https:\/\/[^']+)'/g;
  const detailBlocks = new Map();
  for (const m of detailsSource.matchAll(/'([a-z0-9-]+)': \{([\s\S]*?)\n {2}\},/g)) {
    detailBlocks.set(m[1], m[2]);
  }

  const blocks = source.split(/\n {2}\{\n/).slice(1);
  const entries = [];
  for (const [i, block] of blocks.entries()) {
    const slug = block.match(slugFieldRe)?.[1];
    assert.ok(slug, `project #${i}: no slug field`);
    const date = block.match(dateFieldRe)?.[1];
    assert.match(date, /^\d{4}-\d{2}-\d{2}$/, `${slug}: bad date — must be an ISO yyyy-mm-dd string`);
    const title = block.match(titleFieldRe);
    assert.ok(title, `${slug}: no title field`);
    assert.ok(title[1].length >= 15 && title[2].length >= 15, `${slug}: title too short`);
    const desc = block.match(descFieldRe);
    assert.ok(desc, `${slug}: no description field`);
    assert.ok(desc[1].length >= 40, `${slug}: French description too short (${desc[1].length} chars)`);
    assert.ok(desc[2].length >= 40, `${slug}: English description too short (${desc[2].length} chars)`);
    assert.notEqual(desc[1], desc[2], `${slug}: French and English descriptions are identical`);
    const detail = detailBlocks.get(slug);
    assert.ok(detail, `${slug}: no detail entry in project-details.ts`);
    const context = detail.match(contextFieldRe);
    assert.ok(context, `${slug}: no context field`);
    assert.ok(context[1].length >= 80 && context[2].length >= 80, `${slug}: context too short`);
    assert.notEqual(context[1], context[2], `${slug}: French and English contexts are identical`);
    const approach = detail.match(approachFieldRe);
    assert.ok(approach, `${slug}: no approach field`);
    const countBullets = (s) => (s.match(/'((?:[^'\\]|\\.)*)'/g) || []).length;
    assert.ok(countBullets(approach[1]) >= 3, `${slug}: fewer than 3 French approach steps`);
    assert.ok(countBullets(approach[2]) >= 3, `${slug}: fewer than 3 English approach steps`);
    const resultsBlock = detail.match(/results: \[([\s\S]*?)\]/)?.[1];
    assert.ok(resultsBlock, `${slug}: no results field`);
    const results = [...resultsBlock.matchAll(resultLineRe)];
    assert.ok(results.length >= 2, `${slug}: fewer than 2 results`);
    for (const r of results) {
      assert.ok(r[1].length > 0, `${slug}: an empty result value`);
      assert.notEqual(r[2], r[3], `${slug}: a result label is identical in both languages`);
    }
    const evidenceBlock = detail.match(/evidence: \[([\s\S]*?)\]/)?.[1] ?? '';
    for (const ev of [...evidenceBlock.matchAll(evidenceLineRe)]) {
      assert.ok(ev[1].length >= 5 && ev[2].length >= 5, `${slug}: an evidence label is too short`);
      assert.notEqual(ev[1], ev[2], `${slug}: an evidence label is identical in both languages`);
    }
    entries.push({ slug, title: [title[1], title[2]], desc: [desc[1], desc[2]], context: [context[1], context[2]], block });
  }
  assert.ok(entries.length >= 7, `expected 7 case studies, found ${entries.length}`);

  for (const lang of LANGS) {
    const listHtml = pages.get(`${lang} /projets`);
    const listText = decodeEntities((listHtml.match(/<div id="root">([\s\S]*)<\/div>\s*<\/body>/)?.[1] ?? '').replace(/<[^>]*>/g, ' '));
    for (const e of entries) {
      const text = unescape(lang === 'fr' ? e.desc[0] : e.desc[1]).slice(0, 40);
      assert.ok(listText.includes(text), `${lang} /projets: ${e.slug}'s description is not rendered on its card`);
    }
  }
});

test('every case study page renders its full case study in both languages', () => {
  const detailsSource = fs.readFileSync(path.resolve('src/data/project-details.ts'), 'utf-8').replace(/\r\n/g, '\n');
  const unescape = (s) => s.replace(/\\(.)/g, '$1');

  const contextFieldRe = /context:\s*\{\s*fr: '((?:[^'\\]|\\.)*)',\s*en: '((?:[^'\\]|\\.)*)'\s*,?\s*\}/;
  const approachFieldRe = /approach:\s*\{\s*fr: \[([\s\S]*?)\],\s*en: \[([\s\S]*?)\]\s*,?\s*\}/;
  const resultLineRe = /value: '([^']+)', label: \{ fr: '((?:[^'\\]|\\.)*)', en: '((?:[^'\\]|\\.)*)' \}/g;
  const evidenceLineRe = /label: \{ fr: '((?:[^'\\]|\\.)*)', en: '((?:[^'\\]|\\.)*)' \}, url: '(https:\/\/[^']+)'/g;
  const firstOf = (s) => {
    const m = s.match(/'((?:[^'\\]|\\.)*)'/);
    return m ? unescape(m[1]) : '';
  };

  const detailBlocks = new Map();
  for (const m of detailsSource.matchAll(/'([a-z0-9-]+)': \{([\s\S]*?)\n {2}\},/g)) {
    detailBlocks.set(m[1], m[2]);
  }
  for (const [slug, block] of detailBlocks) {
    const context = block.match(contextFieldRe);
    const approach = block.match(approachFieldRe);
    const results = [...(block.match(/results: \[([\s\S]*?)\]/)?.[1] ?? '').matchAll(resultLineRe)];
    const evidence = [...(block.match(/evidence: \[([\s\S]*?)\]/)?.[1] ?? '').matchAll(evidenceLineRe)];
    for (const lang of LANGS) {
      const html = pages.get(`${lang} /projets/${slug}`);
      const bodyText = decodeEntities((html.match(/<div id="root">([\s\S]*)<\/div>\s*<\/body>/)?.[1] ?? '').replace(/<[^>]*>/g, ' '));
      const idx = lang === 'fr' ? 1 : 2;
      assert.ok(bodyText.includes(unescape(context[idx]).slice(0, 60)), `${lang} /projets/${slug}: context is not rendered`);
      assert.ok(bodyText.includes(firstOf(approach[idx]).slice(0, 40)), `${lang} /projets/${slug}: first approach step is not rendered`);
      for (const r of results) {
        assert.ok(bodyText.includes(r[1]), `${lang} /projets/${slug}: result value "${r[1]}" is not rendered`);
        assert.ok(bodyText.includes(unescape(r[idx === 1 ? 2 : 3]).slice(0, 30)), `${lang} /projets/${slug}: result label is not rendered`);
      }
      for (const ev of evidence) {
        assert.ok(bodyText.includes(unescape(ev[idx === 1 ? 1 : 2]).slice(0, 30)), `${lang} /projets/${slug}: evidence label is not rendered`);
      }
      assert.ok(bodyText.includes(lang === 'fr' ? 'Tous les projets' : 'All projects'), `${lang} /projets/${slug}: missing back link`);
    }
  }
});

test('every community photo has its own page, indexed and shareable', () => {
  /* photos used to live only in a client-side lightbox — their captions were
     invisible to Google. Each one now has a prerendered page whose caption is
     an <h1>, whose <img> carries real dimensions, and whose og:image is the
     photo itself. */
  const source = fs.readFileSync(path.resolve('src/data/media.ts'), 'utf-8').replace(/\r\n/g, '\n');
  const photoBlocks = source.split(/\n {2}\{\n/).slice(1).filter((b) => b.includes("category: 'community'") && b.includes("type: 'image'"));
  assert.equal(photoBlocks.length, 26, 'expected exactly 26 community photos');

  const titleFieldRe = /title:\s*\{\s*fr: '((?:[^'\\]|\\.)*)',\s*en: '((?:[^'\\]|\\.)*)'\s*,?\s*\}/;
  const srcFieldRe = /src: '((?:\/[^']+?))'/;
  const unescape = (s) => s.replace(/\\(.)/g, '$1');

  for (const [i, block] of photoBlocks.entries()) {
    const id = block.match(/id: '([\w-]+)'/)?.[1];
    assert.ok(id, `photo #${i}: no id field`);
    const title = block.match(titleFieldRe);
    assert.ok(title, `${id}: no title field`);
    const src = block.match(srcFieldRe)?.[1];
    assert.ok(src, `${id}: no src field`);
    const route = `/media/community/${id}`;
    for (const lang of LANGS) {
      const html = pages.get(`${lang} ${route}`);
      const bodyText = decodeEntities((html.match(/<div id="root">([\s\S]*)<\/div>\s*<\/body>/)?.[1] ?? '').replace(/<[^>]*>/g, ' '));
      const caption = unescape(lang === 'fr' ? title[1] : title[2]);

      /* the caption is real text a crawler can read — in an <h1>, not a title attribute */
      assert.ok(bodyText.includes(caption.slice(0, 60)), `${lang} ${route}: caption is not rendered in the body`);
      const h1 = decodeEntities((html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? '').replace(/<[^>]*>/g, '').trim());
      assert.ok(h1.length > 0, `${lang} ${route}: no h1 on the photo page`);
      assert.ok(h1.includes(caption.slice(0, 30)), `${lang} ${route}: h1 is not the caption`);

      /* the shareable image is the photo itself, with real dimensions */
      assert.equal(attr(html, /<meta property="og:image" content="([^"]+)"/), SITE + src, `${lang} ${route} og:image`);
      assert.match(attr(html, /<meta property="og:image:width" content="([^"]+)"/), /^\d+$/, `${lang} ${route} og:image:width`);
      assert.match(attr(html, /<meta property="og:image:height" content="([^"]+)"/), /^\d+$/, `${lang} ${route} og:image:height`);
      assert.match(attr(html, /<meta property="og:image:type" content="([^"]+)"/), /^image\/webp$/, `${lang} ${route} og:image:type`);

      /* the server-rendered <img> must declare its dimensions (no CLS, no reflow) */
      assert.match(html, /<img [^>]*src="\/community\/[^"]+\.webp"[^>]*width="\d+"[^>]*height="\d+"/, `${lang} ${route}: image without width/height`);

      /* and an ImageObject must be part of the structured data */
      const jsonLd = (html.match(/<script id="([a-z-]+)" type="application\/ld\+json">([\s\S]*?)<\/script>/g) ?? []).join('\n');
      assert.ok(jsonLd.includes('ImageObject'), `${lang} ${route}: no ImageObject in JSON-LD`);
      assert.ok(jsonLd.includes(`${SITE}${src}`), `${lang} ${route}: ImageObject does not point at the photo`);

      /* the album this photo belongs to must be one click away */
      assert.match(html, new RegExp(`href="${localePath(lang, '/media/community')}"`), `${lang} ${route}: missing back link to the gallery`);
    }
  }
});
