/* Single source of truth for page metadata.
   Consumed twice: by <Seo /> at runtime (client-side navigation) and by
   scripts/prerender.mjs at build time (static <head> per route). Keep it
   free of React and of any DOM access so the build script can import it. */

import { UI } from '@/i18n/translations';
import { DEFAULT_LANG, localePath } from '@/i18n/routing';
import { SUPPORTED, type Lang } from '@/i18n/lang';

export const SITE_URL = 'https://seynudedagnon.com';

/** Absolute URL of a logical path in a given language. The English root is
    the one URL that keeps its trailing slash, so canonical and sitemap agree. */
export const absUrl = (lang: Lang, path: string) => SITE_URL + localePath(lang, path);
const homeUrl = (lang: Lang) => absUrl(lang, '/');

/* ── Page-level SEO data ──────────────────────────────────────── */

/* Titles kept to ~60 chars and descriptions to ~150 — past that, Google
   truncates the SERP snippet mid-word rather than at a sentence boundary. */
export const SEO: Record<Lang, { title: string; description: string; keywords: string; ogLocale: string }> = {
  fr: {
    title: 'Dr. Seynudé Dagnon — Santé publique & Paludisme en Afrique',
    description:
      "Dr. Seynudé Jean-Fortuné Dagnon, MD, MPH — Leader en santé publique et paludisme à la Fondation Gates. 17+ ans au Bénin et en Afrique francophone.",
    keywords: 'Seynudé Dagnon, paludisme, santé publique, Fondation Gates, USAID, PMI, Bénin, Afrique francophone, économie de la santé, leader paludisme, malaria program leader, Cotonou, doctorat Groningen, MPH Antwerp',
    ogLocale: 'fr_FR',
  },
  en: {
    title: 'Seynudé Dagnon, MD, MPH — Public Health & Malaria Leader',
    description:
      'Dr. Seynudé Jean-Fortuné Dagnon, MD, MPH — Public Health & Malaria Leader at the Gates Foundation. 17+ years across Benin and Francophone Africa.',
    keywords: 'Seynudé Dagnon, malaria, public health, Gates Foundation, USAID, PMI, Benin, Francophone Africa, health economics, malaria program leader, Cotonou, PhD Groningen, MPH Antwerp, vector control, SMC',
    ogLocale: 'en_US',
  },
};

export const CONTACT_SEO: Record<Lang, { title: string; description: string; keywords: string }> = {
  fr: {
    title: 'Contact — Dr. Seynudé Jean-Fortuné DAGNON',
    description: 'Contactez le Dr. Seynudé Jean-Fortuné Dagnon pour un partenariat, une conférence ou un conseil technique sur le paludisme et la santé publique.',
    keywords: 'contact Dr Dagnon, email santé publique, partenariat paludisme, conférence Afrique, conseil technique Bénin, Cotonou, Dakar, Sénégal',
  },
  en: {
    title: 'Contact — Seynudé Jean-Fortuné DAGNON, MD, MPH',
    description: 'Contact Dr. Seynudé Jean-Fortuné Dagnon for partnerships, conferences or technical advice on malaria and public health in Francophone Africa.',
    keywords: 'contact Dr Dagnon, public health email, malaria partnership, Africa conference, technical advice Benin, Cotonou, Dakar, Senegal',
  },
};

export const MEDIA_SEO: Record<Lang, { title: string; description: string; keywords: string }> = {
  fr: {
    title: 'Médias — Interviews, Conférences & Engagements du Dr. Dagnon',
    description: 'Interviews, conférences, discours, presse et engagement communautaire du Dr. Seynudé Jean-Fortuné Dagnon sur le paludisme et la santé publique en Afrique.',
    keywords: 'interviews Dr Dagnon, conférences paludisme, discours santé publique, presse Bénin, engagements communautaires, Nuit du Paludisme, media malaria Africa',
  },
  en: {
    title: 'Media — Interviews, Conferences & Engagements of Dr. Dagnon',
    description: 'Interviews, conferences, speeches, press coverage and community engagement by Dr. Seynudé Jean-Fortuné Dagnon on malaria and public health in Africa.',
    keywords: 'Dr Dagnon interviews, malaria conferences, public health speeches, press Benin, community engagement, Night Against Malaria, media malaria Africa',
  },
};

/** Short brand suffix for titles that need to stay under ~60 chars —
    "Seynudé Jean-Fortuné DAGNON, MD, MPH" alone eats most of that budget. */
