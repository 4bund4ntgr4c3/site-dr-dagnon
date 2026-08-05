import type { Lang } from '@/i18n/lang';

/* Past newsletter issues, newest first. Each entry is fully bilingual and
   links out to the issue (a hosted email archive, a PDF, a post…). */

export interface NewsletterIssue {
  id: string;
  /** ISO date of publication, yyyy-mm-dd */
  date: string;
  title: Record<Lang, string>;
  summary: Record<Lang, string>;
  link: string;
  /** Longer readable extract of the issue, shown inline on the archive page. */
  excerpt?: Record<Lang, string>;
}

/* Intentionally empty until the first issue is actually sent: an archive
   that invents past issues is worse than one that shows none. The archive
   page falls back to a subscribe call-to-action. */
export const NEWSLETTER_ISSUES: NewsletterIssue[] = [];

/* ── Newsletter sections (rubriques) ────────────────────────────────
   Subscribers can choose which sections they want to receive. Each
   section maps to a content kind in the digest sender. The "all"
   checkbox selects or deselects every section at once. */

export type NewsletterSection = 'publications' | 'tribunes' | 'agenda' | 'projets';

export interface NewsletterSectionDef {
  id: NewsletterSection;
  label: Record<Lang, string>;
  description: Record<Lang, string>;
}

export const NEWSLETTER_SECTIONS: NewsletterSectionDef[] = [
  {
    id: 'publications',
    label: { fr: 'Publications', en: 'Publications' },
    description: {
      fr: 'Nouvelles publications scientifiques indexées.',
      en: 'New indexed scientific publications.',
    },
  },
  {
    id: 'tribunes',
    label: { fr: 'Tribunes & analyses', en: 'Op-eds & analyses' },
    description: {
      fr: 'Tribunes hébergées et analyses sur le paludisme.',
      en: 'Hosted op-eds and malaria analyses.',
    },
  },
  {
    id: 'agenda',
    label: { fr: 'Agenda & événements', en: 'Agenda & events' },
    description: {
      fr: 'Conférences, panels et engagements à venir.',
      en: 'Conferences, panels and upcoming engagements.',
    },
  },
  {
    id: 'projets',
    label: { fr: 'Projets & études de cas', en: 'Projects & case studies' },
    description: {
      fr: 'Études de cas avec résultats mesurables.',
      en: 'Case studies with measurable results.',
    },
  },
];

/** All section ids — used to validate and as default selection. */
export const ALL_SECTIONS: NewsletterSection[] = NEWSLETTER_SECTIONS.map((s) => s.id);
