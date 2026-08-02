import { useParams, Link } from 'react-router';
import { ArrowLeft, ExternalLink, Newspaper, CalendarDays, Clock, ArrowRight, Printer } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { NotFoundView } from '@/components/NotFoundView';
import { ShareButtons } from '@/components/ShareButtons';
import { ReadingProgress } from '@/components/ReadingProgress';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { FontSizeControl } from '@/components/FontSizeControl';
import { SelectionQuote } from '@/components/SelectionQuote';
import { ArticleAudio } from '@/components/ArticleAudio';
import { useLang } from '@/i18n/useLang';
import { UI } from '@/i18n/translations';
import { localePath } from '@/i18n/routing';
import { absUrl } from '@/seo/meta';
import { track } from '@/lib/analytics';
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
      <section className="relative overflow-hidden bg-pine-950 print:hidden">
        <div className="absolute inset-0 texture-net" />
        <div className="absolute -top-40 -right-40 h-[560px] w-[560px] rounded-full bg-pine-600/25 blur-[130px]" />
        <div className="absolute bottom-0 -left-40 h-[460px] w-[460px] rounded-full bg-gold-600/12 blur-[120px]" />

        <div className="relative mx-auto max-w-4xl px-5 pb-20 pt-32 lg:px-8 lg:pt-36">
          <Reveal>
            <Breadcrumbs
              dark
              items={[
                { label: t['breadcrumb.home'], to: localePath(lang, '/') },
                { label: t['tribunesPage.badge'], to: localePath(lang, '/tribunes') },
                { label: entry.title[lang] },
              ]}
            />
            <Link
              to={localePath(lang, '/tribunes')}
              className="mt-5 inline-flex items-center gap-1.5 text-[12px] font-semibold text-gold-300 transition-colors hover:text-gold-200"
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
              <button
                type="button"
                onClick={() => {
                  track('print_article', { event_category: 'engagement', event_label: 'tribune' });
                  window.print();
                }}
                className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-pine-100/70 transition-colors hover:text-gold-300"
              >
                <Printer size={12} />
                {t['article.print']}
              </button>
              <ArticleAudio text={body[lang].map((b) => b.text).join(' ')} />
              <FontSizeControl dark />
            </div>
            <h1 className="mt-7 font-display text-[2.2rem] leading-[1.08] font-medium text-pine-100 sm:text-5xl lg:text-[3.4rem]">
              {entry.title[lang]}
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="bg-pine-50 py-14 lg:py-20 print:bg-white print:py-0">
        <div className="mx-auto max-w-3xl px-5 lg:px-8">
          {/* the dark hero is hidden when printing; the title, date and source
              are re-printed here in ink-friendly form */}
          <div className="hidden print:block">
            <h1 className="font-display text-[1.7rem] leading-snug font-semibold text-pine-900">
              {entry.title[lang]}
            </h1>
            <p className="mt-3 text-[12.5px] text-pine-900/70">
              {t['tribunesPage.published']} {dateLabel} · {entry.source.name}
            </p>
          </div>
          <Reveal>
            <article data-reader className="space-y-6">
              {body[lang].map((block, i) => (
                <TribuneBlockView key={i} block={block} />
              ))}
            </article>
            <SelectionQuote
              source={`${entry.source.name} — seynudedagnon.com`}
              url={absUrl(lang, `/tribunes/${entry.slug}`)}
              container="[data-reader]"
            />

            <footer className="mt-12 border-t border-pine-900/10 pt-6 print:hidden">
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

            <div className="mt-6 border-t border-pine-900/10 pt-6 print:hidden">
              <ShareButtons title={entry.title[lang]} url={absUrl(lang, `/tribunes/${entry.slug}`)} />
            </div>

            {others.length > 0 && (
              <div className="mt-12 border-t border-pine-900/10 pt-8 print:hidden">
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
  /* text sizes in em, not rem: the [data-reader] font-size on the <article>
     then scales the whole body when the visitor uses the A−/A+ control */
  switch (block.kind) {
    case 'byline':
      return (
        <p className="border-l-2 border-gold-500/50 pl-4 text-[0.8125em] leading-relaxed text-pine-900/70 italic">
          {block.text}
        </p>
      );
    case 'h2':
      return (
        <h2 className="pt-4 font-display text-[1.6em] leading-snug font-semibold text-pine-900">{block.text}</h2>
      );
    case 'quote':
      return (
        <blockquote className="rounded-r-xl border-l-4 border-gold-500 bg-white/70 px-5 py-4 font-display text-[0.9375em] leading-relaxed text-pine-900">
          {block.text}
        </blockquote>
      );
    case 'p':
    default:
      return <p className="text-[0.9375em] leading-[1.85] text-pine-900/85">{block.text}</p>;
  }
}