const shortName = (lang: Lang) => (lang === 'fr' ? 'Dr. Dagnon' : 'Seynudé Dagnon');

export const CAT_NAMES: Record<string, { fr: string; en: string }> = {
  interview: { fr: 'Interviews', en: 'Interviews' },
  conference: { fr: 'Présentations & Conférences', en: 'Presentations & Conferences' },
  speaking: { fr: 'Discours publics', en: 'Public Speaking' },
  press: { fr: 'Presse', en: 'Press' },
  community: { fr: 'Engagement communautaire et philanthropique', en: 'Community and Philanthropic Engagement' },
};

export const CAT_DESCRIPTIONS: Record<string, { fr: string; en: string; keywords: string }> = {
  interview: {
    fr: "Interviews du Dr. Seynudé Jean-Fortuné Dagnon sur la lutte contre le paludisme et les systèmes de santé en Afrique francophone.",
    en: "Interviews with Dr. Seynudé Jean-Fortuné Dagnon on malaria control, African health systems and malaria elimination in Francophone Africa.",
    keywords: 'interview Dr Dagnon, paludisme Afrique, santé publique interview, malaria expert interview, Gates Foundation',
  },
  conference: {
    fr: "Conférences et présentations du Dr. Seynudé Jean-Fortuné Dagnon lors d'événements internationaux sur le paludisme et les politiques de santé.",
    en: "Conferences and presentations by Dr. Seynudé Jean-Fortuné Dagnon at international events on malaria, operational research and health policy.",
    keywords: 'conférence Dr Dagnon, présentation paludisme, malaria conference, health policy Africa, operational research malaria',
  },
  speaking: {
    fr: "Discours du Dr. Seynudé Jean-Fortuné Dagnon lors de réunions de partenaires, lancements de campagnes antipaludiques et cérémonies officielles en Afrique.",
    en: "Speeches by Dr. Seynudé Jean-Fortuné Dagnon at partner meetings, anti-malaria campaign launches and official ceremonies in Africa.",
    keywords: 'discours Dr Dagnon, campagne paludisme, campaign launch malaria, partner meeting Africa, official ceremony Benin',
  },
  press: {
    fr: "Articles de presse, tribunes et couvertures médiatiques mettant en avant le travail du Dr. Dagnon sur le paludisme et la santé publique en Afrique francophone.",
    en: "Press articles, op-eds and media coverage highlighting Dr. Dagnon's work on malaria and public health in Francophone Africa.",
    keywords: 'presse Dr Dagnon, article paludisme, malaria press, media coverage Africa, op-ed health Benin, SMC Alliance, AIRID',
  },
  community: {
    fr: "Engagement communautaire et philanthropique du Dr. Dagnon : Nuit du Paludisme, fournitures scolaires, Génies en Herbe — actions de terrain au Bénin.",
    en: "Community and philanthropic engagement by Dr. Dagnon: Night Against Malaria, school kits, Génies en Herbe — field activities in Benin.",
    keywords: 'engagement communautaire, Nuit du Paludisme, fournitures scolaires, Génies en Herbe, community malaria Benin, philanthropy Africa',
  },
};

export const PUB_SEO: Record<Lang, { title: string; description: string; keywords: string }> = {
  fr: {
    title: 'Publications scientifiques — Dr. Seynudé Jean-Fortuné DAGNON',
    description: "Publications scientifiques du Dr. Seynudé Jean-Fortuné Dagnon dans Malaria Journal, Parasites & Vectors et autres revues. Entomologie, lutte antipaludique.",
    keywords: 'publications Dr Dagnon, Malaria Journal, Parasites Vectors, Frontiers Tropical Diseases, recherche paludisme, entomologie, IRS, SMC, vector control Africa',
  },
  en: {
    title: 'Scientific Publications — Seynudé Jean-Fortuné DAGNON',
    description: 'Scientific publications by Seynudé Jean-Fortuné Dagnon in Malaria Journal, Parasites & Vectors. Malaria control and elimination in Francophone Africa.',
    keywords: 'Dr Dagnon publications, Malaria Journal, Parasites Vectors, Frontiers Tropical Diseases, malaria research, entomology, IRS, SMC, vector control Africa',
  },
};

const fullName = (lang: Lang) => (lang === 'fr' ? 'Dr. Seynudé Jean-Fortuné DAGNON' : 'Seynudé Jean-Fortuné DAGNON, MD, MPH');

