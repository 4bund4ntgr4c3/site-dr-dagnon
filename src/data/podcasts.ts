import type { Lang } from '@/i18n/lang';

export interface PodcastItem {
  id: string;
  type: 'podcast' | 'interview' | 'tribune-audio';
  date: string;
  title: Record<Lang, string>;
  description: Record<Lang, string>;
  host: Record<Lang, string>;
  duration?: string;
  audioSrc?: string;
  audioBytes?: number;
  youtubeId?: string;
  youtubeUrl?: string;
  thumb?: string;
  articleSlug?: string;
  featured?: boolean;
}

export const PODCAST_EPISODES: PodcastItem[] = [
  {
    id: 'podcast-ndep-ep5',
    type: 'podcast',
    date: '2026-08-25',
    title: {
      fr: 'Podcast Ndëp (Épisode 5) — L’espoir dans la lutte contre le paludisme',
      en: 'Ndëp Podcast (Episode 5) — Hope in the fight against malaria',
    },
    description: {
      fr: 'Entretien approfondi avec le Dr. Seynudé Jean-Fortuné Dagnon sur les défis, les financements et les leviers d’élimination du paludisme en Afrique.',
      en: 'In-depth conversation with Dr. Seynudé Jean-Fortuné Dagnon on challenges, health financing, and elimination pathways for malaria across Africa.',
    },
    host: {
      fr: 'Podcast Ndëp',
      en: 'Ndëp Podcast',
    },
    duration: '31:29',
    audioSrc: '/podcast-ndep-ep5.mp3',
    audioBytes: 22675437,
    youtubeId: 'IenUdkxFqNE',
    youtubeUrl: 'https://www.youtube.com/watch?v=IenUdkxFqNE',
    thumb: 'https://img.youtube.com/vi/IenUdkxFqNE/hqdefault.jpg',
    featured: true,
  },
  {
    id: 'interview-health-financing',
    type: 'interview',
    date: '2026-06-17',
    title: {
      fr: 'Interview — Financement de la santé et lutte contre le paludisme',
      en: 'Interview — Health financing and malaria control',
    },
    description: {
      fr: 'Entretien sur le financement durable des programmes de santé et la place de l’économie de la santé dans les politiques africaines.',
      en: 'Interview on sustainable health program financing and the role of health economics in African health policies.',
    },
    host: {
      fr: 'Santé Publique & Économie',
      en: 'Public Health & Economics',
    },
    duration: '18:45',
    youtubeId: '5yh0ODmp47s',
    youtubeUrl: 'https://www.youtube.com/watch?v=5yh0ODmp47s',
    thumb: 'https://img.youtube.com/vi/5yh0ODmp47s/hqdefault.jpg',
  },
  {
    id: 'canal3-benin-2022',
    type: 'interview',
    date: '2023-01-26',
    title: {
      fr: 'Canal 3 Bénin — Lutte antipaludique et santé publique',
      en: 'Canal 3 Benin — Malaria control and public health',
    },
    description: {
      fr: 'Entretien télévisé sur les programmes de santé publique, le suivi entomologique et la distribution de moustiquaires au Bénin.',
      en: 'TV interview on public health programs, entomological monitoring, and bed net distribution in Benin.',
    },
    host: {
      fr: 'Canal 3 Bénin',
      en: 'Canal 3 Benin',
    },
    duration: '14:20',
    youtubeId: 'JmhHzsW9bVs',
    youtubeUrl: 'https://www.youtube.com/watch?v=JmhHzsW9bVs',
    thumb: 'https://img.youtube.com/vi/JmhHzsW9bVs/hqdefault.jpg',
  },
];
