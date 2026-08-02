import { useParams, Link } from 'react-router';
import { ArrowLeft, ExternalLink, Newspaper, CalendarDays, Clock, ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { NotFoundView } from '@/components/NotFoundView';
import { ShareButtons } from '@/components/ShareButtons';
import { ReadingProgress } from '@/components/ReadingProgress';
import { useLang } from '@/i18n/useLang';
import { UI } from '@/i18n/translations';
import { localePath } from '@/i18n/routing';
import { absUrl } from '@/seo/meta';
import { countWords, readingMinutes } from '@/lib/reading';
import { TRIBUNES, type TribuneBlock } from '@/data/tribunes';
import { TRIBUNE_BODIES } from '@/data/tribune-bodies';

const parts = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return { y, m, d };
};

export default function TribuneArticle() {
  const { lang } = useLang();
  const { slug } = useParams<{ slug: string }>();
  const entry = TRIBUNES.find((t) => t.slug === slug);
  const body = entry ? TRIBUNE_BODIES[entry.slug] : null;
  const t = UI[lang];

  if (!entry || !body) {
    return <NotFoundView />;
  }

  const { y, m, d } = parts(entry.date);
  const dateLabel = new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(y, m - 1, d));

  const minutes = readingMinutes(countWords(...body[lang].map((b) => b.text)));
  /* the two most recent op-eds other than this one — hidden while fewer
     than two exist, which is also why the count comes from the data */
  const others = TRIBUNES.filter((t) => t.slug !== entry.slug)
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
              to={localePath(lang, '/tribunes')}
              className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-gold-300 transition-colors hover:text-gold-200"
            >
              <ArrowLeft size={13} />
              {t['tribunesPage.back']}
            </Link>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-300">
                <Newspaper size={13} />
                {t['tribunesPage.badge']}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11.5px] text-pine-100/60">
                <CalendarDays size={12} />
                {t['tribunesPage.published']} {dateLabel}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11.5px] text-pine-100/60">
                <Clock size={12} />
                {t['article.readingTime']} · {minutes} min
              </span>
              <a
                href={entry.source.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-pine-100/70 transition-colors hover:text-gold-300"
              >
                <ExternalLink size={12} />
                {entry.source.name}
              </a>
            </div>
            <h1 className="mt-7 font-display text-[2.2rem] leading-[1.08] font-medium text-pine-100 sm:text-5xl lg:text-[3.4rem]">
              {entry.title[lang]}
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="bg-pine-50 py-14 lg:py-20">
        <div className="mx-auto max-w-3xl px-5 lg:px-8">
          <Reveal>
            <article className="space-y-6">
              {body[lang].map((block, i) => (
                <TribuneBlockView key={i} block={block} />
              ))}
            </article>

            <footer className="mt-12 border-t border-pine-900/10 pt-6">
              <p className="text-[12.5px] leading-relaxed text-pine-900/70">
                {t['tribunesPage.reprint']}{' '}
                <a
                  href={entry.source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-gold-700 transition-colors hover:text-gold-500"
                >
                  {entry.source.name}
                </a>
                {' — '}
                <a
                  href={entry.source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-gold-700 transition-colors hover:text-gold-500"
                >
                  {t['tribunesPage.original']}
                  <ExternalLink size={12} />
                </a>
              </p>
            </footer>

            <div className="mt-6 border-t border-pine-900/10 pt-6">
              <ShareButtons title={entry.title[lang]} url={absUrl(lang, `/tribunes/${entry.slug}`)} />
            </div>

            {others.length > 0 && (
              <div className="mt-12 border-t border-pine-900/10 pt-8">
                <h2 className="font-display text-xl font-semibold text-pine-900">{t['article.readMore']}</h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {others.map((o) => (
                    <Link
                      key={o.slug}
                      to={localePath(lang, `/tribunes/${o.slug}`)}
                      className="group flex flex-col rounded-2xl border border-pine-900/10 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/40 hover:shadow-card"
                    >
                      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-pine-900/55">
                        {o.source.name}
                      </span>
                      <h3 className="mt-2 font-display text-[1.05rem] font-semibold leading-snug text-pine-900 transition-colors group-hover:text-gold-700">
                        {o.title[lang]}
                      </h3>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-gold-700">
                        {t['tribunesPage.read']}
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

function TribuneBlockView({ block }: { block: TribuneBlock }) {
  switch (block.kind) {
    case 'byline':
      return (
        <p className="border-l-2 border-gold-500/50 pl-4 text-[13px] leading-relaxed text-pine-900/70 italic">
          {block.text}
        </p>
      );
    case 'h2':
      return (
        <h2 className="pt-4 font-display text-[1.6rem] leading-snug font-semibold text-pine-900">{block.text}</h2>
      );
    case 'quote':
      return (
        <blockquote className="rounded-r-xl border-l-4 border-gold-500 bg-white/70 px-5 py-4 font-display text-[15px] leading-relaxed text-pine-900">
          {block.text}
        </blockquote>
      );
    case 'p':
    default:
      return <p className="text-[15px] leading-[1.85] text-pine-900/85">{block.text}</p>;
  }
}
