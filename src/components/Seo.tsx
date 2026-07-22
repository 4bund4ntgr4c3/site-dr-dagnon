import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { useLang } from '@/i18n/useLang';
import { UI } from '@/i18n/translations';
import type { Lang } from '@/i18n/lang';

const SITE_URL = 'https://seynudedagnon.com';

const SEO: Record<Lang, { title: string; description: string; ogLocale: string }> = {
  fr: {
    title: 'Dr. Seynudé Jean-Fortuné Dagnon, MD, MPH — Santé publique & Paludisme',
    description:
      "Leader en santé publique et programmes de lutte contre le paludisme, Senior Program Officer à la Fondation Gates. Afrique francophone, systèmes de santé, données pour la décision.",
    ogLocale: 'fr_FR',
  },
  en: {
    title: 'Seynudé Jean-Fortuné DAGNON, PhD — Public Health & Malaria',
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

function personJsonLd(lang: Lang, url: string) {
  const name = lang === 'fr' ? 'Dr. Seynudé Jean-Fortuné DAGNON' : 'Seynudé Jean-Fortuné DAGNON, PhD';
  const jobTitle =
    lang === 'fr'
      ? 'Senior Program Officer — Paludisme / Afrique francophone, Fondation Gates'
      : 'Senior Program Officer — Malaria / Francophone Africa, Gates Foundation';
  const desc = SEO[lang].description;
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    alternateName: 'Seynudé Dagnon',
    jobTitle,
    description: desc,
    url,
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

export function Seo() {
  const { lang } = useLang();
  const { pathname } = useLocation();
  const isContact = pathname.startsWith('/contact');
  const isMedia = pathname.startsWith('/media');
  const isPub = pathname.startsWith('/publications');

  useEffect(() => {
    const data = isPub ? PUB_SEO[lang] : isMedia ? MEDIA_SEO[lang] : isContact ? CONTACT_SEO[lang] : SEO[lang];
    const url = SITE_URL + (isPub ? '/publications' : isMedia ? '/media' : isContact ? '/contact' : '');
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

    let ld = document.getElementById('person-jsonld');
    if (!ld) {
      ld = document.createElement('script');
      ld.id = 'person-jsonld';
      ld.setAttribute('type', 'application/ld+json');
      document.head.appendChild(ld);
    }
    ld.textContent = JSON.stringify(personJsonLd(lang, SITE_URL));
  }, [lang, isContact, isMedia, isPub]);

  return null;
}
