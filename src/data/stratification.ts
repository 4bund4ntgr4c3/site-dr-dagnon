import type { Lang } from '@/i18n/lang';

export interface DistrictArchetype {
  id: string;
  name: Record<Lang, string>;
  tagline: Record<Lang, string>;
  description: Record<Lang, string>;
  epiContext: {
    transmission: Record<Lang, string>;
    vectorResistance: Record<Lang, string>;
    primaryVector: string;
    seasonalPattern: Record<Lang, string>;
    baselineIncidence: number; // cas / 1000 hab / an
  };
  recommendedPackage: {
    vectorControl: {
      tool: Record<Lang, string>;
      rationale: Record<Lang, string>;
      coverageTarget: Record<Lang, string>;
    };
    chemoprevention: {
      tool: Record<Lang, string>;
      rationale: Record<Lang, string>;
      cycles: Record<Lang, string>;
    };
    vaccination: {
      tool: Record<Lang, string>;
      rationale: Record<Lang, string>;
      target: Record<Lang, string>;
    };
    surveillanceAndCommunity: {
      tool: Record<Lang, string>;
      rationale: Record<Lang, string>;
      focus: Record<Lang, string>;
    };
  };
  impactMultipliers: {
    caseReductionRate: number; // 0.0 - 1.0
    mortalityReductionRate: number;
    costPerPersonProtected: number; // USD
    dalysAvertedPer1000: number;
  };
}

