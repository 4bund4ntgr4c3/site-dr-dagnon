import { useMemo, useRef, useState } from 'react';
import { Play, FileText, Image as ImageIcon, X, ArrowUpRight, Mic, Presentation, Search, BookOpen, Newspaper } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { NameHighlight } from '@/components/NameHighlight';
import { useLang } from '@/i18n/useLang';
import { UI } from '@/i18n/translations';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import {
  MEDIA_ITEMS,
  type MediaEntry,
  type MediaType,
  type MediaCategory,
} from '@/data/media';

const TYPE_FILTERS: { value: MediaType | 'all'; key: string }[] = [
  { value: 'all', key: 'mediaPage.all' },
  { value: 'video', key: 'mediaPage.typeVideo' },
  { value: 'image', key: 'mediaPage.typeImage' },
  { value: 'document', key: 'mediaPage.typeDocument' },
];

const CATEGORY_KEYS: Record<MediaCategory, string> = {
  interview: 'mediaPage.catInterview',
  conference: 'mediaPage.catConference',
  research: 'mediaPage.catResearch',
  publication: 'mediaPage.catPublication',
  press: 'mediaPage.catPress',
};

const CATEGORY_ICONS: Record<MediaCategory, typeof Mic> = {
  interview: Mic,
  conference: Presentation,
  research: Search,
  publication: BookOpen,
  press: Newspaper,
};

