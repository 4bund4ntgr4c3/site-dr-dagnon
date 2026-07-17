import { useLang, SUPPORTED, type Lang } from '@/i18n/LanguageContext';
import { UI } from '@/i18n/translations';

export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { lang, setLang } = useLang();

  return (
    <div
      className={`inline-flex items-center rounded-full border border-white/15 bg-white/5 p-0.5 backdrop-blur-sm ${className}`}
      role="group"
      aria-label={UI[lang]['lang.label']}
    >
      {SUPPORTED.map((l: Lang) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors ${
            lang === l
              ? 'bg-gold-500 text-pine-950'
              : 'text-pine-100/75 hover:text-gold-300'
          }`}
        >
          {UI[lang][`lang.${l}`]}
        </button>
      ))}
    </div>
  );
}
