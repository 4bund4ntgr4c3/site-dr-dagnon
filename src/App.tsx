import { Suspense, type ComponentType } from 'react'
import { Routes, Route, Link } from 'react-router'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/sections/Footer'
import { ScrollToTop } from '@/components/ScrollToTop'
import { Seo } from '@/components/Seo'
import { LanguageProvider } from '@/i18n/LanguageContext'
import { useLang } from '@/i18n/useLang'
import { localePath } from '@/i18n/routing'
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
}

function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-pine-950">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold-500 border-t-transparent" />
    </div>
  )
}

function NotFound() {
  const { lang } = useLang();
  const t = UI[lang];
  return (
    <main id="main-content" className="flex min-h-screen flex-col items-center justify-center bg-pine-950 px-5 text-center">
      <p className="text-6xl font-display font-semibold text-gold-400">404</p>
      <p className="mt-4 text-lg text-pine-100/70">{t['notFound.title']}</p>
      <Link
        to={localePath(lang, '/')}
        className="mt-8 inline-flex rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-pine-950 transition-all hover:-translate-y-0.5 hover:bg-gold-400"
      >
        {t['notFound.back']}
      </Link>
    </main>
  )
}

/* The same page tree is mounted twice: once at the root (English) and once
   under /fr (French). See src/i18n/routing.ts. */
const routesFor = (Pages: AppPages) => [
  <Route key="home" index element={<Pages.Home />} />,
  <Route key="contact" path="contact" element={<Pages.Contact />} />,
  <Route key="media" path="media" element={<Pages.Media />} />,
  <Route key="media-category" path="media/:category" element={<Pages.Media />} />,
  <Route key="publications" path="publications" element={<Pages.Publications />} />,
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
