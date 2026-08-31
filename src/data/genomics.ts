export interface GenomicsMarker {
  id: string;
  category: 'vector' | 'diagnostic' | 'drug';
  title: { fr: string; en: string };
  scientificName: string;
  mechanism: { fr: string; en: string };
  geographicalHotspots: { fr: string[]; en: string[] };
  threatLevel: 'critical' | 'high' | 'monitored';
  dataPoints: {
    region: string;
    prevalence: string;
    trend: 'up' | 'stable' | 'down';
  }[];
  operationalResponse: { fr: string; en: string };
}

export const GENOMICS_MARKERS: GenomicsMarker[] = [
  {
    id: 'pyrethroid-resistance-kdr',
    category: 'vector',
    scientificName: 'Anopheles gambiae s.l. (kdr L1014F & CYP6P3)',
    title: {
      fr: 'Résistance Métabolique & Mutation Kdr aux Pyréthrinoïdes',
      en: 'Pyrethroid Metabolic & Kdr Vector Resistance',
    },
    mechanism: {
      fr: 'Surexpression d’enzymes cytochromes P450 et mutation du canal sodique voltage-dépendant réduisant la mortalité des moustiques exposés aux pyréthrinoïdes simples à moins de 20%.',
      en: 'Overexpression of cytochrome P450 enzymes and voltage-gated sodium channel mutations reducing plain pyrethroid mosquito bioassay mortality below 20%.',
    },
    geographicalHotspots: {
      fr: ['Bénin (Ouémé, Mono, Atlantique)', 'Burkina Faso (Vallée du Kou)', 'Nigéria (Sud & Centre)'],
      en: ['Benin (Oueme, Mono, Atlantique)', 'Burkina Faso (Kou Valley)', 'Nigeria (South & Central)'],
    },
    threatLevel: 'critical',
    dataPoints: [
      { region: 'Bénin Sud', prevalence: '> 85% de survie aux pyréthrinoïdes', trend: 'up' },
      { region: 'Burkina Faso Ouest', prevalence: '> 90% de résistance kdr/CYP', trend: 'up' },
      { region: 'Sénégal Est', prevalence: '35% à 50% de résistance émergente', trend: 'up' },
    ],
    operationalResponse: {
      fr: 'Remplacement immédiat et à 100% des moustiquaires simples par des MILDA Dual-AI (Chlorfenapyr + Alpha-cyperméthrine ou PBO) et pulvérisation ciblée de Pirimiphos-méthyle.',
      en: 'Immediate 100% replacement of plain pyrethroid nets with Dual-AI nets (Chlorfenapyr + Alpha-cypermethrin or PBO) and targeted rotation with Pirimiphos-methyl IRS.',
    },
  },
  {
    id: 'pfhrp2-pfhrp3-gene-deletions',
    category: 'diagnostic',
    scientificName: 'Plasmodium falciparum (pfhrp2 / pfhrp3 deletions)',
    title: {
      fr: 'Délétion des Gènes HRP2/HRP3 & Échappement aux TDR',
      en: 'pfhrp2/3 Gene Deletions & Diagnostic Escape',
    },
    mechanism: {
      fr: 'Absence d’expression de la protéine HRP2 chez P. falciparum, entraînant des résultats faussement négatifs lors des tests de diagnostic rapide (TDR) standards.',
      en: 'Loss of HRP2 antigen expression in P. falciparum parasites, triggering false-negative test results on standard HRP2-based Rapid Diagnostic Tests (RDTs).',
    },
    geographicalHotspots: {
      fr: ['Érythrée, Éthiopie, Soudan (> 10% de délétion)', 'Afrique centrale et de l’Ouest (foyers émergents sous surveillance)'],
      en: ['Eritrea, Ethiopia, Sudan (> 10% deletion)', 'Central & West Africa (emerging sentinel sites under tracking)'],
    },
    threatLevel: 'high',
    dataPoints: [
      { region: 'Corne de l’Afrique', prevalence: '12% à 25% de faux négatifs TDR', trend: 'up' },
      { region: 'Bassin du Congo', prevalence: '1% à 3% de délétions détectées', trend: 'stable' },
      { region: 'Afrique de l’Ouest', prevalence: '< 1% (Surveillance sentinelle active)', trend: 'stable' },
    ],
    operationalResponse: {
      fr: 'Introduction de tests TDR double antigène combinant HRP2 et pLDH (Pan-LDH / Pf-LDH) et équipement des laboratoires de référence nationaux pour le séquençage PCR de routine.',
      en: 'Introduction of dual-antigen RDTs targeting both HRP2 and pLDH (Pan-LDH / Pf-LDH) and equipping national reference labs for routine PCR sequencing.',
    },
  },
  {
    id: 'kelch13-artemisinin-resistance',
    category: 'drug',
    scientificName: 'Plasmodium falciparum (Kelch13 mutations C580Y / R561H)',
    title: {
      fr: 'Mutations Kelch13 & Résistance Partielle à l’Artémisinine',
      en: 'Kelch13 Mutations & Partial Artemisinin Resistance',
    },
    mechanism: {
      fr: 'Mutations non synonymes dans le domaine hélice du gène K13 induisant une clairance parasitaire retardée après administration de dérivés d’artémisinine (ACT).',
      en: 'Non-synonymous mutations in the propeller domain of Kelch13 gene leading to delayed parasite clearance post-treatment with Artemisinin-based Combination Therapies (ACTs).',
    },
    geographicalHotspots: {
      fr: ['Rwanda, Ouganda, Tanzanie (lignées endogènes)', 'Surveillance active en Afrique de l’Ouest'],
      en: ['Rwanda, Uganda, Tanzania (endogenous lineages)', 'Active surveillance across West Africa'],
    },
    threatLevel: 'critical',
    dataPoints: [
      { region: 'Grands Lacs (Rwanda/Ouganda)', prevalence: 'Jusqu’à 15-20% de mutations K13', trend: 'up' },
      { region: 'Afrique de l’Est côtière', prevalence: '5% à 8% de détection', trend: 'up' },
      { region: 'Afrique francophone', prevalence: '< 1% (efficacité thérapeutique conservée > 95%)', trend: 'stable' },
    ],
    operationalResponse: {
      fr: 'Diversification des ACT (alternance Arteméther-Luméfantrine / Artésunate-Amodiaquine / Dihydroartémisinine-Pipéraquine) et études annuelles d’efficacité thérapeutique (EET).',
      en: 'Multiple First-Line ACT diversification policy (AL / ASAQ / DHA-PPQ rotation) coupled with annual routine Therapeutic Efficacy Studies (TES).',
    },
  },
];
