import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { useLang } from '@/i18n/useLang';
import { UI } from '@/i18n/translations';
import type { Lang } from '@/i18n/lang';

const SITE_URL = 'https://seynudedagnon.com';

/* ── Page-level SEO data ──────────────────────────────────────── */

const SEO: Record<Lang, { title: string; description: string; ogLocale: string }> = {
  fr: {
    title: 'Dr. Seynudé Jean-Fortuné DAGNON, MD, MPH — Santé publique & Paludisme',
    description:
      "Leader en santé publique et programmes de lutte contre le paludisme, Senior Program Officer à la Fondation Gates. Afrique francophone, systèmes de santé, données pour la décision.",
    ogLocale: 'fr_FR',
  },
  en: {
    title: 'Seynudé Jean-Fortuné DAGNON, MD, MPH — Public Health & Malaria',
    description:
      'Leader in public health and malaria programs, Senior Program Officer at the Gates Foundation. Francophone Africa, health systems, data for decision-making.',
    ogLocale: 'en_US',
  },
};

const CONTACT_SEO: Record<Lang, { title: string; description: string }> = {
  fr: {
    title: UI.fr['contact.seoTitle'],
    description: UI.fr['contact.seoDescription'],
  },
  en: {
    title: UI.en['contact.seoTitle'],
    description: UI.en['contact.seoDescription'],
  },
};

const MEDIA_SEO: Record<Lang, { title: string; description: string }> = {
  fr: {
    title: UI.fr['mediaPage.seoTitle'],
    description: UI.fr['mediaPage.seoDescription'],
  },
  en: {
    title: UI.en['mediaPage.seoTitle'],
    description: UI.en['mediaPage.seoDescription'],
  },
};

const CAT_NAMES: Record<string, { fr: string; en: string }> = {
  interview: { fr: 'Interviews', en: 'Interviews' },
  conference: { fr: 'Conférences', en: 'Conferences' },
  research: { fr: 'Recherche', en: 'Research' },
  publication: { fr: 'Publications', en: 'Publications' },
  press: { fr: 'Presse', en: 'Press' },
  community: { fr: 'Engagement communautaire', en: 'Community Engagement' },
};

const CAT_DESCRIPTIONS: Record<string, { fr: string; en: string }> = {
  interview: {
    fr: "Interviews du Dr. Seynudé Jean-Fortuné Dagnon sur la lutte contre le paludisme et la santé publique en Afrique francophone.",
    en: "Interviews with Dr. Seynudé Jean-Fortuné Dagnon on malaria control and public health in francophone Africa.",
  },
  conference: {
    fr: "Conférences et présentations du Dr. Seynudé Jean-Fortuné Dagnon lors d'événements internationaux sur la santé publique.",
    en: "Conferences and presentations by Dr. Seynudé Jean-Fortuné Dagnon at international public health events.",
  },
  research: {
    fr: "Recherches et études du Dr. Seynudé Jean-Fortuné Dagnon sur le paludisme, la PMI et les programmes de santé en Afrique.",
    en: "Research and studies by Dr. Seynudé Jean-Fortuné Dagnon on malaria, PMI, and health programs in Africa.",
  },
  publication: {
    fr: "Publications scientifiques et médiatiques du Dr. Seynudé Jean-Fortuné Dagnon sur la santé publique.",
    en: "Scientific and media publications by Dr. Seynudé Jean-Fortuné Dagnon on public health.",
  },
  press: {
    fr: "Articles de presse et couvertures médiatiques du Dr. Seynudé Jean-Fortuné Dagnon.",
    en: "Press articles and media coverage featuring Dr. Seynudé Jean-Fortuné Dagnon.",
  },
  community: {
    fr: "Engagement communautaire et activités de terrain du Dr. Seynudé Jean-Fortuné Dagnon en Afrique.",
    en: "Community engagement and field activities by Dr. Seynudé Jean-Fortuné Dagnon in Africa.",
  },
};

const PUB_SEO: Record<Lang, { title: string; description: string }> = {
  fr: {
    title: UI.fr['pubPage.seoTitle'],
    description: UI.fr['pubPage.seoDescription'],
  },
  en: {
    title: UI.en['pubPage.seoTitle'],
    description: UI.en['pubPage.seoDescription'],
  },
};

/* ── JSON-LD builders ─────────────────────────────────────────── */

