import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import Contact from './pages/Contact'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/sections/Footer'
import { ScrollToTop } from '@/components/ScrollToTop'
import { Seo } from '@/components/Seo'
import { LanguageProvider } from '@/i18n/LanguageContext'

export default function App() {
  return (
    <LanguageProvider>
      <Seo />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer />
      <ScrollToTop />
    </LanguageProvider>
  )
}
