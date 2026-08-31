export interface RadarItem {
  id: string;
  category: 'vaccines' | 'vector' | 'genetics' | 'funding' | 'climate';
  date: string;
  source: string;
  sourceUrl: string;
  title: {
    fr: string;
    en: string;
  };
  summary: {
    fr: string;
    en: string;
  };
  analysis: {
    fr: string;
    en: string;
  };
  impactLevel: 'high' | 'breakthrough' | 'strategic';
  badge: {
    fr: string;
    en: string;
  };
}

export const RADAR_ITEMS: RadarItem[] = [
  {
    id: 'r21-matrix-m-scaleup',
    category: 'vaccines',
    date: '2026-06',
    source: 'OMS / Gavi / UNICEF',
    sourceUrl: 'https://www.who.int/news-room/fact-sheets/detail/malaria',
    impactLevel: 'breakthrough',
    badge: {
      fr: 'Vaccin de 2e Génération',
      en: '2nd Gen Vaccine',
    },
    title: {
      fr: 'Déploiement massif du vaccin R21/Matrix-M en Afrique de l’Ouest',
      en: 'Mass rollout of R21/Matrix-M malaria vaccine across West Africa',
    },
    summary: {
      fr: 'Plus de 15 millions de doses du vaccin R21/Matrix-M allouées à 8 pays africains à haute transmission, assurant une couverture élargie à coût réduit ($3.90 par dose).',
      en: 'Over 15 million doses of R21/Matrix-M vaccine allocated to 8 high-transmission African countries, delivering expanded coverage at a reduced price ($3.90 per dose).',
    },
    analysis: {
      fr: 'Le vaccin ne remplace pas la lutte antivectorielle : l’impact maximal réside dans la synergie stricte entre vaccination des nourrissons et campagnes de moustiquaires Dual-AI.',
      en: 'Vaccines do not replace vector control: maximum impact relies on strict programmatic synergy between infant vaccination and Next-Gen Dual-AI net campaigns.',
    },
  },
  {
    id: 'dual-ai-pyrethroid-resistance',
    category: 'vector',
    date: '2026-05',
    source: 'The Lancet Infectious Diseases / New Nets Project',
    sourceUrl: 'https://www.thelancet.com/journals/laninf',
    impactLevel: 'high',
    badge: {
      fr: 'Lutte Antivectorielle',
      en: 'Vector Control',
    },
    title: {
      fr: 'Confirmation de la supériorité des moustiquaires Chlorfenapyr + Pyréthrinoïde',
      en: 'Evidence confirms superiority of Chlorfenapyr + Pyrethroid Dual-AI nets',
    },
    summary: {
      fr: 'Les essais multicentriques confirment une réduction supplémentaire de 45% de l’incidence palustre chez les enfants par rapport aux moustiquaires standards en zone de forte résistance.',
      en: 'Multi-country trials confirm an additional 45% reduction in child malaria incidence compared to standard nets in high-resistance settings.',
    },
    analysis: {
      fr: 'La transition totale vers les MILDA à double principe actif doit devenir le standard d’approvisionnement par défaut pour les allocations Fonds Mondial et USAID/PMI.',
      en: 'Transitioning entirely to dual-active ingredient nets must become the default procurement standard for Global Fund and USAID/PMI country grants.',
    },
  },
  {
    id: 'hrp2-hrp3-gene-deletions',
    category: 'genetics',
    date: '2026-04',
    source: 'World Health Organization (WHO) Surveillance',
    sourceUrl: 'https://www.who.int/teams/global-malaria-programme',
    impactLevel: 'high',
    badge: {
      fr: 'Surveillance Moléculaire',
      en: 'Molecular Surveillance',
    },
    title: {
      fr: 'Propagation des délétions des gènes pfhrp2/3 et faux négatifs des TDR',
      en: 'Spread of pfhrp2/3 gene deletions and Rapid Diagnostic Test false negatives',
    },
    summary: {
      fr: 'Augmentation des souches de P. falciparum dépourvues des gènes HRP2/3 dans le bassin de la Corne de l’Afrique et émergence surveillée en Afrique centrale et de l’Ouest.',
      en: 'Rise of P. falciparum strains lacking HRP2/3 genes across the Horn of Africa with active surveillance expanding into Central and West Africa.',
    },
    analysis: {
      fr: 'Nécessité urgente pour les programmes nationaux d’intégrer des TDR non-HRP2 (basés sur la pLDH) et d’outiller les laboratoires nationaux pour le séquençage génomique régulier.',
      en: 'Urgent necessity for national programs to adopt non-HRP2 RDTs (pLDH-based) and equip national central laboratories with routine genomic surveillance capacity.',
    },
  },
  {
    id: 'g2g-direct-financing-expansion',
    category: 'funding',
    date: '2026-03',
    source: 'USAID / Fonds Mondial / PEPFAR Policy Memo',
    sourceUrl: 'https://www.usaid.gov/global-health',
    impactLevel: 'strategic',
    badge: {
      fr: 'Financement Direct G2G',
      en: 'G2G Direct Funding',
    },
    title: {
      fr: 'Expansion des mécanismes de financement direct d’État à État (G2G)',
      en: 'Expansion of Government-to-Government (G2G) Direct Financing Mechanisms',
    },
    summary: {
      fr: 'Renforcement de la localisation de l’aide internationale : plus de 35% des fonds bilatéraux de santé sont désormais directement transférés aux Trésors publics partenaires.',
      en: 'Localization shift in international aid: over 35% of bilateral health assistance is now directly channeled through partner national public treasuries.',
    },
    analysis: {
      fr: 'Le succès du modèle béninois de contrat direct démontre que l’alignement sur les procédures nationales accélère le décaissement tout en consolidant la souveraineté sanitaire.',
      en: 'The success of the Benin direct contract model demonstrates that relying on national country systems speeds execution while cementing health sovereignty.',
    },
  },
  {
    id: 'climate-anomaly-malaria-fronts',
    category: 'climate',
    date: '2026-01',
    source: 'Nature Climate Change / Africa CDC',
    sourceUrl: 'https://africacdc.org',
    impactLevel: 'high',
    badge: {
      fr: 'Climat & Épidémies',
      en: 'Climate & Outbreaks',
    },
    title: {
      fr: 'Altération des cycles de transmission palustre due aux anomalies pluviométriques',
      en: 'Disruption of malaria transmission cycles driven by rainfall anomalies',
    },
    summary: {
      fr: 'Les vagues de chaleur et les inondations imprévues étendent la période épidémique dans les zones sahéliennes jusqu’en décembre, rendant obsolètes les calendriers fixes.',
      en: 'Unseasonal heatwaves and flooding are extending epidemic transmission periods in Sahelian zones into December, rendering rigid historical schedules obsolete.',
    },
    analysis: {
      fr: 'Les protocoles de CPS doivent impérativement passer d’un calendrier fixe de 4 cycles à une approche dynamique de 5 cycles guidée par les alertes météorologiques et DHIS2.',
      en: 'SMC chemoprevention protocols must urgently transition from rigid 4-cycle schedules to dynamic 5-cycle deployments triggered by weather models and real-time DHIS2 data.',
    },
  },
];
