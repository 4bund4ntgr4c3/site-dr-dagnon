import { useMemo } from 'react';
import { Link } from 'react-router';
import { ArrowUpRight, ArrowRight, Heart, Sparkles, Quote } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { MEDIA_ITEMS } from '@/data/media';
import { PHILANTHROPIC_INITIATIVES, PHILANTHROPIC_STATS } from '@/data/philanthropy';
import { localePath } from '@/i18n/routing';
import { CATEGORIES, catLabelKey } from './categories';
import { ALBUM_COVERS, type T } from './helpers';

/* LANDING PAGE — Philanthropic showcase + Category cards */

export function MediaLanding({ lang, t }: { lang: 'fr' | 'en'; t: T }) {
  const catCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    MEDIA_ITEMS.forEach((m) => {
      counts[m.category] = (counts[m.category] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <div className="space-y-16">
      {/* ── Philanthropic Impact Spotlight ────────────────────────────── */}
      <Reveal>
        <section
          aria-labelledby="philanthropy-heading"
          className="relative overflow-hidden rounded-3xl border border-gold-500/30 bg-gradient-to-br from-pine-950 via-pine-900 to-pine-950 p-6 sm:p-8 lg:p-12 text-pine-100 shadow-2xl"
        >
          {/* Subtle textured backdrops */}
          <div className="absolute inset-0 texture-net opacity-20 pointer-events-none" />
          <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-gold-500/15 blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-purple-600/15 blur-[100px] pointer-events-none" />

          <div className="relative z-10">
            {/* Eyebrow badge */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-gold-400/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-300">
                <Heart size={13} className="text-gold-400 fill-gold-400" />
                {t['mediaLanding.philanthropyBadge'] || 'Philanthropie & Actions de terrain'}
              </span>

              <Link
                to={localePath(lang, '/media/community')}
                className="group inline-flex items-center gap-2 rounded-full bg-gold-500 px-5 py-2 text-xs font-semibold text-pine-950 shadow-md transition-all duration-300 hover:bg-gold-400 hover:shadow-lg hover:-translate-y-0.5"
              >
                <span>{t['mediaLanding.philanthropyCta'] || 'Découvrir toutes les œuvres'}</span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Title & Introduction */}
            <div className="mt-6 max-w-3xl">
              <h2
                id="philanthropy-heading"
                className="font-display text-2xl font-medium sm:text-3xl lg:text-4xl text-white leading-tight"
              >
                {t['mediaLanding.philanthropyTitle']}
              </h2>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-pine-200/90">
                {t['mediaLanding.philanthropyIntro']}
              </p>
            </div>

            {/* Quote strip */}
            <div className="mt-6 rounded-2xl border border-gold-500/20 bg-pine-900/60 p-4 sm:p-5 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <Quote size={20} className="shrink-0 text-gold-400 mt-0.5" />
                <blockquote className="text-xs sm:text-sm italic text-pine-200/90 leading-relaxed font-display">
                  {t['mediaLanding.philanthropyQuote']}
                </blockquote>
              </div>
            </div>

            {/* Metric counters */}
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 border-y border-pine-800/80 py-6">
              {PHILANTHROPIC_STATS.map((stat, idx) => (
                <div key={idx} className="flex flex-col">
                  <span className="font-display text-2xl sm:text-3xl font-bold text-gold-300">
                    {stat.value}
                  </span>
                  <span className="mt-1 text-xs text-pine-300/85 leading-snug">
                    {stat.label[lang]}
                  </span>
                </div>
              ))}
            </div>

            {/* 3 Featured Initiative Cards */}
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {PHILANTHROPIC_INITIATIVES.slice(0, 3).map((init) => {
                const cover = ALBUM_COVERS[init.albumKey] || '';
                return (
                  <Link
                    key={init.id}
                    to={localePath(lang, '/media/community')}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-pine-900/70 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-gold-400/50 hover:bg-pine-900/90"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-pine-950">
                      {cover && (
                        <img
                          src={cover}
                          alt={init.title[lang]}
                          width={400}
                          height={250}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-pine-950 via-pine-950/40 to-transparent" />
                      <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-pine-950/80 px-2.5 py-1 text-[11px] font-medium text-gold-300 border border-gold-500/30 backdrop-blur-sm">
                        <Sparkles size={11} />
                        {init.partner.name}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="font-display text-base font-semibold text-white group-hover:text-gold-300 transition-colors">
                        {init.title[lang]}
                      </h3>
                      <p className="mt-2 flex-1 text-xs leading-relaxed text-pine-200/80 line-clamp-3">
                        {init.subtitle[lang]}
                      </p>

                      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
                        <span className="text-[11px] font-medium text-gold-400/90">
                          {init.period}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-gold-300 group-hover:text-gold-200">
                          {t['mediaLanding.viewInitiative'] || 'Consulter'}
                          <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── Category Cards Grid ───────────────────────────────────────── */}
      <section aria-label={lang === 'fr' ? 'Rubriques Médias' : 'Media Categories'}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold text-pine-950 sm:text-3xl">
              {lang === 'fr' ? 'Toutes les rubriques médias' : 'All media sections'}
            </h2>
            <p className="mt-1 text-sm text-ink/70">
              {lang === 'fr'
                ? 'Explorez les interventions, tribunes et actions de terrain par domaine.'
                : 'Browse speeches, interviews, op-eds, and grassroots initiatives by category.'}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat, i) => {
            const Icon = cat.icon;
            const count = catCounts[cat.key] || 0;
            const isCommunity = cat.key === 'community';

            return (
              <Reveal key={cat.key} delay={Math.min(i * 0.08, 0.4)}>
                <Link
                  to={localePath(lang, `/media/${cat.key}`)}
                  className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-card transition-all duration-300 hover:-translate-y-2 hover:shadow-card-hover ${
                    isCommunity
                      ? 'border-gold-500/40 ring-1 ring-gold-500/20 hover:border-gold-500'
                      : 'border-pine-900/10 hover:border-gold-500/40'
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-[16/9] overflow-hidden">
                    {cat.thumb ? (
                      <img
                        src={cat.thumb}
                        alt={t[catLabelKey(cat.key) as keyof typeof t] || cat.key}
                        width={400}
                        height={225}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div
                        className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${cat.color}`}
                      >
                        <Icon size={48} className="text-white/25" />
                      </div>
                    )}
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-pine-950/80 via-pine-950/20 to-transparent" />

                    {/* Icon badge */}
                    <span
                      className={`absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-xl ${cat.bg} text-white ring-1 ${cat.ring} transition-transform duration-300 group-hover:scale-110`}
                    >
                      <Icon size={20} />
                    </span>

                    {/* Count badge */}
                    <span
                      className={`absolute right-4 top-4 rounded-full px-3 py-1 text-[11px] font-bold ${cat.badge} ring-1 ring-white/40`}
                    >
                      {count}{' '}
                      {t['mediaPage.all'] === 'Tout'
                        ? count > 1
                          ? 'éléments'
                          : 'élément'
                        : count > 1
                          ? 'items'
                          : 'item'}
                    </span>

                    {/* Special Philanthropy tag for community */}
                    {isCommunity && (
                      <span className="absolute top-4 left-18 rounded-full bg-gold-400 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-pine-950 shadow">
                        {lang === 'fr' ? 'Philanthropie' : 'Philanthropy'}
                      </span>
                    )}

                    {/* Title on image */}
                    <h3 className="absolute bottom-4 left-4 right-4 font-display text-xl font-semibold text-white drop-shadow-lg">
                      {t[catLabelKey(cat.key) as keyof typeof t] || cat.key}
                    </h3>
                  </div>

                  {/* Description */}
                  <div className="flex flex-1 flex-col p-5">
                    <p className="flex-1 text-[13.5px] leading-relaxed text-ink/75">
                      {t[cat.descKey as keyof typeof t] || ''}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-gold-700 transition-colors group-hover:text-gold-500">
                      {t['mediaPage.all'] === 'Tout' ? 'Explorer' : 'Explore'}
                      <ArrowUpRight
                        size={14}
                        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>
    </div>
  );
}
