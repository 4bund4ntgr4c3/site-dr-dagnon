import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/sections/Footer'
import { ScrollToTop } from '@/components/ScrollToTop'
import { Seo } from '@/components/Seo'
import { LanguageProvider } from '@/i18n/LanguageContext'
import { useLang } from '@/i18n/useLang'
import { UI } from '@/i18n/translations'

const Home = lazy(() => import('./pages/Home'))
const Contact = lazy(() => import('./pages/Contact'))
const MediaPage = lazy(() => import('./pages/Media'))
const PublicationsPage = lazy(() => import('./pages/Publications'))

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
      <a
        href="/"
        className="mt-8 inline-flex rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-pine-950 transition-all hover:-translate-y-0.5 hover:bg-gold-400"
      >
        {t['notFound.back']}
      </a>
    </main>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <Seo />
      <Navbar />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/media" element={<MediaPage />} />
          <Route path="/media/:category" element={<MediaPage />} />
          <Route path="/publications" element={<PublicationsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Footer />
      <ScrollToTop />
    </LanguageProvider>
  )
}
