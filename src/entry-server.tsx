import { renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import App, { type AppPages } from './App';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Media from './pages/Media';
import Publications from './pages/Publications';
import Agenda from './pages/Agenda';
import Tribunes from './pages/Tribunes';
import TribuneArticle from './pages/TribuneArticle';
import Projects from './pages/Projects';
import ProjectArticle from './pages/ProjectArticle';
import Cv from './pages/Cv';

/* Plain imports, not React.lazy() — see the comment on AppPages in App.tsx
   for why renderToStaticMarkup needs this. */
const pages: AppPages = { Home, Contact, Media, Publications, Agenda, Tribunes, TribuneArticle, Projects, ProjectArticle, Cv };

/* Renders a route to plain HTML for scripts/prerender.mjs to embed in each
   generated dist/.../index.html — this is what a crawler sees before any
   JavaScript runs, instead of the empty <div id="root"></div> that was there
   before.

   Deliberately renderToStaticMarkup, not renderToString + hydrateRoot on the
   client: src/main.tsx does a plain createRoot().render(), which discards
   this markup and mounts fresh. That means no hydration-mismatch class of
   bug is possible here — a component that behaves differently on the server
   (e.g. Reveal starting "shown" because IntersectionObserver doesn't exist in
   Node) just gets replaced a moment later, exactly as if this markup were a
   static screenshot. The trade-off is a brief flash of non-interactive
   content before the client takes over, same pattern as many static blogs. */
export function renderPage(pathname: string): string {
  return renderToStaticMarkup(
    <StaticRouter location={pathname}>
      <App pages={pages} />
    </StaticRouter>,
  );
}
