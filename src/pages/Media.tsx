import { useParams } from 'react-router';
import { NameHighlight } from '@/components/NameHighlight';
import { NotFoundView } from '@/components/NotFoundView';
import { Reveal } from '@/components/Reveal';
import { CategoryView } from '@/components/media/CategoryView';
import { MediaLanding } from '@/components/media/MediaLanding';
import { PhotoView } from '@/components/media/PhotoView';
import { ConferenceStudio } from '@/components/ConferenceStudio';
import { MEDIA_ITEMS, type MediaCategory } from '@/data/media';
import { useLang } from '@/i18n/useLang';
import { UI } from '@/i18n/translations';

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
  const { category: urlCategory, photoId } = useParams<{ category?: string; photoId?: string }>();

  const selectedCategory: MediaCategory | null =
    urlCategory && VALID_CATEGORIES.includes(urlCategory as MediaCategory)
      ? (urlCategory as MediaCategory)
      : null;

  const invalidCategory = urlCategory && !selectedCategory && !photoId;

  /* a photo page — /media/community/:photoId — renders its own layout */
  if (photoId) {
    const photo = MEDIA_ITEMS.find((m) => m.id === photoId && m.category === 'community');
    if (!photo) return <NotFoundView backHref="/media/community" />;
    return <PhotoView photo={photo} lang={lang} t={t} />;
  }

  /* No title/robots handling here: an unknown category is a path outside the
     route list, so <Seo /> already marks it noindex and gives it a translated
     404 title. This used to set them itself — hardcoded in French, on English
     pages too — and the two fought over the same tags. */

  if (invalidCategory) {
    return <NotFoundView backHref="/media" />;
  }

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen overflow-x-hidden">
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

      {/* Interactive Keynotes & Conference Studio */}
      <section className="bg-pine-950 py-16 lg:py-20 border-t border-gold-500/20">
        <div className="relative mx-auto max-w-6xl px-5 lg:px-8">
          <Reveal>
            <ConferenceStudio />
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
