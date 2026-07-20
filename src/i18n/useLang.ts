import { createContext, useContext } from 'react';
import type { Lang } from './lang';

export interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
}

export const LangContext = createContext<LangContextValue | null>(null);

const STORAGE_KEY = 'site-lang';

export function detectLang(): Lang {
  if (typeof window === 'undefined') return 'en';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'fr' || stored === 'en') return stored;
  const nav = window.navigator.language || '';
  const base = nav.slice(0, 2).toLowerCase();
  if (base === 'fr') return 'fr';
  return 'en';
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
}
