import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Sparkles, ExternalLink, Search, Filter, ShieldCheck, Microscope, Globe, DollarSign, CloudSun } from 'lucide-react';
import { useLang } from '@/i18n/useLang';
import { RADAR_ITEMS, type RadarItem } from '@/data/radar';

export function MalariaRadar() {
  const { lang } = useLang();
  const isFr = lang === 'fr';

  const [category, setCategory] = useState<'all' | RadarItem['category']>('all');
  const [search, setSearch] = useState('');

  const categories = [
    { id: 'all', label: isFr ? 'Toutes les veilles' : 'All updates', icon: Globe },
    { id: 'vaccines', label: isFr ? 'Vaccins R21/RTS,S' : 'Vaccines', icon: Sparkles },
    { id: 'vector', label: isFr ? 'Lutte antivectorielle' : 'Vector Control', icon: ShieldCheck },
    { id: 'genetics', label: isFr ? 'Génomique & Résistance' : 'Genomics & Resistance', icon: Microscope },
    { id: 'funding', label: isFr ? 'Financement & G2G' : 'Funding & G2G', icon: DollarSign },
    { id: 'climate', label: isFr ? 'Climat & Épidémies' : 'Climate & Transmission', icon: CloudSun },
  ];

  const filteredItems = useMemo(() => {
    return RADAR_ITEMS.filter((item) => {
      const matchCat = category === 'all' || item.category === category;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        item.title[lang].toLowerCase().includes(q) ||
        item.summary[lang].toLowerCase().includes(q) ||
        item.analysis[lang].toLowerCase().includes(q) ||
        item.source.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [category, search, lang]);

  return (
    <div className="rounded-3xl border border-pine-800/70 bg-gradient-to-b from-pine-900 to-pine-950 p-6 shadow-2xl lg:p-10">
      {/* Header */}
      <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-8 md:flex-row md:items-end">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-300">
            <Radio size={13} className="animate-pulse text-gold-400" />
            {isFr ? 'Veille Scientifique & Stratégique' : 'Malaria Intelligence Radar'}
          </span>
          <h2 className="mt-3 font-display text-2xl font-semibold text-pine-100 sm:text-3xl">
            {isFr ? 'Radar des Avancées Mondiales sur le Paludisme' : 'Global Malaria Breakthroughs & Intelligence'}
          </h2>
          <p className="mt-2 max-w-2xl text-[14px] text-pine-200/80 leading-relaxed">
            {isFr
              ? 'Analyse critique des dernières alertes épidémiologiques, innovations vaccinales, génomiques et modèles de financement bilatéraux.'
              : 'Critical operational analysis on latest epidemiological alerts, vaccine rollouts, genomics, and bilateral financing models.'}
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pine-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isFr ? 'Rechercher une avancée...' : 'Search radar intelligence...'}
            className="w-full rounded-full border border-white/15 bg-pine-950/80 py-2 pl-9 pr-4 text-xs text-pine-100 placeholder-pine-400 focus:border-gold-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="mt-6 flex flex-wrap gap-2">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const active = category === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id as typeof category)}
              className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                active
                  ? 'bg-gold-500 text-pine-950 shadow-md shadow-gold-500/20 font-bold'
                  : 'border border-white/10 bg-white/5 text-pine-200 hover:border-gold-400/40 hover:text-pine-100'
              }`}
            >
              <Icon size={14} className={active ? 'text-pine-950' : 'text-gold-400'} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Radar Cards Feed */}
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col justify-between rounded-2xl border border-white/10 bg-pine-950/80 p-6 backdrop-blur-md shadow-lg hover:border-gold-400/40 transition-colors"
            >
              <div>
                {/* Badge + Date + Source */}
                <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-3">
                  <span className="rounded-full bg-gold-500/15 border border-gold-500/30 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-gold-300">
                    {item.badge[lang]}
                  </span>
                  <span className="text-[11.5px] font-mono text-pine-400">{item.date}</span>
                </div>

                {/* Title */}
                <h3 className="mt-4 font-display text-lg font-bold text-pine-100 leading-snug">
                  {item.title[lang]}
                </h3>

                {/* Summary */}
                <p className="mt-2 text-xs leading-relaxed text-pine-200/80">
                  {item.summary[lang]}
                </p>

                {/* Dr. Dagnon Expert Takeaway Callout */}
                <div className="mt-4 rounded-xl border border-gold-500/30 bg-gold-500/10 p-3.5 text-xs text-pine-100">
                  <p className="font-semibold text-gold-300 flex items-center gap-1.5 mb-1 text-[11.5px] uppercase tracking-wider">
                    <Sparkles size={13} className="text-gold-400 shrink-0" />
                    {isFr ? 'L’Analyse du Dr. Seynudé Dagnon :' : 'Dr. Seynudé Dagnon’s Takeaway:'}
                  </p>
                  <p className="italic text-pine-200/90 leading-relaxed">
                    « {item.analysis[lang]} »
                  </p>
                </div>
              </div>

              {/* Source Link */}
              <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-[11.5px] text-pine-400">
                <span className="font-medium text-pine-300">Source : {item.source}</span>
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-gold-400 hover:text-gold-300 font-semibold transition-colors"
                >
                  <span>{isFr ? 'Consulter' : 'View report'}</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredItems.length === 0 && (
        <div className="mt-8 rounded-2xl border border-white/10 bg-pine-950/60 p-8 text-center text-pine-300 text-xs">
          <Filter size={24} className="mx-auto mb-2 text-gold-400 opacity-60" />
          <p>{isFr ? 'Aucune veille ne correspond à vos critères de recherche.' : 'No radar intelligence found matching your criteria.'}</p>
        </div>
      )}
    </div>
  );
}
