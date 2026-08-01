import type { Lang } from '@/i18n/lang';

export const STATS: Record<Lang, { value: number; suffix: string; label: string; detail: string }[]> = {
  fr: [
    { value: 17, suffix: '+', label: "années d'expérience", detail: 'Programmes paludisme, VIH/SIDA, NTN et santé MNI à travers l’Afrique' },
    { value: 17, suffix: '', label: 'publications scientifiques', detail: 'Malaria Journal, Parasites & Vectors, Frontiers…' },
    { value: 1114, suffix: '', label: 'centres de santé couverts', detail: 'Complétude du système d’information : 35 % → 94 %' },
    { value: 27, suffix: '', label: 'pays PMI — distinction 2020', detail: 'FSN Employee of the Year, U.S. President’s Malaria Initiative' },
  ],
  en: [
    { value: 17, suffix: '+', label: 'years of experience', detail: 'Malaria, HIV/AIDS, NTD and MNCH programs across Africa' },
    { value: 17, suffix: '', label: 'scientific publications', detail: 'Malaria Journal, Parasites & Vectors, Frontiers…' },
    { value: 1114, suffix: '', label: 'health facilities covered', detail: 'Routine information system completeness: 35% → 94%' },
    { value: 27, suffix: '', label: 'PMI countries — 2020 award', detail: 'FSN Employee of the Year, U.S. President’s Malaria Initiative' },
  ],
};

export const IDENTITY: Record<Lang, { title: string; text: string; icon: string }[]> = {
  fr: [
    { title: 'Rôle actuel', text: 'Senior Program Officer — Paludisme / Afrique francophone à la Fondation Gates.', icon: 'briefcase' },
    { title: 'Domaines de focus', text: 'Paludisme, santé publique, systèmes de santé, données pour la décision, santé numérique.', icon: 'target' },
    { title: 'Périmètre de travail', text: 'Basé en Afrique, interventions dans les pays africains anglophones et francophones.', icon: 'globe' },
    { title: 'Langues', text: 'Français (natif), anglais (professionnel avancé), notions d’allemand et d’espagnol.', icon: 'languages' },
  ],
  en: [
    { title: 'Current role', text: 'Senior Program Officer — Malaria / Francophone Africa at the Gates Foundation.', icon: 'briefcase' },
    { title: 'Focus areas', text: 'Malaria, public health, health systems, data for decision-making, digital health.', icon: 'target' },
    { title: 'Scope of work', text: 'Based in Africa, working across anglophone and francophone African countries.', icon: 'globe' },
    { title: 'Languages', text: 'French (native), English (advanced professional), some German and Spanish.', icon: 'languages' },
  ],
};

export const EXPERTISE: Record<Lang, { title: string; text: string; icon: string }[]> = {
  fr: [
    { title: 'Lutte & élimination du paludisme', text: 'Surveillance, lutte antivectorielle, chimio-prévention saisonnière (CPS), distribution de MILDA et stratégies de mise en œuvre.', icon: 'shield' },
    { title: 'Santé numérique & données', text: 'Digitalisation des campagnes, plateformes interopérables de données épidémiologiques et logistiques pour la prise de décision.', icon: 'database' },
    { title: 'Portefeuilles & subventions', text: 'Gestion de portefeuille, budgétisation, analyse financière, engagement des partenaires et coordination des bailleurs.', icon: 'layers' },
    { title: 'Suivi, évaluation & recherche', text: 'Recherche opérationnelle et de mise en œuvre, qualité des données épidémiologiques, performance des programmes nationaux.', icon: 'chart' },
    { title: 'Engagement — Afrique francophone', text: 'Collaboration avec gouvernements, programmes nationaux de lutte contre le paludisme, ONG, bailleurs, universités et partenaires techniques.', icon: 'handshake' },
  ],
  en: [
    { title: 'Malaria control & elimination', text: 'Surveillance, vector control, seasonal chemoprevention (SMC), LLIN distribution and implementation strategies.', icon: 'shield' },
    { title: 'Digital health & data', text: 'Campaign digitalization, interoperable epidemiological and logistic data platforms for decision-making.', icon: 'database' },
    { title: 'Portfolios & grants', text: 'Portfolio management, budgeting, financial analysis, partner engagement and funder coordination.', icon: 'layers' },
    { title: 'Monitoring, evaluation & research', text: 'Operational and implementation research, epidemiological data quality, national program performance.', icon: 'chart' },
    { title: 'Engagement — Francophone Africa', text: 'Collaboration with governments, national malaria control programs, NGOs, funders, universities and technical partners.', icon: 'handshake' },
  ],
};

