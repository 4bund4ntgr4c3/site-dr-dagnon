import { useEffect, useRef, useState } from 'react';
import { X, Copy, Check, Quote } from 'lucide-react';
import { useLang } from '@/i18n/useLang';
import { UI } from '@/i18n/translations';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { citationApa, citationBibtex, citationRis, type CitationSource } from '@/lib/citations';
import type { PubEntry } from '@/data/publications';
import type { BibEntry } from '@/data/bibliography';

const FORMATS = ['bibtex', 'ris', 'apa'] as const;
type Format = (typeof FORMATS)[number];

export function CitationModal({ p, onClose }: { p: PubEntry; onClose: () => void }) {
  const { lang } = useLang();
  const t = UI[lang];
  const [format, setFormat] = useState<Format>('bibtex');
  const [copied, setCopied] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const copyRef = useRef<HTMLButtonElement>(null);

  useFocusTrap(modalRef, closeRef, true, onClose);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  /* bibliography entries are PubEntries plus scholarly metadata; carry the
     extra fields through so BibTeX/RIS/APA include the DOI when present */
  const bib = (p as Partial<BibEntry>).doi || (p as Partial<BibEntry>).volume ? (p as BibEntry) : null;

  const src: CitationSource = {
    id: p.id,
    title: p.title[lang],
    authors: p.authors[lang],
    journal: p.journal[lang],
    year: p.year,
    url: p.url,
    doi: bib?.doi,
    volume: bib?.volume,
    issue: bib?.issue,
    pages: bib?.pages,
    type: p.type === 'blog' ? 'blog' : 'paper',
  };

  const text = format === 'bibtex' ? citationBibtex(src) : format === 'ris' ? citationRis(src) : citationApa(src);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — the text stays visible for manual selection */
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-pine-950/90 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={t['cite.title']}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl border border-pine-900/10 bg-white p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={t['media.close']}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-pine-900/15 text-pine-900 transition-colors hover:bg-pine-50"
        >
          <X size={20} />
        </button>

        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gold-500 text-pine-950">
          <Quote size={20} />
        </span>
        <h2 className="mt-4 pr-12 font-display text-xl font-semibold text-pine-900">{t['cite.title']}</h2>
        <p className="mt-1.5 text-[13.5px] leading-snug text-pine-900/70">
          {src.authors} · {src.journal} · {src.year}
        </p>

        <div role="tablist" aria-label={t['cite.title']} className="mt-6 flex gap-2">
          {FORMATS.map((f) => (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={format === f}
              onClick={() => setFormat(f)}
              className={`rounded-full px-4 py-1.5 text-[12.5px] font-semibold transition-all ${
                format === f
                  ? 'bg-pine-950 text-gold-400 shadow'
                  : 'bg-pine-900/5 text-ink/75 ring-1 ring-pine-900/10 hover:text-pine-900 hover:ring-gold-500/50'
              }`}
            >
              {t[`cite.${f}` as 'cite.bibtex' | 'cite.ris' | 'cite.apa']}
            </button>
          ))}
        </div>

        <pre className="mt-4 max-h-64 overflow-auto whitespace-pre-wrap rounded-2xl bg-pine-950 p-5 font-mono text-[12px] leading-relaxed text-pine-100">
          {text}
        </pre>

        <div className="mt-5 flex items-center gap-3">
          <button
            ref={copyRef}
            type="button"
            onClick={copy}
            className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-2.5 text-sm font-semibold text-pine-950 transition-all hover:-translate-y-0.5 hover:bg-gold-400"
          >
            {copied ? <Check size={15} /> : <Copy size={15} />}
            {copied ? t['cite.copied'] : t['cite.copy']}
          </button>
          <span aria-live="polite" className="sr-only">
            {copied ? t['cite.copied'] : ''}
          </span>
        </div>
      </div>
    </div>
  );
}
