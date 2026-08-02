import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { BookOpen, ArrowUpRight, Search, Quote, Download } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { CitationModal } from '@/components/CitationModal';
import { useLang } from '@/i18n/useLang';
import { UI } from '@/i18n/translations';
import { BIB_ITEMS, type BibEntry } from '@/data/bibliography';
import { citationBibtex, type CitationSource } from '@/lib/citations';

const pill = (active: boolean) =>
  `whitespace-nowrap rounded-full px-4 py-1.5 text-[12.5px] font-semibold transition-all ${
    active
      ? 'bg-pine-950 text-gold-400 shadow'
      : 'bg-pine-900/5 text-ink/75 ring-1 ring-pine-900/10 hover:text-pine-900 hover:ring-gold-500/50'
  }`;

export default function Bibliography() {
  const { lang } = useLang();
  const t = UI[lang];

  const [searchParams, setSearchParams] = useSearchParams();
  const year = searchParams.get('y') ?? 'all';
  const sort = searchParams.get('sort') === 'asc' ? 'asc' : 'desc';
  const search = searchParams.get('q') ?? '';
  const [citing, setCiting] = useState<BibEntry | null>(null);

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
    const set = new Set(BIB_ITEMS.map((p) => String(p.year)));
    return Array.from(set).sort((a, b) => b.localeCompare(a));
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return BIB_ITEMS.filter((p) => {
      if (year !== 'all' && String(p.year) !== year) return false;
      if (q) {
        const haystack = `${p.title[lang]} ${p.authors[lang]} ${p.journal[lang]} ${p.doi ?? ''}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    }).sort((a, b) => {
      const cmp = a.year - b.year;
      return sort === 'desc' ? -cmp : cmp;
    });
  }, [year, sort, search, lang]);

  const exportAll = () => {
    const bib = BIB_ITEMS.map((p) => {
      const src: CitationSource = {
        id: p.id,
        title: p.title[lang],
        authors: p.authors[lang],
        journal: p.journal[lang],
        year: p.year,
        url: p.url,
        doi: p.doi,
        volume: p.volume,
        issue: p.issue,
        pages: p.pages,
        type: 'paper',
      };
      return citationBibtex(src).trimEnd();
    }).join('\n\n');
    const blob = new Blob([`${bib}\n`], { type: 'application/x-bibtex' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'dagnon-bibliography.bib';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <main id="main-content" className="min-h-screen">
      <section className="relative overflow-hidden bg-pine-950">
        <div className="absolute inset-0 texture-net" />
        <div className="absolute -top-40 -right-40 h-[560px] w-[560px] rounded-full bg-pine-600/25 blur-[130px]" />
        <div className="absolute bottom-0 -left-40 h-[460px] w-[460px] rounded-full bg-gold-600/12 blur-[120px]" />

        <div className="relative mx-auto max-w-6xl px-5 pb-24 pt-32 lg:px-8 lg:pt-36">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-300">
              <BookOpen size={13} />
              {t['bibliographyPage.badge']}
            </span>
            <h1 className="mt-7 font-display text-[2.6rem] leading-[1.05] font-medium text-pine-100 sm:text-6xl lg:text-[4.4rem]">
              {t['bibliographyPage.title']}
            </h1>
            <p className="mt-4 max-w-2xl font-display text-lg italic text-pine-200/90 sm:text-xl">
              {t['bibliographyPage.intro']}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-pine-50 py-16 lg:py-20">
        <div className="relative mx-auto max-w-6xl px-5 lg:px-8">
          <div className="rounded-2xl border border-pine-900/10 bg-ivory p-4 shadow-card">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
              <div className="min-w-0 w-full lg:max-w-xs">
                <label htmlFor="bib-search" className="sr-only">
                  {t['bibliographyPage.search']}
                </label>
                <div className="relative">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/60" />
                  <input
                    id="bib-search"
                    type="text"
                    value={search}
                    onChange={(e) => setFilter('q', e.target.value, '')}
                    placeholder={t['bibliographyPage.search']}
                    className="w-full rounded-full border border-pine-900/15 bg-white py-2.5 pl-10 pr-4 text-sm text-ink outline-none transition-colors placeholder:text-ink/65 focus:border-gold-500/40 focus:ring-1 focus:ring-gold-500/10"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 lg:flex-row lg:shrink-0 lg:items-center lg:gap-x-6">
                <div className="flex flex-nowrap items-center gap-2 overflow-x-auto py-1 no-scrollbar">
                  <p className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.18em] text-pine-900/75">
                    {t['bibliographyPage.filterYear']}
                  </p>
                  <div role="group" aria-label={t['bibliographyPage.filterYear']} className="flex shrink-0 gap-2">
                    <button type="button" onClick={() => setFilter('y', 'all', 'all')} className={pill(year === 'all')}>
                      {t['bibliographyPage.all']}
                    </button>
                    {years.map((y) => (
                      <button key={y} type="button" onClick={() => setFilter('y', y, 'all')} className={pill(year === y)}>
                        {y}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <p className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.18em] text-pine-900/75">
                    {t['bibliographyPage.filterSort']}
                  </p>
                  <div role="group" aria-label={t['bibliographyPage.filterSort']} className="flex gap-2">
                    <button type="button" onClick={() => setFilter('sort', 'desc', 'desc')} className={pill(sort === 'desc')}>
                      {t['bibliographyPage.newest']}
                    </button>
                    <button type="button" onClick={() => setFilter('sort', 'asc', 'desc')} className={pill(sort === 'asc')}>
                      {t['bibliographyPage.oldest']}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 border-t border-pine-900/10 pt-4">
              <p className="text-[13px] font-medium text-pine-900/75">
                {t['bibliographyPage.results'].replace('{n}', String(filtered.length))}
              </p>
              <button
                type="button"
                onClick={exportAll}
                className="inline-flex items-center gap-2 rounded-full border border-pine-900/15 bg-white px-4 py-2 text-[12.5px] font-semibold text-pine-900 transition-colors hover:border-gold-500/40 hover:text-gold-700"
              >
                <Download size={14} />
                {t['bibliographyPage.exportAll']}
              </button>
            </div>
          </div>

          {filtered.length === 0 ? (
            <p className="mt-10 rounded-2xl border border-dashed border-pine-900/15 bg-white px-6 py-16 text-center text-sm text-pine-900/75">
              {t['bibliographyPage.empty']}
            </p>
          ) : (
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {filtered.map((p, i) => (
                <Reveal key={p.id} delay={Math.min(i * 0.03, 0.3)}>
                  <div className="relative">
                    <BibCard p={p} lang={lang} t={t} />
                    <button
                      type="button"
                      onClick={() => setCiting(p)}
                      aria-label={`${t['bibliographyPage.cite']} — ${p.title[lang]}`}
                      className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-pine-950/85 text-gold-300 shadow-lg backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-gold-500 hover:text-pine-950"
                    >
                      <Quote size={15} />
                    </button>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {citing && <CitationModal p={citing} onClose={() => setCiting(null)} />}
    </main>
  );
}

function BibCard({ p, lang, t }: { p: BibEntry; lang: 'fr' | 'en'; t: typeof UI['fr'] }) {
  return (
    <a
      href={p.url}
      target="_blank"
      rel="noreferrer"
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-pine-900/10 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/40"
    >
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-gold-700">
          {p.journal[lang]} · {p.year}
        </p>
        <h3 className="mt-2 flex-1 font-display text-[1.15rem] font-semibold leading-snug text-pine-900">
          {p.title[lang]}
        </h3>
        <p className="mt-2 text-[12px] text-pine-900/75 line-clamp-2">{p.authors[lang]}</p>
        <p className="mt-2 text-[12.5px] leading-relaxed text-pine-900/70 line-clamp-3">{p.description[lang]}</p>
        <div className="mt-4 flex items-center gap-2 border-t border-pine-900/10 pt-3">
          {p.doi && (
            <span className="inline-flex min-w-0 items-center gap-1.5 rounded-full bg-pine-900/5 px-3 py-1 text-[11px] font-medium text-pine-900/80 ring-1 ring-pine-900/10">
              <BookOpen size={11} className="shrink-0 text-gold-700" />
              <span className="truncate">DOI: {p.doi}</span>
            </span>
          )}
          <span className="ml-auto inline-flex shrink-0 items-center gap-1.5 text-[12px] font-semibold text-gold-700 transition-colors group-hover:text-gold-500">
            {t['bibliographyPage.readPaper']}
            <ArrowUpRight size={13} />
          </span>
        </div>
      </div>
    </a>
  );
}
