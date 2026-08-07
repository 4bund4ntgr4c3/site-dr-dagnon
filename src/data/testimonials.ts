import type { Lang } from '@/i18n/lang';

/* Testimonials shown on the Collaborate page. The quotes are drafted from a
   professional standpoint and labelled by institutional role rather than by
   a real named individual, so they can be reviewed and attributed by the
   site owner before going live. Replace or remove freely. */

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
      fr: 'Une collaboration structurée, fondée sur les données et attentive au terrain. Le soutien apporté a directement éclairé nos décisions programmatiques.',
      en: 'A structured, data-driven collaboration that stayed close to the field. The support given directly informed our programmatic decisions.',
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
      fr: 'Un engagement rigoureux de bout en bout, des hypothèses au partage des résultats. Les échanges ont été francs, précis et orientés vers l\'impact.',
      en: 'Rigorous engagement from hypothesis to shared results. The exchanges were candid, precise and impact-oriented.',
    },
  },
];