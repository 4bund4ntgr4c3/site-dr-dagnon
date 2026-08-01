import { useEffect, useRef } from 'react';
import { animate, useInView } from 'framer-motion';
import { Reveal } from '@/components/Reveal';
import { useLang } from '@/i18n/useLang';
import { UI } from '@/i18n/translations';
import { STATS } from '@/data/site';

function Counter({ value, locale }: { value: number; locale: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const controls = animate(0, value, {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        if (ref.current) {
          ref.current.textContent = Math.round(v).toLocaleString(locale);
        }
      },
    });
    return () => controls.stop();
  }, [inView, value, locale]);

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
