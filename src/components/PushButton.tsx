import { useEffect, useState } from 'react';
import { Bell, BellOff, Loader2 } from 'lucide-react';
import { useLang } from '@/i18n/useLang';
import { UI } from '@/i18n/translations';
import {
  pushSupported,
  getPushSubscription,
  subscribeToPush,
  unsubscribeFromPush,
} from '@/lib/push';

type PushState = 'checking' | 'off' | 'on' | 'unsupported' | 'denied' | 'busy' | 'error';

/* Notification toggle: reflects the real browser subscription on mount,
   flips it on click. Renders inline inside the newsletter page's
   subscription card. */
export function PushButton() {
  const { lang } = useLang();
  const t = UI[lang];
  const [state, setState] = useState<PushState>('checking');

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!pushSupported()) {
        if (alive) setState('unsupported');
        return;
      }
      const sub = await getPushSubscription().catch(() => null);
      if (!alive) return;
      if (sub) setState('on');
      else if (typeof Notification !== 'undefined' && Notification.permission === 'denied') setState('denied');
      else setState('off');
    })();
    return () => {
      alive = false;
    };
  }, []);

  const toggle = async () => {
    if (state === 'busy') return;
    setState('busy');
    const result = state === 'on' ? await unsubscribeFromPush() : await subscribeToPush();
    if (result.ok) setState(state === 'on' ? 'off' : 'on');
    else setState(result.reason === 'denied' ? 'denied' : result.reason === 'unsupported' ? 'unsupported' : 'error');
  };

  const disabled = state === 'checking' || state === 'busy' || state === 'unsupported';

  return (
    <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="flex items-center gap-2 text-sm font-semibold text-pine-900">
          {state === 'on' ? <Bell size={15} className="text-gold-600" /> : <BellOff size={15} className="text-pine-900/50" />}
          {t['push.title']}
        </p>
        <p className="mt-1 text-[12.5px] leading-relaxed text-pine-900/65">
          {state === 'denied'
            ? t['push.denied']
            : state === 'unsupported'
              ? t['push.unsupported']
              : state === 'error'
                ? t['push.error']
                : t['push.text']}
        </p>
      </div>
      <button
        type="button"
        onClick={toggle}
        disabled={disabled}
        aria-pressed={state === 'on'}
        className={`inline-flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-[12.5px] font-semibold transition-all disabled:opacity-50 ${
          state === 'on'
            ? 'border border-gold-500/50 text-gold-700 hover:bg-gold-500/10'
            : 'bg-pine-950 text-gold-400 hover:-translate-y-0.5 hover:bg-pine-900'
        }`}
      >
        {state === 'checking' || state === 'busy' ? (
          <Loader2 size={14} className="animate-spin" />
        ) : state === 'on' ? (
          <BellOff size={14} />
        ) : (
          <Bell size={14} />
        )}
        {state === 'on' ? t['push.off'] : t['push.on']}
      </button>
    </div>
  );
}
