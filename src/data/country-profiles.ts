import type { Lang } from '@/i18n/lang';

export interface CountryProfile {
  id: string;
  name: Record<Lang, string>;
  flag: string;
  capital: string;
  population: string;
  epiData: {
    incidencePer1000: number;
    under5MortalityPer1000: number;
    dhis2ReportingRate: string;
    annualCasesEstimated: string;
  };
  resistanceProfile: {
    kdrFrequency: string;
    cyp6p3Status: string;
    pfhrp2Deletions: string;
    kelch13Status: string;
  };
  nationalTools: {
    vectorNetType: Record<Lang, string>;
    smcCoverage: string;
    vaccineStatus: Record<Lang, string>;
    g2gStatus: Record<Lang, string>;
  };
  fundingMix: {
    globalFund: string;
    usaidPmi: string;
    gatesFoundation: string;
    domesticBudget: string;
  };
  strategicDirectives: {
    title: Record<Lang, string>;
    action: Record<Lang, string>;
  }[];
}

export const COUNTRY_PROFILES: CountryProfile[] = [
  {
    id: 'benin',
    name: { fr: 'Bénin', en: 'Benin' },
    flag: '🇧🇯',
    capital: 'Cotonou / Porto-Novo',
    population: '13.7M',
    epiData: {
      incidencePer1000: 385,
      under5MortalityPer1000: 89,
      dhis2ReportingRate: '94.2%',
      annualCasesEstimated: '5.2M',
    },
    resistanceProfile: {
      kdrFrequency: '88% (Élevée)',
      cyp6p3Status: 'Surexprimé (Sud)',
      pfhrp2Deletions: '< 1.5% (Faible)',
      kelch13Status: 'Sauvage (Sensible)',
    },
    nationalTools: {
      vectorNetType: {
        fr: '100% Moustiquaires Dual-AI (Chlorfénapyr + PBO)',
        en: '100% Dual-AI Nets (Chlorfenapyr + PBO)',
      },
      smcCoverage: '98.4% dans le Nord (Atacora / Donga / Alibori)',
      vaccineStatus: {
        fr: 'R21/Matrix-M introduit dans 14 districts prioritaires',
        en: 'R21/Matrix-M rolled out across 14 priority districts',
      },
      g2gStatus: {
        fr: 'Contrat direct G2G USAID-PNLP actif (Modèle pionnier)',
        en: 'Active Direct G2G USAID-NMCP Award (Pioneer model)',
      },
    },
    fundingMix: {
      globalFund: '$65M (GC7)',
      usaidPmi: '$19M / an',
      gatesFoundation: 'Partenariats stratégiques & recherche',
      domesticBudget: '14.5% du budget national',
    },
    strategicDirectives: [
      {
        title: {
          fr: '1. Sanctuariser la transition G2G vers le budget national',
          en: '1. Institutionalize G2G transition into domestic budget lines',
        },
        action: {
          fr: 'Augmenter la contribution de l’État de 5% par an pour pérenniser l’achat direct d’intrants sans dépendance bailleurs.',
          en: 'Scale domestic co-financing by 5% annually to sustain direct commodity procurement independently.',
        },
      },
      {
        title: {
          fr: '2. Déployer un cordon sentinelle portuaire contre Stephensi',
          en: '2. Deploy port sentinel cordons against Anopheles stephensi',
        },
        action: {
          fr: 'Surveillance entomologique moléculaire continue au Port Autonome de Cotonou et aux frontières lagunaires.',
          en: 'Continuous PCR molecular monitoring at the Port of Cotonou and coastal lagoon borders.',
        },
      },
      {
        title: {
          fr: '3. Étendre le couplage Vaccin R21 + CPS à 5 passages dans l’Alibori',
          en: '3. Expand R21 Vaccine + 5-cycle SMC layering in Alibori',
        },
        action: {
          fr: 'Synchroniser la 4e dose vaccinale avec le passage de novembre pour neutraliser les transmissions résiduelles.',
          en: 'Synchronize 4th vaccine dose with November SMC rounds to eradicate residual transmission clusters.',
        },
      },
    ],
  },
  {
    id: 'senegal',
    name: { fr: 'Sénégal', en: 'Senegal' },
    flag: '🇸🇳',
    capital: 'Dakar',
    population: '17.8M',
    epiData: {
      incidencePer1000: 42,
      under5MortalityPer1000: 38,
      dhis2ReportingRate: '96.5%',
      annualCasesEstimated: '750k',
    },
    resistanceProfile: {
      kdrFrequency: '72% (Modérée)',
      cyp6p3Status: 'Localisé (Sud-Est)',
      pfhrp2Deletions: '< 0.8% (Négligeable)',
      kelch13Status: 'Sauvage (Sensible)',
    },
    nationalTools: {
      vectorNetType: {
        fr: 'Stratification fine : Dual-AI au Sud, PBO au Centre',
        en: 'Granular mix: Dual-AI in South, PBO in Central',
      },
      smcCoverage: 'Universalité dans les régions du Sud (Kédougou, Kolda, Tamba)',
      vaccineStatus: {
        fr: 'En phase d’évaluation économique pour le Sud-Est',
        en: 'Health economics evaluation for Southeastern belt',
      },
      g2gStatus: {
        fr: 'En phase avancée d’alignement fiduciaire',
        en: 'Advanced fiduciary assessment phase',
      },
    },
    fundingMix: {
      globalFund: '$48M',
      usaidPmi: '$22M / an',
      gatesFoundation: 'Soutien modélisation et élimination',
      domesticBudget: '18% budget santé',
    },
    strategicDirectives: [
      {
        title: {
          fr: '1. Verrouiller la pré-élimination dans le Centre et le Nord',
          en: '1. Lock in pre-elimination in Central and Northern belts',
        },
        action: {
          fr: 'Appliquer la stratégie 1-3-7 pour chaque cas notifié et dépister systématiquement les maisonnées voisines.',
          en: 'Enforce 1-3-7 surveillance on every confirmed case with reactive household testing.',
        },
      },
      {
        title: {
          fr: '2. Concentrer les ressources lourdes sur le couloir Sud-Est',
          en: '2. Concentrate intensive vector control on South-Eastern corridor',
        },
        action: {
          fr: 'Associer MILDA Chlorfénapyr et PECADOM Plus renforcé dans les zones d’orpaillage artisanal de Kédougou.',
          en: 'Pair Chlorfenapyr nets and intensified iCCM across artisanal mining zones in Kédougou.',
        },
      },
      {
        title: {
          fr: '3. Protéger Dakar contre l’installation d’Anopheles stephensi',
          en: '3. Protect Dakar against Anopheles stephensi establishment',
        },
        action: {
          fr: 'Surveillance larvaire systématique dans les bassins de rétention et chantiers de la presqu’île du Cap-Vert.',
          en: 'Routine larval monitoring in storm basins and construction sites across Cap-Vert.',
        },
      },
    ],
  },
  {
    id: 'cote-divoire',
    name: { fr: 'Côte d’Ivoire', en: 'Ivory Coast' },
    flag: '🇨🇮',
    capital: 'Yamoussoukro / Abidjan',
    population: '29.4M',
    epiData: {
      incidencePer1000: 310,
      under5MortalityPer1000: 72,
      dhis2ReportingRate: '91.8%',
      annualCasesEstimated: '8.9M',
    },
    resistanceProfile: {
      kdrFrequency: '92% (Très élevée)',
      cyp6p3Status: 'Généralisé',
      pfhrp2Deletions: '2.1% (À surveiller)',
      kelch13Status: 'Sauvage (Sensible)',
    },
    nationalTools: {
      vectorNetType: {
        fr: 'Généralisation des MILDA Chlorfénapyr + PBO',
        en: 'Nationwide rollout of Chlorfenapyr + PBO nets',
      },
      smcCoverage: 'Déployé dans 12 districts du Nord',
      vaccineStatus: {
        fr: 'R21 intégré au PEV national depuis juillet 2024',
        en: 'R21 integrated in national EPI since July 2024',
      },
      g2gStatus: {
        fr: 'Assistance technique pour audit NUPAS en cours',
        en: 'Technical assistance for NUPAS audit underway',
      },
    },
    fundingMix: {
      globalFund: '$110M (GC7)',
      usaidPmi: '$25M / an',
      gatesFoundation: 'Accélération digitale & PEV',
      domesticBudget: '11% budget santé',
    },
    strategicDirectives: [
      {
        title: {
          fr: '1. Coupler la vaccination PEV aux passages de CPS dans le Nord',
          en: '1. Synchronize EPI vaccination with SMC cycles in Northern belt',
        },
        action: {
          fr: 'Utiliser les équipes mobiles de CPS pour rattraper les enfants non vaccinés dans les zones frontalières.',
          en: 'Deploy mobile SMC teams to catch up unvaccinated children in cross-border rural zones.',
        },
      },
      {
        title: {
          fr: '2. Digitaliser la chaîne logistique du dernier kilomètre',
          en: '2. Digitize last-mile supply chain visibility',
        },
        action: {
          fr: 'Déployer l’application mobile SIGS-eSIGL pour éliminer les ruptures d’ACT dans les dispensaires ruraux.',
          en: 'Deploy SIGS-eSIGL mobile tracking to eliminate ACT stockouts across rural dispensaries.',
        },
      },
      {
        title: {
          fr: '3. Sécuriser Abidjan face aux risques vectoriels émergents',
          en: '3. Secure Abidjan against emerging vector threats',
        },
        action: {
          fr: 'Traitement larvicide écologique Bti des lagunes urbaines et surveillance portuaire renforcée.',
          en: 'Eco-friendly Bti larviciding of urban lagoons and reinforced maritime port surveillance.',
        },
      },
    ],
  },
  {
    id: 'rdc',
    name: { fr: 'RDC (Congo-Kinshasa)', en: 'DR Congo' },
    flag: '🇨🇩',
    capital: 'Kinshasa',
    population: '102M',
    epiData: {
      incidencePer1000: 410,
      under5MortalityPer1000: 78,
      dhis2ReportingRate: '86.4%',
      annualCasesEstimated: '31M',
    },
    resistanceProfile: {
      kdrFrequency: '85% (Élevée)',
      cyp6p3Status: 'Multi-foyers',
      pfhrp2Deletions: '4.8% (Alerte diagnostic)',
      kelch13Status: 'Mutations sporadiques (Surveillance étroite)',
    },
    nationalTools: {
      vectorNetType: {
        fr: 'Transition progressive vers Dual-AI et PBO par province',
        en: 'Province-by-province transition to Dual-AI & PBO',
      },
      smcCoverage: 'Ciblé dans les provinces du Sud et de l’Est',
      vaccineStatus: {
        fr: 'Introduction pilote R21 dans 3 provinces pilotes',
        en: 'Pilot R21 rollout across 3 initial provinces',
      },
      g2gStatus: {
        fr: 'Gestion fiduciaire déléguée provinciale',
        en: 'Provincial delegated fiduciary framework',
      },
    },
    fundingMix: {
      globalFund: '$340M (1er récipiendaire mondial)',
      usaidPmi: '$55M / an',
      gatesFoundation: 'Surveillance génomique & innovations',
      domesticBudget: '7.8% budget santé',
    },
    strategicDirectives: [
      {
        title: {
          fr: '1. Basculer vers les tests non-HRP2 dans les zones à délétions',
          en: '1. Switch to non-HRP2 diagnostics in gene-deletion hotspots',
        },
        action: {
          fr: 'Introduire des TDR combinés HRP2/pLDH pour éviter les faux négatifs chez les enfants fébriles.',
          en: 'Procure dual HRP2/pLDH combo RDTs to eliminate diagnostic false negatives in febrile children.',
        },
      },
      {
        title: {
          fr: '2. Décentraliser la micro-planification SIG au niveau provincial',
          en: '2. Decentralize GIS microplanning to provincial health directorates',
        },
        action: {
          fr: 'Adapter la distribution des MILDA Dual-AI selon la résistance spécifique de chaque province.',
          en: 'Tailor Dual-AI net procurement according to province-specific entomological resistance data.',
        },
      },
      {
        title: {
          fr: '3. Consolider la traçabilité des financements provinciaux',
          en: '3. Reinforce provincial financial transparency mechanisms',
        },
        action: {
          fr: 'Déployer des audits dématérialisés en temps réel pour réduire les coûts d’intermédiation de 15%.',
          en: 'Implement digital cloud voucher audits to reduce third-party administrative overhead by 15%.',
        },
      },
    ],
  },
  {
    id: 'burkina-faso',
    name: { fr: 'Burkina Faso', en: 'Burkina Faso' },
    flag: '🇧🇫',
    capital: 'Ouagadougou',
    population: '23.2M',
    epiData: {
      incidencePer1000: 390,
      under5MortalityPer1000: 82,
      dhis2ReportingRate: '93.1%',
      annualCasesEstimated: '9.1M',
    },
    resistanceProfile: {
      kdrFrequency: '95% (Très élevée)',
      cyp6p3Status: 'Massif (Hauts-Bassins)',
      pfhrp2Deletions: '< 1.0%',
      kelch13Status: 'Sauvage (Sensible)',
    },
    nationalTools: {
      vectorNetType: {
        fr: '100% MILDA Dual-AI Chlorfénapyr',
        en: '100% Chlorfenapyr Dual-AI Nets',
      },
      smcCoverage: '98% sur l’ensemble des 70 districts sanitaires',
      vaccineStatus: {
        fr: 'R21 déployé à grande échelle dans le PEV de routine',
        en: 'R21 deployed nationwide in routine EPI schedule',
      },
      g2gStatus: {
        fr: 'En cours de structuration avec les partenaires',
        en: 'Structuring roadmap with partners',
      },
    },
    fundingMix: {
      globalFund: '$92M',
      usaidPmi: '$24M / an',
      gatesFoundation: 'Recherche opérationnelle & vaccins',
      domesticBudget: '12.4% budget santé',
    },
    strategicDirectives: [
      {
        title: {
          fr: '1. Modéliser la synergie triple : Dual-AI + CPS + Vaccin R21',
          en: '1. Model triple synergy: Dual-AI + SMC + R21 Vaccine',
        },
        action: {
          fr: 'Mesurer la réduction cumulée de la mortalité infantile pour servir de référence mondiale.',
          en: 'Quantify cumulative child mortality reduction as a global gold-standard case study.',
        },
      },
      {
        title: {
          fr: '2. Garantir la continuité des soins dans les zones sous tension sécuritaire',
          en: '2. Sustain care continuity in fragile security zones',
        },
        action: {
          fr: 'Renforcer les stocks tampons de CPS et ACT confiés directement aux agents communautaires ASBC.',
          en: 'Equip village community health workers with 3-month buffer stocks of SMC and ACTs.',
        },
      },
      {
        title: {
          fr: '3. Surveiller l’émergence de résistances au Chlorfénapyr',
          en: '3. Monitor early emergence of Chlorfenapyr tolerance',
        },
        action: {
          fr: 'Mettre en place des tests de bio-efficacité semestriels dans les stations sentinelles du CREC/IRSS.',
          en: 'Conduct biannual bioefficacy assays across IRSS entomological sentinel stations.',
        },
      },
    ],
  },
  {
    id: 'mali',
    name: { fr: 'Mali', en: 'Mali' },
    flag: '🇲🇱',
    capital: 'Bamako',
    population: '22.6M',
    epiData: {
      incidencePer1000: 360,
      under5MortalityPer1000: 94,
      dhis2ReportingRate: '88.5%',
      annualCasesEstimated: '8.1M',
    },
    resistanceProfile: {
      kdrFrequency: '86% (Élevée)',
      cyp6p3Status: 'Modéré',
      pfhrp2Deletions: '< 1.2%',
      kelch13Status: 'Sauvage (Sensible)',
    },
    nationalTools: {
      vectorNetType: {
        fr: 'MILDA PBO et Chlorfénapyr selon les zones épidémiologiques',
        en: 'PBO and Chlorfenapyr nets stratified by zone',
      },
      smcCoverage: 'Universel dans le Centre et le Sud (Juil - Oct)',
      vaccineStatus: {
        fr: 'Introduction progressive dans les régions du Sud',
        en: 'Phased introduction across Southern regions',
      },
      g2gStatus: {
        fr: 'Mécanismes fiduciaires décentralisés',
        en: 'Decentralized fiduciary oversight mechanisms',
      },
    },
    fundingMix: {
      globalFund: '$85M',
      usaidPmi: '$23M / an',
      gatesFoundation: 'Surveillance entomologique & CPS',
      domesticBudget: '8.5% budget santé',
    },
    strategicDirectives: [
      {
        title: {
          fr: '1. Digitaliser le suivi porte-à-porte de la CPS par GPS',
          en: '1. Digitize door-to-door GPS tracking of SMC campaigns',
        },
        action: {
          fr: 'Éliminer les zones d’ombre de distribution grâce à la synchronisation quotidienne DHIS2.',
          en: 'Eliminate coverage blindspots through daily mobile DHIS2 synchronization.',
        },
      },
      {
        title: {
          fr: '2. Étendre la CPS jusqu’à 10 ans dans les zones sahéliennes',
          en: '2. Extend SMC coverage up to 10 years in Sahelian districts',
        },
        action: {
          fr: 'Protéger la tranche des enfants d’âge scolaire qui concentre une morbidité sévère évitable.',
          en: 'Protect school-aged children who represent high preventable severe malaria burden.',
        },
      },
      {
        title: {
          fr: '3. Renforcer la résilience de la chaîne du froid vaccinale',
          en: '3. Strengthen solar-powered vaccine cold chain resilience',
        },
        action: {
          fr: 'Équiper les centres de santé ruraux de réfrigérateurs solaires connectés pour le vaccin R21.',
          en: 'Equip rural health posts with smart solar-powered direct drive fridges for R21 storage.',
        },
      },
    ],
  },
  {
    id: 'guinee',
    name: { fr: 'Guinée (Conakry)', en: 'Guinea' },
    flag: '🇬🇳',
    capital: 'Conakry',
    population: '14.2M',
    epiData: {
      incidencePer1000: 340,
      under5MortalityPer1000: 98,
      dhis2ReportingRate: '89.2%',
      annualCasesEstimated: '4.8M',
    },
    resistanceProfile: {
      kdrFrequency: '79% (Modérée à forte)',
      cyp6p3Status: 'Localisé (Guinée Forestière)',
      pfhrp2Deletions: '< 0.9%',
      kelch13Status: 'Sauvage (Sensible)',
    },
    nationalTools: {
      vectorNetType: {
        fr: 'Transition vers les MILDA Dual-AI et PBO',
        en: 'Transition to Dual-AI and PBO nets',
      },
      smcCoverage: 'En extension dans la Haute-Guinée et Moyenne-Guinée',
      vaccineStatus: {
        fr: 'Préparation du plan d’introduction PEV 2026',
        en: 'EPI vaccine introduction roadmap ready for 2026',
      },
      g2gStatus: {
        fr: 'Audit initial et renforcement des capacités fiduciaires',
        en: 'Baseline fiduciary audit and capacity building',
      },
    },
    fundingMix: {
      globalFund: '$68M',
      usaidPmi: '$18M / an',
      gatesFoundation: 'Renforcement systèmes de santé & PPR',
      domesticBudget: '6.9% budget santé',
    },
    strategicDirectives: [
      {
        title: {
          fr: '1. Intégrer la surveillance du paludisme dans le dispositif PPR post-Ebola',
          en: '1. Embed malaria surveillance in post-Ebola PPR architecture',
        },
        action: {
          fr: 'Utiliser les laboratoires régionaux de santé publique pour le diagnostic PCR et la surveillance génomique.',
          en: 'Leverage regional public health labs for routine PCR diagnostic and genomic surveillance.',
        },
      },
      {
        title: {
          fr: '2. Déployer les MILDA Dual-AI en priorité en Guinée Forestière',
          en: '2. Prioritize Dual-AI net allocation in Forest Guinea',
        },
        action: {
          fr: 'Neutraliser la transmission pérenne dans les zones de forêt tropicale humide à forte densité vectorielle.',
          en: 'Neutralize perennial transmission across rainforest zones with high vector density.',
        },
      },
      {
        title: {
          fr: '3. Accélérer la décentralisation des soins communautaires',
          en: '3. Accelerate decentralization of community care packages',
        },
        action: {
          fr: 'Former et doter 4 500 agents communautaires pour la prise en charge intégrée TDR/ACT à domicile.',
          en: 'Equip 4,500 village health workers for integrated doorstep testing and treatment.',
        },
      },
    ],
  },
  {
    id: 'niger',
    name: { fr: 'Niger', en: 'Niger' },
    flag: '🇳🇪',
    capital: 'Niamey',
    population: '26.2M',
    epiData: {
      incidencePer1000: 320,
      under5MortalityPer1000: 115,
      dhis2ReportingRate: '87.6%',
      annualCasesEstimated: '8.4M',
    },
    resistanceProfile: {
      kdrFrequency: '81% (Élevée)',
      cyp6p3Status: 'Faible',
      pfhrp2Deletions: '< 0.7%',
      kelch13Status: 'Sauvage (Sensible)',
    },
    nationalTools: {
      vectorNetType: {
        fr: 'MILDA PBO synergistes à haute rétention',
        en: 'High-retention PBO synergist nets',
      },
      smcCoverage: 'Universalité CPS chez les moins de 5 ans (Juil - Oct)',
      vaccineStatus: {
        fr: 'Plan d’introduction saisonnière en cours de calage',
        en: 'Seasonal vaccine introduction planning underway',
      },
      g2gStatus: {
        fr: 'Supervision fiduciaire conjointe',
        en: 'Joint fiduciary monitoring framework',
      },
    },
    fundingMix: {
      globalFund: '$76M',
      usaidPmi: '$20M / an',
      gatesFoundation: 'Modélisation climat & nutrition-santé',
      domesticBudget: '8.1% budget santé',
    },
    strategicDirectives: [
      {
        title: {
          fr: '1. Coupler systématiquement la CPS au dépistage de la malnutrition',
          en: '1. Systematically bundle SMC campaigns with malnutrition screening',
        },
        action: {
          fr: 'Mesurer le périmètre brachial (PB) de chaque enfant lors des 4 passages de chimioprévention.',
          en: 'Screen mid-upper arm circumference (MUAC) for acute malnutrition during all 4 SMC rounds.',
        },
      },
      {
        title: {
          fr: '2. Calibrer le passage 1 de la CPS sur les données météo satellites',
          en: '2. Trigger SMC Round 1 based on real-time satellite rainfall models',
        },
        action: {
          fr: 'Déclencher la distribution 15 jours avant la montée des eaux dans les vallées du fleuve Niger.',
          en: 'Launch mass drug distribution 15 days prior to seasonal flooding along the Niger river.',
        },
      },
      {
        title: {
          fr: '3. Cartographier les corridors de transhumance pastorale',
          en: '3. Map pastoral transhumance corridors for mobile care',
        },
        action: {
          fr: 'Déployer des équipes mobiles pour administrer la CPS aux enfants des communautés nomades.',
          en: 'Deploy nomadic mobile vaccination and SMC units along livestock migration corridors.',
        },
      },
    ],
  },
  {
    id: 'burundi',
    name: { fr: 'Burundi', en: 'Burundi' },
    flag: '🇧🇮',
    capital: 'Gitega / Bujumbura',
    population: '13.2M',
    epiData: {
      incidencePer1000: 275,
      under5MortalityPer1000: 54,
      dhis2ReportingRate: '95.1%',
      annualCasesEstimated: '3.6M',
    },
    resistanceProfile: {
      kdrFrequency: '74% (Modérée)',
      cyp6p3Status: 'Modéré (Plaines de l’Imbo)',
      pfhrp2Deletions: '< 1.1%',
      kelch13Status: 'Sauvage (Sensible)',
    },
    nationalTools: {
      vectorNetType: {
        fr: 'Stratification par altitude : Dual-AI dans les plaines, PBO sur les plateaux',
        en: 'Altitude stratification: Dual-AI in lowlands, PBO in highlands',
      },
      smcCoverage: 'Ciblé dans les districts de basse altitude',
      vaccineStatus: {
        fr: 'En phase de préparation pour les districts côtiers du Lac Tanganyika',
        en: 'Preparation phase for Lake Tanganyika coastal health districts',
      },
      g2gStatus: {
        fr: 'Plateforme Malariya-PI d’interopérabilité active',
        en: 'Active Malariya-PI data interoperability framework',
      },
    },
    fundingMix: {
      globalFund: '$52M',
      usaidPmi: '$14M / an',
      gatesFoundation: 'Interopérabilité des données & SIG',
      domesticBudget: '11.8% budget santé',
    },
    strategicDirectives: [
      {
        title: {
          fr: '1. Pousser l’interopérabilité totale DHIS2 / eSIGL / LMIS',
          en: '1. Accelerate full DHIS2 / eSIGL / LMIS system interoperability',
        },
        action: {
          fr: 'Généraliser la plateforme Malariya-PI pour corréler en temps réel consommation d’ACT et cas diagnostiqués.',
          en: 'Scale the Malariya-PI engine to correlate ACT consumption with real-time diagnosed incidence.',
        },
      },
      {
        title: {
          fr: '2. Protéger les zones de haute altitude contre les résurgences épidémiques',
          en: '2. Shield highland plateaus against climate-driven epidemic resurgence',
        },
        action: {
          fr: 'Maintenir des stocks d’urgence de tests et traitements dans les formations sanitaires des plateaux.',
          en: 'Pre-position emergency epidemic diagnostic and treatment buffer stocks in highland posts.',
        },
      },
      {
        title: {
          fr: '3. Renforcer la surveillance transfrontalière avec la RDC et le Rwanda',
          en: '3. Reinforce cross-border epidemic coordination with DRC and Rwanda',
        },
        action: {
          fr: 'Harmoniser les protocoles de dépistage et de traitement le long du corridor lacustre.',
          en: 'Harmonize screening and treatment protocols along the Lake Tanganyika trade corridor.',
        },
      },
    ],
  },
  {
    id: 'cameroun',
    name: { fr: 'Cameroun', en: 'Cameroon' },
    flag: '🇨🇲',
    capital: 'Yaoundé / Douala',
    population: '28.6M',
    epiData: {
      incidencePer1000: 295,
      under5MortalityPer1000: 71,
      dhis2ReportingRate: '92.4%',
      annualCasesEstimated: '8.4M',
    },
    resistanceProfile: {
      kdrFrequency: '84% (Élevée)',
      cyp6p3Status: 'Élevé (Littoral et Sud)',
      pfhrp2Deletions: '1.8% (À surveiller)',
      kelch13Status: 'Sauvage (Sensible)',
    },
    nationalTools: {
      vectorNetType: {
        fr: 'MILDA Dual-AI Chlorfénapyr dans les zones forestières et côtières',
        en: 'Chlorfenapyr Dual-AI Nets in rainforest and coastal zones',
      },
      smcCoverage: 'Universalité dans le Grand Nord (Extrême-Nord, Nord, Adamaoua)',
      vaccineStatus: {
        fr: 'Pionnier mondial : RTS,S intégré au PEV national depuis janvier 2024',
        en: 'Global pioneer: RTS,S integrated in routine EPI since January 2024',
      },
      g2gStatus: {
        fr: 'En phase de modélisation fiduciaire',
        en: 'Fiduciary modeling phase underway',
      },
    },
    fundingMix: {
      globalFund: '$98M',
      usaidPmi: '$26M / an',
      gatesFoundation: 'Recherche opérationnelle vaccins & leadership',
      domesticBudget: '9.2% budget santé',
    },
    strategicDirectives: [
      {
        title: {
          fr: '1. Capitaliser sur le leadership vaccinal pionnier du Cameroun',
          en: '1. Capitalize on Cameroon’s pioneering vaccine rollout leadership',
        },
        action: {
          fr: 'Documenter les taux de complétude des 4 doses pour optimiser la logistique PEV dans toute l’Afrique francophone.',
          en: 'Document 4-dose completion metrics to optimize EPI logistics across all Francophone Africa.',
        },
      },
      {
        title: {
          fr: '2. Synchroniser la CPS et la vaccination dans le Grand Nord',
          en: '2. Synchronize SMC cycles and EPI vaccines in the Grand North',
        },
        action: {
          fr: 'Neutraliser le pic pluviométrique violent de l’Extrême-Nord par la double protection biologique et chimique.',
          en: 'Neutralize the severe seasonal surge in Far North via layered biological and chemical protection.',
        },
      },
      {
        title: {
          fr: '3. Sécuriser les métropoles portuaires de Douala et Kribi',
          en: '3. Secure maritime trade ports of Douala and Kribi against invasive vectors',
        },
        action: {
          fr: 'Surveillance entomologique moléculaire continue contre l’introduction d’Anopheles stephensi.',
          en: 'Routine molecular surveillance to detect and contain any Anopheles stephensi introduction.',
        },
      },
    ],
  },
];
