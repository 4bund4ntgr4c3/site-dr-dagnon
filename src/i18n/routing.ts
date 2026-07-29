import type { Lang } from './lang';

/* Each language has its own URL, which is what makes the hreflang tags
   meaningful. English keeps the bare paths so every already-indexed URL
   (and every existing backlink) still resolves; French is served under /fr.

     /              ↔ /fr
     /contact       ↔ /fr/contact
     /media/press   ↔ /fr/media/press                                   */

export const DEFAULT_LANG: Lang = 'en';

const PREFIX: Record<Lang, string> = { en: '', fr: '/fr' };

/** '/fr/media/press' → { lang: 'fr', path: '/media/press' } */
export function splitPath(pathname: string): { lang: Lang; path: string } {
  if (pathname === '/fr' || pathname.startsWith('/fr/')) {
    return { lang: 'fr', path: pathname.slice(3) || '/' };
  }
  return { lang: DEFAULT_LANG, path: pathname || '/' };
}

/** ('fr', '/contact') → '/fr/contact' — the inverse of splitPath. */
export function localePath(lang: Lang, path: string): string {
  const suffix = path === '/' ? '' : path;
  return `${PREFIX[lang]}${suffix}` || '/';
}

/** Should a first-time visitor on an unprefixed URL be sent to /fr?
 *
 *  Pure on purpose: this is the one piece of the language handling that can
 *  bounce a visitor between two URLs, so it is unit-tested rather than
 *  trusted. Every guard here exists to prevent a loop or to let an explicit
 *  choice win.
 *
 *  @param currentLang    language of the URL being viewed
 *  @param storedChoice   language the visitor picked before, if any
 *  @param languageTags   navigator.languages
 *  @param alreadyChecked whether this page load already ran the check
 */
export function shouldRedirectToFrench(
  currentLang: Lang,
  storedChoice: Lang | null,
  languageTags: readonly string[],
  alreadyChecked = false,
): boolean {
  if (alreadyChecked) return false;
  if (currentLang !== DEFAULT_LANG) return false; /* already on /fr */
  if (storedChoice) return false; /* the visitor has decided; respect it */
  return (languageTags[0] || '').toLowerCase().startsWith('fr');
}
