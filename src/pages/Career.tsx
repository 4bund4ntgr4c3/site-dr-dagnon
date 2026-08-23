import { Award, Briefcase, GraduationCap } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { CareerTimeline } from '@/components/CareerTimeline';
import { useLang } from '@/i18n/useLang';
import { Link } from 'react-router';
import { localePath } from '@/i18n/routing';

export default function Career() {
  const { lang } = useLang();

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen">
      <section className="relative overflow-hidden bg-pine-950">
        <div className="absolute inset-0 texture-net" />
        <div className="absolute -top-40 -right-40 h-[560px] w-[560px] rounded-full bg-pine-600/25 blur-[130px]" />
        <div className="absolute bottom-0 -left-40 h-[460px] w-[460px] rounded-full bg-gold-600/12 blur-[120px]" />
        <div className="relative mx-auto max-w-4xl px-5 pb-24 pt-32 lg:px-8 lg:pt-36">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-300">
              <Briefcase size={13} />
              {lang === 'fr' ? 'Parcours' : 'Career'}
            </span>
            <h1 className="mt-7 font-display text-[2.6rem] leading-[1.05] font-medium text-pine-100 sm:text-6xl lg:text-[4.4rem]">
              {lang === 'fr' ? '17 ans au service de la santé publique' : '17 years in public health'}
            </h1>
            <p className="mt-4 max-w-2xl font-display text-lg italic text-pine-200/90 sm:text-xl">
              {lang === 'fr'
                ? 'De la surveillance épidémiologique aux investissements de la Fondation Gates — une frise interactive.'
                : 'From epidemiological surveillance to Gates Foundation investments — an interactive timeline.'}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-ivory py-12 lg:py-16">
        <div className="mx-auto max-w-4xl px-5 lg:px-8">
          <Reveal>
            <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-gold-500/20 bg-gold-500/10 p-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-pine-950 text-gold-400">
                <Award size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-pine-950">
                  {lang === 'fr' ? 'Distinction PMI 2020 — 27 pays' : 'PMI 2020 award — 27 countries'}
                </p>
                <p className="text-xs text-pine-900/70">
                  {lang === 'fr' ? 'FSN Employee of the Year, U.S. President’s Malaria Initiative' : 'FSN Employee of the Year, U.S. President’s Malaria Initiative'}
                </p>
              </div>
              <GraduationCap size={18} className="hidden text-gold-600 sm:block" />
            </div>
          </Reveal>

          <div className="mt-8">
            <Reveal>
              <CareerTimeline />
            </Reveal>
          </div>

          <Reveal>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link to={localePath(lang, '/cv')} className="inline-flex items-center gap-2 rounded-full bg-pine-950 px-6 py-3 text-sm font-semibold text-gold-400 hover:bg-pine-900">
                {lang === 'fr' ? 'Voir le CV complet' : 'View full CV'}
              </Link>
              <Link to={localePath(lang, '/portfolio')} className="inline-flex items-center gap-2 rounded-full border border-pine-900/15 bg-white px-6 py-3 text-sm font-semibold text-pine-900 hover:border-gold-500/30">
                Portfolio
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
