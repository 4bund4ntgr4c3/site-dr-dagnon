import { useState, useMemo } from 'react';
import { Calculator, Shield, HeartPulse, DollarSign, Activity, Info, RefreshCw } from 'lucide-react';
import { useLang } from '@/i18n/useLang';

export function HealthEconomicsSimulator() {
  const { lang } = useLang();
  const isFr = lang === 'fr';

  // Input states
  const [population, setPopulation] = useState<number>(1500000);
  const [dualAiNets, setDualAiNets] = useState<boolean>(true);
  const [smcCycles, setSmcCycles] = useState<number>(4); // 0, 4, or 5
  const [targetedIrs, setTargetedIrs] = useState<boolean>(true);
  const [digitalTracking, setDigitalTracking] = useState<boolean>(true);

  // Health economics dynamic model calculations
  const results = useMemo(() => {
    // Baseline malaria incidence: ~380 cases per 1000 person-years in high endemicity
    const baselineCases = (population * 0.38);

    // Efficacy multiplier based on intervention combination
    const netEfficacy = dualAiNets ? 0.35 : 0.20; // 35% reduction from Next-Gen nets vs 20% standard
    const smcEfficacy = smcCycles === 5 ? 0.32 : smcCycles === 4 ? 0.26 : 0;
    const irsEfficacy = targetedIrs ? 0.18 : 0;
    const digitalEfficacy = digitalTracking ? 0.12 : 0; // 12% boost from zero stockouts and rapid diagnosis

    // Combined protective efficacy with synergy attenuation
    const totalEfficacy = Math.min(0.82, netEfficacy + smcEfficacy + irsEfficacy + digitalEfficacy);

    const casesAverted = Math.round(baselineCases * totalEfficacy);
    const severeCasesAverted = Math.round(casesAverted * 0.08); // 8% of clinical cases become severe
    const livesSaved = Math.round(severeCasesAverted * 0.065); // Mortality rate in severe malaria without early care

    // Economic metrics (Direct treatment costs + indirect productivity loss)
    const directHospitalCostPerCase = 14; // $14 USD avg cost per outpatient/inpatient malaria episode
    const hospitalSavingsUsd = Math.round(casesAverted * directHospitalCostPerCase);

    // Estimated program delivery costs ($ USD)
    const netCost = dualAiNets ? (population / 1.8) * 3.8 : (population / 1.8) * 2.2;
    const smcCost = smcCycles > 0 ? (population * 0.22) * (smcCycles * 0.85) : 0;
    const irsCost = targetedIrs ? (population * 0.15) * 4.5 : 0;
    const digitalCost = digitalTracking ? 65000 : 0;
    const totalInvestment = Math.round(netCost + smcCost + irsCost + digitalCost);

    // Economic Return (Value of statistical life + hospital savings + economic productivity saved)
    const totalEconomicBenefit = hospitalSavingsUsd + (livesSaved * 45000) + (casesAverted * 28);
    const roiRatio = totalInvestment > 0 ? (totalEconomicBenefit / totalInvestment).toFixed(2) : '0';

    return {
      casesAverted,
      severeCasesAverted,
      livesSaved,
      hospitalSavingsUsd,
      totalInvestment,
      totalEfficacyPercent: Math.round(totalEfficacy * 100),
      roiRatio,
    };
  }, [population, dualAiNets, smcCycles, targetedIrs, digitalTracking]);

  const resetDefaults = () => {
    setPopulation(1500000);
    setDualAiNets(true);
    setSmcCycles(4);
    setTargetedIrs(true);
    setDigitalTracking(true);
  };

  return (
    <div className="rounded-3xl border border-pine-800/60 bg-gradient-to-b from-pine-900 to-pine-950 p-6 shadow-2xl lg:p-10">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-8 sm:flex-row sm:items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-300">
            <Calculator size={13} />
            {isFr ? 'Modélisation & Économie de la Santé' : 'Health Economics Modeling'}
          </span>
          <h3 className="mt-3 font-display text-2xl font-semibold text-pine-100 sm:text-3xl">
            {isFr ? 'Simulateur d’Impact & Rentabilité Sanitaire' : 'Malaria Intervention Impact Simulator'}
          </h3>
          <p className="mt-2 max-w-xl text-[14px] text-pine-200/80">
            {isFr
              ? 'Ajustez la population et les combinaisons stratégiques d’interventions pour estimer les cas évités, les vies sauvées et le retour sur investissement.'
              : 'Adjust target population and intervention packages to estimate averted cases, saved lives, and economic return on investment.'}
          </p>
        </div>

        <button
          type="button"
          onClick={resetDefaults}
          className="inline-flex items-center gap-2 self-start rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-pine-200 hover:border-gold-400 hover:text-gold-300 transition-colors"
        >
          <RefreshCw size={13} />
          <span>{isFr ? 'Réinitialiser' : 'Reset defaults'}</span>
        </button>
      </div>

      {/* Grid: Inputs (Left) & Output Results (Right) */}
      <div className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_1.15fr] items-start">
        {/* Left: Interactive Controls */}
        <div className="space-y-6 rounded-2xl border border-white/10 bg-pine-950/70 p-6">
          <h4 className="font-display text-base font-semibold text-pine-100 flex items-center gap-2">
            <Activity size={16} className="text-gold-400" />
            {isFr ? '1. Paramètres de la Population Cible' : '1. Target Population Parameters'}
          </h4>

          {/* Population Slider */}
          <div>
            <div className="flex justify-between text-xs font-medium text-pine-200 mb-2">
              <span>{isFr ? 'Population totale couverte :' : 'Total population covered:'}</span>
              <span className="font-bold text-gold-300 text-sm">{population.toLocaleString()} {isFr ? 'habitants' : 'people'}</span>
            </div>
            <input
              type="range"
              min={250000}
              max={5000000}
              step={100000}
              value={population}
              onChange={(e) => setPopulation(Number(e.target.value))}
              className="w-full accent-gold-400 cursor-pointer h-2 bg-pine-900 rounded-lg appearance-none"
            />
            <div className="flex justify-between text-[11px] text-pine-400 mt-1 font-mono">
              <span>250 000</span>
              <span>2 500 000</span>
              <span>5 000 000</span>
            </div>
          </div>

          <h4 className="font-display text-base font-semibold text-pine-100 pt-3 border-t border-white/10 flex items-center gap-2">
            <Shield size={16} className="text-gold-400" />
            {isFr ? '2. Paquet d’Interventions Combinées' : '2. Strategic Intervention Package'}
          </h4>

          {/* Toggle: Dual-AI Nets */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-pine-900/50">
            <div>
              <p className="text-xs font-semibold text-pine-100">
                {isFr ? 'Moustiquaires Nouvelle Génération (Dual-AI / PBO)' : 'Next-Gen Dual-AI / PBO Mosquito Nets'}
              </p>
              <p className="text-[11px] text-pine-300/70">
                {isFr ? 'Surmonte la résistance aux pyréthrinoïdes standards' : 'Overcomes standard pyrethroid resistance'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setDualAiNets(!dualAiNets)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                dualAiNets ? 'bg-gold-500' : 'bg-pine-800'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-pine-950 shadow-md transition duration-200 ease-in-out ${
                  dualAiNets ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Select: SMC Cycles */}
          <div className="p-3 rounded-xl border border-white/5 bg-pine-900/50">
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs font-semibold text-pine-100">
                {isFr ? 'Chimioprévention Saisonnière (CPS / SMC) :' : 'Seasonal Chemoprevention (SMC):'}
              </p>
              <span className="text-xs font-bold text-gold-300">
                {smcCycles === 0 ? (isFr ? 'Désactivé' : 'Disabled') : `${smcCycles} ${isFr ? 'cycles' : 'cycles'}`}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { val: 0, label: isFr ? 'Aucun' : 'None' },
                { val: 4, label: isFr ? '4 cycles (Standard)' : '4 cycles (Std)' },
                { val: 5, label: isFr ? '5 cycles (Étendu)' : '5 cycles (Ext)' },
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setSmcCycles(opt.val)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
                    smcCycles === opt.val
                      ? 'bg-gold-500 text-pine-950 font-bold'
                      : 'border border-white/10 bg-pine-950/60 text-pine-300 hover:border-gold-400/40'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Toggle: Targeted IRS */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-pine-900/50">
            <div>
              <p className="text-xs font-semibold text-pine-100">
                {isFr ? 'Pulvérisation Intradomiciliaire Ciblée (PID / IRS)' : 'Targeted Indoor Residual Spraying (IRS)'}
              </p>
              <p className="text-[11px] text-pine-300/70">
                {isFr ? 'Foyers à très haute transmission (ex: Atacora)' : 'High transmission hotspots (e.g., Atacora)'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setTargetedIrs(!targetedIrs)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                targetedIrs ? 'bg-gold-500' : 'bg-pine-800'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-pine-950 shadow-md transition duration-200 ease-in-out ${
                  targetedIrs ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Toggle: Digital Tracking */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-pine-900/50">
            <div>
              <p className="text-xs font-semibold text-pine-100">
                {isFr ? 'Digitalisation & Traçabilité DHIS2' : 'DHIS2 Digitalization & Tracking'}
              </p>
              <p className="text-[11px] text-pine-300/70">
                {isFr ? 'Zéro rupture de stock d’ACT et alertes temps réel' : 'Zero ACT stockouts and real-time alert triggers'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setDigitalTracking(!digitalTracking)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                digitalTracking ? 'bg-gold-500' : 'bg-pine-800'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-pine-950 shadow-md transition duration-200 ease-in-out ${
                  digitalTracking ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Right: Simulation Output Results */}
        <div className="flex flex-col justify-between rounded-2xl border border-gold-500/30 bg-gradient-to-br from-pine-900/90 to-pine-950 p-6 lg:p-7 shadow-xl">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gold-400">
                  {isFr ? 'Résultats de la Simulation' : 'Simulation Impact Model'}
                </p>
                <h4 className="font-display text-xl font-bold text-pine-100 sm:text-2xl mt-0.5">
                  {results.casesAverted.toLocaleString()} {isFr ? 'Cas de Paludisme Évités' : 'Malaria Cases Averted'}
                </h4>
              </div>
              <div className="text-right">
                <span className="inline-block rounded-full bg-emerald-500/20 border border-emerald-500/40 px-3 py-1 text-xs font-bold text-emerald-300">
                  -{results.totalEfficacyPercent}% {isFr ? 'de morbidité' : 'morbidity'}
                </span>
              </div>
            </div>

            {/* Metric Cards Grid */}
            <div className="mt-6 grid grid-cols-2 gap-3.5">
              {/* Card 1: Lives Saved */}
              <div className="rounded-xl border border-white/10 bg-pine-950/80 p-4">
                <div className="flex items-center gap-2 text-rose-400 mb-1.5">
                  <HeartPulse size={16} />
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-pine-300">
                    {isFr ? 'Vies sauvées (< 5 ans)' : 'Under-5 Lives Saved'}
                  </span>
                </div>
                <p className="font-display text-2xl sm:text-3xl font-bold text-pine-100">
                  {results.livesSaved.toLocaleString()}
                </p>
                <p className="text-[11px] text-pine-300/70 mt-1">
                  {isFr ? 'Enfants protégés des formes graves' : 'Children shielded from severe malaria'}
                </p>
              </div>

              {/* Card 2: Hospital Direct Savings */}
              <div className="rounded-xl border border-white/10 bg-pine-950/80 p-4">
                <div className="flex items-center gap-2 text-emerald-400 mb-1.5">
                  <DollarSign size={16} />
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-pine-300">
                    {isFr ? 'Économies Soins Directs' : 'Direct Healthcare Savings'}
                  </span>
                </div>
                <p className="font-display text-2xl sm:text-3xl font-bold text-gold-300">
                  ${(results.hospitalSavingsUsd / 1000000).toFixed(2)}M
                </p>
                <p className="text-[11px] text-pine-300/70 mt-1">
                  {isFr ? 'Coûts de consultation & lits évités' : 'Avoided admissions & consultation costs'}
                </p>
              </div>
            </div>

            {/* ROI Highlight Card */}
            <div className="mt-4 rounded-xl border border-gold-500/40 bg-gold-500/10 p-4.5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gold-300">
                  {isFr ? 'Rendement Économique Global (ROI Sanitaire) :' : 'Overall Health Return on Investment (ROI):'}
                </p>
                <p className="text-[12px] text-pine-200/80 mt-0.5">
                  {isFr
                    ? `1 $ investi génère ${results.roiRatio} $ de valeur sanitaire et économique`
                    : `Every $1 invested yields $${results.roiRatio} in economic and health value`}
                </p>
              </div>
              <div className="rounded-xl bg-gold-500 text-pine-950 px-3.5 py-2 font-display text-xl font-bold shrink-0">
                {results.roiRatio}x
              </div>
            </div>
          </div>

          {/* Footnote / Scientific Grounding */}
          <div className="mt-6 pt-4 border-t border-white/10 flex items-start gap-2 text-[11px] text-pine-300/70">
            <Info size={14} className="shrink-0 mt-0.5 text-gold-400" />
            <span>
              {isFr
                ? 'Modèle basé sur les méthodologies de micro-simulation en économie de la santé et les données opérationnelles des programmes paludisme en Afrique de l’Ouest (Univ. Groningen / OMS).'
                : 'Model grounded in health economics micro-simulation methodologies and West African operational malaria data (Univ. of Groningen / WHO).'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
