import type { Lang } from '@/i18n/lang';

export type MediaType = 'video' | 'image' | 'document';
export type MediaCategory = 'interview' | 'conference' | 'research' | 'publication' | 'press';

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
];
