import { useEffect, useRef, useState } from 'react';
import { Reveal } from '@/components/Reveal';
import { useLang } from '@/i18n/useLang';
import { UI } from '@/i18n/translations';
import { STATS } from '@/data/site';

function Counter({ value, locale }: { value: number; locale: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);
  const reducedMotion =
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (inView) return;
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { rootMargin: '-40px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [inView]);

  useEffect(() => {
    if (!inView || !ref.current) return;
    if (reducedMotion) {
      ref.current.textContent = value.toLocaleString(locale);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const dur = 1800;
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      if (ref.current) ref.current.textContent = Math.round(ease(p) * value).toLocaleString(locale);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, locale, reducedMotion]);

  return <span ref={ref}>0</span>;
}

export function Stats() {
  const { lang } = useLang();
  const locale = UI[lang]['stats.locale'];

  return (
    <section id="stats" className="relative border-y border-gold-500/20 bg-pine-900">
      <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-white/5 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x lg:divide-y-0">
        {STATS[lang].map((s, i) => (
          <Reveal key={s.label} delay={i * 0.1} className="px-8 py-10 lg:py-12">
            <p className="font-display text-4xl font-semibold text-gold-400 gold-text lg:text-[2.75rem]">
              <Counter value={s.value} locale={locale} />
              {s.suffix}
            </p>
            <p className="mt-2 text-sm font-semibold text-ivory">{s.label}</p>
            <p className="mt-1.5 text-[12.5px] leading-snug text-pine-100/55">{s.detail}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
