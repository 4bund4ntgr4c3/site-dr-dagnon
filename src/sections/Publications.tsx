import { useMemo, useState } from 'react';
import { Search, ExternalLink, FileText, Star } from 'lucide-react';
import { SectionHeading } from '@/components/SectionHeading';
import { Reveal } from '@/components/Reveal';
import { useLang } from '@/i18n/useLang';
import { PUBLICATIONS, UI, publicationsCount } from '@/i18n/translations';

export function Publications() {
  const { lang } = useLang();
  const t = UI[lang];

  const YEARS = useMemo(
    () => [t['publications.all'], ...Array.from(new Set(PUBLICATIONS[lang].map((p) => String(p.year)))).sort().reverse()],
    [lang, t],
  );

  const [query, setQuery] = useState('');
  const [year, setYear] = useState(t['publications.all']);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PUBLICATIONS[lang].filter((p) => {
      const matchYear = year === t['publications.all'] || String(p.year) === year;
      const matchQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.journal.toLowerCase().includes(q) ||
        p.authors.toLowerCase().includes(q);
      return matchYear && matchQuery;
    });
  }, [query, year, lang, t]);

  return (
    <section id="publications" className="bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <SectionHeading
          eyebrow={t['publications.eyebrow']}
          title={t['publications.title']}
          intro={t['publications.intro']}
        />

        {/* filters */}
        <Reveal delay={0.15}>
          <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-pine-900/10 bg-ivory p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 sm:max-w-sm">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/60" />
              <input
                aria-label={t['publications.search']}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t['publications.search']}
                className="w-full rounded-full border border-pine-900/15 bg-white py-2.5 pl-10 pr-4 text-sm text-ink outline-none transition-colors placeholder:text-ink/65 focus:border-gold-500/40 focus:ring-1 focus:ring-gold-500/10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {YEARS.map((y) => (
                <button
                  key={y}
                  type="button"
                  onClick={() => setYear(y)}
                  aria-pressed={year === y}
                  className={`rounded-full px-4 py-1.5 text-[12.5px] font-semibold transition-all ${
                    year === y
                      ? 'bg-pine-950 text-gold-400 shadow'
                      : 'bg-pine-900/5 text-ink/75 ring-1 ring-pine-900/10 hover:text-pine-900 hover:ring-gold-500/50'
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        <p className="mt-5 text-[12.5px] font-medium uppercase tracking-widest text-ink/75">
          {publicationsCount(lang, filtered.length)}
        </p>

        {/* list */}
        <div className="mt-5 space-y-4">
          {filtered.map((p, i) => (
            <Reveal key={p.title} delay={Math.min(i * 0.04, 0.3)} y={16}>
              <article
                className={`group flex gap-5 rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover ${
                  p.featured
                    ? 'border-gold-500/50 bg-gradient-to-r from-gold-500/10 to-transparent'
                    : 'border-pine-900/10 bg-ivory/60 hover:border-gold-500/40'
                }`}
              >
                <div className="hidden sm:flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pine-900 text-gold-400 transition-colors group-hover:bg-gold-500 group-hover:text-pine-950">
                  {p.featured ? <Star size={19} /> : <FileText size={19} />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-pine-900 px-2.5 py-0.5 text-[11px] font-bold text-gold-400">
                      {p.year}
                    </span>
                    <span className="text-[12px] font-semibold uppercase tracking-wider text-pine-700/80">
                      {p.journal}
                    </span>
                    {p.featured && (
                      <span className="rounded-full bg-gold-500 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-pine-950">
                        {t['publications.tribune']}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-2.5 font-display text-[1.15rem] font-semibold leading-snug text-pine-950">
                    {p.title}
                  </h3>
                  <p className="mt-1.5 truncate text-[12.5px] text-ink/75" title={p.authors}>
                    {p.authors}
                  </p>
                </div>
                {p.url && (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="hidden sm:flex h-10 w-10 shrink-0 self-center items-center justify-center rounded-full border border-pine-900/15 text-pine-800 transition-all hover:border-gold-500 hover:bg-gold-500 hover:text-pine-950"
                    aria-label={t['publications.open']}
                  >
                    <ExternalLink size={16} />
                  </a>
                )}
                {p.url && (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-gold-700 sm:hidden"
                  >
                    {t['publications.read']} <ExternalLink size={13} />
                  </a>
                )}
              </article>
            </Reveal>
          ))}

          {filtered.length === 0 && (
            <div className="rounded-2xl border border-dashed border-pine-900/20 p-12 text-center text-sm text-ink/70">
              {t['publications.empty']}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
