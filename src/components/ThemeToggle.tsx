import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Check, ChevronDown, Monitor, Moon, Sun } from 'lucide-react';
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
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sync = () => {
      const m = readMode();
      setMode(m);
      setOpen(false);
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

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const options: { mode: ThemeMode; label: string; icon: ReactNode }[] = [
    { mode: 'system', label: t['theme.mode.system'], icon: <Monitor size={15} /> },
    { mode: 'light', label: t['theme.mode.light'], icon: <Sun size={15} /> },
    { mode: 'dark', label: t['theme.mode.dark'], icon: <Moon size={15} /> },
  ];
  const current = options.find((o) => o.mode === mode)!;

  const select = (m: ThemeMode) => {
    apply(m);
    setMode(m);
    setOpen(false);
    track('theme_change', { event_category: 'engagement', event_label: m });
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t['theme.label']}
        aria-haspopup="menu"
        aria-expanded={open}
        title={t['theme.label']}
        className="flex h-9 items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2.5 text-pine-100/85 backdrop-blur-sm transition-colors hover:text-gold-300"
      >
        {current.icon}
        <ChevronDown size={13} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div
          role="menu"
          aria-label={t['theme.label']}
          className="absolute right-0 top-full z-50 mt-2 w-44 rounded-xl border border-pine-900/15 bg-white p-1 shadow-xl shadow-pine-950/20"
        >
          {options.map((o) => (
            <button
              key={o.mode}
              type="button"
              role="menuitemradio"
              aria-checked={o.mode === mode}
              onClick={() => select(o.mode)}
              className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                o.mode === mode
                  ? 'bg-pine-900/5 font-semibold text-pine-900'
                  : 'text-pine-900/75 hover:bg-pine-900/5 hover:text-pine-900'
              }`}
            >
              <span className={o.mode === mode ? 'text-gold-600' : 'text-pine-900/60'}>{o.icon}</span>
              <span className="flex-1 text-left">{o.label}</span>
              {o.mode === mode && <Check size={14} className="text-gold-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
