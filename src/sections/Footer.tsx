import { Linkedin, Youtube, ArrowUpRight } from 'lucide-react';
import { AfricaMap } from '@/components/AfricaMap';
import { Reveal } from '@/components/Reveal';
import { NAV, LINKS } from '@/data/content';

export function Footer() {
  return (
    <footer id="contact" className="relative overflow-hidden bg-[#051512]">
      <div className="absolute inset-0 texture-net opacity-70" />
      <div className="relative mx-auto max-w-7xl px-5 pb-12 pt-24 lg:px-8 lg:pt-32">
        {/* CTA */}
        <Reveal>
          <div className="grid items-center gap-10 border-b border-white/8 pb-16 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-400">Contact</p>
              <h2 className="mt-4 font-display text-3xl font-medium leading-tight text-ivory sm:text-4xl lg:text-[3rem]">
                Ensemble, accélérons
                <br />
                l’<span className="italic text-gold-400">élimination du paludisme</span>.
              </h2>
              <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-pine-100/65">
                Partenariats de programmes, conférences, conseil technique ou échanges sur les
                systèmes de santé en Afrique francophone — le Dr. Dagnon est joignable via ses
                réseaux professionnels.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href={LINKS.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2.5 rounded-full bg-gold-500 px-7 py-3.5 text-sm font-semibold text-pine-950 transition-all hover:-translate-y-0.5 hover:bg-gold-400"
                >
                  <Linkedin size={17} /> LinkedIn
                  <ArrowUpRight size={15} />
                </a>
                <a
                  href={LINKS.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2.5 rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold text-ivory transition-all hover:-translate-y-0.5 hover:border-gold-400 hover:text-gold-300"
                >
                  <Youtube size={17} /> YouTube
                  <ArrowUpRight size={15} />
                </a>
              </div>
            </div>
            <div className="hidden justify-end lg:flex">
              <AfricaMap className="w-64 opacity-80" />
            </div>
          </div>
        </Reveal>

        {/* bottom bar */}
        <div className="flex flex-col items-center justify-between gap-6 pt-10 md:flex-row">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-500 font-display text-sm font-semibold text-pine-950">
              SD
            </span>
            <div className="leading-tight">
              <p className="font-display text-sm font-medium text-ivory">Dr. Seynudé Jean-Fortuné Dagnon</p>
              <p className="text-[10.5px] uppercase tracking-[0.2em] text-pine-100/50">MD · MPH · Santé publique</p>
            </div>
          </div>

          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {NAV.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="text-[12.5px] font-medium text-pine-100/60 transition-colors hover:text-gold-400"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <p className="text-[12px] text-pine-100/40">
            © {new Date().getFullYear()} — Tous droits réservés
          </p>
        </div>
      </div>
    </footer>
  );
}
