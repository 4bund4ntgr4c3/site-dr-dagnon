import { SectionHeading } from '@/components/SectionHeading';
import { Reveal } from '@/components/Reveal';
import { useLang } from '@/i18n/LanguageContext';
import { EXPERIENCE, UI } from '@/i18n/translations';

export function Experience() {
  const { lang } = useLang();
  const t = UI[lang];

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
                      className={`ml-10 w-full rounded-2xl border bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-pine-900/10 md:ml-0 ${
                        job.current ? 'border-gold-500/60 ring-1 ring-gold-500/30' : 'border-pine-900/10'
                      }`}
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
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
