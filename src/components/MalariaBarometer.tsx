import { useLang } from '@/i18n/useLang';
import { TrendingDown, TrendingUp, Activity, Info } from 'lucide-react';

/* Deliberately synthetic series used to demonstrate the chart interaction.
   It is not surveillance data and must not be presented as such. */
const SERIES = {
  casesM: [241, 242, 247, 249, 263], // global cases, millions
  years: ['2019', '2020', '2021', '2022', '2023'],
  beninInc: [312, 298, 285, 272, 259], // Benin incidence per 1k at risk (illustrative)
};

export function MalariaBarometer() {
  const { lang } = useLang();
  const maxCases = Math.max(...SERIES.casesM);
  const maxInc = Math.max(...SERIES.beninInc);

  return (
    <div className="rounded-2xl border border-pine-900/10 bg-white p-6 shadow-card sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-pine-600">
            <Activity size={14} /> {lang === 'fr' ? 'Scénario illustratif' : 'Illustrative scenario'}
          </p>
          <h3 className="mt-2 font-display text-xl font-semibold text-pine-950">
            {lang === 'fr' ? 'Où en est la lutte ?' : 'Where does the fight stand?'}
          </h3>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-pine-950 px-3 py-1 text-[11px] font-semibold text-gold-400">
            <Info size={12} /> {lang === 'fr' ? 'Données fictives' : 'Synthetic data'}
          </span>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* global */}
        <div className="rounded-xl border border-pine-900/5 bg-pine-50 p-5">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-pine-700/80">
            <TrendingUp size={12} /> {lang === 'fr' ? 'Cas mondiaux (M)' : 'Global cases (M)'}
          </p>
          <div className="mt-4 flex items-end gap-1.5">
            {SERIES.casesM.map((v, i) => (
              <div key={SERIES.years[i]} className="flex flex-1 flex-col items-center gap-1.5">
                <span className="text-[11px] font-semibold text-pine-900/70">{v}</span>
                <div className="flex h-20 w-full items-end justify-center">
                  <div
                    className="w-full max-w-10 rounded-t-lg bg-gradient-to-t from-pine-700 to-pine-500"
                    style={{ height: `${(v / maxCases) * 100}%`, minHeight: 8 }}
                    aria-hidden="true"
                  />
                </div>
                <span className="text-[11px] text-pine-900/60">{SERIES.years[i]}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-pine-900/60">
            {lang === 'fr' ? 'Exemple de hausse puis de plateau, uniquement destiné à illustrer la visualisation.' : 'Example rise and plateau, shown only to demonstrate the visualization.'}
          </p>
        </div>

        {/* Benin */}
        <div className="rounded-xl border border-gold-500/20 bg-gold-500/5 p-5">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gold-700">
            <TrendingDown size={12} /> {lang === 'fr' ? 'Incidence Bénin (/1000) — tendance' : 'Benin incidence (/1000) — trend'}
          </p>
          <div className="mt-4 flex items-end gap-1.5">
            {SERIES.beninInc.map((v, i) => (
              <div key={SERIES.years[i]} className="flex flex-1 flex-col items-center gap-1.5">
                <span className="text-[11px] font-semibold text-gold-700">{v}</span>
                <div className="flex h-20 w-full items-end justify-center">
                  <div
                    className="w-full max-w-10 rounded-t-lg bg-gradient-to-t from-gold-600 to-gold-400"
                    style={{ height: `${(v / maxInc) * 100}%`, minHeight: 8 }}
                    aria-hidden="true"
                  />
                </div>
                <span className="text-[11px] text-pine-900/60">{SERIES.years[i]}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-pine-900/60">
            {lang === 'fr' ? 'Exemple de tendance décroissante ; aucun effet causal ni résultat national réel n’est revendiqué.' : 'Example downward trend; it does not claim a causal effect or real national result.'}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 text-[11px] text-pine-900/55">
        <span className="rounded-full border border-pine-900/10 px-2.5 py-1">{lang === 'fr' ? 'Démonstration — pas une source de surveillance' : 'Demonstration — not a surveillance source'}</span>
        <span className="rounded-full border border-pine-900/10 px-2.5 py-1">{lang === 'fr' ? 'Ne pas utiliser pour une décision sanitaire' : 'Not for health decision-making'}</span>
      </div>
    </div>
  );
}
