import { useParams, Link } from 'react-router';
import {
  ArrowLeft,
  FolderKanban,
  MapPin,
  CalendarDays,
  Briefcase,
  FileText,
  ListChecks,
  Target,
  ExternalLink,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { NotFoundView } from '@/components/NotFoundView';
import { ShareButtons } from '@/components/ShareButtons';
import { ReadingProgress } from '@/components/ReadingProgress';
import { useLang } from '@/i18n/useLang';
import { UI } from '@/i18n/translations';
import { localePath } from '@/i18n/routing';
import { absUrl } from '@/seo/meta';
import { countWords, readingMinutes } from '@/lib/reading';
import { PROJECTS } from '@/data/projects';
import { PROJECT_DETAILS } from '@/data/project-details';

export default function ProjectArticle() {
  const { lang } = useLang();
  const { slug } = useParams<{ slug: string }>();
  const entry = PROJECTS.find((p) => p.slug === slug);
  const details = entry ? PROJECT_DETAILS[entry.slug] : null;
  const t = UI[lang];

  if (!entry || !details) {
    return <NotFoundView />;
  }

  const minutes = readingMinutes(
    countWords(
      details.context[lang],
      ...details.approach[lang],
      ...details.results.map((r) => r.label[lang]),
      ...details.evidence.map((ev) => ev.label[lang]),
    ),
  );
  /* the two most recent case studies other than this one */
  const others = PROJECTS.filter((p) => p.slug !== entry.slug)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 2);

  return (
    <main id="main-content" className="min-h-screen">
      <ReadingProgress />
      <section className="relative overflow-hidden bg-pine-950">
        <div className="absolute inset-0 texture-net" />
        <div className="absolute -top-40 -right-40 h-[560px] w-[560px] rounded-full bg-pine-600/25 blur-[130px]" />
        <div className="absolute bottom-0 -left-40 h-[460px] w-[460px] rounded-full bg-gold-600/12 blur-[120px]" />

        <div className="relative mx-auto max-w-4xl px-5 pb-20 pt-32 lg:px-8 lg:pt-36">
          <Reveal>
            <Link
              to={localePath(lang, '/projets')}
              className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-gold-300 transition-colors hover:text-gold-200"
            >
              <ArrowLeft size={13} />
              {t['projetsPage.back']}
            </Link>
            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-300">
                <FolderKanban size={13} />
                {entry.tag[lang]}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11.5px] text-pine-100/60">
                <CalendarDays size={12} />
                {t['projetsPage.period']} : {entry.period[lang]}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11.5px] text-pine-100/60">
                <Clock size={12} />
                {t['article.readingTime']} · {minutes} min
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11.5px] text-pine-100/60">
                <MapPin size={12} />
                {entry.location[lang]}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11.5px] text-pine-100/60">
                <Briefcase size={12} />
                {entry.role[lang]}
              </span>
            </div>
            <h1 className="mt-7 font-display text-[2.2rem] leading-[1.08] font-medium text-pine-100 sm:text-5xl lg:text-[3.4rem]">
              {entry.title[lang]}
            </h1>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-pine-200/85">{entry.description[lang]}</p>
          </Reveal>
        </div>
      </section>

      <section className="bg-pine-50 py-14 lg:py-20">
        <div className="mx-auto max-w-3xl px-5 lg:px-8">
          <Reveal>
            <article className="space-y-10">
              <div>
                <SectionLabel icon={<FileText size={15} />} label={t['projetsPage.context']} />
                <p className="mt-4 text-[15px] leading-[1.85] text-pine-900/85">{details.context[lang]}</p>
              </div>

              <div>
                <SectionLabel icon={<ListChecks size={15} />} label={t['projetsPage.approach']} />
                <ul className="mt-4 space-y-3">
                  {details.approach[lang].map((step, i) => (
                    <li key={i} className="flex gap-3 text-[14.5px] leading-relaxed text-pine-900/80">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
                      {step}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <SectionLabel icon={<Target size={15} />} label={t['projetsPage.results']} />
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {details.results.map((r, i) => (
                    <div key={i} className="rounded-2xl border border-gold-500/30 bg-gold-500/10 p-5">
                      <p className="font-display text-[1.7rem] leading-tight font-semibold text-gold-700">
                        {r.value}
                      </p>
                      <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink/70">{r.label[lang]}</p>
                    </div>
                  ))}
                </div>
              </div>

              {details.evidence.length > 0 && (
                <div>
                  <SectionLabel icon={<ExternalLink size={15} />} label={t['projetsPage.evidence']} />
                  <ul className="mt-4 space-y-2.5">
                    {details.evidence.map((ev, i) => (
                      <li key={i}>
                        <a
                          href={ev.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-xl border border-pine-900/10 bg-white px-4 py-3 text-[13px] font-semibold text-pine-900 transition-all hover:border-gold-500/40 hover:text-gold-600"
                        >
                          <ExternalLink size={13} className="shrink-0 text-gold-600" />
                          {ev.label[lang]}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </article>

            <footer className="mt-12 border-t border-pine-900/10 pt-6">
              <Link
                to={localePath(lang, '/projets')}
                className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-gold-700 transition-colors hover:text-gold-500"
              >
                <ArrowLeft size={13} />
                {t['projetsPage.back']}
              </Link>
            </footer>

            <div className="mt-6 border-t border-pine-900/10 pt-6">
              <ShareButtons title={entry.title[lang]} url={absUrl(lang, `/projets/${entry.slug}`)} />
            </div>

            {others.length > 0 && (
              <div className="mt-12 border-t border-pine-900/10 pt-8">
                <h2 className="font-display text-xl font-semibold text-pine-900">{t['article.readMore']}</h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {others.map((o) => (
                    <Link
                      key={o.slug}
                      to={localePath(lang, `/projets/${o.slug}`)}
                      className="group flex flex-col rounded-2xl border border-pine-900/10 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/40 hover:shadow-card"
                    >
                      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-pine-900/55">
                        {o.tag[lang]}
                      </span>
                      <h3 className="mt-2 font-display text-[1.05rem] font-semibold leading-snug text-pine-900 transition-colors group-hover:text-gold-700">
                        {o.title[lang]}
                      </h3>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-gold-700">
                        {t['projetsPage.read']}
                        <ArrowRight size={13} />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </Reveal>
        </div>
      </section>
    </main>
  );
}

function SectionLabel({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-pine-900/75">
      <span className="text-gold-500">{icon}</span>
      {label}
    </div>
  );
}
