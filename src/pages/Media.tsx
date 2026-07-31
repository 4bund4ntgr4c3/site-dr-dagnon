import { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router';
import {
  Play,
  Pause,
  FileText,
  Image as ImageIcon,
  X,
  ArrowUpRight,
  ArrowLeft,
  Mic,
  Presentation,
  Search,
  Newspaper,
  Heart,
  Mic2,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  Camera,
} from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { NameHighlight } from '@/components/NameHighlight';
import { NotFoundView } from '@/components/NotFoundView';
import { useLang } from '@/i18n/useLang';
import { UI } from '@/i18n/translations';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { localePath } from '@/i18n/routing';
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
    key: 'speaking',
    icon: Mic2,
    color: 'from-emerald-600 to-emerald-800',
    bg: 'bg-emerald-700',
    ring: 'ring-emerald-500/40',
    badge: 'bg-emerald-100 text-emerald-700',
    thumb: 'https://img.youtube.com/vi/ZTW9HqJ57kA/hqdefault.jpg',
    descKey: 'mediaPage.catDescSpeaking',
  },
  {
    key: 'press',
    icon: Newspaper,
    color: 'from-rose-600 to-rose-800',
    bg: 'bg-rose-700',
    ring: 'ring-rose-500/40',
    badge: 'bg-rose-100 text-rose-700',
    thumb: '',
    descKey: 'mediaPage.catDescPress',
  },
  {
    key: 'community',
    icon: Heart,
    color: 'from-purple-600 to-purple-800',
    bg: 'bg-purple-700',
    ring: 'ring-purple-500/40',
    badge: 'bg-purple-100 text-purple-700',
    thumb: '/community/nuit-paludisme-1-thumb.webp',
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
  lang,
  t,
}: {
  lang: 'fr' | 'en';
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
            <Link
              to={localePath(lang, `/media/${cat.key}`)}
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
                <p className="flex-1 text-[13.5px] leading-relaxed text-ink/75">
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
            </Link>
          </Reveal>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   COMMUNITY VIEW — Album folders + Slideshow
   ═══════════════════════════════════════════════════════════════════ */

/* subtype → translation key; the label and the description live in
   translations.ts, not here, so both languages stay in one place */
const SUBTYPE_KEY: Record<string, string> = {
  'malaria-night': 'mediaPage.subMalariaNight',
  'nuit-paludisme-5e': 'mediaPage.subMalariaNight5e',
  'school-kits': 'mediaPage.subSchoolKits',
  genies: 'mediaPage.subGenies',
};

const subtypeLabel = (t: (typeof UI)['fr'], key: string) =>
  t[`${SUBTYPE_KEY[key] ?? ''}` as keyof typeof t] || key;
const subtypeDesc = (t: (typeof UI)['fr'], key: string) =>
  t[`${SUBTYPE_KEY[key] ?? ''}Desc` as keyof typeof t] || '';

/* dedicated 800px thumbnails: these are rendered in ~400px cards, so the
   full-size photo would be several times the bytes actually needed */
const ALBUM_COVERS: Record<string, string> = {
  'malaria-night': '/community/nuit-paludisme-1-thumb.webp',
  'nuit-paludisme-5e': '/community/nuit-paludisme-5e-1-thumb.webp',
  'school-kits': '/community/philantropie-1-thumb.webp',
  genies: '/community/genies-1-thumb.webp',
};

function CommunityView({
  lang,
  t,
}: {
  lang: 'fr' | 'en';
  t: (typeof UI)['fr'];
}) {
  const [activeAlbum, setActiveAlbum] = useState<string | null>(null);
  const [slideshowIndex, setSlideshowIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const albumKeys = useMemo(() => {
    const set = new Set(
      MEDIA_ITEMS.filter((m) => m.category === 'community' && m.subType).map((m) => m.subType!),
    );
    return Array.from(set);
  }, []);

  const albumPhotos = useMemo(() => {
    if (!activeAlbum) return [];
    return MEDIA_ITEMS.filter(
      (m) => m.category === 'community' && m.subType === activeAlbum,
    ).sort((a, b) => a.date.localeCompare(b.date));
  }, [activeAlbum]);

  const albumCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    MEDIA_ITEMS.filter((m) => m.category === 'community' && m.subType).forEach((m) => {
      counts[m.subType!] = (counts[m.subType!] || 0) + 1;
    });
    return counts;
  }, []);

  const goNext = useCallback(() => {
    if (albumPhotos.length === 0) return;
    setSlideshowIndex((prev) => (prev + 1) % albumPhotos.length);
  }, [albumPhotos.length]);

  /* resetting here rather than in an effect keyed on activeAlbum: the reset
     belongs to the act of opening an album, not to a render pass */
  const openAlbum = (key: string) => {
    setActiveAlbum(key);
    setSlideshowIndex(0);
    setIsAutoPlaying(true);
  };

  const goPrev = useCallback(() => {
    if (albumPhotos.length === 0) return;
    setSlideshowIndex((prev) => (prev - 1 + albumPhotos.length) % albumPhotos.length);
  }, [albumPhotos.length]);

  useEffect(() => {
    if (isAutoPlaying && activeAlbum && albumPhotos.length > 1) {
      autoPlayRef.current = setInterval(goNext, 2000);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isAutoPlaying, activeAlbum, albumPhotos.length, goNext]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') setActiveAlbum(null);
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    },
    [goNext, goPrev],
  );

  useFocusTrap(modalRef, closeRef, !!activeAlbum, () => setActiveAlbum(null));

  return (
    <>
      {/* album grid */}
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {albumKeys.map((key, i) => {
          const count = albumCounts[key] || 0;
          const cover = ALBUM_COVERS[key] || '';
          return (
            <Reveal key={key} delay={Math.min(i * 0.1, 0.3)}>
              <button
                type="button"
                onClick={() => openAlbum(key)}
                className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-pine-900/10 bg-white shadow-[0_24px_60px_-40px_rgba(2,36,32,0.45)] transition-all duration-300 hover:-translate-y-2 hover:border-gold-500/40 hover:shadow-[0_32px_70px_-30px_rgba(2,36,32,0.5)] text-left"
              >
                {/* cover image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  {cover ? (
                    <img
                      src={cover}
                      alt={subtypeLabel(t, key)}
                      width={400}
                      height={300}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-600 to-purple-800">
                      <FolderOpen size={48} className="text-white/25" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-pine-950/80 via-pine-950/20 to-transparent" />

                  {/* folder icon */}
                  <span className="absolute left-4 top-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gold-500 text-pine-950 shadow-lg transition-transform duration-300 group-hover:scale-110">
                    <FolderOpen size={22} />
                  </span>

                  {/* photo count */}
                  <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-pine-900 shadow">
                    {count} {count > 1 ? (lang === 'fr' ? 'photos' : 'photos') : (lang === 'fr' ? 'photo' : 'photo')}
                  </span>

                  {/* album title */}
                  <h3 className="absolute bottom-4 left-4 right-4 font-display text-xl font-semibold text-white drop-shadow-lg">
                    {subtypeLabel(t, key)}
                  </h3>
                </div>

                {/* description */}
                <div className="flex flex-1 flex-col p-5">
                  <p className="flex-1 text-[13px] leading-relaxed text-ink/75 line-clamp-3">
                    {subtypeDesc(t, key)}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-gold-600 transition-colors group-hover:text-gold-500">
                    <Camera size={14} />
                    {lang === 'fr' ? 'Voir l\'album' : 'View album'}
                  </span>
                </div>
              </button>
            </Reveal>
          );
        })}
      </div>

      {/* slideshow modal */}
      {activeAlbum && (
        <div
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-pine-950/95 p-4 backdrop-blur-sm"
          onClick={() => setActiveAlbum(null)}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-modal="true"
          aria-label={subtypeLabel(t, activeAlbum)}
          tabIndex={-1}
        >
          {/* header */}
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-4">
            <div>
              <h3 className="font-display text-lg font-semibold text-white">
                {subtypeLabel(t, activeAlbum)}
              </h3>
              <p className="text-[13px] text-white/60">
                {slideshowIndex + 1} / {albumPhotos.length}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* autoplay toggle */}
              {albumPhotos.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsAutoPlaying(!isAutoPlaying);
                  }}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all ${
                    isAutoPlaying
                      ? 'border-gold-500 bg-gold-500 text-pine-950 shadow-lg shadow-gold-500/30'
                      : 'border-white/30 bg-white/10 text-white hover:bg-white/20'
                  }`}
                  aria-label={isAutoPlaying ? (lang === 'fr' ? 'Pause' : 'Pause') : (lang === 'fr' ? 'Lecture' : 'Play')}
                >
                  {isAutoPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                </button>
              )}
              {/* close */}
              <button
                ref={closeRef}
                type="button"
                onClick={() => setActiveAlbum(null)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10"
                aria-label={t['media.close']}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* slideshow content */}
          <div
            ref={modalRef}
            className="relative flex w-full max-w-5xl items-center justify-center"
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => { if (activeAlbum) setIsAutoPlaying(true); }}
          >
            {albumPhotos.length > 0 && (
              <>
                {/* prev button */}
                {albumPhotos.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      goPrev();
                      setIsAutoPlaying(false);
                    }}
                    className="absolute -left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-pine-950/60 text-white backdrop-blur-sm transition-all hover:bg-white/20 lg:-left-16"
                    aria-label={lang === 'fr' ? 'Précédent' : 'Previous'}
                  >
                    <ChevronLeft size={24} />
                  </button>
                )}

                {/* photo */}
                <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
                  {/* only the current slide and its neighbours are mounted —
                      an album used to pull every photo down at once */}
                  {albumPhotos.map((photo, i) => {
                    const last = albumPhotos.length - 1;
                    const adjacent =
                      Math.abs(i - slideshowIndex) <= 1 ||
                      (slideshowIndex === 0 && i === last) ||
                      (slideshowIndex === last && i === 0);
                    if (!adjacent) return null;
                    return (
                      <img
                        key={photo.id}
                        src={photo.src}
                        alt={photo.title[lang]}
                        loading={i === slideshowIndex ? 'eager' : 'lazy'}
                        decoding="async"
                        className={`w-full object-contain max-h-[75vh] absolute inset-0 transition-opacity duration-700 ease-in-out ${
                          i === slideshowIndex ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                    );
                  })}
                  {/* placeholder to maintain aspect ratio */}
                  <img
                    src={albumPhotos[0].src}
                    alt=""
                    className="w-full object-contain max-h-[75vh] invisible"
                  />
                </div>

                {/* next button */}
                {albumPhotos.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      goNext();
                      setIsAutoPlaying(false);
                    }}
                    className="absolute -right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-pine-950/60 text-white backdrop-blur-sm transition-all hover:bg-white/20 lg:-right-16"
                    aria-label={lang === 'fr' ? 'Suivant' : 'Next'}
                  >
                    <ChevronRight size={24} />
                  </button>
                )}
              </>
            )}
          </div>

          {/* dots */}
          {albumPhotos.length > 1 && (
            <div className="mt-6 flex gap-2">
              {albumPhotos.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSlideshowIndex(i);
                    setIsAutoPlaying(false);
                  }}
                  className={`h-2 rounded-full transition-all ${
                    i === slideshowIndex
                      ? 'w-6 bg-gold-500'
                      : 'w-2 bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`${lang === 'fr' ? 'Photo' : 'Photo'} ${i + 1}`}
                />
              ))}
            </div>
          )}

          {/* photo caption */}
          {albumPhotos.length > 0 && (
            <p className="mt-4 max-w-2xl text-center text-[13px] text-white/60">
              {albumPhotos[slideshowIndex].title[lang]}
            </p>
          )}
        </div>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   CATEGORY VIEW — Top filter bar + chronological display
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
  const [search, setSearch] = useState('');
  const [active, setActive] = useState<MediaEntry | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const catMeta = CATEGORY_MAP[category];
  const CatIcon = catMeta.icon;

  const isCommunity = category === 'community';

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return MEDIA_ITEMS.filter((m) => {
      if (m.category !== category) return false;
      if (type !== 'all' && m.type !== type) return false;
      if (q) {
        const haystack = `${m.title[lang]} ${m.subType || ''}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    }).sort((a, b) => b.date.localeCompare(a.date));
  }, [category, type, search, lang]);

  useFocusTrap(modalRef, closeRef, !!active, () => setActive(null));

  return (
    <>
      {/* category hero */}
      <div className="mt-10">
        {/* mobile: stacked */}
        <div className="flex items-center justify-between gap-4 sm:hidden">
          <span
            className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${catMeta.bg} text-white ring-1 ${catMeta.ring}`}
          >
            <CatIcon size={28} />
          </span>
          <Link
            to={localePath(lang, '/media')}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-pine-900/15 bg-white px-5 py-2.5 text-[13px] font-semibold text-pine-900/70 shadow-sm transition-all hover:text-pine-900 hover:ring-gold-500/50"
          >
            <ArrowLeft size={15} />
            {t['mediaPage.back']}
          </Link>
        </div>
        <div className="mt-4 sm:hidden">
          <h2 className="font-display text-2xl font-semibold text-pine-900">
            {t[`mediaPage.cat${category.charAt(0).toUpperCase() + category.slice(1)}` as keyof typeof t] || category}
          </h2>
          <p className="mt-1 text-[14.5px] text-ink/70">
            {t[catMeta.descKey as keyof typeof t] || ''}
          </p>
        </div>

        {/* desktop: single row */}
        <div className="hidden sm:flex sm:items-center sm:gap-4">
          <span
            className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${catMeta.bg} text-white ring-1 ${catMeta.ring}`}
          >
            <CatIcon size={28} />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-3xl font-semibold text-pine-900">
              {t[`mediaPage.cat${category.charAt(0).toUpperCase() + category.slice(1)}` as keyof typeof t] || category}
            </h2>
            <p className="mt-1 text-[14.5px] text-ink/70">
              {t[catMeta.descKey as keyof typeof t] || ''}
            </p>
          </div>
          <Link
            to={localePath(lang, '/media')}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-pine-900/15 bg-white px-5 py-2.5 text-[13px] font-semibold text-pine-900/70 shadow-sm transition-all hover:text-pine-900 hover:ring-gold-500/50"
          >
            <ArrowLeft size={15} />
            {t['mediaPage.back']}
          </Link>
        </div>
      </div>

      {/* community — album folders view */}
      {isCommunity ? (
        <CommunityView lang={lang} t={t} />
      ) : (
        <>
          {/* top filter bar */}
          <div className="mt-8 rounded-2xl border border-pine-900/10 bg-ivory p-4 shadow-[0_24px_60px_-40px_rgba(2,36,32,0.45)]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-5">
              {/* search */}
              <div className="relative flex-1">
                <label htmlFor="media-search" className="sr-only">
                  {t['mediaPage.search'] || 'Rechercher...'}
                </label>
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/60" />
                <input
                  id="media-search"
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t['mediaPage.search'] || 'Rechercher...'}
                  className="w-full rounded-full border border-pine-900/15 bg-white py-2.5 pl-10 pr-4 text-sm text-ink outline-none transition-colors placeholder:text-ink/65 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
                />
              </div>

              {/* type filters */}
              <div className="flex flex-wrap gap-2">
                {TYPE_FILTERS.map((f) => (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => setType(f.value)}
                    className={`rounded-full px-4 py-1.5 text-[12.5px] font-semibold transition-all ${
                      type === f.value
                        ? 'bg-pine-950 text-gold-400 shadow'
                        : 'bg-pine-900/5 text-ink/75 ring-1 ring-pine-900/10 hover:text-pine-900 hover:ring-gold-500/50'
                    }`}
                  >
                    {t[f.key]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* results count */}
          <p className="mt-5 text-[13px] font-medium text-pine-900/75">
            {t['mediaPage.results'].replace('{n}', String(filtered.length))}
          </p>

          {/* simple grid display */}
          {filtered.length === 0 ? (
            <p className="mt-10 rounded-2xl border border-dashed border-pine-900/15 bg-white px-6 py-16 text-center text-sm text-pine-900/75">
              {t['mediaPage.empty']}
            </p>
          ) : (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((m, i) => (
                <Reveal key={m.id} delay={Math.min(i * 0.05, 0.3)}>
                  <MediaCard m={m} lang={lang} t={t} onOpen={() => setActive(m)} />
                </Reveal>
              ))}
            </div>
          )}

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
  'speaking',
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

  const invalidCategory = urlCategory && !selectedCategory;

  /* No title/robots handling here: an unknown category is a path outside the
     route list, so <Seo /> already marks it noindex and gives it a translated
     404 title. This used to set them itself — hardcoded in French, on English
     pages too — and the two fought over the same tags. */

  if (invalidCategory) {
    return <NotFoundView backHref="/media" />;
  }

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
              {selectedCategory
                ? t[`mediaPage.cat${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}` as keyof typeof t]
                : t['mediaPage.badge']}
              {' — '}
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
            <MediaLanding lang={lang} t={t} />
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
          className="relative flex aspect-video items-center justify-center overflow-hidden bg-gradient-to-br from-pine-800 to-pine-950"
        >
          {m.thumb ? (
            <img
              src={m.thumb}
              alt={m.title[lang]}
              width={320}
              height={180}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold-500/15 text-gold-400 ring-1 ring-gold-500/40 transition-transform duration-300 group-hover:scale-110">
              <FileText size={24} />
            </span>
          )}
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
        <h3 className="mt-2 font-display text-[15.5px] font-semibold leading-snug text-pine-900">
          {m.title[lang]}
        </h3>
        {m.description && (
          <p className="mt-2 flex-1 text-[12.5px] leading-relaxed text-pine-900/60 line-clamp-3">{m.description[lang]}</p>
        )}
        {isDoc && (
          <a
            href={m.url}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-semibold text-gold-600 transition-colors hover:text-gold-500"
          >
            {m.category === 'press' ? t['mediaPage.readMore'] : t['mediaPage.download']}
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
