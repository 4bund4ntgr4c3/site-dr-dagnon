import { useState } from 'react';
import { Link } from 'react-router';
import { MapPin, ArrowUpRight } from 'lucide-react';
import { useLang } from '@/i18n/useLang';
import { localePath } from '@/i18n/routing';
import { PROJECTS } from '@/data/projects';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/* Approximate SVG coordinates for Francophone Africa on the
   viewBox 0 0 100 104 used by AfricaMap. Tuned so Benin stays at the
   historical 33,47 anchor and the other pins fall in the right sub-regions. */
const COORDS: Record<string, { x: number; y: number }> = {
  'digitalisation-milda-benin': { x: 33, y: 47 },
  'recherche-cps-smc': { x: 30, y: 43 },
  'malariya-pi-burundi': { x: 55, y: 63 },
  'arm3-systeme-information-benin': { x: 33, y: 45 },
  'irs-nord-benin': { x: 33, y: 41 },
  'reponse-epidemies-benin': { x: 33, y: 48 },
  'contrat-g2g-pnlp-benin': { x: 34, y: 47 },
};

const BURKINA = { x: 29, y: 40 };

export function ProjectsMap() {
  const { lang } = useLang();
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-pine-900/10 bg-white shadow-card">
      <div className="grid gap-0 lg:grid-cols-[1.35fr_1fr]">
        {/* map */}
        <div className="relative bg-pine-50 p-6 sm:p-8">
          <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-pine-700/80">
            <MapPin size={14} /> {lang === 'fr' ? 'Où intervient le Dr Dagnon' : 'Where Dr Dagnon works'}
          </p>
          <svg viewBox="0 0 100 104" className="h-auto w-full" role="img" aria-label={lang === 'fr' ? 'Carte Afrique — projets' : 'Africa map — projects'}>
            {/* continent */}
            <path
              d="M30 8 C36 6 44 8 50 6 C54 3 58 3 60 7 C64 8 68 10 70 14 C73 20 74 26 76 32 C82 34 88 40 90 45 C86 50 80 52 76 56 C74 62 70 68 66 76 C62 84 56 90 50 92 C44 90 40 84 38 76 C36 68 32 62 30 56 C26 54 22 52 22 48 C20 44 16 42 16 38 C18 32 22 26 24 20 C26 14 27 10 30 8 Z"
              fill="rgba(12,46,42,0.04)"
              stroke="#0c2e2a"
              strokeOpacity="0.12"
              strokeWidth="0.9"
            />
            <path
              d="M79 74 C81 76 82 80 80 84 C78 82 77 78 79 74 Z"
              fill="rgba(12,46,42,0.04)"
              stroke="#0c2e2a"
              strokeOpacity="0.12"
              strokeWidth="0.9"
            />
            {/* Burkina marker (for the Benin+Burkina project) */}
            <g opacity="0.9">
              <circle cx={BURKINA.x} cy={BURKINA.y} r="1.6" fill="#a8823a" />
              {!reducedMotion && <circle cx={BURKINA.x} cy={BURKINA.y} r="3.2" fill="none" stroke="#c9a24b" strokeOpacity="0.25" strokeWidth="0.5" />}
            </g>
            {/* project pins */}
            {PROJECTS.map((p) => {
              const c = COORDS[p.slug] ?? { x: 33, y: 47 };
              const isActive = active === p.slug;
              return (
                <g
                  key={p.slug}
                  className="cursor-pointer"
                  onMouseEnter={() => setActive(p.slug)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(p.slug)}
                  onBlur={() => setActive(null)}
                >
                  <Link to={localePath(lang, `/projets/${p.slug}`)} aria-label={p.title[lang]}>
                    {!reducedMotion && (
                      <circle cx={c.x} cy={c.y} r={isActive ? 7 : 5} fill="none" stroke="#c9a24b" strokeOpacity={isActive ? 0.45 : 0.22} strokeWidth="0.7">
                        {!isActive && <animate attributeName="r" values="3;6;3" dur="3.2s" repeatCount="indefinite" />}
                        {!isActive && <animate attributeName="stroke-opacity" values="0.35;0;0.35" dur="3.2s" repeatCount="indefinite" />}
                      </circle>
                    )}
                    <circle cx={c.x} cy={c.y} r={isActive ? 2.8 : 2.1} fill={isActive ? '#a8823a' : '#c9a24b'} stroke="white" strokeWidth="0.7" />
                  </Link>
                </g>
              );
            })}
          </svg>
          <p className="mt-3 text-[11px] leading-relaxed text-pine-900/60">
            {lang === 'fr' ? 'Survolez un point pour voir le projet. Le trait Burkina Faso ↔ Bénin illustre le portefeuille CPS transfrontalier.' : 'Hover a dot to preview the project. The Burkina Faso ↔ Benin link marks the cross-border SMC portfolio.'}
          </p>
        </div>

        {/* list */}
        <div className="flex flex-col divide-y divide-pine-900/5 border-t border-pine-900/5 bg-white lg:border-l lg:border-t-0">
          {PROJECTS.map((p) => {
            const isActive = active === p.slug;
            return (
              <Link
                key={p.slug}
                to={localePath(lang, `/projets/${p.slug}`)}
                onMouseEnter={() => setActive(p.slug)}
                onMouseLeave={() => setActive(null)}
                className={`group flex items-center gap-3 px-5 py-3.5 transition-colors sm:px-6 ${isActive ? 'bg-gold-500/10' : 'hover:bg-pine-50'}`}
              >
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${isActive ? 'bg-gold-500 text-pine-950' : 'bg-pine-950 text-gold-400'}`}>
                  {p.tag[lang].slice(0, 1)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold leading-tight text-pine-950 group-hover:text-gold-700">{p.title[lang]}</span>
                  <span className="block truncate text-xs text-pine-900/60">{p.location[lang]} · {p.period[lang]}</span>
                </span>
                <ArrowUpRight size={14} className="shrink-0 text-pine-900/30 group-hover:text-gold-600" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
