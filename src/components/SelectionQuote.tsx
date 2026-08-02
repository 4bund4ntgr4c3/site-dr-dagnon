import { useEffect, useRef, useState } from 'react';
import { Quote, Check } from 'lucide-react';
import { useLang } from '@/i18n/useLang';
import { UI } from '@/i18n/translations';
import { track } from '@/lib/analytics';

/* Highlight-to-quote: selecting a passage inside the article shows a small
   floating button that copies the selection with its source attribution —
   the reading-mode equivalent of the citation modal on the publications
   list. The selection is restricted to the article body (the `container`
   selector), so selecting the share row or the nav copies nothing. */

export function SelectionQuote({ source, url, container }: { source: string; url: string; container: string }) {
  const { lang } = useLang();
  const t = UI[lang];
  const [box, setBox] = useState<{ top: number; left: number } | null>(null);
  const [copied, setCopied] = useState(false);
  const textRef = useRef('');

  useEffect(() => {
    const update = () => {
      const sel = window.getSelection();
      const text = sel?.toString().trim() ?? '';
      if (text.length < 20) {
        setBox(null);
        return;
      }
      const anchor = sel?.anchorNode;
      if (!(anchor instanceof Node) || !anchor.parentElement?.closest(container)) {
        setBox(null);
        return;
      }
      const rect = sel!.getRangeAt(0).getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) {
        setBox(null);
        return;
      }
      textRef.current = text;
      /* keep the button on screen: clamp to the viewport width, and prefer
         above the selection (it disappears under the finger on touch) */
      const left = Math.min(Math.max(rect.left + rect.width / 2 - 72, 12), window.innerWidth - 160);
      setBox({ top: Math.max(rect.top - 46, 8), left });
    };
    const hide = () => setBox(null);
    document.addEventListener('selectionchange', update);
    window.addEventListener('scroll', hide, true);
    window.addEventListener('resize', hide);
    return () => {
      document.removeEventListener('selectionchange', update);
      window.removeEventListener('scroll', hide, true);
      window.removeEventListener('resize', hide);
    };
  }, [container]);

  const copy = async () => {
    const quote = `« ${textRef.current} » — ${source} (${url})`;
    try {
      await navigator.clipboard.writeText(quote);
      setCopied(true);
      track('quote_copy', { event_category: 'engagement', event_label: url });
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked — the selection remains available for manual copy */
    }
  };

  if (!box) return null;

  return (
    <div
      role="status"
      className="fixed z-[70]"
      style={{ top: box.top, left: box.left }}
    >
      <button
        type="button"
        onClick={copy}
        className="inline-flex items-center gap-1.5 rounded-full bg-pine-950 px-4 py-2 text-[12px] font-semibold text-gold-300 shadow-xl shadow-pine-950/30 ring-1 ring-gold-500/40 transition-all hover:-translate-y-0.5 hover:bg-pine-900"
      >
        {copied ? <Check size={13} /> : <Quote size={13} />}
        {copied ? t['article.quoteCopied'] : t['article.quoteCopy']}
      </button>
    </div>
  );
}
