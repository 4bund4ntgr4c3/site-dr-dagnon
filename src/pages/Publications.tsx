import { useEffect, useMemo, useState } from 'react';
import { FileText, ArrowUpRight, X, Star, Search } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { useLang } from '@/i18n/useLang';
import { UI } from '@/i18n/translations';
import { PUB_ITEMS, type PubEntry, type PubType } from '@/data/publications';

const TYPE_FILTERS: { value: PubType | 'all'; key: string }[] = [
  { value: 'all', key: 'pubPage.all' },
  { value: 'publication', key: 'pubPage.typePublication' },
  { value: 'blog', key: 'pubPage.typeBlog' },
];

export default function PublicationsPage() {
  const { lang } = useLang();
  const t = UI[lang];

  const [type, setType] = useState<PubType | 'all'>('all');
  const [year, setYear] = useState<string>('all');
  const [sort, setSort] = useState<'desc' | 'asc'>('desc');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const years = useMemo(() => {
    const set = new Set(PUB_ITEMS.map((p) => String(p.year)));
    return Array.from(set).sort((a, b) => b.localeCompare(a));
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return PUB_ITEMS.filter((p) => {
      if (type !== 'all' && p.type !== type) return false;
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
  }, [type, year, sort, search, lang]);

  const featured = useMemo(() => filtered.filter((p) => p.featured), [filtered]);
  const regular = useMemo(() => filtered.filter((p) => !p.featured), [filtered]);

  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpanded(null);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [expanded]);

  const chip = (activeNow: boolean) =>
    `rounded-full border px-4 py-1.5 text-[13px] font-medium transition-colors ${
      activeNow
        ? 'border-gold-500 bg-gold-500 text-pine-950'
        : 'border-pine-900/15 text-pine-900/70 hover:border-gold-500/50 hover:text-gold-600'
    }`;

  return (
    <main className="min-h-screen">
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
              {(() => {
                const parts = t['hero.name'].split(' ');
                const idx = parts.findIndex((w) => w.toUpperCase().startsWith('DAGNON'));
                return parts.map((w, i) =>
                  i === idx ? (
                    <span key={i} className="text-gold-400 italic">
                      {w}
                      {i === parts.length - 1 ? '' : ' '}
                    </span>
                  ) : (
                    <span key={i}>
                      {w}
                      {i === parts.length - 1 ? '' : ' '}
                    </span>
                  ),
                );
              })()}
            </h1>
            <p className="mt-4 font-display text-lg italic text-pine-200/90 sm:text-xl">
              {t['pubPage.intro']}
            </p>
          </Reveal>
        </div>
      </section>

      {/* content — light */}
      <section className="bg-pine-50 py-16 lg:py-20">
        <div className="relative mx-auto max-w-6xl px-5 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[280px_1fr] lg:items-start">
            {/* filters sidebar */}
            <aside className="lg:sticky lg:top-24">
              <div className="rounded-3xl border border-pine-900/10 bg-white p-6 shadow-[0_24px_60px_-40px_rgba(2,36,32,0.45)]">
                <div className="space-y-6">
                  {/* search */}
                  <div>
                    <div className="relative">
                      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-pine-900/40" />
                      <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={t['pubPage.search']}
                        className="w-full rounded-xl border border-pine-900/15 bg-white py-2.5 pl-9 pr-4 text-sm text-pine-900 placeholder:text-pine-900/40 outline-none transition-colors focus:border-gold-500"
                      />
                    </div>
                  </div>

                  {/* type */}
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-pine-900/50">
                      {t['pubPage.filterType']}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {TYPE_FILTERS.map((f) => (
                        <button
                          key={f.value}
                          type="button"
                          onClick={() => setType(f.value)}
                          className={chip(type === f.value)}
                        >
                          {t[f.key]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* year */}
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-pine-900/50">
                      {t['pubPage.filterYear']}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setYear('all')}
                        className={chip(year === 'all')}
                      >
                        {t['pubPage.all']}
                      </button>
                      {years.map((y) => (
                        <button
                          key={y}
                          type="button"
                          onClick={() => setYear(y)}
                          className={chip(year === y)}
                        >
                          {y}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* sort */}
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-pine-900/50">
                      {t['pubPage.filterSort']}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setSort('desc')}
                        className={chip(sort === 'desc')}
                      >
                        {t['pubPage.newest']}
                      </button>
                      <button
                        type="button"
                        onClick={() => setSort('asc')}
                        className={chip(sort === 'asc')}
                      >
                        {t['pubPage.oldest']}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* main */}
            <div>
              <p className="text-[13px] font-medium text-pine-900/55">
                {t['pubPage.results'].replace('{n}', String(filtered.length))}
              </p>

              {filtered.length === 0 ? (
                <p className="mt-10 rounded-2xl border border-dashed border-pine-900/15 bg-white px-6 py-16 text-center text-sm text-pine-900/55">
                  {t['pubPage.empty']}
                </p>
              ) : (
                <>
                  {/* featured */}
                  {featured.length > 0 && (
                    <div className="mt-6 space-y-4">
                      {featured.map((p) => (
                        <Reveal key={p.id}>
                          <FeaturedCard p={p} lang={lang} t={t} />
                        </Reveal>
                      ))}
                    </div>
                  )}

                  {/* regular */}
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {regular.map((p, i) => (
                      <Reveal key={p.id} delay={Math.min(i * 0.03, 0.3)}>
                        <PubCard p={p} lang={lang} t={t} />
                      </Reveal>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* expanded modal */}
      {expanded && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-pine-950/90 p-4 backdrop-blur-sm"
          onClick={() => setExpanded(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-3xl border border-pine-900/10 bg-white p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setExpanded(null)}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-pine-900/15 text-pine-900 transition-colors hover:bg-pine-50"
            >
              <X size={20} />
            </button>
            {(() => {
              const p = PUB_ITEMS.find((pp) => pp.id === expanded);
              if (!p) return null;
              return (
                <>
                  <h2 className="pr-12 font-display text-xl font-semibold text-pine-900">
                    {p.title[lang]}
                  </h2>
                  <p className="mt-3 text-sm text-pine-900/60">{p.authors[lang]}</p>
                  <p className="mt-1 text-sm font-medium text-gold-600">
                    {p.journal[lang]} · {p.year}
                  </p>
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
                </>
              );
            })()}
          </div>
        </div>
      )}
    </main>
  );
}

function FeaturedCard({ p, lang, t }: { p: PubEntry; lang: 'fr' | 'en'; t: typeof UI['fr'] }) {
  return (
    <a
      href={p.url || '#'}
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
        <p className="mt-2 text-sm text-pine-100/60">{p.authors[lang]}</p>
        <p className="mt-1 text-sm font-medium text-gold-300/80">
          {p.journal[lang]} · {p.year}
        </p>
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
      href={p.url || '#'}
      target={p.url ? '_blank' : undefined}
      rel={p.url ? 'noreferrer' : undefined}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-pine-900/10 bg-white shadow-[0_24px_60px_-45px_rgba(2,36,32,0.5)] transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/40"
    >
      <div className="relative flex aspect-[16/5] items-center justify-center bg-gradient-to-br from-pine-800 to-pine-950">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-500/15 text-gold-400 ring-1 ring-gold-500/40 transition-transform duration-300 group-hover:scale-110">
          <FileText size={22} />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-gold-500">
          {p.journal[lang]} · {p.year}
        </p>
        <h3 className="mt-2 flex-1 font-display text-[15px] font-semibold leading-snug text-pine-900">
          {p.title[lang]}
        </h3>
        <p className="mt-2 text-[12px] text-pine-900/50 line-clamp-2">{p.authors[lang]}</p>
        {p.url && (
          <span className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-gold-600 transition-colors group-hover:text-gold-500">
            {p.type === 'blog' ? t['pubPage.readPost'] : t['pubPage.readPaper']}
            <ArrowUpRight size={13} />
          </span>
        )}
      </div>
    </a>
  );
}
