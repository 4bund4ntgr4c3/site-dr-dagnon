import { lazy, StrictMode, type ComponentType } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App, { type AppPages } from './App.tsx'

/* Apply the saved or system theme before the first paint (the strict CSP
   forbids inline scripts, so this runs from the entry module). */
(() => {
  try {
    const saved = localStorage.getItem('theme');
    const dark =
      saved === 'dark' ||
      ((saved === null || saved === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
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

const pages: AppPages = {
  Home: lazyLoad(() => import('./pages/Home')),
  Contact: lazyLoad(() => import('./pages/Contact')),
  Media: lazyLoad(() => import('./pages/Media')),
  Publications: lazyLoad(() => import('./pages/Publications')),
  Agenda: lazyLoad(() => import('./pages/Agenda')),
  Tribunes: lazyLoad(() => import('./pages/Tribunes')),
  TribuneArticle: lazyLoad(() => import('./pages/TribuneArticle')),
  Projects: lazyLoad(() => import('./pages/Projects')),
  ProjectArticle: lazyLoad(() => import('./pages/ProjectArticle')),
  Cv: lazyLoad(() => import('./pages/Cv')),
  PressKit: lazyLoad(() => import('./pages/PressKit')),
  Invite: lazyLoad(() => import('./pages/Invite')),
  NewsletterArchive: lazyLoad(() => import('./pages/NewsletterArchive')),
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App pages={pages} />
    </BrowserRouter>
  </StrictMode>,
)
