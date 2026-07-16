import { Trophy } from 'lucide-react';
import { SectionHeading } from '@/components/SectionHeading';
import { Reveal } from '@/components/Reveal';
import { ACHIEVEMENTS, PORTFOLIO } from '@/data/content';

export function Achievements() {
  return (
    <section id="realisations" className="relative overflow-hidden bg-pine-900 py-24 lg:py-32">
      <div className="absolute inset-0 texture-dots opacity-50" />
      <div className="absolute -right-40 -top-24 h-[420px] w-[420px] rounded-full bg-gold-600/10 blur-[110px]" />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          dark
          eyebrow="Réalisations marquantes"
          title="Des résultats mesurables, reconnus internationalement"
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ACHIEVEMENTS.map((a, i) => (
            <Reveal key={a.title} delay={i * 0.09}>
              <div className="group flex h-full flex-col rounded-2xl border border-white/10 bg-pine-950/60 p-7 backdrop-blur transition-all duration-300 hover:-translate-y-1.5 hover:border-gold-500/40">
                <p className="font-display text-[1.9rem] font-semibold leading-none text-gold-400">
                  {a.metric}
                </p>
                <h3 className="mt-4 flex items-start gap-2 font-display text-lg font-semibold leading-snug text-ivory">
                  {a.title}
                </h3>
                <p className="mt-3 flex-1 text-[13px] leading-relaxed text-pine-100/60">{a.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-14 rounded-2xl border border-gold-500/25 bg-gradient-to-r from-pine-950/80 to-pine-900/80 p-8 backdrop-blur lg:p-10">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-500 text-pine-950">
                <Trophy size={19} />
              </span>
              <h3 className="font-display text-xl font-semibold text-ivory">
                Portefeuille paludisme & santé — un aperçu
              </h3>
            </div>
            <p className="mt-3 max-w-3xl text-[13.5px] leading-relaxed text-pine-100/60">
              Gestion ou appui technique d’un large portefeuille de programmes et subventions,
              de la digitalisation des campagnes au renforcement des systèmes de santé.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {PORTFOLIO.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[12.5px] font-medium text-pine-100/85 transition-colors hover:border-gold-500/50 hover:text-gold-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