function personJsonLd(lang: Lang) {
  const name = lang === 'fr' ? 'Dr. Seynudé Jean-Fortuné DAGNON, MD, MPH' : 'Seynudé Jean-Fortuné DAGNON, MD, MPH';
  const jobTitle =
    lang === 'fr'
      ? 'Senior Program Officer — Paludisme / Afrique francophone, Fondation Gates'
      : 'Senior Program Officer — Malaria / Francophone Africa, Gates Foundation';
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    alternateName: 'Seynudé Dagnon',
    jobTitle,
    description: SEO[lang].description,
    url: SITE_URL,
    image: `${SITE_URL}/og-image.jpg`,
    sameAs: [
      'https://www.linkedin.com/in/seynud%C3%A9-jean-fortune-dagnon-md-mph-p-h-d-in-progress-093a5a2a/',
      'https://www.youtube.com/@seynudedagnon6233',
      'https://www.facebook.com/jeanfortune.dagnon/',
      'https://x.com/SeynudeD',
      'https://www.tiktok.com/@fortunedagnon',
    ],
    alumniOf: [
      { '@type': 'CollegeOrUniversity', name: 'University of Conakry', url: 'https://www.univconakry.edu.gn/' },
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
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Cotonou',
      addressCountry: 'BJ',
    },
  };
}

function webSiteJsonLd(lang: Lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SEO[lang].title,
    url: SITE_URL,
    description: SEO[lang].description,
    author: {
      '@type': 'Person',
      name: lang === 'fr' ? 'Dr. Seynudé Jean-Fortuné DAGNON, MD, MPH' : 'Seynudé Jean-Fortuné DAGNON, MD, MPH',
    },
    inLanguage: [lang === 'fr' ? 'fr' : 'en'],
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

function contactPageJsonLd(lang: Lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: CONTACT_SEO[lang].title,
    description: CONTACT_SEO[lang].description,
    url: `${SITE_URL}/contact`,
    mainEntity: {
      '@type': 'Person',
      name: lang === 'fr' ? 'Dr. Seynudé Jean-Fortuné DAGNON, MD, MPH' : 'Seynudé Jean-Fortuné DAGNON, MD, MPH',
      jobTitle: lang === 'fr'
        ? 'Senior Program Officer — Paludisme / Afrique francophone, Fondation Gates'
        : 'Senior Program Officer — Malaria / Francophone Africa, Gates Foundation',
      email: 'contact@seynudedagnon.com',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Cotonou',
        addressCountry: 'BJ',
      },
    },
  };
}

function collectionPageJsonLd(lang: Lang, pageTitle: string, pageDesc: string, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: pageTitle,
    description: pageDesc,
    url,
    author: {
      '@type': 'Person',
      name: lang === 'fr' ? 'Dr. Seynudé Jean-Fortuné DAGNON, MD, MPH' : 'Seynudé Jean-Fortuné DAGNON, MD, MPH',
    },
    inLanguage: [lang === 'fr' ? 'fr' : 'en'],
  };
}

/* ── Component ────────────────────────────────────────────────── */

