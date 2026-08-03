import { useEffect, useMemo, useState } from 'react';
import { Volume2, Pause, Play } from 'lucide-react';
import { useLang } from '@/i18n/useLang';
import { UI } from '@/i18n/translations';
import { track } from '@/lib/analytics';

/* In-browser text-to-speech for article bodies. No audio files, no network:
   the browser's speechSynthesis reads the article aloud in the current
   language. Falls back to nothing (renders null) where the API is missing —
   including the build-time server render, where `window` does not exist. */

export function ArticleAudio({ text }: { text: string }) {
  const { lang } = useLang();
  const t = UI[lang];
  const [supported] = useState(() => typeof window !== 'undefined' && 'speechSynthesis' in window);
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);

  /* re-reading after a language switch must start from the new language's
     text — the utterance is rebuilt whenever the text changes */
  const utter = useMemo(() => {
    if (!supported) return null;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang === 'fr' ? 'fr-FR' : 'en-US';
    u.rate = 0.95;
    u.onend = () => {
      setSpeaking(false);
      setPaused(false);
    };
    u.onerror = () => {
      setSpeaking(false);
      setPaused(false);
    };
    return u;
  }, [text, supported, lang]);

  useEffect(
    () => () => {
      /* leaving the page (or unmounting) must never leave the browser
         reading aloud */
      if (supported) window.speechSynthesis.cancel();
    },
    [supported],
  );

  if (!supported || !utter) return null;

  const toggle = () => {
    const synth = window.speechSynthesis;
    if (speaking && !paused) {
      synth.pause();
      setPaused(true);
      track('pause_article_audio', { event_category: 'engagement', event_label: 'tribune' });
      return;
    }
    if (paused) {
      synth.resume();
      setPaused(false);
      return;
    }
    synth.cancel();
    synth.speak(utter);
    setSpeaking(true);
    track('play_article_audio', { event_category: 'engagement', event_label: 'tribune' });
  };

  const stop = () => {
    window.speechSynthesis.cancel();
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
