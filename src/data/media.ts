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
  {
    id: 'pamca-2022',
    type: 'video',
    category: 'conference',
    date: '2022-11-14',
    title: {
      fr: 'Discours d’ouverture — 8e conférence PAMCA',
      en: 'Opening keynote — 8th PAMCA conference',
    },
    youtubeId: 'ZTW9HqJ57kA',
    thumb: 'https://img.youtube.com/vi/ZTW9HqJ57kA/hqdefault.jpg',
  },
  {
    id: 'cs4me-2022',
    type: 'video',
    category: 'interview',
    date: '2022-09-10',
    title: {
      fr: 'Keynote — Société civile pour l’élimination du paludisme',
      en: 'Keynote — Civil society for malaria elimination',
    },
    youtubeId: 'ZjznHt_dAaU',
    thumb: 'https://img.youtube.com/vi/ZjznHt_dAaU/hqdefault.jpg',
  },
  {
    id: 'astmh-2022',
    type: 'video',
    category: 'conference',
    date: '2022-11-01',
    title: {
      fr: 'Présentation — ASTMH',
      en: 'Talk — American Society of Tropical Medicine & Hygiene',
    },
    youtubeId: 'skmrswZhGZE',
    thumb: 'https://img.youtube.com/vi/skmrswZhGZE/hqdefault.jpg',
  },
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
      fr: 'Tribune — Du contrôle à l’élimination du paludisme',
      en: 'Op-ed — From malaria control to elimination',
    },
    url: 'https://www.africahealthwatch.com/p/from-malaria-control-to-elimination',
    fileLabel: { fr: 'Article · Africa Health Watch', en: 'Article · Africa Health Watch' },
  },
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
      fr: 'Sur scène lors d’une conférence',
      en: 'On stage at a conference',
    },
    src: '/og-image.jpg',
  },
];
