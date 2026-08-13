import type { Lang } from '@/i18n/lang';

/* Testimonials shown on the Collaborate page. Drafted from a professional
   standpoint and labelled by institutional role rather than by a real named
   individual, so the site owner can review and attribute them before going
   live. Replace or remove freely. */

export interface TestimonialEntry {
  id: string;
  role: Record<Lang, string>;
  org: Record<Lang, string>;
  quote: Record<Lang, string>;
}

export const TESTIMONIALS: TestimonialEntry[] = [
  {
    id: 'ministry-partner',
    role: {
      fr: 'Direction nationale du programme paludisme',
      en: 'National malaria program manager',
    },
    org: { fr: 'Ministère de la Santé', en: 'Ministry of Health' },
    quote: {
      fr: 'Une collaboration structurée, fondée sur les données et attentive au terrain. En passant par le Dr Dagnon, la complétude de notre système d\'information est passée de 35 % à 94 %, et le taux d\'erreur national a chuté de 44 % à 5 % sur plus de 1 100 centres de santé. Son appui a directement éclairé nos décisions programmatiques.',
      en: 'A structured, data-driven collaboration that stayed close to the field. Working with Dr. Dagnon, our routine information system completeness rose from 35% to 94%, and the national data error rate fell from 44% to 5% across more than 1,100 health facilities. His support directly informed our programmatic decisions.',
    },
  },
  {
    id: 'research-partner',
    role: {
      fr: 'Coordinatrice de recherche',
      en: 'Research coordinator',
    },
    org: { fr: 'Institut de recherche', en: 'Research institute' },
    quote: {
      fr: 'Un engagement rigoureux de bout en bout, des hypothèses au partage des résultats. Sur la chimioprévention saisonnière comme sur la gouvernance des données, les échanges ont été francs, précis et orientés vers l\'impact réel sur les populations.',
      en: 'Rigorous engagement from hypothesis to shared results. Whether on seasonal chemoprevention or data governance, the exchanges were candid, precise and driven by real impact on communities.',
    },
  },
];