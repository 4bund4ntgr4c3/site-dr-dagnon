import { useRef, useState } from 'react';
import { X, Briefcase, Target, Award, ChevronRight } from 'lucide-react';
import { SectionHeading } from '@/components/SectionHeading';
import { Reveal } from '@/components/Reveal';
import { useLang } from '@/i18n/useLang';
import { EXPERIENCE, UI } from '@/i18n/translations';
import { useFocusTrap } from '@/hooks/useFocusTrap';

type ExperienceItem = (typeof EXPERIENCE)['fr'][number];

export function Experience() {
  const { lang } = useLang();
  const t = UI[lang];
  const [active, setActive] = useState<ExperienceItem | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useFocusTrap(modalRef, closeRef, !!active, () => setActive(null));

  return (
    <section id="parcours" className="bg-ivory py-24 lg:py-32">
      <div className="mx-auto max-w-5xl px-5 lg:px-8">
        <SectionHeading
          eyebrow={t['experience.eyebrow']}
          title={t['experience.title']}
        />

        <div className="relative mt-16">
          {/* vertical line */}
          <div className="absolute bottom-2 left-[15px] top-2 w-px bg-gradient-to-b from-gold-500 via-pine-300 to-pine-200 md:left-1/2" />

          <div className="space-y-10">
            {EXPERIENCE[lang].map((job, i) => {
              const left = i % 2 === 0;
              return (
                <Reveal key={job.role} delay={0.05}>
                  <div className={`relative flex md:w-1/2 ${left ? 'md:pr-14' : 'md:ml-auto md:pl-14'}`}>
                    {/* node */}
                    <span
                      className={`absolute left-[8px] top-7 z-10 flex h-4 w-4 items-center justify-center rounded-full border-2 ${
                        job.current
                          ? 'border-gold-500 bg-gold-400 shadow-[0_0_0_5px_rgba(201,162,75,0.25)]'
                          : 'border-pine-500 bg-ivory'
                      } md:left-auto ${left ? 'md:-right-2' : 'md:-left-2'}`}
                    />
                    <div
                      onClick={() => setActive(job)}
                      className={`ml-10 w-full cursor-pointer rounded-2xl border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-pine-900/10 md:ml-0 ${
                        job.current ? 'border-gold-500/60 ring-1 ring-gold-500/30' : 'border-pine-900/10 hover:border-gold-500/40'
                      }`}
                      role="button"
                      tabIndex={0}
                      aria-label={`${job.role} — ${job.org}`}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActive(job); }}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${
                            job.current
                              ? 'bg-gold-500 text-pine-950'
                              : 'bg-pine-900/5 text-pine-800'
                          }`}
                        >
                          {job.period}
                        </span>
                        {job.current && (
                          <span className="rounded-full bg-pine-900 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-gold-400">
                            {t['experience.current']}
                          </span>
                        )}
                      </div>
                      <h3 className="mt-3.5 font-display text-[1.3rem] font-semibold leading-snug text-pine-950">
                        {job.role}
                      </h3>
                      <p className="mt-1 text-sm font-semibold text-gold-700">{job.org}</p>
                      <p className="mt-3 text-[13.5px] leading-relaxed text-ink/65">{job.text}</p>
                      <div className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-gold-700 transition-colors hover:text-gold-500">
                        {t['experience.details']} <ChevronRight size={14} />
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>

      {/* detail modal */}
      {active && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-pine-950/80 p-4 backdrop-blur-sm"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
          aria-label={active.role}
        >
          <div
            ref={modalRef}
            className="modal-scroll relative max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-pine-900/10 bg-white shadow-2xl"
            style={{
              scrollbarGutter: 'stable',
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(201,162,75,0.35) transparent',
            } as React.CSSProperties}
            onClick={(e) => e.stopPropagation()}
          >
            {/* sticky top bar */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-pine-900/10 bg-white/95 px-8 py-4 backdrop-blur">
              <span className={`inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${
                active.current ? 'bg-gold-500 text-pine-950' : 'bg-pine-900/5 text-pine-800'
              }`}>
                {active.period}
              </span>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setActive(null)}
                aria-label={t['media.close']}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-pine-900/15 text-pine-900/60 transition-colors hover:bg-pine-900 hover:text-ivory"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-8 pr-10">
            {/* header */}
            <div className="pr-12">
              <h2 className="font-display text-2xl font-semibold leading-snug text-pine-950 sm:text-[1.7rem]">
                {active.role}
              </h2>
              <p className="mt-1 text-base font-semibold text-gold-700">{active.org}</p>
            </div>

            {/* responsibilities */}
            <div className="mt-8">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-pine-900/75">
                <Briefcase size={16} className="text-gold-500" />
                {t['experience.responsibilities']}
              </div>
              <ul className="mt-4 space-y-3">
                {active.details.responsibilities.map((r, i) => (
                  <li key={i} className="flex gap-3 text-[14px] leading-relaxed text-ink/70">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            {/* projects */}
            {active.details.projects && active.details.projects.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-pine-900/75">
                  <Target size={16} className="text-gold-500" />
                  {t['experience.projects']}
                </div>
                <div className="mt-4 space-y-3">
                  {active.details.projects.map((p, i) => (
                    <div key={i} className="flex items-start justify-between gap-4 rounded-xl border border-pine-900/10 bg-ivory/60 p-4">
                      <div>
                        <p className="text-[13.5px] font-semibold text-pine-900">{p.name}</p>
                        <p className="text-[12px] text-ink/70">{p.scope}</p>
                      </div>
                      <span className="shrink-0 rounded-full bg-pine-900 px-2.5 py-0.5 text-[11px] font-bold text-gold-400">
                        {p.budget}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* achievement */}
            {active.details.achievement && (
              <div className="mt-8 rounded-xl border border-gold-500/30 bg-gold-500/10 p-5">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gold-700">
                  <Award size={16} />
                  {t['experience.achievement']}
                </div>
                <p className="mt-2 text-[14px] leading-relaxed text-ink/70">{active.details.achievement}</p>
              </div>
            )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
