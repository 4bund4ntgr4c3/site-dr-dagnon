import type { Lang } from '@/i18n/lang';

/* Case studies ("projets") — projects Dr. Dagnon has led, funded or shaped,
   with measurable results. Each entry is fully bilingual and becomes a
   dedicated page at /projets/<slug>. Every figure comes from the verified
   career, portfolio and publication data elsewhere in this site. */

export interface ProjectResult {
  /** the number or headline figure, rendered large on the case study page */
  value: string;
  label: Record<Lang, string>;
}

export interface ProjectEvidence {
  label: Record<Lang, string>;
  url: string;
}

export interface ProjectEntry {
  /** URL slug, must match /^[a-z0-9-]+$/ */
  slug: string;
  /** ISO date used for sorting and JSON-LD */
  date: string;
  /** short category label */
  tag: Record<Lang, string>;
  period: Record<Lang, string>;
  location: Record<Lang, string>;
  role: Record<Lang, string>;
  title: Record<Lang, string>;
  description: Record<Lang, string>;
}

export const PROJECTS: ProjectEntry[] = [
  {
    slug: 'digitalisation-milda-benin',
    date: '2020-12-01',
    tag: { fr: 'Santé numérique', en: 'Digital health' },
    period: { fr: '2020 — aujourd\'hui', en: '2020 — present' },
    location: { fr: 'Bénin', en: 'Benin' },
    role: { fr: 'Senior Program Officer — Fondation Gates', en: 'Senior Program Officer — Gates Foundation' },
    title: {
      fr: 'Digitalisation des campagnes MILDA au Bénin',
      en: 'Digitalizing LLIN campaigns in Benin',
    },
    description: {
      fr: 'Digitalisation des campagnes de moustiquaires imprégnées au Bénin : trois subventions structurantes pour des données fiables et des campagnes plus efficaces.',
      en: 'Digitizing Benin\'s mass bed net distribution campaigns: three anchoring grants for reliable data and more efficient campaigns.',
    },
  },
  {
    slug: 'recherche-cps-smc',
    date: '2026-02-28',
    tag: { fr: 'Recherche & mise à l\'échelle', en: 'Research & scale-up' },
    period: { fr: '2020 — aujourd\'hui', en: '2020 — present' },
    location: { fr: 'Bénin · Burkina Faso', en: 'Benin · Burkina Faso' },
    role: { fr: 'Senior Program Officer — Fondation Gates', en: 'Senior Program Officer — Gates Foundation' },
    title: {
      fr: 'Élargir la chimioprévention du paludisme',
      en: 'Scaling seasonal malaria chemoprevention',
    },
    description: {
      fr: 'Un portefeuille de recherches et de partenariats pour élargir la chimioprévention du paludisme saisonnier en Afrique francophone.',
      en: 'A portfolio of research and partnerships to scale seasonal malaria chemoprevention across Francophone Africa.',
    },
  },
  {
    slug: 'malariya-pi-burundi',
    date: '2026-03-31',
    tag: { fr: 'Données pour la décision', en: 'Data for decision-making' },
    period: { fr: 'En cours', en: 'Ongoing' },
    location: { fr: 'Burundi', en: 'Burundi' },
    role: { fr: 'Senior Program Officer — Fondation Gates', en: 'Senior Program Officer — Gates Foundation' },
    title: {
      fr: 'L\'entrepôt de données paludisme du Burundi',
      en: 'Burundi\'s national malaria data warehouse',
    },
    description: {
      fr: 'Accompagnement du ministère de la Santé du Burundi pour structurer les données paludisme et éclairer les décisions nationales.',
      en: 'Supporting Burundi\'s Ministry of Health in structuring malaria data to inform national decisions.',
    },
  },
  {
    slug: 'arm3-systeme-information-benin',
    date: '2015-09-01',
    tag: { fr: 'Suivi & évaluation', en: 'Monitoring & evaluation' },
    period: { fr: '2012 — 2015', en: '2012 — 2015' },
    location: { fr: 'Bénin — 34 zones de santé', en: 'Benin — 34 health zones' },
    role: { fr: 'Responsable suivi & évaluation — MCDI/ARM3', en: 'Monitoring & Evaluation Lead — MCDI/ARM3' },
    title: {
      fr: 'Fiabiliser les données paludisme du Bénin',
      en: 'Making Benin\'s malaria data reliable',
    },
    description: {
      fr: 'Responsable suivi-évaluation d\'ARM3 : hausse de la complétude des données de routine et baisse spectaculaire des erreurs.',
      en: 'As ARM3 M&E lead: raising routine data completeness while slashing the national error rate.',
    },
  },
  {
    slug: 'irs-nord-benin',
    date: '2020-11-30',
    tag: { fr: 'Lutte antivectorielle', en: 'Vector control' },
    period: { fr: '2015 — 2020', en: '2015 — 2020' },
    location: { fr: 'Alibori · Donga · Atacora — nord du Bénin', en: 'Alibori · Donga · Atacora — northern Benin' },
    role: { fr: 'Spécialiste gestion de programme — USAID/PMI Bénin', en: 'Program Management Specialist — USAID/PMI Benin' },
    title: {
      fr: 'Pulvérisation intradomiciliaire au Bénin',
      en: 'Indoor residual spraying in northern Benin',
    },
    description: {
      fr: 'Pilotage des campagnes PMI de pulvérisation intradomiciliaire et production d\'une base de preuves entomologiques au nord du Bénin.',
      en: 'Leading PMI indoor residual spraying campaigns and building an entomological evidence base in northern Benin.',
    },
  },
  {
    slug: 'reponse-epidemies-benin',
    date: '2020-11-30',
    tag: { fr: 'Sécurité sanitaire', en: 'Health security' },
    period: { fr: '2015 — 2020', en: '2015 — 2020' },
    location: { fr: 'Bénin', en: 'Benin' },
    role: { fr: 'Spécialiste gestion de programme — USAID/PMI Bénin', en: 'Program Management Specialist — USAID/PMI Benin' },
    title: {
      fr: 'Préparation et réponse aux épidémies au Bénin',
      en: 'Epidemic preparedness and response in Benin',
    },
    description: {
      fr: 'Coordination de la réponse USAID aux épidémies émergentes (Ebola, fièvre de Lassa, COVID-19) et continuité des services paludisme.',
      en: 'Coordinating the USAID response to emerging epidemics (Ebola, Lassa fever, COVID-19) while keeping malaria services running.',
    },
  },
  {
    slug: 'contrat-g2g-pnlp-benin',
    date: '2020-11-30',
    tag: { fr: 'Partenariat G2G', en: 'G2G partnership' },
    period: { fr: '2015 — 2020', en: '2015 — 2020' },
    location: { fr: 'Bénin', en: 'Benin' },
    role: { fr: 'Spécialiste gestion de programme — USAID/PMI Bénin', en: 'Program Management Specialist — USAID/PMI Benin' },
    title: {
      fr: 'Contrat G2G avec le PNLP du Bénin',
      en: 'A G2G contract with Benin\'s NMCP',
    },
    description: {
      fr: 'Négociation d\'un contrat G2G entre l\'USAID et le PNLP du Bénin, avec des économies majeures pour le gouvernement américain.',
      en: 'Negotiating a government-to-government contract between USAID and Benin\'s NMCP, with major savings for the U.S. government.',
    },
  },
];
