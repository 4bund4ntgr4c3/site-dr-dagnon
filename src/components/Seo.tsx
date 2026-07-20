import { useEffect } from 'react';
import { useLang } from '@/i18n/LanguageContext';
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

function personJsonLd(lang: Lang) {
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
    jobTitle,
    description: desc,
    url: SITE_URL,
    image: `${SITE_URL}/og-image.jpg`,
    alumniOf: [
      { '@type': 'CollegeOrUniversity', name: 'University of Conakry' },
      { '@type': 'CollegeOrUniversity', name: 'Institute of Tropical Medicine, Antwerp' },
      { '@type': 'CollegeOrUniversity', name: 'University of Groningen' },
    ],
    worksFor: { '@type': 'Organization', name: lang === 'fr' ? 'Fondation Gates' : 'Gates Foundation' },
    knowsAbout: ['Malaria', 'Public Health', 'Health Systems', 'Digital Health', 'Epidemiology'],
    sameAs: [
      'https://www.linkedin.com/in/seynud%C3%A9-jean-fortune-dagnon-md-mph-p-h-d-in-progress-093a5a2a/',
      'https://www.youtube.com/@seynudedagnon6233',
    ],
  };
}

export function Seo() {
  const { lang } = useLang();

  useEffect(() => {
    const data = SEO[lang];
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
    setMeta('meta[property="og:locale"]', 'content', data.ogLocale);
    setMeta('meta[name="twitter:title"]', 'content', data.title);
    setMeta('meta[name="twitter:description"]', 'content', data.description);

    let ld = document.getElementById('person-jsonld');
    if (!ld) {
      ld = document.createElement('script');
      ld.id = 'person-jsonld';
      ld.setAttribute('type', 'application/ld+json');
      document.head.appendChild(ld);
    }
    ld.textContent = JSON.stringify(personJsonLd(lang));
  }, [lang]);

  return null;
}
