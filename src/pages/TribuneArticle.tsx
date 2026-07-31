import { useParams, Link } from 'react-router';
import { ArrowLeft, ExternalLink, Newspaper, CalendarDays } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { NotFoundView } from '@/components/NotFoundView';
import { useLang } from '@/i18n/useLang';
import { UI } from '@/i18n/translations';
import { localePath } from '@/i18n/routing';
import { TRIBUNES, type TribuneBlock } from '@/data/tribunes';

const parts = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return { y, m, d };
};

export default function TribuneArticle() {
  const { lang } = useLang();
  const { slug } = useParams<{ slug: string }>();
  const entry = TRIBUNES.find((t) => t.slug === slug);
  const t = UI[lang];

  if (!entry) {
    return <NotFoundView />;
  }

  const { y, m, d } = parts(entry.date);
  const dateLabel = new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(y, m - 1, d));

  return (
    <main id="main-content" className="min-h-screen">
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

      <section className="bg-pine-50 py-14 lg:py-18">
        <div className="mx-auto max-w-3xl px-5 lg:px-8">
          <Reveal>
            <article className="space-y-6">
              {entry.body[lang].map((block, i) => (
                <TribuneBlockView key={i} block={block} />
              ))}
            </article>

            <footer className="mt-12 border-t border-pine-900/10 pt-6">
              <p className="text-[12.5px] leading-relaxed text-pine-900/60">
                {t['tribunesPage.reprint']}{' '}
                <a
                  href={entry.source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-gold-600 transition-colors hover:text-gold-500"
                >
                  {entry.source.name}
                </a>
                {' — '}
                <a
                  href={entry.source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-gold-600 transition-colors hover:text-gold-500"
                >
                  {t['tribunesPage.original']}
                  <ExternalLink size={12} />
                </a>
              </p>
            </footer>
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
        <p className="border-l-2 border-gold-500/50 pl-4 text-[13px] leading-relaxed text-pine-900/60 italic">
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
