import { useEffect, useMemo, useRef, useState } from 'react';
import { Volume2, Pause, Play } from 'lucide-react';
import { useLang } from '@/i18n/useLang';
import { UI } from '@/i18n/translations';
import { track } from '@/lib/analytics';

/* In-browser text-to-speech for article bodies. No audio files, no network:
   the browser's speechSynthesis reads the article aloud in the current
   language. Falls back to nothing (renders null) where the API is missing —
   including the build-time server render, where `window` does not exist.

   Two mobile pitfalls are handled here:
   - most Chrome/Safari mobile builds ship NO default voice, so speak() on a
     voice-less utterance is silent — we load getVoices() (empty at first, it
     fills on the voiceschanged event) and pin an explicit fr-FR/en-US voice;
   - long bodies hit Chrome's ~15s pause and iOS length limits, so the text is
     split on sentence boundaries and read one bounded chunk at a time. */

export function ArticleAudio({ text }: { text: string }) {
  const { lang } = useLang();
  const t = UI[lang];
  const [supported] = useState(() => typeof window !== 'undefined' && 'speechSynthesis' in window);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!supported) return;
    const synth = window.speechSynthesis;
    const load = () => setVoices(synth.getVoices());
    load();
    synth.addEventListener('voiceschanged', load);
    return () => synth.removeEventListener('voiceschanged', load);
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

  const chunks = useMemo(() => {
    const sentences = text.match(/[^.!?…]+[.!?…]+|.+$/g) ?? [text];
    const out: string[] = [];
    let buf = '';
    for (const s of sentences) {
      if ((buf + s).length > 600 && buf) {
        out.push(buf.trim());
        buf = s;
      } else {
        buf += s;
      }
    }
    if (buf.trim()) out.push(buf.trim());
    return out;
  }, [text]);

  /* the queue index is the only state that must outlive renders: onend fires
     asynchronously, long after the event handler that started the queue */
  const indexRef = useRef(0);
  const pausedRef = useRef(false);

  const speakChunk = (i: number) => {
    const synth = window.speechSynthesis;
    const u = new SpeechSynthesisUtterance(chunks[i] ?? '');
    u.lang = lang === 'fr' ? 'fr-FR' : 'en-US';
    u.rate = 0.95;
    if (voice) u.voice = voice;
    u.onend = () => {
      if (pausedRef.current) {
        /* paused while the engine was idle between chunks — remember where */
        indexRef.current = i + 1;
        return;
      }
      if (i + 1 < chunks.length) {
        indexRef.current = i + 1;
        speakChunk(i + 1);
      } else {
        indexRef.current = 0;
        setSpeaking(false);
        setPaused(false);
      }
    };
    u.onerror = () => {
      indexRef.current = 0;
      setSpeaking(false);
      setPaused(false);
    };
    synth.speak(u);
  };

  useEffect(() => () => {
    /* leaving the page (or unmounting) must never leave the browser
       reading aloud */
    if (supported) window.speechSynthesis.cancel();
  }, [supported]);

  if (!supported) return null;

  const toggle = () => {
    const synth = window.speechSynthesis;
    if (speaking && !paused) {
      pausedRef.current = true;
      synth.pause();
      setPaused(true);
      track('pause_article_audio', { event_category: 'engagement', event_label: 'tribune' });
      return;
    }
    if (paused) {
      pausedRef.current = false;
      setPaused(false);
      if (synth.speaking || synth.pending) synth.resume();
      else speakChunk(indexRef.current);
      return;
    }
    synth.cancel();
    indexRef.current = 0;
    setSpeaking(true);
    speakChunk(0);
    track('play_article_audio', { event_category: 'engagement', event_label: 'tribune' });
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    indexRef.current = 0;
    setSpeaking(false);
    setPaused(false);
  };

  return (
    <span className="inline-flex items-center gap-1.5">
      <button
        type="button"
        onClick={toggle}
        aria-label={paused ? t['article.audioResume'] : speaking ? t['article.audioPause'] : t['article.audioListen']}
        aria-pressed={speaking}
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11.5px] font-semibold transition-all ${
          speaking
            ? 'bg-gold-500 text-pine-950'
            : 'border border-gold-500/50 text-gold-300 hover:bg-gold-500 hover:text-pine-950'
        }`}
      >
        {paused ? <Play size={12} /> : speaking ? <Pause size={12} /> : <Volume2 size={12} />}
        {paused ? t['article.audioResume'] : speaking ? t['article.audioPause'] : t['article.audioListen']}
      </button>
      {speaking && (
        <button
          type="button"
          onClick={stop}
          aria-label={t['article.audioStop']}
          className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-pine-100/85 transition-colors hover:text-gold-300"
        >
          {t['article.audioStop']}
        </button>
      )}
    </span>
  );
}
