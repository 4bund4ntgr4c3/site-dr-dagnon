export interface GenomicsMarker {
  id: string;
  category: 'vector' | 'diagnostic' | 'drug';
  title: { fr: string; en: string };
  scientificName: string;
  mechanism: { fr: string; en: string };
  geographicalHotspots: { fr: string[]; en: string[] };
  threatLevel: 'critical' | 'high' | 'monitored';
  dataPoints: {
    region: Record<'fr' | 'en', string>;
    prevalence: Record<'fr' | 'en', string>;
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
      { region: { fr: 'Bénin Sud', en: 'Southern Benin' }, prevalence: { fr: '> 85% de survie aux pyréthrinoïdes', en: '> 85% survival after pyrethroid exposure' }, trend: 'up' },
      { region: { fr: 'Burkina Faso Ouest', en: 'Western Burkina Faso' }, prevalence: { fr: '> 90% de résistance kdr/CYP', en: '> 90% kdr/CYP resistance' }, trend: 'up' },
      { region: { fr: 'Sénégal Est', en: 'Eastern Senegal' }, prevalence: { fr: '35% à 50% de résistance émergente', en: '35% to 50% emerging resistance' }, trend: 'up' },
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
      { region: { fr: 'Corne de l’Afrique', en: 'Horn of Africa' }, prevalence: { fr: '12% à 25% de faux négatifs TDR', en: '12% to 25% RDT false negatives' }, trend: 'up' },
      { region: { fr: 'Bassin du Congo', en: 'Congo Basin' }, prevalence: { fr: '1% à 3% de délétions détectées', en: '1% to 3% detected deletions' }, trend: 'stable' },
      { region: { fr: 'Afrique de l’Ouest', en: 'West Africa' }, prevalence: { fr: '< 1% (surveillance sentinelle active)', en: '< 1% (active sentinel surveillance)' }, trend: 'stable' },
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
      { region: { fr: 'Grands Lacs (Rwanda/Ouganda)', en: 'Great Lakes (Rwanda/Uganda)' }, prevalence: { fr: 'Jusqu’à 15-20% de mutations K13', en: 'Up to 15–20% K13 mutations' }, trend: 'up' },
      { region: { fr: 'Afrique de l’Est côtière', en: 'Coastal East Africa' }, prevalence: { fr: '5% à 8% de détection', en: '5% to 8% detection' }, trend: 'up' },
      { region: { fr: 'Afrique francophone', en: 'Francophone Africa' }, prevalence: { fr: '< 1% (efficacité thérapeutique conservée > 95%)', en: '< 1% (therapeutic efficacy remains above 95%)' }, trend: 'stable' },
    ],
    operationalResponse: {
      fr: 'Diversification des ACT (alternance Arteméther-Luméfantrine / Artésunate-Amodiaquine / Dihydroartémisinine-Pipéraquine) et études annuelles d’efficacité thérapeutique (EET).',
      en: 'Multiple First-Line ACT diversification policy (AL / ASAQ / DHA-PPQ rotation) coupled with annual routine Therapeutic Efficacy Studies (TES).',
    },
  },
];
