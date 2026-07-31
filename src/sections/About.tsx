import { Briefcase, Target, Globe2, Languages, Quote } from 'lucide-react';
import { SectionHeading } from '@/components/SectionHeading';
import { Reveal } from '@/components/Reveal';
import { useLang } from '@/i18n/useLang';
import { IDENTITY, UI } from '@/i18n/translations';

const ICONS: Record<string, typeof Briefcase> = {
  briefcase: Briefcase,
  target: Target,
  globe: Globe2,
  languages: Languages,
};

export function About() {
  const { lang } = useLang();
  const t = UI[lang];

  return (
    <section id="apropos" className="relative bg-ivory py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow={t['about.eyebrow']}
              title={t['about.title']}
            />
            <Reveal delay={0.15}>
              <p className="mt-7 text-[15.5px] leading-relaxed text-ink/75">{t['about.p1']}</p>
              <p className="mt-5 text-[15.5px] leading-relaxed text-ink/75">{t['about.p2']}</p>
            </Reveal>

            <Reveal delay={0.25}>
              <figure className="relative mt-10 rounded-2xl border-l-4 border-gold-500 bg-white p-7 shadow-sm">
                <Quote size={26} className="absolute -top-3.5 left-6 rounded-full bg-gold-500 p-1.5 text-pine-950" />
                <blockquote className="font-display text-lg italic leading-relaxed text-pine-900">
                  {t['about.quote']}
                </blockquote>
                <figcaption className="mt-3 text-xs font-medium uppercase tracking-widest text-ink/70">
                  {t['about.quoteCite']}
                </figcaption>
              </figure>
            </Reveal>
          </div>

          <div className="grid content-start gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {IDENTITY[lang].map((item, i) => {
              const Icon = ICONS[item.icon];
              return (
                <Reveal key={item.title} delay={0.1 + i * 0.08}>
                  <div className="group h-full rounded-2xl border border-pine-900/10 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/50 hover:shadow-lg hover:shadow-pine-900/10">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pine-900 text-gold-400 transition-colors group-hover:bg-gold-500 group-hover:text-pine-950">
                      <Icon size={20} />
                    </div>
                    <h3 className="mt-4 font-display text-lg font-semibold text-pine-950">{item.title}</h3>
                    <p className="mt-2 text-[13.5px] leading-relaxed text-ink/65">{item.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