function formatDate(iso: string, lang: 'fr' | 'en') {
  return new Date(iso).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function MediaPage() {
  const { lang } = useLang();
  const t = UI[lang];

  const [type, setType] = useState<MediaType | 'all'>('all');
  const [cat, setCat] = useState<MediaCategory | 'all'>('all');
  const [year, setYear] = useState<string>('all');
  const [sort, setSort] = useState<'desc' | 'asc'>('desc');
  const [active, setActive] = useState<MediaEntry | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const years = useMemo(() => {
    const set = new Set(MEDIA_ITEMS.map((m) => m.date.slice(0, 4)));
    return Array.from(set).sort((a, b) => b.localeCompare(a));
  }, []);

  const categories = useMemo(() => {
    const set = new Set(MEDIA_ITEMS.map((m) => m.category));
    return Array.from(set) as MediaCategory[];
  }, []);

  const catCounts = useMemo(() => {
    const counts: Record<string, number> = { all: MEDIA_ITEMS.length };
    MEDIA_ITEMS.forEach((m) => {
      counts[m.category] = (counts[m.category] || 0) + 1;
    });
    return counts;
  }, []);

  const filtered = useMemo(() => {
    return MEDIA_ITEMS.filter((m) => {
      if (type !== 'all' && m.type !== type) return false;
      if (cat !== 'all' && m.category !== cat) return false;
      if (year !== 'all' && !m.date.startsWith(year)) return false;
      return true;
    }).sort((a, b) => {
      const cmp = a.date.localeCompare(b.date);
      return sort === 'desc' ? -cmp : cmp;
    });
  }, [type, cat, year, sort]);

  useFocusTrap(modalRef, closeRef, !!active, () => setActive(null));

  return (
    <main id="main-content" className="min-h-screen overflow-x-hidden">
      {/* header — hero background */}
      <section className="relative overflow-hidden bg-pine-950">
        <div className="absolute inset-0 texture-net" />
        <div className="absolute -top-40 -right-40 h-[560px] w-[560px] rounded-full bg-pine-600/25 blur-[130px]" />
        <div className="absolute bottom-0 -left-40 h-[460px] w-[460px] rounded-full bg-gold-600/12 blur-[120px]" />

        <div className="relative mx-auto max-w-6xl px-5 pb-24 pt-32 lg:px-8 lg:pt-36">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-300">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
              {t['mediaPage.badge']}
            </span>
            <h1 className="mt-7 font-display text-[2.6rem] leading-[1.05] font-medium text-pine-100 sm:text-6xl lg:text-[4.4rem]">
              <NameHighlight />
            </h1>
            <p className="mt-4 font-display text-lg italic text-pine-200/90 sm:text-xl">
              {t['mediaPage.intro']}
            </p>
          </Reveal>
        </div>
      </section>

      {/* content — light */}
      <section className="bg-pine-50 py-16 lg:py-20">
        <div className="relative mx-auto max-w-6xl px-5 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[260px_1fr] lg:items-start">
            {/* filters sidebar */}
            <aside className="lg:sticky lg:top-24">
              <div className="rounded-2xl border border-pine-900/10 bg-ivory p-4 shadow-[0_24px_60px_-40px_rgba(2,36,32,0.45)]">
                <div className="space-y-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-pine-900/50">
                  {t['mediaPage.filterType']}
                </p>
                <div role="group" aria-label={t['mediaPage.filterType']} className="mt-2 flex flex-wrap gap-2">
                  {TYPE_FILTERS.map((f) => (
                    <button
                      key={f.value}
                      type="button"
                      onClick={() => setType(f.value)}
                      className={`rounded-full px-4 py-1.5 text-[12.5px] font-semibold transition-all ${
                        type === f.value
                          ? 'bg-pine-950 text-gold-400 shadow'
                          : 'bg-white text-ink/60 ring-1 ring-pine-900/10 hover:text-pine-900 hover:ring-gold-500/50'
                      }`}
                    >
                      {t[f.key]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-pine-900/50">
                  {t['mediaPage.filterCategory']}
                </p>
                <div role="group" aria-label={t['mediaPage.filterCategory']} className="mt-2 flex flex-wrap gap-2">
                  <button type="button" onClick={() => setCat('all')} className={`rounded-full px-4 py-1.5 text-[12.5px] font-semibold transition-all ${
                    cat === 'all'
                      ? 'bg-pine-950 text-gold-400 shadow'
                      : 'bg-white text-ink/60 ring-1 ring-pine-900/10 hover:text-pine-900 hover:ring-gold-500/50'
                  }`}>
                    {t['mediaPage.all']}
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCat(c)}
                      className={`rounded-full px-4 py-1.5 text-[12.5px] font-semibold transition-all ${
                        cat === c
                          ? 'bg-pine-950 text-gold-400 shadow'
                          : 'bg-white text-ink/60 ring-1 ring-pine-900/10 hover:text-pine-900 hover:ring-gold-500/50'
                      }`}
                    >
                      {t[CATEGORY_KEYS[c]]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-pine-900/50">
                  {t['mediaPage.filterYear']}
                </p>
                <div role="group" aria-label={t['mediaPage.filterYear']} className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setYear('all')}
                    className={`rounded-full px-4 py-1.5 text-[12.5px] font-semibold transition-all ${
                      year === 'all'
                        ? 'bg-pine-950 text-gold-400 shadow'
                        : 'bg-white text-ink/60 ring-1 ring-pine-900/10 hover:text-pine-900 hover:ring-gold-500/50'
                    }`}
                  >
                    {t['mediaPage.all']}
                  </button>
                  {years.map((y) => (
                    <button
                      key={y}
                      type="button"
                      onClick={() => setYear(y)}
                      className={`rounded-full px-4 py-1.5 text-[12.5px] font-semibold transition-all ${
                        year === y
                          ? 'bg-pine-950 text-gold-400 shadow'
                          : 'bg-white text-ink/60 ring-1 ring-pine-900/10 hover:text-pine-900 hover:ring-gold-500/50'
                      }`}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-pine-900/50">
                  {t['mediaPage.filterSort']}
                </p>
                <div role="group" aria-label={t['mediaPage.filterSort']} className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setSort('desc')}
                    className={`rounded-full px-4 py-1.5 text-[12.5px] font-semibold transition-all ${
                      sort === 'desc'
                        ? 'bg-pine-950 text-gold-400 shadow'
                        : 'bg-white text-ink/60 ring-1 ring-pine-900/10 hover:text-pine-900 hover:ring-gold-500/50'
                    }`}
                  >
                    {t['mediaPage.newest']}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSort('asc')}
                    className={`rounded-full px-4 py-1.5 text-[12.5px] font-semibold transition-all ${
                      sort === 'asc'
                        ? 'bg-pine-950 text-gold-400 shadow'
                        : 'bg-white text-ink/60 ring-1 ring-pine-900/10 hover:text-pine-900 hover:ring-gold-500/50'
                    }`}
                  >
                    {t['mediaPage.oldest']}
                  </button>
                </div>
              </div>
            </div>
          </div>
          </aside>

          <div>
          <h2 className="sr-only">{t['mediaPage.badge']}</h2>
          <p className="mt-6 text-[13px] font-medium text-pine-900/55">
            {t['mediaPage.results'].replace('{n}', String(filtered.length))}
          </p>

          {/* category miniature bar */}
          <div className="mt-5 flex flex-wrap gap-3 pb-2">
            <button
              type="button"
              onClick={() => setCat('all')}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-[12.5px] font-semibold transition-all ${
                cat === 'all'
                  ? 'border-gold-500/50 bg-gold-500/10 text-gold-700 shadow-sm'
                  : 'border-pine-900/10 bg-white text-ink/55 hover:border-gold-500/30 hover:text-pine-900'
              }`}
            >
              <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                cat === 'all' ? 'bg-gold-500/20 text-gold-600' : 'bg-pine-900/5 text-pine-900/40'
              }`}>
                <Search size={14} />
              </span>
              <span>{t['mediaPage.all']}</span>
              <span className={`ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                cat === 'all' ? 'bg-gold-500/20 text-gold-600' : 'bg-pine-900/5 text-pine-900/40'
              }`}>
                {catCounts.all}
              </span>
            </button>
            {categories.map((c) => {
              const Icon = CATEGORY_ICONS[c];
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCat(c)}
                  className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-[12.5px] font-semibold transition-all ${
                    cat === c
                      ? 'border-gold-500/50 bg-gold-500/10 text-gold-700 shadow-sm'
                      : 'border-pine-900/10 bg-white text-ink/55 hover:border-gold-500/30 hover:text-pine-900'
                  }`}
                >
                  <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                    cat === c ? 'bg-gold-500/20 text-gold-600' : 'bg-pine-900/5 text-pine-900/40'
                  }`}>
                    <Icon size={14} />
                  </span>
                  <span>{t[CATEGORY_KEYS[c]]}</span>
                  <span className={`ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                    cat === c ? 'bg-gold-500/20 text-gold-600' : 'bg-pine-900/5 text-pine-900/40'
                  }`}>
                    {catCounts[c] || 0}
                  </span>
                </button>
              );
            })}
          </div>

          {/* grid */}
          {filtered.length === 0 ? (
            <p className="mt-10 rounded-2xl border border-dashed border-pine-900/15 bg-white px-6 py-16 text-center text-sm text-pine-900/55">
              {t['mediaPage.empty']}
            </p>
          ) : (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((m, i) => (
                <Reveal key={m.id} delay={Math.min(i * 0.05, 0.3)}>
                  <MediaCard m={m} lang={lang} t={t} onOpen={() => setActive(m)} />
                </Reveal>
              ))}
            </div>
          )}
          </div>
        </div>
        </div>
      </section>

      {/* modal */}
      {active && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-pine-950/90 p-4 backdrop-blur-sm"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
          aria-label={active.title[lang]}
        >
          <div ref={modalRef} className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <button
              ref={closeRef}
              type="button"
              onClick={() => setActive(null)}
              aria-label={t['media.close']}
              className="absolute -top-12 right-0 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-ivory transition-colors hover:bg-white/10"
            >
              <X size={20} />
            </button>
            {active.type === 'video' ? (
              <div className="aspect-video w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube-nocookie.com/embed/${active.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                  title={active.title[lang]}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            ) : (
              <img
                src={active.src}
                alt={active.title[lang]}
                width={640}
                height={360}
                className="max-h-[82vh] w-auto rounded-2xl border border-white/10 shadow-2xl"
              />
            )}
          </div>
        </div>
      )}
    </main>
  );
}

