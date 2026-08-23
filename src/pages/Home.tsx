import { MotionConfig } from 'framer-motion';
import { Hero } from '@/sections/Hero';
import { Stats } from '@/sections/Stats';
import { About } from '@/sections/About';
import { Expertise } from '@/sections/Expertise';
import { Experience } from '@/sections/Experience';
import { Achievements } from '@/sections/Achievements';
import { Education } from '@/sections/Education';
import { Publications } from '@/sections/Publications';
import { LatestTribune } from '@/sections/LatestTribune';
import { PressQuotes } from '@/sections/PressQuotes';
import { Media } from '@/sections/Media';
import { PodcastSection } from '@/components/PodcastSection';
import { LinkedinFeed } from '@/components/LinkedinFeed';
import { Newsletter } from '@/sections/Newsletter';
import { useSectionTracking } from '@/hooks/useSectionTracking';

export default function Home() {
  useSectionTracking();
  return (
    /* reducedMotion="user" makes the Hero and Stats animations respect
       prefers-reduced-motion. It lives here, in the Home chunk, so the
       framer-motion import stays out of the main bundle (see AfricaMap —
       the Footer's copy of the same logic cannot import framer-motion). */
    <MotionConfig reducedMotion="user">
      <main id="main-content" tabIndex={-1} className="min-h-screen bg-ivory">
        <Hero />
        <Stats />
        <About />
        <Expertise />
        <Experience />
        <Achievements />
        <Education />
        <Publications />
        <LatestTribune />
        <PressQuotes />
        <Media />
        <section className="bg-pine-50 py-12 lg:py-16">
          <div className="mx-auto max-w-4xl px-5 lg:px-8">
            <PodcastSection />
          </div>
        </section>
        <section className="bg-white py-12 lg:py-16">
          <div className="mx-auto max-w-4xl px-5 lg:px-8">
            <LinkedinFeed />
          </div>
        </section>
        <Newsletter />
      </main>
    </MotionConfig>
  );
}
