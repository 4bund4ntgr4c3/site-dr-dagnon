import { FolderKanban, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router';
import { Reveal } from '@/components/Reveal';
import { NameHighlight } from '@/components/NameHighlight';
import { useLang } from '@/i18n/useLang';
import { UI } from '@/i18n/translations';
import { localePath } from '@/i18n/routing';
import { PROJECTS, type ProjectEntry } from '@/data/projects';

export default function Projects() {
  const { lang } = useLang();
  const t = UI[lang];

  const sorted = [...PROJECTS].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <main id="main-content" className="min-h-screen">
      <section className="relative overflow-hidden bg-pine-950">
        <div className="absolute inset-0 texture-net" />
        <div className="absolute -top-40 -right-40 h-[560px] w-[560px] rounded-full bg-pine-600/25 blur-[130px]" />
        <div className="absolute bottom-0 -left-40 h-[460px] w-[460px] rounded-full bg-gold-600/12 blur-[120px]" />

        <div className="relative mx-auto max-w-6xl px-5 pb-24 pt-32 lg:px-8 lg:pt-36">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-300">
              <FolderKanban size={13} />
              {t['projetsPage.badge']}
            </span>
            <h1 className="mt-7 font-display text-[2.6rem] leading-[1.05] font-medium text-pine-100 sm:text-6xl lg:text-[4.4rem]">
              {t['projetsPage.badge']} — <NameHighlight />
            </h1>
            <p className="mt-4 font-display text-lg italic text-pine-200/90 sm:text-xl">
              {t['projetsPage.intro']}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-pine-50 py-16 lg:py-20">
        <div className="relative mx-auto max-w-6xl px-5 lg:px-8">
          {sorted.length > 0 ? (
            <div className="grid gap-5 lg:grid-cols-2">
              {sorted.map((e, i) => (
                <Reveal key={e.slug} delay={Math.min(i * 0.05, 0.3)}>
                  <ProjectCard e={e} lang={lang} t={t} />
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border border-dashed border-pine-900/15 bg-white px-6 py-14 text-center text-sm text-pine-900/75">
              {t['projetsPage.empty']}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

function ProjectCard({ e, lang, t }: { e: ProjectEntry; lang: 'fr' | 'en'; t: typeof UI['fr'] }) {
  return (
    <Link
      to={localePath(lang, `/projets/${e.slug}`)}
      className="group flex h-full flex-col rounded-2xl border border-pine-900/10 bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/40 sm:p-6"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-pine-950 px-3 py-1 text-[11px] font-semibold text-gold-400">
          {e.tag[lang]}
        </span>
        <span className="text-[11.5px] text-pine-900/65">{e.period[lang]}</span>
        <span className="ml-auto text-[11.5px] text-pine-900/65">{e.location[lang]}</span>
      </div>
      <h2 className="mt-3 font-display text-[1.15rem] font-semibold leading-snug text-pine-900 transition-colors group-hover:text-gold-600">
        {e.title[lang]}
      </h2>
      <p className="mt-2 text-[12.5px] leading-relaxed text-pine-900/70 line-clamp-3">{e.description[lang]}</p>
      <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-[12px] font-semibold text-gold-700 transition-colors group-hover:text-gold-500">
        {t['projetsPage.read']}
        <ArrowUpRight size={13} />
      </span>
    </Link>
  );
}
