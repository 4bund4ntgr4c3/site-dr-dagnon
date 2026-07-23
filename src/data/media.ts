import type { Lang } from '@/i18n/lang';

export type MediaType = 'video' | 'image' | 'document';
export type MediaCategory = 'interview' | 'conference' | 'research' | 'publication' | 'press' | 'community';

export interface MediaEntry {
  id: string;
  type: MediaType;
  category: MediaCategory;
  date: string; // ISO yyyy-mm-dd
  title: Record<Lang, string>;
  youtubeId?: string;
  thumb?: string;
  src?: string;
  url?: string;
  fileLabel?: Record<Lang, string>;
}

export const MEDIA_ITEMS: MediaEntry[] = [
  // ── Videos ────────────────────────────────────────────────────────
  {
    id: 'harvard-sdm',
    type: 'video',
    category: 'research',
    date: '2024-06-01',
    title: {
      fr: 'Discours — Harvard SDM, cours sur le paludisme',
      en: 'Speech — Harvard SDM malaria course',
    },
    youtubeId: '7zuqZfH4bzQ',
    thumb: 'https://img.youtube.com/vi/7zuqZfH4bzQ/hqdefault.jpg',
  },
  {
    id: 'interview-health-financing',
    type: 'video',
    category: 'interview',
    date: '2024-03-01',
    title: {
      fr: 'Interview — Financement de la santé et paludisme',
      en: 'Interview — Health financing on malaria',
    },
    youtubeId: '5yh0ODmp47s',
    thumb: 'https://img.youtube.com/vi/5yh0ODmp47s/hqdefault.jpg',
  },
  {
    id: 'mim-2024',
    type: 'video',
    category: 'conference',
    date: '2024-10-01',
    title: {
      fr: 'Initiative multilatérale pour le paludisme 2024',
      en: 'Multilateral Initiative for Malaria 2024',
    },
    youtubeId: 'D8kTMA4dDyg',
    thumb: 'https://img.youtube.com/vi/D8kTMA4dDyg/hqdefault.jpg',
  },
  {
    id: 'gates-benin-2023',
    type: 'video',
    category: 'conference',
    date: '2023-12-12',
    title: {
      fr: 'Réunion Fondation Gates — Paludisme au Bénin, 12 déc. 2023',
      en: 'Gates Foundation meeting — Malaria in Benin, Dec 12 2023',
    },
    youtubeId: '2mNE0Bx0A3o',
    thumb: 'https://img.youtube.com/vi/2mNE0Bx0A3o/hqdefault.jpg',
  },
  {
    id: 'canal3-benin-2022',
    type: 'video',
    category: 'interview',
    date: '2022-05-01',
    title: {
      fr: 'Canal 3 Bénin — Mai 2022',
      en: 'Canal 3 Benin — May 2022',
    },
    youtubeId: 'JmhHzsW9bVs',
    thumb: 'https://img.youtube.com/vi/JmhHzsW9bVs/hqdefault.jpg',
  },
  {
    id: 'bmgf-partners-2022',
    type: 'video',
    category: 'conference',
    date: '2022-10-01',
    title: {
      fr: 'Partenaires BMGF — Paludisme au Bénin 2022',
      en: 'BMGF malaria partners — Benin 2022',
    },
    youtubeId: 'vHxKgLVdyQ4',
    thumb: 'https://img.youtube.com/vi/vHxKgLVdyQ4/hqdefault.jpg',
  },
  {
    id: 'astmh-2022',
    type: 'video',
    category: 'conference',
    date: '2022-11-01',
    title: {
      fr: 'ASTMH 2022 — Société américaine de médecine tropicale',
      en: 'ASTMH 2022 — American Society of Tropical Medicine & Hygiene',
    },
    youtubeId: 'skmrswZhGZE',
    thumb: 'https://img.youtube.com/vi/skmrswZhGZE/hqdefault.jpg',
  },
  {
    id: 'pamca-2022',
    type: 'video',
    category: 'conference',
    date: '2022-09-14',
    title: {
      fr: 'Discours d\'ouverture — 8e conférence PAMCA',
      en: 'Opening keynote — 8th PAMCA conference',
    },
    youtubeId: 'ZTW9HqJ57kA',
    thumb: 'https://img.youtube.com/vi/ZTW9HqJ57kA/hqdefault.jpg',
  },
  {
    id: 'cs4me-2022',
    type: 'video',
    category: 'conference',
    date: '2022-09-10',
    title: {
      fr: 'Keynote — Société civile pour l\'élimination du paludisme',
      en: 'Keynote — Civil society for malaria elimination (CS4ME)',
    },
    youtubeId: 'ZjznHt_dAaU',
    thumb: 'https://img.youtube.com/vi/ZjznHt_dAaU/hqdefault.jpg',
  },
  {
    id: 'cameroon-2022',
    type: 'video',
    category: 'press',
    date: '2022-03-01',
    title: {
      fr: 'Discours au Cameroun — Mars 2022',
      en: 'Speech in Cameroon — March 2022',
    },
    youtubeId: 'dxBGiEW41aM',
    thumb: 'https://img.youtube.com/vi/dxBGiEW41aM/hqdefault.jpg',
  },
  {
    id: 'usaid-smc-2019',
    type: 'video',
    category: 'press',
    date: '2019-06-01',
    title: {
      fr: 'USAID Bénin — Lancement de la campagne SMC',
      en: 'USAID Benin — SMC campaign launch',
    },
    youtubeId: 'rmEXxvOC2S4',
    thumb: 'https://img.youtube.com/vi/rmEXxvOC2S4/hqdefault.jpg',
  },
  {
    id: 'census-kandi-2017',
    type: 'video',
    category: 'press',
    date: '2017-09-01',
    title: {
      fr: 'Lancement du recensement ménager à Kandi',
      en: 'Household census launch in Kandi',
    },
    youtubeId: 'EZbXBNsjdpQ',
    thumb: 'https://img.youtube.com/vi/EZbXBNsjdpQ/hqdefault.jpg',
  },
  {
    id: 'irs-2018',
    type: 'video',
    category: 'press',
    date: '2018-04-01',
    title: {
      fr: 'Lancement de la campagne IRS 2018',
      en: 'IRS campaign launch 2018',
    },
    youtubeId: 'PmGRAr1EyGk',
    thumb: 'https://img.youtube.com/vi/PmGRAr1EyGk/hqdefault.jpg',
  },
  {
    id: 'covid19-webinar',
    type: 'video',
    category: 'interview',
    date: '2020-06-01',
    title: {
      fr: 'Intervenant — Webinaire COVID-19',
      en: 'Speaker — COVID-19 webinar',
    },
    youtubeId: 'S01-Mv1eors',
    thumb: 'https://img.youtube.com/vi/S01-Mv1eors/hqdefault.jpg',
  },
  {
    id: 'usaid-60th-2020',
    type: 'video',
    category: 'press',
    date: '2020-12-01',
    title: {
      fr: 'Dr. Dagnon — USAID Bénin, 60e anniversaire',
      en: 'Dr. Dagnon — USAID Benin 60th Anniversary',
    },
    youtubeId: 'UoMp2gsHbkQ',
    thumb: 'https://img.youtube.com/vi/UoMp2gsHbkQ/hqdefault.jpg',
  },
  // ── Documents ─────────────────────────────────────────────────────
  {
    id: 'gates-funding-2026',
    type: 'document',
    category: 'publication',
    date: '2026-02-01',
    title: {
      fr: 'Funding landscape — Fondation Gates',
      en: 'Funding landscape — Gates Foundation',
    },
    url: 'https://allianceformalariaprevention.com/wp-content/uploads/2026/02/04-d_Funding-Landscape_Gates-Foundation_Seynude-Dagnon_ENG.pdf',
    fileLabel: { fr: 'PDF · Présentation', en: 'PDF · Deck' },
  },
  {
    id: 'oped-ahw-2026',
    type: 'document',
    category: 'press',
    date: '2026-05-01',
    title: {
      fr: 'Tribune — Du contrôle à l\'élimination du paludisme',
      en: 'Op-ed — From malaria control to elimination',
    },
    url: 'https://www.africahealthwatch.com/p/from-malaria-control-to-elimination',
    fileLabel: { fr: 'Article · Africa Health Watch', en: 'Article · Africa Health Watch' },
  },
  // ── Images ────────────────────────────────────────────────────────
  {
    id: 'summit-2023',
    type: 'image',
    category: 'press',
    date: '2023-05-20',
    title: {
      fr: 'Dr. Dagnon lors du sommet sur le paludisme',
      en: 'Dr. Dagnon at the malaria summit',
    },
    src: '/dr-seynude-dagnon.jpeg',
  },
  {
    id: 'conference-2024',
    type: 'image',
    category: 'conference',
    date: '2024-02-15',
    title: {
      fr: 'Sur scène lors d\'une conférence',
      en: 'On stage at a conference',
    },
    src: '/og-image.jpg',
  },
  // ── Press articles ────────────────────────────────────────────────
  {
    id: 'lebledparle-2022',
    type: 'document',
    category: 'press',
    date: '2022-03-07',
    title: {
      fr: 'Le Cameroun et la fondation Bill & Mélinda Gates s\'accordent sur la lutte contre le paludisme',
      en: 'Cameroon and the Bill & Melinda Gates Foundation agree on malaria fight',
    },
    url: 'https://www.lebledparle.com/le-cameroun-et-la-fondation-bill-melinda-gates-s-accordent-sur-la-lutte-contre-le-paludisme/',
    fileLabel: { fr: 'Article · Lebledparle', en: 'Article · Lebledparle' },
  },
  {
    id: 'stopblablacam-2022',
    type: 'document',
    category: 'press',
    date: '2022-03-07',
    title: {
      fr: 'Lutte contre le paludisme : le gouvernement et la fondation Bill & Melinda Gates s\'accordent',
      en: 'Malaria fight: government and Bill & Melinda Gates Foundation agree',
    },
    url: 'https://www.stopblablacam.com/societe/0703-8389-lutte-contre-le-paludisme-le-gouvernement-et-la-fondation-bill-melinda-gates-s-accordent',
    fileLabel: { fr: 'Article · StopBlaBlaCam', en: 'Article · StopBlaBlaCam' },
  },
  {
    id: 'minsante-2022',
    type: 'document',
    category: 'press',
    date: '2022-03-23',
    title: {
      fr: 'L\'élimination du paludisme au centre des échanges entre le Minsanté et la Fondation Gates',
      en: 'Malaria elimination at the center of exchanges between Minsante and Gates Foundation',
    },
    url: 'https://www.minsante.cm/site/?q=en%2Fnode%2F4224',
    fileLabel: { fr: 'Article · Minsante', en: 'Article · Minsante' },
  },
  {
    id: 'bluesquare-2026',
    type: 'document',
    category: 'press',
    date: '2026-03-31',
    title: {
      fr: 'Structurer l\'utilisation des données dans la lutte contre le paludisme au Burundi',
      en: 'Structuring data use in the fight against malaria in Burundi',
    },
    url: 'https://www.bluesquarehub.com/fr/bluesquare-news-structurer-lutilisation-des-donnees-dans-la-lutte-contre-le-paludisme-au-burundi/',
    fileLabel: { fr: 'Article · Bluesquare', en: 'Article · Bluesquare' },
  },
  {
    id: 'smc-alliance-2026',
    type: 'document',
    category: 'press',
    date: '2026-02-28',
    title: {
      fr: 'Présentations — Réunion annuelle conjointe SMC 2026',
      en: 'Presentations — Joint SMC Annual Meeting 2026',
    },
    url: 'https://www.smc-alliance.org/smc-resources/joint-smc-amp-annual-meetings-2026-presentations',
    fileLabel: { fr: 'Présentation · SMC Alliance', en: 'Presentation · SMC Alliance' },
  },
  // ── Community — Philanthropie ──────────────────────────────────────
  {
    id: 'philantropie-1',
    type: 'image',
    category: 'community',
    date: '2025-07-01',
    title: {
      fr: 'Philanthropie — Distribution de fournitures scolaires avec ONG Reel Concept & Plus',
      en: 'Philanthropy — School supplies distribution with ONG Reel Concept & Plus',
    },
    src: '/community/philantropie-1.jpeg',
  },
  {
    id: 'philantropie-2',
    type: 'image',
    category: 'community',
    date: '2025-07-01',
    title: {
      fr: 'Philanthropie — Aide aux enfants démunis avec ONG Reel Concept & Plus',
      en: 'Philanthropy — Helping underprivileged children with ONG Reel Concept & Plus',
    },
    src: '/community/philantropie-2.jpeg',
  },
  {
    id: 'philantropie-3',
    type: 'image',
    category: 'community',
    date: '2025-07-01',
    title: {
      fr: 'Philanthropie — Soutien scolaire communautaire',
      en: 'Philanthropy — Community education support',
    },
    src: '/community/philantropie-3.jpeg',
  },
  {
    id: 'philantropie-4',
    type: 'image',
    category: 'community',
    date: '2025-07-01',
    title: {
      fr: 'Philanthropie — Distribution de livres et fournitures',
      en: 'Philanthropy — Books and supplies distribution',
    },
    src: '/community/philantropie-4.jpeg',
  },
  {
    id: 'philantropie-5',
    type: 'image',
    category: 'community',
    date: '2025-07-01',
    title: {
      fr: 'Philanthropie — Équipe ONG Reel Concept & Plus et partenaires',
      en: 'Philanthropy — ONG Reel Concept & Plus team and partners',
    },
    src: '/community/philantropie-5.jpeg',
  },
  {
    id: 'philantropie-6',
    type: 'image',
    category: 'community',
    date: '2025-07-01',
    title: {
      fr: 'Philanthropie — Collaboration communautaire et solidarité',
      en: 'Philanthropy — Community collaboration and solidarity',
    },
    src: '/community/philantropie-6.jpeg',
  },
  {
    id: 'philantropie-7',
    type: 'image',
    category: 'community',
    date: '2025-07-01',
    title: {
      fr: 'Philanthropie — Enfants heureux avec leurs fournitures scolaires',
      en: 'Philanthropy — Happy children with school supplies',
    },
    src: '/community/philantropie-7.jpeg',
  },
  // ── Community — Nuit du Paludisme / Icône 360 ─────────────────────
  {
    id: 'nuit-paludisme-1',
    type: 'image',
    category: 'community',
    date: '2025-06-01',
    title: {
      fr: 'La Nuit du Paludisme — Gala Icône 360, portrait officiel',
      en: 'Malaria Night — Icône 360 gala, official portrait',
    },
    src: '/community/nuit-paludisme-1.jpeg',
  },
  {
    id: 'nuit-paludisme-2',
    type: 'image',
    category: 'community',
    date: '2025-06-01',
    title: {
      fr: 'La Nuit du Paludisme — Gala Icône 360, avec invités',
      en: 'Malaria Night — Icône 360 gala, with guests',
    },
    src: '/community/nuit-paludisme-2.jpeg',
  },
  {
    id: 'nuit-paludisme-3',
    type: 'image',
    category: 'community',
    date: '2025-06-01',
    title: {
      fr: 'La Nuit du Paludisme — Discours et/animations',
      en: 'Malaria Night — Speeches and presentations',
    },
    src: '/community/nuit-paludisme-3.jpeg',
  },
  {
    id: 'nuit-paludisme-4',
    type: 'image',
    category: 'community',
    date: '2025-06-01',
    title: {
      fr: 'La Nuit du Paludisme — Remise de prix Icône 360',
      en: 'Malaria Night — Icône 360 awards ceremony',
    },
    src: '/community/nuit-paludisme-4.jpeg',
  },
  {
    id: 'nuit-paludisme-5',
    type: 'image',
    category: 'community',
    date: '2025-06-01',
    title: {
      fr: 'Parrain de la lutte contre le paludisme — Attestation Icône 360 / Expertise France',
      en: 'Malaria fight godfather — Icône 360 / Expertise France attestation',
    },
    src: '/community/nuit-paludisme-5.jpeg',
  },
];
