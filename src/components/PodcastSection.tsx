import { Headphones, Rss, Play, ExternalLink } from 'lucide-react';
import { Link } from 'react-router';
import { useLang } from '@/i18n/useLang';
import { localePath } from '@/i18n/routing';
import { TRIBUNES } from '@/data/tribunes';

export function PodcastSection() {
  const { lang } = useLang();
  const latest = [...TRIBUNES].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);

  return (
    <div className="rounded-2xl border border-pine-900/10 bg-white p-6 shadow-card sm:p-7">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-pine-600">
        <Headphones size={14} /> {lang === 'fr' ? 'Podcast & audio' : 'Podcast & audio'}
      </p>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
        <h3 className="font-display text-xl font-semibold text-pine-950">
          {lang === 'fr' ? 'Écoutez les tribunes' : 'Listen to the op-eds'}
        </h3>
        <a
          href="/podcast.xml"
          className="inline-flex items-center gap-1.5 rounded-full bg-pine-950 px-3.5 py-1.5 text-xs font-semibold text-gold-400 hover:bg-pine-900"
        >
          <Rss size={12} /> RSS
        </a>
      </div>
      <p className="mt-2 text-sm text-pine-900/65">
        {lang === 'fr' ? 'Chaque tribune est lue à voix haute sur la page article — le flux RSS expose les épisodes pour Apple/Spotify.' : 'Each op-ed is read aloud on its article page — the RSS feed exposes episodes for Apple/Spotify.'}
      </p>
      <div className="mt-5 grid gap-3">
        {latest.map((t) => (
          <Link
            key={t.slug}
            to={localePath(lang, `/tribunes/${t.slug}`)}
            className="group flex items-center gap-3 rounded-xl border border-pine-900/5 bg-pine-50 px-4 py-3 transition-colors hover:border-gold-500/30 hover:bg-white"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-500 text-pine-950">
              <Play size={14} className="ml-0.5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-pine-950 group-hover:text-gold-700">{t.title[lang]}</span>
              <span className="block text-xs text-pine-900/60">{t.date} · {t.source.name}</span>
            </span>
            <ExternalLink size={14} className="shrink-0 text-pine-900/25 group-hover:text-gold-600" />
          </Link>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-pine-900/50">
        {lang === 'fr' ? 'Flux : /podcast.xml (RSS 2.0 + iTunes). Généré à chaque build.' : 'Feed: /podcast.xml (RSS 2.0 + iTunes). Generated on each build.'}
      </p>
    </div>
  );
}
