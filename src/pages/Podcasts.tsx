import { useState, useRef, useMemo } from 'react';
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
  Search,
  FileText,
  Radio,
  X,
  Copy,
  Check,
  Calendar,
  Clock,
} from 'lucide-react';
import { Link } from 'react-router';
import { Reveal } from '@/components/Reveal';
import { NameHighlight } from '@/components/NameHighlight';
import { useLang } from '@/i18n/useLang';
import { localePath } from '@/i18n/routing';
import { PODCAST_EPISODES } from '@/data/podcasts';
import { TRIBUNES } from '@/data/tribunes';
import { useFocusTrap } from '@/hooks/useFocusTrap';

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

type TabFilter = 'all' | 'podcasts' | 'tribunes';

export default function Podcasts() {
  const { lang } = useLang();
  const isFr = lang === 'fr';

  // Audio Player State
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  // Filters & Search
  const [tab, setTab] = useState<TabFilter>('all');
  const [search, setSearch] = useState('');
  const [copiedRss, setCopiedRss] = useState(false);

  // Video Modal State for video interviews
  const [activeVideo, setActiveVideo] = useState<{ id: string; title: string } | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  useFocusTrap(modalRef, closeRef, !!activeVideo, () => setActiveVideo(null));

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

  const handleCopyRss = () => {
    const rssUrl = `${window.location.origin}/${isFr ? 'podcast-fr.xml' : 'podcast.xml'}`;
    navigator.clipboard.writeText(rssUrl).then(() => {
      setCopiedRss(true);
      setTimeout(() => setCopiedRss(false), 2000);
    });
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Filtered Items
  const filteredPodcasts = useMemo(() => {
    return PODCAST_EPISODES.filter((item) => {
      if (tab === 'tribunes') return false;
      const q = search.toLowerCase();
      if (!q) return true;
      return (
        item.title[lang].toLowerCase().includes(q) ||
        item.description[lang].toLowerCase().includes(q) ||
        item.host[lang].toLowerCase().includes(q)
      );
    });
  }, [tab, search, lang]);

  const filteredTribunes = useMemo(() => {
    return TRIBUNES.filter((item) => {
      if (tab === 'podcasts') return false;
      const q = search.toLowerCase();
      if (!q) return true;
      return (
        item.title[lang].toLowerCase().includes(q) ||
        item.description[lang].toLowerCase().includes(q) ||
        item.source.name.toLowerCase().includes(q)
      );
    });
  }, [tab, search, lang]);

  const totalCount = filteredPodcasts.length + filteredTribunes.length;

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-ivory">
      {/* Hidden HTML5 Audio Element for Featured Podcast */}
      <audio
        ref={audioRef}
        src="/podcast-ndep-ep5.mp3"
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Header — Hero Section */}
      <section className="relative overflow-hidden bg-pine-950 text-ivory">
        <div className="absolute inset-0 texture-net opacity-60" />
        <div className="absolute -top-40 -right-40 h-[560px] w-[560px] rounded-full bg-pine-600/25 blur-[130px]" />
        <div className="absolute bottom-0 -left-40 h-[460px] w-[460px] rounded-full bg-gold-600/12 blur-[120px]" />

        <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-32 lg:px-8 lg:pt-36">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-300">
              <Headphones size={13} className="text-gold-400" />
              {isFr ? 'Podcasts & Audio' : 'Podcasts & Audio'}
            </span>

            <h1 className="mt-7 font-display text-[2.6rem] leading-[1.05] font-medium text-pine-100 sm:text-6xl lg:text-[4.2rem]">
              {isFr ? 'Podcasts & Tribunes Audio' : 'Podcasts & Audio Op-eds'}
              {' — '}
              <NameHighlight />
            </h1>

            <p className="mt-5 max-w-2xl font-display text-lg italic text-pine-200/90 sm:text-xl">
              {isFr
                ? 'Écoutez les entretiens podcast du Dr. Seynudé Jean-Fortuné Dagnon sur l’élimination du paludisme et les versions audio de ses publications.'
                : 'Listen to podcast episodes, talks and audio versions of Dr. Seynudé Jean-Fortuné Dagnon’s publications.'}
            </p>
          </Reveal>

          {/* Featured Episode Audio Player Spotlight */}
          <Reveal delay={0.15}>
            <div className="mt-12 overflow-hidden rounded-3xl border border-gold-500/30 bg-gradient-to-br from-pine-900 via-pine-950 to-pine-900 shadow-2xl">
              <div className="p-6 sm:p-8 lg:p-10">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-8">
                  {/* Thumbnail with interactive Play trigger */}
                  <div className="group relative aspect-video w-full shrink-0 overflow-hidden rounded-2xl bg-pine-950 shadow-xl lg:w-72">
                    <img
                      src="https://img.youtube.com/vi/IenUdkxFqNE/hqdefault.jpg"
                      alt="Podcast Ndëp Épisode 5"
                      width={320}
                      height={180}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-pine-950/40 transition-colors group-hover:bg-pine-950/20" />
                    <button
                      type="button"
                      onClick={togglePlay}
                      aria-label={isPlaying ? (isFr ? 'Mettre en pause' : 'Pause') : (isFr ? 'Écouter l’audio' : 'Play audio')}
                      className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gold-500 text-pine-950 shadow-2xl transition-all duration-300 hover:scale-110 hover:bg-gold-400"
                    >
                      {isPlaying ? (
                        <Pause size={28} className="fill-current" />
                      ) : (
                        <Play size={28} className="ml-1 fill-current" />
                      )}
                    </button>
                  </div>

                  {/* Info and Description */}
                  <div className="flex flex-1 flex-col">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-gold-300 ring-1 ring-gold-500/30">
                        <Radio size={12} /> {isFr ? 'Dernier épisode invité' : 'Latest guest episode'}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-pine-200/60">
                        <Calendar size={12} /> 25 août 2026
                      </span>
                      <span className="flex items-center gap-1 text-xs text-pine-200/60">
                        <Clock size={12} /> 31:29
                      </span>
                    </div>

                    <h2 className="mt-3 font-display text-xl font-semibold leading-tight text-white sm:text-2xl lg:text-3xl">
                      {isFr
                        ? 'Épisode 5 Ndëp — L’espoir dans la lutte contre le paludisme'
                        : 'Ndëp Podcast (Episode 5) — Hope in the fight against malaria'}
                    </h2>

                    <p className="mt-2 text-sm leading-relaxed text-pine-100/80 sm:text-base">
                      {isFr
                        ? 'Dans cet épisode, le docteur Seynudé Jean-Fortuné Dagnon partage son analyse sur les stratégies de terrain, l’innovation scientifique et les leviers majeurs pour accélérer l’élimination définitive du paludisme en Afrique.'
                        : 'In this episode, Dr. Seynudé Jean-Fortuné Dagnon shares field insights, innovative tools, and sustainable health financing strategies to achieve malaria elimination in Africa.'}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-4 text-xs">
                      <a
                        href="https://www.youtube.com/watch?v=IenUdkxFqNE"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 font-semibold text-gold-400 underline-offset-4 hover:underline"
                      >
                        {isFr ? 'Regarder l’interview vidéo (YouTube)' : 'Watch video interview (YouTube)'}
                        <ExternalLink size={13} />
                      </a>
                      <span className="text-white/20">·</span>
                      <a
                        href="/podcast-ndep-ep5.mp3"
                        download="podcast-dr-dagnon-ndep-ep5.mp3"
                        className="inline-flex items-center gap-1.5 font-semibold text-pine-200/80 hover:text-ivory"
                      >
                        <Download size={13} />
                        {isFr ? 'Télécharger MP3 (22 Mo)' : 'Download MP3 (22 MB)'}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Player Controls Bar */}
                <div className="mt-8 rounded-2xl border border-white/10 bg-pine-950/80 p-4 sm:p-5 backdrop-blur-md">
                  {/* Scrubber Progress Bar */}
                  <div className="flex items-center gap-3">
                    <span className="w-14 text-right font-mono text-xs font-semibold text-gold-300">
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
                        className="h-2.5 w-full cursor-pointer appearance-none rounded-lg bg-pine-800 accent-gold-500 transition-all focus:outline-none"
                        style={{
                          background: `linear-gradient(to right, #e5b045 ${progressPercent}%, rgba(255,255,255,0.15) ${progressPercent}%)`,
                        }}
                      />
                    </div>
                    <span className="w-14 font-mono text-xs font-semibold text-pine-300/70">
                      {formatTime(duration)}
                    </span>
                  </div>

                  {/* Buttons */}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-4 pt-1">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={togglePlay}
                        className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-500 text-pine-950 shadow-md transition-transform hover:scale-105 hover:bg-gold-400 active:scale-95"
                        aria-label={isPlaying ? (isFr ? 'Pause' : 'Pause') : (isFr ? 'Lecture' : 'Play')}
                      >
                        {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} className="ml-0.5" fill="currentColor" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => skip(-15)}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-pine-200/80 transition-colors hover:bg-white/10 hover:text-white"
                        title={isFr ? 'Reculer de 15 secondes' : 'Rewind 15s'}
                        aria-label={isFr ? 'Reculer de 15s' : 'Rewind 15s'}
                      >
                        <RotateCcw size={18} />
                      </button>

                      <button
                        type="button"
                        onClick={() => skip(15)}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-pine-200/80 transition-colors hover:bg-white/10 hover:text-white"
                        title={isFr ? 'Avancer de 15 secondes' : 'Forward 15s'}
                        aria-label={isFr ? 'Avancer de 15s' : 'Forward 15s'}
                      >
                        <RotateCw size={18} />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={cycleSpeed}
                        className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 font-mono text-xs font-bold text-gold-300 transition-colors hover:bg-white/10 hover:text-gold-200"
                        title={isFr ? 'Vitesse de lecture' : 'Playback speed'}
                      >
                        {playbackRate}x
                      </button>

                      <button
                        type="button"
                        onClick={toggleMute}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-pine-200/80 transition-colors hover:bg-white/10 hover:text-white"
                        title={isMuted ? (isFr ? 'Activer le son' : 'Unmute') : (isFr ? 'Couper le son' : 'Mute')}
                        aria-label={isMuted ? 'Unmute' : 'Mute'}
                      >
                        {isMuted ? <VolumeX size={20} className="text-red-400" /> : <Volume2 size={20} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="bg-pine-50 py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          {/* Controls & Filter Bar */}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            {/* Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setTab('all')}
                className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                  tab === 'all'
                    ? 'bg-pine-950 text-gold-400 shadow'
                    : 'bg-white text-pine-900/70 border border-pine-900/10 hover:border-gold-500/40 hover:text-pine-950'
                }`}
              >
                {isFr ? 'Tout' : 'All'} ({PODCAST_EPISODES.length + TRIBUNES.length})
              </button>

              <button
                type="button"
                onClick={() => setTab('podcasts')}
                className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                  tab === 'podcasts'
                    ? 'bg-pine-950 text-gold-400 shadow'
                    : 'bg-white text-pine-900/70 border border-pine-900/10 hover:border-gold-500/40 hover:text-pine-950'
                }`}
              >
                {isFr ? 'Podcasts & Entretiens' : 'Podcasts & Interviews'} ({PODCAST_EPISODES.length})
              </button>

              <button
                type="button"
                onClick={() => setTab('tribunes')}
                className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                  tab === 'tribunes'
                    ? 'bg-pine-950 text-gold-400 shadow'
                    : 'bg-white text-pine-900/70 border border-pine-900/10 hover:border-gold-500/40 hover:text-pine-950'
                }`}
              >
                {isFr ? 'Tribunes audio' : 'Audio op-eds'} ({TRIBUNES.length})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pine-900/40" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={isFr ? 'Rechercher un épisode...' : 'Search an episode...'}
                aria-label={isFr ? 'Rechercher un épisode' : 'Search an episode'}
                className="w-full rounded-full border border-pine-900/15 bg-white py-2 pl-9 pr-4 text-xs text-pine-950 placeholder:text-pine-900/40 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500"
              />
            </div>
          </div>

          {/* Episode List */}
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {/* Podcasts Episodes */}
            {filteredPodcasts.map((item, idx) => (
              <Reveal key={item.id} delay={Math.min(idx * 0.08, 0.4)}>
                <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-pine-900/10 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/40 hover:shadow-card-hover">
                  {/* Thumbnail with interactive action */}
                  <div className="relative aspect-video overflow-hidden bg-pine-950">
                    <img
                      src={item.thumb}
                      alt={item.title[lang]}
                      width={400}
                      height={225}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-pine-950/30" />
                    {item.audioSrc ? (
                      <button
                        type="button"
                        onClick={togglePlay}
                        aria-label={isFr ? 'Écouter' : 'Listen'}
                        className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gold-500 text-pine-950 shadow-xl transition-transform hover:scale-110"
                      >
                        <Play size={20} className="ml-0.5" fill="currentColor" />
                      </button>
                    ) : item.youtubeId ? (
                      <button
                        type="button"
                        onClick={() => setActiveVideo({ id: item.youtubeId!, title: item.title[lang] })}
                        aria-label={isFr ? 'Regarder' : 'Watch'}
                        className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gold-500 text-pine-950 shadow-xl transition-transform hover:scale-110"
                      >
                        <Play size={20} className="ml-0.5" fill="currentColor" />
                      </button>
                    ) : null}

                    <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-pine-950/80 px-2.5 py-1 text-[11px] font-bold text-gold-300 backdrop-blur-sm">
                      <Mic size={11} /> {item.host[lang]}
                    </span>
                    {item.duration && (
                      <span className="absolute right-3 bottom-3 rounded bg-pine-950/80 px-2 py-0.5 font-mono text-[11px] font-medium text-white backdrop-blur-sm">
                        {item.duration}
                      </span>
                    )}
                  </div>

                  {/* Body */}
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center justify-between text-xs text-pine-900/55">
                      <span>{item.date}</span>
                      <span className="font-semibold text-gold-700 uppercase tracking-wider text-[10.5px]">
                        {item.type === 'podcast' ? (isFr ? 'Podcast' : 'Podcast') : (isFr ? 'Interview' : 'Interview')}
                      </span>
                    </div>

                    <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-pine-950">
                      {item.title[lang]}
                    </h3>

                    <p className="mt-2 flex-1 text-xs leading-relaxed text-pine-900/70">
                      {item.description[lang]}
                    </p>

                    <div className="mt-5 flex items-center justify-between border-t border-pine-900/5 pt-4">
                      {item.audioSrc ? (
                        <button
                          type="button"
                          onClick={togglePlay}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-pine-950 hover:text-gold-700"
                        >
                          <Play size={13} fill="currentColor" />
                          {isFr ? 'Écouter dans le lecteur' : 'Play in player'}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setActiveVideo({ id: item.youtubeId!, title: item.title[lang] })}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-pine-950 hover:text-gold-700"
                        >
                          <Play size={13} fill="currentColor" />
                          {isFr ? 'Regarder l’interview' : 'Watch interview'}
                        </button>
                      )}

                      {item.youtubeUrl && (
                        <a
                          href={item.youtubeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium text-pine-900/60 hover:text-gold-700"
                        >
                          YouTube <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}

            {/* Tribunes Audio */}
            {filteredTribunes.map((item, idx) => (
              <Reveal key={item.slug} delay={Math.min(idx * 0.08, 0.4)}>
                <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-pine-900/10 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/40 hover:shadow-card-hover">
                  <div className="relative aspect-video flex items-center justify-center bg-gradient-to-br from-pine-900 to-pine-950 text-white p-6">
                    <div className="absolute inset-0 texture-dots opacity-40" />
                    <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gold-500/15 text-gold-400 ring-1 ring-gold-500/40">
                      <FileText size={24} />
                    </span>
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-pine-950/80 px-2.5 py-1 text-[11px] font-bold text-gold-300 backdrop-blur-sm">
                      <Headphones size={11} /> {item.source.name}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center justify-between text-xs text-pine-900/55">
                      <span>{item.date}</span>
                      <span className="font-semibold text-pine-700 uppercase tracking-wider text-[10.5px]">
                        {isFr ? 'Tribune audio (TTS)' : 'Audio op-ed (TTS)'}
                      </span>
                    </div>

                    <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-pine-950">
                      {item.title[lang]}
                    </h3>

                    <p className="mt-2 flex-1 text-xs leading-relaxed text-pine-900/70">
                      {item.description[lang]}
                    </p>

                    <div className="mt-5 flex items-center justify-between border-t border-pine-900/5 pt-4">
                      <Link
                        to={localePath(lang, `/tribunes/${item.slug}`)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-gold-700 hover:text-gold-800"
                      >
                        <Play size={13} fill="currentColor" />
                        {isFr ? 'Écouter sur la page article' : 'Listen on article page'}
                      </Link>

                      <Link
                        to={localePath(lang, `/tribunes/${item.slug}`)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-pine-900/60 hover:text-gold-700"
                      >
                        {isFr ? 'Lire le texte' : 'Read text'} <ExternalLink size={12} />
                      </Link>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Empty State */}
          {totalCount === 0 && (
            <div className="mt-12 rounded-2xl border border-dashed border-pine-900/20 bg-white p-12 text-center">
              <Headphones size={36} className="mx-auto text-pine-900/30" />
              <p className="mt-3 text-sm font-semibold text-pine-950">
                {isFr ? 'Aucun épisode ne correspond à votre recherche.' : 'No episode matches your search.'}
              </p>
              <button
                type="button"
                onClick={() => {
                  setTab('all');
                  setSearch('');
                }}
                className="mt-3 text-xs font-semibold text-gold-700 underline"
              >
                {isFr ? 'Réinitialiser les filtres' : 'Reset filters'}
              </button>
            </div>
          )}

          {/* RSS Subscription Card */}
          <div className="mt-16 overflow-hidden rounded-3xl border border-pine-900/10 bg-gradient-to-r from-pine-900 to-pine-950 p-8 text-ivory shadow-xl sm:p-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-gold-400">
                  <Rss size={14} /> {isFr ? 'Abonnement & Flux RSS' : 'Subscribe & RSS Feed'}
                </p>
                <h3 className="mt-2 font-display text-2xl font-semibold text-white">
                  {isFr ? 'Écoutez sur vos applications de podcast préférées' : 'Listen on your favorite podcast apps'}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-pine-100/80">
                  {isFr
                    ? 'Le flux RSS podcast est standardisé (RSS 2.0 + balises iTunes). Vous pouvez l’ajouter sur Apple Podcasts, Spotify, Overcast, Pocket Casts ou toute autre application.'
                    : 'The podcast RSS feed complies with RSS 2.0 and iTunes specifications. Add it to Apple Podcasts, Spotify, Pocket Casts, or any standard player.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleCopyRss}
                  className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-5 py-2.5 text-xs font-bold text-pine-950 shadow-md transition-transform hover:scale-105 hover:bg-gold-400"
                >
                  {copiedRss ? <Check size={14} /> : <Copy size={14} />}
                  {copiedRss
                    ? (isFr ? 'Lien copié !' : 'Link copied!')
                    : (isFr ? 'Copier le flux RSS' : 'Copy RSS feed')}
                </button>

                <a
                  href={isFr ? '/podcast-fr.xml' : '/podcast.xml'}
                  target="_blank"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-white/10"
                >
                  <Rss size={14} />
                  {isFr ? 'Ouvrir podcast-fr.xml' : 'Open podcast.xml'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-pine-950/90 p-4 backdrop-blur-sm"
          onClick={() => setActiveVideo(null)}
          role="dialog"
          aria-modal="true"
          aria-label={activeVideo.title}
        >
          <div
            ref={modalRef}
            className="relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              ref={closeRef}
              type="button"
              onClick={() => setActiveVideo(null)}
              aria-label={isFr ? 'Fermer' : 'Close'}
              className="absolute -top-12 right-0 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-ivory transition-colors hover:bg-white/10"
            >
              <X size={20} />
            </button>
            <div className="aspect-video w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${activeVideo.id}?autoplay=1&rel=0&modestbranding=1`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
