import { GraduationCap } from 'lucide-react';
import { SectionHeading } from '@/components/SectionHeading';
import { Reveal } from '@/components/Reveal';
import { useLang } from '@/i18n/LanguageContext';
import { EDUCATION, UI } from '@/i18n/translations';

export function Education() {
  const { lang } = useLang();
  const t = UI[lang];

  return (
    <section id="formation" className="bg-ivory py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow={t['education.eyebrow']}
          title={t['education.title']}
        />

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {EDUCATION[lang].map((e, i) => (
            <Reveal key={e.degree} delay={i * 0.08} className={i === 0 ? 'md:col-span-2 lg:col-span-1' : ''}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-pine-900/10 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/50 hover:shadow-lg hover:shadow-pine-900/10">
                <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-gold-500/10 transition-transform duration-500 group-hover:scale-[2.2]" />
                <div className="relative">
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-pine-900 text-gold-400 transition-colors group-hover:bg-gold-500 group-hover:text-pine-950">
                      <GraduationCap size={20} />
                    </span>
                    <span className="rounded-full bg-gold-500/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-gold-700">
                      {e.tag}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-lg font-semibold leading-snug text-pine-950">
                    {e.degree}
                  </h3>
                  <p className="mt-1.5 text-sm font-semibold text-gold-700">{e.school}</p>
                  <p className="mt-3 text-[13px] leading-relaxed text-ink/60">{e.detail}</p>
                </div>
              </div>
            </Reveal>
          ))}

          {/* languages card */}
          <Reveal delay={0.4}>
              <div className="flex h-full flex-col justify-center rounded-2xl bg-pine-950 p-7 text-ivory">
               <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-400">{t['education.langTitle']}</p>
               <ul className="mt-5 space-y-4">
                 {[
                   ['fr', 100],
                   ['en', 85],
                   ['de', 30],
                   ['es', 30],
                 ].map(([code, pct]) => {
                   const langKey = code as 'fr' | 'en' | 'de' | 'es';
                   return (
                   <li key={langKey}>
                     <div className="flex items-baseline justify-between text-sm">
                       <span className="font-semibold">{t[`education.lang.${langKey}`]}</span>
                       <span className="text-[11.5px] text-pine-100/55">{t[`education.level.${langKey}`]}</span>
                     </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-gold-600 to-gold-400"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </li>
                   );
                 })}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
