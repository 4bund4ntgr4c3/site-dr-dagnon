import { useState } from 'react';
import { Globe2, ShieldCheck, Sparkles, Syringe, Layers, Database, DollarSign } from 'lucide-react';
import { useLang } from '@/i18n/useLang';
import { COUNTRY_BENCHMARKS, type CountryPolicy } from '@/data/benchmark';

export function CountryPolicyBenchmark() {
  const { lang } = useLang();
  const isFr = lang === 'fr';

  const [selectedCountry, setSelectedCountry] = useState<CountryPolicy>(COUNTRY_BENCHMARKS[0]);

  const getStatusBadge = (status: 'optimal' | 'intermediate' | 'basic' | 'active' | 'in_progress' | 'planned' | 'none') => {
    switch (status) {
      case 'optimal':
      case 'active':
        return <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-[10px] font-bold px-2 py-0.5 uppercase">{isFr ? 'Avancé' : 'Advanced'}</span>;
      case 'intermediate':
      case 'in_progress':
        return <span className="rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-[10px] font-bold px-2 py-0.5 uppercase">{isFr ? 'En cours' : 'In progress'}</span>;
      case 'planned':
        return <span className="rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-300 font-mono text-[10px] font-bold px-2 py-0.5 uppercase">{isFr ? 'Planifié' : 'Planned'}</span>;
      default:
        return <span className="rounded-full bg-pine-800 text-pine-400 font-mono text-[10px] font-bold px-2 py-0.5 uppercase">{isFr ? 'N/A' : 'N/A'}</span>;
    }
  };

  return (
    <div className="rounded-3xl border border-pine-800/70 bg-gradient-to-b from-pine-900 to-pine-950 p-6 shadow-2xl lg:p-10">
      {/* Header */}
      <div className="border-b border-white/10 pb-8">
        <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-300">
          <Globe2 size={13} />
          {isFr ? 'Benchmark Régional & Politiques Publiques' : 'Regional Policy Benchmark'}
        </span>
        <h3 className="mt-3 font-display text-2xl font-semibold text-pine-100 sm:text-3xl">
          {isFr ? 'Comparateur de Politiques Sanitaires en Afrique' : 'African National Malaria Policy Benchmark'}
        </h3>
        <p className="mt-2 max-w-2xl text-[14px] text-pine-200/80 leading-relaxed">
          {isFr
            ? 'Évaluation comparative des standards antipaludiques, de la digitalisation et des financements directs G2G à travers 6 pays clés.'
            : 'Comparative benchmark of vector control standards, data maturity, and direct G2G award mechanisms across 6 key countries.'}
        </p>
      </div>

      {/* Country Selector Pills */}
      <div className="mt-6 flex flex-wrap gap-2.5">
        {COUNTRY_BENCHMARKS.map((c) => {
          const active = selectedCountry.id === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCountry(c)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
                active
                  ? 'bg-gold-500 text-pine-950 font-bold shadow-lg shadow-gold-500/20 scale-[1.02]'
                  : 'border border-white/10 bg-pine-950/70 text-pine-200 hover:border-gold-400/40 hover:text-pine-100'
              }`}
            >
              <span className="text-base">{c.flag}</span>
              <span>{c.name[lang]}</span>
              <span className="text-[11px] opacity-75 font-mono">({c.population})</span>
            </button>
          );
        })}
      </div>

      {/* Country Strategic Dossier Sheet */}
      <div className="mt-8 rounded-2xl border border-white/10 bg-pine-950/90 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-3.5">
            <span className="text-4xl sm:text-5xl">{selectedCountry.flag}</span>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-display text-2xl font-bold text-pine-100">{selectedCountry.name[lang]}</h4>
                <span className="rounded bg-white/10 px-2 py-0.5 text-[11px] font-mono text-gold-300">
                  {selectedCountry.population} {isFr ? 'hab.' : 'pop.'}
                </span>
              </div>
              <p className="text-xs text-pine-300/80 mt-0.5">
                {isFr ? 'Dossier stratégique & Alignement OMS' : 'Strategic Profile & WHO Alignment'}
              </p>
            </div>
          </div>
        </div>

        {/* 5 Policy Pillars Grid */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Pillar 1: Nets */}
          <div className="rounded-xl border border-white/10 bg-pine-900/60 p-4">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-semibold text-pine-200 flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-gold-400" />
                {isFr ? 'Moustiquaires (MILDA)' : 'Mosquito Nets (LLINs)'}
              </span>
              {getStatusBadge(selectedCountry.netsType.status)}
            </div>
            <p className="text-xs text-pine-100 leading-relaxed">{selectedCountry.netsType[lang]}</p>
          </div>

          {/* Pillar 2: SMC */}
          <div className="rounded-xl border border-white/10 bg-pine-900/60 p-4">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-semibold text-pine-200 flex items-center gap-1.5">
                <Layers size={14} className="text-gold-400" />
                {isFr ? 'Chimioprévention (CPS)' : 'Chemoprevention (SMC)'}
              </span>
              {getStatusBadge(selectedCountry.smcProtocol.status)}
            </div>
            <p className="text-xs text-pine-100 leading-relaxed">{selectedCountry.smcProtocol[lang]}</p>
          </div>

          {/* Pillar 3: DHIS2 */}
          <div className="rounded-xl border border-white/10 bg-pine-900/60 p-4">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-semibold text-pine-200 flex items-center gap-1.5">
                <Database size={14} className="text-gold-400" />
                {isFr ? 'Digitalisation DHIS2' : 'DHIS2 Digitalization'}
              </span>
              {getStatusBadge(selectedCountry.dhis2Maturity.status)}
            </div>
            <p className="text-xs text-pine-100 leading-relaxed">{selectedCountry.dhis2Maturity[lang]}</p>
          </div>

          {/* Pillar 4: G2G Funding */}
          <div className="rounded-xl border border-white/10 bg-pine-900/60 p-4">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-semibold text-pine-200 flex items-center gap-1.5">
                <DollarSign size={14} className="text-gold-400" />
                {isFr ? 'Financement Direct G2G' : 'Direct G2G Grants'}
              </span>
              {getStatusBadge(selectedCountry.g2gStatus.status)}
            </div>
            <p className="text-xs text-pine-100 leading-relaxed">{selectedCountry.g2gStatus[lang]}</p>
          </div>

          {/* Pillar 5: Vaccine */}
          <div className="rounded-xl border border-white/10 bg-pine-900/60 p-4 sm:col-span-2 lg:col-span-2">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-semibold text-pine-200 flex items-center gap-1.5">
                <Syringe size={14} className="text-gold-400" />
                {isFr ? 'Vaccination (R21 / RTS,S)' : 'Vaccination (R21 / RTS,S)'}
              </span>
              {getStatusBadge(selectedCountry.vaccineRollout.status)}
            </div>
            <p className="text-xs text-pine-100 leading-relaxed">{selectedCountry.vaccineRollout[lang]}</p>
          </div>
        </div>

        {/* Dr. Dagnon Country Strategy Recommendation */}
        <div className="mt-6 rounded-2xl border border-gold-500/40 bg-gold-500/10 p-5">
          <p className="text-xs font-bold text-gold-300 uppercase tracking-wider flex items-center gap-2 mb-1.5">
            <Sparkles size={14} className="text-gold-400" />
            {isFr ? `Recommandation Stratégique pour ${selectedCountry.name.fr} :` : `Strategic Roadmap for ${selectedCountry.name.en}:`}
          </p>
          <p className="text-xs sm:text-sm text-pine-100 italic leading-relaxed">
            « {selectedCountry.dagnonRecommendation[lang]} »
          </p>
          <p className="text-[11px] font-semibold text-gold-400/90 mt-2 font-display">
            — Dr. Seynudé Jean-Fortuné DAGNON, Senior Program Officer (Fondation Bill & Melinda Gates)
          </p>
        </div>
      </div>
    </div>
  );
}
