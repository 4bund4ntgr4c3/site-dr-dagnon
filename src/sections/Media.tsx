import { Play, FileDown, Newspaper, ArrowUpRight } from 'lucide-react';
import { SectionHeading } from '@/components/SectionHeading';
import { Reveal } from '@/components/Reveal';
import { MEDIA } from '@/data/content';

export function Media() {
  return (
    <section id="medias" className="relative overflow-hidden bg-pine-950 py-24 lg:py-32">
      <div className="absolute inset-0 texture-dots opacity-50" />
      <div className="absolute -left-32 bottom-0 h-[380px] w-[380px] rounded-full bg-pine-600/20 blur-[110px]" />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          dark
          eyebrow="Prises de parole"
          title="Sur scène et dans les médias"
          intro="Conférences internationales, keynotes et tribunes pour porter la voix de l’Afrique francophone dans la lutte contre le paludisme."
        />

        {/* featured op-ed banner */}
        <Reveal delay={0.1}>
          <a
            href="https://www.africahealthwatch.com/p/from-malaria-control-to-elimination?utm_source=publication-search"
            target="_blank"
            rel="noreferrer"
            className="group mt-14 flex flex-col gap-6 overflow-hidden rounded-2xl border border-gold-500/30 bg-gradient-to-r from-pine-900 to-pine-950 p-8 transition-all duration-300 hover:border-gold-500/60 lg:flex-row lg:items-center lg:p-10"
          >
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gold-500 text-pine-950">
              <Newspaper size={24} />
            </span>
            <div className="flex-1">
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-gold-400">
                Tribune · Africa Health Watch · mai 2026
              </p>
              <h3 className="mt-2 font-display text-2xl font-semibold leading-snug text-ivory lg:text-[1.7rem]">
                « From Malaria Control to Elimination: The Turn We Need to Make »
              </h3>
              <p className="mt-2 text-sm text-pine-100/60">
                Co-signée avec la Pr. Rose Leke — un appel à opérer le virage du contrôle vers l’élimination du paludisme.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 self-start rounded-full border border-gold-500/50 px-5 py-2.5 text-sm font-semibold text-gold-300 transition-all group-hover:bg-gold-500 group-hover:text-pine-950 lg:self-center">
              Lire la tribune <ArrowUpRight size={16} />
            </span>
          </a>
        </Reveal>

        {/* videos grid */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {MEDIA.map((m, i) => (
            <Reveal key={m.title} delay={0.15 + i * 0.08}>
              <a
                href={m.url}
                target="_blank"
                rel="noreferrer"
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-pine-900/60 backdrop-blur transition-all duration-300 hover:-translate-y-1.5 hover:border-gold-500/40"
              >
                {m.kind === 'video' ? (
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={m.thumb}
                      alt={m.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-pine-950/40 transition-colors group-hover:bg-pine-950/20" />
                    <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gold-500 text-pine-950 shadow-xl transition-transform duration-300 group-hover:scale-110">
                      <Play size={22} className="ml-0.5" fill="currentColor" />
                    </span>
                  </div>
                ) : (
                  <div className="relative flex aspect-video items-center justify-center bg-gradient-to-br from-pine-800 to-pine-950">
                    <div className="absolute inset-0 texture-dots" />
                    <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gold-500/15 text-gold-400 ring-1 ring-gold-500/40 transition-transform duration-300 group-hover:scale-110">
                      <FileDown size={24} />
                    </span>
                  </div>
                )}
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-gold-400">{m.event}</p>
                  <h3 className="mt-2 flex-1 font-display text-[15.5px] font-semibold leading-snug text-ivory">
                    {m.title}
                  </h3>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-semibold text-pine-100/60 transition-colors group-hover:text-gold-300">
                    {m.kind === 'video' ? 'Regarder' : 'Télécharger le PDF'}
                    <ArrowUpRight size={13} />
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
