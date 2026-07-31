import { useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { Link } from 'react-router';
import { Search, FileText, Newspaper, FolderKanban, Clapperboard, CalendarDays, ArrowUpRight, CornerDownLeft } from 'lucide-react';
import { useLang } from '@/i18n/useLang';
import { UI, NAV } from '@/i18n/translations';
import { localePath } from '@/i18n/routing';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { TRIBUNES } from '@/data/tribunes';
import { PROJECTS } from '@/data/projects';
import { PUB_ITEMS } from '@/data/publications';
import { MEDIA_ITEMS } from '@/data/media';
import { AGENDA_ITEMS } from '@/data/agenda';
import type { Lang } from '@/i18n/lang';

interface SearchEntry {
  id: string;
  kind: 'page' | 'tribune' | 'project' | 'publication' | 'media' | 'agenda';
  title: string;
  description: string;
  href: string;
  external?: boolean;
}

const KIND_ORDER: Record<SearchEntry['kind'], number> = {
  page: 0,
  tribune: 1,
  project: 2,
  publication: 3,
  media: 4,
  agenda: 5,
};

const KIND_ICON: Record<SearchEntry['kind'], typeof FileText> = {
  page: FileText,
  tribune: Newspaper,
  project: FolderKanban,
  publication: FileText,
  media: Clapperboard,
  agenda: CalendarDays,
};

/* Pages with a real route of their own. Labels: NAV ids for the pages that
   have one, a UI key otherwise ('nav.home' and 'cvPage.badge' exist only as
   UI keys). */
const PAGE_ROUTES: { labelKey: string; path: string }[] = [
  { labelKey: 'nav.home', path: '/' },
  { labelKey: 'contact', path: '/contact' },
  { labelKey: 'medias', path: '/media' },
  { labelKey: 'publications', path: '/publications' },
  { labelKey: 'tribunes', path: '/tribunes' },
  { labelKey: 'projets', path: '/projets' },
  { labelKey: 'agenda', path: '/agenda' },
  { labelKey: 'cvPage.badge', path: '/cv' },
  { labelKey: 'pressePage.title', path: '/presse' },
  { labelKey: 'invitePage.title', path: '/inviter' },
  { labelKey: 'newsletterPage.title', path: '/newsletter' },
];

function buildIndex(lang: Lang): SearchEntry[] {
  const t = UI[lang];
  const entries: SearchEntry[] = [];

  for (const r of PAGE_ROUTES) {
    const nav = NAV[lang].find((n) => n.id === r.labelKey);
    const label = nav?.label ?? t[r.labelKey as keyof typeof t] ?? r.labelKey;
    entries.push({
      id: `page-${r.path}`,
      kind: 'page',
      title: label,
      description: '',
      href: localePath(lang, r.path),
    });
  }
  for (const t of TRIBUNES) {
    entries.push({
      id: `tribune-${t.slug}`,
      kind: 'tribune',
      title: t.title[lang],
      description: t.description[lang],
      href: localePath(lang, `/tribunes/${t.slug}`),
    });
  }
  for (const p of PROJECTS) {
    entries.push({
      id: `project-${p.slug}`,
      kind: 'project',
      title: p.title[lang],
      description: p.description[lang],
      href: localePath(lang, `/projets/${p.slug}`),
    });
  }
  for (const p of PUB_ITEMS) {
    entries.push({
      id: `pub-${p.id}`,
      kind: 'publication',
      title: p.title[lang],
      description: `${p.journal[lang]} — ${p.year}`,
      href: p.url ?? localePath(lang, '/publications'),
      external: !!p.url,
    });
  }
  for (const m of MEDIA_ITEMS) {
    entries.push({
      id: `media-${m.id}`,
      kind: 'media',
      title: m.title[lang],
      description: m.description?.[lang] ?? '',
      href: localePath(lang, `/media/${m.category}`),
    });
  }
  for (const a of AGENDA_ITEMS) {
    entries.push({
      id: `agenda-${a.id}`,
      kind: 'agenda',
      title: a.title[lang],
      description: a.description[lang],
      href: localePath(lang, '/agenda'),
    });
  }
  return entries;
}

export function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lang } = useLang();
  const t = UI[lang];
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  /* Escape closes, Tab stays inside the dialog, the page behind stops
     scrolling — same trap the mobile menu uses. */
  useFocusTrap(containerRef, inputRef, open, onClose);

  const index = useMemo(() => buildIndex(lang), [lang]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return index
      .filter((e) => {
        const hay = `${e.title} ${e.description}`.toLowerCase();
        return hay.includes(q);
      })
      .sort((a, b) => {
        const aTitle = a.title.toLowerCase().includes(q) ? 0 : 1;
        const bTitle = b.title.toLowerCase().includes(q) ? 0 : 1;
        return aTitle - bTitle || KIND_ORDER[a.kind] - KIND_ORDER[b.kind];
      })
      .slice(0, 12);
  }, [index, query]);

  const onKeyDown = (e: ReactKeyboardEvent) => {
    if (results.length === 0) return;
    const last = results.length - 1;
    let next = active;
    if (e.key === 'ArrowDown') next = Math.min(active + 1, last);
    else if (e.key === 'ArrowUp') next = Math.max(active - 1, 0);
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = last;
    else if (e.key === 'Enter') {
      e.preventDefault();
      const idx = Math.min(active, results.length - 1);
      listRef.current?.querySelectorAll<HTMLAnchorElement>('a')[idx]?.click();
      return;
    } else return;
    e.preventDefault();
    setActive(next);
    listRef.current?.querySelectorAll<HTMLAnchorElement>('a')[next]?.focus();
  };

  if (!open) return null;

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label={t['search.open']}
      className="fixed inset-0 z-[60] flex items-start justify-center bg-pine-950/80 px-4 pt-[12vh] backdrop-blur-sm"
    >
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-pine-950 shadow-2xl shadow-pine-950/60">
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
          <Search size={18} className="shrink-0 text-gold-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            placeholder={t['search.placeholder']}
            autoComplete="off"
            spellCheck={false}
            aria-label={t['search.open']}
            className="w-full bg-transparent text-[15px] text-ivory placeholder:text-pine-100/40 outline-none"
          />
          <kbd className="hidden shrink-0 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-semibold text-pine-100/60 sm:block">
            ESC
          </kbd>
        </div>

        <div ref={listRef} className="max-h-[52vh] overflow-y-auto p-2">
          {query.trim() && results.length === 0 && (
            <p className="px-4 py-8 text-center text-sm text-pine-100/60">
              {t['search.empty']} «&nbsp;{query.trim()}&nbsp;»
            </p>
          )}

          {results.map((r, i) => {
            const Icon = KIND_ICON[r.kind];
            const cls = `flex items-start gap-3 rounded-2xl px-4 py-3 transition-colors ${
              i === active ? 'bg-white/10' : 'hover:bg-white/5'
            }`;
            const inner = (
              <>
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gold-500/10 text-gold-400">
                  <Icon size={15} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="truncate text-[13.5px] font-semibold text-ivory">{r.title}</span>
                    <span className="shrink-0 rounded-full bg-white/5 px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-pine-100/55">
                      {t[`search.kind.${r.kind}`]}
                    </span>
                  </span>
                  {r.description && (
                    <span className="mt-0.5 block truncate text-[12px] text-pine-100/55">{r.description}</span>
                  )}
                </span>
                {r.external && <ArrowUpRight size={14} className="mt-1 shrink-0 text-pine-100/40" />}
              </>
            );
            return r.external ? (
              <a key={r.id} href={r.href} target="_blank" rel="noreferrer" className={cls}>
                {inner}
              </a>
            ) : (
              <Link key={r.id} to={r.href} onClick={onClose} className={cls}>
                {inner}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-4 border-t border-white/10 px-5 py-3 text-[11px] text-pine-100/50">
          <span className="inline-flex items-center gap-1.5">
            <kbd className="rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px]">↑</kbd>
            <kbd className="rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px]">↓</kbd>
            {t['search.hintMove']}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CornerDownLeft size={12} />
            {t['search.hintOpen']}
          </span>
        </div>
      </div>
    </div>
  );
}
