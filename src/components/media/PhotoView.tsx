import { useMemo } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ShareButtons } from '@/components/ShareButtons';
import { PHOTO_DIMS, absUrl } from '@/seo/meta';
import { localePath } from '@/i18n/routing';
import { MEDIA_ITEMS, type MediaEntry } from '@/data/media';
import { formatDate, photoOrder, subtypeDesc, subtypeLabel, type T } from './helpers';

/* PHOTO PAGE — one crawlable page per community photo, so every caption
   is indexable text and every image has its own shareable URL */

export function PhotoView({ photo, lang, t }: { photo: MediaEntry; lang: 'fr' | 'en'; t: T }) {
  const albumPhotos = useMemo(
    () =>
      MEDIA_ITEMS.filter((m) => m.category === 'community' && m.subType === photo.subType).sort(
        (a, b) => b.date.localeCompare(a.date) || photoOrder(b.id) - photoOrder(a.id),
      ),
    [photo.subType],
  );
  const position = albumPhotos.findIndex((p) => p.id === photo.id);
  const prev = position > 0 ? albumPhotos[position - 1] : null;
  const next = position >= 0 && position < albumPhotos.length - 1 ? albumPhotos[position + 1] : null;
  const dims = PHOTO_DIMS[photo.id] || { width: 1280, height: 853 };
  const albumLabel = subtypeLabel(t, photo.subType || '');
  const albumDesc = subtypeDesc(t, photo.subType || '');
  const photoUrl = (id: string) => localePath(lang, `/media/community/${id}`);

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen overflow-x-hidden">
      {/* header — hero background */}
      <section className="relative overflow-hidden bg-pine-950">
        <div className="absolute inset-0 texture-net" />
        <div className="absolute -top-40 -right-40 h-[560px] w-[560px] rounded-full bg-pine-600/25 blur-[130px]" />
        <div className="absolute bottom-0 -left-40 h-[460px] w-[460px] rounded-full bg-gold-600/12 blur-[120px]" />

        <div className="relative mx-auto max-w-6xl px-5 pb-24 pt-32 lg:px-8 lg:pt-36">
          <Reveal>
            <Breadcrumbs
              dark
              items={[
                { label: t['breadcrumb.home'], to: localePath(lang, '/') },
                { label: t['mediaPage.badge'], to: localePath(lang, '/media') },
                { label: t['mediaPage.catCommunity'], to: localePath(lang, '/media/community') },
                { label: albumLabel },
              ]}
            />
            <h1 className="mt-6 max-w-4xl font-display text-2xl leading-[1.15] font-medium text-pine-100 sm:text-4xl">
              {photo.title[lang]}
            </h1>
            <p className="mt-3 text-[13px] text-pine-200/70">
              {albumLabel} · {formatDate(photo.date, lang)}
            </p>
          </Reveal>
        </div>
      </section>

      {/* content — light */}
      <section className="bg-pine-50 py-16 lg:py-20">
        <div className="relative mx-auto max-w-6xl px-5 lg:px-8">
          <figure className="mx-auto max-w-5xl">
            <div className="overflow-hidden rounded-2xl border border-pine-900/10 bg-white shadow-2xl">
              <img
                src={photo.src}
                alt={photo.title[lang]}
                width={dims.width}
                height={dims.height}
                decoding="async"
                className="mx-auto max-h-[80vh] w-auto max-w-full object-contain"
              />
            </div>
            <figcaption className="mx-auto mt-5 max-w-3xl text-center font-display text-lg font-medium text-pine-900">
              {photo.title[lang]}
            </figcaption>
            <div className="mx-auto mt-5 flex justify-center">
              <ShareButtons title={photo.title[lang]} url={absUrl(lang, `/media/community/${photo.id}`)} />
            </div>
          </figure>

          {albumDesc && (
            <p className="mx-auto mt-4 max-w-3xl text-center text-[14px] leading-relaxed text-ink/70">
              {albumDesc}
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to={localePath(lang, '/media/community')}
              className="inline-flex items-center gap-2 rounded-full border border-pine-900/15 bg-white px-5 py-2.5 text-[13px] font-semibold text-pine-900/75 shadow-sm transition-all hover:text-pine-900 hover:ring-gold-500/50"
            >
              <ArrowLeft size={15} />
              {lang === 'fr' ? `Retour à l'album ${albumLabel}` : `Back to ${albumLabel} album`}
            </Link>
            <span className="text-[12.5px] font-medium text-pine-900/75">
              {position + 1} / {albumPhotos.length}
            </span>
          </div>

          {/* prev / next — real links, crawlable both ways */}
          {(prev || next) && (
            <nav aria-label={lang === 'fr' ? 'Navigation entre photos' : 'Photo navigation'} className="mx-auto mt-8 grid max-w-2xl gap-4 sm:grid-cols-2">
              {prev ? (
                <Link
                  to={photoUrl(prev.id)}
                  className="inline-flex items-center gap-2 justify-self-start rounded-full border border-pine-900/15 bg-white px-5 py-2.5 text-[13px] font-semibold text-pine-900/75 shadow-sm transition-all hover:text-pine-900 hover:ring-gold-500/50"
                >
                  <ChevronLeft size={15} />
                  <span className="line-clamp-1">{lang === 'fr' ? 'Photo précédente' : 'Previous photo'}</span>
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link
                  to={photoUrl(next.id)}
                  className="inline-flex items-center gap-2 justify-self-end rounded-full border border-pine-900/15 bg-white px-5 py-2.5 text-[13px] font-semibold text-pine-900/75 shadow-sm transition-all hover:text-pine-900 hover:ring-gold-500/50"
                >
                  <span className="line-clamp-1">{lang === 'fr' ? 'Photo suivante' : 'Next photo'}</span>
                  <ChevronRight size={15} />
                </Link>
              ) : (
                <span />
              )}
            </nav>
          )}

          {/* the album's photos — every photo links to its own page */}
          <h2 className="mt-14 text-center font-display text-xl font-semibold text-pine-900">
            {lang === 'fr' ? `Photos de l'album ${albumLabel}` : `Photos from the album ${albumLabel}`}
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {albumPhotos.map((p) => (
              <Link
                key={p.id}
                to={photoUrl(p.id)}
                aria-label={p.title[lang]}
                className={`group overflow-hidden rounded-xl border bg-white shadow-card transition-all hover:-translate-y-1 ${
                  p.id === photo.id ? 'border-gold-500 ring-2 ring-gold-500/40' : 'border-pine-900/10'
                }`}
              >
                <img
                  src={p.src}
                  alt={p.title[lang]}
                  width={400}
                  height={300}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/3] h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
