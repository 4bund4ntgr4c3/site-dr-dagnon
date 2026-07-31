import { Link } from 'react-router';
import { Linkedin, Youtube, FileText } from 'lucide-react';
import { AfricaMap } from '@/components/AfricaMap';
import { Reveal } from '@/components/Reveal';
import { NewsletterForm } from '@/components/NewsletterForm';
import { LINKS } from '@/data/content';
import { useLang } from '@/i18n/useLang';
import { NAV, UI } from '@/i18n/translations';
import { navHref } from '@/lib/nav';
import { localePath } from '@/i18n/routing';

/* Mirrors the header's page-level bar links (same items, same hrefs) — the
   one thing intentionally missing is the Home dropdown's section submenu. */
const BAR_EXCLUDED = ['apropos', 'expertise', 'parcours', 'formation', 'realisations'];

export function Footer() {
  const { lang } = useLang();
  const t = UI[lang];

  return (
    <footer id="contact" className="relative overflow-hidden bg-pine-950">
      <div className="absolute inset-0 texture-net opacity-70" />
      <div className="relative mx-auto max-w-7xl px-5 pb-12 pt-24 lg:px-8 lg:pt-32">
        {/* CTA */}
        <Reveal>
          <div className="grid items-center gap-10 border-b border-white/5 pb-16 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-400 gold-text">{t['footer.eyebrow']}</p>
              <h2 className="mt-4 font-display text-3xl font-medium leading-tight text-ivory sm:text-4xl lg:text-[3rem]">
                {t['footer.title1']}
                <br />
                <span className="italic text-gold-400 gold-text">{t['footer.title2']}</span>.
              </h2>
              <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-pine-100/65">
                {t['footer.text']}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href={LINKS.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2.5 rounded-full bg-gold-500 px-7 py-3.5 text-sm font-semibold text-pine-950 transition-all hover:-translate-y-0.5 hover:bg-gold-400"
                >
                  <Linkedin size={17} /> {t['footer.linkedin']}
                </a>
                <a
                  href={LINKS.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2.5 rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold text-ivory transition-all hover:-translate-y-0.5 hover:border-gold-400 hover:text-gold-300"
                >
                  <Youtube size={17} /> {t['footer.youtube']}
                </a>
                <Link
                  to={localePath(lang, '/cv')}
                  className="inline-flex items-center gap-2.5 rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold text-ivory transition-all hover:-translate-y-0.5 hover:border-gold-400 hover:text-gold-300"
                >
                  <FileText size={17} /> {t['cvPage.download']}
                </Link>
              </div>
            </div>
            <div className="hidden justify-end lg:flex">
              <AfricaMap className="w-64 opacity-80" />
            </div>
          </div>
        </Reveal>

        {/* newsletter strip */}
        <div className="flex flex-col items-center justify-between gap-6 border-b border-white/5 py-10 lg:flex-row">
          <div className="text-center lg:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-400 gold-text">{t['newsletter.eyebrow']}</p>
            <p className="mt-1.5 max-w-md text-[15px] text-pine-100/65">{t['newsletter.footerText']}</p>
          </div>
          <div className="w-full sm:w-auto sm:min-w-[26rem]">
            <NewsletterForm compact />
          </div>
        </div>

        {/* bottom bar */}
        <div className="flex flex-col items-center justify-between gap-6 pt-10 md:flex-row">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-500 font-display text-sm font-semibold text-pine-950">
              SD
            </span>
            <div className="leading-tight">
              <p className="font-display text-sm font-medium text-ivory">{t['name.full']}</p>
              <p className="text-[10.5px] uppercase tracking-[0.2em] text-pine-100/50">{t['footer.tagline']}</p>
            </div>
          </div>

          <nav aria-label={t['footerNav.ariaLabel']} className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {NAV[lang].filter((item) => !BAR_EXCLUDED.includes(item.id)).map((item) => (
              <Link
                key={item.id}
                to={navHref(lang, item.id)}
                className="text-[12.5px] font-medium text-pine-100/60 transition-colors hover:text-gold-400"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to={localePath(lang, '/presse')}
              className="text-[12.5px] font-medium text-pine-100/60 transition-colors hover:text-gold-400"
            >
              {t['footer.linkPresse']}
            </Link>
            <Link
              to={localePath(lang, '/inviter')}
              className="text-[12.5px] font-medium text-pine-100/60 transition-colors hover:text-gold-400"
            >
              {t['footer.linkInviter']}
            </Link>
            <Link
              to={localePath(lang, '/newsletter')}
              className="text-[12.5px] font-medium text-pine-100/60 transition-colors hover:text-gold-400"
            >
              {t['footer.linkNewsletter']}
            </Link>
          </nav>

          <p className="text-[12px] text-pine-100/50">
            {t['footer.rights']}
          </p>
        </div>
      </div>
    </footer>
  );
}
