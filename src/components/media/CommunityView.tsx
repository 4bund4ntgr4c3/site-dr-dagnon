import { useMemo, useState } from 'react';
import { FolderOpen, Camera } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { PhotoLightbox } from '@/components/PhotoLightbox';
import { MEDIA_ITEMS } from '@/data/media';
import { ALBUM_COVERS, photoOrder, subtypeDesc, subtypeLabel, type T } from './helpers';

/* COMMUNITY VIEW — album folders + Slideshow */

export function CommunityView({ lang, t }: { lang: 'fr' | 'en'; t: T }) {
  const [activeAlbum, setActiveAlbum] = useState<string | null>(null);

  const albumKeys = useMemo(() => {
    const latest = new Map<string, string>();
    for (const m of MEDIA_ITEMS) {
      if (m.category !== 'community' || !m.subType) continue;
      const prev = latest.get(m.subType);
      if (!prev || m.date > prev) latest.set(m.subType, m.date);
    }
    return Array.from(latest.entries())
      .sort((a, b) => b[1].localeCompare(a[1]))
      .map(([key]) => key);
  }, []);

  const albumPhotos = useMemo(() => {
    if (!activeAlbum) return [];
    return MEDIA_ITEMS.filter(
      (m) => m.category === 'community' && m.subType === activeAlbum,
    ).sort(
      (a, b) =>
        b.date.localeCompare(a.date) || photoOrder(b.id) - photoOrder(a.id),
    );
  }, [activeAlbum]);

  const albumCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    MEDIA_ITEMS.filter((m) => m.category === 'community' && m.subType).forEach((m) => {
      counts[m.subType!] = (counts[m.subType!] || 0) + 1;
    });
    return counts;
  }, []);

  const openAlbum = (key: string) => {
    setActiveAlbum(key);
  };

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
                className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-pine-900/10 bg-white shadow-card transition-all duration-300 hover:-translate-y-2 hover:border-gold-500/40 hover:shadow-card-hover text-left"
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
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-gold-700 transition-colors group-hover:text-gold-500">
                    <Camera size={14} />
                    {lang === 'fr' ? 'Voir l\'album' : 'View album'}
                  </span>
                </div>
              </button>
            </Reveal>
          );
        })}
      </div>

      {/* lightbox */}
      {activeAlbum && (
        <PhotoLightbox
          photos={albumPhotos}
          lang={lang}
          title={subtypeLabel(t, activeAlbum)}
          closeLabel={t['media.close']}
          onClose={() => setActiveAlbum(null)}
        />
      )}
    </>
  );
}
