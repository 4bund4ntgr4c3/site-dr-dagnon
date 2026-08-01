import { Link } from 'react-router';
import { Newspaper, Download, Mail, FileText, Image as ImageIcon, Phone } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { useLang } from '@/i18n/useLang';
import { UI } from '@/i18n/translations';
import { localePath } from '@/i18n/routing';
import { STATS } from '@/data/site';

export default function PressKit() {
  const { lang } = useLang();
  const t = UI[lang];

  return (
    <main id="main-content" className="min-h-screen">
      <section className="relative overflow-hidden bg-pine-950">
        <div className="absolute inset-0 texture-net" />
        <div className="absolute -top-40 -right-40 h-[560px] w-[560px] rounded-full bg-pine-600/25 blur-[130px]" />
        <div className="absolute bottom-0 -left-40 h-[460px] w-[460px] rounded-full bg-gold-600/12 blur-[120px]" />

        <div className="relative mx-auto max-w-6xl px-5 pb-24 pt-32 lg:px-8 lg:pt-36">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-300">
              <Newspaper size={13} />
              {t['pressePage.badge']}
            </span>
            <h1 className="mt-7 font-display text-[2.6rem] leading-[1.05] font-medium text-pine-100 sm:text-6xl lg:text-[4.4rem]">
              {t['pressePage.title']}
            </h1>
            <p className="mt-4 max-w-2xl font-display text-lg italic text-pine-200/90 sm:text-xl">
              {t['pressePage.intro']}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-pine-50 py-16 lg:py-20">
        <div className="mx-auto max-w-6xl space-y-16 px-5 lg:px-8">
          <Reveal>
            <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-start">
              <div>
                <h2 className="font-display text-2xl font-semibold text-pine-900">{t['pressePage.bioTitle']}</h2>
                <p className="mt-4 text-[15px] leading-[1.85] text-pine-900/85">{t['pressePage.bioText']}</p>
              </div>
              <figure className="overflow-hidden rounded-2xl border border-pine-900/10 bg-white shadow-card">
                <img
                  src="/dr-seynude-dagnon.webp"
                  alt="Dr. Seynudé Jean-Fortuné Dagnon"
                  className="aspect-[4/5] w-full object-cover"
                />
                <figcaption className="flex items-center justify-between gap-3 p-4">
                  <span className="text-[12px] text-pine-900/70">{t['pressePage.photoTitle']}</span>
                  <a
                    href="/dr-seynude-dagnon.webp"
                    download="dr-seynude-dagnon.webp"
                    className="inline-flex items-center gap-1.5 rounded-full bg-gold-500 px-4 py-2 text-[12px] font-semibold text-pine-950 transition-all hover:-translate-y-0.5 hover:bg-gold-400"
                  >
                    <Download size={13} />
                    {t['pressePage.photoCta']}
                  </a>
                </figcaption>
              </figure>
            </div>
          </Reveal>

          <Reveal>
            <h2 className="font-display text-2xl font-semibold text-pine-900">{t['pressePage.factsTitle']}</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {STATS[lang].map((s, i) => (
                <div key={i} className="rounded-2xl border border-gold-500/30 bg-gold-500/10 p-6">
                  <p className="font-display text-[1.9rem] leading-tight font-semibold text-gold-700">
                    {s.value}
                    {s.suffix}
                  </p>
                  <p className="mt-1 text-[12.5px] font-semibold text-pine-900/80">{s.label}</p>
                  <p className="mt-1 text-[12px] leading-relaxed text-ink/70">{s.detail}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-2xl border border-pine-900/10 bg-white p-6 shadow-card">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pine-950 text-gold-400">
                  <ImageIcon size={19} />
                </span>
                <h3 className="mt-4 font-display text-[1.1rem] font-semibold text-pine-900">
                  {t['pressePage.photoTitle']}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-pine-900/70">{t['pressePage.photoText']}</p>
                <a
                  href="/dr-seynude-dagnon.webp"
                  download="dr-seynude-dagnon.webp"
                  className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-gold-700 transition-colors hover:text-gold-500"
                >
                  <Download size={13} />
                  {t['pressePage.photoCta']}
                </a>
              </div>

              <div className="rounded-2xl border border-pine-900/10 bg-white p-6 shadow-card">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pine-950 text-gold-400">
                  <FileText size={19} />
                </span>
                <h3 className="mt-4 font-display text-[1.1rem] font-semibold text-pine-900">{t['cvPage.badge']}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-pine-900/70">
                  {lang === 'fr'
                    ? 'Parcours complet, formations, distinctions et publications — imprimable en PDF.'
                    : 'Full career, education, awards and publications — print-ready.'}
                </p>
                <Link
                  to={localePath(lang, '/cv')}
                  className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-gold-700 transition-colors hover:text-gold-500"
                >
                  <FileText size={13} />
                  {t['pressePage.cvCta']}
                </Link>
              </div>

              <div className="rounded-2xl border border-gold-500/40 bg-white p-6 shadow-card">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pine-950 text-gold-400">
                  <Mail size={19} />
                </span>
                <h3 className="mt-4 font-display text-[1.1rem] font-semibold text-pine-900">
                  {t['pressePage.contactTitle']}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-pine-900/70">{t['pressePage.contactText']}</p>
                <Link
                  to={`${localePath(lang, '/contact')}?type=press`}
                  className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-gold-700 transition-colors hover:text-gold-500"
                >
                  <Phone size={13} />
                  {t['pressePage.contactCta']}
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
