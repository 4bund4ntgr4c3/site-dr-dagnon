import { useEffect, useState } from 'react';
import { Menu, X, Linkedin, Youtube } from 'lucide-react';
import { NAV, LINKS } from '@/data/content';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        solid
          ? 'bg-pine-950/90 backdrop-blur-md shadow-lg shadow-pine-950/30'
          : 'bg-transparent'
      }`}
    >
      <div
        className={`mx-auto flex h-16 lg:h-[72px] max-w-7xl items-center justify-between px-5 lg:px-8 transition-all duration-500 ${
          solid
            ? 'mt-2 lg:mt-3 rounded-2xl border border-white/10 bg-pine-950/90 backdrop-blur-md shadow-lg shadow-pine-950/30 lg:mx-4'
            : ''
        }`}
      >
        <a href="#accueil" className="flex items-center gap-3 group">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-500 font-display text-sm font-semibold text-pine-950 transition-transform group-hover:scale-105">
            SD
          </span>
          <span className="hidden sm:block leading-tight">
            <span className="block font-display text-[15px] font-medium text-ivory">Dr. Seynudé Dagnon</span>
            <span className="block text-[10px] uppercase tracking-[0.22em] text-gold-400">MD · MPH · Paludisme</span>
          </span>
        </a>

        <nav className="hidden lg:flex items-center gap-7">
          {NAV.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="text-[13px] font-medium text-pine-100/85 transition-colors hover:text-gold-400"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <a
            href={LINKS.linkedin}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-full border border-gold-500/50 px-4 py-2 text-[13px] font-semibold text-gold-300 transition-all hover:bg-gold-500 hover:text-pine-950"
          >
            <Linkedin size={15} /> LinkedIn
          </a>
        </div>

        <button
          className="lg:hidden text-ivory p-2"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden px-3 pb-3">
          <div className="rounded-2xl border border-white/10 bg-pine-950/95 backdrop-blur-md px-5 pb-6 pt-3 shadow-lg shadow-pine-950/30">
          <nav className="flex flex-col gap-1">
            {NAV.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-pine-100/90 hover:bg-white/5 hover:text-gold-400"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="mt-4 flex gap-3">
            <a
              href={LINKS.linkedin}
              target="_blank"
              rel="noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gold-500 px-4 py-2.5 text-sm font-semibold text-pine-950"
            >
              <Linkedin size={15} /> LinkedIn
            </a>
            <a
              href={LINKS.youtube}
              target="_blank"
              rel="noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-full border border-white/20 px-4 py-2.5 text-sm font-semibold text-ivory"
            >
              <Youtube size={15} /> YouTube
            </a>
          </div>
          </div>
        </div>
      )}
    </header>
  );
}
