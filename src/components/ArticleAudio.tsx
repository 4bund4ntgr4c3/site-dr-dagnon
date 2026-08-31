import { useEffect, useMemo, useRef, useState } from 'react';
import { Pause, Play, RotateCcw, FastForward } from 'lucide-react';
import { useLang } from '@/i18n/useLang';
import { track } from '@/lib/analytics';

interface ArticleAudioProps {
  text: string;
  label?: string;
}

export function ArticleAudio({ text, label = 'tribune' }: ArticleAudioProps) {
  const { lang } = useLang();
  const isFr = lang === 'fr';

  const [supported] = useState(() => typeof window !== 'undefined' && 'speechSynthesis' in window);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [chunkIndex, setChunkIndex] = useState(0);
  const [rate, setRate] = useState<number>(1);

  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (!supported) return;
    synthRef.current = window.speechSynthesis;
    const loadVoices = () => {
      setVoices(window.speechSynthesis.getVoices());
    };
    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [supported]);

  const voice = useMemo(() => {
    if (!voices.length) return undefined;
    const tag = lang === 'fr' ? 'fr' : 'en';
    const exact = tag === 'fr' ? 'fr-FR' : 'en-US';
    return (
      voices.find((v) => v.lang.toLowerCase() === exact) ??
      voices.find((v) => v.lang.toLowerCase().startsWith(`${tag}-`)) ??
      voices.find((v) => v.lang.toLowerCase() === tag)
    );
  }, [voices, lang]);

  // Break text into digestible chunks for speech engine
  const chunks = useMemo(() => {
    const sentences = text.match(/[^.!?…]+[.!?…]+|.+$/g) ?? [text];
    const out: string[] = [];
    let buf = '';
    for (const s of sentences) {
      if ((buf + s).length > 500 && buf) {
        out.push(buf.trim());
        buf = s;
      } else {
        buf += s;
      }
    }
    if (buf.trim()) out.push(buf.trim());
    return out;
  }, [text]);

  const speakChunk = (idx: number, playRate: number = rate) => {
    if (!synthRef.current || idx >= chunks.length) {
      setSpeaking(false);
      setPaused(false);
      setChunkIndex(0);
      return;
    }

    setChunkIndex(idx);
    const u = new SpeechSynthesisUtterance(chunks[idx]);
    if (voice) u.voice = voice;
    u.lang = lang === 'fr' ? 'fr-FR' : 'en-US';
    u.rate = playRate;

    u.onend = () => {
      if (idx + 1 < chunks.length) {
        speakChunk(idx + 1, playRate);
      } else {
        setSpeaking(false);
        setPaused(false);
        setChunkIndex(0);
      }
    };

    u.onerror = (e) => {
      if (e.error !== 'canceled') {
        setSpeaking(false);
        setPaused(false);
      }
    };

    utteranceRef.current = u;
    synthRef.current.speak(u);
  };

  const handlePlayPause = () => {
    if (!synthRef.current) return;

    if (!speaking) {
      track('article_audio_start', { label, lang, rate });
      setSpeaking(true);
      setPaused(false);
      synthRef.current.cancel();
      speakChunk(chunkIndex, rate);
    } else if (paused) {
      synthRef.current.resume();
      setPaused(false);
    } else {
      synthRef.current.pause();
      setPaused(true);
    }
  };

  const handleReset = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setSpeaking(false);
    setPaused(false);
    setChunkIndex(0);
  };

  const toggleRate = () => {
    const rates = [1, 1.25, 1.5, 0.8];
    const nextIdx = (rates.indexOf(rate) + 1) % rates.length;
    const nextRate = rates[nextIdx];
    setRate(nextRate);
    if (speaking && !paused) {
      if (synthRef.current) synthRef.current.cancel();
      speakChunk(chunkIndex, nextRate);
    }
  };

  const progressPercent = chunks.length > 0 ? Math.round(((chunkIndex + 1) / chunks.length) * 100) : 0;

  if (!supported) return null;

  return (
    <div className="rounded-2xl border border-pine-800/80 bg-pine-900/90 p-4 backdrop-blur-md shadow-lg my-6 print:hidden">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left: Play button + Title */}
        <div className="flex items-center gap-3.5">
          <button
            type="button"
            onClick={handlePlayPause}
            aria-label={speaking && !paused ? (isFr ? 'Mettre en pause' : 'Pause audio') : (isFr ? 'Écouter la tribune' : 'Listen to op-ed')}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-500 text-pine-950 shadow-md shadow-gold-500/25 transition-all hover:scale-105 hover:bg-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400"
          >
            {speaking && !paused ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-pine-100">
                {speaking
                  ? paused
                    ? (isFr ? 'Lecture en pause' : 'Playback paused')
                    : (isFr ? 'Lecture audio en cours' : 'Playing audio narration')
                  : (isFr ? 'Écouter cette tribune' : 'Listen to this op-ed')}
              </span>
              {speaking && !paused && (
                <div className="flex items-center gap-0.5 h-3">
                  <span className="w-0.5 h-full bg-gold-400 animate-pulse rounded-full" />
                  <span className="w-0.5 h-2/3 bg-gold-400 animate-pulse delay-75 rounded-full" />
                  <span className="w-0.5 h-4/5 bg-gold-400 animate-pulse delay-150 rounded-full" />
                </div>
              )}
            </div>
            <p className="text-[11.5px] text-pine-200/70">
              {speaking
                ? `${progressPercent}% • ${chunks.length - chunkIndex} ${isFr ? 'sections restantes' : 'sections remaining'}`
                : (isFr ? 'Synthèse vocale intégrée pour décideurs en déplacement' : 'In-browser speech for leaders on the move')}
            </p>
          </div>
        </div>

        {/* Right: Controls (Speed + Reset) */}
        <div className="flex items-center gap-2">
          {speaking && (
            <button
              type="button"
              onClick={handleReset}
              title={isFr ? 'Recommencer' : 'Restart'}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-pine-200 hover:border-gold-400 hover:text-gold-300 transition-colors"
            >
              <RotateCcw size={13} />
            </button>
          )}

          <button
            type="button"
            onClick={toggleRate}
            title={isFr ? 'Modifier la vitesse de lecture' : 'Change playback speed'}
            className="flex items-center gap-1 h-8 rounded-lg border border-white/15 bg-white/5 px-2.5 text-xs font-bold text-gold-300 hover:border-gold-400 hover:bg-gold-500/10 transition-all"
          >
            <FastForward size={12} />
            <span>{rate}x</span>
          </button>
        </div>
      </div>

      {/* Scrubber progress bar */}
      {speaking && (
        <div className="mt-3 w-full bg-pine-950 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-gold-400 h-full transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}
    </div>
  );
}
