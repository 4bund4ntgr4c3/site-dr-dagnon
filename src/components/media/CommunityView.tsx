import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import {
  Heart,
  Sparkles,
  GraduationCap,
  Award,
  Camera,
  Quote,
  BookOpen,
  Users,
  Calendar,
} from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { PhotoLightbox } from '@/components/PhotoLightbox';
import { MEDIA_ITEMS, type MediaEntry } from '@/data/media';
import { PHILANTHROPIC_INITIATIVES, PHILANTHROPIC_STATS } from '@/data/philanthropy';
import { PHOTO_DIMS } from '@/seo/meta';
import { localePath } from '@/i18n/routing';
import { type T } from './helpers';

/* COMMUNITY & PHILANTHROPY HUB — Editorial deep-dives + Grouped initiatives with distinguished events */

export function CommunityView({ lang, t }: { lang: 'fr' | 'en'; t: T }) {
  const [lightboxState, setLightboxState] = useState<{
    isOpen: boolean;
    photos: MediaEntry[];
    title: string;
    initialIndex: number;
  }>({
    isOpen: false,
    photos: [],
    title: '',
    initialIndex: 0,
  });

  const photosById = useMemo(() => {
    const map = new Map<string, MediaEntry>();
    for (const m of MEDIA_ITEMS) {
      if (m.category === 'community') {
        map.set(m.id, m);
      }
    }
    return map;
  }, []);

  const openLightbox = (photos: MediaEntry[], title: string, initialIndex = 0) => {
    setLightboxState({
      isOpen: true,
      photos,
      title,
      initialIndex,
    });
  };

  const getPillarIcon = (id: string) => {
    switch (id) {
      case 'nuit-paludisme':
        return Award;
      case 'school-kits':
        return BookOpen;
      case 'genies-en-herbe':
        return GraduationCap;
      default:
        return Heart;
    }
  };

  return (
    <div className="space-y-20 pt-4">
      {/* ── Manifesto & Mission Overview ──────────────────────────────── */}
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-gold-500/30 bg-gradient-to-br from-pine-950 via-pine-900 to-pine-950 p-6 sm:p-10 lg:p-14 text-pine-100 shadow-2xl">
          <div className="absolute inset-0 texture-net opacity-20 pointer-events-none" />
          <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-gold-500/15 blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-emerald-600/15 blur-[100px] pointer-events-none" />

          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-gold-400/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-300">
              <Heart size={13} className="text-gold-400 fill-gold-400" />
              {t['communityHub.badge']}
            </span>

            <h2 className="mt-5 font-display text-2xl sm:text-4xl lg:text-5xl font-medium text-white leading-tight">
              {t['communityHub.title']}
            </h2>

            <p className="mt-4 max-w-3xl text-sm sm:text-base leading-relaxed text-pine-200/90 font-light">
              {t['communityHub.intro']}
            </p>

            {/* Overall stats strip */}
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 border-t border-pine-800/80 pt-8">
              {PHILANTHROPIC_STATS.map((stat, idx) => (
                <div key={idx} className="flex flex-col">
                  <span className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-gold-300">
                    {stat.value}
                  </span>
                  <span className="mt-1.5 text-xs text-pine-300/80 leading-snug">
                    {stat.label[lang]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      {/* ── Quick navigation bar (The 3 Core Pillars) ──────────────────── */}
      <Reveal>
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 rounded-2xl border border-pine-900/10 bg-white p-3 shadow-card">
          <span className="px-3 text-xs font-semibold uppercase tracking-wider text-pine-950/60 hidden md:inline">
            {lang === 'fr' ? 'Les 3 Piliers :' : 'The 3 Pillars:'}
          </span>
          {PHILANTHROPIC_INITIATIVES.map((init, i) => (
            <a
              key={init.id}
              href={`#${init.id}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-pine-900/5 px-4 py-2 text-xs font-medium text-pine-950 transition-colors hover:bg-gold-500/15 hover:text-gold-800"
            >
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-pine-900/10 text-[10px] font-bold text-pine-900">
                {i + 1}
              </span>
              <span className="font-medium">{init.title[lang].split(' : ')[1] || init.title[lang]}</span>
            </a>
          ))}
        </div>
      </Reveal>

      {/* ── Deep Dive: The 3 Core Philanthropic Pillars ─────────────────── */}
      <div className="space-y-24">
        {PHILANTHROPIC_INITIATIVES.map((init, idx) => {
          const Icon = getPillarIcon(init.id);
          const allInitiativePhotos = init.allPhotoIds
            .map((id) => photosById.get(id))
            .filter(Boolean) as MediaEntry[];

          return (
            <section
              key={init.id}
              id={init.id}
              aria-labelledby={`heading-${init.id}`}
              className="scroll-mt-24"
            >
              <Reveal>
                <div className="overflow-hidden rounded-3xl border border-pine-900/10 bg-white shadow-card transition-shadow hover:shadow-card-hover">
                  {/* Initiative Header */}
                  <div className="border-b border-pine-900/10 bg-gradient-to-r from-pine-900/5 via-gold-500/5 to-transparent p-6 sm:p-8 lg:p-10">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pine-950 text-gold-400 shadow-md">
                          <Icon size={22} />
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-gold-700">
                              {lang === 'fr' ? `Pilier 0${idx + 1}` : `Pillar 0${idx + 1}`}
                            </span>
                            <span className="text-xs text-ink/40">·</span>
                            <span className="text-xs font-medium text-ink/60">{init.period}</span>
                            <span className="text-xs text-ink/40">·</span>
                            <span className="text-xs font-medium text-ink/60">
                              {init.location[lang]}
                            </span>
                          </div>
                          <h3
                            id={`heading-${init.id}`}
                            className="font-display text-xl sm:text-2xl lg:text-3xl font-semibold text-pine-950 mt-1"
                          >
                            {init.title[lang]}
                          </h3>
                        </div>
                      </div>

                      {/* Partner badge */}
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-500/30 bg-gold-50 px-4 py-1.5 text-xs font-semibold text-gold-900 shadow-sm">
                        <Sparkles size={13} className="text-gold-600" />
                        <span>{init.partner.name}</span>
                      </span>
                    </div>

                    <p className="mt-4 text-sm sm:text-base font-display italic text-pine-900/80">
                      {init.subtitle[lang]}
                    </p>
                  </div>

                  {/* Narrative Body */}
                  <div className="p-6 sm:p-8 lg:p-10">
                    <div className="grid gap-8 lg:grid-cols-12">
                      {/* Context & Action (7 cols) */}
                      <div className="space-y-6 lg:col-span-7">
                        <div>
                          <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-pine-950/60">
                            <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
                            {t['communityHub.contextLabel']}
                          </h4>
                          <p className="mt-2 text-sm sm:text-[14.5px] leading-relaxed text-ink/80">
                            {init.context[lang]}
                          </p>
                        </div>

                        <div>
                          <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-pine-950/60">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                            {t['communityHub.actionLabel']}
                          </h4>
                          <p className="mt-2 text-sm sm:text-[14.5px] leading-relaxed text-ink/80">
                            {init.mission[lang]}
                          </p>
                        </div>

                        {/* Quote callout */}
                        <div className="rounded-2xl border-l-4 border-gold-500 bg-gold-500/5 p-4 sm:p-5">
                          <div className="flex items-start gap-3">
                            <Quote size={18} className="shrink-0 text-gold-600 mt-0.5" />
                            <blockquote className="text-xs sm:text-[13.5px] italic text-pine-900 leading-relaxed font-display">
                              {init.quote[lang]}
                            </blockquote>
                          </div>
                        </div>
                      </div>

                      {/* Key metrics cards (5 cols) */}
                      <div className="flex flex-col justify-between space-y-4 lg:col-span-5 rounded-2xl border border-pine-900/10 bg-pine-50/50 p-5 sm:p-6">
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-pine-950">
                            {t['communityHub.statsTitle']}
                          </h4>
                          <div className="mt-4 space-y-4">
                            {init.metrics.map((metric, mIdx) => (
                              <div
                                key={mIdx}
                                className="rounded-xl border border-white bg-white p-3.5 shadow-sm"
                              >
                                <span className="font-display text-xl sm:text-2xl font-bold text-pine-950">
                                  {metric.value}
                                </span>
                                <p className="mt-0.5 text-xs text-ink/75 leading-tight">
                                  {metric.label[lang]}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Partner citation */}
                        <div className="pt-2 border-t border-pine-900/10 text-xs text-ink/60">
                          <span className="font-semibold text-pine-900">{t['communityHub.partnerLabel']} :</span>{' '}
                          {init.partner.name} ({init.partner.role[lang]})
                        </div>
                      </div>
                    </div>

                    {/* ── Visual Section: Sub-Editions (e.g. Night Against Malaria) or Standard Gallery ── */}
                    {init.editions && init.editions.length > 0 ? (
                      <div className="mt-12 pt-8 border-t border-pine-900/10 space-y-12">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <h4 className="font-display text-xl font-semibold text-pine-950">
                              {t['communityHub.editionsTitle']}
                            </h4>
                            <p className="text-xs text-ink/65 mt-0.5">
                              {lang === 'fr'
                                ? 'Dr. Seynudé Dagnon parraine et préside La Nuit du Paludisme depuis son lancement en 2021.'
                                : 'Dr. Seynudé Dagnon has sponsored and chaired The Night Against Malaria since its inception in 2021.'}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              openLightbox(allInitiativePhotos, init.title[lang], 0)
                            }
                            className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-50 px-4 py-2 text-xs font-semibold text-pine-950 shadow-sm transition-all hover:bg-gold-500 hover:text-white"
                          >
                            <Camera size={14} className="text-gold-600" />
                            <span>
                              {t['communityHub.allNuitPhotos'].replace(
                                '{count}',
                                String(allInitiativePhotos.length),
                              )}
                            </span>
                          </button>
                        </div>

                        {/* Distinguished Edition Blocks */}
                        <div className="space-y-10">
                          {init.editions.map((edition) => {
                            const editionPhotos = edition.photoIds
                              .map((id) => photosById.get(id))
                              .filter(Boolean) as MediaEntry[];

                            return (
                              <div
                                key={edition.id}
                                className="rounded-2xl border border-pine-900/10 bg-ivory/60 p-5 sm:p-6"
                              >
                                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-pine-900/10 pb-4 mb-5">
                                  <div className="max-w-2xl">
                                    <div className="flex items-center gap-2">
                                      <span className="inline-flex items-center gap-1 rounded-md bg-pine-950 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold-400">
                                        <Calendar size={11} />
                                        {edition.date.slice(0, 4)}
                                      </span>
                                      <span className="text-xs font-medium text-ink/60">
                                        {editionPhotos.length}{' '}
                                        {editionPhotos.length > 1 ? 'photos' : 'photo'}
                                      </span>
                                    </div>
                                    <h5 className="font-display text-base sm:text-lg font-semibold text-pine-950 mt-1">
                                      {edition.title[lang]}
                                    </h5>
                                    <p className="mt-1 text-xs text-ink/75 leading-relaxed">
                                      {edition.description[lang]}
                                    </p>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      openLightbox(editionPhotos, edition.title[lang], 0)
                                    }
                                    className="inline-flex items-center gap-2 rounded-full border border-pine-900/15 bg-white px-3.5 py-1.5 text-xs font-semibold text-pine-900 shadow-sm transition-all hover:bg-gold-50 hover:text-gold-900"
                                  >
                                    <Camera size={13} className="text-gold-600" />
                                    <span>
                                      {t['communityHub.viewEditionPhotos'].replace(
                                        '{count}',
                                        String(editionPhotos.length),
                                      )}
                                    </span>
                                  </button>
                                </div>

                                {/* Edition Photo Grid */}
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 sm:gap-4">
                                  {editionPhotos.map((photo) => {
                                    const dims = PHOTO_DIMS[photo.id] || { width: 1280, height: 853 };
                                    const photoHref = localePath(lang, `/media/community/${photo.id}`);

                                    return (
                                      <Link
                                        key={photo.id}
                                        to={photoHref}
                                        aria-label={photo.title[lang]}
                                        className="group relative flex flex-col overflow-hidden rounded-xl border border-pine-900/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/50 hover:shadow-card"
                                      >
                                        <div className="relative aspect-[4/3] overflow-hidden bg-pine-950">
                                          <img
                                            src={photo.src}
                                            alt={photo.title[lang]}
                                            width={dims.width}
                                            height={dims.height}
                                            loading="lazy"
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                          />
                                          <div className="absolute inset-0 bg-gradient-to-t from-pine-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                                          <span className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-lg bg-pine-950/70 text-white backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                                            <Camera size={12} />
                                          </span>
                                        </div>

                                        <div className="flex flex-1 flex-col p-2.5 sm:p-3">
                                          <h6 className="font-display text-xs font-semibold text-pine-900 line-clamp-2 group-hover:text-gold-700 transition-colors">
                                            {photo.title[lang]}
                                          </h6>
                                          <div className="mt-2 flex items-center justify-between text-[11px] text-ink/55 pt-1.5 border-t border-pine-900/5">
                                            <span>{photo.date.slice(0, 7)}</span>
                                            <span className="font-medium text-gold-700 group-hover:underline">
                                              {t['communityHub.explorePhoto']}
                                            </span>
                                          </div>
                                        </div>
                                      </Link>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      /* Standard Gallery for School Kits and Génies en Herbe */
                      <div className="mt-10 pt-8 border-t border-pine-900/10">
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                          <div>
                            <h4 className="font-display text-lg font-semibold text-pine-950">
                              {t['communityHub.photosLabel']}
                            </h4>
                            <p className="text-xs text-ink/65 mt-0.5">
                              {allInitiativePhotos.length}{' '}
                              {lang === 'fr'
                                ? 'photographies documentées sur le terrain'
                                : 'photographs documented in the field'}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              openLightbox(allInitiativePhotos, init.title[lang], 0)
                            }
                            className="inline-flex items-center gap-2 rounded-full border border-pine-900/15 bg-white px-4 py-2 text-xs font-semibold text-pine-900 shadow-sm transition-all hover:border-gold-500/50 hover:bg-gold-50/50 hover:text-gold-900"
                          >
                            <Camera size={14} className="text-gold-600" />
                            <span>
                              {t['communityHub.viewAllPhotos'].replace(
                                '{count}',
                                String(allInitiativePhotos.length),
                              )}
                            </span>
                          </button>
                        </div>

                        {/* Photo preview cards with real links */}
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 sm:gap-4">
                          {allInitiativePhotos.map((photo) => {
                            const dims = PHOTO_DIMS[photo.id] || { width: 1280, height: 853 };
                            const photoHref = localePath(lang, `/media/community/${photo.id}`);

                            return (
                              <Link
                                key={photo.id}
                                to={photoHref}
                                aria-label={photo.title[lang]}
                                className="group relative flex flex-col overflow-hidden rounded-xl border border-pine-900/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/50 hover:shadow-card"
                              >
                                <div className="relative aspect-[4/3] overflow-hidden bg-pine-950">
                                  <img
                                    src={photo.src}
                                    alt={photo.title[lang]}
                                    width={dims.width}
                                    height={dims.height}
                                    loading="lazy"
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-pine-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                                  <span className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-lg bg-pine-950/70 text-white backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                                    <Camera size={12} />
                                  </span>
                                </div>

                                <div className="flex flex-1 flex-col p-2.5 sm:p-3">
                                  <h5 className="font-display text-xs font-semibold text-pine-900 line-clamp-2 group-hover:text-gold-700 transition-colors">
                                    {photo.title[lang]}
                                  </h5>
                                  <div className="mt-2 flex items-center justify-between text-[11px] text-ink/55 pt-1.5 border-t border-pine-900/5">
                                    <span>{photo.date.slice(0, 7)}</span>
                                    <span className="font-medium text-gold-700 group-hover:underline">
                                      {t['communityHub.explorePhoto']}
                                    </span>
                                  </div>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Reveal>
            </section>
          );
        })}
      </div>

      {/* ── Partner Recognition & Grassroots Alliances ───────────────── */}
      <Reveal>
        <section
          aria-labelledby="partners-heading"
          className="rounded-3xl border border-pine-900/10 bg-ivory p-6 sm:p-10 lg:p-12 shadow-card"
        >
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gold-800">
              <Users size={13} />
              {t['communityHub.allPartnersTitle']}
            </span>
            <h3
              id="partners-heading"
              className="mt-2 font-display text-2xl sm:text-3xl font-semibold text-pine-950"
            >
              {lang === 'fr'
                ? 'Une alliance citoyenne et institutionnelle'
                : 'A civic and institutional alliance'}
            </h3>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-ink/75">
              {t['communityHub.allPartnersIntro']}
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-pine-900/10 bg-white p-5 shadow-sm">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700 mb-3 font-display font-bold">
                360°
              </span>
              <h4 className="font-display text-base font-semibold text-pine-950">ONG Icône 360°</h4>
              <p className="mt-1 text-xs text-ink/70 leading-relaxed">
                {lang === 'fr'
                  ? 'Organisation de la Nuit du Paludisme et mobilisation communautaire au Bénin.'
                  : 'Organization of the Night Against Malaria and community advocacy in Benin.'}
              </p>
            </div>

            <div className="rounded-2xl border border-pine-900/10 bg-white p-5 shadow-sm">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 mb-3 font-display font-bold">
                RC+
              </span>
              <h4 className="font-display text-base font-semibold text-pine-950">
                ONG Reel Concept & Plus
              </h4>
              <p className="mt-1 text-xs text-ink/70 leading-relaxed">
                {lang === 'fr'
                  ? 'Distribution de fournitures scolaires et encadrement des enfants vulnérables.'
                  : 'Distribution of school kits and support for underserved youth.'}
              </p>
            </div>

            <div className="rounded-2xl border border-pine-900/10 bg-white p-5 shadow-sm">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-pine-100 text-pine-700 mb-3 font-display font-bold">
                EF
              </span>
              <h4 className="font-display text-base font-semibold text-pine-950">
                Expertise France
              </h4>
              <p className="mt-1 text-xs text-ink/70 leading-relaxed">
                {lang === 'fr'
                  ? 'Coopération technique internationale et appui aux politiques de santé publique.'
                  : 'International technical cooperation and public health policy support.'}
              </p>
            </div>

            <div className="rounded-2xl border border-pine-900/10 bg-white p-5 shadow-sm">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-100 text-gold-700 mb-3 font-display font-bold">
                MS
              </span>
              <h4 className="font-display text-base font-semibold text-pine-950">
                Ministère de la Santé
              </h4>
              <p className="mt-1 text-xs text-ink/70 leading-relaxed">
                {lang === 'fr'
                  ? 'Cadre institutionnel et orientation stratégique de la lutte antipaludique.'
                  : 'Institutional oversight and strategic malaria elimination policies.'}
              </p>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── Lightbox Dialog Overlay ──────────────────────────────────── */}
      {lightboxState.isOpen && lightboxState.photos.length > 0 && (
        <PhotoLightbox
          photos={lightboxState.photos}
          initialIndex={lightboxState.initialIndex}
          lang={lang}
          title={lightboxState.title || t['communityHub.badge']}
          closeLabel={t['media.close']}
          onClose={() => setLightboxState((prev) => ({ ...prev, isOpen: false }))}
        />
      )}
    </div>
  );
}
