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
}

/* Intentionally empty until the first issue is actually sent: an archive
   that invents past issues is worse than one that shows none. The archive
   page falls back to a subscribe call-to-action. */
export const NEWSLETTER_ISSUES: NewsletterIssue[] = [];
