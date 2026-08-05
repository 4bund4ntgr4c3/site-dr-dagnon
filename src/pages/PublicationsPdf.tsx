import { Printer, FileText, ExternalLink } from 'lucide-react';
import { Link } from 'react-router';
import { Reveal } from '@/components/Reveal';
import { NameHighlight } from '@/components/NameHighlight';
import { useLang } from '@/i18n/useLang';
import { UI } from '@/i18n/translations';
import { PUB_ITEMS } from '@/data/publications';
import { LINKS } from '@/data/content';
import { localePath } from '@/i18n/routing';
import type { Lang } from '@/i18n/lang';

/* A print-ready publications list. The on-screen page is a white A4-shaped
   sheet with a sticky action bar; @media print hides the site chrome and the
   bar, and the sheet itself becomes the document. The styled PDF is generated
   by scripts/gen-pdfs.mjs at release time. */
export default function PublicationsPdf() {
  const { lang } = useLang();
  const t = UI[lang];
  const otherLang: Lang = lang === 'fr' ? 'en' : 'fr';
  const pubs = PUB_ITEMS.filter((p) => p.type === 'publication').sort((a, b) => b.year - a.year);
  const blogs = PUB_ITEMS.filter((p) => p.type === 'blog').sort((a, b) => b.year - a.year);

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen">
      {/* hero — hidden when printing */}
      <section className="relative overflow-hidden bg-pine-950 print:hidden">
        <div className="absolute inset-0 texture-net" />
        <div className="absolute -top-40 -right-40 h-[560px] w-[560px] rounded-full bg-pine-600/25 blur-[130px]" />
        <div className="absolute bottom-0 -left-40 h-[460px] w-[460px] rounded-full bg-gold-600/12 blur-[120px]" />

        <div className="relative mx-auto max-w-6xl px-5 pb-24 pt-32 lg:px-8 lg:pt-36">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-300">
              <FileText size={13} />
              {t['pubPdf.badge']}
            </span>
            <h1 className="mt-7 font-display text-[2.6rem] leading-[1.05] font-medium text-pine-100 sm:text-6xl lg:text-[4.4rem]">
              {t['pubPdf.badge']} — <NameHighlight />
            </h1>
            <p className="mt-4 font-display text-lg italic text-pine-200/90 sm:text-xl">
              {t['pubPdf.intro']}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-pine-950 transition-all hover:-translate-y-0.5 hover:bg-gold-400"
              >
                <Printer size={15} /> {t['pubPdf.print']}
              </button>
              <a
                href="/publications/publications-fr.pdf"
                download
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-ivory transition-all hover:-translate-y-0.5 hover:border-gold-400 hover:text-gold-300"
              >
                <FileText size={15} /> {t['pubPdf.pdfFr']}
              </a>
              <a
                href="/publications/publications-en.pdf"
                download
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-ivory transition-all hover:-translate-y-0.5 hover:border-gold-400 hover:text-gold-300"
              >
                <FileText size={15} /> {t['pubPdf.pdfEn']}
              </a>
              <Link
                to={localePath(otherLang, '/publications-pdf')}
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-ivory transition-all hover:-translate-y-0.5 hover:border-gold-400 hover:text-gold-300"
              >
                {t['pubPdf.otherLang']}
              </Link>
            </div>
            <p className="mt-3 text-xs text-pine-100/55">{t['pubPdf.printHint']}</p>
          </Reveal>
        </div>
      </section>

      <section className="bg-pine-50 py-16 lg:py-20 print:bg-white print:py-0">
        <article className="cv-sheet mx-auto max-w-4xl rounded-3xl bg-white px-6 py-10 text-pine-900 shadow-card sm:px-12 lg:px-16 print:max-w-none print:rounded-none print:px-0 print:py-0 print:shadow-none">
          <header className="border-b-2 border-pine-900 pb-6">
            <h2 className="font-display text-3xl font-semibold tracking-tight">{t['pubPdf.title']}</h2>
            <p className="mt-2 font-display text-xl font-semibold">{t['name.full']}</p>
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[12px] text-pine-900/70">
              <li>{t['contact.location']}</li>
              <li>
                <a className="underline decoration-pine-900/30 underline-offset-2 hover:decoration-gold-500" href={`mailto:${t['contact.email']}`}>
                  {t['contact.email']}
                </a>
              </li>
              {LINKS.orcid && (
                <li>
                  <a className="underline decoration-pine-900/30 underline-offset-2 hover:decoration-gold-500" href={LINKS.orcid} target="_blank" rel="noreferrer">
                    ORCID: {LINKS.orcid.replace('https://orcid.org/', '')}
                  </a>
                </li>
              )}
              {LINKS.scholar && (
                <li>
                  <a className="underline decoration-pine-900/30 underline-offset-2 hover:decoration-gold-500" href={LINKS.scholar} target="_blank" rel="noreferrer">
                    Google Scholar
                  </a>
                </li>
              )}
              <li>
                <Link className="underline decoration-pine-900/30 underline-offset-2 hover:decoration-gold-500" to={localePath(lang, '/')}>
                  seynudedagnon.com
                </Link>
              </li>
            </ul>
          </header>

          {/* publications */}
          <section className="mt-8">
            <h2 className="border-b border-pine-900/25 pb-1.5 text-[12px] font-bold uppercase tracking-[0.24em] text-pine-900">
              {t['pubPdf.publications']}
            </h2>
            <div className="mt-3.5 space-y-3">
              {pubs.map((p) => (
                <p key={p.id} className="break-inside-avoid text-[11.5px] leading-relaxed text-pine-900/85">
                  <span className="font-medium">{p.authors[lang]}</span> ({p.year}).{' '}
                  <span className="italic">{p.title[lang]}</span>. {p.journal[lang]}.
                  {p.url && (
                    <span className="text-pine-900/65">
                      {' '}
                      {p.url.replace(/^https:\/\/(doi\.org|dx\.doi\.org)\//, 'DOI: ').replace(/^https:\/\/(www\.)?/, '')}
                    </span>
                  )}
                </p>
              ))}
            </div>
          </section>

          {/* blog posts / opinion pieces */}
          {blogs.length > 0 && (
            <section className="mt-8">
              <h2 className="border-b border-pine-900/25 pb-1.5 text-[12px] font-bold uppercase tracking-[0.24em] text-pine-900">
                {t['pubPdf.blogPosts']}
              </h2>
              <div className="mt-3.5 space-y-3">
                {blogs.map((p) => (
                  <p key={p.id} className="break-inside-avoid text-[11.5px] leading-relaxed text-pine-900/85">
                    <span className="font-medium">{p.authors[lang]}</span> ({p.year}).{' '}
                    <span className="italic">{p.title[lang]}</span>. {p.journal[lang]}.
                    {p.url && (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={t['pubPage.readPost']}
                        className="ml-1 inline-flex items-center gap-0.5 text-gold-700 hover:text-gold-500 print:text-pine-900/65 print:no-underline"
                      >
                        <ExternalLink size={10} />
                      </a>
                    )}
                  </p>
                ))}
              </div>
            </section>
          )}

          <p className="mt-8 border-t border-pine-900/15 pt-4 text-[11.5px] italic text-pine-900/65">
            {t['pubPdf.generated']}
          </p>
        </article>
      </section>
    </main>
  );
}
