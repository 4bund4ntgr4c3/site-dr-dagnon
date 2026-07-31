import { lazy, StrictMode } from 'react'
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

const pages: AppPages = {
  Home: lazy(() => import('./pages/Home')),
  Contact: lazy(() => import('./pages/Contact')),
  Media: lazy(() => import('./pages/Media')),
  Publications: lazy(() => import('./pages/Publications')),
  Agenda: lazy(() => import('./pages/Agenda')),
  Tribunes: lazy(() => import('./pages/Tribunes')),
  TribuneArticle: lazy(() => import('./pages/TribuneArticle')),
  Projects: lazy(() => import('./pages/Projects')),
  ProjectArticle: lazy(() => import('./pages/ProjectArticle')),
  Cv: lazy(() => import('./pages/Cv')),
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App pages={pages} />
    </BrowserRouter>
  </StrictMode>,
)
