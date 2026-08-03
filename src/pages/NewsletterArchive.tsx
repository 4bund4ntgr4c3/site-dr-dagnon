import { useState } from 'react';
import { Link } from 'react-router';
import { Mail, ArrowUpRight, CalendarDays, BookOpen, Bell, ChevronDown } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { PushButton } from '@/components/PushButton';
import { useLang } from '@/i18n/useLang';
import { UI } from '@/i18n/translations';
import { localePath } from '@/i18n/routing';
import { NEWSLETTER_ISSUES, type NewsletterIssue } from '@/data/newsletters';

function IssueCard({ issue, i }: { issue: NewsletterIssue; i: number }) {
  const { lang } = useLang();
  const t = UI[lang];
  const [open, setOpen] = useState(false);
  const excerpt = issue.excerpt?.[lang];

  return (
    <Reveal delay={Math.min(i * 0.05, 0.3)}>
      <article className="group flex flex-col gap-4 rounded-2xl border border-pine-900/10 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/40">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-pine-950 text-gold-400">
            <BookOpen size={22} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="inline-flex items-center gap-1.5 text-[11.5px] text-pine-900/80">
              <CalendarDays size={12} />
              {t['newsletterPage.issueDate']}{' '}
              {new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }).format(new Date(`${issue.date}T00:00:00Z`))}
            </p>
            <h2 className="mt-1 font-display text-[1.15rem] font-semibold leading-snug text-pine-900">
              {issue.title[lang]}
            </h2>
            <p className="mt-1.5 text-[13px] leading-relaxed text-pine-900/70 line-clamp-2">
              {issue.summary[lang]}
            </p>
          </div>
          <a
            href={issue.link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-pine-900/15 px-5 py-2.5 text-[12.5px] font-semibold text-pine-900 transition-all hover:border-gold-500/50 hover:text-gold-700"
          >
            {t['newsletterPage.issueRead']}
            <ArrowUpRight size={14} />
          </a>
        </div>
        {excerpt && (
          <div className="border-t border-pine-900/10 pt-4">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-gold-700 transition-colors hover:text-gold-500"
            >
              {open ? t['newsletterPage.excerptHide'] : t['newsletterPage.excerpt']}
              <ChevronDown
                size={14}
                className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
              />
            </button>
            {open && (
              <p className="mt-3 whitespace-pre-line text-[13.5px] leading-relaxed text-pine-900/75">
                {excerpt}
              </p>
            )}
          </div>
        )}
      </article>
    </Reveal>
  );
}

export default function NewsletterArchive() {
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
              <Mail size={13} />
              {t['newsletterPage.badge']}
            </span>
            <h1 className="mt-7 font-display text-[2.6rem] leading-[1.05] font-medium text-pine-100 sm:text-6xl lg:text-[4.4rem]">
              {t['newsletterPage.title']}
            </h1>
            <p className="mt-4 max-w-2xl font-display text-lg italic text-pine-200/90 sm:text-xl">
              {t['newsletterPage.intro']}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-pine-50 py-16 lg:py-20">
        <div className="mx-auto max-w-4xl px-5 lg:px-8">
          {NEWSLETTER_ISSUES.length > 0 ? (
            <div className="space-y-4">
              {NEWSLETTER_ISSUES.map((issue, i) => (
                <IssueCard key={issue.id} issue={issue} i={i} />
              ))}
            </div>
          ) : (
            <Reveal>
              <div className="flex flex-col items-center justify-center gap-5 rounded-2xl border border-dashed border-pine-900/15 bg-white px-6 py-16 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pine-950 text-gold-400">
                  <Mail size={24} />
                </span>
                <p className="max-w-md text-sm leading-relaxed text-pine-900/70">{t['newsletterPage.empty']}</p>
                <Link
                  to={`${localePath(lang, '/')}#newsletter`}
                  className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-pine-950 transition-all hover:-translate-y-0.5 hover:bg-gold-400"
                >
                  {t['newsletterPage.subscribe']}
                  <ArrowUpRight size={15} />
                </Link>
              </div>
            </Reveal>
          )}

          <Reveal>
            <div className="mt-10 rounded-2xl border border-pine-900/10 bg-white p-6 shadow-card">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pine-950 text-gold-400">
                  <Bell size={19} />
                </span>
                <div>
                  <h2 className="font-display text-base font-semibold text-pine-900">{t['push.title']}</h2>
                  <p className="text-[12px] text-pine-900/80">
                    {t['newsletterPage.subscribe']} — {t['newsletter.privacy']}
                  </p>
                </div>
              </div>
              <PushButton />
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