export const EXPERIENCE: Record<Lang, { role: string; org: string; period: string; current: boolean; text: string; details: { responsibilities: string[]; projects?: { name: string; scope: string; budget: string }[]; achievement?: string } }[]> = {
  fr: [
    {
      role: 'Senior Program Officer — Paludisme / Afrique francophone',
      org: 'Fondation Gates',
      period: 'déc. 2020 — aujourd\'hui',
      current: true,
      text: 'Élabore et pilote les stratégies de mise en œuvre du paludisme et des investissements fondés sur la performance ; instruit les subventions et contrats ; appuie la stratégie, la collaboration, la pérennité et l\'engagement des partenaires de terrain.',
      details: {
        responsibilities: [
          'Développer, gérer et mettre en œuvre les stratégies de mise en œuvre du paludisme et négocier des investissements complexes fondés sur la performance',
          'Instruire les lettres d\'intention, les subventions et les propositions de contrat ; fournir des analyses écrites précises et des recommandations',
          'Gérer les processus internes, le portefeuille, le budgétisation et les rapports',
          'Contribuer à la conception de nouvelles stratégies et collaborations pour la durabilité à long terme',
          'Maintenir des interactions de qualité avec les partenaires de terrain, les subventionnaires et les parties prenantes',
          'Représenter la fondation auprès des parties prenantes publiques et privées',
        ],
        projects: [
          { name: 'CRS — Digitalisation MILDA', scope: 'Bénin', budget: '$3 150 000 (3 ans)' },
          { name: 'CRS — Plateforme intégrée', scope: 'Bénin', budget: '$2 000 000 (3 ans)' },
          { name: 'MSH — Recherche CPS', scope: 'Bénin', budget: '$272 000 (2 ans)' },
          { name: 'Zenysis — Plateforme interopérabilité', scope: 'Bénin', budget: '$438 000 (1 an)' },
          { name: 'Muso Inc — Biomarqueurs résistance', scope: 'Mali', budget: '$674 000 (3 ans)' },
          { name: 'Alliance Malaria Prevention', scope: 'Geneva', budget: '$12 969 000 (3 ans)' },
          { name: 'LSHTM — Efficacité CPS', scope: 'Burkina Faso', budget: '$1 600 000 (3 ans)' },
          { name: 'PSI — Marché paludisme', scope: 'Bénin, Nigéria, Cameroun', budget: '$4 000 000 (3 ans)' },
          { name: 'PATH MACEPA', scope: 'RDC, Sénégal, Gambie, RCA', budget: '$48 000 000' },
          { name: 'CHAI Malaria Grant', scope: 'RDC, Cameroun, Bénin, Burkina Faso', budget: '$74 000 000' },
          { name: 'ENABEL', scope: 'Burundi, Niger', budget: '$11 000 000' },
          { name: 'Harvard — Science of Defeating Malaria', scope: 'USA', budget: '$750 000' },
        ],
      },
    },
    {
      role: 'Spécialiste gestion de programme / paludisme',
      org: 'USAID Bénin — U.S. President\'s Malaria Initiative',
      period: 'nov. 2015 — nov. 2020',
      current: false,
      text: 'Pilotage de la planification, de la mise en œuvre, de la coordination et du suivi des programmes paludisme ; appui à la préparation et à la réponse aux épidémies ; gestion des mécanismes G2G et partenaires.',
      details: {
        responsibilities: [
          'Responsable de tous les aspects des programmes paludisme : planification, organisation, mise en œuvre, coordination et suivi pour les résultats',
          'Superviser et guider les activités financées par subventions, contrats et accords de coopération',
          'Coordonner la réponse de l\'USAID aux épidémies émergentes (Ebola, fièvre de Lassa, COVID-19)',
          'Superviser la mise en œuvre des activités de contrôle de 7 maladies tropicales négligées',
          'Participer à l\'élaboration du Plan opérationnel du paludisme (MOP) et des documents d\'évaluation',
        ],
        projects: [
          { name: 'ARM3 (AOR)', scope: 'Bénin', budget: '$21 000 000 (6 ans)' },
          { name: 'DINDJI HIV (AOR)', scope: 'Bénin', budget: '$3 200 000 (3 ans)' },
          { name: 'Ebola (AOR)', scope: 'Bénin', budget: '$600 000 (2 ans)' },
          { name: 'IL 19, 27, 29 (GATR)', scope: 'PNLP Bénin', budget: '$4 000 000 (3 ans)' },
          { name: 'IL 25, 32-34 (GATR)', scope: 'PNLP Bénin', budget: '$4 000 000 (3 ans)' },
          { name: 'IL 24, 26, 31, 33 (GATR)', scope: 'CREC Bénin', budget: '$5 000 000 (3 ans)' },
          { name: 'AIRS (Manager)', scope: 'Abt Associates', budget: '$4 200 000/an' },
          { name: 'CATCH (Manager)', scope: 'CRS', budget: '$3 000 000 (3 ans)' },
          { name: 'ENVISION (Manager)', scope: 'RTI', budget: '$10 000 000 (7 ans)' },
          { name: 'ACT END NTDs (Manager)', scope: 'FHI 360', budget: '$10 000 000 (5 ans)' },
        ],
        achievement: 'Négociation d\'un contrat G2G avec le PNLP, économies allant jusqu’à 3 000 000 $ sur 5 ans pour le gouvernement américain.',
      },
    },
    {
      role: 'Consultant international — Suivi & évaluation',
      org: 'MSH / SIAPS, Guinée',
      period: 'oct. — nov. 2015',
      current: false,
      text: 'Appui aux activités de suivi-évaluation et à la revue du plan stratégique national de lutte contre le paludisme de la Guinée.',
      details: {
        responsibilities: [
          'Assurer les activités de suivi et évaluation du projet',
          'Appuyer le Ministère de la Santé de Guinée dans la revue de son plan stratégique national paludisme',
        ],
      },
    },
    {
      role: 'Responsable suivi & évaluation',
      org: 'MCDI / ARM3, Bénin',
      period: 'nov. 2012 — sept. 2015',
      current: false,
      text: 'Direction des systèmes de S&E, enquêtes, audits de qualité des données, suivi basé sur la performance et amélioration des informations paludisme de routine.',
      details: {
        responsibilities: [
          'Superviser les conseillers S&E de terrain et le conseiller base de données',
          'Rapport périodique des activités et progrès au Consortium à l\'USAID',
          'Concevoir et mettre en œuvre les activités de S&E du Consortium',
          'Fournir un appui technique au Système d\'Information Sanitaire pour le Ministère de la Santé',
          'Participer à la conception et à la réalisation des enquêtes',
          'Concevoir et mettre en œuvre le processus d\'audit de qualité des données',
          'Assurer le S&E de l\'approche basée sur la performance dans les 34 zones de santé',
        ],
        achievement: 'Augmentation de la complétude du système d\'information de routine de 35% à 94% et diminution du taux d\'erreur de 44% à 5% pour 1 114 centres de santé.',
      },
    },
    {
      role: 'Spécialiste santé maternelle, néonatale et infantile & vaccination',
      org: 'URC / PISAF, Bénin',
      period: 'nov. 2011 — oct. 2012',
      current: false,
      text: 'Appui aux activités intégrées de santé familiale, suivi de la stratégie ETAT paludisme, analyse de la vaccination et formation des agents de santé.',
      details: {
        responsibilities: [
          'Assurer le suivi des données et de la stratégie ETAT (gestion du paludisme sévère chez les enfants de moins de 5 ans)',
          'Former le personnel de terrain aux interventions intégrées de santé, y compris le paludisme',
          'Appuyer la mise en œuvre des activités intégrées de santé familiale',
          'Analyser la couverture vaccinale et identifier les stratégies pour l\'augmenter',
        ],
      },
    },
    {
      role: 'Moniteur d\'essais cliniques',
      org: 'CERHHUD / AUDOBEM-AFRO',
      period: 'janv. 2008 — juil. 2010',
      current: false,
      text: 'Collecte et assurance qualité des données épidémiologiques de 15 hôpitaux ; appui aux audits cliniques et à la formation en soins obstétricaux d\'urgence.',
      details: {
        responsibilities: [
          'Collecte et assurance qualité des données épidémiologiques de 15 hôpitaux dans les 12 régions du Bénin',
          'Suivi et évaluation de la mise en œuvre des audits cliniques dans 10 hôpitaux',
          'Formation des professionnels de santé à la prise en charge obstétricale d\'urgence',
          'Formation à l\'utilisation des partographes et aux audits cliniques',
          'Analyse périodique des données collectées',
        ],
      },
    },
  ],
  en: [
    {
      role: 'Senior Program Officer — Malaria / Francophone Africa',
      org: 'Gates Foundation',
      period: 'Dec. 2020 — present',
      current: true,
      text: 'Designs and leads malaria implementation strategies and performance-based investments; reviews grants and contracts; supports strategy, collaboration, sustainability and field partner engagement.',
      details: {
        responsibilities: [
          'Develop, manage, and implement malaria implementation strategies and negotiate complex performance-based investments',
          'Review letters of inquiry, grant and contract proposals; provide precise, concise written analyses and recommendations',
          'Manage internal processes, portfolio progress, budgeting, and reporting',
          'Contribute to the design of new strategies, collaborations, and implementation plans for long-term sustainability',
          'Maintain high-quality interactions with field partners, grantees, and key stakeholders',
          'Represent the foundation with public and private stakeholders',
        ],
        projects: [
          { name: 'CRS — LLIN Digitization', scope: 'Benin', budget: '$3,150,000 (3 yrs)' },
          { name: 'CRS — Integrated Platform', scope: 'Benin', budget: '$2,000,000 (3 yrs)' },
          { name: 'MSH — SMC Research', scope: 'Benin', budget: '$272,000 (2 yrs)' },
          { name: 'Zenysis — Interoperability', scope: 'Benin', budget: '$438,000 (1 yr)' },
          { name: 'Muso Inc — Resistance Biomarkers', scope: 'Mali', budget: '$674,000 (3 yrs)' },
          { name: 'Alliance Malaria Prevention', scope: 'Geneva', budget: '$12,969,000 (3 yrs)' },
          { name: 'LSHTM — SMC Efficacy', scope: 'Burkina Faso', budget: '$1,600,000 (3 yrs)' },
          { name: 'PSI — Malaria Market', scope: 'Benin, Nigeria, Cameroon', budget: '$4,000,000 (3 yrs)' },
          { name: 'PATH MACEPA', scope: 'DRC, Senegal, Gambia, CAR', budget: '$48,000,000' },
          { name: 'CHAI Malaria Grant', scope: 'DRC, Cameroon, Benin, Burkina Faso', budget: '$74,000,000' },
          { name: 'ENABEL', scope: 'Burundi, Niger', budget: '$11,000,000' },
          { name: 'Harvard — Science of Defeating Malaria', scope: 'USA', budget: '$750,000' },
        ],
      },
    },
    {
      role: 'Program Management / Malaria Specialist',
      org: 'USAID Benin — U.S. President\'s Malaria Initiative',
      period: 'Nov. 2015 — Nov. 2020',
      current: false,
      text: 'Leads planning, implementation, coordination and monitoring of malaria programs; supports outbreak preparedness and response; manages G2G mechanisms and partners.',
      details: {
        responsibilities: [
          'Responsible for all aspects of malaria programs: planning, organizing, implementing, coordinating, and monitoring for results',
          'Oversees activities funded through grants, contracts, and cooperative agreements',
          'Coordinates USAID response to emerging epidemics (Ebola, Lassa fever, COVID-19)',
          'Oversees implementation of activities to control 7 neglected tropical diseases',
          'Participates in developing the Malaria Operational Plan (MOP) and Project Appraisal Documents',
        ],
        projects: [
          { name: 'ARM3 (AOR)', scope: 'Benin', budget: '$21,000,000 (6 yrs)' },
          { name: 'DINDJI HIV (AOR)', scope: 'Benin', budget: '$3,200,000 (3 yrs)' },
          { name: 'Ebola (AOR)', scope: 'Benin', budget: '$600,000 (2 yrs)' },
          { name: 'IL 19, 27, 29 (GATR)', scope: 'PNLP Benin', budget: '$4,000,000 (3 yrs)' },
          { name: 'IL 25, 32-34 (GATR)', scope: 'PNLP Benin', budget: '$4,000,000 (3 yrs)' },
          { name: 'IL 24, 26, 31, 33 (GATR)', scope: 'CREC Benin', budget: '$5,000,000 (3 yrs)' },
          { name: 'AIRS (Manager)', scope: 'Abt Associates', budget: '$4,200,000/yr' },
          { name: 'CATCH (Manager)', scope: 'CRS', budget: '$3,000,000 (3 yrs)' },
          { name: 'ENVISION (Manager)', scope: 'RTI', budget: '$10,000,000 (7 yrs)' },
          { name: 'ACT END NTDs (Manager)', scope: 'FHI 360', budget: '$10,000,000 (5 yrs)' },
        ],
        achievement: 'Negotiated G2G contract with Benin NMCP, generating savings of up to $3,000,000 over 5 years for the U.S. government.',
      },
    },
    {
      role: 'International Consultant — Monitoring & Evaluation',
      org: 'MSH / SIAPS, Guinea',
      period: 'Oct. — Nov. 2015',
      current: false,
      text: 'Supports M&E activities and the review of Guinea\'s national strategic malaria control plan.',
      details: {
        responsibilities: [
          'Ensure monitoring and evaluation activities within the project',
          'Support the Guinea Ministry of Health in reviewing their national malaria strategic plan',
        ],
      },
    },
    {
      role: 'Monitoring & Evaluation Lead',
      org: 'MCDI / ARM3, Benin',
      period: 'Nov. 2012 — Sept. 2015',
      current: false,
      text: 'Heads M&E systems, surveys, data quality audits, performance-based monitoring and improvement of routine malaria information.',
      details: {
        responsibilities: [
          'Supervise field M&E Advisors and database advisor',
          'Periodic reporting of activities and progress to USAID',
          'Lead design and implementation of M&E activities for the Consortium',
          'Provide technical support in implementing the Health Information System',
          'Participate in survey design and conduct surveys',
          'Design and implement routine data quality audit processes',
          'Assure M&E of performance-based approach in all 34 health zones',
        ],
        achievement: 'Increased routine malaria information system completeness from 35% to 94% and decreased error rate from 44% to 5% across 1,114 health facilities.',
      },
    },
    {
      role: 'Maternal, Newborn, Child Health & Immunization Specialist',
      org: 'URC / PISAF, Benin',
      period: 'Nov. 2011 — Oct. 2012',
      current: false,
      text: 'Supports integrated family health activities, malaria IPTp strategy monitoring, immunization analysis and health worker training.',
      details: {
        responsibilities: [
          'Ensure monitoring of ETAT strategy (severe malaria in under-five children)',
          'Train field staff in Health Integrated Interventions including malaria',
          'Support implementation of family health program integrated activities',
          'Analyze immunization coverage and identify strategies to increase coverage',
        ],
      },
    },
    {
      role: 'Clinical Trials Monitor',
      org: 'CERHHUD / AUDOBEM-AFRO',
      period: 'Jan. 2008 — Jul. 2010',
      current: false,
      text: 'Collects and assures quality of epidemiological data from 15 hospitals; supports clinical audits and emergency obstetric care training.',
      details: {
        responsibilities: [
          'Collect and assure quality of epidemiological data from 15 hospitals in all 12 regions of Benin',
          'Monitor and evaluate implementation of clinical audits in 10 hospitals',
          'Train health professionals on clinical management of obstetric emergencies',
          'Train health professionals on use of partographs and near-miss clinical audits',
          'Periodic analysis of collected data',
        ],
      },
    },
  ],
};

