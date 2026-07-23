import { useRef, useState } from 'react';
import { Trophy, Award, X, Quote } from 'lucide-react';
import { SectionHeading } from '@/components/SectionHeading';
import { Reveal } from '@/components/Reveal';
import { useLang } from '@/i18n/useLang';
import { ACHIEVEMENTS, AWARDS, PORTFOLIO, UI } from '@/i18n/translations';
import { useFocusTrap } from '@/hooks/useFocusTrap';

export function Achievements() {
  const { lang } = useLang();
  const t = UI[lang];
  const [showAwards, setShowAwards] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useFocusTrap(modalRef, closeRef, showAwards, () => setShowAwards(false));

  return (
    <section id="realisations" className="relative overflow-hidden bg-pine-900 py-24 lg:py-32">
      <div className="absolute inset-0 texture-dots opacity-50" />
      <div className="absolute -right-40 -top-24 h-[420px] w-[420px] rounded-full bg-gold-600/10 blur-[110px]" />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          dark
          eyebrow={t['achievements.eyebrow']}
          title={t['achievements.title']}
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ACHIEVEMENTS[lang].map((a, i) => {
            const isAwards = i === 3;
            return (
              <Reveal key={a.title} delay={i * 0.09}>
                <div
                  className={`group flex h-full flex-col rounded-2xl p-7 backdrop-blur transition-all duration-300 hover:-translate-y-1.5 ${
                    isAwards
                      ? 'border border-pine-900/10 bg-white hover:border-gold-500/40 hover:shadow-lg hover:shadow-gold-500/10'
                      : 'border border-white/10 bg-pine-950/60 hover:border-gold-500/40'
                  }`}
                  onClick={isAwards ? () => setShowAwards(true) : undefined}
                  onKeyDown={isAwards ? (e) => { if (e.key === 'Enter' || e.key === ' ') setShowAwards(true); } : undefined}
                  role={isAwards ? 'button' : undefined}
                  tabIndex={isAwards ? 0 : undefined}
                >
                  <div className="flex items-center gap-3">
                    <p className={`font-display text-[1.9rem] font-semibold leading-none ${isAwards ? 'text-gold-600' : 'text-gold-400'}`}>
                      {a.metric}
                    </p>
                    {isAwards && (
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-500/15 text-gold-600 transition-transform duration-300 group-hover:scale-110">
                        <Award size={16} />
                      </span>
                    )}
                  </div>
                  <h3 className={`mt-4 flex items-start gap-2 font-display text-lg font-semibold leading-snug ${isAwards ? 'text-pine-900' : 'text-ivory'}`}>
                    {a.title}
                  </h3>
                  <p className={`mt-3 flex-1 text-[13px] leading-relaxed ${isAwards ? 'text-ink/65' : 'text-pine-100/60'}`}>{a.text}</p>
                  {isAwards && (
                    <span className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-semibold text-gold-600 transition-colors group-hover:text-gold-500">
                      {lang === 'fr' ? 'Voir la liste complète' : 'View full list'} →
                    </span>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-14 rounded-2xl border border-gold-500/25 bg-gradient-to-r from-pine-950/80 to-pine-900/80 p-8 backdrop-blur lg:p-10">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-500 text-pine-950">
                <Trophy size={19} />
              </span>
              <h3 className="font-display text-xl font-semibold text-ivory">
                {t['achievements.portfolioTitle']}
              </h3>
            </div>
            <p className="mt-3 max-w-3xl text-[13.5px] leading-relaxed text-pine-100/60">
              {t['achievements.portfolioText']}
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {PORTFOLIO[lang].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[12.5px] font-medium text-pine-100/85 transition-colors hover:border-gold-500/50 hover:text-gold-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      {/* awards modal */}
      {showAwards && (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-pine-950/80 p-4 pt-20 pb-20 backdrop-blur-sm"
          onClick={() => setShowAwards(false)}
          role="dialog"
          aria-modal="true"
          aria-label={lang === 'fr' ? 'Distinctions et prix' : 'Awards & Honors'}
        >
          <div
            ref={modalRef}
            className="modal-scroll relative w-full max-w-3xl overflow-y-auto rounded-3xl border border-pine-900/10 bg-white shadow-2xl"
            style={{ maxHeight: '80vh' } as React.CSSProperties}
            onClick={(e) => e.stopPropagation()}
          >
            {/* header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-pine-900/10 bg-white/95 px-8 py-5 backdrop-blur">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-500 text-pine-950">
                  <Award size={19} />
                </span>
                <h2 className="font-display text-xl font-semibold text-pine-950">
                  {lang === 'fr' ? 'Distinctions et prix' : 'Awards & Honors'}
                </h2>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setShowAwards(false)}
                aria-label={t['media.close']}
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

                <div className="space-y-8">
                  {AWARDS[lang].map((award, i) => (
                    <div key={i} className="relative flex gap-5">
                      {/* dot */}
                      <div className="relative z-10 mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-gold-500/60 bg-white">
                        <span className="text-[11px] font-bold text-gold-600">{award.year.slice(2)}</span>
                      </div>
                      {/* content */}
                      <div className="flex-1 rounded-2xl border border-pine-900/10 bg-ivory p-5 transition-colors hover:border-gold-500/40 hover:shadow-md hover:shadow-pine-900/5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-gold-500/15 px-2.5 py-0.5 text-[11px] font-bold text-gold-700">
                            {award.year}
                          </span>
                          <h3 className="font-display text-[15px] font-semibold text-pine-900">
                            {award.title}
                          </h3>
                        </div>
                        <p className="mt-2 text-[13px] leading-relaxed text-ink/65">
                          {award.description}
                        </p>
                        {award.quote && (
                          <div className="mt-3 rounded-xl border border-gold-500/25 bg-gold-500/10 p-4">
                            <div className="flex items-start gap-2">
                              <Quote size={14} className="mt-0.5 shrink-0 text-gold-500/50" />
                              <p className="text-[12.5px] italic leading-relaxed text-gold-700/80">
                                {award.quote}
                              </p>
                            </div>
                          </div>
                        )}
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
