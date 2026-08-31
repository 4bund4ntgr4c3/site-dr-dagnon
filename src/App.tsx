import { Suspense, type ComponentType } from 'react'
import { Routes, Route } from 'react-router'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/sections/Footer'
import { ScrollToTop } from '@/components/ScrollToTop'
import { SwUpdateToast } from '@/components/SwUpdateToast'
import { Seo } from '@/components/Seo'
import { NotFoundView } from '@/components/NotFoundView'
import { PageErrorBoundary } from '@/components/PageErrorBoundary'
import { OfflineIndicator } from '@/components/OfflineIndicator'
import { LanguageProvider } from '@/i18n/LanguageContext'
import { useLang } from '@/i18n/useLang'
import { UI } from '@/i18n/translations'

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
  Cv: ComponentType
  PressKit: ComponentType
  Invite: ComponentType
  Collaborate: ComponentType
  NewsletterArchive: ComponentType
  Impact: ComponentType
  Legal: ComponentType
  Accessibility: ComponentType
  Bibliography: ComponentType
  Portfolio: ComponentType
  Offline: ComponentType
  Career: ComponentType
  PublicationsPdf: ComponentType
  Podcasts: ComponentType
  Connect: ComponentType
  Toolkit: ComponentType
  /** client-only page (never prerendered) — absent from the server's pages */
  Admin?: ComponentType
  NewsletterPrefs?: ComponentType
  Changelog?: ComponentType
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

function SkipLink() {
  const { lang } = useLang();
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-pine-950 focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-gold-300 focus:shadow-xl"
    >
      {UI[lang]['a11y.skip']}
    </a>
  );
}

/* The same page tree is mounted twice: once at the root (English) and once
   under /fr (French). See src/i18n/routing.ts. */
const routesFor = (Pages: AppPages) => [
  <Route key="home" index element={<Pages.Home />} />,
  <Route key="contact" path="contact" element={<Pages.Contact />} />,
  <Route key="media" path="media" element={<Pages.Media />} />,
  <Route key="media-category" path="media/:category" element={<Pages.Media />} />,
  <Route key="media-photo" path="media/community/:photoId" element={<Pages.Media />} />,
  <Route key="publications" path="publications" element={<Pages.Publications />} />,
  <Route key="tribunes" path="tribunes" element={<Pages.Tribunes />} />,
  <Route key="tribune-article" path="tribunes/:slug" element={<Pages.TribuneArticle />} />,
  <Route key="projets" path="projets" element={<Pages.Projects />} />,
  <Route key="project-article" path="projets/:slug" element={<Pages.ProjectArticle />} />,
  <Route key="agenda" path="agenda" element={<Pages.Agenda />} />,
  <Route key="cv" path="cv" element={<Pages.Cv />} />,
  <Route key="presse" path="presse" element={<Pages.PressKit />} />,
  <Route key="inviter" path="inviter" element={<Pages.Invite />} />,
  <Route key="collaborate" path="collaborate" element={<Pages.Collaborate />} />,
  <Route key="newsletter" path="newsletter" element={<Pages.NewsletterArchive />} />,
  <Route key="impact" path="impact" element={<Pages.Impact />} />,
  <Route key="legal" path="legal" element={<Pages.Legal />} />,
  <Route key="accessibility" path="accessibility" element={<Pages.Accessibility />} />,
  <Route key="bibliography" path="bibliography" element={<Pages.Bibliography />} />,
  <Route key="portfolio" path="portfolio" element={<Pages.Portfolio />} />,
  <Route key="offline" path="offline" element={<Pages.Offline />} />,
  <Route key="career" path="parcours" element={<Pages.Career />} />,
  <Route key="publications-pdf" path="publications-pdf" element={<Pages.PublicationsPdf />} />,
  <Route key="podcasts" path="podcasts" element={<Pages.Podcasts />} />,
  <Route key="connect" path="connect" element={<Pages.Connect />} />,
  <Route key="toolkit" path="toolkit" element={<Pages.Toolkit />} />,
  ...(Pages.Admin ? [<Route key="admin" path="admin" element={<Pages.Admin />} />] : []),
  ...(Pages.Changelog ? [<Route key="changelog" path="changelog" element={<Pages.Changelog />} />] : []),
  ...(Pages.NewsletterPrefs ? [<Route key="newsletter-prefs" path="newsletter/preferences" element={<Pages.NewsletterPrefs />} />] : []),
]

export default function App({ pages }: { pages: AppPages }) {
  return (
    <LanguageProvider>
      <SkipLink />
      <Seo />
      <Navbar />
      <Suspense fallback={<Loading />}>
        <PageErrorBoundary>
          <Routes>
            <Route path="/">{routesFor(pages)}</Route>
            <Route path="/fr">{routesFor(pages)}</Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PageErrorBoundary>
      </Suspense>
      <Footer />
      <ScrollToTop />
      <SwUpdateToast />
      <OfflineIndicator />
    </LanguageProvider>
  )
}
