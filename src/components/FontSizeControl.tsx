import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { useLang } from '@/i18n/useLang';
import { UI } from '@/i18n/translations';
import { track } from '@/lib/analytics';

/* Reading-mode text size: scales the root font-size (so every rem-based
   measurement follows) and persists the choice. Clamped between 0.9x and
   1.25x so the layout cannot break — the browser zoom is deliberately not
   used, it would fight the fixed-ratio OG screenshots and grid columns. */

const STORAGE_KEY = 'reader-scale';
const MIN = 0.9;
const MAX = 1.25;
const STEP = 0.1;

const readScale = (): number => {
  try {
    const saved = Number.parseFloat(localStorage.getItem(STORAGE_KEY) ?? '');
    if (Number.isFinite(saved) && saved >= MIN && saved <= MAX) return saved;
  } catch {
    /* storage unavailable — default size */
  }
  return 1;
};

const applyScale = (scale: number) => {
  document.documentElement.style.fontSize = `${16 * scale}px`;
  try {
    localStorage.setItem(STORAGE_KEY, String(scale));
  } catch {
    /* storage unavailable — the choice still applies for this visit */
  }
};

export function FontSizeControl({ dark = false }: { dark?: boolean }) {
  const { lang } = useLang();
  const t = UI[lang];
  const [scale, setScale] = useState<number>(() => (typeof document !== 'undefined' ? readScale() : 1));

  const change = (delta: number) => {
    const next = Math.min(MAX, Math.max(MIN, Math.round((scale + delta) * 100) / 100));
    setScale(next);
    applyScale(next);
    track('font_size', { event_category: 'engagement', event_label: `${next}x` });
  };

  const tone = dark ? 'text-pine-100/80 hover:text-gold-300' : 'text-pine-900/60 hover:text-gold-700';
  const border = dark ? 'border-white/15 bg-white/5' : 'border-pine-900/15 bg-white';
  const atMin = scale <= MIN;
  const atMax = scale >= MAX;

  return (
    <div
      role="group"
      aria-label={t['article.fontSize']}
      className={`inline-flex items-center gap-1 rounded-full border ${border} p-1`}
    >
      <button
        type="button"
        disabled={atMin}
        onClick={() => change(-STEP)}
        aria-label={t['article.fontSizeSmaller']}
        title={t['article.fontSizeSmaller']}
        className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors disabled:opacity-30 ${tone}`}
      >
        <Minus size={14} />
      </button>
      <span className={`select-none text-[11px] font-bold tabular-nums ${dark ? 'text-pine-100/60' : 'text-pine-900/50'}`}>
        {scale === 1 ? 100 : Math.round(scale * 100)}%
      </span>
      <button
        type="button"
        disabled={atMax}
        onClick={() => change(STEP)}
        aria-label={t['article.fontSizeLarger']}
        title={t['article.fontSizeLarger']}
        className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors disabled:opacity-30 ${tone}`}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
