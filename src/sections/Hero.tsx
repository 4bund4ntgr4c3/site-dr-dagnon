import { useState } from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Mail, ArrowDown, MapPin, Award, BookOpen, Play, X } from 'lucide-react';
import { LINKS } from '@/data/content';
import { useLang } from '@/i18n/useLang';
import { UI } from '@/i18n/translations';
import { NameHighlight } from '@/components/NameHighlight';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

const YOUTUBE_VIDEO_ID = '2mNE0Bx0A3o';

export function Hero() {
  const { lang } = useLang();
  const t = UI[lang];
  const [showVideo, setShowVideo] = useState(false);

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
            <motion.div {...fadeUp} transition={{ duration: 0.7, ease: 'easeOut' }}>
              <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-300">
                <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
                {t['hero.badge']}
              </span>
            </motion.div>

            <motion.h1
              {...fadeUp}
              transition={{ duration: 0.7, delay: 0.12, ease: 'easeOut' }}
              className="mt-7 font-display text-[2.6rem] leading-[1.05] font-medium text-ivory sm:text-6xl lg:text-[4.4rem]"
            >
              <NameHighlight />
            </motion.h1>

            <motion.p
              {...fadeUp}
              transition={{ duration: 0.7, delay: 0.22, ease: 'easeOut' }}
              className="mt-4 font-display text-lg italic text-pine-200/90 sm:text-xl"
            >
              {t['hero.subtitle']}
            </motion.p>

            <motion.p
              {...fadeUp}
              transition={{ duration: 0.7, delay: 0.32, ease: 'easeOut' }}
              className="mt-6 max-w-xl text-[15px] leading-relaxed text-pine-100/75 sm:text-base"
            >
              {t['hero.intro']}
            </motion.p>

            <motion.div
              {...fadeUp}
              transition={{ duration: 0.7, delay: 0.42, ease: 'easeOut' }}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <a
                href={LINKS.linkedin}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2.5 rounded-full bg-gold-500 px-7 py-3.5 text-sm font-semibold text-pine-950 shadow-lg shadow-gold-600/25 transition-all hover:-translate-y-0.5 hover:bg-gold-400"
              >
                <Linkedin size={17} className="transition-transform group-hover:scale-110" />
                {t['hero.linkedin']}
              </a>
              <a
                href="/contact"
                className="inline-flex items-center gap-2.5 rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold text-ivory transition-all hover:-translate-y-0.5 hover:border-gold-400 hover:text-gold-300"
              >
                <Mail size={17} />
                {t['hero.contact']}
              </a>
            </motion.div>

            <motion.div
              {...fadeUp}
              transition={{ duration: 0.7, delay: 0.52, ease: 'easeOut' }}
              className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-[13px] text-pine-100/60"
            >
              <span className="inline-flex items-center gap-2">
                <MapPin size={14} className="text-gold-400" /> {t['hero.based']}
              </span>
              <span className="inline-flex items-center gap-2">
                <Award size={14} className="text-gold-400" /> {t['hero.award']}
              </span>
              <span className="inline-flex items-center gap-2">
                <BookOpen size={14} className="text-gold-400" /> {t['hero.pubs']}
              </span>
            </motion.div>
          </div>

          {/* Right : visual composition */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-[400px]"
          >
            <div className="relative overflow-hidden rounded-[2rem] border-2 border-gold-400/70 shadow-2xl shadow-black/40">
              {/* photo layer */}
              <motion.div
                className="relative cursor-pointer"
                animate={{ opacity: showVideo ? 0 : 1 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                onClick={() => setShowVideo(true)}
                style={{ pointerEvents: showVideo ? 'none' : 'auto' }}
              >
                <img
                  src="/dr-seynude-dagnon.jpeg"
                  alt={lang === 'fr' ? 'Portrait du Dr. Seynudé Jean-Fortuné Dagnon' : 'Portrait of Dr. Seynudé Jean-Fortuné Dagnon'}
                  width={400}
                  height={400}
                  fetchPriority="high"
                  className="w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-pine-950/70 via-pine-950/10 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-gold-500/90 shadow-lg shadow-gold-600/30 backdrop-blur-sm"
                  >
                    <Play size={28} className="ml-1 text-pine-950" fill="currentColor" />
                  </motion.div>
                </div>
              </motion.div>

              {/* video layer */}
              <motion.div
                className="absolute inset-0"
                animate={{ opacity: showVideo ? 1 : 0 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                style={{ pointerEvents: showVideo ? 'auto' : 'none' }}
              >
                <button
                  onClick={() => setShowVideo(false)}
                  className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-pine-950/80 text-ivory transition-colors hover:bg-gold-500 hover:text-pine-950"
                  aria-label="Close video"
                >
                  <X size={16} />
                </button>
                <iframe
                  src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&rel=0`}
                  title="YouTube video"
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </motion.div>
            </div>

            {/* floating badges */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -left-4 top-6 rounded-2xl border border-white/10 bg-pine-950/65 px-4 py-2.5 shadow-lg backdrop-blur-md"
            >
              <p className="font-display text-xl font-semibold text-gold-400">17+</p>
              <p className="text-[9px] uppercase tracking-widest text-pine-100/70">{t['hero.exp']}</p>
            </motion.div>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute -bottom-5 -right-4 rounded-2xl border border-white/10 bg-pine-950/65 px-4 py-2.5 shadow-lg backdrop-blur-md"
            >
              <p className="font-display text-xl font-semibold text-gold-400">27</p>
              <p className="text-[9px] uppercase tracking-widest text-pine-100/70">{t['hero.pmi']}</p>
            </motion.div>
          </motion.div>
        </div>

        {/* scroll cue */}
        <motion.a
          href="#apropos"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-pine-100/50 transition-colors hover:text-gold-400 md:flex"
        >
          <span className="text-[10px] uppercase tracking-[0.3em]">{t['hero.discover']}</span>
          <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
            <ArrowDown size={16} />
          </motion.span>
        </motion.a>
      </div>
    </section>
  );
}
