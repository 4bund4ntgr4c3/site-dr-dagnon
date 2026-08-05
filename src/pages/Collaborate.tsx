import { Link } from 'react-router';
import { Handshake, FlaskConical, Globe, Building2, ArrowUpRight, CalendarPlus, Mail } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { useLang } from '@/i18n/useLang';
import { UI } from '@/i18n/translations';
import { localePath } from '@/i18n/routing';
import type { Lang } from '@/i18n/lang';

const COLLAB_TYPES: Record<Lang, { icon: typeof Handshake; title: string; text: string }[]> = {
  fr: [
    { icon: FlaskConical, title: 'Recherche opérationnelle', text: 'Co-production d\'études sur le paludisme, la chimioprévention saisonnière et l\'utilisation des données pour la prise de décision programmatique.' },
    { icon: Globe, title: 'Programmes de santé publique', text: 'Conception, mise en œuvre ou évaluation de programmes de lutte antipaludique à l\'échelle nationale ou sous-régionale.' },
    { icon: Building2, title: 'Conseil technique', text: 'Mission de conseil pour des organisations internationales, fondations ou gouvernements sur la stratégie, le financement durable et l\'équité d\'accès.' },
    { icon: Handshake, title: 'Partenariat stratégique', text: 'Alliances avec des instituts de recherche, universités ou organisations de la société civile pour des projets à impact mesurable.' },
  ],
  en: [
    { icon: FlaskConical, title: 'Operational research', text: 'Co-production of studies on malaria, seasonal chemoprevention and data-driven programmatic decision-making.' },
    { icon: Globe, title: 'Public health programs', text: 'Design, implementation or evaluation of malaria control programs at national or sub-regional level.' },
    { icon: Building2, title: 'Technical advisory', text: 'Advisory missions for international organizations, foundations or governments on strategy, sustainable financing and equitable access.' },
    { icon: Handshake, title: 'Strategic partnership', text: 'Alliances with research institutes, universities or civil society organizations for projects with measurable impact.' },
  ],
};

export default function Collaborate() {
  const { lang } = useLang();
  const t = UI[lang];

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen">
      <section className="relative overflow-hidden bg-pine-950">
        <div className="absolute inset-0 texture-net" />
        <div className="absolute -top-40 -right-40 h-[560px] w-[560px] rounded-full bg-pine-600/25 blur-[130px]" />
        <div className="absolute bottom-0 -left-40 h-[460px] w-[460px] rounded-full bg-gold-600/12 blur-[120px]" />

        <div className="relative mx-auto max-w-4xl px-5 pb-24 pt-32 lg:px-8 lg:pt-36">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-300">
              <Handshake size={13} />
              {t['collab.badge']}
            </span>
            <h1 className="mt-7 font-display text-[2.6rem] leading-[1.05] font-medium text-pine-100 sm:text-6xl lg:text-[4.4rem]">
              {t['collab.title']}
            </h1>
            <p className="mt-4 max-w-2xl font-display text-lg italic text-pine-200/90 sm:text-xl">
              {t['collab.intro']}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-pine-50 py-16 lg:py-20">
        <div className="mx-auto max-w-6xl space-y-16 px-5 lg:px-8">
          <Reveal>
            <div>
              <h2 className="font-display text-2xl font-semibold text-pine-900">{t['collab.typesTitle']}</h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {COLLAB_TYPES[lang].map((c, i) => {
                  const Icon = c.icon;
                  return (
                    <div key={i} className="rounded-2xl border border-pine-900/10 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/40">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pine-950 text-gold-400">
                        <Icon size={19} />
                      </span>
                      <h3 className="mt-4 font-display text-[1.15rem] font-semibold text-pine-900">{c.title}</h3>
                      <p className="mt-2 text-[13.5px] leading-relaxed text-pine-900/70">{c.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="rounded-2xl border border-pine-900/10 bg-white p-8 shadow-card sm:p-10">
              <h2 className="font-display text-2xl font-semibold text-pine-900">{t['collab.whyTitle']}</h2>
              <p className="mt-4 text-[15px] leading-[1.85] text-pine-900/85">{t['collab.whyText']}</p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to={`${localePath(lang, '/contact')}?type=partnership`}
                  className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-7 py-3.5 text-sm font-semibold text-pine-950 transition-all hover:-translate-y-0.5 hover:bg-gold-400"
                >
                  <CalendarPlus size={16} />
                  {t['collab.cta']}
                  <ArrowUpRight size={15} />
                </Link>
                <Link
                  to={`${localePath(lang, '/contact')}`}
                  className="inline-flex items-center gap-2 rounded-full border border-pine-900/20 px-7 py-3.5 text-sm font-semibold text-pine-900 transition-all hover:-translate-y-0.5 hover:border-gold-500/50 hover:text-gold-700"
                >
                  <Mail size={15} />
                  {t['collab.contactLink']}
                </Link>
              </div>
              <p className="mt-4 text-[12.5px] text-pine-900/80">{t['collab.ctaNote']}</p>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
