import { Link } from 'react-router';
import { Mic, Presentation, Users, MessagesSquare, ArrowUpRight, CalendarPlus } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { useLang } from '@/i18n/useLang';
import { UI } from '@/i18n/translations';
import { localePath } from '@/i18n/routing';
import type { Lang } from '@/i18n/lang';

const FORMATS: Record<Lang, { icon: typeof Mic; title: string; text: string }[]> = {
  fr: [
    { icon: Presentation, title: 'Conférence ou keynote', text: 'Vision et leçons de 17 ans de programmes paludisme en Afrique : élimination, données et digitalisation des campagnes.' },
    { icon: Users, title: 'Panel d\'experts', text: 'Débat avec décideurs, bailleurs et partenaires sur le financement durable et l\'équité d\'accès aux interventions.' },
    { icon: Mic, title: 'Formation ou atelier', text: 'Ateliers pratiques sur la chimioprévention saisonnière, la qualité des données et la gestion de programmes.' },
    { icon: MessagesSquare, title: 'Interview média', text: 'Commentaires d\'expert en français ou en anglais sur l\'actualité du paludisme et des systèmes de santé.' },
  ],
  en: [
    { icon: Presentation, title: 'Conference or keynote', text: 'Vision and lessons from 17+ years of malaria programs in Africa: elimination, data and campaign digitalization.' },
    { icon: Users, title: 'Expert panel', text: 'Debate with policymakers, funders and partners on sustainable financing and equitable access to interventions.' },
    { icon: Mic, title: 'Training or workshop', text: 'Hands-on sessions on seasonal chemoprevention, data quality and program management.' },
    { icon: MessagesSquare, title: 'Media interview', text: 'Expert commentary in French or English on malaria and health system news.' },
  ],
};

export default function Invite() {
  const { lang } = useLang();
  const t = UI[lang];

  return (
    <main id="main-content" className="min-h-screen">
      <section className="relative overflow-hidden bg-pine-950">
        <div className="absolute inset-0 texture-net" />
        <div className="absolute -top-40 -right-40 h-[560px] w-[560px] rounded-full bg-pine-600/25 blur-[130px]" />
        <div className="absolute bottom-0 -left-40 h-[460px] w-[460px] rounded-full bg-gold-600/12 blur-[120px]" />

        <div className="relative mx-auto max-w-4xl px-5 pb-24 pt-32 lg:px-8 lg:pt-36">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-300">
              <Mic size={13} />
              {t['invitePage.badge']}
            </span>
            <h1 className="mt-7 font-display text-[2.6rem] leading-[1.05] font-medium text-pine-100 sm:text-6xl lg:text-[4.4rem]">
              {t['invitePage.title']}
            </h1>
            <p className="mt-4 max-w-2xl font-display text-lg italic text-pine-200/90 sm:text-xl">
              {t['invitePage.intro']}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-pine-50 py-16 lg:py-20">
        <div className="mx-auto max-w-6xl space-y-16 px-5 lg:px-8">
          <Reveal>
            <div>
              <h2 className="font-display text-2xl font-semibold text-pine-900">{t['invitePage.formatsTitle']}</h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {FORMATS[lang].map((f, i) => {
                  const Icon = f.icon;
                  return (
                    <div key={i} className="rounded-2xl border border-pine-900/10 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/40">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pine-950 text-gold-400">
                        <Icon size={19} />
                      </span>
                      <h3 className="mt-4 font-display text-[1.15rem] font-semibold text-pine-900">{f.title}</h3>
                      <p className="mt-2 text-[13.5px] leading-relaxed text-pine-900/70">{f.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="rounded-2xl border border-pine-900/10 bg-white p-8 shadow-card sm:p-10">
              <h2 className="font-display text-2xl font-semibold text-pine-900">{t['invitePage.whyTitle']}</h2>
              <p className="mt-4 text-[15px] leading-[1.85] text-pine-900/85">{t['invitePage.whyText']}</p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to={`${localePath(lang, '/contact')}?type=speaking`}
                  className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-7 py-3.5 text-sm font-semibold text-pine-950 transition-all hover:-translate-y-0.5 hover:bg-gold-400"
                >
                  <CalendarPlus size={16} />
                  {t['invitePage.cta']}
                  <ArrowUpRight size={15} />
                </Link>
                <Link
                  to={`${localePath(lang, '/contact')}?type=press`}
                  className="inline-flex items-center gap-2 rounded-full border border-pine-900/20 px-7 py-3.5 text-sm font-semibold text-pine-900 transition-all hover:-translate-y-0.5 hover:border-gold-500/50 hover:text-gold-700"
                >
                  {t['invitePage.pressLink']}
                </Link>
              </div>
              <p className="mt-4 text-[12.5px] text-pine-900/60">{t['invitePage.ctaNote']}</p>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
