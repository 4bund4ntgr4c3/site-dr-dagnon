import { lazy, Suspense, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { Link } from 'react-router';
import { Menu, X, Linkedin, ChevronDown, Search } from 'lucide-react';
import { LINKS } from '@/data/content';
import { NAV, UI } from '@/i18n/translations';
import { useLang } from '@/i18n/useLang';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ThemeToggle } from '@/components/ThemeToggle';
import { track } from '@/lib/analytics';
import { navHref } from '@/lib/nav';
import { localePath } from '@/i18n/routing';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import type { Lang } from '@/i18n/lang';

/* the search modal carries the whole-site content index (tribunes, projects,
   publications, photos, agenda…); splitting it keeps that data out of the
   initial bundle and loads it only when the user opens the search */
const SearchModal = lazy(() => import('@/components/SearchModal'));

/* Every anchored home-page section lives inside a single "Home" menu as one
   plain link per section (À propos, Expertise, Parcours, Formation,
   Réalisations, Publications, Médias). Publications and Médias also have a
   dedicated page, so their Home entry anchors to the home section while the
   bar keeps the page links. Agenda and Contact have no home section and stay
   in the bar only. */
const HOME_SECTIONS = ['apropos', 'expertise', 'parcours', 'formation', 'realisations', 'publications', 'medias'];
/* anchor-only sections never appear as plain links in the bar */
const BAR_EXCLUDED = ['apropos', 'expertise', 'parcours', 'formation', 'realisations'];

const homeHref = (lang: Lang, id: string): string => `${localePath(lang, '/')}#${id}`;

