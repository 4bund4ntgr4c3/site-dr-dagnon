import { ShieldCheck, Database, Layers, LineChart, Handshake } from 'lucide-react';
import { Link } from 'react-router';
import { SectionHeading } from '@/components/SectionHeading';
import { Reveal } from '@/components/Reveal';
import { useLang } from '@/i18n/useLang';
import { UI } from '@/i18n/translations';
import { EXPERTISE } from '@/data/site';
import { localePath } from '@/i18n/routing';

const ICONS: Record<string, typeof ShieldCheck> = {
  shield: ShieldCheck,
  database: Database,
  layers: Layers,
  chart: LineChart,
  handshake: Handshake,
};

export function Expertise() {
  const { lang } = useLang();
  const t = UI[lang];

  return (
    <section id="expertise" className="relative overflow-hidden bg-pine-950 py-24 lg:py-32">
      <div className="absolute inset-0 texture-dots opacity-60" />
      <div className="absolute -left-32 top-1/3 h-[420px] w-[420px] rounded-full bg-pine-600/20 blur-[120px]" />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          dark
          align="center"
          eyebrow={t['expertise.eyebrow']}
          title={t['expertise.title']}
          intro={t['expertise.intro']}
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {EXPERTISE[lang].map((item, i) => {
            const Icon = ICONS[item.icon];
            const wide = i === 4;
            return (
              <Reveal key={item.title} delay={i * 0.09} className={wide ? 'sm:col-span-2 lg:col-span-1' : ''}>
                <div className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-pine-900/70 p-7 backdrop-blur transition-all duration-300 hover:-translate-y-1.5 hover:border-gold-500/40">
                  <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gold-500/0 blur-2xl transition-all duration-500 group-hover:bg-gold-500/15" />
                  <div className="relative">
                    <span className="font-display text-sm italic text-gold-500/80">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="mt-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gold-500/12 text-gold-400 ring-1 ring-gold-500/25 transition-all duration-300 group-hover:bg-gold-500 group-hover:text-pine-950">
                      <Icon size={22} />
                    </div>
                    <h3 className="mt-5 font-display text-xl font-semibold leading-snug text-ivory">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-[13.5px] leading-relaxed text-pine-100/65">{item.text}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}

          {/* CTA card */}
          <Reveal delay={0.45}>
            <Link
              to={localePath(lang, '/contact')}
              className="group flex h-full min-h-[220px] flex-col justify-between rounded-2xl bg-gradient-to-br from-gold-500 to-gold-600 p-7 text-pine-950 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-gold-600/30"
            >
              <p className="font-display text-2xl font-semibold leading-snug">
                {t['expertise.ctaTitle']}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
                {t['expertise.ctaBtn']}
                <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
              </span>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
