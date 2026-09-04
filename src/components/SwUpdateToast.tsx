import { useEffect, useState } from 'react';
import { RefreshCw, X } from 'lucide-react';
import { useLang } from '@/i18n/useLang';
import { UI } from '@/i18n/translations';

/* A new worker waits until the visitor explicitly accepts the refresh. */
export function SwUpdateToast() {
  const { lang } = useLang();
  const t = UI[lang];
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [waiting, setWaiting] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    let disposed = false;
    navigator.serviceWorker?.getRegistration().then((reg) => {
      if (disposed || !reg) return;
      if (reg.waiting && navigator.serviceWorker.controller) {
        setWaiting(reg.waiting);
        setUpdateAvailable(true);
      }
      reg.addEventListener('updatefound', () => {
        const worker = reg.installing;
        if (!worker) return;
        worker.addEventListener('statechange', () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) {
            setWaiting(reg.waiting || worker);
            setUpdateAvailable(true);
          }
        });
      });
    });
    return () => {
      disposed = true;
    };
  }, []);

  if (!updateAvailable) return null;

  const reload = () => {
    let reloading = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (reloading) return;
      reloading = true;
      window.location.reload();
    });
    waiting?.postMessage({ type: 'SKIP_WAITING' });
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-5 right-5 z-[80] flex max-w-sm items-center gap-4 rounded-2xl border border-gold-500/40 bg-pine-950 p-4 pr-3 text-pine-100 shadow-2xl"
    >
      <p className="text-sm leading-snug">{t['sw.update.message']}</p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={reload}
          className="inline-flex items-center gap-1.5 rounded-full bg-gold-500 px-3.5 py-2 text-[12.5px] font-semibold text-pine-950 transition-colors hover:bg-gold-400"
        >
          <RefreshCw size={13} />
          {t['sw.update.action']}
        </button>
        <button
          type="button"
          onClick={() => setUpdateAvailable(false)}
          aria-label={t['sw.update.dismiss']}
          className="rounded-full p-2 text-pine-300 transition-colors hover:bg-pine-900 hover:text-pine-100"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
