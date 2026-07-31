import { Hero } from '@/sections/Hero';
import { Stats } from '@/sections/Stats';
import { About } from '@/sections/About';
import { Expertise } from '@/sections/Expertise';
import { Experience } from '@/sections/Experience';
import { Achievements } from '@/sections/Achievements';
import { Education } from '@/sections/Education';
import { Publications } from '@/sections/Publications';
import { Media } from '@/sections/Media';
import { Newsletter } from '@/sections/Newsletter';
import { useSectionTracking } from '@/hooks/useSectionTracking';

export default function Home() {
  useSectionTracking();
  return (
    <main id="main-content" className="min-h-screen bg-ivory">
      <Hero />
      <Stats />
      <About />
      <Expertise />
      <Experience />
      <Achievements />
      <Education />
      <Publications />
      <Media />
      <Newsletter />
    </main>
  );
}