export const ACHIEVEMENTS: Record<Lang, { metric: string; title: string; text: string }[]> = {
  fr: [
    { metric: '2020', title: 'PMI FSN Employee of the Year', text: 'Reconnu parmi 27 pays du U.S. President’s Malaria Initiative ; également employé local de l’année 2019 de l’Ambassade des États-Unis au Bénin et multiple lauréat de distinctions USAID / Ambassade.' },
    { metric: '35 % → 94 %', title: 'Complétude des données paludisme', text: 'Comme responsable S&E d’ARM3, hausse de la complétude du système d’information de routine et baisse du taux d’erreur national de 44 % à 5 % sur 1 114 centres de santé.' },
    { metric: '$3 000 000', title: 'Économies gouvernementales majeures', text: 'À l’USAID/PMI Bénin, négociation d’un contrat de gouvernement à gouvernement avec le Programme national de lutte contre le paludisme du Bénin, générant des économies allant jusqu’à 3 000 000 $ sur 5 ans.' },
    { metric: '8+', title: 'Distinctions et prix', text: 'Découvrez la liste complète des prix, distinctions et honneurs reçus tout au long de la carrière du Dr. Dagnon.' },
  ],
  en: [
    { metric: '2020', title: 'PMI FSN Employee of the Year', text: 'Recognized across 27 countries of the U.S. President’s Malaria Initiative; also U.S. Embassy Benin local employee of the year 2019 and multiple USAID / Embassy awardee.' },
    { metric: '35% → 94%', title: 'Malaria data completeness', text: 'As M&E lead at ARM3, raised routine information system completeness and cut the national error rate from 44% to 5% across 1,114 health facilities.' },
    { metric: '$3,000,000', title: 'Major government savings', text: 'At USAID/PMI Benin, negotiated a government-to-government contract with Benin’s National Malaria Control Program, generating savings of up to $3,000,000 over 5 years.' },
    { metric: '8+', title: 'Awards & Honors', text: 'Discover the full list of awards, honors, and distinctions received throughout Dr. Dagnon\'s career.' },
  ],
};

