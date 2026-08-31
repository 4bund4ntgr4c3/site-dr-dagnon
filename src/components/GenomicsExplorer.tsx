import { useState } from 'react';
import { Microscope, MapPin, Sparkles, Activity, Dna } from 'lucide-react';
import { useLang } from '@/i18n/useLang';
import { GENOMICS_MARKERS, type GenomicsMarker } from '@/data/genomics';

export function GenomicsExplorer() {
  const { lang } = useLang();
  const isFr = lang === 'fr';

  const [selectedMarker, setSelectedMarker] = useState<GenomicsMarker>(GENOMICS_MARKERS[0]);

  const getThreatBadge = (level: GenomicsMarker['threatLevel']) => {
    switch (level) {
      case 'critical':
        return <span className="rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 font-mono text-[10px] font-bold px-2.5 py-0.5 uppercase">{isFr ? 'Menace Critique' : 'Critical Threat'}</span>;
      case 'high':
        return <span className="rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-[10px] font-bold px-2.5 py-0.5 uppercase">{isFr ? 'Menace Élevée' : 'High Threat'}</span>;
      default:
        return <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-[10px] font-bold px-2.5 py-0.5 uppercase">{isFr ? 'Sous Surveillance' : 'Monitored'}</span>;
    }
  };

  return (
    <div className="rounded-3xl border border-pine-800/70 bg-gradient-to-b from-pine-900 to-pine-950 p-6 shadow-2xl lg:p-10">
      {/* Header */}
      <div className="border-b border-white/10 pb-8">
        <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-300">
          <Dna size={13} />
          {isFr ? 'Génomique & Surveillance Moléculaire' : 'Molecular & Genomics Surveillance'}
        </span>
        <h3 className="mt-3 font-display text-2xl font-semibold text-pine-100 sm:text-3xl">
          {isFr ? 'Explorateur de Données Génomiques & Résistance' : 'Genomics & Resistance Data Explorer'}
        </h3>
        <p className="mt-2 max-w-2xl text-[14px] text-pine-200/80 leading-relaxed">
          {isFr
            ? 'Visualisation des mutations génétiques de Plasmodium falciparum et des mécanismes de résistance vectorielle en Afrique subsaharienne.'
            : 'Interactive tracking of Plasmodium falciparum genomic mutations, diagnostic escape, and vector resistance mechanisms.'}
        </p>
      </div>

      {/* Marker Selector Tabs */}
      <div className="mt-6 flex flex-wrap gap-2.5">
        {GENOMICS_MARKERS.map((m) => {
          const active = selectedMarker.id === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setSelectedMarker(m)}
              className={`rounded-xl px-4 py-2.5 text-xs font-semibold transition-all text-left ${
                active
                  ? 'bg-gold-500 text-pine-950 font-bold shadow-lg shadow-gold-500/20 scale-[1.01]'
                  : 'border border-white/10 bg-pine-950/70 text-pine-200 hover:border-gold-400/40 hover:text-pine-100'
              }`}
            >
              <p className="text-[10px] uppercase font-mono tracking-wider opacity-75">{m.scientificName.split('(')[0]}</p>
              <p className="font-bold truncate max-w-xs">{m.title[lang]}</p>
            </button>
          );
        })}
      </div>

      {/* Selected Marker Detailed Sheet */}
      <div className="mt-8 rounded-2xl border border-white/10 bg-pine-950/90 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs text-gold-400 font-semibold">{selectedMarker.scientificName}</span>
              {getThreatBadge(selectedMarker.threatLevel)}
            </div>
            <h4 className="font-display text-2xl font-bold text-pine-100">{selectedMarker.title[lang]}</h4>
          </div>
        </div>

        {/* Mechanism & Biological Impact */}
        <div className="mt-6">
          <h5 className="text-xs font-bold uppercase tracking-wider text-pine-300 flex items-center gap-1.5 mb-2">
            <Microscope size={14} className="text-gold-400" />
            {isFr ? 'Mécanisme Biologique & Conséquences Cliniques' : 'Biological Mechanism & Clinical Impact'}
          </h5>
          <p className="text-xs sm:text-sm text-pine-100 leading-relaxed bg-pine-900/40 p-4 rounded-xl border border-white/5">
            {selectedMarker.mechanism[lang]}
          </p>
        </div>

        {/* 2-Columns: Data Points (Left) & Hotspots (Right) */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {/* Left: Regional Surveillance Data Points */}
          <div className="rounded-xl border border-white/10 bg-pine-900/60 p-4">
            <h5 className="text-xs font-bold uppercase tracking-wider text-pine-300 flex items-center gap-1.5 mb-3">
              <Activity size={14} className="text-gold-400" />
              {isFr ? 'Données de Prévalence Régionale' : 'Regional Prevalence Metrics'}
            </h5>
            <div className="space-y-2.5">
              {selectedMarker.dataPoints.map((dp, idx) => (
                <div key={idx} className="flex justify-between items-center bg-pine-950/80 p-2.5 rounded-lg border border-white/5">
                  <span className="text-xs font-semibold text-pine-200">{dp.region}</span>
                  <span className="text-xs font-mono text-gold-300">{dp.prevalence}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Geographical Hotspots */}
          <div className="rounded-xl border border-white/10 bg-pine-900/60 p-4">
            <h5 className="text-xs font-bold uppercase tracking-wider text-pine-300 flex items-center gap-1.5 mb-3">
              <MapPin size={14} className="text-gold-400" />
              {isFr ? 'Foyers Épidémiologiques Surveillés' : 'Sentinel Hotspots Tracked'}
            </h5>
            <ul className="space-y-2">
              {selectedMarker.geographicalHotspots[lang].map((spot, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-pine-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold-400 mt-1.5 shrink-0" />
                  <span>{spot}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Operational Response Protocol Callout */}
        <div className="mt-6 rounded-2xl border border-gold-500/40 bg-gold-500/10 p-5">
          <p className="text-xs font-bold text-gold-300 uppercase tracking-wider flex items-center gap-2 mb-1.5">
            <Sparkles size={14} className="text-gold-400" />
            {isFr ? 'Directives & Réponse Opérationnelle Recommandée :' : 'Operational Response Guidelines:'}
          </p>
          <p className="text-xs sm:text-sm text-pine-100 italic leading-relaxed">
            « {selectedMarker.operationalResponse[lang]} »
          </p>
          <p className="text-[11px] font-semibold text-gold-400/90 mt-2 font-display">
            — Protocole de surveillance translationnelle Dr. Seynudé Jean-Fortuné DAGNON
          </p>
        </div>
      </div>
    </div>
  );
}
