import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useLang } from '@/i18n/useLang';
import { UI } from '@/i18n/translations';
import { track } from '@/lib/analytics';

const apply = (dark: boolean) => {
  document.documentElement.classList.toggle('dark', dark);
  document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
  try {
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  } catch {
    /* storage unavailable — the choice still applies for this visit */
  }
};

export function ThemeToggle() {
  const { lang } = useLang();
  const t = UI[lang];
  const [dark, setDark] = useState(() => typeof document !== 'undefined' && document.documentElement.classList.contains('dark'));

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'theme') setDark(e.newValue === 'dark');
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    apply(next);
    track('theme_change', { event_category: 'engagement', event_label: next ? 'dark' : 'light' });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? t['theme.toLight'] : t['theme.toDark']}
      title={dark ? t['theme.toLight'] : t['theme.toDark']}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-pine-100/85 backdrop-blur-sm transition-colors hover:text-gold-300"
    >
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
