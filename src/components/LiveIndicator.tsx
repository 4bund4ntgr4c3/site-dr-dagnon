import { useEffect, useState } from 'react';
import { Activity, RefreshCw } from 'lucide-react';
import { useLang } from '@/i18n/useLang';

export function LiveIndicator({ source = 'WHO WMR' }: { source?: string }) {
  const { lang } = useLang();
  const [tick, setTick] = useState(0);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => {
      setTick((t) => t + 1);
      setNow(new Date());
    }, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-40" aria-hidden="true" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
        {lang === 'fr' ? 'Live' : 'Live'} · {source}
      </span>
      <span className="hidden items-center gap-1 text-[11px] text-pine-900/55 sm:inline-flex">
        <RefreshCw size={11} className={tick > 0 ? 'animate-spin' : ''} />
        {now.toLocaleTimeString(lang === 'fr' ? 'fr-FR' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
      </span>
      <span className="hidden text-[11px] text-pine-900/40 sm:inline">
        <Activity size={11} className="inline mr-1" />
        {lang === 'fr' ? 'actualisation auto 60s' : 'auto-refresh 60s'}
      </span>
    </div>
  );
}
