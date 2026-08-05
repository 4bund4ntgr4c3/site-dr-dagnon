import { Link } from 'react-router';
import { Accessibility, Keyboard, Search, Contrast, Ear, Captions, MessageCircle, ArrowUpRight } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { useLang } from '@/i18n/useLang';
import { UI } from '@/i18n/translations';
import { localePath } from '@/i18n/routing';
import { ACCESSIBILITY_SECTIONS, ACCESSIBILITY_LAST_UPDATED } from '@/data/accessibility';

const SECTION_ICONS = [Accessibility, Keyboard, Search, Contrast, Ear, Captions, MessageCircle];

export default function AccessibilityPage() {
  const { lang } = useLang();
  const t = UI[lang];

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen">
      <section className="relative overflow-hidden bg-pine-950">
        <div className="absolute inset-0 texture-net" />
        <div className="absolute -top-40 -right-40 h-[560px] w-[560px] rounded-full bg-pine-600/25 blur-[130px]" />
        <div className="absolute bottom-0 -left-40 h-[460px] w-[460px] rounded-full bg-gold-600/12 blur-[120px]" />

        <div className="relative mx-auto max-w-4xl px-5 pb-24 pt-32 lg:px-8 lg:pt-36">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-300">
              <Accessibility size={13} />
              {t['accessibilityPage.badge']}
            </span>
            <h1 className="mt-7 font-display text-[2.6rem] leading-[1.05] font-medium text-pine-100 sm:text-6xl lg:text-[4.4rem]">
              {t['accessibilityPage.title']}
            </h1>
            <p className="mt-4 max-w-2xl font-display text-lg italic text-pine-200/90 sm:text-xl">
              {t['accessibilityPage.intro']}
            </p>
            <p className="mt-6 text-[12.5px] uppercase tracking-[0.2em] text-pine-100/70">
              {t['accessibilityPage.updated']} {ACCESSIBILITY_LAST_UPDATED}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-ivory py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-5 lg:px-8">
          <div className="space-y-10">
            {ACCESSIBILITY_SECTIONS.map((section, i) => {
              const Icon = SECTION_ICONS[i % SECTION_ICONS.length];
              return (
                <Reveal key={section.id} delay={0.05 + i * 0.05}>
                  <article className="rounded-2xl border border-pine-900/10 bg-white p-7 shadow-card lg:p-9">
                    <h2 className="flex items-center gap-3 font-display text-xl font-semibold text-pine-950 sm:text-2xl">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-500 text-pine-950">
                        <Icon size={18} />
                      </span>
                      {section.title[lang]}
                    </h2>
                    <div className="mt-5 space-y-3.5">
                      {section.body[lang].map((paragraph, j) => (
                        <p key={j} className="text-[14.5px] leading-relaxed text-ink/80">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={0.2}>
            <div className="mt-12 text-center">
              <Link
                to={localePath(lang, '/contact')}
                className="inline-flex items-center gap-2 rounded-full bg-pine-950 px-7 py-3.5 text-sm font-semibold text-gold-400 transition-all hover:-translate-y-0.5 hover:bg-pine-900"
              >
                {t['accessibilityPage.contactCta']}
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
