import type { Lang } from '@/i18n/lang';

export type AgendaType = 'conference' | 'speaking' | 'community' | 'interview' | 'press';

export interface AgendaEntry {
  id: string;
  /** ISO date, yyyy-mm-dd. Events on or before today are "past". */
  date: string;
  type: AgendaType;
  title: Record<Lang, string>;
  location: Record<Lang, string>;
  /** One-sentence factual summary, shown on the card. */
  description: Record<Lang, string>;
  /** Optional external source — a video, article or event page. */
  link?: string;
}

/* Real engagements, drawn from the media and press records on this site.
   Keep dates truthful: an agenda that invents future appearances is worse
   than one that shows none — the "upcoming" section falls back to a contact
   call-to-action until a real date exists. */
export const AGENDA_ITEMS: AgendaEntry[] = [
  {
    id: 'podcast-ndep-ep5-2026',
    date: '2026-08-25',
    type: 'interview',
    title: {
      fr: 'Podcast Ndëp — L’espoir dans la lutte contre le paludisme',
      en: 'Ndëp Podcast — Hope in the fight against malaria',
    },
    location: { fr: 'En ligne / Podcast Ndëp', en: 'Online / Ndëp Podcast' },
    description: { fr: 'Épisode 5 du podcast Ndëp : entretien approfondi avec le Dr. Seynudé Jean-Fortuné Dagnon sur les défis, les innovations et l\'espoir dans la lutte et l\'élimination du paludisme en Afrique francophone.', en: 'Episode 5 of Ndëp podcast: in-depth interview with Dr. Seynudé Jean-Fortuné Dagnon on challenges, innovations, and hope in the fight and elimination of malaria across Francophone Africa.' },
    link: 'https://www.youtube.com/watch?v=IenUdkxFqNE',
  },
  {
    id: 'airid-visit-2026',
    date: '2026-07-21',
    type: 'community',
    title: {
      fr: 'Visite à l\'AIRID — Partenariats de recherche',
      en: 'Visit to AIRID — Research partnerships',
    },
    location: { fr: 'Cotonou, Bénin', en: 'Cotonou, Benin' },
    description: { fr: 'Visite de l’Institut africain de recherche sur les maladies infectieuses (AIRID) pour renforcer les partenariats de recherche et l’innovation scientifique au service de la santé au Bénin.', en: 'Visit to the African Institute for Research in Infectious Diseases (AIRID) to strengthen research partnerships and advance scientific innovation for health outcomes in Benin.' },
    link: 'https://airid-africa.com/public/news/28-airid-welcomes-dr-seynude-jean-fortune-dagnon-from-the-gates-foundation',
  },
  {
    id: 'harvard-sdm-2026',
    date: '2026-06-17',
    type: 'speaking',
    title: {
      fr: 'Discours — Cours sur le paludisme, Harvard SDM',
      en: 'Speech — Harvard SDM malaria course',
    },
    location: { fr: 'En ligne / Cambridge, États-Unis', en: 'Online / Cambridge, USA' },
    description: { fr: 'Intervention dans le cadre du cours sur le paludisme de la Harvard School of Dental Medicine, partageant l\'expérience de terrain du contrôle vectoriel et de la chimioprévention en Afrique de l\'Ouest.', en: 'Guest lecture for the Harvard School of Dental Medicine malaria course, sharing field experience on vector control and chemoprevention across West Africa.' },
    link: 'https://www.youtube.com/watch?v=7zuqZfH4bzQ',
  },
  {
    id: 'interview-health-financing-2026',
    date: '2026-06-17',
    type: 'interview',
    title: {
      fr: 'Interview — Financement de la santé et paludisme',
      en: 'Interview — Health financing on malaria',
    },
    location: { fr: 'En ligne', en: 'Online' },
    description: { fr: 'Entretien sur le financement durable de la lutte contre le paludisme et la place de l\'économie de la santé dans les politiques publiques africaines.', en: 'Interview on sustainable financing for malaria control and the role of health economics in African public policy.' },
    link: 'https://www.youtube.com/watch?v=5yh0ODmp47s',
  },
  {
    id: 'dakar-data-2026',
    date: '2026-05-12',
    type: 'community',
    title: {
      fr: 'Rencontre de Dakar — Données de santé en Afrique',
      en: 'Dakar meeting — Health data in Africa',
    },
    location: { fr: 'Dakar, Sénégal', en: 'Dakar, Senegal' },
    description: { fr: 'Échange avec des experts de la Fondation Gates sur l\'indispensable fiabilité des données de santé pour le suivi des maladies et l\'allocation des ressources, le Sénégal s\'imposant comme leader régional.', en: 'Discussions with Gates Foundation experts on why reliable health data is essential to disease tracking and resource allocation, with Senegal emerging as a regional leader.' },
    link: 'https://www.seneweb.com/en/news/24/systemes-sanitaires-africains-la-bataille-strategique-des-donnees-au-coeur-des-politiques-de-survie-1_n_492306.html',
  },
  {
    id: 'smc-annual-2026',
    date: '2026-02-28',
    type: 'conference',
    title: {
      fr: 'Réunion annuelle conjointe SMC 2026',
      en: 'Joint SMC Annual Meeting 2026',
    },
    location: { fr: 'Kampala, Ouganda', en: 'Kampala, Uganda' },
    description: { fr: 'Première réunion conjointe SMC Alliance / Alliance for Malaria Prevention : digitalisation des campagnes, optimisation des coûts et stratégies de chimioprévention saisonnière.', en: 'First joint SMC Alliance / Alliance for Malaria Prevention meeting: campaign digitalization, cost optimization and seasonal chemoprevention strategies.' },
    link: 'https://www.smc-alliance.org/smc-resources/joint-smc-amp-annual-meetings-2026-presentations',
  },
  {
    id: 'nuit-paludisme-5e-2025',
    date: '2025-07-15',
    type: 'community',
    title: {
      fr: '5e Nuit du Paludisme — Gala Icône 360°',
      en: '5th Night Against Malaria — Icône 360° gala',
    },
    location: { fr: 'Cotonou, Bénin', en: 'Cotonou, Benin' },
    description: { fr: 'En tant que parrain, discours et remise des attestations aux lauréats de la 5e édition de la Nuit du Paludisme, aux côtés d\'Expertise France et des acteurs communautaires.', en: 'As patron, gave the keynote and presented awards to the laureates of the 5th Night Against Malaria, alongside Expertise France and community actors.' },
  },
  {
    id: 'nuit-paludisme-2025',
    date: '2025-06-01',
    type: 'community',
    title: {
      fr: 'Nuit du Paludisme — Gala Icône 360',
      en: 'Night Against Malaria — Icône 360 gala',
    },
    location: { fr: 'Cotonou, Bénin', en: 'Cotonou, Benin' },
    description: { fr: 'Participation au gala Icône 360 de la Nuit du Paludisme, cérémonie de remise de prix saluant l\'engagement de la société civile dans la lutte antipaludique.', en: 'Took part in the Icône 360 Night Against Malaria gala, an awards ceremony honoring civil-society commitment to the malaria fight.' },
  },
  {
    id: 'mim-2024',
    date: '2024-04-25',
    type: 'conference',
    title: {
      fr: 'Initiative multilatérale pour le paludisme 2024',
      en: 'Multilateral Initiative for Malaria 2024',
    },
    location: { fr: 'Dakar, Sénégal', en: 'Dakar, Senegal' },
    description: { fr: 'Présentation dans le cadre de la conférence MIM 2024 sur la recherche et le contrôle du paludisme, rassemblant la communauté scientifique africaine et internationale.', en: 'Presentation at the MIM 2024 conference on malaria research and control, gathering the African and international scientific community.' },
    link: 'https://www.youtube.com/watch?v=D8kTMA4dDyg',
  },
  {
    id: 'astmh-2022',
    date: '2022-11-09',
    type: 'conference',
    title: {
      fr: 'ASTMH 2022 — Durabilité des moustiquaires imprégnées',
      en: 'ASTMH 2022 — LLIN durability monitoring',
    },
    location: { fr: 'Seattle, États-Unis', en: 'Seattle, USA' },
    description: { fr: 'Intervention à la 71e réunion annuelle de l\'ASTMH sur le suivi de la durabilité et de l\'efficacité des moustiquaires imprégnées d\'insecticide en conditions réelles.', en: 'Talk at the 71st annual ASTMH meeting on monitoring the durability and effectiveness of insecticide-treated nets in real-world conditions.' },
    link: 'https://www.youtube.com/watch?v=skmrswZhGZE',
  },
  {
    id: 'pamca-2022',
    date: '2022-09-28',
    type: 'speaking',
    title: {
      fr: 'Discours d\'ouverture — 8e conférence PAMCA',
      en: 'Opening speech — 8th PAMCA conference',
    },
    location: { fr: 'Yaoundé, Cameroun', en: 'Yaoundé, Cameroon' },
    description: { fr: 'Discours d\'ouverture de la 8e conférence de la Pan-African Mosquito Control Association, consacrée aux innovations en lutte antivectorielle.', en: 'Opening address at the 8th Pan-African Mosquito Control Association conference, focused on innovations in vector control.' },
    link: 'https://www.youtube.com/watch?v=ZTW9HqJ57kA',
  },
  {
    id: 'cs4me-2022',
    date: '2022-09-10',
    type: 'conference',
    title: {
      fr: 'Keynote — Société civile pour l\'élimination du paludisme',
      en: 'Keynote — Civil society for malaria elimination',
    },
    location: { fr: 'En ligne', en: 'Online' },
    description: { fr: 'Conférence inaugurale (CS4ME) sur le rôle de la société civile dans l\'élimination du paludisme et l\'équité d\'accès aux interventions.', en: 'Opening keynote (CS4ME) on the role of civil society in malaria elimination and equitable access to interventions.' },
    link: 'https://www.youtube.com/watch?v=ZjznHt_dAaU',
  },
  {
    id: 'cameroon-2022',
    date: '2022-03-01',
    type: 'speaking',
    title: {
      fr: 'Lancement de la campagne Stop Paludisme au Cameroun',
      en: 'Stop Malaria campaign launch in Cameroon',
    },
    location: { fr: 'Yaoundé, Cameroun', en: 'Yaoundé, Cameroon' },
    description: { fr: 'Discours au lancement de la campagne de mobilisation du secteur privé contre le paludisme au Cameroun, en soutien au programme national.', en: 'Speech at the launch of Cameroon\'s private-sector mobilization campaign against malaria, in support of the national program.' },
    link: 'https://www.youtube.com/watch?v=dxBGiEW41aM',
  },
  {
    id: 'usaid-smc-2019',
    date: '2019-06-01',
    type: 'speaking',
    title: {
      fr: 'USAID Bénin — Lancement de la campagne SMC',
      en: 'USAID Benin — SMC campaign launch',
    },
    location: { fr: 'Bénin', en: 'Benin' },
    description: { fr: 'Lancement de la campagne de chimioprévention du paludisme saisonnier (SMC) au Bénin, dans le cadre du projet USAID/RESILIENCE.', en: 'Launch of Benin\'s seasonal malaria chemoprevention (SMC) campaign under the USAID/RESILIENCE project.' },
    link: 'https://www.youtube.com/watch?v=rmEXxvOC2S4',
  },
];
