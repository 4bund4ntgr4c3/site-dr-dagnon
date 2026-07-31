import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { useLang } from '@/i18n/useLang';
import { UI } from '@/i18n/translations';
import { localePath } from '@/i18n/routing';

/* Branded 404 view, shared by the catch-all route (App) and by the Media
   page when a category path does not exist. The background mirrors the Hero
   so an error page feels like part of the site instead of a fallback. */
export function NotFoundView({ backHref = '/' }: { backHref?: string }) {
  const { lang } = useLang();
  const t = UI[lang];
  return (
    <main
      id="main-content"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-pine-950 px-5 py-28 text-center"
    >
      <div className="absolute inset-0 texture-net" />
      <div className="absolute -top-40 -right-40 h-[560px] w-[560px] rounded-full bg-pine-600/25 blur-[130px]" />
      <div className="absolute bottom-0 -left-40 h-[460px] w-[460px] rounded-full bg-gold-600/12 blur-[120px]" />

      <div className="relative">
        <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-300">
          <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
          {t['notFound.eyebrow']}
        </span>

        <p
          aria-hidden="true"
          className="mt-6 select-none font-display text-[6.5rem] font-semibold leading-none text-gold-400/90 sm:text-[9rem]"
        >
          404
        </p>

        <h1 className="mt-4 font-display text-2xl font-medium text-ivory sm:text-3xl">
          {t['notFound.title']}
        </h1>

        <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-pine-100/75 sm:text-base">
          {t['notFound.hint']}
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-5 sm:flex-row">
          <Link
            to={localePath(lang, backHref)}
            className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-pine-950 transition-all hover:-translate-y-0.5 hover:bg-gold-400"
          >
            <ArrowLeft size={16} />
            {t['notFound.back']}
          </Link>
          <Link
            to={localePath(lang, '/contact')}
            className="text-sm font-medium text-pine-100/70 underline-offset-4 transition-colors hover:text-gold-300 hover:underline"
          >
            {t['notFound.contact']}
          </Link>
        </div>
      </div>
    </main>
  )
}
