import { localePath } from '@/i18n/routing';
import type { Lang } from '@/i18n/lang';

/** Nav target for a section id, in the current language.
 *  Section ids that are not pages resolve to a hash on the home page. */
export function navHref(lang: Lang, id: string): string {
  if (id === 'contact') return localePath(lang, '/contact');
  if (id === 'medias') return localePath(lang, '/media');
  if (id === 'publications') return localePath(lang, '/publications');
  if (id === 'tribunes') return localePath(lang, '/tribunes');
  if (id === 'agenda') return localePath(lang, '/agenda');
  return `${localePath(lang, '/')}#${id}`;
}
