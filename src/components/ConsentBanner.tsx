import { useEffect, useState } from 'react';
import { useLang } from '@/i18n/useLang';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const KEY = 'consent-analytics';

export function ConsentBanner() {
  const { lang } = useLang();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(KEY);
    if (!saved) setVisible(true);
    else if (saved === 'granted') {
      window.gtag?.('consent', 'update', {
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
        analytics_storage: 'granted',
      });
    }
  }, []);

  if (!visible) return null;

  const grant = () => {
    localStorage.setItem(KEY, 'granted');
    window.gtag?.('consent', 'update', {
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
      analytics_storage: 'granted',
    });
    setVisible(false);
  };
  const deny = () => {
    localStorage.setItem(KEY, 'denied');
    setVisible(false);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-[90] p-4">
      <div className="mx-auto flex max-w-3xl flex-col gap-3 rounded-2xl border border-pine-900/10 bg-white p-5 shadow-xl sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] leading-relaxed text-pine-900/80">
          {lang === 'fr'
            ? 'Nous utilisons une mesure d’audience anonymisée (Google Analytics, Vercel Analytics) pour améliorer le site. Acceptez-vous ?'
            : 'We use anonymized analytics (Google Analytics, Vercel Analytics) to improve the site. Do you accept?'}
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
