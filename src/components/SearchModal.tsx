import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { Link } from 'react-router';
import { Search, FileText, Newspaper, FolderKanban, Clapperboard, CalendarDays, ArrowUpRight, CornerDownLeft, House, Megaphone } from 'lucide-react';
import { useLang } from '@/i18n/useLang';
import { UI, NAV } from '@/i18n/translations';
import { IDENTITY, EXPERTISE, EXPERIENCE, EDUCATION, AWARDS, ACHIEVEMENTS } from '@/data/site';
import { localePath } from '@/i18n/routing';
import { track } from '@/lib/analytics';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { CAT_NAMES } from '@/seo/meta';
import { TRIBUNES } from '@/data/tribunes';
import { TRIBUNE_BODIES } from '@/data/tribune-bodies';
import { PROJECTS } from '@/data/projects';
import { PROJECT_DETAILS } from '@/data/project-details';
import { PUB_ITEMS } from '@/data/publications';
import { MEDIA_ITEMS } from '@/data/media';
import { AGENDA_ITEMS } from '@/data/agenda';
import type { Lang } from '@/i18n/lang';
import { readAnalyticsConsent } from '@/lib/consent';

interface SearchEntry {
  id: string;
  kind: 'page' | 'section' | 'tribune' | 'project' | 'publication' | 'media' | 'agenda' | 'press';
  title: string;
  /** one-line context shown under the title */
  description: string;
  /** extra searchable tokens not displayed (dates, locations, full text…) */
  keywords?: string;
  /** overrides the kind badge label (e.g. "Parcours" for career entries) */
  badge?: string;
  href: string;
  external?: boolean;
  thumb?: string;
}

const KIND_ORDER: Record<SearchEntry['kind'], number> = {
  page: 0,
  section: 1,
  tribune: 2,
  project: 3,
  publication: 4,
  press: 5,
  media: 6,
  agenda: 7,
};

const KIND_ICON: Record<SearchEntry['kind'], typeof FileText> = {
  page: FileText,
  section: House,
  tribune: Newspaper,
  project: FolderKanban,
  publication: FileText,
  press: Megaphone,
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
  { labelKey: 'collab.title', path: '/collaborate' },
  { labelKey: 'newsletterPage.title', path: '/newsletter' },
  { labelKey: 'nav.podcasts', path: '/podcasts' },
];

/* Home-page sections, searchable by their nav label and anchored to the
   section itself. */
const HOME_SECTIONS: { navId: string; anchor: string }[] = [
  { navId: 'apropos', anchor: 'apropos' },
  { navId: 'expertise', anchor: 'expertise' },
  { navId: 'parcours', anchor: 'parcours' },
  { navId: 'formation', anchor: 'formation' },
  { navId: 'realisations', anchor: 'realisations' },
];

const AGENDA_TYPE_KEY: Record<string, string> = {
  conference: 'agendaPage.type.conference',
  speaking: 'agendaPage.type.speaking',
  community: 'agendaPage.type.community',
  interview: 'agendaPage.type.interview',
  press: 'agendaPage.type.press',
};

