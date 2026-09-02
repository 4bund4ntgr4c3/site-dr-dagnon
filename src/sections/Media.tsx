import { useRef, useState } from 'react';
import { Play, FileDown, Newspaper, ArrowUpRight, X } from 'lucide-react';
import { Link } from 'react-router';
import { SectionHeading } from '@/components/SectionHeading';
import { Reveal } from '@/components/Reveal';
import { useLang } from '@/i18n/useLang';
import { UI } from '@/i18n/translations';
import { MEDIA } from '@/data/site';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { localePath } from '@/i18n/routing';

type MediaItem = (typeof MEDIA)[keyof typeof MEDIA][number];

function youtubeId(url: string): string {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  return m ? m[1] : '';
}

function MediaCard({ m, watchLabel, downloadLabel, onPlay }: { m: MediaItem; watchLabel: string; downloadLabel: string; onPlay: () => void }) {
  const isVideo = m.kind === 'video';

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-pine-900/60 backdrop-blur transition-all duration-300 hover:-translate-y-1.5 hover:border-gold-500/40">
      <div className="relative aspect-video overflow-hidden">
        {isVideo ? (
          <>
            <img
              src={m.thumb}
              alt={m.title}
              width={320}
              height={180}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-pine-950/40 transition-colors group-hover:bg-pine-950/20" />
            <button
              type="button"
              onClick={onPlay}
              aria-label={watchLabel}
              className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gold-500 text-pine-950 shadow-xl transition-transform duration-300 hover:scale-110"
            >
              <Play size={22} className="ml-0.5" fill="currentColor" />
            </button>
          </>
        ) : (
          <div className="relative flex aspect-video items-center justify-center bg-gradient-to-br from-pine-800 to-pine-950">
            <div className="absolute inset-0 texture-dots" />
            <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gold-500/15 text-gold-400 ring-1 ring-gold-500/40 transition-transform duration-300 group-hover:scale-110">
              <FileDown size={24} />
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-gold-400">{m.event}</p>
        <h3 className="mt-2 flex-1 font-display text-[1.15rem] font-semibold leading-snug text-ivory">
          {m.title}
        </h3>
        <a
          href={m.url}
          target="_blank"
          rel="noreferrer"
          aria-label={`${isVideo ? watchLabel : downloadLabel} : ${m.title}`}
          className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-semibold text-pine-100/85 transition-colors hover:text-gold-300"
        >
          {isVideo ? watchLabel : downloadLabel}
          <span className="sr-only"> : {m.title}</span>
          <ArrowUpRight size={13} />
        </a>
      </div>
    </div>
  );
}

export function Media() {
  const { lang } = useLang();
  const t = UI[lang];
  const [active, setActive] = useState<MediaItem | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useFocusTrap(modalRef, closeRef, !!active, () => setActive(null));

  return (
    <section id="medias" className="relative overflow-hidden bg-pine-950 py-24 lg:py-32">
      <div className="absolute inset-0 texture-dots opacity-50" />
      <div className="absolute -left-32 bottom-0 h-[380px] w-[380px] rounded-full bg-pine-600/20 blur-[110px]" />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          dark
          eyebrow={t['media.eyebrow']}
          title={t['media.title']}
          intro={t['media.intro']}
        />

        {/* featured op-ed banner */}
        <Reveal delay={0.1}>
          <a
            href="https://www.africahealthwatch.com/p/from-malaria-control-to-elimination?utm_source=publication-search"
            target="_blank"
            rel="noreferrer"
            className="group mt-14 flex flex-col gap-6 overflow-hidden rounded-2xl border border-gold-500/30 bg-gradient-to-r from-pine-900 to-pine-950 p-8 transition-all duration-300 hover:border-gold-500/60 lg:flex-row lg:items-center lg:p-10"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gold-500 text-pine-950">
              <Newspaper size={26} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-400">
                {t['media.featuredOpEd']} · Africa Health Watch
              </span>
              <h3 className="mt-1 font-display text-xl sm:text-2xl font-semibold text-ivory">
                « {t['media.featuredQuote']} »
              </h3>
              <p className="mt-2 text-sm text-pine-100/70 line-clamp-2">
                {t['media.featuredSummary']}
              </p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-5 py-2.5 text-xs font-semibold text-pine-950 transition-transform group-hover:scale-105 shrink-0">
              {t['media.readOpEd']}
              <ArrowUpRight size={14} />
            </span>
          </a>
        </Reveal>

        {/* media grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MEDIA[lang].map((m, i) => (
            <Reveal key={m.title} delay={0.15 + i * 0.08}>
              <MediaCard
                m={m}
                watchLabel={t['media.watch']}
                downloadLabel={t['media.download']}
                onPlay={() => setActive(m)}
              />
            </Reveal>
          ))}
        </div>

        {/* view more button */}
        <Reveal delay={0.5}>
          <div className="mt-10 text-center">
            <Link
              to={localePath(lang, '/media/speaking')}
              aria-label={`${t['media.viewMore']} : ${t['media.title']}`}
              className="inline-flex items-center gap-2 rounded-full border border-gold-500/50 px-6 py-3 text-sm font-semibold text-gold-300 transition-all hover:bg-gold-500 hover:text-pine-950"
            >
              {t['media.viewMore']}
              <span className="sr-only"> : {t['media.title']}</span>
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </Reveal>
      </div>

      {/* video modal */}
      {active && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-pine-950/90 p-4 backdrop-blur-sm"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
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
              aria-label={t['media.close'] ?? 'Close'}
              className="absolute -top-12 right-0 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-ivory transition-colors hover:bg-white/10"
            >
              <X size={20} />
            </button>
            <div className="aspect-video w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${youtubeId(active.url)}?autoplay=1&rel=0&modestbranding=1`}
                title={active.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
