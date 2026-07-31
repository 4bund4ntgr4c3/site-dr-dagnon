import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { ArrowUp } from 'lucide-react';
import { useLang } from '@/i18n/useLang';
import { UI } from '@/i18n/translations';

export function ScrollToTop() {
  const { lang } = useLang();
  const t = UI[lang];
  const { pathname, hash } = useLocation();
  const [visible, setVisible] = useState(false);

  // scroll to the hash target on navigation; otherwise to top
  useEffect(() => {
    if (hash) {
      const id = hash.slice(1);
      /* the target section may not exist yet — the Home chunk is lazy-loaded
         and the sections render after it resolves — so retry for a while */
      let tries = 0;
      let cancelled = false;
      const attempt = () => {
        if (cancelled) return;
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (tries++ < 20) {
          window.setTimeout(attempt, 50);
        }
      };
      attempt();
      return () => {
        cancelled = true;
      };
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, hash]);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toTop = () =>
    window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label={t['scrollToTop']}
      className={`fixed bottom-5 right-5 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-gold-500 text-pine-950 shadow-lg shadow-gold-600/30 backdrop-blur transition-all duration-300 hover:bg-gold-400 hover:-translate-y-0.5 ${
        visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-3 pointer-events-none'
      }`}
    >
      <ArrowUp size={18} />
    </button>
  );
}
