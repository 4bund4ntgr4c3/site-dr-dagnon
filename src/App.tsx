import { Suspense, type ComponentType } from 'react'
import { Routes, Route } from 'react-router'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/sections/Footer'
import { ScrollToTop } from '@/components/ScrollToTop'
import { Seo } from '@/components/Seo'
import { NotFoundView } from '@/components/NotFoundView'
import { LanguageProvider } from '@/i18n/LanguageContext'

/* The four routed page components are injected rather than imported here, so
   the client and the build-time server renderer can each supply their own
   version: main.tsx passes React.lazy() wrappers for code-splitting, while
   entry-server.tsx passes plain imports. renderToStaticMarkup is synchronous
   and cannot wait for a lazy import to resolve — with lazy components it
   silently rendered the <Suspense> fallback for every route instead of the
   actual page, which is why every prerendered page used to come out
   identical. Keeping one Routes/Suspense/Navbar/Footer tree here, shared by
   both entry points, avoids maintaining that structure twice. */
export interface AppPages {
  Home: ComponentType
  Contact: ComponentType
  Media: ComponentType
  Publications: ComponentType
  Agenda: ComponentType
  Tribunes: ComponentType
  TribuneArticle: ComponentType
  Projects: ComponentType
  ProjectArticle: ComponentType
}

function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-pine-950">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold-500 border-t-transparent" />
    </div>
  )
}

function NotFound() {
  return <NotFoundView />;
}

/* The same page tree is mounted twice: once at the root (English) and once
   under /fr (French). See src/i18n/routing.ts. */
const routesFor = (Pages: AppPages) => [
  <Route key="home" index element={<Pages.Home />} />,
  <Route key="contact" path="contact" element={<Pages.Contact />} />,
  <Route key="media" path="media" element={<Pages.Media />} />,
  <Route key="media-category" path="media/:category" element={<Pages.Media />} />,
  <Route key="publications" path="publications" element={<Pages.Publications />} />,
  <Route key="tribunes" path="tribunes" element={<Pages.Tribunes />} />,
  <Route key="tribune-article" path="tribunes/:slug" element={<Pages.TribuneArticle />} />,
  <Route key="projets" path="projets" element={<Pages.Projects />} />,
  <Route key="project-article" path="projets/:slug" element={<Pages.ProjectArticle />} />,
  <Route key="agenda" path="agenda" element={<Pages.Agenda />} />,
]

export default function App({ pages }: { pages: AppPages }) {
  return (
    <LanguageProvider>
      <Seo />
      <Navbar />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/">{routesFor(pages)}</Route>
          <Route path="/fr">{routesFor(pages)}</Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Footer />
      <ScrollToTop />
    </LanguageProvider>
  )
}
