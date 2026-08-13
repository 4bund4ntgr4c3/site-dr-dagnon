import { useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { X, ArrowLeft, Search } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { localePath } from '@/i18n/routing';
import { MEDIA_ITEMS, type MediaEntry, type MediaCategory, type MediaType } from '@/data/media';
import { CATEGORY_MAP, TYPE_FILTERS, catLabelKey } from './categories';
import { CommunityView } from './CommunityView';
import { MediaCard } from './MediaCard';
import type { T } from './helpers';

/* CATEGORY VIEW — Top filter bar + chronological display */

export function CategoryView({
  category,
  lang,
  t,
}: {
  category: MediaCategory;
  lang: 'fr' | 'en';
  t: T;
}) {
  /* the type and search filters live in the URL (?type=&q=) so a filtered
     view can be shared and bookmarked; defaults are left out of the URL so
     the canonical link stays clean. replace keeps the back button useful —
     these are view state, not pages. */
  const [searchParams, setSearchParams] = useSearchParams();
  const type = (searchParams.get('type') as MediaType | null) ?? 'all';
  const search = searchParams.get('q') ?? '';
  const [active, setActive] = useState<MediaEntry | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const setFilter = (key: 'type' | 'q', value: string, default_: string) => {
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
        <Breadcrumbs
          items={[
            { label: t['breadcrumb.home'], to: localePath(lang, '/') },
            { label: t['mediaPage.badge'], to: localePath(lang, '/media') },
            { label: t[catLabelKey(category) as keyof typeof t] || category },
          ]}
        />
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
            {t[catLabelKey(category) as keyof typeof t] || category}
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
              {t[catLabelKey(category) as keyof typeof t] || category}
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
          <div className="mt-8 rounded-2xl border border-pine-900/10 bg-ivory p-4 shadow-card">
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
                  onChange={(e) => setFilter('q', e.target.value, '')}
                  placeholder={t['mediaPage.search'] || 'Rechercher...'}
                  className="w-full rounded-full border border-pine-900/15 bg-white py-2.5 pl-10 pr-4 text-sm text-ink outline-none transition-colors placeholder:text-ink/65 focus:border-gold-500/40 focus:ring-1 focus:ring-gold-500/10"
                />
              </div>

              {/* type filters */}
              <div className="flex flex-wrap gap-2">
                {TYPE_FILTERS.map((f) => (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => setFilter('type', f.value, 'all')}
                    aria-pressed={type === f.value}
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
