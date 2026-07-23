import { useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router';
import {
  Play,
  FileText,
  Image as ImageIcon,
  X,
  ArrowUpRight,
  ArrowLeft,
  Mic,
  Presentation,
  Search,
  BookOpen,
  Newspaper,
  Heart,
} from 'lucide-react';
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

/* ── Category metadata ──────────────────────────────────────────── */

const CATEGORIES: {
  key: MediaCategory;
  icon: typeof Mic;
  color: string;
  bg: string;
  ring: string;
  badge: string;
  thumb: string;
  descKey: string;
}[] = [
  {
    key: 'interview',
    icon: Mic,
    color: 'from-pine-600 to-pine-800',
    bg: 'bg-pine-700',
    ring: 'ring-pine-500/40',
    badge: 'bg-pine-100 text-pine-700',
    thumb: 'https://img.youtube.com/vi/5yh0ODmp47s/hqdefault.jpg',
    descKey: 'mediaPage.catDescInterview',
  },
  {
    key: 'conference',
    icon: Presentation,
    color: 'from-gold-600 to-gold-800',
    bg: 'bg-gold-700',
    ring: 'ring-gold-500/40',
    badge: 'bg-gold-100 text-gold-700',
    thumb: 'https://img.youtube.com/vi/D8kTMA4dDyg/hqdefault.jpg',
    descKey: 'mediaPage.catDescConference',
  },
  {
    key: 'research',
    icon: Search,
    color: 'from-emerald-600 to-emerald-800',
    bg: 'bg-emerald-700',
    ring: 'ring-emerald-500/40',
    badge: 'bg-emerald-100 text-emerald-700',
    thumb: 'https://img.youtube.com/vi/7zuqZfH4bzQ/hqdefault.jpg',
    descKey: 'mediaPage.catDescResearch',
  },
  {
    key: 'publication',
    icon: BookOpen,
    color: 'from-amber-600 to-amber-800',
    bg: 'bg-amber-700',
    ring: 'ring-amber-500/40',
    badge: 'bg-amber-100 text-amber-700',
    thumb: '',
    descKey: 'mediaPage.catDescPublication',
  },
  {
    key: 'press',
    icon: Newspaper,
    color: 'from-rose-600 to-rose-800',
    bg: 'bg-rose-700',
    ring: 'ring-rose-500/40',
    badge: 'bg-rose-100 text-rose-700',
    thumb: 'https://img.youtube.com/vi/dxBGiEW41aM/hqdefault.jpg',
    descKey: 'mediaPage.catDescPress',
  },
  {
    key: 'community',
    icon: Heart,
    color: 'from-purple-600 to-purple-800',
    bg: 'bg-purple-700',
    ring: 'ring-purple-500/40',
    badge: 'bg-purple-100 text-purple-700',
    thumb: '',
    descKey: 'mediaPage.catDescCommunity',
  },
];

const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map((c) => [c.key, c]),
) as Record<MediaCategory, (typeof CATEGORIES)[number]>;

/* ── Helpers ────────────────────────────────────────────────────── */