function buildIndex(lang: Lang): SearchEntry[] {
  const t = UI[lang];
  const entries: SearchEntry[] = [];
  const sectionLabel = (navId: string) => NAV[lang].find((n) => n.id === navId)?.label ?? navId;

  for (const r of PAGE_ROUTES) {
    const nav = NAV[lang].find((n) => n.id === r.labelKey);
    const label = nav?.label ?? t[r.labelKey as keyof typeof t] ?? r.labelKey;
    entries.push({
      id: `page-${r.path}`,
      kind: 'page',
      title: label,
      description: r.path,
      href: localePath(lang, r.path),
    });
  }

  for (const s of HOME_SECTIONS) {
    const label = sectionLabel(s.navId);
    entries.push({
      id: `section-${s.anchor}`,
      kind: 'section',
      title: label,
      description: '',
      badge: label,
      href: `${localePath(lang, '/')}#${s.anchor}`,
    });
  }
  for (const item of IDENTITY[lang]) {
    entries.push({
      id: `identity-${item.title}`,
      kind: 'section',
      title: item.title,
      description: item.text,
      badge: sectionLabel('apropos'),
      href: `${localePath(lang, '/')}#apropos`,
    });
  }
  for (const item of EXPERTISE[lang]) {
    entries.push({
      id: `expertise-${item.title}`,
      kind: 'section',
      title: item.title,
      description: item.text,
      badge: sectionLabel('expertise'),
      href: `${localePath(lang, '/')}#expertise`,
    });
  }
  for (const item of EXPERIENCE[lang]) {
    entries.push({
      id: `experience-${item.role}`,
      kind: 'section',
      title: item.role,
      description: item.org,
      keywords: `${item.period} ${item.text} ${item.details.responsibilities.join(' ')} ${
        item.details.achievement ?? ''
      } ${(item.details.projects ?? []).map((p) => `${p.name} ${p.scope} ${p.budget}`).join(' ')}`,
      badge: sectionLabel('parcours'),
      href: `${localePath(lang, '/')}#parcours`,
    });
  }
  for (const item of EDUCATION[lang]) {
    entries.push({
      id: `education-${item.degree}`,
      kind: 'section',
      title: item.degree,
      description: `${item.school} — ${item.detail}`,
      keywords: item.tag,
      badge: sectionLabel('formation'),
      href: `${localePath(lang, '/')}#formation`,
    });
  }
  for (const award of AWARDS[lang]) {
    entries.push({
      id: `award-${award.year}-${award.title}`,
      kind: 'section',
      title: award.title,
      description: `${award.year} — ${award.description}`,
      badge: sectionLabel('realisations'),
      href: `${localePath(lang, '/')}#realisations`,
      thumb: award.image,
    });
  }
  for (const item of ACHIEVEMENTS[lang]) {
    entries.push({
      id: `achievement-${item.title}`,
      kind: 'section',
      title: item.title,
      description: item.text,
      keywords: item.metric,
      badge: sectionLabel('realisations'),
      href: `${localePath(lang, '/')}#realisations`,
    });
  }

  for (const tribune of TRIBUNES) {
    /* the full body is part of the searchable keywords, not just the
       headline/description — a phrase buried mid-article still finds it */
    const body = TRIBUNE_BODIES[tribune.slug]?.[lang] ?? [];
    entries.push({
      id: `tribune-${tribune.slug}`,
      kind: 'tribune',
      title: tribune.title[lang],
      description: tribune.description[lang],
      keywords: `${tribune.source.name} ${tribune.date} ${body.map((b) => b.text).join(' ')}`,
      href: localePath(lang, `/tribunes/${tribune.slug}`),
    });
  }
  for (const p of PROJECTS) {
    const details = PROJECT_DETAILS[p.slug];
    entries.push({
      id: `project-${p.slug}`,
      kind: 'project',
      title: p.title[lang],
      description: `${p.tag[lang]} · ${p.location[lang]}`,
      keywords: `${p.period[lang]} ${p.role[lang]} ${p.description[lang]} ${details.context[lang]} ${details.approach[lang].join(' ')} ${details.results
        .map((r) => `${r.value} ${r.label[lang]}`)
        .join(' ')}`,
      href: localePath(lang, `/projets/${p.slug}`),
    });
  }
  for (const p of PUB_ITEMS) {
    entries.push({
      id: `pub-${p.id}`,
      kind: 'publication',
      title: p.title[lang],
      description: `${p.authors[lang]} · ${p.journal[lang]} (${p.year})`,
      keywords: `${p.description[lang]} ${p.year}`,
      href: p.url ?? localePath(lang, '/publications'),
      external: !!p.url,
    });
  }
  /* press coverage gets its own kind and lands on the article itself — the
     media loop below only keeps the other categories */
  for (const m of MEDIA_ITEMS.filter((m) => m.category === 'press')) {
    const outlet = m.fileLabel?.[lang] ?? CAT_NAMES.press?.[lang] ?? 'Press';
    entries.push({
      id: `press-${m.id}`,
      kind: 'press',
      title: m.title[lang],
      description: `${outlet} · ${m.date}`,
      keywords: `${m.date} ${outlet} ${m.description?.[lang] ?? ''}`,
      href: m.url ?? localePath(lang, '/media/press'),
      external: !!m.url,
      thumb: m.thumb,
    });
  }
  for (const m of MEDIA_ITEMS.filter((m) => m.category !== 'press')) {
    const cat = CAT_NAMES[m.category]?.[lang] ?? m.category;
    const isPhoto = m.category === 'community' && m.type === 'image';
    entries.push({
      id: `media-${m.id}`,
      kind: 'media',
      title: m.title[lang],
      description: `${cat} · ${m.date}`,
      keywords: `${m.date} ${cat} ${m.subType ?? ''} ${m.description?.[lang] ?? ''}`,
      /* community photos have their own page — search lands directly on it */
      href: isPhoto
        ? localePath(lang, `/media/community/${m.id}`)
        : localePath(lang, `/media/${m.category}`),
      thumb: m.thumb ?? m.src,
    });
  }
  for (const a of AGENDA_ITEMS) {
    const typeLabel = t[AGENDA_TYPE_KEY[a.type] as keyof typeof t] ?? a.type;
    entries.push({
      id: `agenda-${a.id}`,
      kind: 'agenda',
      title: a.title[lang],
      description: `${typeLabel} · ${a.location[lang]}`,
      keywords: `${a.location[lang]} ${typeLabel} ${a.description[lang]}`,
      href: localePath(lang, '/agenda'),
    });
  }
  return entries;
}

