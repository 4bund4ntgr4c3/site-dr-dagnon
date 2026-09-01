import { useState, useEffect, useMemo, useSyncExternalStore } from 'react';
import { Play, Pause, RotateCcw, FastForward, Rewind, Volume2 } from 'lucide-react';
import { useLang } from '@/i18n/useLang';
import type { TribuneBlock } from '@/data/tribunes';

interface TribuneAudioPlayerProps {
  title: string;
  byline?: string;
  blocks: TribuneBlock[];
}

const emptySubscribe = () => () => {};

export function TribuneAudioPlayer({ title, byline, blocks }: TribuneAudioPlayerProps) {
  const { lang } = useLang();
  const isFr = lang === 'fr';

  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentBlockIdx, setCurrentBlockIdx] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

  const isSupported = useSyncExternalStore(
    emptySubscribe,
    () => typeof window !== 'undefined' && 'speechSynthesis' in window,
    () => false
  );

  // Compute text chunks cleanly with useMemo
  const textChunks = useMemo(() => {
    const chunks: string[] = [];
    if (title) chunks.push(title);
    if (byline) chunks.push(byline);
    for (const b of blocks) {
      if (b.kind === 'p' || b.kind === 'quote' || b.kind === 'h2') {
        chunks.push(b.text);
      }
    }
    return chunks;
  }, [title, byline, blocks]);

  // Handle Speech playback
  const speakChunk = (index: number) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    if (index >= textChunks.length) {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentBlockIdx(0);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(textChunks[index]);
    utterance.lang = isFr ? 'fr-FR' : 'en-US';
    utterance.rate = playbackRate;

    // Pick best matching voice if available
    const voices = window.speechSynthesis.getVoices();
    const langPrefix = isFr ? 'fr' : 'en';
    const matchedVoice = voices.find((v) => v.lang.toLowerCase().startsWith(langPrefix));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onend = () => {
      setCurrentBlockIdx(index + 1);
      speakChunk(index + 1);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handlePlayPause = () => {
    if (!isPlaying) {
      speakChunk(currentBlockIdx);
    } else if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const handleStop = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentBlockIdx(0);
  };

  const handleSkipForward = () => {
    const nextIdx = Math.min(currentBlockIdx + 1, textChunks.length - 1);
    setCurrentBlockIdx(nextIdx);
    if (isPlaying) {
      speakChunk(nextIdx);
    }
  };

  const handleSkipBackward = () => {
    const prevIdx = Math.max(currentBlockIdx - 1, 0);
    setCurrentBlockIdx(prevIdx);
    if (isPlaying) {
      speakChunk(prevIdx);
    }
  };

  const cycleSpeed = () => {
    const speeds = [1, 1.25, 1.5, 2];
    const currentIdx = speeds.indexOf(playbackRate);
    const nextSpeed = speeds[(currentIdx + 1) % speeds.length];
    setPlaybackRate(nextSpeed);
    if (isPlaying && !isPaused) {
      speakChunk(currentBlockIdx);
    }
  };

  // Clean up synthesis on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!isSupported) return null;

  const totalChunks = textChunks.length || 1;
  const progressPercent = Math.round(((currentBlockIdx + 1) / totalChunks) * 100);

  return (
    <div className="rounded-2xl border border-gold-500/30 bg-pine-950 p-4 text-white shadow-lg sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Title & Badge */}
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold-500/20 text-gold-400">
            <Volume2 size={18} />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold tracking-wider text-gold-400 uppercase">
                {isFr ? 'Audio Op-Ed • Synthèse Vocale' : 'Audio Op-Ed • Voice Synthesis'}
              </span>
              {isPlaying && !isPaused && (
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                  <span className="h-1.5 w-1.5 animate-ping rounded-full bg-emerald-400" />
                  {isFr ? 'En lecture' : 'Playing'}
                </span>
              )}
            </div>
            <p className="text-[13px] font-medium text-pine-100 line-clamp-1">
              {isFr ? 'Écouter cette tribune du Dr. Seynudé Dagnon' : 'Listen to this op-ed by Dr. Seynudé Dagnon'}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Skip Backward */}
          <button
            type="button"
            onClick={handleSkipBackward}
            disabled={currentBlockIdx === 0}
            className="rounded-lg p-2 text-pine-300 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-40"
            aria-label={isFr ? 'Paragraphe précédent' : 'Previous paragraph'}
          >
            <Rewind size={16} />
          </button>

          {/* Main Play / Pause Button */}
          <button
            type="button"
            onClick={handlePlayPause}
            className="inline-flex items-center justify-center rounded-full bg-gold-400 p-2.5 text-pine-950 shadow-md transition-transform hover:scale-105 hover:bg-gold-300"
            aria-label={isPlaying && !isPaused ? (isFr ? 'Mettre en pause' : 'Pause') : isFr ? 'Écouter la tribune' : 'Listen to op-ed'}
          >
            {isPlaying && !isPaused ? <Pause size={18} className="fill-current" /> : <Play size={18} className="fill-current ml-0.5" />}
          </button>

          {/* Skip Forward */}
          <button
            type="button"
            onClick={handleSkipForward}
            disabled={currentBlockIdx >= totalChunks - 1}
            className="rounded-lg p-2 text-pine-300 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-40"
            aria-label={isFr ? 'Paragraphe suivant' : 'Next paragraph'}
          >
            <FastForward size={16} />
          </button>

          {/* Reset / Stop Button */}
          {isPlaying && (
            <button
              type="button"
              onClick={handleStop}
              className="rounded-lg p-2 text-pine-300 transition-colors hover:bg-white/10 hover:text-white"
              aria-label={isFr ? 'Arrêter la lecture' : 'Stop playback'}
            >
              <RotateCcw size={15} />
            </button>
          )}

          {/* Speed Toggle */}
          <button
            type="button"
            onClick={cycleSpeed}
            className="rounded-lg border border-white/15 bg-white/5 px-2 py-1 font-mono text-[11px] font-semibold text-gold-300 transition-colors hover:bg-white/10"
            aria-label={isFr ? `Vitesse de lecture : ${playbackRate}x` : `Playback speed: ${playbackRate}x`}
          >
            {playbackRate}x
          </button>
        </div>
      </div>

      {/* Progress bar */}
      {isPlaying && (
        <div className="mt-3 space-y-1">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full bg-gradient-to-r from-gold-500 to-gold-300 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-pine-400 font-mono">
            <span>
              {isFr ? 'Paragraphe' : 'Paragraph'} {currentBlockIdx + 1} / {totalChunks}
            </span>
            <span>{progressPercent}%</span>
          </div>
        </div>
      )}
    </div>
  );
}
