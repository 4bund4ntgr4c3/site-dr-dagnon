import { useState } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useLang } from '@/i18n/useLang';
import { localePath } from '@/i18n/routing';

interface CountryImpact {
  id: string;
  name: { fr: string; en: string };
  role: { fr: string; en: string };
  category: 'all' | 'digital' | 'smc' | 'vector' | 'funding';
  flag: string;
  stats: {
    label: { fr: string; en: string };
    value: string;
  }[];
  summary: { fr: string; en: string };
  highlights: { fr: string[]; en: string[] };
  partners: string[];
  projectSlug?: string;
  coords: { x: number; y: number }; // Relative position on Africa map [0-100]
}

const COUNTRIES: CountryImpact[] = [
  {
    id: 'benin',
    name: { fr: 'Bénin', en: 'Benin' },
    role: { fr: 'Opérations majeures, Digitalisation & Contrat G2G USAID', en: 'Major Operations, Digitization & USAID G2G Contract' },
    category: 'digital',
    flag: '🇧🇯',
    coords: { x: 44, y: 47 },
    stats: [
      { label: { fr: 'Centres de santé équipés', en: 'Health facilities equipped' }, value: '1 114' },
      { label: { fr: 'Moustiquaires distribuées', en: 'LLINs distributed' }, value: '3.2M' },
      { label: { fr: 'Budget programmes géré', en: 'Program budget managed' }, value: '$180M' },
    ],
    summary: {
      fr: 'Leader de la digitalisation des campagnes MILDA, mise en œuvre du contrat direct G2G USAID/PNLP et renforcement du DHIS2 national.',
      en: 'Led nationwide LLIN campaign digitization, direct USAID/NMCP G2G contract implementation, and national DHIS2 strengthening.',
    },
    highlights: {
      fr: [
        'Complétude des données sanitaires portée de 35% à 94%',
        'Supervision du contrat G2G direct PNLP Bénin / USAID (20M$)',
        'Campagnes de pulvérisation intradomiciliaire (PID) dans l’Atacora-Donga',
      ],
      en: [
        'Health data completeness raised from 35% to 94%',
        'Supervised USAID direct G2G contract for Benin NMCP ($20M)',
        'Indoor Residual Spraying (IRS) campaigns in Atacora-Donga',
      ],
    },
    partners: ['USAID / PMI', 'Ministère de la Santé du Bénin', 'Fondation Gates', 'Fonds Mondial'],
    projectSlug: 'digitalisation-milda-benin',
  },
  {
    id: 'burundi',
    name: { fr: 'Burundi', en: 'Burundi' },
    role: { fr: 'Plateforme Malariya PI & Surveillance Épidémique', en: 'Malariya PI Platform & Epidemic Surveillance' },
    category: 'digital',
    flag: '🇧🇮',
    coords: { x: 62, y: 60 },
    stats: [
      { label: { fr: 'Districts sanitaires couverts', en: 'Health districts covered' }, value: '47' },
      { label: { fr: 'Alertes épidémiques précoces', en: 'Early epidemic alerts' }, value: '100%' },
      { label: { fr: 'Décisions guidées par les données', en: 'Data-driven decisions' }, value: '+85%' },
    ],
    summary: {
      fr: 'Développement et déploiement du système intégré d’information sanitaire Malariya PI pour la détection précoce des flambées.',
      en: 'Development and rollout of the integrated Malariya PI health platform for early outbreak detection.',
    },
    highlights: {
      fr: [
        'Tableau de bord national en temps réel pour le Programme National',
        'Réduction drastique des délais d’alerte en cas de recrudescence',
        'Formation des équipes cadres de district à l’analyse spatio-temporelle',
      ],
      en: [
        'Real-time national dashboard for the National Malaria Program',
        'Drastic reduction of alert response times during outbreaks',
        'District managerial team training on spatio-temporal analysis',
      ],
    },
    partners: ['PNILP Burundi', 'OMS', 'USAID'],
    projectSlug: 'malariya-pi-burundi',
  },
  {
    id: 'burkina',
    name: { fr: 'Burkina Faso', en: 'Burkina Faso' },
    role: { fr: 'Recherche CPS & Modélisation Économique', en: 'SMC Research & Economic Modeling' },
    category: 'smc',
    flag: '🇧🇫',
    coords: { x: 38, y: 44 },
    stats: [
      { label: { fr: 'Enfants protégés par la CPS', en: 'Children protected by SMC' }, value: '1.8M+' },
      { label: { fr: 'Baisse de mortalité infanto-juvénile', en: 'Under-5 mortality drop' }, value: '-42%' },
      { label: { fr: 'Études d’impact publiées', en: 'Impact studies published' }, value: '4' },
    ],
    summary: {
      fr: 'Modélisation de l’efficacité et de la rentabilité de la Chimioprévention du Paludisme Saisonnier (CPS) en zone sahélienne.',
      en: 'Efficiency and cost-effectiveness modeling of Seasonal Malaria Chemoprevention (SMC) in Sahelian zones.',
    },
    highlights: {
      fr: [
        'Évaluation économique de l’extension du nombre de cycles de CPS',
        'Analyse de la résistance moléculaire aux antipaludiques',
        'Optimisation de la chaîne d’approvisionnement des combinaisons SP+AQ',
      ],
      en: [
        'Economic evaluation of extending the number of SMC cycles',
        'Antimalarial drug molecular resistance tracking',
        'Supply chain optimization for SP+AQ treatments',
      ],
    },
    partners: ['SMC Alliance', 'Fondation Gates', 'Université de Groningen'],
    projectSlug: 'recherche-cps-smc',
  },
  {
    id: 'senegal',
    name: { fr: 'Sénégal & Afrique de l’Ouest', en: 'Senegal & West Africa' },
    role: { fr: 'Partenariats Stratégiques Régionaux & Mobilisation', en: 'Regional Strategic Partnerships & Resource Mobilization' },
    category: 'funding',
    flag: '🇸🇳',
    coords: { x: 26, y: 43 },
    stats: [
      { label: { fr: 'Pays engagés dans le réseau', en: 'Countries engaged in network' }, value: '14' },
      { label: { fr: 'Financements catalytiques mobilisés', en: 'Catalytic funding mobilized' }, value: '$250M+' },
      { label: { fr: 'Tribunes & plaidoyers ministériels', en: 'Op-eds & ministerial advocacy' }, value: '12+' },
    ],
    summary: {
      fr: 'Coordination des investissements de la Fondation Gates pour les programmes paludisme en Afrique francophone.',
      en: 'Coordination of Gates Foundation investments for malaria programs across Francophone Africa.',
    },
    highlights: {
      fr: [
        'Plaidoyer de haut niveau pour l’élimination durable du paludisme',
        'Accompagnement des ministères de la santé dans la transition financière',
        'Promotion de la fabrication locale d’intrants de santé publique',
      ],
      en: [
        'High-level advocacy for sustainable malaria elimination',
        'Supporting Health Ministries in domestic financing transitions',
        'Promoting local manufacturing of public health commodities',
      ],
    },
    partners: ['Fondation Gates', 'Alliance for Malaria Prevention (AMP)', 'RBM Partnership'],
    projectSlug: 'contrat-g2g-pnlp-benin',
  },
  {
    id: 'nigeria',
    name: { fr: 'Nigéria', en: 'Nigeria' },
    role: { fr: 'Coordination Sous-Régionale & Recherche', en: 'Sub-Regional Coordination & Research' },
    category: 'vector',
    flag: '🇳🇬',
    coords: { x: 48, y: 48 },
    stats: [
      { label: { fr: 'Initiatives transfrontalières', en: 'Cross-border initiatives' }, value: '3' },
      { label: { fr: 'Partenaires académiques', en: 'Academic partners' }, value: '8' },
      { label: { fr: 'Veille sur la résistance aux insecticides', en: 'Insecticide resistance monitoring' }, value: 'Permanent' },
    ],
    summary: {
      fr: 'Harmonisation des protocoles de surveillance entomologique et suivi des flux transfrontaliers de lutte antivectorielle.',
      en: 'Harmonization of entomological surveillance protocols and cross-border vector control tracking.',
    },
    highlights: {
      fr: [
        'Coordination avec les centres de recherche régionaux (PAMCA)',
        'Suivi de la diffusion de nouvelles générations de moustiquaires PBO',
        'Partage de données opérationnelles inter-pays',
      ],
      en: [
        'Coordination with regional research institutes (PAMCA)',
        'Tracking the scale-up of dual-AI and PBO mosquito nets',
        'Cross-country operational data sharing',
      ],
    },
    partners: ['NMEP Nigeria', 'Gates Foundation', 'PAMCA'],
  },
];

