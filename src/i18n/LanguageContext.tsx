import { useEffect, useMemo, useRef, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { LangContext, type LangContextValue } from './useLang';
import { localePath, shouldRedirectToFrench, splitPath } from './routing';
import type { Lang } from './lang';

/* The URL is the single source of truth for the language: /fr/* is French,
   everything else English. Switching language is a navigation, so the choice
   is shareable, bookmarkable and crawlable — which is what makes the hreflang
   tags mean something. */

const CHOICE_KEY = 'site-lang';

const readChoice = (): Lang | null => {
  try {
    const stored = window.localStorage.getItem(CHOICE_KEY);
    return stored === 'fr' || stored === 'en' ? stored : null;
  } catch {
    return null; /* private mode, blocked storage — just skip */
  }
};

const rememberChoice = (lang: Lang) => {
  try {
    window.localStorage.setItem(CHOICE_KEY, lang);
  } catch {
    /* not worth failing a navigation over */
  }
};

const languageTags = () =>
  navigator.languages?.length ? navigator.languages : [navigator.language];

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { lang, path } = splitPath(pathname);
  const redirectChecked = useRef(false);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  /* First landing only: send a French-speaking visitor to the French URL.
     Deliberately narrow — it runs once per page load, never when the visitor
     has already picked a language, and never on a /fr URL. Without those
     guards, clicking EN from /fr would bounce straight back to /fr.

     Note this is against Google's advice on language-based redirection: it can
     stop a crawler from reaching every version. The hreflang tags and the
     visible switcher are what keep both versions discoverable. Delete this
     effect to go back to "the URL always wins". */
  useEffect(() => {
    const redirect = shouldRedirectToFrench(lang, readChoice(), languageTags(), redirectChecked.current);
    redirectChecked.current = true;
    if (redirect) navigate(localePath('fr', path) + window.location.search + window.location.hash, { replace: true });
  }, [lang, path, navigate]);

  const value = useMemo<LangContextValue>(() => {
    const go = (target: Lang) => {
      /* record the choice even when it changes nothing, so the redirect above
         stops second-guessing a visitor who is already where they want to be */
      rememberChoice(target);
      if (target === lang) return;
      navigate(localePath(target, path) + window.location.search + window.location.hash);
    };
    return { lang, setLang: go, toggle: () => go(lang === 'fr' ? 'en' : 'fr') };
  }, [lang, path, navigate]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}
