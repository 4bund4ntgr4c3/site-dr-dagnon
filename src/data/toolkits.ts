export interface ToolkitGuide {
  id: string;
  category: 'digital' | 'governance' | 'surveillance' | 'smc';
  title: {
    fr: string;
    en: string;
  };
  subtitle: {
    fr: string;
    en: string;
  };
  description: {
    fr: string;
    en: string;
  };
  targetAudience: {
    fr: string;
    en: string;
  };
  steps: {
    phase: string;
    title: { fr: string; en: string };
    details: { fr: string[]; en: string[] };
  }[];
  keyTakeaways: {
    fr: string[];
    en: string[];
  };
  metrics: {
    label: { fr: string; en: string };
    value: string;
  }[];
}

export const TOOLKITS: ToolkitGuide[] = [
  {
    id: 'digital-campaign-milda',
    category: 'digital',
    title: {
      fr: 'Protocole Opérationnel de Digitalisation des Campagnes MILDA',
      en: 'Operational Protocol for Digitalizing LLIN Mass Campaigns',
    },
    subtitle: {
      fr: 'Guide étape par étape pour le dénombrement géolocalisé et la distribution sans papier',
      en: 'Step-by-step guide for geolocated household enumeration and paperless distribution',
    },
    description: {
      fr: 'Méthodologie éprouvée lors des campagnes nationales au Bénin et au Burundi pour éliminer les doublons, garantir la traçabilité des stocks de moustiquaires et synchroniser les données hors-ligne.',
      en: 'Field-tested methodology from national campaigns in Benin and Burundi to eliminate ghost households, ensure net stock tracking, and enable offline-first mobile sync.',
    },
    targetAudience: {
      fr: 'Directeurs PNLP, Coordonnateurs provinciaux, Spécialistes SIG & M&E',
      en: 'NMCP Directors, Provincial Coordinators, GIS & M&E Specialists',
    },
    metrics: [
      { label: { fr: 'Réduction des doublons', en: 'Duplicate reduction' }, value: '-98%' },
      { label: { fr: 'Couverture effective', en: 'Effective coverage' }, value: '96.4%' },
      { label: { fr: 'Gain de temps validation', en: 'Validation time saved' }, value: '14 jours' },
    ],
    steps: [
      {
        phase: 'Phase 1',
        title: {
          fr: 'Micro-planification & Cartographie SIG',
          en: 'Microplanning & GIS Mapping',
        },
        details: {
          fr: [
            'Découpage des aires de santé en îlots de dénombrement numérisés avec OpenStreetMap / QGIS.',
            'Paramétrage des serveurs DHIS2 / ODK / Android avec protocoles de sécurité et chiffrement AES-256.',
            'Attribution des identifiants uniques aux agents de dénombrement par zone géographique.',
          ],
          en: [
            'Delineation of health catchment areas into digitized enumeration clusters via OpenStreetMap / QGIS.',
            'Configuration of DHIS2 / ODK / Android servers with AES-256 security and encryption protocols.',
            'Issuance of unique credentials for community enumerators mapped to specific GPS bounding boxes.',
          ],
        },
      },
      {
        phase: 'Phase 2',
        title: {
          fr: 'Dénombrement Géolocalisé des Ménages',
          en: 'Geolocated Household Enumeration',
        },
        details: {
          fr: [
            'Enregistrement porte-à-porte sur tablettes avec validation GPS instantanée du polygone d’habitation.',
            'Génération de coupons digitaux / QR codes uniques par ménage pour la phase de retrait.',
            'Contrôle automatique de plausibilité (alerte si > 12 personnes par ménage sans validation superviseur).',
          ],
          en: [
            'Door-to-door mobile recording with real-time GPS building polygon validation.',
            'Generation of unique digital vouchers / QR codes per household for distribution phase redemption.',
            'Automated plausibility checks (alerts triggered if > 12 occupants without supervisor sign-off).',
          ],
        },
      },
      {
        phase: 'Phase 3',
        title: {
          fr: 'Distribution & Réconciliation des Stocks',
          en: 'Distribution & Stock Reconciliation',
        },
        details: {
          fr: [
            'Scan des coupons QR aux sites de distribution et pointage en temps réel dans l’application mobile.',
            'Bilan quotidien des stocks restants avec détection instantanée des écarts magasins / sites.',
            'Tableau de bord de supervision national accessible par les partenaires techniques et financiers.',
          ],
          en: [
            'QR coupon scanning at distribution points with instantaneous mobile redemption verification.',
            'Daily remaining stock reconciliations flagging store-to-site discrepancies within 4 hours.',
            'National executive supervision dashboard with role-based access for donors and health ministry.',
          ],
        },
      },
    ],
    keyTakeaways: {
      fr: [
        'Ne jamais démarrer le dénombrement sans test de charge préalable sur les serveurs centraux.',
        'Prévoir des batteries externes (Powerbanks) et des hubs solaires dans les zones rurales isolées.',
        'La triangulation GPS + Photo de porte garantit l’intégrité des données face aux bailleurs.',
      ],
      en: [
        'Never begin field enumeration without rigorous stress-testing of central sync endpoints.',
        'Deploy rugged power banks and solar charging stations in off-grid rural areas.',
        'GPS polygon triangulation coupled with entrance photos guarantees audit compliance.',
      ],
    },
  },
  {
    id: 'g2g-direct-governance',
    category: 'governance',
    title: {
      fr: 'Cadre de Gouvernance pour Contrats Directs G2G (USAID / Ministère)',
      en: 'Governance Framework for USAID Government-to-Government (G2G) Direct Grants',
    },
    subtitle: {
      fr: 'Guide pratique pour l’alignement institutionnel, la fiducie et la gestion des risques',
      en: 'Practical roadmap for institutional fiduciary alignment and direct grant risk management',
    },
    description: {
      fr: 'Cadre d’architecture financière et managériale basé sur le succès des accords bilatéraux au Bénin pour transférer directement les fonds au Trésor public avec audits conjoints.',
      en: 'Financial and managerial architecture framework based on bilateral direct awards in Benin to disburse funds straight through national treasuries with joint audit oversight.',
    },
    targetAudience: {
      fr: 'Secrétaires Généraux de Ministères, Directeurs Administratifs et Financiers, Bailleurs bilatéraux',
      en: 'Ministry Permanent Secretaries, Financial Directors, Bilateral Donor Representatives',
    },
    metrics: [
      { label: { fr: 'Taux de décaissement', en: 'Disbursement rate' }, value: '98.5%' },
      { label: { fr: 'Conformité aux audits', en: 'Audit compliance' }, value: '100%' },
      { label: { fr: 'Économie frais intermédiaires', en: 'Overhead costs saved' }, value: '18%' },
    ],
    steps: [
      {
        phase: 'Étape 1',
        title: {
          fr: 'Évaluation des Systèmes Nationaux (NUPAS / PFM)',
          en: 'Public Financial Management Assessment (PFM / NUPAS)',
        },
        details: {
          fr: [
            'Audit blanc des procédures de passation de marchés et du système comptable du Ministère.',
            'Création d’un compte séquestre dédié au Trésor public avec double signature Ministère / Bailleur.',
            'Adoption d’un manuel de procédures administratives, financières et comptables harmonisé.',
          ],
          en: [
            'Pre-award simulation audit of ministry public procurement and internal control mechanisms.',
            'Establishment of a dedicated sub-account at the National Treasury with dual sign-off safeguards.',
            'Adoption of an aligned Administrative, Financial, and Accounting Procedures Manual.',
          ],
        },
      },
      {
        phase: 'Étape 2',
        title: {
          fr: 'Matrice d’Indicateurs Liés aux Décaissements (DLI)',
          en: 'Disbursement-Linked Indicators (DLI) Matrix',
        },
        details: {
          fr: [
            'Indexation de 40% des fonds sur l’atteinte de cibles programmatiques certifiées par un auditeur indépendant.',
            'Conditionnement des tranches semestrielles à la transmission des rapports de justification sous 45 jours.',
            'Mise en place d’un comité technique paritaire de revue mensuelle des dépenses.',
          ],
          en: [
            'Indexing 40% of grant disbursements to verified programmatic milestones certified by independent auditors.',
            'Conditioning bi-annual funding tranches on timely financial expenditure reconciliations within 45 days.',
            'Instituting a joint technical oversight committee for monthly expenditure reviews.',
          ],
        },
      },
    ],
    keyTakeaways: {
      fr: [
        'Le financement direct G2G renforce la souveraineté sanitaire tout en éliminant les marges des intermédiaires.',
        'La clé réside dans la transparence totale des flux de trésorerie et la digitalisation des pièces justificatives.',
      ],
      en: [
        'Direct G2G funding cements health sovereignty while eliminating unnecessary NGO intermediary overheads.',
        'Success hinges on radical cash flow transparency and end-to-end digital vouchers.',
      ],
    },
  },
  {
    id: 'dhis2-data-quality-audit',
    category: 'surveillance',
    title: {
      fr: 'Grille d’Audit & d’Amélioration de la Qualité des Données DHIS2',
      en: 'DHIS2 Health Data Completeness & Quality Audit Framework',
    },
    subtitle: {
      fr: 'Protocole en 10 points pour garantir des statistiques épidémiologiques fiables',
      en: '10-point operational protocol to ensure robust and audit-proof epidemiological metrics',
    },
    description: {
      fr: 'Outil de diagnostic pour éradiquer les sous-déclarations, vérifier la cohérence entre intrants consommés et cas traités, et automatiser les alertes d’épidémies au niveau district.',
      en: 'Diagnostic tool to eliminate underreporting, verify stock consumption vs treated cases, and automate district epidemic outbreak alarms.',
    },
    targetAudience: {
      fr: 'Médecins coordonnateurs de zone sanitaire, Gestionnaires de bases de données, Épidémiologistes',
      en: 'District Chief Medical Officers, Database Managers, Field Epidemiologists',
    },
    metrics: [
      { label: { fr: 'Complétude des rapports', en: 'Report completeness' }, value: '> 95%' },
      { label: { fr: 'Promptitude de saisie', en: 'Reporting timeliness' }, value: '5e du mois' },
      { label: { fr: 'Concordance stock / cas', en: 'Stock-case concordance' }, value: '99.1%' },
    ],
    steps: [
      {
        phase: 'Axe 1',
        title: {
          fr: 'Règles de Validation Automatiques',
          en: 'Automated Validation Rule Engines',
        },
        details: {
          fr: [
            'Blocage de la soumission si : Cas confirmés > TDR réalisés.',
            'Alerte de cohérence si : ACT délivrées < 90% ou > 110% des cas positifs confirmés.',
            'Contrôle automatique du taux de positivité (> 80% déclenche une investigation de qualité des tests).',
          ],
          en: [
            'Hard block on submission when: Confirmed positive cases > RDTs performed.',
            'Coherence flag if: ACTs dispensed < 90% or > 110% of positive confirmed cases.',
            'Automated test positivity threshold (> 80% triggers lab quality supervision visit).',
          ],
        },
      },
      {
        phase: 'Axe 2',
        title: {
          fr: 'Routine de Supervision Formative Mensuelle',
          en: 'Monthly Supportive Supervision Routine',
        },
        details: {
          fr: [
            'Recalcul par sondage sur 20 registres papier de consultation pour comparer avec la saisie DHIS2.',
            'Restitution des performances sous forme d’infographies simples affichées dans chaque centre de santé.',
          ],
          en: [
            'Random sample recount of 20 paper clinic consultation registers cross-checked with DHIS2 entries.',
            'Visual monthly performance feedback posters displayed in each participating primary care clinic.',
          ],
        },
      },
    ],
    keyTakeaways: {
      fr: [
        'Des données sanitaires de mauvaise qualité entraînent des ruptures de stock ou des gaspillages massifs d’ACT.',
        'La valorisation des infirmiers et majors de centres est le premier levier de promptitude des données.',
      ],
      en: [
        'Poor quality health data directly triggers severe ACT stockouts or massive resource misallocations.',
        'Recognizing and celebrating frontline health workers is the #1 lever for data timeliness.',
      ],
    },
  },
  {
    id: 'smc-targeting-matrix',
    category: 'smc',
    title: {
      fr: 'Matrice de Modélisation du Ciblage CPS / SMC',
      en: 'SMC Seasonal Chemoprevention Targeting & Modeling Matrix',
    },
    subtitle: {
      fr: 'Optimisation des 4 à 5 cycles de chimioprévention pour enfants de 3 à 59 mois',
      en: 'Optimization of 4 to 5 monthly chemoprevention cycles for children 3-59 months',
    },
    description: {
      fr: 'Guide pour synchroniser les passages des distributeurs communautaires avec le pic pluviométrique et étendre la protection jusqu’à 10 ans dans les zones à forte charge.',
      en: 'Methodology to align community distributor distribution windows with peak rainfall and expand protection up to 10 years old in high-burden settings.',
    },
    targetAudience: {
      fr: 'Équipes cadres de district, Responsables logistique pharmaceutique, Partenaires CPS',
      en: 'District Health Management Teams, Pharmacy Supply Chain Leads, SMC Partners',
    },
    metrics: [
      { label: { fr: 'Réduction cas graves', en: 'Severe malaria drop' }, value: '-75%' },
      { label: { fr: 'Couverture 4e cycle', en: '4th cycle coverage' }, value: '92.8%' },
      { label: { fr: 'Taux d’observance J2/J3', en: 'Day 2/3 adherence' }, value: '96.2%' },
    ],
    steps: [
      {
        phase: 'Module 1',
        title: {
          fr: 'Modélisation du Calendrier Pluviométrique',
          en: 'Rainfall Seasonality Modeling',
        },
        details: {
          fr: [
            'Croisement des données météo satellite sur 5 ans avec la courbe d’incidence palustre mensuelle.',
            'Positionnement du Cycle 1 exactement 15 jours avant la montée en charge des pluies torrentielles.',
            'Planification d’un 5e cycle d’extension lorsque la saison des pluies se prolonge en novembre/décembre.',
          ],
          en: [
            'Cross-referencing 5-year satellite precipitation data with historical monthly malaria incidence curves.',
            'Scheduling Cycle 1 exactly 15 days prior to torrential rain onset to build prophylactic drug levels.',
            'Planning an optional 5th extension cycle whenever the rainy season extends into November/December.',
          ],
        },
      },
      {
        phase: 'Module 2',
        title: {
          fr: 'Stratégie du TDO (Traitement Directement Observé)',
          en: 'Directly Observed Therapy (DOT) Strategy',
        },
        details: {
          fr: [
            'Administration obligatoire de la Dose 1 (SP + AQ) par le distributeur communautaire devant la mère.',
            'Marquage indélébile de l’ongle de l’enfant et remise des doses J2 et J3 avec carte d’observance illustrée.',
          ],
          en: [
            'Mandatory administration of Dose 1 (SP + AQ) by the community distributor under direct parental supervision.',
            'Indelible fingernail marking and dispensing of Day 2/3 blister packs with pictorial adherence cards.',
          ],
        },
      },
    ],
    keyTakeaways: {
      fr: [
        'La CPS est l’intervention la plus coût-efficace en zone sahélienne : moins de 4 $ par enfant protégé par an.',
        'La gestion de la pharmacovigilance active renforce la confiance des communautés.',
      ],
      en: [
        'SMC is the most cost-effective intervention in the Sahel: under $4 per child protected per season.',
        'Active community pharmacovigilance builds lasting trust with families.',
      ],
    },
  },
];
