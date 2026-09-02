import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Linkedin, Mail, ArrowDown, MapPin, Award, BookOpen, Play, X } from 'lucide-react';
import { LINKS } from '@/data/content';
import { PUB_ITEMS } from '@/data/publications';
import { useLang } from '@/i18n/useLang';
import { UI } from '@/i18n/translations';
import { NameHighlight } from '@/components/NameHighlight';
import { localePath } from '@/i18n/routing';

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
function FadeUp({ children, delay = 0, className, as: Tag = 'div' }: { children: React.ReactNode; delay?: number; className?: string; as?: 'div' | 'h1' | 'p' }) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShown(true), 10 + delay * 1000);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <Tag
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : 'translateY(30px)',
        transition: `opacity 0.7s ${EASE} ${delay}s, transform 0.7s ${EASE} ${delay}s`,
      }}
    >
      {children}
    </Tag>
  );
}

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
            <FadeUp delay={0}>
              <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-300">
                <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
                {t['hero.badge']}
              </span>
            </FadeUp>

            <FadeUp delay={0.12} as="h1" className="mt-7 font-display text-[2.6rem] leading-[1.05] font-medium text-ivory sm:text-6xl lg:text-[4.4rem]">
              <NameHighlight />
            </FadeUp>

            <FadeUp delay={0.22} as="p" className="mt-4 font-display text-lg italic text-pine-200/90 sm:text-xl">
              {t['hero.subtitle']}
            </FadeUp>

            <FadeUp delay={0.32} as="p" className="mt-6 max-w-xl text-[15px] leading-relaxed text-pine-100/75 sm:text-base">
              {t['hero.intro']}
            </FadeUp>

            <FadeUp delay={0.42} className="mt-9 flex flex-wrap items-center gap-4">
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
            </FadeUp>

            <FadeUp delay={0.52} className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-[13px] text-pine-100/85">
              <span className="inline-flex items-center gap-2">
                <MapPin size={14} className="text-gold-400" /> {t['hero.based']}
              </span>
              <span className="inline-flex items-center gap-2">
                <Award size={14} className="text-gold-400" /> {t['hero.award']}
              </span>
              <span className="inline-flex items-center gap-2">
                <BookOpen size={14} className="text-gold-400" /> {t['hero.pubs'].replace('{count}', String(pubCount))}
              </span>
            </FadeUp>
          </div>

          {/* Right : visual composition */}
          <div className="relative mx-auto w-full max-w-[400px] opacity-0 animate-[heroIn_0.9s_cubic-bezier(0.22,1,0.36,1)_0.3s_forwards]" style={{ opacity: 0 }}>
            <style>{`@keyframes heroIn{to{opacity:1;transform:scale(1)}} @keyframes floatA{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}} @keyframes floatB{0%,100%{transform:translateY(0)}50%{transform:translateY(8px)}} @keyframes arrowNudge{0%,100%{transform:translateY(0)}50%{transform:translateY(6px)}}`}</style>
            <div className="relative overflow-hidden rounded-[2rem] border-2 border-gold-400/70 shadow-2xl shadow-black/40">
              {/* photo layer */}
              <div
                className="relative cursor-pointer transition-opacity duration-600"
                style={{ opacity: showVideo ? 0 : 1, pointerEvents: showVideo ? 'none' : 'auto' }}
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
              >
                <img
                  src="/dr-seynude-dagnon.webp"
                  alt={lang === 'fr' ? 'Portrait du Dr. Seynudé Jean-Fortuné Dagnon' : 'Portrait of Dr. Seynudé Jean-Fortuné Dagnon'}
                  width={400}
                  height={400}
                  fetchPriority="high"
                  className="w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-pine-950/70 via-pine-950/10 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold-500/90 shadow-lg shadow-gold-600/30 backdrop-blur-sm transition-transform hover:scale-110 active:scale-95">
                    <Play size={28} className="ml-1 text-pine-950" fill="currentColor" />
                  </div>
                </div>
              </div>

              {/* video layer */}
              <div
                className="absolute inset-0 transition-opacity duration-600"
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
            <div className="absolute -left-4 top-6 rounded-2xl border border-white/10 bg-pine-950/65 px-4 py-2.5 shadow-lg backdrop-blur-md" style={{ animation: 'floatA 4.5s ease-in-out infinite' }}>
              <p className="font-display text-xl font-semibold text-gold-400">17+</p>
              <p className="text-[9px] uppercase tracking-widest text-pine-100/70">{t['hero.exp']}</p>
            </div>
            <div className="absolute -bottom-5 -right-4 rounded-2xl border border-white/10 bg-pine-950/65 px-4 py-2.5 shadow-lg backdrop-blur-md" style={{ animation: 'floatB 5s ease-in-out 1s infinite' }}>
              <p className="font-display text-xl font-semibold text-gold-400">27</p>
              <p className="text-[9px] uppercase tracking-widest text-pine-100/70">{t['hero.pmi']}</p>
            </div>
          </div>
        </div>

        {/* scroll cue */}
        <a
          href="#apropos"
          className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-pine-100/85 transition-colors hover:text-gold-400 md:flex opacity-0 animate-[fadeIn_0.8s_ease_1.2s_forwards]"
        >
          <span className="text-[10px] uppercase tracking-[0.3em]">{t['hero.discover']}</span>
          <span style={{ animation: 'arrowNudge 1.8s ease-in-out infinite' }}>
            <ArrowDown size={16} />
          </span>
        </a>
      </div>
    </section>
  );
}