/* ── JSON-LD builders ─────────────────────────────────────────── */

export function personJsonLd(lang: Lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: fullName(lang),
    alternateName: 'Seynudé Dagnon',
    jobTitle: lang === 'fr' ? 'Leader de programme en santé publique et paludisme' : 'Public Health & Malaria Program Leader',
    description: SEO[lang].description,
    url: homeUrl(lang),
    image: `${SITE_URL}/og-image.jpg`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': homeUrl(lang) },
    sameAs: [
      'https://www.linkedin.com/in/seynud%C3%A9-jean-fortune-dagnon-md-mph-p-h-d-in-progress-093a5a2a/',
      'https://www.youtube.com/@seynudedagnon6233',
      'https://www.facebook.com/jeanfortune.dagnon/',
      'https://x.com/SeynudeD',
      'https://www.tiktok.com/@fortunedagnon',
    ],
    alumniOf: [
      /* no `url` — univconakry.edu.gn no longer resolves (verified); update
         if the university's site reappears under a new domain */
      { '@type': 'CollegeOrUniversity', name: 'University of Conakry' },
      { '@type': 'CollegeOrUniversity', name: 'Institute of Tropical Medicine, Antwerp', url: 'https://www.itg.be/' },
      { '@type': 'CollegeOrUniversity', name: 'University of Groningen', url: 'https://www.rug.nl/' },
    ],
    worksFor: {
      '@type': 'Organization',
      name: lang === 'fr' ? 'Fondation Gates' : 'Gates Foundation',
      url: 'https://www.gatesfoundation.org/',
    },
    knowsAbout: ['Malaria', 'Public Health', 'Health Systems', 'Digital Health', 'Epidemiology', 'SMC', 'PMI', 'USAID'],
    hasCredential: [
      { '@type': 'EducationalOccupationalCredential', credentialCategory: 'degree', name: 'MD — Doctor of Medicine' },
      { '@type': 'EducationalOccupationalCredential', credentialCategory: 'degree', name: 'MPH — Master of Public Health' },
      { '@type': 'EducationalOccupationalCredential', credentialCategory: 'degree', name: 'PhD — Doctor of Philosophy (in progress)' },
    ],
    nationality: { '@type': 'Country', name: lang === 'fr' ? 'Bénin' : 'Benin' },
    address: { '@type': 'PostalAddress', addressLocality: 'Cotonou', addressCountry: 'BJ' },
  };
}

export function webSiteJsonLd(lang: Lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SEO[lang].title,
    url: homeUrl(lang),
    description: SEO[lang].description,
    author: { '@type': 'Person', name: fullName(lang) },
    inLanguage: [lang],
    /* No SearchAction here: the site has no query-param-driven search route
       for Google to link to. The filters on /media and /publications are
       client-side React state, not URL-addressable, so a Sitelinks Search Box
       schema would point at a search that doesn't exist. */
  };
}

export function contactPageJsonLd(lang: Lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: CONTACT_SEO[lang].title,
    description: CONTACT_SEO[lang].description,
    url: `${SITE_URL}/contact`,
    mainEntity: {
      '@type': 'Person',
      name: fullName(lang),
      jobTitle: lang === 'fr' ? 'Leader de programme en santé publique et paludisme' : 'Public Health & Malaria Program Leader',
      email: 'contact@seynudedagnon.com',
      address: { '@type': 'PostalAddress', addressLocality: 'Cotonou', addressCountry: 'BJ' },
    },
  };
}

export function collectionPageJsonLd(lang: Lang, pageTitle: string, pageDesc: string, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: pageTitle,
    description: pageDesc,
    url,
    author: { '@type': 'Person', name: fullName(lang) },
    inLanguage: [lang],
  };
}

export function breadcrumbJsonLd(lang: Lang, path: string) {
  const items: { name: string; url: string }[] = [
    { name: lang === 'fr' ? 'Dr. Seynudé Jean-Fortuné DAGNON' : 'Seynudé Dagnon', url: homeUrl(lang) },
  ];
  if (path.startsWith('/contact')) {
    items.push({ name: 'Contact', url: absUrl(lang, '/contact') });
  } else if (path.startsWith('/media')) {
    items.push({ name: lang === 'fr' ? 'Médias' : 'Media', url: absUrl(lang, '/media') });
    const cat = path.split('/media/')[1]?.split('/')[0];
    if (cat && CAT_NAMES[cat]) items.push({ name: CAT_NAMES[cat][lang], url: absUrl(lang, `/media/${cat}`) });
  } else if (path.startsWith('/publications')) {
    items.push({ name: 'Publications', url: absUrl(lang, '/publications') });
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.name, item: item.url })),
  };
}