export interface AwardEntry {
  year: string;
  title: string;
  description: string;
  quote?: string;
  video?: string;
  videoLabel?: string;
  image?: string;
  imageAlt?: string;
}

export const AWARDS: Record<Lang, AwardEntry[]> = {
  fr: [
    { year: '2025', title: 'Prix spécial — Engagement dans l’élimination du paludisme en Afrique', description: 'L’ONG Icône 360 et ses partenaires, en collaboration avec Expertise France, ont remis au Dr. Dagnon un prix spécial en reconnaissance de son engagement et de son combat dans la lutte contre le paludisme au Bénin et à travers l’Afrique.', image: '/2025-special-award.webp', imageAlt: 'Dr. Dagnon recevant le prix spécial Icône 360 / Expertise France pour l’élimination du paludisme' },
    { year: '2022', title: 'LOVE Machine Award', description: 'Pour avoir repr\u00e9sent\u00e9 la Fondation Bill & Melinda Gates lors de la s\u00e9ance d\u2019ouverture de la conf\u00e9rence PAMCA 2022 \u00e0 Kigali, Rwanda.', quote: 'Nomm\u00e9 par Peter Berry.' },
    { year: '2020', title: 'FSN Employee of the Year', description: 'La distinction la plus prestigieuse d\u00e9cern\u00e9e par le U.S. President\u2019s Malaria Initiative \u00e0 son personnel bas\u00e9 dans 27 pays.', quote: '\u00ab Fortune Dagnon est un membre exceptionnellement talentueux de l\u2019\u00e9quipe PMI B\u00e9nin, dot\u00e9 d\u2019excellentes comp\u00e9tences en communication et coordination. Il a jou\u00e9 un r\u00f4le important dans le renforcement des capacit\u00e9s du PNLP gr\u00e2ce \u00e0 sa gestion exceptionnelle de deux accords G2G exigeants avec le PNLP et le CREC. \u00bb' },
    { year: '2020', title: 'Meritorious Honor Award', description: 'Pour professionnalisme exceptionnel, diplomatie et r\u00e9silience extraordinaire ayant assur\u00e9 la continuit\u00e9 des services essentiels de lutte contre le paludisme durant la pand\u00e9mie de COVID-19.' },
    { year: '2020', title: 'Eagle Award', description: 'Pour leadership technique et programmatique exceptionnel tout au long du processus de planification op\u00e9rationnelle du paludisme en 2019.' },
    { year: '2019', title: 'U.S. Government LES of the Year', description: 'La distinction la plus prestigieuse du U.S. Department of State pour les employés locaux, pour performance exceptionnelle dans la supervision et le leadership du programme PMI au Bénin (2016–2018). Fort de cette reconnaissance, le Dr. Dagnon a continué à étendre son impact à travers le continent africain.', video: '/2019-les-award.mp4', videoLabel: 'Voir la vidéo de la cérémonie' },
    { year: '2017', title: 'On-the-Spot Cash Award', description: 'Pour pr\u00e9paration et coordination de la soumission de 9 r\u00e9sum\u00e9s scientifiques sur le paludisme pour le PMI B\u00e9nin \u00e0 la conf\u00e9rence ASTMH.' },
    { year: '2017', title: 'Eagle Award — U.S. Embassy Cotonou', description: 'Pour l\u2019organisation de la visite du directeur adjoint du PMI, Bernard Nahlen.' },
    { year: '2007', title: 'Laur\u00e9at du concours de pr\u00e9sentations scientifiques', description: 'Universit\u00e9 de Conakry — Th\u00e8me : d\u00e9terminants de l\u2019ob\u00e9sit\u00e9.' },
  ],
  en: [
    { year: '2025', title: 'Special Award — Commitment to Malaria Elimination in Africa', description: 'Icône 360 NGO and its partners, in collaboration with Expertise France, presented Dr. Dagnon with a special award in recognition of his commitment and work in the fight against malaria in Benin and across Africa.', image: '/2025-special-award.webp', imageAlt: 'Dr. Dagnon receiving the Icône 360 / Expertise France special award for malaria elimination' },
    { year: '2022', title: 'LOVE Machine Award', description: 'For representing the Bill & Melinda Gates Foundation at the opening session of the 2022 PAMCA Conference in Kigali, Rwanda.', quote: 'Nominated by Peter Berry.' },
    { year: '2020', title: 'FSN Employee of the Year', description: 'The most prestigious distinction given by the U.S. President\u2019s Malaria Initiative for its staff based in 27 countries worldwide.', quote: '\u201cFortune Dagnon is an exceptionally talented member of the PMI Benin Team with excellent communication and coordination skills. He has played an important role in building the capacity of the NMCP through his exceptional management of two highly demanding G2G agreements with the NMCP and the Cotonou Entomology Research Centre (CREC).\u201d' },
    { year: '2020', title: 'Meritorious Honor Award', description: 'For exceptional professionalism, diplomacy, and extraordinary resilience and dedication to service that resulted in the continuity of essential malaria services during extremely difficult conditions of the COVID-19 pandemic.' },
    { year: '2020', title: 'Eagle Award', description: 'For outstanding technical and programmatic leadership throughout the malaria Operational Planning process in 2019.' },
    { year: '2019', title: 'U.S. Government LES of the Year', description: 'The most prestigious distinction given by the U.S. Department of State to Foreign Service Nationals working in the U.S. administration, for outstanding sustained performance in overseeing, expanding, and leading the PMI program in Benin (2016–2018). Building on this recognition, Dr. Dagnon has continued to extend his impact across the African continent.', video: '/2019-les-award.mp4', videoLabel: 'Watch the ceremony video' },
    { year: '2017', title: 'On-the-Spot Cash Award', description: 'For preparing and coordinating the submission of 9 scientific abstracts on malaria for PMI Benin for the ASTMH conference.' },
    { year: '2017', title: 'Eagle Award — U.S. Embassy Cotonou', description: 'For organizing the visit of PMI Deputy Director Bernard Nahlen.' },
    { year: '2007', title: 'Laureate of Annual Scientific Presentation Competition', description: 'University of Conakry — Topic: determinants of obesity.' },
  ],
};

export const PORTFOLIO: Record<Lang, string[]> = {
  fr: ['Campagnes MILDA digitalisées', 'Plateformes de campagnes intégrées', 'Surveillance du paludisme', 'Recherche CPS', 'Sites sentinelles — RDC', 'PATH MACEPA', 'Subventions CHAI paludisme', 'Assistance technique AMP', 'Renforcement des systèmes de santé'],
  en: ['Digitalized LLIN campaigns', 'Integrated campaign platforms', 'Malaria surveillance', 'SMC research', 'Sentinel sites — DRC', 'PATH MACEPA', 'CHAI malaria grants', 'AMP technical assistance', 'Health systems strengthening'],
};

