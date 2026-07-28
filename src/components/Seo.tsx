import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { useLang } from '@/i18n/useLang';
import { UI } from '@/i18n/translations';
import type { Lang } from '@/i18n/lang';

const SITE_URL = 'https://seynudedagnon.com';

/* ── Page-level SEO data ──────────────────────────────────────── */

const SEO: Record<Lang, { title: string; description: string; keywords: string; ogLocale: string }> = {
  fr: {
    title: 'Dr. Seynudé Jean-Fortuné DAGNON — Santé publique, Paludisme & Leadership en Afrique francophone',
    description:
      "Dr. Seynudé Jean-Fortuné Dagnon, MD, MPH — Leader en santé publique et paludisme. Senior Program Officer à la Fondation Gates, 17+ ans d'expérience au Bénin et en Afrique francophone. Systèmes de santé, données pour la décision, élimination du paludisme.",
    keywords: 'Seynudé Dagnon, paludisme, santé publique, Fondation Gates, USAID, PMI, Bénin, Afrique francophone, économie de la santé, leader paludisme, malaria program leader, Cotonou, doctorat Groningen, MPH Antwerp',
    ogLocale: 'fr_FR',
  },
  en: {
    title: 'Seynudé Jean-Fortuné DAGNON, MD, MPH — Public Health & Malaria Program Leader',
    description:
      'Dr. Seynudé Jean-Fortuné Dagnon, MD, MPH — Public Health & Malaria Program Leader. Senior Program Officer at the Gates Foundation with 17+ years of experience across Benin and Francophone Africa. Health systems, data-driven decision-making, malaria elimination.',
    keywords: 'Seynudé Dagnon, malaria, public health, Gates Foundation, USAID, PMI, Benin, Francophone Africa, health economics, malaria program leader, Cotonou, PhD Groningen, MPH Antwerp, vector control, SMC',
    ogLocale: 'en_US',
  },
};

const CONTACT_SEO: Record<Lang, { title: string; description: string; keywords: string }> = {
  fr: {
    title: 'Contact — Dr. Seynudé Jean-Fortuné DAGNON | Santé publique & Paludisme',
    description: 'Contactez le Dr. Seynudé Jean-Fortuné Dagnon pour des partenariats, conférences, conseils techniques ou échanges sur la santé publique et le paludisme en Afrique francophone. Formulaire, e-mail et réseaux sociaux. Basé à Cotonou (Bénin) et Dakar (Sénégal).',
    keywords: 'contact Dr Dagnon, email santé publique, partenariat paludisme, conférence Afrique, conseil technique Bénin, Cotonou, Dakar, Sénégal',
  },
  en: {
    title: 'Contact — Seynudé Jean-Fortuné DAGNON, MD, MPH | Public Health & Malaria',
    description: 'Contact Dr. Seynudé Jean-Fortuné Dagnon for partnerships, conferences, technical advice or discussions on public health and malaria in Francophone Africa. Form, email and social networks. Based in Cotonou (Benin) and Dakar (Senegal).',
    keywords: 'contact Dr Dagnon, public health email, malaria partnership, Africa conference, technical advice Benin, Cotonou, Dakar, Senegal',
  },
};

const MEDIA_SEO: Record<Lang, { title: string; description: string; keywords: string }> = {
  fr: {
    title: 'Médias — Interviews, Conférences & Engagements du Dr. Dagnon',
    description: "Interviews, conférences internationales, discours publics, couvertures médiatiques et engagement communautaire du Dr. Seynudé Jean-Fortuné Dagnon sur la lutte contre le paludisme et la santé publique en Afrique.",
    keywords: 'interviews Dr Dagnon, conférences paludisme, discours santé publique, presse Bénin, engagements communautaires, Nuit du Paludisme, media malaria Africa',
  },
  en: {
    title: 'Media — Interviews, Conferences & Engagements of Dr. Dagnon',
    description: 'Interviews, international conferences, public speeches, press coverage and community engagement by Dr. Seynudé Jean-Fortuné Dagnon on malaria control and public health in Africa.',
    keywords: 'Dr Dagnon interviews, malaria conferences, public health speeches, press Benin, community engagement, Night Against Malaria, media malaria Africa',
  },
};

const CAT_NAMES: Record<string, { fr: string; en: string }> = {
  interview: { fr: 'Interviews', en: 'Interviews' },
  conference: { fr: 'Présentations & Conférences', en: 'Presentations & Conferences' },
  speaking: { fr: 'Discours publics', en: 'Public Speaking' },
  press: { fr: 'Presse', en: 'Press' },
  community: { fr: 'Engagement communautaire et philanthropique', en: 'Community and Philanthropic Engagement' },
};

