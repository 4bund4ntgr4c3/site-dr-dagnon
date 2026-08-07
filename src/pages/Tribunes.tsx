import { Newspaper, ArrowUpRight, Calendar } from 'lucide-react';
import { Link, useSearchParams } from 'react-router';
import { Reveal } from '@/components/Reveal';
import { NameHighlight } from '@/components/NameHighlight';
import { useLang } from '@/i18n/useLang';
import { UI } from '@/i18n/translations';
import { localePath } from '@/i18n/routing';
import { TRIBUNES, type TribuneEntry, type TribuneTheme } from '@/data/tribunes';

/* The ISO date is split, not parsed with new Date(), so the rendered date is
   exactly the one in the data file regardless of the visitor's timezone. */
const parts = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return { y, m, d };
};

const THEMES: TribuneTheme[] = ['malaria', 'public-health', 'digital', 'leadership'];

const pill = (active: boolean) =>
  `whitespace-nowrap rounded-full px-4 py-1.5 text-[12.5px] font-semibold transition-all ${
    active
      ? 'bg-pine-950 text-gold-400 shadow'
      : 'bg-pine-900/5 text-ink/75 ring-1 ring-pine-900/10 hover:text-pine-900 hover:ring-gold-500/50'
  }`;

export default function Tribunes() {
  const { lang } = useLang();
  const t = UI[lang];
  const tKey = (k: string) => t[k as keyof typeof t] as unknown as string;

  /* Filters live in the URL so a filtered view can be shared and bookmarked;
     the `all` defaults are left out so the canonical link stays clean. */
  const [searchParams, setSearchParams] = useSearchParams();
  const year = searchParams.get('y') ?? 'all';
  const theme = searchParams.get('t') ?? 'all';

  const setFilter = (key: 'y' | 't', value: string, default_: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value === default_) next.delete(key);
        else next.set(key, value);
        return next;
      },
      { replace: true },
    );
  };

  const filtered = TRIBUNES.filter((e) => {
    if (year !== 'all' && String(parts(e.date).y) !== year) return false;
    if (theme !== 'all' && e.theme !== theme) return false;
    return true;
  }).sort((a, b) => b.date.localeCompare(a.date));

  const years = Array.from(new Set(TRIBUNES.map((e) => String(parts(e.date).y)))).sort((a, b) => b.localeCompare(a));

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen">
      <section className="relative overflow-hidden bg-pine-950">
        <div className="absolute inset-0 texture-net" />
        <div className="absolute -top-40 -right-40 h-[560px] w-[560px] rounded-full bg-pine-600/25 blur-[130px]" />
        <div className="absolute bottom-0 -left-40 h-[460px] w-[460px] rounded-full bg-gold-600/12 blur-[120px]" />

        <div className="relative mx-auto max-w-6xl px-5 pb-24 pt-32 lg:px-8 lg:pt-36">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-300">
              <Newspaper size={13} />
              {t['tribunesPage.badge']}
            </span>
            <h1 className="mt-7 font-display text-[2.6rem] leading-[1.05] font-medium text-pine-100 sm:text-6xl lg:text-[4.4rem]">
              {t['tribunesPage.badge']} — <NameHighlight />
            </h1>
            <p className="mt-4 font-display text-lg italic text-pine-200/90 sm:text-xl">
              {t['tribunesPage.intro']}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-pine-50 py-16 lg:py-20">
        <div className="relative mx-auto max-w-6xl px-5 lg:px-8">
          {/* filters */}
          <div className="rounded-2xl border border-pine-900/10 bg-ivory p-4 shadow-card">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:flex-wrap">
              <span className="text-[12px] font-bold uppercase tracking-[0.15em] text-pine-900/80">
                {t['tribunesPage.filterBy']}:
              </span>
              <button type="button" onClick={() => setFilter('t', 'all', 'all')} className={pill(theme === 'all')}>
                {t['tribunesPage.all']}
              </button>
              {THEMES.map((th) => (
                <button
                  key={th}
                  type="button"
                  onClick={() => setFilter('t', th, 'all')}
                  aria-pressed={theme === th}
                  className={pill(theme === th)}
                >
                  {tKey(`tribunesPage.theme.${th}`)}
                </button>
              ))}
            </div>
            <div className="mt-3 flex flex-row flex-wrap items-center gap-2 border-t border-pine-900/10 pt-3">
              <span className="inline-flex items-center gap-1.5 text-[12px] text-pine-900/80">
                <Calendar size={13} /> {t['tribunesPage.filterYear']}:
              </span>
              <button type="button" onClick={() => setFilter('y', 'all', 'all')} className={pill(year === 'all')}>
                {t['tribunesPage.all']}
              </button>
              {years.map((y) => (
                <button
                  key={y}
                  type="button"
                  onClick={() => setFilter('y', y, 'all')}
                  aria-pressed={year === y}
                  className={pill(year === y)}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>

          {filtered.length > 0 ? (
            <div className="mt-10">
              {/* visual timeline — vertical rule on the left, each piece dated */}
              <ol className="relative space-y-6 border-l border-gold-500/40 pl-8 lg:pl-12">
                {filtered.map((e) => (
                  <li key={e.slug} className="relative">
                    <span className="absolute -left-[37px] top-2 flex h-4 w-4 items-center justify-center rounded-full bg-gold-500 ring-4 ring-gold-500/20 lg:-left-[49px]" />
                    <Reveal>
                      <TribuneCard e={e} lang={lang} t={t} />
                    </Reveal>
                  </li>
                ))}
              </ol>
            </div>
          ) : (
            <p className="mt-10 rounded-2xl border border-dashed border-pine-900/15 bg-white px-6 py-14 text-center text-sm text-pine-900/75">
              {t['tribunesPage.empty']}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

function TribuneCard({ e, lang, t }: { e: TribuneEntry; lang: 'fr' | 'en'; t: typeof UI['fr'] }) {
  const { y, m, d } = parts(e.date);
  const tKey = (k: string) => t[k as keyof typeof t] as unknown as string;
  const dateLabel = new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(y, m - 1, d));

  return (
    <Link
      to={localePath(lang, `/tribunes/${e.slug}`)}
      className="group flex h-full flex-col rounded-2xl border border-pine-900/10 bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/40 sm:p-6"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-pine-950 px-3 py-1 text-[11px] font-semibold text-gold-400">
          <Newspaper size={12} />
          {t['tribunesPage.badge']}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-500/15 px-3 py-1 text-[11px] font-semibold text-gold-700">
          {tKey(`tribunesPage.theme.${e.theme}`)}
        </span>
        <span className="ml-auto text-[11.5px] text-pine-900/65">{dateLabel}</span>
      </div>
      <h2 className="mt-3 font-display text-[1.15rem] font-semibold leading-snug text-pine-900 transition-colors group-hover:text-gold-600">
        {e.title[lang]}
      </h2>
      <p className="mt-2 text-[12.5px] leading-relaxed text-pine-900/70 line-clamp-3">{e.description[lang]}</p>
      <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-[12px] font-semibold text-gold-700 transition-colors group-hover:text-gold-500">
        {t['tribunesPage.read']}
        <ArrowUpRight size={13} />
      </span>
    </Link>
  );
}