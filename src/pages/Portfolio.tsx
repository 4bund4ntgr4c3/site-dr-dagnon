import { Download, FileText, Layers, BookOpen, Briefcase, Award } from 'lucide-react';
import { Link } from 'react-router';
import { Reveal } from '@/components/Reveal';
import { useLang } from '@/i18n/useLang';
import { UI } from '@/i18n/translations';
import { localePath } from '@/i18n/routing';
import { PROJECTS } from '@/data/projects';
import { PUB_ITEMS } from '@/data/publications';
import { EXPERIENCE } from '@/data/site';

export default function Portfolio() {
  const { lang } = useLang();
  const t = UI[lang];
  const pubs = PUB_ITEMS.filter((p) => p.type === 'publication').slice(0, 6);
  const projs = [...PROJECTS].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen">
      <section className="relative overflow-hidden bg-pine-950">
        <div className="absolute inset-0 texture-net" />
        <div className="absolute -top-40 -right-40 h-[560px] w-[560px] rounded-full bg-pine-600/25 blur-[130px]" />
        <div className="absolute bottom-0 -left-40 h-[460px] w-[460px] rounded-full bg-gold-600/12 blur-[120px]" />
        <div className="relative mx-auto max-w-6xl px-5 pb-24 pt-32 lg:px-8 lg:pt-36">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-300">
              <Layers size={13} /> {lang === 'fr' ? 'Portfolio complet' : 'Full portfolio'}
            </span>
            <h1 className="mt-7 font-display text-[2.6rem] leading-[1.05] font-medium text-pine-100 sm:text-6xl">
              {lang === 'fr' ? 'Tout le portfolio en un document' : 'The full portfolio as one document'}
            </h1>
            <p className="mt-4 max-w-2xl font-display text-lg italic text-pine-200/90">
              {lang === 'fr' ? 'CV, projets, publications et distinctions — prêt à imprimer ou à partager.' : 'CV, projects, publications and awards — print-ready and shareable.'}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-pine-950 hover:bg-gold-400">
                <Download size={16} /> {lang === 'fr' ? 'Imprimer / PDF' : 'Print / PDF'}
              </button>
              <Link to={localePath(lang, '/cv')} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-pine-100 hover:bg-white/10">
                <FileText size={16} /> CV
              </Link>
              <Link to={localePath(lang, '/publications')} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-pine-100 hover:bg-white/10">
                <BookOpen size={16} /> Publications
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-ivory py-12 lg:py-16">
        <div className="mx-auto max-w-6xl space-y-10 px-5 lg:px-8">
          <Reveal>
            <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-pine-950"><Briefcase size={18} className="text-gold-600" /> {lang === 'fr' ? 'Parcours' : 'Career'}</h2>
            <div className="mt-4 grid gap-3">
              {EXPERIENCE[lang].slice(0, 3).map((e) => (
                <div key={e.org} className="rounded-xl border border-pine-900/10 bg-white p-4">
                  <p className="text-sm font-semibold text-pine-950">{e.role} — {e.org}</p>
                  <p className="text-xs text-pine-900/60">{e.period}</p>
                  <p className="mt-1 text-sm text-pine-900/70 line-clamp-2">{e.text}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-pine-950"><Layers size={18} className="text-gold-600" /> {lang === 'fr' ? 'Projets phares' : 'Flagship projects'}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {projs.map((p) => (
                <Link key={p.slug} to={localePath(lang, `/projets/${p.slug}`)} className="rounded-xl border border-pine-900/10 bg-white p-4 hover:border-gold-500/30">
                  <p className="text-sm font-semibold text-pine-950">{p.title[lang]}</p>
                  <p className="text-xs text-pine-900/60">{p.location[lang]} · {p.period[lang]}</p>
                </Link>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-pine-950"><BookOpen size={18} className="text-gold-600" /> Publications</h2>
            <div className="mt-4 space-y-2">
              {pubs.map((p) => (
                <div key={p.id} className="rounded-xl border border-pine-900/5 bg-white px-4 py-3">
                  <p className="text-sm font-medium text-pine-950">{p.title[lang]}</p>
                  <p className="text-xs text-pine-900/60">{p.journal[lang]} · {p.year}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <div className="flex flex-wrap gap-3">
              <Link to={localePath(lang, '/publications-pdf')} className="inline-flex items-center gap-2 rounded-full bg-pine-950 px-5 py-2.5 text-sm font-semibold text-gold-400">
                <Award size={14} /> {lang === 'fr' ? 'Toutes les publications (PDF)' : 'All publications (PDF)'}
              </Link>
              <Link to={localePath(lang, '/impact')} className="inline-flex items-center gap-2 rounded-full border border-pine-900/15 bg-white px-5 py-2.5 text-sm font-semibold text-pine-900">
                {t['impactPage.badge']} →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
