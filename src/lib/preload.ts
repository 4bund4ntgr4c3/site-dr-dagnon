/* Instant navigation: pages are code-split into lazy chunks in main.tsx, so
   the first click on a route pays a chunk download. The react-router `prefetch`
   prop only works in framework (data-router) mode, so this is the declarative
   equivalent: a global registry of route→importer pairs, fed by main.tsx from
   the very importers React.lazy already uses, plus two delegated listeners
   that preload the target chunk on hover or keyboard focus. By the time the
   click lands, the module is usually already in the browser cache. */

type Matcher = (path: string) => boolean;

const registry: { match: Matcher; load: () => Promise<unknown> }[] = [];

export function registerPreload(match: Matcher, load: () => Promise<unknown>) {
  registry.push({ match, load });
}

/* Only client-side routes qualify: full URLs, protocol links, anchors and
   static files (ics, xml, webp…) are not route chunks. */
const isInternalRoute = (href: string) =>
  href.startsWith('/') &&
  !href.startsWith('//') &&
  !href.includes('://') &&
  !href.startsWith('/api/') &&
  !/\.(ics|xml|webp|png|jpe?g|webmanifest|svg)$/.test(href) &&
  !href.includes('#');

/* English lives at the root, French under /fr — strip the prefix so both
   languages hit the same importer. */
const stripLang = (p: string) => (p === '/fr' ? '/' : p.startsWith('/fr/') ? p.slice(4) : p);

export function preloadPath(to: string) {
  const path = stripLang(to.split('?')[0].split('#')[0]);
  if (!isInternalRoute(path)) return;
  const hit = registry.find((r) => r.match(path));
  void hit?.load().catch(() => undefined);
}

export function initGlobalLinkPreload() {
  if (typeof document === 'undefined') return;
  /* pointerover, not mouseenter: it bubbles, so one listener covers every
     link on the page — nav, cards, related reading — and it fires for
     touch-equivalent interactions on hybrid devices too. */
  let lastHovered = '';
  document.addEventListener(
    'pointerover',
    (e) => {
      const a = (e.target as Element | null)?.closest?.('a[href]');
      if (!a) return;
      const href = a.getAttribute('href') ?? '';
      if (href === lastHovered) return;
      lastHovered = href;
      preloadPath(href);
    },
    { passive: true },
  );
  /* keyboard users never hover — preload what they focus */
  document.addEventListener('focusin', (e) => {
    const a = (e.target as Element | null)?.closest?.('a[href]');
    if (!a) return;
    preloadPath(a.getAttribute('href') ?? '');
  });
}
