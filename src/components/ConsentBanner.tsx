import { useEffect, useState } from 'react';
import { useLang } from '@/i18n/useLang';
import { applyAnalyticsConsent, readAnalyticsConsent, saveAnalyticsConsent } from '@/lib/consent';

export function ConsentBanner() {
  const { lang } = useLang();
  const [visible, setVisible] = useState(() => readAnalyticsConsent() === null);

  useEffect(() => {
    const saved = readAnalyticsConsent();
    if (saved) applyAnalyticsConsent(saved);
  }, []);

  const grant = () => {
    saveAnalyticsConsent('granted');
    setVisible(false);
  };
  const deny = () => {
    saveAnalyticsConsent('denied');
    setVisible(false);
  };

  if (!visible) {
    return (
      <button
        type="button"
        onClick={() => setVisible(true)}
        className="fixed bottom-3 left-3 z-[80] rounded-full border border-pine-900/15 bg-white/95 px-3 py-2 text-[11px] font-semibold text-pine-900 shadow-sm backdrop-blur hover:border-gold-500"
      >
        {lang === 'fr' ? 'Gérer les cookies' : 'Manage cookies'}
      </button>
    );
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-[90] p-4">
      <div className="mx-auto flex max-w-3xl flex-col gap-3 rounded-2xl border border-pine-900/10 bg-white p-5 shadow-xl sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] leading-relaxed text-pine-900/80">
          {lang === 'fr'
            ? 'Avec votre accord, nous utilisons Google Analytics et Vercel Analytics pour mesurer l’audience et améliorer le site. Aucun stockage publicitaire n’est activé.'
            : 'With your permission, we use Google Analytics and Vercel Analytics to measure traffic and improve the site. Advertising storage is never enabled.'}
          <a href={lang === 'fr' ? '/fr/legal' : '/legal'} className="ml-1 underline decoration-gold-500/50 underline-offset-4 hover:text-gold-700">
            {lang === 'fr' ? 'En savoir plus' : 'Learn more'}
          </a>
        </p>
        <div className="flex shrink-0 gap-2">
          <button type="button" onClick={deny} className="rounded-full border border-pine-900/15 px-4 py-2 text-sm font-semibold text-pine-900 hover:bg-pine-50">
            {lang === 'fr' ? 'Refuser' : 'Decline'}
          </button>
          <button type="button" onClick={grant} className="rounded-full bg-pine-950 px-4 py-2 text-sm font-semibold text-gold-400 hover:bg-pine-900">
            {lang === 'fr' ? 'Accepter' : 'Accept'}
          </button>
        </div>
      </div>
    </div>
  );
}