function MediaCard({
  m,
  lang,
  t,
  onOpen,
}: {
  m: MediaEntry;
  lang: 'fr' | 'en';
  t: typeof UI['fr'];
  onOpen: () => void;
}) {
  const isDoc = m.type === 'document';
  const meta = `${t[CATEGORY_KEYS[m.category]]} · ${formatDate(m.date, lang)}`;

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-pine-900/10 bg-white shadow-[0_24px_60px_-45px_rgba(2,36,32,0.5)] transition-all duration-300 hover:-translate-y-1.5 hover:border-gold-500/40">
      {isDoc ? (
        <a
          href={m.url}
          target="_blank"
          rel="noreferrer"
          className="relative flex aspect-video items-center justify-center bg-gradient-to-br from-pine-800 to-pine-950"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold-500/15 text-gold-400 ring-1 ring-gold-500/40 transition-transform duration-300 group-hover:scale-110">
            <FileText size={24} />
          </span>
        </a>
      ) : (
        <button
          type="button"
          onClick={onOpen}
          className="relative block aspect-video w-full overflow-hidden text-left"
        >
          <img
            src={m.type === 'video' ? m.thumb : m.src}
            alt={m.title[lang]}
            width={320}
            height={180}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-pine-950/40 transition-colors group-hover:bg-pine-950/20" />
          <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gold-500 text-pine-950 shadow-xl transition-transform duration-300 group-hover:scale-110">
            {m.type === 'video' ? (
              <Play size={22} className="ml-0.5" fill="currentColor" />
            ) : (
              <ImageIcon size={22} />
            )}
          </span>
        </button>
      )}

      <div className="flex flex-1 flex-col p-5">
        <p className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-gold-500">{meta}</p>
        <h3 className="mt-2 flex-1 font-display text-[15.5px] font-semibold leading-snug text-pine-900">
          {m.title[lang]}
        </h3>
        {isDoc && (
          <a
            href={m.url}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-semibold text-gold-600 transition-colors hover:text-gold-500"
          >
            {t['mediaPage.download']}
            <ArrowUpRight size={13} />
          </a>
        )}
        {!isDoc && m.type === 'image' && (
          <button
            type="button"
            onClick={onOpen}
            className="mt-4 inline-flex items-center gap-1.5 text-left text-[12px] font-semibold text-gold-600 transition-colors hover:text-gold-500"
          >
            {t['mediaPage.view']}
            <ArrowUpRight size={13} />
          </button>
        )}
      </div>
    </div>
  );
}
