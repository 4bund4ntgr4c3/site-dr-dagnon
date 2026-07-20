import { useEffect } from 'react';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function useSectionTracking() {
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('section[id]'));
    if (!sections.length) return;

    let active = '';

    const fire = (id: string) => {
      if (id === active) return;
      active = id;
      const path = id === 'accueil' ? '/' : `/#${id}`;
      if (path === '/') return;
      window.gtag?.('event', 'page_view', {
        page_path: path,
        page_title: document.title,
        page_location: window.location.href.split('#')[0] + path,
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) fire((visible.target as HTMLElement).id);
      },
      { threshold: [0.5], rootMargin: '-20% 0px -20% 0px' },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);
}