export const EDUCATION: Record<Lang, { degree: string; school: string; detail: string; tag: string }[]> = {
  fr: [
    { degree: 'Ph.D. en économie de la santé (en cours)', school: 'Université de Groningen, Pays-Bas', detail: 'Thèse : coût-efficacité de la pulvérisation intradomiciliaire d\u2019insecticide (IRS) au nord du Bénin.', tag: 'Doctorat' },
    { degree: 'Master of Public Health (MPH)', school: 'Institut de Médecine Tropicale, Anvers, Belgique', detail: 'Santé publique en milieu tropical.', tag: 'Master' },
    { degree: 'Doctorat en médecine générale (MD)', school: 'Université de Conakry, Guinée', detail: 'Formation médicale doctorale.', tag: 'Doctorat' },
    { degree: 'Enseignement', school: 'IRSP Ouidah, USAID, zones de santé…', detail: 'Cliquez pour voir la liste complète des formations et enseignements.', tag: 'Enseignement' },
    { degree: 'Éducation et autres formations', school: 'Harvard, USAID, Johns Hopkins, NIH…', detail: 'Cliquez pour voir la liste complète des formations et certificats.', tag: 'Formations' },
  ],
  en: [
    { degree: 'Ph.D. in Health Economics (in progress)', school: 'University of Groningen, Netherlands', detail: 'Thesis: cost-effectiveness of indoor residual spraying (IRS) in northern Benin.', tag: 'Ph.D.' },
    { degree: 'Master of Public Health (MPH)', school: 'Institute of Tropical Medicine, Antwerp, Belgium', detail: 'Public health in tropical settings.', tag: 'Master' },
    { degree: 'Doctor of Medicine (MD)', school: 'University of Conakry, Guinea', detail: 'Doctoral medical training.', tag: 'Ph.D.' },
    { degree: 'Teaching Experience', school: 'IRSP Ouidah, USAID, health zones…', detail: 'Click to see the full list of teaching and training activities.', tag: 'Teaching' },
    { degree: 'Education and other training', school: 'Harvard, USAID, Johns Hopkins, NIH…', detail: 'Click to see the full list of trainings and certificates.', tag: 'Training' },
  ],
};

export const TEACHING_LIST: Record<Lang, { date: string; institution: string; detail: string }[]> = {
  fr: [
    { date: '2024', institution: 'Institut Régional de Santé Publique, Ouidah, Bénin', detail: 'Chargé de cours pour la formation nationale en malariologie à l\u2019intention des gestionnaires de programmes.' },
    { date: '2020', institution: 'IRSP / Programme national', detail: 'Formation de jeunes logisticiens sur le Système d\u2019Information sur le Paludisme de Routine.' },
    { date: '2014', institution: 'Bénin', detail: 'Formation de 44 statisticiens hospitaliers sur l\u2019utilisation du logiciel LOGISNIGS.' },
    { date: '2013', institution: 'Bénin', detail: 'Formation de 34 statisticiens des zones de santé sur le logiciel LOGISNIGS.' },
    { date: '2013', institution: 'Bénin', detail: 'Formation des agents de santé à la prise en charge du paludisme (diagnostic et traitement).' },
    { date: '2011\u20132012', institution: 'Région Zou-Collines, Bénin', detail: 'Formation des agents de santé aux stratégies intégrées de santé familiale : planification familiale, VIH/SIDA et paludisme.' },
    { date: '2008\u20132010', institution: 'Bénin', detail: 'Formation des agents de santé à la mise en œuvre de l\u2019audit clinique.' },
  ],
  en: [
    { date: '2024', institution: 'Institut Régional de Santé Publique, Ouidah, Benin', detail: 'Lecturer for the National Malariology training for program managers.' },
    { date: '2020', institution: 'IRSP / National program', detail: 'Training of young logisticians on the Routine Malaria Information System.' },
    { date: '2014', institution: 'Benin', detail: 'Training of 44 hospital statisticians on the use of the LOGISNIGS software.' },
    { date: '2013', institution: 'Benin', detail: 'Training of 34 health zones statisticians on LOGISNIGS software.' },
    { date: '2013', institution: 'Benin', detail: 'Training of health workers in malaria management (diagnosis and treatment).' },
    { date: '2011\u20132012', institution: 'Zou-Collines region, Benin', detail: 'Training of health workers on integrated family health strategies: family planning, HIV/AIDS, and malaria.' },
    { date: '2008\u20132010', institution: 'Benin', detail: 'Training of health workers on the implementation of clinical audit.' },
  ],
};