export function AfricaImpactMap() {
  const { lang } = useLang();
  const [selectedCountry, setSelectedCountry] = useState<CountryImpact>(COUNTRIES[0]);
  const [filter, setFilter] = useState<'all' | 'digital' | 'smc' | 'vector' | 'funding'>('all');

  const filteredCountries = filter === 'all'
    ? COUNTRIES
    : COUNTRIES.filter((c) => c.category === filter || c.id === 'benin');

  return (
    <div className="rounded-3xl border border-pine-800/60 bg-gradient-to-b from-pine-900 to-pine-950 p-6 shadow-2xl lg:p-10">
      {/* Header */}
      <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-8 md:flex-row md:items-end">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-300">
            <MapPin size={13} />
            {lang === 'fr' ? 'Empreinte Continentale' : 'Continental Footprint'}
          </span>
          <h2 className="mt-3 font-display text-2xl font-semibold text-pine-100 sm:text-3xl">
            {lang === 'fr' ? 'Carte Interactive de l’Impact en Afrique' : 'Interactive Africa Impact Map'}
          </h2>
          <p className="mt-2 max-w-xl text-[14px] text-pine-200/80">
            {lang === 'fr'
              ? 'Explorez les pays d’intervention, les budgets gérés, les systèmes digitalisés et les populations protégées sous le leadership du Dr. Seynudé Dagnon.'
              : 'Explore intervention countries, managed budgets, digitized health platforms, and protected populations under Dr. Seynudé Dagnon’s leadership.'}
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2">
          {(
            [
              { id: 'all', label: { fr: 'Tous les pays', en: 'All countries' } },
              { id: 'digital', label: { fr: 'Digitalisation', en: 'Digitization' } },
              { id: 'smc', label: { fr: 'CPS / SMC', en: 'SMC Research' } },
              { id: 'funding', label: { fr: 'Stratégie & Fonds', en: 'Strategy & Funds' } },
            ] as const
          ).map((btn) => (
            <button
              key={btn.id}
              type="button"
              onClick={() => setFilter(btn.id)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                filter === btn.id
                  ? 'bg-gold-500 text-pine-950 shadow-md shadow-gold-500/20'
                  : 'border border-white/10 bg-pine-900/60 text-pine-200/70 hover:border-gold-500/40 hover:text-pine-100'
              }`}
            >
              {btn.label[lang]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Interactive Map Visual + Detail Panel */}
      <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_1fr] items-start">
        {/* Left: Interactive Country Selector Visual */}
        <div className="relative flex flex-col justify-between rounded-2xl border border-white/5 bg-pine-950/80 p-6 overflow-hidden min-h-[420px]">
          <div className="absolute top-4 right-4 flex items-center gap-2 text-[11px] text-pine-300/60 font-mono">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            {filteredCountries.length} {lang === 'fr' ? 'pôles d’impact actifs' : 'active impact hubs'}
          </div>

          {/* Stylized African Continent Layout */}
          <div className="relative my-auto py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredCountries.map((c) => {
                const active = selectedCountry.id === c.id;
                return (
                  <motion.button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCountry(c)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`group flex items-start gap-3.5 rounded-xl border p-4 text-left transition-all ${
                      active
                        ? 'border-gold-400 bg-gold-500/15 shadow-lg shadow-gold-500/10 ring-1 ring-gold-400/50'
                        : 'border-white/10 bg-pine-900/40 hover:border-white/20 hover:bg-pine-900/80'
                    }`}
                  >
                    <span className="text-2xl select-none">{c.flag}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`font-display text-sm font-semibold truncate ${active ? 'text-gold-300' : 'text-pine-100 group-hover:text-gold-200'}`}>
                          {c.name[lang]}
                        </span>
                        {active && <CheckCircle2 size={14} className="text-gold-400 shrink-0" />}
                      </div>
                      <p className="mt-1 text-[11.5px] line-clamp-1 text-pine-200/70">
                        {c.role[lang]}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          <p className="text-[11px] text-pine-300/50 text-center italic mt-4">
            {lang === 'fr' ? '← Cliquez sur un pays pour charger sa fiche opérationnelle' : '← Click a country to view detailed operational dossier'}
          </p>
        </div>

        {/* Right: Selected Country Dossier */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCountry.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col justify-between rounded-2xl border border-gold-500/25 bg-pine-900/90 p-6 lg:p-7 backdrop-blur-md shadow-xl min-h-[420px]"
          >
            <div>
              {/* Country Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selectedCountry.flag}</span>
                  <div>
                    <h3 className="font-display text-xl font-bold text-pine-100 sm:text-2xl">
                      {selectedCountry.name[lang]}
                    </h3>
                    <p className="text-[12px] font-medium text-gold-400">
                      {selectedCountry.role[lang]}
                    </p>
                  </div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="mt-5 grid grid-cols-3 gap-3">
                {selectedCountry.stats.map((s, i) => (
                  <div key={i} className="rounded-xl border border-white/5 bg-pine-950/60 p-3 text-center">
                    <p className="font-display text-lg font-bold text-gold-300 sm:text-xl">
                      {s.value}
                    </p>
                    <p className="mt-1 text-[10.5px] leading-tight text-pine-200/70">
                      {s.label[lang]}
                    </p>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <p className="mt-5 text-[13px] leading-relaxed text-pine-100/85">
                {selectedCountry.summary[lang]}
              </p>

              {/* Key Highlights */}
              <div className="mt-4 space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-pine-300">
                  {lang === 'fr' ? 'Réalisations majeures :' : 'Key achievements:'}
                </p>
                {selectedCountry.highlights[lang].map((h, i) => (
                  <div key={i} className="flex items-start gap-2 text-[12px] text-pine-200/85">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-400" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>

              {/* Partners */}
              <div className="mt-5 flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-medium text-pine-300 mr-1">
                  {lang === 'fr' ? 'Partenaires :' : 'Partners:'}
                </span>
                {selectedCountry.partners.map((p, i) => (
                  <span
                    key={i}
                    className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-pine-200"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {/* Action link */}
            {selectedCountry.projectSlug && (
              <div className="mt-6 pt-4 border-t border-white/10">
                <Link
                  to={localePath(lang, `/projets/${selectedCountry.projectSlug}`)}
                  className="group inline-flex items-center gap-2 text-xs font-semibold text-gold-300 hover:text-gold-200 transition-colors"
                >
                  <span>{lang === 'fr' ? 'Consulter l’étude de cas détaillée' : 'View full project case study'}</span>
                  <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
