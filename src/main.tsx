import { lazy, StrictMode, type ComponentType } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App, { type AppPages } from './App.tsx'
import { registerPreload, initGlobalLinkPreload } from './lib/preload.ts'

/* Apply the saved or system theme before the first paint (the strict CSP
   forbids inline scripts, so this runs from the entry module). The meta
   theme-color follows the theme, so Android browsers tint their chrome
   with the actual page colour instead of the static default. */
(() => {
  try {
    const saved = localStorage.getItem('theme');
    const dark =
      saved === 'dark' ||
      ((saved === null || saved === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#0c2e2a' : '#f6f3ec');
  } catch {
    /* storage unavailable — stay with the light theme */
  }
})();

/* A failed chunk download (flaky mobile network, CDN hiccup) used to reject
   the lazy import and — with no error boundary — blank the whole page until
   a manual refresh. Retry once after a short pause before giving up; the
   error boundary in App.tsx is the fallback that never leaves a blank page. */
const lazyLoad = <T extends ComponentType<unknown>>(importer: () => Promise<{ default: T }>) =>
  lazy(() =>
    importer().catch(() =>
      new Promise<{ default: T }>((resolve, reject) => {
        window.setTimeout(() => importer().then(resolve, reject), 1000);
      }),
    ),
  );

/* The same importer React.lazy needs is also the preload target — one source
   of truth for the chunk, registered per route pattern so the hover-preload
   in src/lib/preload.ts can find it (src/lib/preload.ts is deliberately free
   of page imports so it cannot create a build-time cycle). */
const page = <T extends ComponentType<unknown>>(importer: () => Promise<{ default: T }>, match: (path: string) => boolean) => {
  registerPreload(match, importer);
  return lazyLoad(importer);
};

const pages: AppPages = {
  Home: page(() => import('./pages/Home'), (p) => p === '/'),
  Contact: page(() => import('./pages/Contact'), (p) => p === '/contact'),
  Media: page(() => import('./pages/Media'), (p) => p.startsWith('/media')),
  Publications: page(() => import('./pages/Publications'), (p) => p.startsWith('/publications')),
  Agenda: page(() => import('./pages/Agenda'), (p) => p === '/agenda'),
  Tribunes: page(() => import('./pages/Tribunes'), (p) => p === '/tribunes'),
  TribuneArticle: page(() => import('./pages/TribuneArticle'), (p) => p.startsWith('/tribunes/')),
  Projects: page(() => import('./pages/Projects'), (p) => p === '/projets'),
  ProjectArticle: page(() => import('./pages/ProjectArticle'), (p) => p.startsWith('/projets/')),
  Cv: page(() => import('./pages/Cv'), (p) => p === '/cv'),
  PressKit: page(() => import('./pages/PressKit'), (p) => p === '/presse'),
  Invite: page(() => import('./pages/Invite'), (p) => p === '/inviter'),
  NewsletterArchive: page(() => import('./pages/NewsletterArchive'), (p) => p === '/newsletter'),
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App pages={pages} />
    </BrowserRouter>
  </StrictMode>,
)

/* Warm the chunk cache on hover/focus (see src/lib/preload.ts) so the first
   click on a route costs no download. */
initGlobalLinkPreload();

/* The service worker ships only from dist/ (scripts/prerender.mjs writes it
   at build time), so there is nothing to register in dev. Prod-only keeps a
   stale dev worker from caching old chunks or masking the live build. */
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      /* registration failure is non-fatal — the site works without it */
    });
  });
}
