import { useState } from 'react';
import { GraduationCap, X, ChevronRight } from 'lucide-react';
import { SectionHeading } from '@/components/SectionHeading';
import { Reveal } from '@/components/Reveal';
import { useLang } from '@/i18n/useLang';
import { EDUCATION, TRAINING_LIST, UI } from '@/i18n/translations';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useRef } from 'react';

export function Education() {
  const { lang } = useLang();
  const t = UI[lang];
  const [showTraining, setShowTraining] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useFocusTrap(modalRef, closeRef, showTraining, () => setShowTraining(false));

  return (
    <section id="formation" className="bg-ivory py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow={t['education.eyebrow']}
          title={t['education.title']}
        />

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {EDUCATION[lang].map((e, i) => {
            const isTraining = i === 4;
            return (
              <Reveal key={e.degree} delay={i * 0.08} className={i === 0 ? 'md:col-span-2 lg:col-span-1' : ''}>
                <button
                  type="button"
                  onClick={isTraining ? () => setShowTraining(true) : undefined}
                  className={`group relative h-full w-full text-left overflow-hidden rounded-2xl border border-pine-900/10 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/50 hover:shadow-lg hover:shadow-pine-900/10 ${isTraining ? 'cursor-pointer' : ''}`}
                >
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
                    {isTraining && (
                      <span className="mt-4 inline-flex items-center gap-1 text-[12px] font-semibold text-gold-600 transition-colors group-hover:text-gold-500">
                        {lang === 'fr' ? 'Voir les formations' : 'View trainings'}
                        <ChevronRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                      </span>
                    )}
                  </div>
                </button>
              </Reveal>
            );
          })}

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

      {/* training modal */}
      {showTraining && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-pine-950/70 backdrop-blur-sm" onClick={() => setShowTraining(false)} />
          <div
            ref={modalRef}
            className="relative flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl shadow-pine-950/30 animate-in fade-in zoom-in-95 duration-200"
          >
            {/* header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-pine-900 via-pine-950 to-pine-900 px-6 py-6 sm:px-8">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold-500/15 blur-3xl" />
              <div className="absolute -left-8 bottom-0 h-32 w-32 rounded-full bg-gold-600/10 blur-2xl" />
              <div className="relative flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gold-500/20 text-gold-400 ring-1 ring-gold-500/30">
                    <GraduationCap size={22} />
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-white sm:text-2xl">
                      {lang === 'fr' ? 'Éducation et autres formations' : 'Education and other training'}
                    </h3>
                    <p className="mt-1 text-[12.5px] text-pine-200/60">
                      {lang === 'fr'
                        ? `${TRAINING_LIST[lang].length} formations`
                        : `${TRAINING_LIST[lang].length} trainings`}
                    </p>
                  </div>
                </div>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={() => setShowTraining(false)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 sm:px-8">
              <ol className="relative ml-3 border-l-2 border-gold-200/60 pl-6">
                {TRAINING_LIST[lang].map((item, i) => (
                  <li key={i} className="relative pb-5 last:pb-0">
                    <span className="absolute -left-[31px] flex h-5 w-5 items-center justify-center rounded-full border-2 border-gold-400 bg-white text-[10px] font-bold text-gold-600">
                      {i + 1}
                    </span>
                    <p className="text-[13px] leading-relaxed text-ink/70">{item}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
