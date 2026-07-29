import { createContext, useContext } from 'react';
import type { Lang } from './lang';

export interface LangContextValue {
  lang: Lang;
  /** Navigates to the current page in the requested language. */
  setLang: (l: Lang) => void;
  toggle: () => void;
}

export const LangContext = createContext<LangContextValue | null>(null);

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
}
