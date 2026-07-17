import { Navbar } from '@/components/Navbar';
import { Hero } from '@/sections/Hero';
import { Stats } from '@/sections/Stats';
import { About } from '@/sections/About';
import { Expertise } from '@/sections/Expertise';
import { Experience } from '@/sections/Experience';
import { Achievements } from '@/sections/Achievements';
import { Education } from '@/sections/Education';
import { Publications } from '@/sections/Publications';
import { Media } from '@/sections/Media';
import { Footer } from '@/sections/Footer';
import { ScrollToTop } from '@/components/ScrollToTop';
import { Seo } from '@/components/Seo';
import { LanguageProvider } from '@/i18n/LanguageContext';

export default function Home() {
  return (
    <LanguageProvider>
      <Seo />
      <main className="min-h-screen bg-ivory">
        <Navbar />
        <Hero />
        <Stats />
        <About />
        <Expertise />
        <Experience />
        <Achievements />
        <Education />
        <Publications />
        <Media />
        <Footer />
        <ScrollToTop />
      </main>
    </LanguageProvider>
  );
}
