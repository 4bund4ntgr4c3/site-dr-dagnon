import { useState, useId } from 'react';
import { Shield, Bug, Syringe, Activity, Sparkles, TrendingDown, Users, DollarSign, CheckCircle2, ChevronRight } from 'lucide-react';
import { useLang } from '@/i18n/useLang';
import { DISTRICT_ARCHETYPES, type DistrictArchetype } from '@/data/stratification';

export function SubnationalTailoringSimulator() {
  const { lang } = useLang();
  const isFr = lang === 'fr';

  const [selectedArchetype, setSelectedArchetype] = useState<DistrictArchetype>(DISTRICT_ARCHETYPES[0]);
  const [population, setPopulation] = useState<number>(200000);

  const popInputId = useId();

  // Dynamic calculations based on archetype and population
  const baselineCases = Math.round((population * selectedArchetype.epiContext.baselineIncidence) / 1000);
  const casesAverted = Math.round(baselineCases * selectedArchetype.impactMultipliers.caseReductionRate);

  const baselineDeaths = Math.round(baselineCases * 0.0035); // ~0.35% case fatality baseline
  const deathsAverted = Math.round(baselineDeaths * selectedArchetype.impactMultipliers.mortalityReductionRate);

  const totalCost = Math.round(population * selectedArchetype.impactMultipliers.costPerPersonProtected);
  const dalysAverted = Math.round((population / 1000) * selectedArchetype.impactMultipliers.dalysAvertedPer1000);
  const costPerDaly = dalysAverted > 0 ? Math.round(totalCost / dalysAverted) : 0;

  return (
    <div className="rounded-3xl border border-pine-900/15 bg-white p-6 shadow-xl sm:p-8 lg:p-10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-pine-900/10 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-3.5 py-1 text-[11px] font-semibold tracking-wider text-gold-700 uppercase">
            <Sparkles size={13} className="text-gold-600" />
            {isFr ? 'Modélisation Infranationale OMS 2025' : 'WHO 2025 Subnational Tailoring (SNT)'}
          </div>
          <h2 className="font-display text-2xl font-bold text-pine-950 sm:text-3xl">
            {isFr ? 'Simulateur de Stratification & Ciblage Infranational' : 'Subnational Tailoring & Intervention Modeler'}
          </h2>
          <p className="max-w-2xl text-[14px] text-pine-900/75 sm:text-[15px]">
            {isFr
              ? 'Concevez le paquet d’interventions antipaludiques optimal adapté au profil entomologique et épidémiologique spécifique de votre district.'
              : 'Design the precision malaria intervention mix tailored to your district’s unique entomological and epidemiological profile.'}
          </p>
        </div>
      </div>

      {/* 1. District Archetype Selector */}
      <div className="mt-8 space-y-4">
        <label className="text-[13px] font-semibold tracking-wider text-pine-900/80 uppercase">
          {isFr ? '1. Choisissez l’archétype de transmission du district' : '1. Select District Transmission Archetype'}
        </label>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {DISTRICT_ARCHETYPES.map((arch) => {
            const isSelected = arch.id === selectedArchetype.id;
            return (
              <button
                key={arch.id}
                type="button"
                onClick={() => setSelectedArchetype(arch)}
                className={`flex flex-col justify-between rounded-2xl border p-4 text-left transition-all ${
                  isSelected
                    ? 'border-gold-500 bg-pine-950 text-white shadow-lg ring-2 ring-gold-400/40'
                    : 'border-pine-900/15 bg-pine-50/50 text-pine-900 hover:border-gold-500/40 hover:bg-pine-50'
                }`}
                aria-pressed={isSelected}
              >
                <div>
                  <span
                    className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      isSelected ? 'bg-gold-400 text-pine-950' : 'bg-pine-200 text-pine-800'
                    }`}
                  >
                    {arch.id === 'rural-hyperendemic'
                      ? isFr ? 'Haute charge' : 'High burden'
                      : arch.id === 'urban-coastal-stephensi'
                      ? isFr ? 'Alerte Stephensi' : 'Stephensi Threat'
                      : arch.id === 'sahelian-seasonal'
                      ? isFr ? 'Saisonnier' : 'Seasonal Surge'
                      : isFr ? 'Élimination' : 'Elimination'}
                  </span>
                  <h3 className={`mt-2 font-display text-[15px] font-semibold leading-snug ${isSelected ? 'text-pine-50' : 'text-pine-950'}`}>
                    {arch.name[lang]}
                  </h3>
                </div>
                <p className={`mt-3 text-[12px] leading-relaxed ${isSelected ? 'text-pine-200/80' : 'text-pine-700'}`}>
                  {arch.tagline[lang]}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Population Slider Control */}
      <div className="mt-8 rounded-2xl border border-pine-900/10 bg-pine-50/70 p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label htmlFor={popInputId} className="flex items-center gap-2 text-[13px] font-semibold tracking-wider text-pine-900 uppercase">
            <Users size={16} className="text-gold-600" />
            {isFr ? 'Population cible du district sanitaire :' : 'Target District Population:'}
          </label>
          <span className="font-mono text-lg font-bold text-pine-950">
            {population.toLocaleString(isFr ? 'fr-FR' : 'en-US')} {isFr ? 'habitants' : 'people'}
          </span>
        </div>
        <input
          id={popInputId}
          type="range"
          min={50000}
          max={500000}
          step={25000}
          value={population}
          onChange={(e) => setPopulation(Number(e.target.value))}
          className="mt-4 h-2.5 w-full cursor-pointer appearance-none rounded-lg bg-pine-200 accent-gold-500"
          aria-label={isFr ? 'Population du district' : 'District population'}
        />
        <div className="mt-2 flex justify-between text-[11px] font-medium text-pine-700">
          <span>50 000 hab</span>
          <span>250 000 hab</span>
          <span>500 000 hab</span>
        </div>
      </div>

      {/* 3. Epidemiological & Health ROI Dashboard */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Cas Évités */}
        <div className="rounded-2xl border border-pine-900/10 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-pine-700">{isFr ? 'Cas Évités / An' : 'Cases Averted / Year'}</span>
            <TrendingDown size={18} className="text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-emerald-700">
            +{casesAverted.toLocaleString(isFr ? 'fr-FR' : 'en-US')}
          </div>
          <p className="mt-1 text-[11px] text-pine-600">
            {isFr
              ? `-${Math.round(selectedArchetype.impactMultipliers.caseReductionRate * 100)}% sur les ${baselineCases.toLocaleString()} cas attendus`
              : `-${Math.round(selectedArchetype.impactMultipliers.caseReductionRate * 100)}% vs ${baselineCases.toLocaleString()} baseline cases`}
          </p>
        </div>

        {/* Vies Sauvées */}
        <div className="rounded-2xl border border-pine-900/10 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-pine-700">{isFr ? 'Décès Enfants Évités' : 'Child Deaths Averted'}</span>
            <Shield size={18} className="text-gold-600" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-gold-700">
            +{deathsAverted.toLocaleString(isFr ? 'fr-FR' : 'en-US')}
          </div>
          <p className="mt-1 text-[11px] text-pine-600">
            {isFr
              ? `-${Math.round(selectedArchetype.impactMultipliers.mortalityReductionRate * 100)}% de mortalité pédiatrique`
              : `-${Math.round(selectedArchetype.impactMultipliers.mortalityReductionRate * 100)}% pediatric mortality drop`}
          </p>
        </div>

        {/* DALYs Gagnées */}
        <div className="rounded-2xl border border-pine-900/10 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-pine-700">{isFr ? 'Années de Vie Gagnées (DALYs)' : 'DALYs Averted'}</span>
            <Activity size={18} className="text-pine-600" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-pine-950">
            {dalysAverted.toLocaleString(isFr ? 'fr-FR' : 'en-US')}
          </div>
          <p className="mt-1 text-[11px] text-pine-600">
            {isFr ? `$${costPerDaly} par DALY (hautement coût-efficace)` : `$${costPerDaly} / DALY (highly cost-effective)`}
          </p>
        </div>

        {/* Budget Estimé */}
        <div className="rounded-2xl border border-pine-900/10 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-pine-700">{isFr ? 'Investissement Annuel Estimé' : 'Estimated Annual Budget'}</span>
            <DollarSign size={18} className="text-pine-700" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-pine-950">
            ${(totalCost / 1000).toFixed(0)}k
          </div>
          <p className="mt-1 text-[11px] text-pine-600">
            ${selectedArchetype.impactMultipliers.costPerPersonProtected.toFixed(2)} {isFr ? '/ habitant / an' : '/ capita / year'}
          </p>
        </div>
      </div>

      {/* 4. Detailed "Optimal Intervention Package" */}
      <div className="mt-10 rounded-2xl border border-gold-500/30 bg-pine-950 p-6 text-white sm:p-8">
        <div className="flex items-center gap-2 text-gold-400">
          <CheckCircle2 size={18} />
          <h3 className="font-display text-lg font-bold tracking-wide uppercase sm:text-xl">
            {isFr ? 'Paquet d’Interventions Recommandé par le Dr. Dagnon' : 'Dr. Dagnon’s Recommended Intervention Mix'}
          </h3>
        </div>
        <p className="mt-2 text-[13.5px] text-pine-200/85">
          {selectedArchetype.description[lang]}
        </p>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {/* Lutte Antivectorielle */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-gold-300 font-semibold text-[14px]">
              <Bug size={16} />
              <span>{isFr ? 'Lutte Antivectorielle :' : 'Vector Control:'}</span>
            </div>
            <p className="mt-2 font-display text-[15px] font-medium text-white">
              {selectedArchetype.recommendedPackage.vectorControl.tool[lang]}
            </p>
            <p className="mt-2 text-[12.5px] text-pine-200/80 leading-relaxed">
              {selectedArchetype.recommendedPackage.vectorControl.rationale[lang]}
            </p>
            <div className="mt-3 inline-flex items-center gap-1 rounded bg-gold-400/20 px-2.5 py-1 text-[11px] font-mono text-gold-200">
              <ChevronRight size={12} />
              {selectedArchetype.recommendedPackage.vectorControl.coverageTarget}
            </div>
          </div>

          {/* Chimioprévention */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-gold-300 font-semibold text-[14px]">
              <Shield size={16} />
              <span>{isFr ? 'Chimioprévention :' : 'Chemoprevention:'}</span>
            </div>
            <p className="mt-2 font-display text-[15px] font-medium text-white">
              {selectedArchetype.recommendedPackage.chemoprevention.tool[lang]}
            </p>
            <p className="mt-2 text-[12.5px] text-pine-200/80 leading-relaxed">
              {selectedArchetype.recommendedPackage.chemoprevention.rationale[lang]}
            </p>
            <div className="mt-3 inline-flex items-center gap-1 rounded bg-gold-400/20 px-2.5 py-1 text-[11px] font-mono text-gold-200">
              <ChevronRight size={12} />
              {selectedArchetype.recommendedPackage.chemoprevention.cycles}
            </div>
          </div>

          {/* Vaccination */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-gold-300 font-semibold text-[14px]">
              <Syringe size={16} />
              <span>{isFr ? 'Vaccination Antipaludique :' : 'Malaria Vaccination:'}</span>
            </div>
            <p className="mt-2 font-display text-[15px] font-medium text-white">
              {selectedArchetype.recommendedPackage.vaccination.tool[lang]}
            </p>
            <p className="mt-2 text-[12.5px] text-pine-200/80 leading-relaxed">
              {selectedArchetype.recommendedPackage.vaccination.rationale[lang]}
            </p>
            <div className="mt-3 inline-flex items-center gap-1 rounded bg-gold-400/20 px-2.5 py-1 text-[11px] font-mono text-gold-200">
              <ChevronRight size={12} />
              {selectedArchetype.recommendedPackage.vaccination.target}
            </div>
          </div>

          {/* Surveillance & Communautaire */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-gold-300 font-semibold text-[14px]">
              <Activity size={16} />
              <span>{isFr ? 'Surveillance & Soins Communautaires :' : 'Surveillance & Community Health:'}</span>
            </div>
            <p className="mt-2 font-display text-[15px] font-medium text-white">
              {selectedArchetype.recommendedPackage.surveillanceAndCommunity.tool[lang]}
            </p>
            <p className="mt-2 text-[12.5px] text-pine-200/80 leading-relaxed">
              {selectedArchetype.recommendedPackage.surveillanceAndCommunity.rationale[lang]}
            </p>
            <div className="mt-3 inline-flex items-center gap-1 rounded bg-gold-400/20 px-2.5 py-1 text-[11px] font-mono text-gold-200">
              <ChevronRight size={12} />
              {selectedArchetype.recommendedPackage.surveillanceAndCommunity.focus[lang]}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
