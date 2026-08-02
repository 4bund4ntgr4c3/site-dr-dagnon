import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from 'react';
import { Check, Monitor, Moon, Sun } from 'lucide-react';
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
  /* the meta theme-color follows the theme so mobile chrome matches the page */
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#0c2e2a' : '#f6f3ec');
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
      apply(m);
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
      if (e.key === 'Escape') {
        setOpen(false);
        ref.current?.querySelector<HTMLButtonElement>('button')?.focus();
      }
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

  const onOptionKey = (e: ReactKeyboardEvent<HTMLButtonElement>, i: number) => {
    const last = options.length - 1;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        focusOption(i + 1 > last ? 0 : i + 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        focusOption(i - 1 < 0 ? last : i - 1);
        break;
      case 'Home':
        e.preventDefault();
        focusOption(0);
        break;
      case 'End':
        e.preventDefault();
        focusOption(last);
        break;
    }
  };

  const focusOption = (i: number) => {
    const options = ref.current?.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]');
    options?.[i]?.focus();
  };

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
          e.preventDefault();
          setOpen(true);
          focusOption(e.key === 'ArrowDown' ? 0 : options.length - 1);
        }}
        aria-label={t['theme.label']}
        aria-haspopup="menu"
        aria-expanded={open}
        title={t['theme.label']}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-pine-100/85 backdrop-blur-sm transition-colors hover:text-gold-300"
      >
        {current.icon}
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 w-44 pt-2">
          <div
            role="menu"
            aria-label={t['theme.label']}
            className="overflow-hidden rounded-2xl border border-white/10 bg-pine-950/95 p-1.5 shadow-xl shadow-pine-950/40 backdrop-blur-md"
          >
            {options.map((o, i) => (
              <button
                key={o.mode}
                type="button"
                role="menuitemradio"
                aria-checked={o.mode === mode}
                onClick={() => select(o.mode)}
                onKeyDown={(e) => onOptionKey(e, i)}
                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                  o.mode === mode
                    ? 'bg-white/10 font-semibold text-ivory'
                    : 'text-pine-100/85 hover:bg-white/5 hover:text-gold-400'
                }`}
              >
                <span className={o.mode === mode ? 'text-gold-400' : 'text-pine-100/70'}>{o.icon}</span>
                <span className="flex-1 text-left">{o.label}</span>
                {o.mode === mode && <Check size={14} className="text-gold-400" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
