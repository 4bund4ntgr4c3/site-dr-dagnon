import { Play, FileText, Image as ImageIcon, ArrowUpRight, CalendarPlus } from 'lucide-react';
import { gcalUrl } from '@/lib/calendar-links';
import type { MediaEntry } from '@/data/media';
import { catLabelKey } from './categories';
import { formatDate, type T } from './helpers';

export function MediaCard({
  m,
  lang,
  t,
  onOpen,
}: {
  m: MediaEntry;
  lang: 'fr' | 'en';
  t: T;
  onOpen: () => void;
}) {
  const isDoc = m.type === 'document';
  const meta = `${t[catLabelKey(m.category) as keyof typeof t] || m.category} · ${formatDate(m.date, lang)}`;

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-pine-900/10 bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-gold-500/40">
      {isDoc ? (
        <a
          href={m.url}
          target="_blank"
          rel="noreferrer"
          aria-label={m.title[lang]}
          className="relative flex aspect-video items-center justify-center overflow-hidden bg-gradient-to-br from-pine-800 to-pine-950"
        >
          {m.thumb ? (
            <img
              src={m.thumb}
              alt={m.title[lang]}
              width={320}
              height={180}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold-500/15 text-gold-400 ring-1 ring-gold-500/40 transition-transform duration-300 group-hover:scale-110">
              <FileText size={24} />
            </span>
          )}
        </a>
      ) : (
        <button
          type="button"
          onClick={onOpen}
          className="relative block aspect-video w-full overflow-hidden text-left"
        >
          <img
            src={m.type === 'video' ? m.thumb : m.src}
            alt={m.title[lang]}
            width={320}
            height={180}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-pine-950/40 transition-colors group-hover:bg-pine-950/20" />
          <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gold-500 text-pine-950 shadow-xl transition-transform duration-300 group-hover:scale-110">
            {m.type === 'video' ? (
              <Play size={22} className="ml-0.5" fill="currentColor" />
            ) : (
              <ImageIcon size={22} />
            )}
          </span>
        </button>
      )}

      <div className="flex flex-1 flex-col p-5">
        <p className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-gold-700">
          {meta}
        </p>
        <h3 className="mt-2 font-display text-[1.15rem] font-semibold leading-snug text-pine-900">
          {m.title[lang]}
        </h3>
        {m.description && (
          <p className="mt-2 flex-1 text-[12.5px] leading-relaxed text-pine-900/70 line-clamp-3">{m.description[lang]}</p>
        )}
        {isDoc && (
          <a
            href={m.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`${m.category === 'press' ? t['mediaPage.readMore'] : t['mediaPage.download']} : ${m.title[lang]}`}
            className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-semibold text-gold-700 transition-colors hover:text-gold-500"
          >
            {m.category === 'press' ? t['mediaPage.readMore'] : t['mediaPage.download']}
            <span className="sr-only"> : {m.title[lang]}</span>
            <ArrowUpRight size={13} />
          </a>
        )}
        {!isDoc && m.type === 'image' && (
          <button
            type="button"
            onClick={onOpen}
            className="mt-4 inline-flex items-center gap-1.5 text-left text-[12px] font-semibold text-gold-700 transition-colors hover:text-gold-500"
          >
            {t['mediaPage.view']}
            <ArrowUpRight size={13} />
          </button>
        )}
        {m.type === 'video' && m.date && (
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={gcalUrl({ date: m.date, title: m.title[lang], description: m.description?.[lang] || m.title[lang], location: '' })}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-gold-500/40 px-3 py-1.5 text-[11.5px] font-semibold text-gold-700 transition-colors hover:bg-gold-500 hover:text-pine-950"
            >
              <CalendarPlus size={12} /> {t['mediaPage.addCalendar']}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
