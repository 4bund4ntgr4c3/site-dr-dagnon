import { WifiOff, Search, Image as ImageIcon, FileText, Download } from 'lucide-react';
import { Link } from 'react-router';
import { Reveal } from '@/components/Reveal';
import { useLang } from '@/i18n/useLang';
import { localePath } from '@/i18n/routing';

export default function Offline() {
  const { lang } = useLang();
  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen">
      <section className="relative overflow-hidden bg-pine-950">
        <div className="absolute inset-0 texture-net" />
        <div className="relative mx-auto max-w-3xl px-5 pb-24 pt-32 lg:px-8 lg:pt-36 text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-300">
              <WifiOff size={13} /> Offline
            </span>
            <h1 className="mt-7 font-display text-3xl font-medium text-pine-100 sm:text-4xl">
              {lang === 'fr' ? 'Vous êtes hors-ligne' : 'You are offline'}
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-pine-200/80">
              {lang === 'fr' ? 'Le contenu mis en cache reste disponible : recherche, pages, CV et médias déjà visités.' : 'Cached content stays available: search, pages, CV and already-visited media.'}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-ivory py-12 lg:py-16">
        <div className="mx-auto max-w-3xl space-y-6 px-5 lg:px-8">
          <Reveal>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { icon: Search, title: lang === 'fr' ? 'Recherche' : 'Search', desc: lang === 'fr' ? 'Index complet en cache' : 'Full index cached' },
                { icon: FileText, title: 'Pages', desc: `114 ${lang === 'fr' ? 'pages' : 'pages'}` },
                { icon: ImageIcon, title: lang === 'fr' ? 'Médias visités' : 'Visited media', desc: lang === 'fr' ? 'Cache à la demande' : 'On-demand cache' },
              ].map((c) => (
                <div key={c.title} className="rounded-2xl border border-pine-900/10 bg-white p-5 text-center">
                  <c.icon size={20} className="mx-auto text-gold-600" />
                  <p className="mt-2 text-sm font-semibold text-pine-950">{c.title}</p>
                  <p className="text-xs text-pine-900/60">{c.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to={localePath(lang, '/')} className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-pine-950">
                {lang === 'fr' ? 'Accueil (cache)' : 'Home (cached)'}
              </Link>
              <Link to={localePath(lang, '/portfolio')} className="inline-flex items-center gap-2 rounded-full border border-pine-900/15 bg-white px-6 py-3 text-sm font-semibold text-pine-900">
                <Download size={14} /> Portfolio
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
