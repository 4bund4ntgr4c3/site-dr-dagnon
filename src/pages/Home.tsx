import { lazy, Suspense } from 'react';
import { Hero } from '@/sections/Hero';
import { Stats } from '@/sections/Stats';
import { About } from '@/sections/About';
import { useSectionTracking } from '@/hooks/useSectionTracking';

const Expertise = lazy(() => import('@/sections/Expertise').then((m) => ({ default: m.Expertise })));
const Experience = lazy(() => import('@/sections/Experience').then((m) => ({ default: m.Experience })));
const Achievements = lazy(() => import('@/sections/Achievements').then((m) => ({ default: m.Achievements })));
const Education = lazy(() => import('@/sections/Education').then((m) => ({ default: m.Education })));
const Publications = lazy(() => import('@/sections/Publications').then((m) => ({ default: m.Publications })));
const LatestTribune = lazy(() => import('@/sections/LatestTribune').then((m) => ({ default: m.LatestTribune })));
const PressQuotes = lazy(() => import('@/sections/PressQuotes').then((m) => ({ default: m.PressQuotes })));
const Media = lazy(() => import('@/sections/Media').then((m) => ({ default: m.Media })));
const PodcastSection = lazy(() => import('@/components/PodcastSection').then((m) => ({ default: m.PodcastSection })));
const LinkedinFeed = lazy(() => import('@/components/LinkedinFeed').then((m) => ({ default: m.LinkedinFeed })));
const Newsletter = lazy(() => import('@/sections/Newsletter').then((m) => ({ default: m.Newsletter })));

// Lightweight fallback for below-fold lazy sections — preserves layout height
const SectionFallback = () => <div className="h-64 animate-pulse bg-pine-950/5" aria-hidden="true" />;

export default function Home() {
  useSectionTracking();
  return (
      <main id="main-content" tabIndex={-1} className="min-h-screen bg-ivory">
        <Hero />
        <Stats />
        <About />
        <Suspense fallback={<SectionFallback />}>
          <Expertise />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Experience />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Achievements />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Education />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Publications />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <LatestTribune />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <PressQuotes />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Media />
        </Suspense>
        <section className="bg-pine-50 py-12 lg:py-16">
          <div className="mx-auto max-w-4xl px-5 lg:px-8">
            <Suspense fallback={<SectionFallback />}>
              <PodcastSection />
            </Suspense>
          </div>
        </section>
        <section className="bg-white py-12 lg:py-16">
          <div className="mx-auto max-w-4xl px-5 lg:px-8">
            <Suspense fallback={<SectionFallback />}>
              <LinkedinFeed />
            </Suspense>
          </div>
        </section>
        <Suspense fallback={<SectionFallback />}>
          <Newsletter />
        </Suspense>
      </main>
  );
}
