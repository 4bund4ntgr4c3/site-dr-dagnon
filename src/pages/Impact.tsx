import { Link } from 'react-router';
import { TrendingUp, ArrowUpRight, BarChart3, Award } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { useLang } from '@/i18n/useLang';
import { UI } from '@/i18n/translations';
import { localePath } from '@/i18n/routing';
import { IMPACT_STATS, IMPACT_RESULTS } from '@/data/impact';

export default function Impact() {
  const { lang } = useLang();
  const t = UI[lang];

  return (
    <main id="main-content" className="min-h-screen">
      <section className="relative overflow-hidden bg-pine-950">
        <div className="absolute inset-0 texture-net" />
        <div className="absolute -top-40 -right-40 h-[560px] w-[560px] rounded-full bg-pine-600/25 blur-[130px]" />
        <div className="absolute bottom-0 -left-40 h-[460px] w-[460px] rounded-full bg-gold-600/12 blur-[120px]" />

        <div className="relative mx-auto max-w-4xl px-5 pb-24 pt-32 lg:px-8 lg:pt-36">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-300">
              <TrendingUp size={13} />
              {t['impactPage.badge']}
            </span>
            <h1 className="mt-7 font-display text-[2.6rem] leading-[1.05] font-medium text-pine-100 sm:text-6xl lg:text-[4.4rem]">
              {t['impactPage.title']}
            </h1>
            <p className="mt-4 max-w-2xl font-display text-lg italic text-pine-200/90 sm:text-xl">
              {t['impactPage.intro']}
            </p>
          </Reveal>
        </div>
      </section>

      {/* key figures */}
      <section className="relative border-y border-gold-500/20 bg-pine-900">
        <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-white/5 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
          {IMPACT_STATS[lang].map((s, i) => (
            <Reveal key={s.value} delay={i * 0.08}>
              <div className="flex h-full flex-col justify-center px-6 py-10 text-center lg:px-8">
                <p className="font-display text-4xl font-semibold text-gold-400 gold-text lg:text-[2.75rem]">
                  {s.value}
                </p>
                <p className="mt-2 text-[12.5px] font-semibold uppercase tracking-wider text-pine-100/80">
                  {s.label[lang]}
                </p>
                <p className="mt-1.5 text-[12px] leading-relaxed text-pine-100/50">{s.detail[lang]}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* results */}
      <section className="bg-ivory py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-pine-600">
              <BarChart3 size={14} />
              {t['impactPage.resultsEyebrow']}
            </p>
            <h2 className="mt-3 font-display text-3xl font-medium leading-tight text-pine-950 sm:text-4xl">
              {t['impactPage.resultsTitle']}
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {IMPACT_RESULTS[lang].map((r, i) => {
              const inner = (
                <>
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-gold-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-pine-950">
                      {r.metric}
                    </span>
                    <Award size={18} className="shrink-0 text-gold-500" />
                  </div>
                  <h3 className="mt-4 font-display text-[1.15rem] font-semibold leading-snug text-pine-950 transition-colors group-hover:text-gold-700">
                    {r.title[lang]}
                  </h3>
                  <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-ink/75">{r.text[lang]}</p>
                  {r.href && (
                    <span className="mt-5 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-gold-700 transition-colors group-hover:text-gold-500">
                      {t['impactPage.readStudy']}
                      <ArrowUpRight size={14} />
                    </span>
                  )}
                </>
              );
              const classes =
                'group flex h-full flex-col rounded-2xl border border-pine-900/10 bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/40 hover:shadow-card-hover';
              return (
                <Reveal key={r.id} delay={0.1 + i * 0.08}>
                  {r.href ? (
                    <Link to={localePath(lang, r.href)} className={classes}>
                      {inner}
                    </Link>
                  ) : (
                    <div className={classes}>{inner}</div>
                  )}
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={0.4}>
            <div className="mt-12 text-center">
              <Link
                to={localePath(lang, '/projets')}
                className="inline-flex items-center gap-2 rounded-full bg-pine-950 px-7 py-3.5 text-sm font-semibold text-gold-400 transition-all hover:-translate-y-0.5 hover:bg-pine-900"
              >
                {t['impactPage.allStudies']}
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
