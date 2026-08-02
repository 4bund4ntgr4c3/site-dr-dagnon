import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { splitPath } from '@/i18n/routing';
import { SITE_URL, pageMeta } from '@/seo/meta';

/* The <head> is already correct when the page loads: scripts/prerender.mjs
   writes it statically for every route. This component only keeps it in
   sync during client-side navigation and language switches. */

function upsertMeta(selector: string, value: string) {
  let el = document.head.querySelector(selector) as HTMLElement | null;
  if (!el) {
    el = document.createElement('meta');
    const isProperty = selector.includes('property=');
    const key = selector.match(isProperty ? /property="([^"]+)"/ : /name="([^"]+)"/)?.[1];
    if (key) el.setAttribute(isProperty ? 'property' : 'name', key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
}

function upsertLink(selector: string, attrs: Record<string, string>, href: string) {
  let el = document.head.querySelector(selector) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function upsertJsonLd(id: string, data: object | null) {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement('script');
    el.id = id;
    el.setAttribute('type', 'application/ld+json');
    document.head.appendChild(el);
  }
  el.textContent = data ? JSON.stringify(data) : '';
}

export function Seo() {
  const { pathname } = useLocation();

  useEffect(() => {
    const { lang, path } = splitPath(pathname);
    const meta = pageMeta(lang, path);
    const image = `${SITE_URL}/og-image.jpg`;

    document.title = meta.title;
    document.documentElement.lang = lang;

    upsertMeta('meta[name="description"]', meta.description);
    upsertMeta('meta[name="keywords"]', meta.keywords);
    upsertMeta('meta[property="og:title"]', meta.title);
    upsertMeta('meta[property="og:type"]', meta.ogType || 'website');
    upsertMeta('meta[property="og:description"]', meta.description);
    upsertMeta('meta[property="og:url"]', meta.url);
    upsertMeta('meta[property="og:locale"]', meta.ogLocale);
    upsertMeta('meta[property="og:locale:alternate"]', meta.ogLocaleAlternate);
    upsertMeta('meta[property="og:site_name"]', meta.siteName);
    upsertMeta('meta[property="og:image"]', meta.ogImage || image);
    upsertMeta('meta[property="og:image:alt"]', meta.title);
    upsertMeta('meta[property="og:image:width"]', String(meta.ogImageWidth || 1200));
    upsertMeta('meta[property="og:image:height"]', String(meta.ogImageHeight || 630));
    upsertMeta('meta[property="og:image:type"]', meta.ogImageType || 'image/jpeg');
    upsertMeta('meta[name="twitter:card"]', 'summary_large_image');
    upsertMeta('meta[name="twitter:site"]', '@SeynudeD');
    upsertMeta('meta[name="twitter:creator"]', '@SeynudeD');
    upsertMeta('meta[name="twitter:title"]', meta.title);
    upsertMeta('meta[name="twitter:description"]', meta.description);
    upsertMeta('meta[name="twitter:image"]', meta.ogImage || image);
    upsertMeta('meta[name="twitter:image:alt"]', meta.title);

    /* Reasserted on every navigation so a noindex cannot outlive the page
       that set it — and so an unknown route keeps its noindex even though
       the server already answered 404. */
    upsertMeta(
      'meta[name="robots"]',
      meta.notFound || meta.noindex
        ? 'noindex, follow'
        : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    );

    if (meta.notFound) {
      /* an error page claims no canonical URL and offers no alternates */
      document.head.querySelectorAll('link[rel="canonical"], link[rel="alternate"]').forEach((el) => el.remove());
    } else {
      upsertLink('link[rel="canonical"]', { rel: 'canonical' }, meta.url);
      for (const { hreflang, href } of meta.alternates) {
        upsertLink(`link[rel="alternate"][hreflang="${hreflang}"]`, { rel: 'alternate', hreflang }, href);
      }
    }

    upsertJsonLd('person-jsonld', meta.jsonLd.person);
    upsertJsonLd('website-jsonld', meta.jsonLd.website);
    upsertJsonLd('breadcrumb-jsonld', meta.jsonLd.breadcrumb);
    upsertJsonLd('page-jsonld', meta.jsonLd.page);
    upsertJsonLd('events-jsonld', meta.jsonLd.events);
    upsertJsonLd('faq-jsonld', meta.jsonLd.faq);
  }, [pathname]);

  return null;
}
