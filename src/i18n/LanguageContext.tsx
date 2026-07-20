import { useEffect, useState, type ReactNode } from 'react';
import { LangContext, detectLang } from './useLang';
import type { Lang } from './lang';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectLang);

  useEffect(() => {
    window.localStorage.setItem('site-lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: Lang) => setLangState(l);
  const toggle = () => setLangState((prev) => (prev === 'fr' ? 'en' : 'fr'));

  return (
    <LangContext.Provider value={{ lang, setLang, toggle }}>{children}</LangContext.Provider>
  );
}
