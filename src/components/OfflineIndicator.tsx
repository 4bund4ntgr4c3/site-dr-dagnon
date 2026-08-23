import { useEffect, useState } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { useLang } from '@/i18n/useLang';

export function OfflineIndicator() {
  const { lang } = useLang();
  const [online, setOnline] = useState(() => (typeof navigator !== 'undefined' ? navigator.onLine : true));
  const [show, setShow] = useState(false);

  useEffect(() => {
    const on = () => { setOnline(true); setShow(true); setTimeout(() => setShow(false), 2500); };
    const off = () => { setOnline(false); setShow(true); };
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  if (!show) return null;

  return (
    <div className={`fixed bottom-4 left-1/2 z-[70] -translate-x-1/2 rounded-full px-4 py-2 text-sm font-semibold shadow-lg transition-all ${online ? 'bg-emerald-600 text-white' : 'bg-pine-950 text-gold-300 border border-gold-500/30'}`}>
      <span className="inline-flex items-center gap-2">
        {online ? <Wifi size={14} /> : <WifiOff size={14} />}
        {online ? (lang === 'fr' ? 'De retour en ligne' : 'Back online') : (lang === 'fr' ? 'Mode hors-ligne — contenu en cache' : 'Offline — cached content')}
      </span>
    </div>
  );
}
