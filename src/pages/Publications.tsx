import { useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router';
import { FileText, ArrowUpRight, X, Star, Search, Quote, ExternalLink } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { NameHighlight } from '@/components/NameHighlight';
import { CitationModal } from '@/components/CitationModal';
import { useLang } from '@/i18n/useLang';
import { UI } from '@/i18n/translations';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { PUB_ITEMS, type PubEntry } from '@/data/publications';
import { LINKS } from '@/data/content';

const pill = (active: boolean) =>
  `whitespace-nowrap rounded-full px-4 py-1.5 text-[12.5px] font-semibold transition-all ${
    active
      ? 'bg-pine-950 text-gold-400 shadow'
      : 'bg-pine-900/5 text-ink/75 ring-1 ring-pine-900/10 hover:text-pine-900 hover:ring-gold-500/50'
  }`;

export default function PublicationsPage() {
  const { lang } = useLang();
  const t = UI[lang];

  /* the filters live in the URL (?y=&sort=&q=) so a filtered view can be
     shared and bookmarked; defaults are left out of the URL so the canonical
     link stays clean. replace keeps the back button useful — these are view
     state, not pages. */
  const [searchParams, setSearchParams] = useSearchParams();
  const year = searchParams.get('y') ?? 'all';
  const sort = searchParams.get('sort') === 'asc' ? 'asc' : 'desc';
  const search = searchParams.get('q') ?? '';
  const [expanded, setExpanded] = useState<string | null>(null);
  const [citing, setCiting] = useState<PubEntry | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const setFilter = (key: 'y' | 'sort' | 'q', value: string, default_: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value === '' || value === default_) next.delete(key);
        else next.set(key, value);
        return next;
      },
      { replace: true },
    );
  };

  const years = useMemo(() => {
    const set = new Set(PUB_ITEMS.map((p) => String(p.year)));
    return Array.from(set).sort((a, b) => b.localeCompare(a));
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return PUB_ITEMS.filter((p) => {
      if (year !== 'all' && String(p.year) !== year) return false;
      if (q) {
        const haystack = `${p.title[lang]} ${p.authors[lang]} ${p.journal[lang]}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    }).sort((a, b) => {
      const cmp = a.year - b.year;
      return sort === 'desc' ? -cmp : cmp;
    });
  }, [year, sort, search, lang]);

  const featured = useMemo(() => filtered.filter((p) => p.featured), [filtered]);
  const regular = useMemo(() => filtered.filter((p) => !p.featured), [filtered]);

  useFocusTrap(modalRef, closeRef, !!expanded, () => setExpanded(null));

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen">
      {/* header — hero background */}
      <section className="relative overflow-hidden bg-pine-950">
        <div className="absolute inset-0 texture-net" />
        <div className="absolute -top-40 -right-40 h-[560px] w-[560px] rounded-full bg-pine-600/25 blur-[130px]" />
        <div className="absolute bottom-0 -left-40 h-[460px] w-[460px] rounded-full bg-gold-600/12 blur-[120px]" />

        <div className="relative mx-auto max-w-6xl px-5 pb-24 pt-32 lg:px-8 lg:pt-36">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-300">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
              {t['pubPage.badge']}
            </span>
            <h1 className="mt-7 font-display text-[2.6rem] leading-[1.05] font-medium text-pine-100 sm:text-6xl lg:text-[4.4rem]">
              {t['pubPage.badge']} — <NameHighlight />
            </h1>
            <p className="mt-4 font-display text-lg italic text-pine-200/90 sm:text-xl">
              {t['pubPage.intro']}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {LINKS.orcid && (
                <a
                  href={LINKS.orcid}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-pine-100/20 bg-white/10 px-4 py-2 text-sm font-medium text-pine-100 backdrop-blur-sm transition-all hover:border-gold-400/50 hover:bg-gold-500/10 hover:text-gold-300"
                >
                  <span className="text-[11px] font-bold tracking-wider">ORCID</span>
                  <ExternalLink size={13} />
                </a>
              )}
              {LINKS.scholar && (
                <a
                  href={LINKS.scholar}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-pine-100/20 bg-white/10 px-4 py-2 text-sm font-medium text-pine-100 backdrop-blur-sm transition-all hover:border-gold-400/50 hover:bg-gold-500/10 hover:text-gold-300"
                >
                  <span className="text-[11px] font-bold tracking-wider">Google Scholar</span>
                  <ExternalLink size={13} />
                </a>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* content — light */}
      <section className="bg-pine-50 py-16 lg:py-20">
        <div className="relative mx-auto max-w-6xl px-5 lg:px-8">
          {/* filters — top bar */}
          <div className="rounded-2xl border border-pine-900/10 bg-ivory p-4 shadow-card">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
              {/* search */}
              <div className="min-w-0 w-full lg:max-w-xs">
                <label htmlFor="pub-search" className="sr-only">
                  {t['pubPage.search']}
                </label>
                <div className="relative">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/60" />
                  <input
                    id="pub-search"
                    type="text"
                    value={search}
                    onChange={(e) => setFilter('q', e.target.value, '')}
                    placeholder={t['pubPage.search']}
                    className="w-full rounded-full border border-pine-900/15 bg-white py-2.5 pl-10 pr-4 text-sm text-ink outline-none transition-colors placeholder:text-ink/65 focus:border-gold-500/40 focus:ring-1 focus:ring-gold-500/10"
                  />
                </div>
              </div>

              {/* year + sort */}
              <div className="flex flex-col gap-3 lg:flex-row lg:shrink-0 lg:items-center lg:gap-x-6">
                {/* year — slides on mobile */}
                <div className="flex flex-nowrap items-center gap-2 overflow-x-auto py-1 no-scrollbar">
                  <p className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.18em] text-pine-900/75">
                    {t['pubPage.filterYear']}
                  </p>
                  <div role="group" aria-label={t['pubPage.filterYear']} className="flex shrink-0 gap-2">
                    <button type="button" onClick={() => setFilter('y', 'all', 'all')} className={pill(year === 'all')}>
                      {t['pubPage.all']}
                    </button>
                    {years.map((y) => (
                      <button key={y} type="button" onClick={() => setFilter('y', y, 'all')} className={pill(year === y)}>
                        {y}
                      </button>
                    ))}
                  </div>
                </div>

                {/* sort — its own line on mobile */}
                <div className="flex shrink-0 items-center gap-2">
                  <p className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.18em] text-pine-900/75">
                    {t['pubPage.filterSort']}
                  </p>
                  <div role="group" aria-label={t['pubPage.filterSort']} className="flex gap-2">
                    <button type="button" onClick={() => setFilter('sort', 'desc', 'desc')} className={pill(sort === 'desc')}>
                      {t['pubPage.newest']}
                    </button>
                    <button type="button" onClick={() => setFilter('sort', 'asc', 'desc')} className={pill(sort === 'asc')}>
                      {t['pubPage.oldest']}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* main */}
          <div className="mt-8">
            <h2 className="sr-only">{t['pubPage.badge']}</h2>
            <p className="text-[13px] font-medium text-pine-900/75">
              {t['pubPage.results'].replace('{n}', String(filtered.length))}
            </p>

            {filtered.length === 0 ? (
              <p className="mt-10 rounded-2xl border border-dashed border-pine-900/15 bg-white px-6 py-16 text-center text-sm text-pine-900/75">
                {t['pubPage.empty']}
              </p>
            ) : (
              <>
                {/* featured */}
                {featured.length > 0 && (
                  <div className="mt-6 space-y-4">
                {featured.map((p) => (
                  <Reveal key={p.id}>
                    <div className="relative">
                      <FeaturedCard p={p} lang={lang} t={t} />
                      <button
                        type="button"
                        onClick={() => setCiting(p)}
                        aria-label={`${t['pubPage.cite']} — ${p.title[lang]}`}
                        className="absolute right-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-gold-500/50 bg-pine-950/80 text-gold-300 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-gold-500 hover:text-pine-950"
                      >
                        <Quote size={15} />
                      </button>
                    </div>
                  </Reveal>
                ))}
                  </div>
                )}

                {/* regular */}
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {regular.map((p, i) => (
                    <Reveal key={p.id} delay={Math.min(i * 0.03, 0.3)}>
                      <div className="relative">
                        <PubCard p={p} lang={lang} t={t} />
                        <button
                          type="button"
                          onClick={() => setCiting(p)}
                          aria-label={`${t['pubPage.cite']} — ${p.title[lang]}`}
                          className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-pine-950/85 text-gold-300 shadow-lg backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-gold-500 hover:text-pine-950"
                        >
                          <Quote size={15} />
                        </button>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* citation modal */}
      {citing && <CitationModal p={citing} onClose={() => setCiting(null)} />}

      {/* expanded modal */}
      {expanded && (() => {
        const p = PUB_ITEMS.find((pp) => pp.id === expanded);
        return p ? (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-pine-950/90 p-4 backdrop-blur-sm"
            onClick={() => setExpanded(null)}
            role="dialog"
            aria-modal="true"
            aria-label={p.title[lang]}
          >
            <div ref={modalRef} className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-3xl border border-pine-900/10 bg-white p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setExpanded(null)}
                aria-label={t['media.close']}
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-pine-900/15 text-pine-900 transition-colors hover:bg-pine-50"
              >
                <X size={20} />
              </button>
              <h2 className="pr-12 font-display text-xl font-semibold text-pine-900">
                {p.title[lang]}
              </h2>
              <p className="mt-3 text-sm text-pine-900/70">{p.authors[lang]}</p>
              <p className="mt-1 text-sm font-medium text-gold-700">
                {p.journal[lang]} · {p.year}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-pine-900/75">{p.description[lang]}</p>
              {p.url && (
                <a
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-pine-950 transition-all hover:-translate-y-0.5 hover:bg-gold-400"
                >
                  {p.type === 'blog' ? t['pubPage.readPost'] : t['pubPage.readPaper']}
                  <ArrowUpRight size={15} />
                </a>
              )}
            </div>
          </div>
        ) : null;
      })()}
    </main>
  );
}

function FeaturedCard({ p, lang, t }: { p: PubEntry; lang: 'fr' | 'en'; t: typeof UI['fr'] }) {
  return (
    <a
      href={p.url}
      target={p.url ? '_blank' : undefined}
      rel={p.url ? 'noreferrer' : undefined}
      className="group flex flex-col gap-4 overflow-hidden rounded-2xl border border-gold-500/30 bg-gradient-to-r from-pine-900 to-pine-950 p-8 transition-all duration-300 hover:border-gold-500/60 lg:flex-row lg:items-center lg:p-10"
    >
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gold-500 text-pine-950">
        <Star size={24} />
      </span>
      <div className="flex-1">
        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-gold-400">
          {t['pubPage.featured']}
        </p>
        <h3 className="mt-2 font-display text-2xl font-semibold leading-snug text-ivory lg:text-[1.7rem]">
          {p.title[lang]}
        </h3>
        <p className="mt-2 text-sm text-pine-100/85">{p.authors[lang]}</p>
        <p className="mt-1 text-sm font-medium text-gold-300/80">
          {p.journal[lang]} · {p.year}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-pine-100/70">{p.description[lang]}</p>
      </div>
      {p.url && (
        <span className="inline-flex items-center gap-2 self-start rounded-full border border-gold-500/50 px-5 py-2.5 text-sm font-semibold text-gold-300 transition-all group-hover:bg-gold-500 group-hover:text-pine-950 lg:self-center">
          {p.type === 'blog' ? t['pubPage.readPost'] : t['pubPage.readPaper']} <ArrowUpRight size={16} />
        </span>
      )}
    </a>
  );
}

function PubCard({ p, lang, t }: { p: PubEntry; lang: 'fr' | 'en'; t: typeof UI['fr'] }) {
  return (
    <a
      href={p.url}
      target={p.url ? '_blank' : undefined}
      rel={p.url ? 'noreferrer' : undefined}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-pine-900/10 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/40"
    >
      <div className="relative flex aspect-[16/5] items-center justify-center bg-gradient-to-br from-pine-800 to-pine-950">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-500/15 text-gold-400 ring-1 ring-gold-500/40 transition-transform duration-300 group-hover:scale-110">
          <FileText size={22} />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-gold-700">
          {p.journal[lang]} · {p.year}
        </p>
        <h3 className="mt-2 flex-1 font-display text-[1.15rem] font-semibold leading-snug text-pine-900">
          {p.title[lang]}
        </h3>
        <p className="mt-2 text-[12px] text-pine-900/75 line-clamp-2">{p.authors[lang]}</p>
        <p className="mt-2 text-[12.5px] leading-relaxed text-pine-900/70 line-clamp-3">{p.description[lang]}</p>
        {p.url && (
          <span className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-gold-700 transition-colors group-hover:text-gold-500">
            {p.type === 'blog' ? t['pubPage.readPost'] : t['pubPage.readPaper']}
            <ArrowUpRight size={13} />
          </span>
        )}
      </div>
    </a>
  );
}