const sectionLabel = (lang: Lang, id: string): string =>
  NAV[lang].find((n) => n.id === id)?.label ?? id;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [homeOpen, setHomeOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  /* remounts SearchModal on every open so a finished session's query never
     leaks into the next one */
  const [searchSession, setSearchSession] = useState(0);
  const { lang } = useLang();
  const t = UI[lang];
  const headerRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const homeRef = useRef<HTMLDivElement>(null);
  const logoNameRef = useRef<HTMLSpanElement>(null);
  /* how many lines the logo name wraps onto — when the header is squeezed the
     name grows, so the role line is dropped first, then the whole text */
  const [logoLines, setLogoLines] = useState(1);

  /* the open mobile menu is a dialog: Escape closes it, Tab stays inside,
     the page behind stops scrolling */
  useFocusTrap(headerRef, toggleRef, open, () => setOpen(false));

  useEffect(() => {
    const el = logoNameRef.current;
    if (!el) return;
    const measure = () => {
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 20;
      setLogoLines(Math.max(1, Math.round(el.offsetHeight / lineHeight)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
    /* the span unmounts when the text is squeezed out; re-attach the observer
       whenever it comes back so the logo can recover when space returns */
  }, [lang, logoLines]);

  const openSearch = () => {
    setSearchOpen(true);
    setSearchSession((s) => s + 1);
  };

  /* Cmd/Ctrl+K toggles the global search, from anywhere on the site */
  const searchOpenRef = useRef(false);
  useEffect(() => {
    searchOpenRef.current = searchOpen;
  }, [searchOpen]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((v) => !v);
        if (!searchOpenRef.current) setSearchSession((s) => s + 1);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* the Home menu closes on a click outside and on Escape (which returns
     focus to the trigger). On mobile the toggle button lives inside the
     mobile panel, not in homeRef, so a tap would first fire this mousedown
     (closing the menu) and then the click (reopening it) — the toggle ends
     up doing nothing. Skip the outside-close while the mobile menu is open;
     its own button toggles the submenu. */
  useEffect(() => {
    if (!homeOpen) return;
    const onDown = (e: MouseEvent) => {
      if (open) return;
      if (homeRef.current && !homeRef.current.contains(e.target as Node)) setHomeOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setHomeOpen(false);
        homeRef.current?.querySelector<HTMLButtonElement>('button')?.focus();
      }
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [homeOpen, open]);

  const solid = scrolled || open;
  const closeAll = () => {
    setOpen(false);
    setHomeOpen(false);
  };
  /* navigate to a home section; if we are already on that hash (clicking the
     same link twice), no navigation event fires, so scroll manually */
  const goToSection = (id: string) => {
    closeAll();
    if (window.location.hash === `#${id}`) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  const pageItems = NAV[lang].filter((item) => !BAR_EXCLUDED.includes(item.id));

  /* arrow keys move focus through the open Home menu (desktop) */
  const onHomeMenuKey = (e: ReactKeyboardEvent<HTMLAnchorElement>) => {
    const items = Array.from(homeRef.current?.querySelectorAll<HTMLAnchorElement>('[role="menuitem"]') ?? []);
    const idx = items.indexOf(e.currentTarget);
    const last = items.length - 1;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        items[(idx + 1) % items.length]?.focus();
        break;
      case 'ArrowUp':
        e.preventDefault();
        items[(idx - 1 + items.length) % items.length]?.focus();
        break;
      case 'Home':
        e.preventDefault();
        items[0]?.focus();
        break;
      case 'End':
        e.preventDefault();
        items[last]?.focus();
        break;
    }
  };

  return (
    <>
      {/* mounted only on open so the lazy chunk (and the whole-site content
          index it builds) is fetched at first use, not on page load */}
      {searchOpen && (
        <Suspense fallback={null}>
          <SearchModal key={searchSession} open onClose={() => setSearchOpen(false)} />
        </Suspense>
      )}
      <header className="fixed inset-x-0 top-0 z-50 transition-all duration-500">
      <div ref={headerRef} className="mx-auto max-w-7xl px-3 pt-2 lg:px-4 lg:pt-3">
        <div
          className={`flex h-16 lg:h-[72px] items-center justify-between gap-4 px-4 lg:px-6 transition-all duration-500 ${
            solid
              ? 'rounded-3xl border border-white/10 bg-pine-950/90 backdrop-blur-md shadow-lg shadow-pine-950/30'
              : 'rounded-3xl border border-transparent bg-pine-950/40 backdrop-blur-sm'
          }`}
        >
          <Link to={localePath(lang, '/')} className="flex min-w-0 items-center gap-3 group">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold-500 font-display text-sm font-semibold text-pine-950 transition-transform group-hover:scale-105">
              SD
            </span>
            {logoLines < 4 && (
              <span className="leading-tight min-w-0">
                <span ref={logoNameRef} className="block font-display text-[15px] font-medium text-ivory">
                  {t['name.short']}
                </span>
                {logoLines < 2 && (
                  <span className="block truncate text-[10px] uppercase tracking-[0.22em] text-gold-400">
                    {t['nav.subtitle']}
                  </span>
                )}
              </span>
            )}
            {logoLines >= 4 && (
              /* the text is squeezed out, but the link keeps its meaning for
                 assistive tech and crawlers */
              <span className="sr-only">{t['name.short']} — {t['nav.subtitle']}</span>
            )}
          </Link>

          <nav aria-label={t['nav.ariaLabel']} className="hidden lg:flex items-center gap-1 rounded-full border border-white/10 bg-white/5 py-1.5 px-1.5 backdrop-blur-sm">
            {/* Home — one anchored link per home-page section */}
            <div
              ref={homeRef}
              className="relative"
              onMouseEnter={() => setHomeOpen(true)}
              onMouseLeave={() => setHomeOpen(false)}
            >
              <button
                type="button"
                onClick={() => setHomeOpen(!homeOpen)}
                onKeyDown={(e) => {
                  if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
                  e.preventDefault();
                  setHomeOpen(true);
                  const items = homeRef.current?.querySelectorAll<HTMLAnchorElement>('[role="menuitem"]');
                  if (items?.length) {
                    (e.key === 'ArrowDown' ? items[0] : items[items.length - 1]).focus();
                  }
                }}
                aria-haspopup="true"
                aria-expanded={homeOpen}
                aria-controls="nav-home-menu"
                className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors hover:bg-gold-500 hover:text-pine-950 ${
                  homeOpen ? 'bg-gold-500 text-pine-950' : 'text-ivory'
                }`}
              >
                {t['nav.home']}
                <ChevronDown size={13} className={`transition-transform ${homeOpen ? 'rotate-180' : ''}`} />
              </button>
              {homeOpen && (
                /* the pt-2 wrapper bridges the gap between button and panel so
                   the menu does not close while the cursor crosses it */
                <div className="absolute top-full left-0 pt-2">
                  <div
                    id="nav-home-menu"
                    role="menu"
                    aria-label={t['nav.home']}
                    className="w-56 rounded-2xl border border-white/10 bg-pine-950/95 p-2 shadow-xl shadow-pine-950/40 backdrop-blur-md"
                  >
                    {HOME_SECTIONS.map((id) => (
                      <Link
                        key={id}
                        role="menuitem"
                        to={homeHref(lang, id)}
                        onClick={() => goToSection(id)}
                        onKeyDown={onHomeMenuKey}
                        className="block rounded-lg px-3 py-2 text-[13px] font-medium text-pine-100/90 transition-colors hover:bg-white/5 hover:text-gold-400"
                      >
                        {sectionLabel(lang, id)}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* page-level links stay in the bar */}
            {pageItems.map((item) => (
              <Link
                key={item.id}
                to={navHref(lang, item.id)}
                className="whitespace-nowrap rounded-full px-4 py-1.5 text-[13px] font-medium text-pine-100/85 transition-colors hover:bg-gold-500 hover:text-pine-950"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={openSearch}
              aria-label={t['search.open']}
              title={`${t['search.open']} — Ctrl+K`}
              className="text-pine-100/80 transition-colors hover:text-gold-400 p-2 outline-none focus-visible:ring-1 focus-visible:ring-white/20 rounded-lg"
            >
              <Search size={19} />
            </button>
            <ThemeToggle />
            <LanguageSwitcher className="inline-flex" />

            <a
              href={LINKS.linkedin}
              target="_blank"
              rel="noreferrer"
              onClick={() => track('click', { event_category: 'outbound', event_label: 'linkedin' })}
              className="hidden xl:flex items-center gap-2 rounded-full border border-gold-500/50 px-4 py-2 text-[13px] font-semibold text-gold-300 transition-all hover:bg-gold-500 hover:text-pine-950"
            >
              <Linkedin size={15} /> {t['nav.linkedin']}
            </a>

            <button
              ref={toggleRef}
              className="lg:hidden text-ivory p-2 outline-none focus-visible:ring-1 focus-visible:ring-white/20 rounded-lg"
              onClick={() => setOpen(!open)}
              aria-label={open ? t['nav.close'] : t['nav.toggle']}
              aria-expanded={open}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden px-3 pb-3">
            <div className="rounded-3xl border border-white/10 bg-pine-950/95 backdrop-blur-md px-5 pb-6 pt-3 shadow-lg shadow-pine-950/30">
              <nav aria-label={t['nav.ariaLabel']} className="flex flex-col gap-1">
                {/* Home — one anchored link per home-page section */}
                <div>
                  <button
                    type="button"
                    onClick={() => setHomeOpen(!homeOpen)}
                    aria-haspopup="true"
                    aria-expanded={homeOpen}
                    aria-controls="nav-home-menu-mobile"
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-gold-400"
                  >
                    {t['nav.home']}
                    <ChevronDown size={16} className={`transition-transform ${homeOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {homeOpen && (
                    <div id="nav-home-menu-mobile" className="mt-1 ml-4 flex flex-col gap-1 border-l border-white/10 pl-3">
                      {HOME_SECTIONS.map((id) => (
                        <Link
                          key={id}
                          to={homeHref(lang, id)}
                          onClick={() => goToSection(id)}
                          className="rounded-lg px-3 py-2 text-sm font-medium text-pine-100/90 hover:bg-white/5 hover:text-gold-400"
                        >
                          {sectionLabel(lang, id)}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* page-level links */}
                {pageItems.map((item) => (
                  <Link
                    key={item.id}
                    to={navHref(lang, item.id)}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-pine-100/90 hover:bg-white/5 hover:text-gold-400"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex flex-1 gap-3">
                  <a
                    href={LINKS.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => track('click', { event_category: 'outbound', event_label: 'linkedin' })}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gold-500 px-4 py-2.5 text-sm font-semibold text-pine-950"
                  >
                    <Linkedin size={15} /> {t['nav.linkedin']}
                  </a>
                  <a
                    href={LINKS.youtube}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => track('click', { event_category: 'outbound', event_label: 'youtube' })}
                    className="flex-1 items-center justify-center gap-2 rounded-full border border-white/20 px-4 py-2.5 text-sm font-semibold text-ivory"
                  >
                    {t['nav.youtube']}
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
    </>
  );
}