export const DISTRICT_ARCHETYPES: DistrictArchetype[] = [
  {
    id: 'rural-hyperendemic',
    name: {
      fr: 'Zone Rurale Hyper-Endémique (Haute Transmission & Résistance)',
      en: 'Hyper-Endemic Rural Zone (High Transmission & Pyrethroid Resistance)',
    },
    tagline: {
      fr: 'Forte charge permanente, résistance métabolique kdr/CYP6P3 élevée, accès aux soins > 2h',
      en: 'Perennial transmission, high kdr/CYP6P3 metabolic resistance, care access > 2h',
    },
    description: {
      fr: 'Concerne les districts forestiers et de savane humide (ex: Sud-Bénin, Sud-Sénégal, Ouest-Burkina Faso) où les anophèles piquent massivement à l’intérieur et présentent une tolérance élevée aux pyréthrinoïdes standards.',
      en: 'Characteristic of rainforest and humid savannah districts where vector biting is intense and vectors exhibit high resistance to standard pyrethroids.',
    },
    epiContext: {
      transmission: {
        fr: 'Pérenne avec pic pluviométrique marqué (> 400 cas / 1 000 hab / an)',
        en: 'Perennial with severe rainy season peaks (> 400 cases / 1,000 pop / yr)',
      },
      vectorResistance: {
        fr: 'Résistance pyréthrinoïde sévère (> 70% survie aux tests OMS)',
        en: 'Severe pyrethroid resistance (> 70% survival on WHO bioassays)',
      },
      primaryVector: 'Anopheles gambiae s.s. & Anopheles coluzzii',
      seasonalPattern: {
        fr: 'Transmission active 8 à 10 mois / an',
        en: 'Active transmission 8 to 10 months / yr',
      },
      baselineIncidence: 440,
    },
    recommendedPackage: {
      vectorControl: {
        tool: {
          fr: 'Moustiquaires Dual-AI (Chlorfénapyr + Alpha-cyperméthrine)',
          en: 'Dual-AI Nets (Chlorfenapyr + Alpha-cypermethrin)',
        },
        rationale: {
          fr: 'Le chlorfénapyr court-circuite la résistance métabolique et rétablit une mortalité vectorielle > 85%.',
          en: 'Chlorfenapyr bypasses metabolic resistance pathways, restoring vector mortality above 85%.',
        },
        coverageTarget: { fr: '1 MILDA / 2 personnes (100% des foyers)', en: '1 LLIN per 2 people (100% of households)' },
      },
      chemoprevention: {
        tool: {
          fr: 'CPS Élargie (5 cycles mensuels) + TPI nouveau-nés (PMC)',
          en: 'Extended SMC (5 monthly cycles) + Perennial Malaria Chemoprevention (PMC)',
        },
        rationale: {
          fr: 'Couvre la période de transmission prolongée d’août à décembre chez les enfants de 3 à 59 mois.',
          en: 'Shields children from August through December during lengthened transmission peaks.',
        },
        cycles: { fr: '5 cycles mensuels', en: '5 monthly cycles' },
      },
      vaccination: {
        tool: {
          fr: 'Introduction prioritaire Vaccin R21 / Matrix-M (4 doses PEV)',
          en: 'Priority Rollout of R21 / Matrix-M Vaccine (4-dose EPI schedule)',
        },
        rationale: {
          fr: 'Protection synergique avec la CPS conférant jusqu’à 75% de protection pédiatrique cumulée.',
          en: 'Synergistic protection alongside SMC delivering up to 75% cumulative child protection.',
        },
        target: { fr: 'Enfants de 5 à 18 mois', en: 'Children aged 5 to 18 months' },
      },
      surveillanceAndCommunity: {
        tool: {
          fr: 'PECADOM Plus (Prise en charge à domicile par ASBC) + DHIS2 Tracker',
          en: 'Community Case Management (iCCM by CHWs) + DHIS2 Tracker',
        },
        rationale: {
          fr: 'Dépistage précoce TDR et traitement ACT administré dans les 24h au niveau villageois.',
          en: 'Rapid RDT confirmation and prompt ACT delivery within 24h at the household level.',
        },
        focus: {
          fr: 'Approvisionnement continu en intrants sans rupture de stock',
          en: 'Zero-stockout supply chain security for community health posts',
        },
      },
    },
    impactMultipliers: {
      caseReductionRate: 0.62,
      mortalityReductionRate: 0.74,
      costPerPersonProtected: 7.4,
      dalysAvertedPer1000: 185,
    },
  },
  {
    id: 'urban-coastal-stephensi',
    name: {
      fr: 'Zone Urbaine & Métropole Côtière (Risque Anopheles stephensi)',
      en: 'Urban & Coastal Hub (Anopheles stephensi Invasion Threat)',
    },
    tagline: {
      fr: 'Haute densité humaine, gîtes artificiels urbains, résistance multi-classes, risque d’épidémies explosives',
      en: 'High urban density, artificial water containers, multi-insecticide resistance, explosive outbreak risk',
    },
    description: {
      fr: 'Concerne les grandes métropoles portuaires et carrefours logistiques d’Afrique de l’Ouest (ex: Cotonou, Lomé, Abidjan, Lagos) où le vecteur invasif Anopheles stephensi menace de s’établir dans les réservoirs d’eau urbains.',
      en: 'Targets seaport metropolises and transit corridors where the invasive vector Anopheles stephensi can establish breeding sites in clean urban water storage tanks.',
    },
    epiContext: {
      transmission: {
        fr: 'Historiquement faible mais vulnérable aux flambées urbaines aiguës',
        en: 'Historically low but vulnerable to sharp urban transmission surges',
      },
      vectorResistance: {
        fr: 'Résistance croisée pyréthrinoïdes, organophosphorés et carbamates',
        en: 'Cross-resistance across pyrethroids, organophosphates, and carbamates',
      },
      primaryVector: 'Anopheles stephensi',
      seasonalPattern: {
        fr: 'Transmission liée aux stockages d’eau artificiels et chantiers urbains',
        en: 'Transmission driven by artificial water tanks and urban construction sites',
      },
      baselineIncidence: 160,
    },
    recommendedPackage: {
      vectorControl: {
        tool: {
          fr: 'Traitement Larvicide Biologique (Bti) + Cartographie Drones des gîtes',
          en: 'Biological Larviciding (Bti) + Drone Hotspot Mapping',
        },
        rationale: {
          fr: 'Le Bti détruit les larves dans les citernes et chantiers sans polluer l’eau potable.',
          en: 'Bti eliminates mosquito larvae in storage tanks without contaminating municipal water.',
        },
        coverageTarget: { fr: '> 90% des réservoirs urbains traités', en: '> 90% of urban water containers treated' },
      },
      chemoprevention: {
        tool: {
          fr: 'Dépistage proactif focalisé autour des cas index (fMDA / fTDA)',
          en: 'Focal Proactive Case Detection around index households (fMDA / fTDA)',
        },
        rationale: {
          fr: 'Évite l’installation de foyers de transmission résiduels dans les quartiers denses.',
          en: 'Prevents localized transmission clusters in dense informal urban settlements.',
        },
        cycles: { fr: 'Focalisé selon la détection', en: 'Focused according to detection' },
      },
      vaccination: {
        tool: {
          fr: 'Intégration PEV standard dans les centres de santé urbains',
          en: 'Standard Routine EPI Integration in urban polyclinics',
        },
        rationale: {
          fr: 'Maintien d’une immunité pédiatrique de base dans les centres de PMI urbains.',
          en: 'Sustains baseline pediatric immunity in urban maternal health clinics.',
        },
        target: { fr: 'Enfants de 6 à 24 mois', en: 'Children aged 6 to 24 months' },
      },
      surveillanceAndCommunity: {
        tool: {
          fr: 'Cordon de surveillance entomologique moléculaire (Ports, Gares, Aéroports)',
          en: 'Molecular Entomological Surveillance Cordons (Ports, Rail, Airports)',
        },
        rationale: {
          fr: 'Pièges BG-Sentinel et diagnostic PCR systématique des larves capturées.',
          en: 'Sentinel BG traps and systematic PCR molecular typing of captured larvae.',
        },
        focus: {
          fr: 'Alerte précoce sous 14 jours en cas d’identification de stephensi',
          en: '14-day early warning trigger upon stephensi genetic confirmation',
        },
      },
    },
    impactMultipliers: {
      caseReductionRate: 0.54,
      mortalityReductionRate: 0.68,
      costPerPersonProtected: 4.8,
      dalysAvertedPer1000: 110,
    },
  },
  {
    id: 'sahelian-seasonal',
    name: {
      fr: 'Zone Sahélienne & Savane Sèche (Transmission Fortement Saisonnière)',
      en: 'Sahelian & Dry Savannah Zone (Highly Seasonal Surge)',
    },
    tagline: {
      fr: 'Pic épidémique concentré sur 3 à 4 mois de pluies torrentielles, forte mortalité pédiatrique saisonnière',
      en: 'Intense 3-to-4-month seasonal epidemic surge, high seasonal child mortality',
    },
    description: {
      fr: 'Typique de la bande sahélienne (ex: Nord-Mali, Nord-Burkina, Niger, Nord-Sénégal) où 75% des cas de l’année se concentrent entre juillet et octobre.',
      en: 'Representative of the Sahelian belt where 75% of annual cases surge between July and October.',
    },
    epiContext: {
      transmission: {
        fr: 'Hyper-saisonnière et explosive (350 cas / 1 000 hab sur 12 semaines)',
        en: 'Hyper-seasonal and explosive (350 cases / 1,000 pop over 12 weeks)',
      },
      vectorResistance: {
        fr: 'Résistance modérée à forte aux pyréthrinoïdes (mutation kdr Ouest dominante)',
        en: 'Moderate-to-high pyrethroid resistance (West African kdr mutation)',
      },
      primaryVector: 'Anopheles arabiensis & Anopheles coluzzii',
      seasonalPattern: {
        fr: 'Pic violent d’août à octobre',
        en: 'Violent surge from August to October',
      },
      baselineIncidence: 360,
    },
    recommendedPackage: {
      vectorControl: {
        tool: {
          fr: 'MILDA Next-Gen PBO + Pulvérisation Intradomiciliaire Ciblée (PID focale)',
          en: 'PBO Synergist Nets + Targeted Indoor Residual Spraying (Focal IRS)',
        },
        rationale: {
          fr: 'Le PBO inhibe les enzymes de résistance des anophèles sahéliens pendant le pic des pluies.',
          en: 'PBO synergists neutralize metabolic detoxifying enzymes in Sahelian vectors.',
        },
        coverageTarget: { fr: '> 95% des foyers couverts avant le 15 juillet', en: '> 95% of households covered before 15 July' },
      },
      chemoprevention: {
        tool: {
          fr: 'Chimioprévention Saisonnière (CPS) 4 cycles à couverture universelle (< 10 ans)',
          en: 'Seasonal Malaria Chemoprevention (SMC) 4 Universal Cycles (< 10 yrs)',
        },
        rationale: {
          fr: 'L’administration mensuelle de SPAQ protège 98% des enfants contre les formes graves de paludisme.',
          en: 'Monthly SPAQ administration protects 98% of children against severe malaria episodes.',
        },
        cycles: { fr: '4 passages rigoureux (juillet–octobre)', en: '4 scheduled rounds (July–October)' },
      },
      vaccination: {
        tool: {
          fr: 'Stratégie Saisonnière Vaccin R21 (3 doses primaires + rappel pré-saisonnier)',
          en: 'Seasonal R21 Vaccine Strategy (3 primary doses + pre-seasonal booster)',
        },
        rationale: {
          fr: 'Dose de rappel administrée fin juin juste avant le déclenchement des pluies.',
          en: 'Booster timed in late June just ahead of the seasonal rainfall peak.',
        },
        target: { fr: 'Enfants de 5 à 36 mois', en: 'Children aged 5 to 36 months' },
      },
      surveillanceAndCommunity: {
        tool: {
          fr: 'Digitalisation des passages CPS sur tablettes mobiles + géolocalisation',
          en: 'Digitalized SMC Door-to-Door Tracking via Mobile GPS Apps',
        },
        rationale: {
          fr: 'Suivi journalier du taux de couverture par concession pour éviter les hameaux oubliés.',
          en: 'Daily geo-tracking by compound ensuring zero remote settlements are missed.',
        },
        focus: {
          fr: 'Observance stricte des doses J2/J3 à domicile',
          en: 'Day 2 & Day 3 adherence verification by village health leaders',
        },
      },
    },
    impactMultipliers: {
      caseReductionRate: 0.78,
      mortalityReductionRate: 0.86,
      costPerPersonProtected: 5.6,
      dalysAvertedPer1000: 215,
    },
  },
  {
    id: 'elimination-low-transmission',
    name: {
      fr: 'Zone de Pré-Élimination & Faible Transmission Résiduelle',
      en: 'Pre-Elimination & Low Residual Transmission Zone',
    },
    tagline: {
      fr: 'Incidence < 50 cas / 1 000 hab, transmission en foyers résiduels localisés, objectif zéro transmission indigène',
      en: 'Incidence < 50 cases / 1,000 pop, localized residual pockets, zero indigenous transmission target',
    },
    description: {
      fr: 'Concerne les zones ayant atteint un faible niveau de morbidité (ex: Hauts plateaux, zones arides protégées, districts en phase d’élimination) visant la certification OMS d’interruption de la transmission.',
      en: 'Applies to highlands or arid geographies transitioning to zero indigenous malaria transmission and targeting WHO certification.',
    },
    epiContext: {
      transmission: {
        fr: 'Faible et résiduelle (< 50 cas / 1 000 hab / an)',
        en: 'Low and residual (< 50 cases / 1,000 pop / yr)',
      },
      vectorResistance: {
        fr: 'Variable — prédominance de piqûres résiduelles à l’extérieur (exophagie)',
        en: 'Variable — driven by outdoor residual biting (exophagy)',
      },
      primaryVector: 'Anopheles funestus & Anopheles arabiensis',
      seasonalPattern: {
        fr: 'Foyers sporadiques et cas importés',
        en: 'Sporadic micro-hotspots and imported cases',
      },
      baselineIncidence: 45,
    },
    recommendedPackage: {
      vectorControl: {
        tool: {
          fr: 'Protection continue par MILDA Dual-AI dans les foyers chauds identifiés',
          en: 'Continuous Dual-AI Net Distribution targeted to identified transmission clusters',
        },
        rationale: {
          fr: 'Évite toute reprise de la transmission vectorielle dans les zones réceptives.',
          en: 'Prevents resurgence in receptive ecological niches.',
        },
        coverageTarget: { fr: '100% dans les micro-foyers actifs', en: '100% in active micro-hotspots' },
      },
      chemoprevention: {
        tool: {
          fr: 'Traitement préventif des voyageurs et travailleurs migrants (TPI-Voyage)',
          en: 'Preventive chemoprophylaxis for mobile populations and seasonal migrants',
        },
        rationale: {
          fr: 'Bloque l’importation de parasites depuis les pays voisins à forte charge.',
          en: 'Blocks parasite reintroduction from neighboring high-burden border zones.',
        },
        cycles: { fr: 'À la demande selon les flux migratoires', en: 'As needed according to migration flows' },
      },
      vaccination: {
        tool: {
          fr: 'Intégration PEV consolidée pour maintenir l’immunité de cohorte',
          en: 'Consolidated EPI vaccination maintaining high population immunity',
        },
        rationale: {
          fr: 'Sanctuaire immunitaire empêchant la réinstallation de chaînes de transmission locales.',
          en: 'Immune barrier preventing local parasite establishment.',
        },
        target: { fr: 'Enfants de 6 à 18 mois', en: 'Children aged 6 to 18 months' },
      },
      surveillanceAndCommunity: {
        tool: {
          fr: 'Stratégie 1-3-7 (Notification 24h, Investigation 3j, Réponse ciblée 7j)',
          en: '1-3-7 Surveillance Strategy (Report 1d, Investigate 3d, Clear Focus 7d)',
        },
        rationale: {
          fr: 'Chaque cas positif fait l’objet d’une enquête épidémiologique et d’un dépistage des voisins.',
          en: 'Every confirmed case triggers household investigation and reactive case detection.',
        },
        focus: {
          fr: 'Zéro transmission locale et notification immédiate sur DHIS2',
          en: 'Zero indigenous transmission with real-time case notification',
        },
      },
    },
    impactMultipliers: {
      caseReductionRate: 0.85,
      mortalityReductionRate: 0.95,
      costPerPersonProtected: 3.2,
      dalysAvertedPer1000: 60,
    },
  },
];
