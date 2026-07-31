import { useEffect, useState } from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useLang } from '@/i18n/useLang';
import { UI } from '@/i18n/translations';
import { track } from '@/lib/analytics';

type ThemeMode = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'theme';

const systemMedia = (): MediaQueryList | undefined =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-color-scheme: dark)')
    : undefined;

const prefersDark = () => systemMedia()?.matches ?? false;

const readMode = (): ThemeMode => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    /* storage unavailable — follow the system */
  }
  return 'system';
};

const apply = (mode: ThemeMode) => {
  const dark = mode === 'dark' || (mode === 'system' && prefersDark());
  document.documentElement.classList.toggle('dark', dark);
  document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    /* storage unavailable — the choice still applies for this visit */
  }
};

export function ThemeToggle() {
  const { lang } = useLang();
  const t = UI[lang];
  const [mode, setMode] = useState<ThemeMode>(() => (typeof document !== 'undefined' ? readMode() : 'system'));
  const [dark, setDark] = useState(() => typeof document !== 'undefined' && document.documentElement.classList.contains('dark'));

  useEffect(() => {
    const sync = () => {
      const m = readMode();
      setMode(m);
      setDark(m === 'dark' || (m === 'system' && prefersDark()));
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) sync();
    };
    const onSystemTheme = () => {
      if (readMode() === 'system') sync();
    };
    const mq = systemMedia();
    window.addEventListener('storage', onStorage);
    mq?.addEventListener('change', onSystemTheme);
    return () => {
      window.removeEventListener('storage', onStorage);
      mq?.removeEventListener('change', onSystemTheme);
    };
  }, []);

  const toggle = () => {
    const next: ThemeMode = mode === 'light' ? 'dark' : mode === 'dark' ? 'system' : dark ? 'light' : 'dark';
    apply(next);
    setMode(next);
    setDark(next === 'dark' || (next === 'system' && prefersDark()));
    track('theme_change', { event_category: 'engagement', event_label: next });
  };

  const label = mode === 'dark' ? t['theme.toSystem'] : dark ? t['theme.toLight'] : t['theme.toDark'];
  const icon =
    mode === 'dark' ? <Monitor size={16} /> : dark ? <Sun size={16} /> : <Moon size={16} />;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-pine-100/85 backdrop-blur-sm transition-colors hover:text-gold-300"
    >
      {icon}
    </button>
  );
}
