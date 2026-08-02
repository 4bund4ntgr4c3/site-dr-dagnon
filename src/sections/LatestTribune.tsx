import { Link } from 'react-router';
import { ArrowRight, Newspaper } from 'lucide-react';
import { SectionHeading } from '@/components/SectionHeading';
import { Reveal } from '@/components/Reveal';
import { useLang } from '@/i18n/useLang';
import { UI } from '@/i18n/translations';
import { localePath } from '@/i18n/routing';
import { TRIBUNES } from '@/data/tribunes';

/* The most recent hosted op-ed, so the homepage always surfaces fresh
   analysis without having to touch the layout when a new one ships. */

const parts = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return { y, m, d };
};

export function LatestTribune() {
  const { lang } = useLang();
  const t = UI[lang];
  const latest = [...TRIBUNES].sort((a, b) => b.date.localeCompare(a.date))[0];

  if (!latest) return null;

  const { y, m, d } = parts(latest.date);
  const dateLabel = new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(y, m - 1, d));

  return (
    <section className="bg-ivory py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <SectionHeading
          eyebrow={t['home.latestTribune.eyebrow']}
          title={t['home.latestTribune.title']}
          intro={t['tribunesPage.intro']}
        />

        <Reveal delay={0.1}>
          <Link
            to={localePath(lang, `/tribunes/${latest.slug}`)}
            className="group mt-10 block rounded-3xl border border-pine-900/10 bg-white p-8 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/40 hover:shadow-card-hover sm:p-10"
          >
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-pine-950">
                <Newspaper size={12} />
                {t['home.latestTribune.tag']}
              </span>
              <span className="text-[12.5px] font-medium text-pine-900/60">
                {dateLabel} · {latest.source.name}
              </span>
            </div>
            <h3 className="mt-5 max-w-3xl font-display text-2xl leading-tight font-semibold text-pine-950 transition-colors group-hover:text-gold-700 sm:text-3xl">
              {latest.title[lang]}
            </h3>
            <p className="mt-3 max-w-3xl text-[14.5px] leading-relaxed text-ink/75">{latest.description[lang]}</p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold-700 transition-colors group-hover:text-gold-500">
              {t['tribunesPage.read']}
              <ArrowRight size={15} />
            </span>
          </Link>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-6 text-center">
            <Link
              to={localePath(lang, '/tribunes')}
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-pine-900/70 transition-colors hover:text-gold-700"
            >
              {t['tribunesPage.back']}
              <ArrowRight size={14} />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