function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lang } = useLang();
  const t = UI[lang];
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [kindFilter, setKindFilter] = useState<SearchEntry['kind'] | 'all'>('all');
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
    const score = (e: SearchEntry) => {
      if (e.title.toLowerCase().includes(q)) return 0;
      if ((e.keywords ?? '').toLowerCase().includes(q)) return 1;
      return 2;
    };
    let filtered = index.filter((e) => `${e.title} ${e.description} ${e.keywords ?? ''}`.toLowerCase().includes(q));
    if (kindFilter !== 'all') filtered = filtered.filter((e) => e.kind === kindFilter);
    return filtered.sort((a, b) => score(a) - score(b) || KIND_ORDER[a.kind] - KIND_ORDER[b.kind]).slice(0, 15);
  }, [index, query, kindFilter]);

  /* Site-search analytics, debounced so every keystroke does not fire a hit */
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2 || readAnalyticsConsent() !== 'granted') return;
    const t = window.setTimeout(() => {
      track('site_search', { event_category: 'engagement', event_label: q });
      fetch('/api/search-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, results: results.length }),
      }).catch(() => {});
    }, 800);
    return () => window.clearTimeout(t);
  }, [query, results.length]);

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

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label={t['search.open']}
      aria-hidden={!open}
      inert={!open}
      onClick={onClose}
      className={`fixed inset-0 z-[60] flex items-start justify-center bg-pine-950/80 px-4 pt-[12vh] backdrop-blur-sm animate-search-backdrop-in transition-opacity duration-200 ${
        open ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-pine-950 shadow-2xl shadow-pine-950/60 animate-search-panel-in transition-all duration-200 ${
          open ? 'translate-y-0 scale-100 opacity-100' : '-translate-y-2 scale-[0.98] opacity-0'
        }`}
      >
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
          <kbd className="hidden shrink-0 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-semibold text-pine-100/85 sm:block">
            ESC
          </kbd>
        </div>

        {query.trim().length >= 2 && (
          <div className="flex flex-wrap gap-1.5 border-b border-white/10 px-3 py-2.5">
            {(['all', 'tribune', 'project', 'publication', 'media', 'page'] as const).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => { setKindFilter(k); setActive(0); }}
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${kindFilter === k ? 'bg-gold-500 text-pine-950' : 'bg-white/5 text-pine-100/70 hover:bg-white/10 hover:text-gold-300'}`}
              >
                {k === 'all' ? (lang === 'fr' ? 'Tout' : 'All') : t[`search.kind.${k}` as keyof typeof t] ?? k}
              </button>
            ))}
          </div>
        )}

        <div ref={listRef} className="max-h-[52vh] overflow-y-auto p-2">
          {query.trim() && results.length === 0 && (
            <p className="px-4 py-8 text-center text-sm text-pine-100/85">
              {t['search.empty']} «&nbsp;{query.trim()}&nbsp;»
            </p>
          )}

          {results.map((r, i) => {
            const Icon = KIND_ICON[r.kind];
            /* the highlighted row stays quiet — no gold glow, just a soft
               fill and a hairline neutral ring */
            const cls = `flex items-start gap-3 rounded-2xl px-4 py-3 transition-colors ${
              i === active ? 'bg-white/5 ring-1 ring-inset ring-white/10' : 'hover:bg-white/5'
            }`;
            const inner = (
              <>
                {r.thumb ? (
                  <img
                    src={r.thumb}
                    alt=""
                    width={56}
                    height={40}
                    className="h-10 w-14 shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gold-500/10 text-gold-400">
                    <Icon size={15} />
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="truncate text-[13.5px] font-semibold text-ivory">{r.title}</span>
                    <span className="shrink-0 rounded-full bg-white/5 px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-pine-100/80">
                      {r.badge ?? t[`search.kind.${r.kind}`]}
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

        <div className="flex items-center gap-4 border-t border-white/10 px-5 py-3 text-[11px] text-pine-100/70">
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

export default SearchModal;
