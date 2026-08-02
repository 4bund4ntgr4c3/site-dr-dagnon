import { useEffect, useState } from 'react';

/* Thin gold bar pinned above the navbar, tracking how far down the page the
   visitor has scrolled. The width is set through the style attribute — the
   strict CSP allows inline styles, and a Tailwind class per percentage point
   would be absurd. The scroll listener is throttled with requestAnimationFrame
   so a fast scroll cannot flood the render. */
export function ReadingProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      setPct(max > 0 ? Math.min(100, Math.round((window.scrollY / max) * 100)) : 0);
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[3px]">
      <div
        className="h-full bg-gradient-to-r from-gold-600 via-gold-500 to-gold-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