/* ── Resolved metadata for one route ──────────────────────────── */

export interface PageMeta {
  title: string;
  description: string;
  keywords: string;
  url: string;
  /** true when the path matches no known route — the page must not be indexed */
  notFound: boolean;
  /** Real per-language URLs — this is what makes the hreflang tags useful. */
  alternates: { hreflang: string; href: string }[];
  ogLocale: string;
  ogLocaleAlternate: string;
  siteName: string;
  jsonLd: { person: object; website: object; breadcrumb: object; page: object | null };
}

/** `path` is the language-agnostic route ('/media/press'), never the
    prefixed pathname — call splitPath() first if you have the latter. */
export function pageMeta(lang: Lang, path: string): PageMeta {
  /* canonical URLs never carry a trailing slash (the sitemap has none either) */
  const route = path.replace(/\/+$/, '') || '/';
  const isContact = route.startsWith('/contact');
  const isMedia = route.startsWith('/media');
  const isMediaLanding = route === '/media';
  const mediaCategory = isMedia && !isMediaLanding ? route.split('/media/')[1]?.split('/')[0] || null : null;
  const isPub = route.startsWith('/publications');
  const notFound = !PRERENDER_ROUTES.includes(route);

  const catName = mediaCategory ? CAT_NAMES[mediaCategory] : null;
  const catDesc = mediaCategory ? CAT_DESCRIPTIONS[mediaCategory] : null;

  const data = notFound
    ? {
        title: `404 — ${UI[lang]['notFound.title']} | ${fullName(lang)}`,
        description: SEO[lang].description,
        keywords: SEO[lang].keywords,
      }
    : isPub
    ? PUB_SEO[lang]
    : isMedia && catName
      ? {
          /* the brand name, not the generic "Media"/"Médias" suffix every
             category used to share — that gave /media/press a 15-char title
             with no differentiator and no brand */
          title: `${catName[lang]} — ${shortName(lang)}`,
          description: catDesc?.[lang] || MEDIA_SEO[lang].description,
          keywords: catDesc?.keywords || MEDIA_SEO[lang].keywords,
        }
      : isMedia
        ? MEDIA_SEO[lang]
        : isContact
          ? CONTACT_SEO[lang]
          : SEO[lang];

  const url = absUrl(lang, route);

  return {
    title: data.title,
    description: data.description,
    keywords: data.keywords,
    url,
    notFound,
    alternates: [
      ...SUPPORTED.map((l) => ({ hreflang: l, href: absUrl(l, route) })),
      { hreflang: 'x-default', href: absUrl(DEFAULT_LANG, route) },
    ],
    ogLocale: SEO[lang].ogLocale,
    ogLocaleAlternate: SEO[lang === 'fr' ? 'en' : 'fr'].ogLocale,
    siteName: fullName(lang),
    jsonLd: {
      person: personJsonLd(lang),
      website: webSiteJsonLd(lang),
      breadcrumb: breadcrumbJsonLd(lang, route),
      page: notFound
        ? null
        : isContact
          ? contactPageJsonLd(lang)
          : isMedia || isPub
            ? collectionPageJsonLd(lang, data.title, data.description, url)
            : null,
    },
  };
}

/* Every language-agnostic route rendered to static HTML at build time, in
   every supported language. The sitemap is generated from this list too, so
   the two can no longer drift apart. */
export const PRERENDER_ROUTES = [
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

export const PRERENDER_LANGS: Lang[] = SUPPORTED;

/** Sitemap weighting per route, kept next to the route list it describes. */
export const ROUTE_PRIORITY: Record<string, { priority: string; changefreq: string }> = {
  '/': { priority: '1.0', changefreq: 'weekly' },
  '/contact': { priority: '0.7', changefreq: 'monthly' },
  '/media': { priority: '0.9', changefreq: 'weekly' },
  '/publications': { priority: '0.9', changefreq: 'weekly' },
};
export const DEFAULT_ROUTE_PRIORITY = { priority: '0.8', changefreq: 'monthly' };

/* re-exported so scripts/prerender.mjs works from this module alone */
export { localePath, DEFAULT_LANG } from '@/i18n/routing';
