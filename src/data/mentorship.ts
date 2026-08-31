export interface MentorshipTrack {
  id: string;
  title: { fr: string; en: string };
  subtitle: { fr: string; en: string };
  iconName: string;
  description: { fr: string; en: string };
  recommendedDegrees: { fr: string[]; en: string[] };
  coreCompetencies: { fr: string[]; en: string[] };
  pitfallsToAvoid: { fr: string[]; en: string[] };
  milestones: {
    stage: string;
    label: { fr: string; en: string };
    advice: { fr: string; en: string };
  }[];
  dagnonGoldenRule: { fr: string; en: string };
}

export const MENTORSHIP_TRACKS: MentorshipTrack[] = [
  {
    id: 'academic-health-economics',
    title: {
      fr: '1. Recherche Académique & Économie de la Santé (PhD)',
      en: '1. Academic Research & Health Economics (PhD)',
    },
    subtitle: {
      fr: 'De la pratique clinique à la modélisation micro-économique internationale',
      en: 'From clinical medical practice to international micro-economic modeling',
    },
    iconName: 'GraduationCap',
    description: {
      fr: 'Pour les médecins et statisticiens souhaitant produire les données probantes et les modèles mathématiques qui guident les allocations financières mondiales.',
      en: 'For medical doctors and biostatisticians aiming to generate the evidence and mathematical models that drive global funding allocations.',
    },
    recommendedDegrees: {
      fr: ['Doctorat d’État en Médecine (MD)', 'Master en Santé Publique (MPH - Épidémiologie)', 'Doctorat de Recherche (Ph.D. en Économie de la Santé / Épidémiologie)'],
      en: ['Medical Doctor Degree (MD)', 'Master of Public Health (MPH - Epidemiology)', 'Doctor of Philosophy (Ph.D. in Health Economics / Epidemiology)'],
    },
    coreCompetencies: {
      fr: [
        'Modélisation micro-économique (R, Stata, TreeAge)',
        'Rédaction d’articles scientifiques pour revues à comité de lecture (Lancet, Malaria Journal)',
        'Analyse coût-efficacité et calcul des DALYs / AVCI évitées',
      ],
      en: [
        'Micro-economic modeling software (R, Stata, TreeAge)',
        'Scientific paper drafting for peer-reviewed journals (The Lancet, Malaria Journal)',
        'Cost-effectiveness analysis and DALYs / QALYs modeling',
      ],
    },
    pitfallsToAvoid: {
      fr: [
        'Rester dans une recherche purement théorique déconnectée des réalités des centres de santé ruraux.',
        'Négliger la visibilité internationale de vos publications (ORCID, Google Scholar, ResearchGate).',
      ],
      en: [
        'Remaining trapped in purely theoretical research detached from rural frontline clinic realities.',
        'Neglecting international digital scholarly indexing (ORCID, Google Scholar, ResearchGate).',
      ],
    },
    milestones: [
      {
        stage: 'Années 1 – 3',
        label: { fr: 'Pratique clinique & 1er Master', en: 'Clinical practice & 1st Master' },
        advice: {
          fr: 'Ancrez votre pratique sur le terrain hospitalier ou de district pour comprendre les goulots d’étranglement réels.',
          en: 'Anchor your practice in district or hospital wards to master real frontline constraints.',
        },
      },
      {
        stage: 'Années 4 – 7',
        label: { fr: 'Co-auteurs de publications & Thèse', en: 'Co-authorships & Doctoral Thesis' },
        advice: {
          fr: 'Publiez au moins 3 articles scientifiques en premier auteur et rejoignez des consortiums de recherche (ASTMH, PAMCA).',
          en: 'Publish at least 3 lead-author papers and actively join scientific consortiums (ASTMH, PAMCA).',
        },
      },
      {
        stage: 'Années 8+',
        label: { fr: 'PI & Conseiller Scientifique International', en: 'PI & International Scientific Advisor' },
        advice: {
          fr: 'Pilotez des comités consultatifs pour l’OMS et traduisez vos modèles en politiques publiques nationales.',
          en: 'Lead WHO advisory committees and translate complex economic models into national policies.',
        },
      },
    ],
    dagnonGoldenRule: {
      fr: 'Une publication n’a de valeur que si elle influence directement une ligne budgétaire ou un protocole de soin pour sauver des vies.',
      en: 'A scientific paper only holds true value if it directly impacts a national health budget line or clinical protocol to save lives.',
    },
  },
  {
    id: 'bilateral-program-management',
    title: {
      fr: '2. Gestion de Grands Programmes Bilatéraux (USAID / PMI / CDC)',
      en: '2. Bilateral Program Leadership (USAID / PMI / CDC)',
    },
    subtitle: {
      fr: 'Leadership d’équipes multidisciplinaires et gestion de dizaines de millions de dollars',
      en: 'Multidisciplinary team leadership and multi-million dollar program governance',
    },
    iconName: 'Building2',
    description: {
      fr: 'Pour les professionnels voulant orchestrer des campagnes nationales de masse, la logistique pharmaceutique et les réformes institutionnelles d’envergure.',
      en: 'For professionals aspiring to orchestrate nationwide mass campaigns, pharmaceutical supply chains, and sweeping institutional reforms.',
    },
    recommendedDegrees: {
      fr: ['MD ou Ingénieur Biomédical / M&E', 'MPH en Gestion des Systèmes de Santé', 'Certifications PMP / Prince2 / Audit PFM'],
      en: ['MD or Biomedical / M&E Engineer', 'MPH in Health Systems Management', 'PMP / Prince2 / PFM Audit Certifications'],
    },
    coreCompetencies: {
      fr: [
        'Négociation de contrats directs d’État à État (G2G)',
        'Gestion budgétaire rigoureuse et conformité aux audits USG / Fonds Mondial',
        'Diplomatie institutionnelle avec les cabinets ministériels et partenaires',
      ],
      en: [
        'Government-to-Government (G2G) bilateral contract negotiation',
        'Strict fiduciary grant management and USG / Global Fund audit compliance',
        'Institutional diplomacy with ministerial cabinets and executing partners',
      ],
    },
    pitfallsToAvoid: {
      fr: [
        'Créer des structures parallèles au lieu de renforcer les cadres du Ministère de la Santé.',
        'Sous-estimer les risques de rupture logistique des médicaments et intrants.',
      ],
      en: [
        'Creating duplicate parallel structures instead of building ministerial capacity.',
        'Underestimating supply chain risks and stockout vulnerability.',
      ],
    },
    milestones: [
      {
        stage: 'Années 1 – 3',
        label: { fr: 'Spécialiste Technique / M&E', en: 'Technical / M&E Specialist' },
        advice: {
          fr: 'Maîtrisez la collecte des données DHIS2, les rapports trimestriels et la gestion de projet terrain.',
          en: 'Master field DHIS2 data pipelines, quarterly donor reporting, and project workplans.',
        },
      },
      {
        stage: 'Années 4 – 7',
        label: { fr: 'Conseiller Technique Principal / Coordonnateur', en: 'Senior Technical Advisor / Lead' },
        advice: {
          fr: 'Prenez la responsabilité de composantes majeures (Lutte antivectorielle, CPS, Renforcement du système).',
          en: 'Take full ownership of major national components (Vector control, SMC, Health systems).',
        },
      },
      {
        stage: 'Années 8+',
        label: { fr: 'Directeur de Projet / Country Lead', en: 'Chief of Party / Country Director' },
        advice: {
          fr: 'Supervisez l’ensemble du portefeuille pays et négociez directement les accords de financement avec l’État.',
          en: 'Oversee entire national portfolios and negotiate direct bilateral financing awards with governments.',
        },
      },
    ],
    dagnonGoldenRule: {
      fr: 'La réussite d’un bailleur se mesure au jour où le Ministère de la Santé est capable de poursuivre le programme sans lui.',
      en: 'The ultimate success of a development partner is measured on the day the Ministry of Health can sustain the program entirely on its own.',
    },
  },
  {
    id: 'philanthropy-global-strategy',
    title: {
      fr: '3. Philanthropie & Stratégie Globale (Fondation Gates)',
      en: '3. Philanthropy & Global Strategy (Gates Foundation)',
    },
    subtitle: {
      fr: 'Façonner les investissements catalytiques et accélérer l’éradication des maladies',
      en: 'Shaping catalytic investments and accelerating global disease eradication',
    },
    iconName: 'Sparkles',
    description: {
      fr: 'Pour les visionnaires de santé publique capables d’allouer des investissements catalytiques, d’identifier les innovations de rupture et d’influencer l’agenda mondial.',
      en: 'For public health visionaries capable of directing catalytic grants, backing scientific breakthroughs, and shaping the global eradication agenda.',
    },
    recommendedDegrees: {
      fr: ['MD + MPH + Expérience internationale prouvée', 'Track record solide de publications et leadership régional', 'Bilinguisme parfait Français / Anglais'],
      en: ['MD + MPH + Proven international leadership', 'Solid publication record and regional program footprint', 'Full French / English bilingual fluency'],
    },
    coreCompetencies: {
      fr: [
        'Vision systémique et cadrage stratégique d’investissements multi-pays',
        'Capacité de synthèse exécutive pour décideurs de haut niveau',
        'Leadership d’influence sans autorité hiérarchique directe',
      ],
      en: [
        'Systemic vision and multi-country catalytic grant design',
        'Executive synthesis capability for top global health leaders',
        'Influence leadership and cross-institutional coalition building',
      ],
    },
    pitfallsToAvoid: {
      fr: [
        'Penser en silos nationaux isolés au lieu de rechercher des synergies régionales africaines.',
        'Perdre le contact avec la réalité du dernier kilomètre sanitaire.',
      ],
      en: [
        'Thinking in isolated national silos instead of building cross-border African synergies.',
        'Losing touch with frontline last-mile delivery realities.',
      ],
    },
    milestones: [
      {
        stage: 'Années 1 – 5',
        label: { fr: 'Expertise Technique Reconnue', en: 'Recognized Technical Mastery' },
        advice: {
          fr: 'Devenez la référence incontournable dans votre spécialité (Paludisme, Digitalisation, Financement).',
          en: 'Become the recognized authority in your niche (Malaria, Digital health, Health financing).',
        },
      },
      {
        stage: 'Années 6 – 10',
        label: { fr: 'Program Officer / Lead Régional', en: 'Program Officer / Regional Lead' },
        advice: {
          fr: 'Concevez et gérez des portefeuilles de subventions innovantes à l’échelle du continent.',
          en: 'Design and manage innovative multi-million grant portfolios across the continent.',
        },
      },
      {
        stage: 'Années 11+',
        label: { fr: 'Senior Program Officer / Director', en: 'Senior Program Officer / Director' },
        advice: {
          fr: 'Guidez les choix stratégiques mondiaux vers l’élimination définitive du paludisme.',
          en: 'Steer global eradication strategic roadmaps towards a malaria-free world.',
        },
      },
    ],
    dagnonGoldenRule: {
      fr: 'La philanthropie ne doit pas financer le statu quo : son rôle est de prendre des risques calculés pour débloquer des innovations majeures.',
      en: 'Philanthropy must never fund the status quo: its mandate is to take calculated risks that unlock transformative breakthroughs.',
    },
  },
];
