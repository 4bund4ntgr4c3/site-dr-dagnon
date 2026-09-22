import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Linkedin, Mail, ArrowDown, MapPin, Award, BookOpen, Play, X } from 'lucide-react';
import { LINKS } from '@/data/content';
import { PUB_ITEMS } from '@/data/publications';
import { useLang } from '@/i18n/useLang';
import { UI } from '@/i18n/translations';
import { NameHighlight } from '@/components/NameHighlight';
import { localePath } from '@/i18n/routing';

const YOUTUBE_VIDEO_ID = '0fRIhntULPg';

export function Hero() {
  const { lang } = useLang();
  const t = UI[lang];
  const [showVideo, setShowVideo] = useState(false);
  /* the peer-reviewed count shown next to the book icon — the op-eds live in
     the tribunes, only true publications are counted, so the hero cannot
     drift from the data */
  const pubCount = PUB_ITEMS.filter((p) => p.type === 'publication').length;

  /* Escape closes the video overlay even while focus sits inside the
     YouTube player */
  useEffect(() => {
    if (!showVideo) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowVideo(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [showVideo]);

  return (
    <section id="accueil" className="relative min-h-screen overflow-hidden bg-pine-950">
      {/* layered background */}
      <div className="absolute inset-0 texture-net" />
      <div className="absolute -top-40 -right-40 h-[560px] w-[560px] rounded-full bg-pine-600/25 blur-[130px]" />
      <div className="absolute bottom-0 -left-40 h-[460px] w-[460px] rounded-full bg-gold-600/12 blur-[120px]" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-5 pb-24 pt-32 lg:px-8 lg:pt-36">
        <div className="grid items-center gap-14 lg:grid-cols-[1.25fr_1fr]">
          {/* Left : text */}
          <div>
            <div className="hero-reveal" style={{ animationDelay: '0s' }}>
              <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-300">
                <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
                {t['hero.badge']}
              </span>
            </div>

            <h1
              className="hero-reveal mt-7 font-display text-[2.6rem] leading-[1.05] font-medium text-ivory sm:text-6xl lg:text-[4.4rem]"
              style={{ animationDelay: '0.08s' }}
            >
              <NameHighlight />
              <span className="sr-only"> — {lang === 'fr' ? 'Leader en santé publique et élimination du paludisme en Afrique' : 'Public Health & Malaria Program Leader in Africa'}</span>
            </h1>

            <p
              className="hero-reveal mt-4 font-display text-lg italic text-pine-200/90 sm:text-xl"
              style={{ animationDelay: '0.16s' }}
            >
              {t['hero.subtitle']}
            </p>

            <p
              className="hero-reveal mt-6 max-w-xl text-[15px] leading-relaxed text-pine-100/75 sm:text-base"
              style={{ animationDelay: '0.24s' }}
            >
              {t['hero.intro']}
            </p>

            <div className="hero-reveal mt-9 flex flex-wrap items-center gap-4" style={{ animationDelay: '0.32s' }}>
              <a
                href={LINKS.linkedin}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2.5 rounded-full bg-gold-500 px-7 py-3.5 text-sm font-semibold text-pine-950 shadow-lg shadow-gold-600/25 transition-all hover:-translate-y-0.5 hover:bg-gold-400"
              >
                <Linkedin size={17} className="transition-transform group-hover:scale-110" />
                {t['hero.linkedin']}
              </a>
              <Link
                to={localePath(lang, '/contact')}
                className="inline-flex items-center gap-2.5 rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold text-ivory transition-all hover:-translate-y-0.5 hover:border-gold-400 hover:text-gold-300"
              >
                <Mail size={17} />
                {t['hero.contact']}
              </Link>
            </div>

            <div
              className="hero-reveal mt-10 flex flex-wrap gap-x-8 gap-y-3 text-[13px] text-pine-100/85"
              style={{ animationDelay: '0.40s' }}
            >
              <span className="inline-flex items-center gap-2">
                <MapPin size={14} className="text-gold-400" /> {t['hero.based']}
              </span>
              <span className="inline-flex items-center gap-2">
                <Award size={14} className="text-gold-400" /> {t['hero.award']}
              </span>
              <span className="inline-flex items-center gap-2">
                <BookOpen size={14} className="text-gold-400" /> {t['hero.pubs'].replace('{count}', String(pubCount))}
              </span>
            </div>
          </div>

          {/* Right : visual composition */}
          <div className="hero-visual relative mx-auto w-full max-w-[400px]" style={{ animationDelay: '0.20s' }}>
            <div className="relative overflow-hidden rounded-[2rem] border-2 border-gold-400/70 shadow-2xl shadow-black/40">
              {/* photo layer */}
              <div
                className="relative cursor-pointer transition-opacity duration-600 ease-in-out"
                onClick={() => setShowVideo(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setShowVideo(true);
                  }
                }}
                role="button"
                tabIndex={showVideo ? -1 : 0}
                aria-label={t['hero.videoTitle']}
                style={{ opacity: showVideo ? 0 : 1, pointerEvents: showVideo ? 'none' : 'auto' }}
              >
                <img
                  src="/dr-seynude-dagnon.webp"
                  srcSet="/dr-seynude-dagnon-400.webp 400w, /dr-seynude-dagnon.webp 694w"
                  sizes="(max-width: 1024px) 368px, 400px"
                  alt={lang === 'fr' ? 'Portrait du Dr. Seynudé Jean-Fortuné Dagnon' : 'Portrait of Dr. Seynudé Jean-Fortuné Dagnon'}
                  width={400}
                  height={599}
                  fetchPriority="high"
                  decoding="async"
                  className="w-full object-cover aspect-[400/599]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-pine-950/70 via-pine-950/10 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold-500/90 shadow-lg shadow-gold-600/30 backdrop-blur-sm transition-transform duration-200 hover:scale-110 active:scale-95">
                    <Play size={28} className="ml-1 text-pine-950" fill="currentColor" />
                  </div>
                </div>
              </div>

              {/* video layer */}
              <div
                className="absolute inset-0 transition-opacity duration-600 ease-in-out"
                style={{ opacity: showVideo ? 1 : 0, pointerEvents: showVideo ? 'auto' : 'none' }}
              >
                <button
                  type="button"
                  onClick={() => setShowVideo(false)}
                  className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-pine-950/80 text-ivory transition-colors hover:bg-gold-500 hover:text-pine-950"
                  aria-label={t['media.close']}
                >
                  <X size={16} />
                </button>
                {/* mounted on demand: otherwise the YouTube player is fetched
                    on every home-page visit, for a video most people never open */}
                {showVideo && (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&rel=0`}
                    title={t['hero.videoTitle']}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>
            </div>

            {/* floating badges */}
            <div className="hero-float absolute -left-4 top-6 rounded-2xl border border-white/10 bg-pine-950/65 px-4 py-2.5 shadow-lg backdrop-blur-md">
              <p className="font-display text-xl font-semibold text-gold-400">20+</p>
              <p className="text-[9px] uppercase tracking-widest text-pine-100/70">{t['hero.exp']}</p>
            </div>
            <div className="hero-float-reverse absolute -bottom-5 -right-4 rounded-2xl border border-white/10 bg-pine-950/65 px-4 py-2.5 shadow-lg backdrop-blur-md">
              <p className="font-display text-xl font-semibold text-gold-400">27</p>
              <p className="text-[9px] uppercase tracking-widest text-pine-100/70">{t['hero.pmi']}</p>
            </div>
          </div>
        </div>

        {/* scroll cue */}
        <a
          href="#apropos"
          className="hero-scroll absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-pine-100/85 transition-colors hover:text-gold-400 md:flex"
        >
          <span className="text-[10px] uppercase tracking-[0.3em]">{t['hero.discover']}</span>
          <span className="hero-bounce">
            <ArrowDown size={16} />
          </span>
        </a>
      </div>
    </section>
  );
}
