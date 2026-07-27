import { useState, useRef } from 'react';
import { GraduationCap, X } from 'lucide-react';
import { SectionHeading } from '@/components/SectionHeading';
import { Reveal } from '@/components/Reveal';
import { useLang } from '@/i18n/useLang';
import { EDUCATION, TRAINING_LIST, UI } from '@/i18n/translations';
import { useFocusTrap } from '@/hooks/useFocusTrap';

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
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-pine-950/80 p-4 pt-20 pb-20 backdrop-blur-sm"
          onClick={() => setShowTraining(false)}
          role="dialog"
          aria-modal="true"
          aria-label={lang === 'fr' ? 'Éducation et autres formations' : 'Education and other training'}
        >
          <div
            ref={modalRef}
            className="modal-scroll relative w-full max-w-3xl overflow-y-auto rounded-3xl border border-pine-900/10 bg-white shadow-2xl"
            style={{ maxHeight: '80vh' } as React.CSSProperties}
            onClick={(e) => e.stopPropagation()}
          >
            {/* header */}
            <div className="sticky top-0 z-20 flex items-center justify-between border-b border-pine-900/10 bg-white/95 px-8 py-5 backdrop-blur">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-500 text-pine-950">
                  <GraduationCap size={19} />
                </span>
                <h2 className="font-display text-xl font-semibold text-pine-950">
                  {lang === 'fr' ? 'Éducation et autres formations' : 'Education and other training'}
                </h2>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setShowTraining(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-pine-900/15 text-pine-900/60 transition-colors hover:bg-pine-900/5 hover:text-pine-900"
              >
                <X size={18} />
              </button>
            </div>

            {/* timeline */}
            <div className="p-8">
              <div className="relative">
                {/* vertical line */}
                <div className="absolute bottom-4 left-[19px] top-4 w-px bg-gradient-to-b from-gold-500 via-gold-500/30 to-transparent" />

                <div className="space-y-6">
                  {TRAINING_LIST[lang].map((item, i) => (
                    <div key={i} className="relative flex gap-5">
                      {/* dot */}
                      <div className="relative z-10 mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-gold-500/60 bg-white">
                        <span className="text-[11px] font-bold text-gold-600">{i + 1}</span>
                      </div>
                      {/* content */}
                      <div className="flex-1 rounded-2xl border border-pine-900/10 bg-ivory p-5 transition-colors hover:border-gold-500/40 hover:shadow-md hover:shadow-pine-900/5">
                        <span className="inline-block rounded-full bg-pine-900/5 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-pine-800">
                          {item.date}
                        </span>
                        <h3 className="mt-3 font-display text-[15px] font-semibold leading-snug text-pine-950">
                          {item.institution}
                        </h3>
                        <p className="mt-2 text-[13px] leading-relaxed text-ink/65">
                          {item.detail}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