export function Seo() {
  const { lang } = useLang();
  const { pathname } = useLocation();
  const isContact = pathname.startsWith('/contact');
  const isMedia = pathname.startsWith('/media');
  const isMediaLanding = pathname === '/media' || pathname === '/media/';
  const mediaCategory = isMedia && !isMediaLanding ? pathname.split('/media/')[1]?.split('/')[0] : null;
  const isPub = pathname.startsWith('/publications');
  const isHome = pathname === '/' || pathname === '';

  useEffect(() => {
    const catName = mediaCategory ? CAT_NAMES[mediaCategory] : null;
    const catDesc = mediaCategory ? CAT_DESCRIPTIONS[mediaCategory] : null;
    const data = isPub
      ? PUB_SEO[lang]
      : isMedia && catName
        ? { title: `${catName[lang]} — ${UI[lang]['mediaPage.badge']}`, description: catDesc?.[lang] || MEDIA_SEO[lang].description }
        : isMedia
          ? MEDIA_SEO[lang]
          : isContact
            ? CONTACT_SEO[lang]
            : SEO[lang];
    const url = SITE_URL + (isPub ? '/publications' : isMedia ? pathname : isContact ? '/contact' : '');
    document.title = data.title;
    document.documentElement.lang = lang;

    const setMeta = (selector: string, _attr: 'content', value: string) => {
      let el = document.head.querySelector(selector) as HTMLElement | null;
      if (!el) {
        el = document.createElement('meta');
        const prop = selector.includes('property=')
          ? selector.match(/property="([^"]+)"/)?.[1]
          : selector.match(/name="([^"]+)"/)?.[1];
        if (prop) el.setAttribute(selector.includes('property=') ? 'property' : 'name', prop);
        document.head.appendChild(el);
      }
      el.setAttribute('content', value);
    };

    setMeta('meta[name="description"]', 'content', data.description);
    setMeta('meta[property="og:title"]', 'content', data.title);
    setMeta('meta[property="og:description"]', 'content', data.description);
    setMeta('meta[property="og:url"]', 'content', url);
    setMeta('meta[property="og:locale"]', 'content', SEO[lang].ogLocale);
    setMeta('meta[property="og:site_name"]', 'content', 'Seynudé Jean-Fortuné DAGNON, MD, MPH');
    setMeta('meta[property="og:image"]', 'content', `${SITE_URL}/og-image.jpg`);
    setMeta('meta[property="og:image:alt"]', 'content', data.title);
    setMeta('meta[property="og:image:width"]', 'content', '1200');
    setMeta('meta[property="og:image:height"]', 'content', '630');
    setMeta('meta[property="og:image:type"]', 'content', 'image/jpeg');
    setMeta('meta[name="twitter:card"]', 'content', 'summary_large_image');
    setMeta('meta[name="twitter:site"]', 'content', '@SeynudeD');
    setMeta('meta[name="twitter:creator"]', 'content', '@SeynudeD');
    setMeta('meta[name="twitter:title"]', 'content', data.title);
    setMeta('meta[name="twitter:description"]', 'content', data.description);
    setMeta('meta[name="twitter:url"]', 'content', url);
    setMeta('meta[name="twitter:image"]', 'content', `${SITE_URL}/og-image.jpg`);

    let link = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', url);

    let hreflangEn = document.head.querySelector('link[rel="alternate"][hreflang="en"]') as HTMLLinkElement | null;
    if (!hreflangEn) {
      hreflangEn = document.createElement('link');
      hreflangEn.setAttribute('rel', 'alternate');
      hreflangEn.setAttribute('hreflang', 'en');
      document.head.appendChild(hreflangEn);
    }
    hreflangEn.setAttribute('href', url);

    let hreflangFr = document.head.querySelector('link[rel="alternate"][hreflang="fr"]') as HTMLLinkElement | null;
    if (!hreflangFr) {
      hreflangFr = document.createElement('link');
      hreflangFr.setAttribute('rel', 'alternate');
      hreflangFr.setAttribute('hreflang', 'fr');
      document.head.appendChild(hreflangFr);
    }
    hreflangFr.setAttribute('href', url);

    let hreflangDefault = document.head.querySelector('link[rel="alternate"][hreflang="x-default"]') as HTMLLinkElement | null;
    if (!hreflangDefault) {
      hreflangDefault = document.createElement('link');
      hreflangDefault.setAttribute('rel', 'alternate');
      hreflangDefault.setAttribute('hreflang', 'x-default');
      document.head.appendChild(hreflangDefault);
    }
    hreflangDefault.setAttribute('href', url);

    let ld = document.getElementById('person-jsonld');
    if (!ld) {
      ld = document.createElement('script');
      ld.id = 'person-jsonld';
      ld.setAttribute('type', 'application/ld+json');
      document.head.appendChild(ld);
    }

    let pageLd = document.getElementById('page-jsonld');
    if (!pageLd) {
      pageLd = document.createElement('script');
      pageLd.id = 'page-jsonld';
      pageLd.setAttribute('type', 'application/ld+json');
      document.head.appendChild(pageLd);
    }

    let websiteLd = document.getElementById('website-jsonld');
    if (!websiteLd) {
      websiteLd = document.createElement('script');
      websiteLd.id = 'website-jsonld';
      websiteLd.setAttribute('type', 'application/ld+json');
      document.head.appendChild(websiteLd);
    }

    ld.textContent = JSON.stringify(personJsonLd(lang));
    websiteLd.textContent = JSON.stringify(webSiteJsonLd(lang));

    if (isContact) {
      pageLd.textContent = JSON.stringify(contactPageJsonLd(lang));
    } else if (isMedia || isPub) {
      pageLd.textContent = JSON.stringify(collectionPageJsonLd(lang, data.title, data.description, url));
    } else {
      pageLd.textContent = JSON.stringify(webSiteJsonLd(lang));
    }
  }, [lang, isContact, isMedia, isPub, isHome, mediaCategory, pathname]);

  return null;
}