const CAT_DESCRIPTIONS: Record<string, { fr: string; en: string; keywords: string }> = {
  interview: {
    fr: "Interviews du Dr. Seynudé Jean-Fortuné Dagnon sur la lutte contre le paludisme, les systèmes de santé africains et l'élimination du paludisme en Afrique francophone.",
    en: "Interviews with Dr. Seynudé Jean-Fortuné Dagnon on malaria control, African health systems and malaria elimination in Francophone Africa.",
    keywords: 'interview Dr Dagnon, paludisme Afrique, santé publique interview, malaria expert interview, Gates Foundation',
  },
  conference: {
    fr: "Conférences et présentations du Dr. Seynudé Jean-Fortuné Dagnon lors d'événements internationaux sur le paludisme, la recherche opérationnelle et les politiques de santé.",
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

const PUB_SEO: Record<Lang, { title: string; description: string; keywords: string }> = {
  fr: {
    title: 'Publications scientifiques — Dr. Seynudé Jean-Fortuné DAGNON',
    description: "Publications scientifiques et articles du Dr. Seynudé Jean-Fortuné Dagnon dans Malaria Journal, Parasites & Vectors, Frontiers in Tropical Diseases et autres revues. Entomologie, lutte antipaludique, politiques d'élimination en Afrique francophone.",
    keywords: 'publications Dr Dagnon, Malaria Journal, Parasites Vectors, Frontiers Tropical Diseases, recherche paludisme, entomologie, IRS, SMC, vector control Africa',
  },
  en: {
    title: 'Scientific Publications — Seynudé Jean-Fortuné DAGNON, MD, MPH',
    description: 'Scientific publications and articles by Seynudé Jean-Fortuné Dagnon in Malaria Journal, Parasites & Vectors, Frontiers in Tropical Diseases and others. Entomology, malaria control, elimination policy in Francophone Africa.',
    keywords: 'Dr Dagnon publications, Malaria Journal, Parasites Vectors, Frontiers Tropical Diseases, malaria research, entomology, IRS, SMC, vector control Africa',
  },
};

/* ── JSON-LD builders ─────────────────────────────────────────── */

function personJsonLd(lang: Lang) {
  const name = lang === 'fr' ? 'Dr. Seynudé Jean-Fortuné DAGNON' : 'Seynudé Jean-Fortuné DAGNON, MD, MPH';
  const jobTitle =
    lang === 'fr'
      ? 'Leader de programme en santé publique et paludisme'
      : 'Public Health & Malaria Program Leader';
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    alternateName: 'Seynudé Dagnon',
    jobTitle,
    description: SEO[lang].description,
    url: SITE_URL,
    image: `${SITE_URL}/og-image.jpg`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': SITE_URL,
    },
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
      name: lang === 'fr' ? 'Dr. Seynudé Jean-Fortuné DAGNON' : 'Seynudé Jean-Fortuné DAGNON, MD, MPH',
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
      name: lang === 'fr' ? 'Dr. Seynudé Jean-Fortuné DAGNON' : 'Seynudé Jean-Fortuné DAGNON, MD, MPH',
      jobTitle: lang === 'fr'
        ? 'Leader de programme en santé publique et paludisme'
        : 'Public Health & Malaria Program Leader',
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
      name: lang === 'fr' ? 'Dr. Seynudé Jean-Fortuné DAGNON' : 'Seynudé Jean-Fortuné DAGNON, MD, MPH',
    },
    inLanguage: [lang === 'fr' ? 'fr' : 'en'],
  };
}

function breadcrumbJsonLd(lang: Lang, pathname: string) {
  const personName = lang === 'fr' ? 'Dr. Seynudé Jean-Fortuné DAGNON' : 'Seynudé Dagnon';
  const items: { name: string; url: string }[] = [
    { name: personName, url: SITE_URL },
  ];
  if (pathname.startsWith('/contact')) {
    items.push({ name: lang === 'fr' ? 'Contact' : 'Contact', url: `${SITE_URL}/contact` });
  } else if (pathname.startsWith('/media')) {
    items.push({ name: lang === 'fr' ? 'Médias' : 'Media', url: `${SITE_URL}/media` });
    const cat = pathname.split('/media/')[1]?.split('/')[0];
    if (cat && CAT_NAMES[cat]) {
      items.push({ name: CAT_NAMES[cat][lang], url: `${SITE_URL}/media/${cat}` });
    }
  } else if (pathname.startsWith('/publications')) {
    items.push({ name: lang === 'fr' ? 'Publications' : 'Publications', url: `${SITE_URL}/publications` });
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
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
        ? { title: `${catName[lang]} — ${UI[lang]['mediaPage.badge']}`, description: catDesc?.[lang] || MEDIA_SEO[lang].description, keywords: catDesc?.keywords || MEDIA_SEO[lang].keywords }
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
    setMeta('meta[name="keywords"]', 'content', data.keywords);
    setMeta('meta[property="og:title"]', 'content', data.title);
    setMeta('meta[property="og:description"]', 'content', data.description);
    setMeta('meta[property="og:url"]', 'content', url);
    setMeta('meta[property="og:locale"]', 'content', SEO[lang].ogLocale);
    setMeta('meta[property="og:site_name"]', 'content', lang === 'fr' ? 'Dr. Seynudé Jean-Fortuné DAGNON' : 'Seynudé Jean-Fortuné DAGNON, MD, MPH');
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

    let breadcrumbLd = document.getElementById('breadcrumb-jsonld');
    if (!breadcrumbLd) {
      breadcrumbLd = document.createElement('script');
      breadcrumbLd.id = 'breadcrumb-jsonld';
      breadcrumbLd.setAttribute('type', 'application/ld+json');
      document.head.appendChild(breadcrumbLd);
    }

    ld.textContent = JSON.stringify(personJsonLd(lang));
    websiteLd.textContent = JSON.stringify(webSiteJsonLd(lang));
    breadcrumbLd.textContent = JSON.stringify(breadcrumbJsonLd(lang, pathname));

    if (isContact) {
      pageLd.textContent = JSON.stringify(contactPageJsonLd(lang));
    } else if (isMedia || isPub) {
      pageLd.textContent = JSON.stringify(collectionPageJsonLd(lang, data.title, data.description, url));
    } else {
      pageLd.textContent = '';
    }
  }, [lang, isContact, isMedia, isPub, isHome, mediaCategory, pathname]);

  return null;
}
