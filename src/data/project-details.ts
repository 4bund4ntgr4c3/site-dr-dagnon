import type { Lang } from '@/i18n/lang';
import type { ProjectResult, ProjectEvidence } from '@/data/projects';

/* Deep-dive sections of the case studies, keyed by project slug. Split
   from projects.ts so the main bundle (SEO meta) never ships the full
   case-study text. Imported only by the lazy ProjectArticle page and by
   SearchModal for its index keywords. */

export interface ProjectDetails {
  /** why the project existed */
  context: Record<Lang, string>;
  /** what was done */
  approach: Record<Lang, string[]>;
  /** measurable outcomes */
  results: ProjectResult[];
  /** links to publications, partner articles or decks */
  evidence: ProjectEvidence[];
}

export const PROJECT_DETAILS: Record<string, ProjectDetails> = {
  'digitalisation-milda-benin': {
    context: {
      fr: 'Les campagnes de distribution de moustiquaires imprégnées à longue durée (MILDA) constituent l\'un des piliers de la lutte antipaludique au Bénin, mais reposaient sur des processus papier difficiles à suivre et à fiabiliser. Depuis 2020, la Fondation Gates structure un portefeuille de subventions pour digitaliser ces campagnes de bout en bout.',
      en: 'Mass distribution of long-lasting insecticidal nets (LLINs) is a pillar of malaria control in Benin, yet it relied on paper processes that were hard to track and to keep accurate. Since 2020, the Gates Foundation has structured a grant portfolio to digitize these campaigns end to end.',
    },
    approach: {
      fr: [
        'Instruire et suivre trois subventions structurantes (CRS, Zenysis) : digitalisation des campagnes, plateforme intégrée et interopérabilité des données.',
        'Accompagner les partenaires de mise en œuvre et les autorités sanitaires du Bénin dans le déploiement.',
        'Analyser les budgets, les jalons de performance et les rapports pour éclairer les décisions d\'investissement.',
      ],
      en: [
        'Review and monitor three anchoring grants (CRS, Zenysis): campaign digitization, an integrated platform, and data interoperability.',
        'Support implementing partners and Benin\'s health authorities throughout deployment.',
        'Analyze budgets, performance milestones and reports to inform investment decisions.',
      ],
    },
    results: [
      { value: '$5,59 M', label: { fr: 'd\'investissements structurants (CRS, Zenysis)', en: 'in anchoring investments (CRS, Zenysis)' } },
      { value: '3', label: { fr: 'subventions : digitalisation, plateforme intégrée, interopérabilité', en: 'grants: digitization, integrated platform, interoperability' } },
      { value: 'MILDA', label: { fr: 'campagnes de distribution digitalisées au Bénin', en: 'distribution campaigns digitized in Benin' } },
    ],
    evidence: [],
  },
  'recherche-cps-smc': {
    context: {
      fr: 'La chimioprévention du paludisme saisonnier (CPS) protège des millions d\'enfants, mais son extension exige des preuves locales : efficacité, coûts et freins à l\'adoption. Le portefeuille combine recherche opérationnelle au Bénin, évaluation d\'efficacité au Burkina Faso et soutien à la coordination mondiale.',
      en: 'Seasonal malaria chemoprevention (SMC) protects millions of children, but scaling it requires local evidence: effectiveness, costs and barriers to uptake. The portfolio combines operational research in Benin, an effectiveness evaluation in Burkina Faso, and support for global coordination.',
    },
    approach: {
      fr: [
        'Financer la recherche opérationnelle MSH sur la CPS au Bénin (272 000 $).',
        'Financer l\'évaluation d\'efficacité LSHTM au Burkina Faso (1,6 M $).',
        'Soutenir l\'Alliance pour la prévention du paludisme (Genève) pour la coordination mondiale (12,97 M $).',
        'Mobiliser les parties prenantes sur les freins à la chimioprévention des enfants d\'âge scolaire (atelier de Kigali).',
      ],
      en: [
        'Fund MSH operational research on SMC in Benin ($272,000).',
        'Fund the LSHTM effectiveness evaluation in Burkina Faso ($1.6M).',
        'Support the Alliance for Malaria Prevention (Geneva) for global coordination ($12.97M).',
        'Bring stakeholders together on barriers to chemoprevention in school-aged children (Kigali workshop).',
      ],
    },
    results: [
      { value: '2025', label: { fr: 'publication Frontiers sur les freins à la chimioprévention des enfants d\'âge scolaire', en: 'Frontiers publication on barriers to school-aged children chemoprevention' } },
      { value: '1,6 M $', label: { fr: 'd\'évaluation d\'efficacité LSHTM au Burkina Faso', en: 'LSHTM effectiveness evaluation in Burkina Faso' } },
      { value: '2026', label: { fr: 'présentations à la réunion conjointe SMC/AMP de Kampala', en: 'presentations at the joint SMC/AMP meeting in Kampala' } },
    ],
    evidence: [
      { label: { fr: 'Article Frontiers in Tropical Diseases', en: 'Frontiers in Tropical Diseases paper' }, url: 'https://doi.org/10.3389/fitd.2025.1480907' },
      { label: { fr: 'Présentations — Réunion conjointe SMC 2026', en: 'Presentations — Joint SMC Annual Meeting 2026' }, url: 'https://www.smc-alliance.org/smc-resources/joint-smc-amp-annual-meetings-2026-presentations' },
    ],
  },
  'malariya-pi-burundi': {
    context: {
      fr: 'Au Burundi, la lutte contre le paludisme s\'appuie sur des sources de données dispersées, difficiles à intégrer dans les décisions. Le projet Malariya Pi, mis en œuvre avec Enabel et soutenu par la Fondation Gates et le Royaume de Belgique, vise à structurer l\'utilisation des données au niveau national.',
      en: 'In Burundi, malaria control relies on scattered data sources that are hard to integrate into decisions. The Malariya Pi project, implemented with Enabel and supported by the Gates Foundation and the Kingdom of Belgium, aims to structure data use at the national level.',
    },
    approach: {
      fr: [
        'Appuyer la mise en place de l\'entrepôt national de données paludisme avec Bluesquare.',
        'Renforcer le dialogue entre le Programme national de lutte contre le paludisme, la direction du système d\'information sanitaire et les partenaires techniques.',
        'Encourager l\'innovation, dont le pilote HealthPulse AI (Audere) pour l\'interprétation automatisée des tests de diagnostic rapide.',
        'Visiter les hôpitaux utilisateurs et mobiliser les institutions partenaires (Enabel, Ambassade de Belgique).',
      ],
      en: [
        'Support the rollout of the national malaria data warehouse with Bluesquare.',
        'Strengthen dialogue between the National Malaria Control Program, the health information directorate and technical partners.',
        'Foster innovation, including the HealthPulse AI pilot (Audere) for automated rapid diagnostic test interpretation.',
        'Visit user hospitals and engage partner institutions (Enabel, Belgium\'s Embassy).',
      ],
    },
    results: [
      { value: 'Entrepôt national', label: { fr: 'de données paludisme opéré avec le ministère de la Santé', en: 'malaria data warehouse operated with the Ministry of Health' } },
      { value: '3', label: { fr: 'institutions publiques mobilisées (PNLP, directions des données et de la santé numérique)', en: 'public institutions engaged (NMCP, data and digital health directorates)' } },
      { value: 'Pilote', label: { fr: 'HealthPulse AI pour l\'interprétation des TDR (Audere)', en: 'HealthPulse AI for RDT interpretation (Audere)' } },
    ],
    evidence: [
      { label: { fr: 'Article Bluesquare — mars 2026', en: 'Bluesquare article — March 2026' }, url: 'https://www.bluesquarehub.com/fr/bluesquare-news-structurer-lutilisation-des-donnees-dans-la-lutte-contre-le-paludisme-au-burundi/' },
    ],
  },
  'arm3-systeme-information-benin': {
    context: {
      fr: 'En 2012, le système d\'information de routine du Bénin laissait une large part des formations sanitaires hors du suivi, avec des erreurs fréquentes. En tant que responsable suivi-évaluation du projet ARM3 financé par l\'USAID, l\'objectif était de fiabiliser les données de 1 114 centres de santé répartis sur 34 zones.',
      en: 'In 2012, Benin\'s routine information system left much of the health system untracked, with frequent errors. As M&E lead of the USAID-funded ARM3 project, the goal was to make data from 1,114 health facilities across 34 health zones reliable.',
    },
    approach: {
      fr: [
        'Diriger les systèmes de suivi-évaluation et l\'approche basée sur la performance dans les 34 zones de santé.',
        'Concevoir et mettre en œuvre des audits de qualité des données sur les 1 114 centres de santé.',
        'Fournir l\'appui technique au système d\'information sanitaire du ministère de la Santé.',
        'Former les statisticiens à l\'utilisation du logiciel LOGISNIGS (44 statisticiens hospitaliers, 34 statisticiens de zones).',
      ],
      en: [
        'Lead M&E systems and the performance-based approach across all 34 health zones.',
        'Design and run routine data quality audits across the 1,114 health facilities.',
        'Provide technical support to the Ministry of Health\'s information system.',
        'Train statisticians on the LOGISNIGS software (44 hospital statisticians, 34 health zone statisticians).',
      ],
    },
    results: [
      { value: '35 % → 94 %', label: { fr: 'de complétude du système d\'information de routine', en: 'routine information system completeness' } },
      { value: '44 % → 5 %', label: { fr: 'de taux d\'erreur au niveau national', en: 'national error rate' } },
      { value: '1 114', label: { fr: 'centres de santé couverts', en: 'health facilities covered' } },
    ],
    evidence: [],
  },
  'irs-nord-benin': {
    context: {
      fr: 'Le nord du Bénin concentre la transmission palustre la plus intense du pays. Les campagnes de pulvérisation intradomiciliaire (IRS) financées par le PMI y ont été déployées dans l\'Alibori, la Donga et l\'Atacora, avec un besoin constant de données entomologiques rigoureuses pour guider les décisions.',
      en: 'Northern Benin carries the country\'s most intense malaria transmission. PMI-funded indoor residual spraying (IRS) campaigns were deployed in Alibori, Donga and Atacora, with a constant need for rigorous entomological data to guide decisions.',
    },
    approach: {
      fr: [
        'Superviser la mise en œuvre des campagnes IRS (Abt Associates / AIRS).',
        'Coordonner la collecte de données entomologiques de référence avant et pendant les campagnes.',
        'Encadrer les études d\'efficacité (Actellic 300 CS) publiées dans Parasites & Vectors.',
        'Conduire une thèse de doctorat sur le coût-efficacité de l\'IRS (Université de Groningen).',
      ],
      en: [
        'Oversee IRS campaign implementation (Abt Associates / AIRS).',
        'Coordinate baseline and monitoring entomological data collection around the campaigns.',
        'Steer effectiveness studies (Actellic 300 CS) published in Parasites & Vectors.',
        'Conduct a Ph.D. on the cost-effectiveness of IRS (University of Groningen).',
      ],
    },
    results: [
      { value: '4+', label: { fr: 'publications entomologiques de référence (2018-2020)', en: 'reference entomological publications (2018-2020)' } },
      { value: 'Ph.D. en cours', label: { fr: 'thèse de coût-efficacité de l\'IRS à Groningen', en: 'IRS cost-effectiveness thesis at Groningen' } },
      { value: '3', label: { fr: 'régions couvertes : Alibori, Donga, Atacora', en: 'regions covered: Alibori, Donga, Atacora' } },
    ],
    evidence: [
      { label: { fr: 'Efficacité d\'Actellic 300 CS — Parasites & Vectors (2019)', en: 'Actellic 300 CS effectiveness — Parasites & Vectors (2019)' }, url: 'https://doi.org/10.1186/s13071-019-3865-1' },
      { label: { fr: 'Transmission après retrait de l\'IRS — Malaria Journal (2020)', en: 'Transmission after IRS withdrawal — Malaria Journal (2020)' }, url: 'https://doi.org/10.1186/s12936-019-3086-2' },
      { label: { fr: 'Leçons d\'une décennie de suivi — Malaria Journal (2020)', en: 'A decade of monitoring lessons — Malaria Journal (2020)' }, url: 'https://malariajournal.biomedcentral.com/articles/10.1186/s12936-020-3112-9' },
    ],
  },
  'reponse-epidemies-benin': {
    context: {
      fr: 'Entre 2014 et 2020, le Bénin a dû se préparer aux épidémies d\'Ebola, de fièvre de Lassa et de COVID-19. À l\'USAID/PMI, la coordination de la préparation et de la réponse devait préserver les acquis des programmes de lutte contre le paludisme.',
      en: 'Between 2014 and 2020, Benin faced preparing for Ebola, Lassa fever and COVID-19 epidemics. At USAID/PMI, coordinating preparedness and response had to protect the gains of malaria programs.',
    },
    approach: {
      fr: [
        'Coordonner la réponse de l\'USAID aux épidémies émergentes (Ebola, fièvre de Lassa, COVID-19).',
        'Assurer la continuité des services essentiels de lutte contre le paludisme pendant la pandémie de COVID-19.',
        'Maintenir les mécanismes de suivi des programmes et la coordination avec les partenaires.',
      ],
      en: [
        'Coordinate the USAID response to emerging epidemics (Ebola, Lassa fever, COVID-19).',
        'Ensure continuity of essential malaria services during the COVID-19 pandemic.',
        'Maintain program monitoring mechanisms and partner coordination.',
      ],
    },
    results: [
      { value: '3', label: { fr: 'épidémies coordonnées : Ebola, fièvre de Lassa, COVID-19', en: 'epidemics coordinated: Ebola, Lassa fever, COVID-19' } },
      { value: '2020', label: { fr: 'Meritorious Honor Award pour la continuité des services paludisme', en: 'Meritorious Honor Award for malaria service continuity' } },
    ],
    evidence: [],
  },
  'contrat-g2g-pnlp-benin': {
    context: {
      fr: 'Les mécanismes de gouvernement à gouvernement (G2G) transfèrent progressivement la gestion des financements aux institutions nationales. La négociation avec le Programme national de lutte contre le paludisme (PNLP) du Bénin visait une transition maîtrisée, avec des économies pour le gouvernement américain.',
      en: 'Government-to-government (G2G) mechanisms progressively transfer funding management to national institutions. Negotiating with Benin\'s National Malaria Control Program (NMCP) aimed for a controlled transition, with savings for the U.S. government.',
    },
    approach: {
      fr: [
        'Négocier le contrat G2G avec le PNLP et superviser son exécution (accords IL).',
        'Superviser les accords G2G conclus avec le PNLP et le CREC (Centre de recherche entomologique de Cotonou).',
        'Gérer les jalons de performance, la budgétisation et les rapports des mécanismes.',
      ],
      en: [
        'Negotiate the G2G contract with the NMCP and oversee its execution (IL agreements).',
        'Oversee the G2G agreements with the NMCP and CREC (Cotonou Entomology Research Centre).',
        'Manage performance milestones, budgeting and reporting of the mechanisms.',
      ],
    },
    results: [
      { value: '3 000 000 $', label: { fr: 'd\'économies sur 5 ans pour le gouvernement américain', en: 'in savings over 5 years for the U.S. government' } },
      { value: '2', label: { fr: 'accords G2G supervisés : PNLP et CREC', en: 'G2G agreements overseen: NMCP and CREC' } },
    ],
    evidence: [],
  },
};
