import { Headphones, Rss, Play, ExternalLink, Mic } from 'lucide-react';
import { Link } from 'react-router';
import { useLang } from '@/i18n/useLang';
import { localePath } from '@/i18n/routing';
import { TRIBUNES } from '@/data/tribunes';

export function PodcastSection() {
  const { lang } = useLang();
  const latest = [...TRIBUNES].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
  const isFr = lang === 'fr';

  return (
    <div className="rounded-2xl border border-pine-900/10 bg-white p-6 shadow-card sm:p-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-pine-600">
          <Headphones size={15} /> {isFr ? 'Podcast & audio' : 'Podcast & audio'}
        </p>
        <a
          href="/podcast.xml"
          className="inline-flex items-center gap-1.5 rounded-full bg-pine-950 px-3.5 py-1.5 text-xs font-semibold text-gold-400 transition-colors hover:bg-pine-900"
          title={isFr ? 'Flux RSS du podcast' : 'Podcast RSS Feed'}
        >
          <Rss size={12} /> RSS
        </a>
      </div>

      <h3 className="mt-3 font-display text-2xl font-semibold text-pine-950 sm:text-[1.65rem]">
        {isFr ? 'Podcasts & Tribunes audio' : 'Podcasts & Audio Op-eds'}
      </h3>
      <p className="mt-1 text-sm text-pine-900/70">
        {isFr
          ? 'Découvrez les entretiens podcast du Dr. Dagnon ainsi que la lecture audio de ses tribunes.'
          : 'Discover Dr. Dagnon’s podcast interviews along with audio versions of his op-eds.'}
      </p>

      {/* Featured Podcast Highlight */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-gold-500/30 bg-gradient-to-br from-pine-950 to-pine-900 text-ivory shadow-lg">
        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6">
          {/* Thumbnail with play badge */}
          <a
            href="https://www.youtube.com/watch?v=IenUdkxFqNE"
            target="_blank"
            rel="noreferrer"
            className="group relative aspect-video w-full shrink-0 overflow-hidden rounded-xl bg-pine-900 sm:w-52"
          >
            <img
              src="https://img.youtube.com/vi/IenUdkxFqNE/hqdefault.jpg"
              alt="Episode 5 Ndep - L’espoir dans la lutte contre le paludisme"
              width={320}
              height={180}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-pine-950/40 transition-colors group-hover:bg-pine-950/20" />
            <span className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gold-500 text-pine-950 shadow-xl transition-transform duration-300 group-hover:scale-110">
              <Play size={18} className="ml-0.5" fill="currentColor" />
            </span>
          </a>

          {/* Podcast Info */}
          <div className="flex flex-1 flex-col">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-500/20 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-gold-300 ring-1 ring-gold-500/30">
                <Mic size={11} /> {isFr ? 'Podcast invité' : 'Guest Podcast'}
              </span>
              <span className="text-xs text-pine-200/60">
                {isFr ? '25 août 2026 · Ndëp' : 'August 25, 2026 · Ndëp'}
              </span>
            </div>

            <h4 className="mt-2 font-display text-lg font-semibold leading-snug text-white group-hover:text-gold-300">
              {isFr
                ? 'Épisode 5 Ndëp — L’espoir dans la lutte contre le paludisme'
                : 'Ndëp Podcast (Episode 5) — Hope in the fight against malaria'}
            </h4>

            <p className="mt-1.5 text-xs leading-relaxed text-pine-100/80">
              {isFr
                ? 'Entretien approfondi avec le Dr. Seynudé Jean-Fortuné Dagnon sur les avancées, le financement et les perspectives d’élimination du paludisme en Afrique.'
                : 'In-depth conversation with Dr. Seynudé Jean-Fortuné Dagnon on progress, health financing, and elimination pathways for malaria across Africa.'}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <a
                href="https://www.youtube.com/watch?v=IenUdkxFqNE"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-4 py-2 text-xs font-bold text-pine-950 transition-transform hover:scale-105 hover:bg-gold-400"
              >
                <Play size={13} fill="currentColor" />
                {isFr ? 'Écouter l’épisode' : 'Listen to episode'}
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Tribunes audio read-aloud */}
      <div className="mt-7 border-t border-pine-900/10 pt-6">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-bold uppercase tracking-wider text-pine-700">
            {isFr ? 'Lectures audio des tribunes' : 'Audio op-ed readings'}
          </p>
          <span className="text-[11px] text-pine-900/50">
            {isFr ? 'Flux RSS 2.0 + Apple/Spotify' : 'RSS 2.0 + Apple/Spotify feed'}
          </span>
        </div>

        <div className="mt-3 grid gap-2.5">
          {latest.map((t) => (
            <Link
              key={t.slug}
              to={localePath(lang, `/tribunes/${t.slug}`)}
              className="group flex items-center gap-3 rounded-xl border border-pine-900/5 bg-pine-50 px-4 py-2.5 transition-colors hover:border-gold-500/30 hover:bg-white"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-500 text-pine-950 transition-transform group-hover:scale-105">
                <Play size={12} className="ml-0.5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-pine-950 group-hover:text-gold-700">
                  {t.title[lang]}
                </span>
                <span className="block text-xs text-pine-900/60">
                  {t.date} · {t.source.name}
                </span>
              </span>
              <ExternalLink size={13} className="shrink-0 text-pine-900/25 group-hover:text-gold-600" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
