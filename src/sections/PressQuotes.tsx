import { Link } from 'react-router';
import { Quote, ArrowUpRight, Newspaper } from 'lucide-react';
import { SectionHeading } from '@/components/SectionHeading';
import { Reveal } from '@/components/Reveal';
import { useLang } from '@/i18n/useLang';
import { UI } from '@/i18n/translations';
import { localePath } from '@/i18n/routing';
import { PRESS_QUOTES } from '@/data/press-quotes';

/* Press excerpts on the homepage — short lines from the coverage listed in
   src/data/media.ts (category: 'press'), each linking back to the article. */

const parts = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return { y, m, d };
};

export function PressQuotes() {
  const { lang } = useLang();
  const t = UI[lang];
  const locale = lang === 'fr' ? 'fr-FR' : 'en-US';

  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow={t['home.pressQuotes.eyebrow']}
          title={t['home.pressQuotes.title']}
          intro={t['home.pressQuotes.intro']}
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PRESS_QUOTES.map((q, i) => {
            const { y, m, d } = parts(q.date);
            const dateLabel = new Intl.DateTimeFormat(locale, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }).format(new Date(y, m - 1, d));
            return (
              <Reveal key={q.id} delay={0.1 + i * 0.08}>
                <a
                  href={q.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex h-full flex-col rounded-2xl border border-pine-900/10 bg-ivory p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/50 hover:shadow-card-hover"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-pine-900 text-gold-400 transition-colors group-hover:bg-gold-500 group-hover:text-pine-950">
                    <Quote size={20} />
                  </span>
                  <blockquote className="mt-5 flex-1 text-[15px] leading-relaxed text-ink/85">
                    « {q.quote[lang]} »
                  </blockquote>
                  <footer className="mt-6 flex items-center justify-between gap-3 border-t border-pine-900/10 pt-4">
                    <span className="flex items-center gap-2 text-[12.5px] font-semibold text-pine-950">
                      <Newspaper size={14} className="text-gold-600" />
                      {q.source}
                      <span className="font-normal text-ink/50">· {dateLabel}</span>
                    </span>
                    <ArrowUpRight
                      size={15}
                      className="shrink-0 text-gold-600 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </footer>
                </a>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.5}>
          <div className="mt-10 text-center">
            <Link
              to={localePath(lang, '/media/press')}
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-pine-900/70 transition-colors hover:text-gold-700"
            >
              {t['home.pressQuotes.more']}
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
