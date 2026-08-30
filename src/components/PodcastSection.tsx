import { useState, useRef } from 'react';
import {
  Headphones,
  Rss,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Download,
  ExternalLink,
  Mic,
} from 'lucide-react';
import { Link } from 'react-router';
import { useLang } from '@/i18n/useLang';
import { localePath } from '@/i18n/routing';
import { TRIBUNES } from '@/data/tribunes';

function formatTime(sec: number): string {
  if (isNaN(sec) || !isFinite(sec)) return '00:00';
  const total = Math.floor(sec);
  const m = Math.floor(total / 60);
  const s = total % 60;
  const h = Math.floor(m / 60);
  const remM = m % 60;
  if (h > 0) {
    return `${h}:${remM.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function PodcastSection() {
  const { lang } = useLang();
  const latest = [...TRIBUNES].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
  const isFr = lang === 'fr';

  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const skip = (seconds: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + seconds));
  };

  const cycleSpeed = () => {
    const speeds = [1, 1.25, 1.5, 2];
    const nextIndex = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    const nextSpeed = speeds[nextIndex];
    setPlaybackRate(nextSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextSpeed;
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="rounded-2xl border border-pine-900/10 bg-white p-6 shadow-card sm:p-8">
      {/* Hidden HTML5 Audio Element */}
      <audio
        ref={audioRef}
        src="/podcast-ndep-ep5.mp3"
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-pine-600">
          <Headphones size={15} /> {isFr ? 'Podcast & audio' : 'Podcast & audio'}
        </p>
        <div className="flex items-center gap-2">
          <Link
            to={localePath(lang, '/podcasts')}
            className="inline-flex items-center gap-1.5 rounded-full border border-pine-900/15 bg-white px-3 py-1.5 text-xs font-semibold text-pine-950 transition-colors hover:border-gold-500 hover:text-gold-700"
          >
            {isFr ? 'Tous les podcasts & audios' : 'All podcasts & audio'} →
          </Link>
          <a
            href="/podcast.xml"
            className="inline-flex items-center gap-1.5 rounded-full bg-pine-950 px-3.5 py-1.5 text-xs font-semibold text-gold-400 transition-colors hover:bg-pine-900"
            title={isFr ? 'Flux RSS du podcast' : 'Podcast RSS Feed'}
          >
            <Rss size={12} /> RSS
          </a>
        </div>
      </div>

      <h3 className="mt-3 font-display text-2xl font-semibold text-pine-950 sm:text-[1.65rem]">
        {isFr ? 'Lecteur Podcast & Audio' : 'Podcast & Audio Player'}
      </h3>
      <p className="mt-1 text-sm text-pine-900/70">
        {isFr
          ? 'Écoutez directement en ligne le nouvel épisode de podcast du Dr. Dagnon ou parcourez ses tribunes lues à voix haute.'
          : 'Listen directly online to Dr. Dagnon’s latest podcast episode or explore his audio-narrated op-eds.'}
      </p>

      {/* Featured Podcast Card with Audio Player */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-gold-500/30 bg-gradient-to-br from-pine-950 via-pine-900 to-pine-950 text-ivory shadow-xl">
        <div className="p-5 sm:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
            {/* Thumbnail with interactive Play trigger */}
            <div className="group relative aspect-video w-full shrink-0 overflow-hidden rounded-xl bg-pine-950 shadow-md sm:max-w-[240px]">
              <img
                src="https://img.youtube.com/vi/IenUdkxFqNE/hqdefault.jpg"
                alt="Episode 5 Ndep - L’espoir dans la lutte contre le paludisme"
                width={320}
                height={180}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-pine-950/40 transition-colors group-hover:bg-pine-950/20" />
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? (isFr ? 'Mettre en pause' : 'Pause') : (isFr ? 'Écouter l’audio' : 'Play audio')}
                className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gold-500 text-pine-950 shadow-2xl transition-all duration-300 hover:scale-110 hover:bg-gold-400"
              >
                {isPlaying ? (
                  <Pause size={24} className="fill-current" />
                ) : (
                  <Play size={24} className="ml-1 fill-current" />
                )}
              </button>
            </div>

            {/* Info and Title */}
            <div className="flex flex-1 flex-col">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-500/20 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-gold-300 ring-1 ring-gold-500/30">
                  <Mic size={11} /> {isFr ? 'Podcast invité' : 'Guest Podcast'}
                </span>
                <span className="text-xs text-pine-200/60">
                  {isFr ? '25 août 2026 · Ndëp' : 'August 25, 2026 · Ndëp'}
                </span>
              </div>

              <h4 className="mt-2 font-display text-lg font-semibold leading-snug text-white sm:text-xl">
                {isFr
                  ? 'Épisode 5 Ndëp — L’espoir dans la lutte contre le paludisme'
                  : 'Ndëp Podcast (Episode 5) — Hope in the fight against malaria'}
              </h4>

              <p className="mt-1.5 text-xs leading-relaxed text-pine-100/80">
                {isFr
                  ? 'Entretien approfondi avec le Dr. Seynudé Jean-Fortuné Dagnon sur les défis, les financements et les leviers d’élimination du paludisme.'
                  : 'In-depth conversation with Dr. Seynudé Jean-Fortuné Dagnon on challenges, health financing, and elimination pathways for malaria.'}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <a
                  href="https://www.youtube.com/watch?v=IenUdkxFqNE"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-400 underline-offset-4 hover:underline"
                >
                  {isFr ? 'Voir la vidéo sur YouTube' : 'Watch video on YouTube'}
                  <ExternalLink size={12} />
                </a>
                <span className="text-white/20">·</span>
                <a
                  href="/podcast-ndep-ep5.mp3"
                  download="podcast-dr-dagnon-ndep-ep5.mp3"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-pine-200/75 hover:text-ivory"
                >
                  <Download size={12} />
                  {isFr ? 'Télécharger MP3' : 'Download MP3'}
                </a>
              </div>
            </div>
          </div>

          {/* Dedicated Audio Player Controls Bar */}
          <div className="mt-6 rounded-xl border border-white/10 bg-pine-950/70 p-4 backdrop-blur-sm">
            {/* Scrubber Progress Bar */}
            <div className="flex items-center gap-3">
              <span className="w-12 text-right font-mono text-xs font-medium text-gold-300">
                {formatTime(currentTime)}
              </span>
              <div className="relative flex flex-1 items-center">
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  aria-label={isFr ? 'Position de lecture' : 'Playback position'}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-pine-800 accent-gold-500 transition-all focus:outline-none"
                  style={{
                    background: `linear-gradient(to right, #e5b045 ${progressPercent}%, rgba(255,255,255,0.15) ${progressPercent}%)`,
                  }}
                />
              </div>
              <span className="w-12 font-mono text-xs font-medium text-pine-300/70">
                {formatTime(duration)}
              </span>
            </div>

            {/* Control buttons */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2">
                {/* Play/Pause toggle */}
                <button
                  type="button"
                  onClick={togglePlay}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-500 text-pine-950 shadow-md transition-transform hover:scale-105 hover:bg-gold-400 active:scale-95"
                  aria-label={isPlaying ? (isFr ? 'Pause' : 'Pause') : (isFr ? 'Lecture' : 'Play')}
                >
                  {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} className="ml-0.5" fill="currentColor" />}
                </button>

                {/* Rewind 15s */}
                <button
                  type="button"
                  onClick={() => skip(-15)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-pine-200/80 transition-colors hover:bg-white/10 hover:text-white"
                  title={isFr ? 'Reculer de 15 secondes' : 'Rewind 15s'}
                  aria-label={isFr ? 'Reculer de 15s' : 'Rewind 15s'}
                >
                  <RotateCcw size={16} />
                </button>

                {/* Forward 15s */}
                <button
                  type="button"
                  onClick={() => skip(15)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-pine-200/80 transition-colors hover:bg-white/10 hover:text-white"
                  title={isFr ? 'Avancer de 15 secondes' : 'Forward 15s'}
                  aria-label={isFr ? 'Avancer de 15s' : 'Forward 15s'}
                >
                  <RotateCw size={16} />
                </button>
              </div>

              <div className="flex items-center gap-3">
                {/* Speed Button */}
                <button
                  type="button"
                  onClick={cycleSpeed}
                  className="rounded-md border border-white/15 bg-white/5 px-2.5 py-1 font-mono text-xs font-semibold text-gold-300 transition-colors hover:bg-white/10 hover:text-gold-200"
                  title={isFr ? 'Vitesse de lecture' : 'Playback speed'}
                >
                  {playbackRate}x
                </button>

                {/* Mute Button */}
                <button
                  type="button"
                  onClick={toggleMute}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-pine-200/80 transition-colors hover:bg-white/10 hover:text-white"
                  title={isMuted ? (isFr ? 'Activer le son' : 'Unmute') : (isFr ? 'Couper le son' : 'Mute')}
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX size={17} className="text-red-400" /> : <Volume2 size={17} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tribunes audio read-aloud */}
      <div className="mt-8 border-t border-pine-900/10 pt-6">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-bold uppercase tracking-wider text-pine-700">
            {isFr ? 'Lectures audio des tribunes' : 'Audio op-ed readings'}
          </p>
          <span className="text-[11px] text-pine-900/50">
            {isFr ? 'Flux RSS 2.0 + Apple/Spotify' : 'RSS 2.0 + Apple/Spotify feed'}
          </span>
        </div>

        <div className="mt-3 grid gap-2.5">
          {latest.map((t) => (
            <Link
              key={t.slug}
              to={localePath(lang, `/tribunes/${t.slug}`)}
              className="group flex items-center gap-3 rounded-xl border border-pine-900/5 bg-pine-50 px-4 py-2.5 transition-colors hover:border-gold-500/30 hover:bg-white dark:border-white/5 dark:bg-pine-900/30 dark:hover:border-gold-500/30 dark:hover:bg-pine-800/60"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-500 text-pine-950 transition-transform group-hover:scale-105">
                <Play size={12} className="ml-0.5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-pine-950 group-hover:text-gold-700">
                  {t.title[lang]}
                </span>
                <span className="block text-xs text-pine-900/60">
                  {t.date} · {t.source.name}
                </span>
              </span>
              <ExternalLink size={13} className="shrink-0 text-pine-900/25 group-hover:text-gold-600" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
