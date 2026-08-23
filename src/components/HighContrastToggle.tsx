import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { useLang } from '@/i18n/useLang';
import { track } from '@/lib/analytics';

const KEY = 'high-contrast';

export function HighContrastToggle() {
  const { lang } = useLang();
  const [on, setOn] = useState(() => {
    try { return localStorage.getItem(KEY) === '1'; } catch { return false; }
  });

  useEffect(() => {
    document.documentElement.classList.toggle('high-contrast', on);
    try { localStorage.setItem(KEY, on ? '1' : '0'); } catch (_e) { void _e; }
    track('high_contrast', { event_category: 'a11y', event_label: on ? 'on' : 'off' });
  }, [on]);

  useEffect(() => {
    try { if (localStorage.getItem(KEY) === '1') document.documentElement.classList.add('high-contrast'); } catch (_e) { void _e; }
  }, []);

  return (
    <button
      type="button"
      onClick={() => setOn((v) => !v)}
      aria-pressed={on}
      aria-label={lang === 'fr' ? 'Contraste élevé' : 'High contrast'}
      title={lang === 'fr' ? 'Contraste élevé' : 'High contrast'}
      className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm transition-colors ${on ? 'border-gold-500 bg-gold-500 text-pine-950' : 'border-white/15 bg-white/5 text-pine-100/85 hover:text-gold-300'}`}
    >
      <Eye size={16} />
    </button>
  );
}
