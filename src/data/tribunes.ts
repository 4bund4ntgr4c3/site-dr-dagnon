import type { Lang } from '@/i18n/lang';

/* Hosted op-eds ("tribunes") — full reprints of articles Dr. Dagnon
   co-authored, with attribution to the original publication. Each entry is
   fully bilingual: the EN text is the original article, the FR text is the
   translation hosted here. The slug becomes the URL (/tribunes/<slug>). */

export type TribuneBlock = { kind: 'byline' | 'h2' | 'p' | 'quote'; text: string };

/** Taxonomies for filtering and the visual timeline. */
export type TribuneTheme = 'malaria' | 'public-health' | 'digital' | 'leadership';

export interface TribuneEntry {
  /** URL slug, must match /^[a-z0-9-]+$/ */
  slug: string;
  /** ISO date of the original publication */
  date: string;
  /** Topic the op-ed speaks to — shown as a filter pill and on the card. */
  theme: TribuneTheme;
  source: { name: string; url: string };
  title: Record<Lang, string>;
  description: Record<Lang, string>;
}

export const TRIBUNES: TribuneEntry[] = [
  {
    slug: 'from-malaria-control-to-elimination',
    date: '2026-05-01',
    theme: 'malaria',
    source: { name: 'Africa Health Watch', url: 'https://africahealthwatch.com/from-malaria-control-to-elimination-the-turn-we-need-to-make/' },
    title: {
      fr: 'Du contrôle du paludisme à l\'élimination : le virage à prendre',
      en: 'From Malaria Control to Elimination: The Turn We Need to Make',
    },
    description: {
      fr: 'Tribune de la Pr Rose Leke et du Dr Seynudé Dagnon : pourquoi le contrôle du paludisme ne suffit pas, et ce qu\'exige une élimination menée par les pays.',
      en: 'Op-ed by Professor Rose Leke and Dr. Seynudé Dagnon: why malaria control is not enough — and what country-led, community-centered elimination requires.',
    },
  },
];
