import { useEffect, useRef, useState, type ReactNode } from 'react';

/* A fade-and-rise on first scroll into view.
   Deliberately not framer-motion: <Footer /> renders Reveal, Footer is in the
   main bundle, so importing framer-motion here dragged the whole animation
   library into every page — including ones with no other animation. An
   IntersectionObserver plus a CSS transition is the same 8 lines of behaviour.
   Hero and Stats still use framer-motion; they are home-page only, so it now
   loads with that chunk instead of up front. */

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
const DURATION = 0.7;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  /* skip the animation entirely when it cannot be observed, or when the
     visitor asked for less motion — content must never stay at opacity 0 */
  const [shown, setShown] = useState(
    () => typeof IntersectionObserver === 'undefined' || prefersReducedMotion(),
  );

  useEffect(() => {
    if (shown) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin: '-80px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [shown]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : `translateY(${y}px)`,
        transition: `opacity ${DURATION}s ${EASE} ${delay}s, transform ${DURATION}s ${EASE} ${delay}s`,
        willChange: shown ? undefined : 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}
