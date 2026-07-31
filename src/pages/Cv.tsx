import type { ReactNode } from 'react';
import { Printer } from 'lucide-react';
import { Link } from 'react-router';
import { useLang } from '@/i18n/useLang';
import { UI, IDENTITY, EXPERIENCE, EDUCATION, TEACHING_LIST, TRAINING_LIST, AWARDS } from '@/i18n/translations';
import { PUB_ITEMS } from '@/data/publications';
import { LINKS } from '@/data/content';
import { localePath } from '@/i18n/routing';
import type { Lang } from '@/i18n/lang';

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-8 first:mt-0">
      <h2 className="border-b border-pine-900/25 pb-1.5 text-[12px] font-bold uppercase tracking-[0.24em] text-pine-900">
        {title}
      </h2>
      <div className="mt-3.5">{children}</div>
    </section>
  );
}

/* A print-ready curriculum vitae. The on-screen page is a white A4-shaped
   sheet with a sticky action bar; @media print (see index.css) hides the
   site chrome and the bar, and the sheet itself becomes the document. */
export default function Cv() {
  const { lang } = useLang();
  const t = UI[lang];
  const otherLang: Lang = lang === 'fr' ? 'en' : 'fr';
  const [role, focus, scope, languages] = IDENTITY[lang];
  const education = EDUCATION[lang].slice(0, 3);
  const pubs = PUB_ITEMS.filter((p) => p.type === 'publication')
    .sort((a, b) => b.year - a.year)
    .slice(0, 8);

  return (
    <main id="main-content" className="min-h-screen bg-pine-50 pb-16 pt-24 lg:pt-28 print:bg-white print:pb-0 print:pt-0">
      {/* action bar — screen only, never printed */}
      <div className="mx-auto mb-6 max-w-4xl px-5 print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-pine-900/10 bg-white p-4 shadow-lg shadow-pine-900/8">
          <p className="text-sm font-semibold text-pine-900">{t['cvPage.title']}</p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to={localePath(otherLang, '/cv')}
              className="rounded-full border border-pine-900/15 px-4 py-2 text-[13px] font-semibold text-pine-900 transition-colors hover:border-gold-500 hover:text-gold-700"
            >
              {t['cvPage.otherLang']}
            </Link>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-5 py-2.5 text-[13px] font-semibold text-pine-950 transition-all hover:-translate-y-0.5 hover:bg-gold-400"
            >
              <Printer size={15} /> {t['cvPage.print']}
            </button>
          </div>
        </div>
        <p className="mt-2 text-xs text-pine-900/55">{t['cvPage.printHint']}</p>
      </div>

      {/* the document — one white sheet */}
      <article className="cv-sheet mx-auto max-w-4xl rounded-3xl bg-white px-6 py-10 text-pine-900 shadow-[0_24px_80px_-50px_rgba(2,36,32,0.55)] sm:px-12 lg:px-16 print:max-w-none print:rounded-none print:px-0 print:py-0 print:shadow-none">
        <header className="border-b-2 border-pine-900 pb-6">
          <h1 className="font-display text-3xl font-semibold tracking-tight">{t['cvPage.title']}</h1>
          <p className="mt-2 font-display text-xl font-semibold">{t['name.full']}</p>
          <p className="mt-1 text-[13px] font-medium italic text-pine-900/75">{role.text}</p>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[12px] text-pine-900/70">
            <li>{t['contact.location']}</li>
            <li>
              <a
                className="underline decoration-pine-900/30 underline-offset-2 hover:decoration-gold-500"
                href={`mailto:${t['contact.email']}`}
              >
                {t['contact.email']}
              </a>
            </li>
            <li>
              <a
                className="underline decoration-pine-900/30 underline-offset-2 hover:decoration-gold-500"
                href={LINKS.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                {LINKS.linkedin.replace(/^https?:\/\/(www\.)?/, '')}
              </a>
            </li>
            <li>
              <Link className="underline decoration-pine-900/30 underline-offset-2 hover:decoration-gold-500" to={localePath(lang, '/')}>
                seynudedagnon.com
              </Link>
            </li>
          </ul>
        </header>

        <Section title={t['cvPage.profile']}>
          <div className="grid gap-x-8 gap-y-2.5 sm:grid-cols-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-pine-900/55">{role.title}</p>
              <p className="mt-1 text-[12.5px] leading-snug">{role.text}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-pine-900/55">{focus.title}</p>
              <p className="mt-1 text-[12.5px] leading-snug">{focus.text}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-pine-900/55">{scope.title}</p>
              <p className="mt-1 text-[12.5px] leading-snug">{scope.text}</p>
            </div>
          </div>
        </Section>

        <Section title={t['cvPage.experience']}>
          <div className="space-y-5">
            {EXPERIENCE[lang].map((e) => (
              <div key={e.org + e.period} className="break-inside-avoid">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
                  <h3 className="font-display text-[15px] font-semibold leading-snug">{e.role}</h3>
                  <span className="text-[11.5px] font-semibold text-pine-900/60">{e.period}</span>
                </div>
                <p className="text-[12.5px] font-semibold text-gold-700">{e.org}</p>
                <p className="mt-1 text-[12.5px] leading-relaxed text-pine-900/80">{e.text}</p>
                <ul className="mt-1.5 list-disc space-y-1 pl-4 text-[12px] leading-relaxed text-pine-900/75">
                  {e.details.responsibilities.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
                {e.details.projects && e.details.projects.length > 0 && (
                  <p className="mt-1.5 text-[11.5px] leading-relaxed text-pine-900/65">
                    <span className="font-semibold text-pine-900/80">{t['cvPage.projects']} :</span>{' '}
                    {e.details.projects
                      .map((p) => `${p.name} (${p.scope}${p.budget ? ` · ${p.budget}` : ''})`)
                      .join(' — ')}
                  </p>
                )}
                {e.details.achievement && (
                  <p className="mt-1 text-[11.5px] italic text-pine-900/65">{e.details.achievement}</p>
                )}
              </div>
            ))}
          </div>
        </Section>

        <Section title={t['cvPage.education']}>
          <div className="space-y-2.5">
            {education.map((ed) => (
              <div key={ed.degree} className="break-inside-avoid flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
                <div>
                  <h3 className="text-[13px] font-semibold">{ed.degree}</h3>
                  <p className="text-[12px] text-pine-900/70">{ed.school}</p>
                </div>
                <span className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-pine-900/55">{ed.tag}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title={t['cvPage.languages']}>
          <p className="text-[12.5px]">{languages.text}</p>
        </Section>

        <Section title={t['cvPage.teaching']}>
          <ul className="space-y-1.5">
            {TEACHING_LIST[lang].map((te) => (
              <li key={te.date + te.institution} className="break-inside-avoid text-[12px] leading-relaxed text-pine-900/80">
                <span className="font-semibold text-pine-900">{te.date}</span> —{' '}
                <span className="font-medium text-pine-900/90">{te.institution}</span> — {te.detail}
              </li>
            ))}
          </ul>
        </Section>

        <Section title={t['cvPage.training']}>
          <div className="grid gap-x-8 gap-y-1.5 sm:grid-cols-2">
            {TRAINING_LIST[lang].map((tr) => (
              <p key={tr.date + tr.institution} className="break-inside-avoid text-[11.5px] leading-snug text-pine-900/80">
                <span className="font-semibold text-pine-900">{tr.date}</span> — {tr.institution}
                <span className="text-pine-900/65"> — {tr.detail}</span>
              </p>
            ))}
          </div>
        </Section>

        <Section title={t['cvPage.awards']}>
          <div className="space-y-2.5">
            {AWARDS[lang].map((a) => (
              <div key={a.year + a.title} className="break-inside-avoid">
                <p className="text-[12.5px] leading-snug">
                  <span className="font-bold text-gold-700">{a.year}</span>{' '}
                  <span className="font-semibold">{a.title}</span>
                </p>
                <p className="mt-0.5 text-[11.5px] leading-relaxed text-pine-900/70">{a.description}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title={t['cvPage.publications']}>
          <div className="space-y-2">
            {pubs.map((p) => (
              <p key={p.id} className="break-inside-avoid text-[11.5px] leading-relaxed text-pine-900/85">
                <span className="font-medium">{p.authors[lang]}</span> ({p.year}).{' '}
                <span className="italic">{p.title[lang]}</span>. {p.journal[lang]}.
                {p.url && (
                  <span className="text-pine-900/55">
                    {' '}
                    {p.url.replace(/^https:\/\/(doi\.org|dx\.doi\.org)\//, '').replace(/^https:\/\/(www\.)?/, '')}
                  </span>
                )}
              </p>
            ))}
          </div>
        </Section>

        <p className="mt-8 border-t border-pine-900/15 pt-4 text-[11.5px] italic text-pine-900/55">
          {t['cvPage.refs']}
        </p>
      </article>
    </main>
  );
}
