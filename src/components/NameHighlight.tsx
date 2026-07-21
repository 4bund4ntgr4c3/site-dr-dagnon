import { useLang } from '@/i18n/useLang';
import { UI } from '@/i18n/translations';

export function NameHighlight({ className }: { className?: string }) {
  const { lang } = useLang();
  const t = UI[lang];
  const parts = t['hero.name'].split(' ');
  const idx = parts.findIndex((w) => w.toUpperCase().startsWith('DAGNON'));

  return (
    <>
      {parts.map((w, i) =>
        i === idx ? (
          <span key={i} className={className ?? 'text-gold-400 italic'}>
            {w}
            {i === parts.length - 1 ? '' : ' '}
          </span>
        ) : (
          <span key={i}>
            {w}
            {i === parts.length - 1 ? '' : ' '}
          </span>
        ),
      )}
    </>
  );
}
