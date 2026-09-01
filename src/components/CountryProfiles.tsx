import { useState } from 'react';
import { Globe, Printer, ShieldAlert, Sparkles, DollarSign, Dna, Activity } from 'lucide-react';
import { useLang } from '@/i18n/useLang';
import { COUNTRY_PROFILES, type CountryProfile } from '@/data/country-profiles';

export function CountryProfiles() {
  const { lang } = useLang();
  const isFr = lang === 'fr';

  const [selectedCountry, setSelectedCountry] = useState<CountryProfile>(COUNTRY_PROFILES[0]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="rounded-3xl border border-pine-900/15 bg-white p-6 shadow-xl sm:p-8 lg:p-10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-pine-900/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-3.5 py-1 text-[11px] font-semibold tracking-wider text-gold-700 uppercase">
            <Globe size={13} className="text-gold-600" />
            {isFr ? 'Observatoire Stratégique 2026–2030' : 'Strategic Observatory 2026–2030'}
          </div>
          <h2 className="mt-2 font-display text-2xl font-bold text-pine-950 sm:text-3xl">
            {isFr ? 'Profils Pays & Directives Décisionnelles (10 Pays)' : 'Country Profiles & Strategic Directives (10 Countries)'}
          </h2>
          <p className="mt-1 max-w-2xl text-[14px] text-pine-900/75 sm:text-[15px]">
            {isFr
              ? 'Fiches de synthèse décisionnelles (One-Pagers) pour 10 pays d’Afrique francophone : données épidémiologiques, résistance génomique et 3 recommandations prioritaires du Dr. Dagnon.'
              : 'Actionable country One-Pagers across 10 Francophone African nations: epidemiological burden, resistance genomics, and Dr. Dagnon’s 3 strategic priority directives.'}
          </p>
        </div>

        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-2 rounded-full bg-pine-950 px-5 py-2.5 text-[13px] font-semibold text-gold-300 shadow-md transition-all hover:bg-pine-900 hover:text-gold-200"
          aria-label={isFr ? 'Imprimer la fiche pays' : 'Print country brief'}
        >
          <Printer size={15} />
          {isFr ? 'Imprimer le One-Pager' : 'Print One-Pager'}
        </button>
      </div>

      {/* Country Selector Tabs */}
      <div className="mt-8">
        <label className="text-[12.5px] font-semibold tracking-wider text-pine-900/80 uppercase">
          {isFr ? 'Sélectionnez un pays d’Afrique francophone :' : 'Select a Francophone African nation:'}
        </label>
        <div className="mt-3 flex flex-wrap gap-2">
          {COUNTRY_PROFILES.map((c) => {
            const isSelected = c.id === selectedCountry.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCountry(c)}
                className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-[13px] font-medium transition-all ${
                  isSelected
                    ? 'border-gold-500 bg-pine-950 text-gold-300 shadow-md ring-2 ring-gold-400/30'
                    : 'border-pine-900/15 bg-pine-50/50 text-pine-900 hover:border-gold-500/40 hover:bg-pine-100'
                }`}
                aria-pressed={isSelected}
              >
                <span className="text-base">{c.flag}</span>
                <span>{c.name[lang]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Country Card / One-Pager View */}
      <div className="mt-8 rounded-2xl border border-pine-900/10 bg-pine-50/60 p-6 sm:p-8">
        {/* Country Header Info */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-pine-900/10 pb-5">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{selectedCountry.flag}</span>
            <div>
              <h3 className="font-display text-2xl font-bold text-pine-950 sm:text-3xl">
                {selectedCountry.name[lang]}
              </h3>
              <p className="text-[13px] text-pine-700">
                {isFr ? 'Capitale :' : 'Capital:'} <span className="font-medium text-pine-900">{selectedCountry.capital}</span> ·{' '}
                {isFr ? 'Population :' : 'Population:'} <span className="font-medium text-pine-900">{selectedCountry.population}</span> ·{' '}
                {isFr ? 'Complétude DHIS2 :' : 'DHIS2 Reporting:'}{' '}
                <span className="font-mono font-semibold text-emerald-700">{selectedCountry.epiData.dhis2ReportingRate}</span>
              </p>
            </div>
          </div>
          <div className="rounded-xl border border-pine-900/10 bg-white px-4 py-2 text-right shadow-sm">
            <div className="text-[11px] font-medium text-pine-600 uppercase">{isFr ? 'Cas Estimés / An' : 'Annual Cases'}</div>
            <div className="font-mono text-xl font-bold text-pine-950">{selectedCountry.epiData.annualCasesEstimated}</div>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* 1. Épidémiologie */}
          <div className="rounded-xl border border-pine-900/10 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 text-gold-700 font-semibold text-[13px] uppercase">
              <Activity size={15} />
              <span>{isFr ? 'Charge Palustre' : 'Epidemiology'}</span>
            </div>
            <div className="mt-3 space-y-2 text-[12.5px] text-pine-800">
              <div>
                <span className="text-pine-600">{isFr ? 'Incidence :' : 'Incidence:'}</span>{' '}
                <span className="font-mono font-bold text-pine-950">{selectedCountry.epiData.incidencePer1000}</span> / 1 000 hab
              </div>
              <div>
                <span className="text-pine-600">{isFr ? 'Mortalité < 5 ans :' : 'Under-5 Mortality:'}</span>{' '}
                <span className="font-mono font-bold text-pine-950">{selectedCountry.epiData.under5MortalityPer1000}</span> ‰
              </div>
            </div>
          </div>

          {/* 2. Résistance Génomique */}
          <div className="rounded-xl border border-pine-900/10 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 text-rose-700 font-semibold text-[13px] uppercase">
              <Dna size={15} />
              <span>{isFr ? 'Génomique & Mutations' : 'Resistance Genomics'}</span>
            </div>
            <div className="mt-3 space-y-1.5 text-[12px] text-pine-800">
              <div>
                <span className="text-pine-600">kdr :</span> <span className="font-medium text-pine-950">{selectedCountry.resistanceProfile.kdrFrequency}</span>
              </div>
              <div>
                <span className="text-pine-600">CYP6P3 :</span> <span className="font-medium text-pine-950">{selectedCountry.resistanceProfile.cyp6p3Status}</span>
              </div>
              <div>
                <span className="text-pine-600">pfhrp2/3 :</span> <span className="font-medium text-pine-950">{selectedCountry.resistanceProfile.pfhrp2Deletions}</span>
              </div>
              <div>
                <span className="text-pine-600">Kelch13 :</span> <span className="font-medium text-pine-950">{selectedCountry.resistanceProfile.kelch13Status}</span>
              </div>
            </div>
          </div>

          {/* 3. Outils & Stratégie */}
          <div className="rounded-xl border border-pine-900/10 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 text-pine-700 font-semibold text-[13px] uppercase">
              <ShieldAlert size={15} />
              <span>{isFr ? 'Outils Déployés' : 'Intervention Mix'}</span>
            </div>
            <div className="mt-3 space-y-1.5 text-[12px] text-pine-800">
              <div>
                <span className="font-medium text-pine-950">{selectedCountry.nationalTools.vectorNetType[lang]}</span>
              </div>
              <div className="text-pine-700">
                CPS : <span className="font-medium text-pine-900">{selectedCountry.nationalTools.smcCoverage}</span>
              </div>
              <div className="text-pine-700">
                Vaccin : <span className="font-medium text-pine-900">{selectedCountry.nationalTools.vaccineStatus[lang]}</span>
              </div>
            </div>
          </div>

          {/* 4. Financements & G2G */}
          <div className="rounded-xl border border-pine-900/10 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 text-emerald-700 font-semibold text-[13px] uppercase">
              <DollarSign size={15} />
              <span>{isFr ? 'Financements & G2G' : 'Funding & G2G'}</span>
            </div>
            <div className="mt-3 space-y-1.5 text-[12px] text-pine-800">
              <div>
                <span className="text-pine-600">Fonds Mondial :</span> <span className="font-medium text-pine-950">{selectedCountry.fundingMix.globalFund}</span>
              </div>
              <div>
                <span className="text-pine-600">USAID/PMI :</span> <span className="font-medium text-pine-950">{selectedCountry.fundingMix.usaidPmi}</span>
              </div>
              <div>
                <span className="text-pine-600">Budget national :</span> <span className="font-medium text-emerald-800 font-mono font-semibold">{selectedCountry.fundingMix.domesticBudget}</span>
              </div>
              <div className="mt-2 text-[11px] text-pine-700 font-medium border-t border-pine-900/10 pt-1.5">
                {selectedCountry.nationalTools.g2gStatus[lang]}
              </div>
            </div>
          </div>
        </div>

        {/* 3 Strategic Directives from Dr. Dagnon */}
        <div className="mt-8 rounded-2xl border border-gold-500/30 bg-pine-950 p-6 text-white sm:p-8">
          <div className="flex items-center gap-2 text-gold-400">
            <Sparkles size={18} />
            <h4 className="font-display text-lg font-bold tracking-wide uppercase sm:text-xl">
              {isFr
                ? `3 Directives Stratégiques 2026–2030 du Dr. Dagnon pour le ${selectedCountry.name.fr}`
                : `Dr. Dagnon’s 3 Strategic Priority Directives for ${selectedCountry.name.en} (2026–2030)`}
            </h4>
          </div>

          <div className="mt-6 space-y-4">
            {selectedCountry.strategicDirectives.map((d, i) => (
              <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <h5 className="font-display text-[15px] font-semibold text-gold-300">
                  {d.title[lang]}
                </h5>
                <p className="mt-2 text-[13px] leading-relaxed text-pine-200/90">
                  {d.action[lang]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
