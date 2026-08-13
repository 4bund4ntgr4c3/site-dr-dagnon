import { Mic, Presentation, Mic2, Newspaper, Heart } from 'lucide-react';
import type { MediaCategory, MediaType } from '@/data/media';

/* ── Category metadata ──────────────────────────────────────────── */

export interface MediaCategoryMeta {
  key: MediaCategory;
  icon: typeof Mic;
  color: string;
  bg: string;
  ring: string;
  badge: string;
  thumb: string;
  descKey: string;
}

export const CATEGORIES: MediaCategoryMeta[] = [
  {
    key: 'interview',
    icon: Mic,
    color: 'from-pine-600 to-pine-800',
    bg: 'bg-pine-700',
    ring: 'ring-pine-500/40',
    badge: 'bg-pine-100 text-pine-700',
    thumb: 'https://img.youtube.com/vi/5yh0ODmp47s/hqdefault.jpg',
    descKey: 'mediaPage.catDescInterview',
  },
  {
    key: 'conference',
    icon: Presentation,
    color: 'from-gold-600 to-gold-800',
    bg: 'bg-gold-700',
    ring: 'ring-gold-500/40',
    badge: 'bg-gold-100 text-gold-700',
    thumb: 'https://img.youtube.com/vi/D8kTMA4dDyg/hqdefault.jpg',
    descKey: 'mediaPage.catDescConference',
  },
  {
    key: 'speaking',
    icon: Mic2,
    color: 'from-emerald-600 to-emerald-800',
    bg: 'bg-emerald-700',
    ring: 'ring-emerald-500/40',
    badge: 'bg-emerald-100 text-emerald-700',
    thumb: 'https://img.youtube.com/vi/ZTW9HqJ57kA/hqdefault.jpg',
    descKey: 'mediaPage.catDescSpeaking',
  },
  {
    key: 'press',
    icon: Newspaper,
    color: 'from-rose-600 to-rose-800',
    bg: 'bg-rose-700',
    ring: 'ring-rose-500/40',
    badge: 'bg-rose-100 text-rose-700',
    thumb: '',
    descKey: 'mediaPage.catDescPress',
  },
  {
    key: 'community',
    icon: Heart,
    color: 'from-purple-600 to-purple-800',
    bg: 'bg-purple-700',
    ring: 'ring-purple-500/40',
    badge: 'bg-purple-100 text-purple-700',
    thumb: '/community/nuit-paludisme-1-thumb.webp',
    descKey: 'mediaPage.catDescCommunity',
  },
];

export const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map((c) => [c.key, c]),
) as Record<MediaCategory, MediaCategoryMeta>;

export const TYPE_FILTERS: { value: MediaType | 'all'; key: string }[] = [
  { value: 'all', key: 'mediaPage.all' },
  { value: 'video', key: 'mediaPage.typeVideo' },
  { value: 'image', key: 'mediaPage.typeImage' },
  { value: 'document', key: 'mediaPage.typeDocument' },
];

/** 'interview' → 'mediaPage.catInterview' — the category label translation key */
export const catLabelKey = (key: MediaCategory) =>
  `mediaPage.cat${key.charAt(0).toUpperCase() + key.slice(1)}`;