export const TRAINING_LIST: Record<Lang, { date: string; institution: string; detail: string }[]> = {
  fr: [
    { date: 'Juin 2023', institution: 'Harvard T.H. Chan School of Public Health', detail: 'Certificat en Science of Defeating Malaria, cours de leadership.' },
    { date: 'Octobre 2018 \u2013 maintenant', institution: 'Université de Groningen, Pays-Bas', detail: 'Ph.D. en économie de la santé (en cours), doctorant externe inscrit en programme à distance. Thèse : coût-efficacité de la pulvérisation intradomiciliaire dans la réduction du fardeau du paludisme au nord du Bénin.' },
    { date: 'Octobre 2020', institution: 'Centre Beninois de Langues Étrangères (CE.BE.LA.E. \u2013 UAC)', detail: 'Certificat de connaissance en anglais niveau B2 du CECR (TEFL B2).' },
    { date: 'Mars à mai 2020', institution: 'Harvard T.H. Chan School of Public Health', detail: 'Defeating Malaria from the Gene to the Globe.' },
    { date: 'Août 2019', institution: 'USAID University, Bangkok, Thaïlande', detail: 'Formation AOR/COR (Agreement/Contracting Officer Representative) renforcée.' },
    { date: 'Novembre 2017', institution: 'USAID University, Washington, D.C.', detail: 'Conception et gestion de projets.' },
    { date: 'Mai 2017', institution: 'USAID University, Harare, Zimbabwe', detail: 'Conformité environnementale, conception et gestion de projets, et gestion de l\u2019exécution des projets.' },
    { date: 'Novembre 2016', institution: 'USAID University, Washington, D.C., USA', detail: 'Global Acquisition and Assistance System (GLAAS).' },
    { date: 'Septembre 2016', institution: 'USAID University, Washington, D.C., USA', detail: 'Formation AOR/COR (Agreement/Contracting Officer Representative).' },
    { date: 'Août 2016', institution: 'USAID University, Accra, Ghana', detail: 'Rédaction avancée en anglais.' },
    { date: 'Janvier 2016', institution: 'USAID University, Accra, Ghana', detail: 'Programmation de l\u2019aide étrangère avec le gouvernement des États-Unis.' },
    { date: 'Décembre 2015', institution: 'USAID University', detail: 'Genre 101 : Égalité des genres à USAID.' },
    { date: 'Octobre 2012', institution: 'USAID et Johns Hopkins Bloomberg School of Public Health', detail: 'Certificat \u00ab Utilisation des données pour les gestionnaires de programmes \u00bb et \u00ab Fondamentaux de l\u2019évaluation \u00bb.' },
    { date: 'Juillet 2011', institution: 'Institut de Médecine Tropicale Prince Léopold, Anvers, Belgique', detail: 'Master en santé publique (option santé reproductive).' },
    { date: 'Mars 2011', institution: 'Clinical Centre, National Institutes of Health (NIH, USA)', detail: 'Introduction aux principes et pratiques de la recherche clinique.' },
    { date: 'Mars 2011', institution: 'Communauté flamande, Département de l\u2019Éducation, Belgique', detail: 'Certificat de niveau d\u2019anglais 2.' },
    { date: 'Septembre 2009', institution: 'IRSS Burkina Faso', detail: 'Méthodologie de la recherche en VIH et santé reproductive.' },
    { date: 'Avril 2009', institution: 'Centre Muraz, Burkina-Faso / London School of Hygiene and Tropical Medicine', detail: 'Cours Stata 9.' },
    { date: 'Décembre 2009', institution: 'Centre Beninois de Langues Étrangères (CEBELAE)', detail: 'Certificat de compétence en anglais niveau 2.' },
    { date: '2001\u20132007', institution: 'Université de Conakry, Guinée', detail: 'Doctorat en médecine générale.' },
  ],
  en: [
    { date: 'June 2023', institution: 'Harvard T.H. Chan School of Public Health', detail: 'Certificate in Science of Defeating Malaria, a leadership course.' },
    { date: 'From October 2018 to now', institution: 'University of Groningen, Netherlands', detail: 'Ph.D. in health economics (underway), external student enrolled in a distance program. Thesis: Cost-effectiveness of Indoor Residual Spraying in reducing the malaria burden in Northern Benin, West Africa.' },
    { date: 'October 2020', institution: 'University of Abomey-Calavi, Beninese Centre of Foreign Languages (CE.BE.LA.E. \u2013 UAC)', detail: 'Certificate of Knowledge in English Language level B2 of CECR (TEFL B2).' },
    { date: 'March to May 2020', institution: 'Harvard T.H. Chan School of Public Health', detail: 'Defeating Malaria from the Gene to the Globe.' },
    { date: 'August 2019', institution: 'USAID University, Bangkok, Thailand', detail: 'Enhanced Agreement/Contracting Officer Representative (AOR/COR) training.' },
    { date: 'November 2017', institution: 'USAID University, Washington, D.C.', detail: 'Project Design and Management.' },
    { date: 'May 2017', institution: 'USAID University, Harare, Zimbabwe', detail: 'Environmental Compliance, Sound Design in the Project, and Management in Project Implementation.' },
    { date: 'November 2016', institution: 'USAID University, Washington, D.C., USA', detail: 'Global Acquisition and Assistance System (GLAAS) training.' },
    { date: 'September 2016', institution: 'USAID University, Washington, D.C., USA', detail: 'Agreement/Contracting Officer Representative (AOR/COR) training.' },
    { date: 'August 2016', institution: 'USAID University, Accra, Ghana', detail: 'Advanced English Writing Proficiency.' },
    { date: 'January 2016', institution: 'USAID University, Accra, Ghana', detail: 'Programming Foreign Assistance with the US Government.' },
    { date: 'December 2015', institution: 'USAID University', detail: 'Gender 101: Gender Equality at USAID.' },
    { date: 'October 2012', institution: 'USAID and Johns Hopkins Bloomberg School of Public Health', detail: 'Certificate of course completion \u201cData Use for Program Manager\u201d and \u201cMonitoring and Evaluation Fundamentals\u201d.' },
    { date: 'July 2011', institution: 'Prince Leopold Institute of Tropical Medicine \u2013 Antwerp, Belgium', detail: 'Master\u2019s in Public Health (Option Reproductive Health).' },
    { date: 'March 2011', institution: 'Clinical Centre, National Institutes of Health (NIH, USA)', detail: 'Introduction to Principles and Practice of Clinical Research.' },
    { date: 'March 2011', institution: 'Flemish Community, Department of Education, Belgium', detail: 'Certificate of English Level 2.' },
    { date: 'September 2009', institution: 'IRSS Burkina Faso', detail: 'Methodology of Research in HIV and Reproductive Health.' },
    { date: 'April 2009', institution: 'Centre Muraz, Burkina-Faso / London School of Hygiene and Tropical Medicine', detail: 'Stata 9 course.' },
    { date: 'December 2009', institution: 'Centre Beninois de Langues Étrangères (CEBELAE)', detail: 'Certificate of English Language Skill Level 2.' },
    { date: '2001\u20132007', institution: 'University of Conakry, Guinea', detail: 'Doctorate in General Medicine.' },
  ],
};

export const MEDIA: Record<Lang, { kind: string; title: string; event: string; url: string; thumb?: string }[]> = {
  fr: [
    { kind: 'video', title: 'Discours d’ouverture — 8e conférence PAMCA', event: 'PAMCA 2022 · Kigali', url: 'https://www.youtube.com/watch?v=ZTW9HqJ57kA', thumb: 'https://img.youtube.com/vi/ZTW9HqJ57kA/hqdefault.jpg' },
    { kind: 'video', title: 'Discours — Lancement campagne Stop Paludisme au Cameroun', event: 'Cameroun 2022', url: 'https://www.youtube.com/watch?v=dxBGiEW41aM', thumb: 'https://img.youtube.com/vi/dxBGiEW41aM/hqdefault.jpg' },
    { kind: 'video', title: 'Présentation — American Society of Tropical Medicine & Hygiene', event: 'ASTMH 2022', url: 'https://www.youtube.com/watch?v=skmrswZhGZE', thumb: 'https://img.youtube.com/vi/skmrswZhGZE/hqdefault.jpg' },
    { kind: 'deck', title: 'Funding landscape — Fondation Gates', event: 'AMP / SMC 2026 · Présentation (PDF)', url: 'https://allianceformalariaprevention.com/wp-content/uploads/2026/02/04-d_Funding-Landscape_Gates-Foundation_Seynude-Dagnon_ENG.pdf' },
  ],
  en: [
    { kind: 'video', title: 'Opening keynote — 8th PAMCA conference', event: 'PAMCA 2022 · Kigali', url: 'https://www.youtube.com/watch?v=ZTW9HqJ57kA', thumb: 'https://img.youtube.com/vi/ZTW9HqJ57kA/hqdefault.jpg' },
    { kind: 'video', title: 'Talk — Launch of the Stop Malaria campaign in Cameroon', event: 'Cameroon 2022', url: 'https://www.youtube.com/watch?v=dxBGiEW41aM', thumb: 'https://img.youtube.com/vi/dxBGiEW41aM/hqdefault.jpg' },
    { kind: 'video', title: 'Talk — American Society of Tropical Medicine & Hygiene', event: 'ASTMH 2022', url: 'https://www.youtube.com/watch?v=skmrswZhGZE', thumb: 'https://img.youtube.com/vi/skmrswZhGZE/hqdefault.jpg' },
    { kind: 'deck', title: 'Funding landscape — Gates Foundation', event: 'AMP / SMC 2026 · Deck (PDF)', url: 'https://allianceformalariaprevention.com/wp-content/uploads/2026/02/04-d_Funding-Landscape_Gates-Foundation_Seynude-Dagnon_ENG.pdf' },
  ],
};