function formatDate(iso: string, lang: 'fr' | 'en') {
  return new Date(iso).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

const TYPE_FILTERS: { value: MediaType | 'all'; key: string }[] = [
  { value: 'all', key: 'mediaPage.all' },
  { value: 'video', key: 'mediaPage.typeVideo' },
  { value: 'image', key: 'mediaPage.typeImage' },
  { value: 'document', key: 'mediaPage.typeDocument' },
];

/* ═══════════════════════════════════════════════════════════════════
   LANDING PAGE — Category cards
   ═══════════════════════════════════════════════════════════════════ */

function MediaLanding({
  t,
}: {
  t: (typeof UI)['fr'];
}) {
  const catCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    MEDIA_ITEMS.forEach((m) => {
      counts[m.category] = (counts[m.category] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {CATEGORIES.map((cat, i) => {
        const Icon = cat.icon;
        const count = catCounts[cat.key] || 0;

        return (
          <Reveal key={cat.key} delay={Math.min(i * 0.08, 0.4)}>
            <a
              href={`/media/${cat.key}`}
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-pine-900/10 bg-white shadow-[0_24px_60px_-40px_rgba(2,36,32,0.45)] transition-all duration-300 hover:-translate-y-2 hover:border-gold-500/40 hover:shadow-[0_32px_70px_-30px_rgba(2,36,32,0.5)]"
            >
              {/* Thumbnail */}
              <div className="relative aspect-[16/9] overflow-hidden">
                {cat.thumb ? (
                  <img
                    src={cat.thumb}
                    alt={t[`mediaPage.cat${cat.key.charAt(0).toUpperCase() + cat.key.slice(1)}` as keyof typeof t] || cat.key}
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
                  {count} {t['mediaPage.all'] === 'Tout' ? (count > 1 ? 'éléments' : 'élément') : (count > 1 ? 'items' : 'item')}
                </span>

                {/* Title on image */}
                <h3 className="absolute bottom-4 left-4 right-4 font-display text-xl font-semibold text-white drop-shadow-lg">
                  {t[`mediaPage.cat${cat.key.charAt(0).toUpperCase() + cat.key.slice(1)}` as keyof typeof t] || cat.key}
                </h3>
              </div>

              {/* Description */}
              <div className="flex flex-1 flex-col p-5">
                <p className="flex-1 text-[13.5px] leading-relaxed text-ink/55">
                  {t[cat.descKey as keyof typeof t] || ''}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-gold-600 transition-colors group-hover:text-gold-500">
                  {t['mediaPage.all'] === 'Tout' ? 'Explorer' : 'Explore'}
                  <ArrowUpRight
                    size={14}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </span>
              </div>
            </a>
          </Reveal>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   CATEGORY VIEW — Items with filters + sidebar
   ═══════════════════════════════════════════════════════════════════ */

function CategoryView({
  category,
  lang,
  t,
}: {
  category: MediaCategory;
  lang: 'fr' | 'en';
  t: (typeof UI)['fr'];
}) {
  const [type, setType] = useState<MediaType | 'all'>('all');
  const [year, setYear] = useState<string>('all');
  const [sort, setSort] = useState<'desc' | 'asc'>('desc');
  const [active, setActive] = useState<MediaEntry | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const catMeta = CATEGORY_MAP[category];
  const CatIcon = catMeta.icon;

  const years = useMemo(() => {
    const set = new Set(
      MEDIA_ITEMS.filter((m) => m.category === category).map((m) =>
        m.date.slice(0, 4),
      ),
    );
    return Array.from(set).sort((a, b) => b.localeCompare(a));
  }, [category]);

  const filtered = useMemo(() => {
    return MEDIA_ITEMS.filter((m) => {
      if (m.category !== category) return false;
      if (type !== 'all' && m.type !== type) return false;
      if (year !== 'all' && !m.date.startsWith(year)) return false;
      return true;
    }).sort((a, b) => {
      const cmp = a.date.localeCompare(b.date);
      return sort === 'desc' ? -cmp : cmp;
    });
  }, [category, type, year, sort]);

  useFocusTrap(modalRef, closeRef, !!active, () => setActive(null));

  return (
    <>
      {/* category hero */}
      <div className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-7">
        <span
          className={`flex h-16 w-16 items-center justify-center rounded-2xl ${catMeta.bg} text-white ring-1 ${catMeta.ring}`}
        >
          <CatIcon size={28} />
        </span>
        <div className="flex-1">
          <h2 className="font-display text-2xl font-semibold text-pine-900 sm:text-3xl">
            {t[`mediaPage.cat${category.charAt(0).toUpperCase() + category.slice(1)}` as keyof typeof t] || category}
          </h2>
          <p className="mt-1 text-[14.5px] text-ink/50">
            {t[catMeta.descKey as keyof typeof t] || ''}
          </p>
        </div>
        <a
          href="/media"
          className="inline-flex items-center gap-2 rounded-full border border-pine-900/15 bg-white px-5 py-2.5 text-[13px] font-semibold text-pine-900/70 shadow-sm transition-all hover:text-pine-900 hover:ring-gold-500/50 shrink-0"
        >
          <ArrowLeft size={15} />
          {t['mediaPage.back']}
        </a>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr] lg:items-start">
        {/* sidebar */}
        <aside className="lg:sticky lg:top-24">
          <div className="rounded-2xl border border-pine-900/10 bg-ivory p-4 shadow-[0_24px_60px_-40px_rgba(2,36,32,0.45)]">
            <div className="space-y-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-pine-900/50">
                  {t['mediaPage.filterType']}
                </p>
                <div
                  role="group"
                  aria-label={t['mediaPage.filterType']}
                  className="mt-2 flex flex-wrap gap-2"
                >
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
                  {t['mediaPage.filterYear']}
                </p>
                <div
                  role="group"
                  aria-label={t['mediaPage.filterYear']}
                  className="mt-2 flex flex-wrap gap-2"
                >
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
                <div
                  role="group"
                  aria-label={t['mediaPage.filterSort']}
                  className="mt-2 flex flex-wrap gap-2"
                >
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

        {/* items grid */}
        <div>
          <p className="text-[13px] font-medium text-pine-900/50">
            {t['mediaPage.results'].replace('{n}', String(filtered.length))}
          </p>

          {filtered.length === 0 ? (
            <p className="mt-10 rounded-2xl border border-dashed border-pine-900/15 bg-white px-6 py-16 text-center text-sm text-pine-900/50">
              {t['mediaPage.empty']}
            </p>
          ) : (
            <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((m, i) => (
                <Reveal key={m.id} delay={Math.min(i * 0.05, 0.3)}>
                  <MediaCard m={m} lang={lang} t={t} onOpen={() => setActive(m)} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* modal */}
      {active && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-pine-950/90 p-4 backdrop-blur-sm"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
          aria-label={active.title[lang]}
        >
          <div
            ref={modalRef}
            className="relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
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
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════════ */

const VALID_CATEGORIES: MediaCategory[] = [
  'interview',
  'conference',
  'research',
  'publication',
  'press',
  'community',
];

export default function MediaPage() {
  const { lang } = useLang();
  const t = UI[lang];
  const { category: urlCategory } = useParams<{ category?: string }>();

  const selectedCategory: MediaCategory | null =
    urlCategory && VALID_CATEGORIES.includes(urlCategory as MediaCategory)
      ? (urlCategory as MediaCategory)
      : null;

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
              {selectedCategory
                ? t[`mediaPage.cat${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}` as keyof typeof t] || t['mediaPage.intro']
                : t['mediaPage.intro']}
            </p>
          </Reveal>
        </div>
      </section>

      {/* content — light */}
      <section className="bg-pine-50 py-16 lg:py-20">
        <div className="relative mx-auto max-w-6xl px-5 lg:px-8">
          {selectedCategory ? (
            <CategoryView category={selectedCategory} lang={lang} t={t} />
          ) : (
            <MediaLanding t={t} />
          )}
        </div>
      </section>
    </main>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MEDIA CARD (shared by category view)
   ═══════════════════════════════════════════════════════════════════ */

function MediaCard({
  m,
  lang,
  t,
  onOpen,
}: {
  m: MediaEntry;
  lang: 'fr' | 'en';
  t: (typeof UI)['fr'];
  onOpen: () => void;
}) {
  const isDoc = m.type === 'document';
  const meta = `${t[`mediaPage.cat${m.category.charAt(0).toUpperCase() + m.category.slice(1)}` as keyof typeof t] || m.category} · ${formatDate(m.date, lang)}`;

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
        <p className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-gold-500">
          {meta}
        </p>
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
