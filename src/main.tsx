import { lazy, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App, { type AppPages } from './App.tsx'

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