export const PUBLICATIONS: Record<Lang, { title: string; authors: string; journal: string; year: number; url?: string; featured?: boolean }[]> = {
  fr: [
    { title: 'Funding landscape — Fondation Bill & Melinda Gates', authors: 'Seynudé Jean-Fortuné Dagnon', journal: 'Présentation · AMP / SMC 2026', year: 2026, url: 'https://allianceformalariaprevention.com/wp-content/uploads/2026/02/04-d_Funding-Landscape_Gates-Foundation_Seynude-Dagnon_ENG.pdf', featured: true },
    { title: 'Du contrôle du paludisme à son élimination : le virage que nous devons prendre', authors: 'Rose Leke, Seynudé Jean Fortune Dagnon', journal: 'Africa Health Watch — Perspectives', year: 2026, url: 'https://www.africahealthwatch.com/p/from-malaria-control-to-elimination?utm_source=publication-search' },
    { title: 'Barrières à l’adoption et à la mise en œuvre de la chimioprévention du paludisme chez les enfants d’âge scolaire : rapport d’une réunion d’engagement des parties prenantes', authors: 'Morlino C., Byrne I., Achan J., … Dagnon S.J.F., … Cohee L.M.', journal: 'Frontiers in Tropical Diseases', year: 2025, url: 'https://doi.org/10.3389/fitd.2025.1480907' },
    { title: 'Faible prévalence d’allèles de dihydropteroate synthase hautement résistants à la sulfadoxine au Bénin', authors: 'Souza Svigel S., Adeothy A., Kpemasse A., … Dagnon F., … Lucchi N.W.', journal: 'Malaria Journal', year: 2021, url: 'https://doi.org/10.1186/s12936-021-03605-5' },
    { title: 'Durabilité et bio-efficacité de trois moustiquaires imprégnées de longue durée dans trois communautés après la campagne de distribution de masse 2017 au Bénin', authors: 'Ahogni I.B., Salako A.S., Dagnon J.F., … Akogbeto M.C.', journal: 'Journal of Biology and Life Science', year: 2020, url: 'https://doi.org/10.5296/jbls.v11i2.17645' },
    { title: 'Barrière chimique et survie : étude comparative de deux marques de moustiquaires polyester et d’une marque de moustiquaires polyéthylène dans différentes conditions au Bénin', authors: 'Ahogni I.B., Aïkpon R.Y., Dagnon J.F., … Akogbéto M.C.', journal: 'International Journal of Mosquito Research', year: 2020 },
    { title: 'Risques paludiques liés aux mauvaises pratiques d’utilisation des outils de lutte contre les piqûres en saison froide et chaude', authors: 'Sominahouin A., Dagnon F., Padonou G.G., Akogbéto M.C.', journal: 'Preprint — Research Square', year: 2020, url: 'https://doi.org/10.21203/rs.3.rs-38144/v1' },
    { title: 'Influence des facteurs climatiques sur l’agressivité et l’infectiosité d’Anopheles dans les districts de pulvérisation intradomiciliaire au nord du Bénin, Afrique de l’Ouest', authors: 'Sominahouin A., Padonou G.G., Landéhou R., … Dagnon F., … Akogbéto M.', journal: 'American Journal of Laboratory Medicine', year: 2020, url: 'https://doi.org/10.11648/j.ajlm.20200501.11' },
    { title: 'Leçons apprises, défis et perspectives pour la prise de décision après une décennie de suivi de l’impact de la pulvérisation intradomiciliaire au Bénin, Afrique de l’Ouest', authors: 'Akogbéto M.C., Dagnon F., Aïkpon R., … Padonou G.G.', journal: 'Malaria Journal', year: 2020, url: 'https://malariajournal.biomedcentral.com/articles/10.1186/s12936-020-3112-9' },
    { title: 'Augmentation de la transmission du paludisme après le retrait de la pulvérisation intradomiciliaire dans la région de l’Atacora au Bénin, Afrique de l’Ouest', authors: 'Aïkpon R.Y., Padonou G., Dagnon F., … Akogbéto M.', journal: 'Malaria Journal', year: 2020, url: 'https://doi.org/10.1186/s12936-019-3086-2' },
    { title: 'Durabilité de terrain des moustiquaires Yorkool® au Bénin', authors: 'Ahogni B., Aïkpon R.Y., Ossè R.A., Dagnon J.F., … Akogbéto M.C.', journal: 'Advances in Entomology', year: 2020, url: 'https://www.scirp.org/journal/ae' },
    { title: 'Efficacité de la pulvérisation intradomiciliaire à base d’Actellic 300 CS sur les indicateurs entomologiques clés de transmission au Alibori et Donga, deux régions du nord du Bénin', authors: 'Salako A.S., Dagnon F., Sovi A., … Akogbéto M.C.', journal: 'Parasites & Vectors', year: 2019, url: 'https://doi.org/10.1186/s13071-019-3865-1' },
    { title: 'Dynamique des populations d’Anopheles gambiae s.l. et de Culex quinquefasciatus en milieu rural et urbain avant une campagne de pulvérisation intradomiciliaire dans le nord du Bénin', authors: 'Salako A.S., Ossè R., Padonou G.G., Dagnon F., … Akogbéto M.C.', journal: 'Vector-Borne and Zoonotic Diseases', year: 2019, url: 'https://doi.org/10.1089/vbz.2018.2409' },
    { title: 'L’influence des facteurs climatiques sur l’agressivité et l’infectiosité d’Anopheles dans les districts de pulvérisation intradomiciliaire au nord du Bénin, Afrique de l’Ouest', authors: 'Sominahouin A., Padonou G.G., Landéhou R., … Dagnon F., … Akogbéto M.C.', journal: 'Preprint — Research Square', year: 2019, url: 'https://doi.org/10.21203/rs.2.14494/v1' },
    { title: 'Statut de résistance aux insecticides, fréquence des mutations L1014F Kdr et G119S Ace-1, et expression des enzymes de détoxication chez Anopheles gambiae (s.l.) dans deux régions du nord du Bénin en vue de la pulvérisation intradomiciliaire', authors: 'Salako A.S., Ahogni I., Aïkpon R., … Dagnon F., … Akogbéto M.C.', journal: 'Parasites & Vectors', year: 2018, url: 'https://doi.org/10.1186/s13071-018-3180-2' },
    { title: 'Comparaison du comportement alimentaire et contribution d’Anopheles coluzzii et Anopheles gambiae, deux espèces jumelles en sympatrie, à la transmission du paludisme à Alibori et Donga, nord du Bénin, Afrique de l’Ouest', authors: 'Akogbéto M.C., Salako A.S., Dagnon F., … Sezonlin M.', journal: 'Malaria Journal', year: 2018, url: 'https://doi.org/10.1186/s12936-018-2452-9' },
    { title: 'Évaluation de la transmission résiduelle du paludisme : quantification du risque relatif des différents moments nocturnes et lieux dans la région de l’Atacora au Bénin, Afrique de l’Ouest', authors: 'Aïkpon R., Ossè R., Ahogni I., Dagnon F., Lyikirenga L., Akogbéto M.', journal: 'Journal of Entomology and Zoology Studies', year: 2018 },
    { title: 'Données entomologiques de référence sur la transmission du paludisme en prélude à une intervention de pulvérisation intradomiciliaire dans les régions de Alibori et Donga, nord du Bénin, Afrique de l’Ouest', authors: 'Salako A.S., Ahogni I., Kpanou C., … Dagnon F., … Akogbéto M.C.', journal: 'Malaria Journal', year: 2018, url: 'https://doi.org/10.1186/s12936-018-2507-y' },
  ],
  en: [
    { title: 'Funding landscape — Bill & Melinda Gates Foundation', authors: 'Seynudé Jean-Fortuné Dagnon', journal: 'Presentation · AMP / SMC 2026', year: 2026, url: 'https://allianceformalariaprevention.com/wp-content/uploads/2026/02/04-d_Funding-Landscape_Gates-Foundation_Seynude-Dagnon_ENG.pdf', featured: true },
    { title: 'From Malaria Control to Elimination: The Turn We Need to Make', authors: 'Rose Leke, Seynudé Jean Fortune Dagnon', journal: 'Africa Health Watch — Perspectives', year: 2026, url: 'https://www.africahealthwatch.com/p/from-malaria-control-to-elimination?utm_source=publication-search' },
    { title: 'Barriers to uptake and implementation of malaria chemoprevention in school-aged children: a stakeholder engagement meeting report', authors: 'Morlino C., Byrne I., Achan J., … Dagnon S.J.F., … Cohee L.M.', journal: 'Frontiers in Tropical Diseases', year: 2025, url: 'https://doi.org/10.3389/fitd.2025.1480907' },
    { title: 'Low prevalence of highly sulfadoxine-resistant dihydropteroate synthase alleles in Plasmodium falciparum isolates in Benin', authors: 'Souza Svigel S., Adeothy A., Kpemasse A., … Dagnon F., … Lucchi N.W.', journal: 'Malaria Journal', year: 2021, url: 'https://doi.org/10.1186/s12936-021-03605-5' },
    { title: 'Assessment of the Durability and Bio-effectiveness of Three Long-Lasting Insecticidal Nets in Three Different Communities After the 2017 Mass Net Distribution Campaign in Benin', authors: 'Ahogni I.B., Salako A.S., Dagnon J.F., … Akogbeto M.C.', journal: 'Journal of Biology and Life Science', year: 2020, url: 'https://doi.org/10.5296/jbls.v11i2.17645' },
    { title: 'Chemical barrier and survivorship: Comparative study of two brands of polyester nets and one brand of polyethylene nets in different conditions used in Benin', authors: 'Ahogni I.B., Aïkpon R.Y., Dagnon J.F., … Akogbéto M.C.', journal: 'International Journal of Mosquito Research', year: 2020 },
    { title: 'Malaria Risks Related to Poor Practices in The Use of Mosquito Bite Control Tools During the Cold And Hot Seasons', authors: 'Sominahouin A., Dagnon F., Padonou G.G., Akogbéto M.C.', journal: 'Preprint — Research Square', year: 2020, url: 'https://doi.org/10.21203/rs.3.rs-38144/v1' },
    { title: 'Influence of Climatic Factors on Aggression and Infectivity of Anopheles in the Districts the Indoor Residual Spray (IRS) in Northern Benin, West Africa', authors: 'Sominahouin A., Padonou G.G., Landéhou R., … Dagnon F., … Akogbéto M.', journal: 'American Journal of Laboratory Medicine', year: 2020, url: 'https://doi.org/10.11648/j.ajlm.20200501.11' },
    { title: 'Lessons learned, challenges, and outlooks for decision-making after a decade of experience monitoring the impact of indoor residual spraying in Benin, West Africa', authors: 'Akogbéto M.C., Dagnon F., Aïkpon R., … Padonou G.G.', journal: 'Malaria Journal', year: 2020, url: 'https://malariajournal.biomedcentral.com/articles/10.1186/s12936-020-3112-9' },
    { title: 'There has been an increase in malaria transmission after indoor residual spraying withdrawal in the Atacora region in Benin, West Africa', authors: 'Aïkpon R.Y., Padonou G., Dagnon F., … Akogbéto M.', journal: 'Malaria Journal', year: 2020, url: 'https://doi.org/10.1186/s12936-019-3086-2' },
    { title: 'Field Durability of Yorkool® LN Nets in the Benin Republic', authors: 'Ahogni B., Aïkpon R.Y., Ossè R.A., Dagnon J.F., … Akogbéto M.C.', journal: 'Advances in Entomology', year: 2020, url: 'https://www.scirp.org/journal/ae' },
    { title: 'Efficacy of Actellic 300 CS-based indoor residual spraying on key entomological indicators of malaria transmission in Alibori and Donga, two regions of northern Benin', authors: 'Salako A.S., Dagnon F., Sovi A., … Akogbéto M.C.', journal: 'Parasites & Vectors', year: 2019, url: 'https://doi.org/10.1186/s13071-019-3865-1' },
    { title: 'Population Dynamics of Anopheles gambiae s.l. and Culex quinquefasciatus in Rural and Urban Settings Before an Indoor Residual Spraying Campaign in Northern Benin', authors: 'Salako A.S., Ossè R., Padonou G.G., Dagnon F., … Akogbéto M.C.', journal: 'Vector-Borne and Zoonotic Diseases', year: 2019, url: 'https://doi.org/10.1089/vbz.2018.2409' },
    { title: 'The Influence of climatic factors on the aggression and infectivity of Anopheles in the districts with Indoor Residual Spray (IRS) in Northern Benin, West Africa', authors: 'Sominahouin A., Padonou G.G., Landéhou R., … Dagnon F., … Akogbéto M.C.', journal: 'Preprint — Research Square', year: 2019, url: 'https://doi.org/10.21203/rs.2.14494/v1' },
    { title: 'Insecticide resistance status, frequency of L1014F Kdr and G119S Ace-1 mutations, and expression of detoxification enzymes in Anopheles gambiae (s.l.) in two regions of northern Benin in preparation for indoor residual spraying', authors: 'Salako A.S., Ahogni I., Aïkpon R., … Dagnon F., … Akogbéto M.C.', journal: 'Parasites & Vectors', year: 2018, url: 'https://doi.org/10.1186/s13071-018-3180-2' },
    { title: 'Blood feeding behavior comparison and contribution of Anopheles coluzzii and Anopheles gambiae, two sibling species living in sympatry, to malaria transmission in Alibori and Donga region, northern Benin, West Africa', authors: 'Akogbéto M.C., Salako A.S., Dagnon F., … Sezonlin M.', journal: 'Malaria Journal', year: 2018, url: 'https://doi.org/10.1186/s12936-018-2452-9' },
    { title: 'Residual malaria transmission assessment: quantification of the relative risk of the different nighttimes and locations in the Atacora region in Benin, West Africa', authors: 'Aïkpon R., Ossè R., Ahogni I., Dagnon F., Lyikirenga L., Akogbéto M.', journal: 'Journal of Entomology and Zoology Studies', year: 2018 },
    { title: 'Baseline entomologic data on malaria transmission in prelude to an indoor residual spraying intervention in the regions of Alibori and Donga, Northern Benin, West Africa', authors: 'Salako A.S., Ahogni I., Kpanou C., … Dagnon F., … Akogbéto M.C.', journal: 'Malaria Journal', year: 2018, url: 'https://doi.org/10.1186/s12936-018-2507-y' },
  ],
};

export function publicationsCount(lang: Lang, n: number): string {
  if (lang === 'fr') {
    return `${n} publication${n > 1 ? 's' : ''} affichée${n > 1 ? 's' : ''}`;
  }
  return `${n} publication${n !== 1 ? 's' : ''} shown`;
}
