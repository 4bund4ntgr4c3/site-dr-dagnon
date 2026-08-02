import type { Lang } from '@/i18n/lang';

/* Impact & results page — every figure here is taken from the same facts
   the rest of the site already carries (STATS, ACHIEVEMENTS and the case
   studies in src/data/projects.ts), so the numbers can never drift apart. */

export interface ImpactStat {
  value: string;
  label: Record<Lang, string>;
  detail: Record<Lang, string>;
}

export interface ImpactResult {
  id: string;
  metric: string;
  title: Record<Lang, string>;
  text: Record<Lang, string>;
  /** link to the matching case study, when one exists */
  href?: string;
}

export const IMPACT_STATS: Record<Lang, ImpactStat[]> = {
  fr: [
    { value: '1114', label: { fr: 'centres de santé couverts', en: 'health facilities covered' }, detail: { fr: 'Complétude du système d\'information : 35 % → 94 %.', en: 'Routine information system completeness: 35% → 94%.' } },
    { value: '44 % → 5 %', label: { fr: 'taux d\'erreur national', en: 'national error rate' }, detail: { fr: 'Baisse du taux d\'erreur des données sur 1 114 centres de santé.', en: 'Data error rate cut across 1,114 health facilities.' } },
    { value: '$3 M', label: { fr: 'd\'économies générées', en: 'in savings generated' }, detail: { fr: 'Contrat G2G négocié avec le PNLP Bénin, sur 5 ans.', en: 'G2G contract negotiated with Benin\'s NMCP, over 5 years.' } },
    { value: '$180 M+', label: { fr: 'de portefeuille géré', en: 'in portfolio managed' }, detail: { fr: 'Subventions et contrats paludisme suivis à la Fondation Gates.', en: 'Malaria grants and contracts overseen at the Gates Foundation.' } },
  ],
  en: [
    { value: '1114', label: { fr: 'centres de santé couverts', en: 'health facilities covered' }, detail: { fr: 'Complétude du système d\'information : 35 % → 94 %.', en: 'Routine information system completeness: 35% → 94%.' } },
    { value: '44% → 5%', label: { fr: 'taux d\'erreur national', en: 'national error rate' }, detail: { fr: 'Baisse du taux d\'erreur des données sur 1 114 centres de santé.', en: 'Data error rate cut across 1,114 health facilities.' } },
    { value: '$3M', label: { fr: 'd\'économies générées', en: 'in savings generated' }, detail: { fr: 'Contrat G2G négocié avec le PNLP Bénin, sur 5 ans.', en: 'G2G contract negotiated with Benin\'s NMCP, over 5 years.' } },
    { value: '$180M+', label: { fr: 'de portefeuille géré', en: 'in portfolio managed' }, detail: { fr: 'Subventions et contrats paludisme suivis à la Fondation Gates.', en: 'Malaria grants and contracts overseen at the Gates Foundation.' } },
  ],
};

export const IMPACT_RESULTS: Record<Lang, ImpactResult[]> = {
  fr: [
    {
      id: 'milda-digitalisation',
      metric: '3 150 000 $',
      title: { fr: 'Digitalisation des campagnes MILDA au Bénin', en: 'Digitalized LLIN campaigns in Benin' },
      text: { fr: 'Subvention CRS de 3 ans pour numériser la distribution de moustiquaires et fiabiliser la couverture réelle des ménages.', en: 'A 3-year CRS grant to digitize net distribution and make real household coverage reliable.' },
      href: '/projets/digitalisation-milda-benin',
    },
    {
      id: 'malariya-pi',
      metric: 'Entrepôt national',
      title: { fr: 'Données paludisme au Burundi', en: 'Malaria data in Burundi' },
      text: { fr: 'Appui à la mise en place d\'un entrepôt national de données paludisme, financé par la Fondation Gates et la Belgique.', en: 'Support for a national malaria data warehouse, funded by the Gates Foundation and Belgium.' },
      href: '/projets/malariya-pi-burundi',
    },
    {
      id: 'cps-msh',
      metric: '272 000 $',
      title: { fr: 'Recherche sur la chimioprévention saisonnière', en: 'Seasonal chemoprevention research' },
      text: { fr: 'Recherche opérationnelle sur l\'efficacité et l\'équité de la CPS dans les zones d\'accès difficile au Bénin.', en: 'Operational research on the effectiveness and equity of SMC in hard-to-reach areas of Benin.' },
      href: '/projets/recherche-cps-smc',
    },
    {
      id: 'arm3-systeme-information',
      metric: '35 % → 94 %',
      title: { fr: 'Système d\'information de routine', en: 'Routine information system' },
      text: { fr: 'Hausse de la complétude des données paludisme et baisse du taux d\'erreur national de 44 % à 5 % sur 1 114 centres de santé.', en: 'Raised malaria data completeness and cut the national error rate from 44% to 5% across 1,114 health facilities.' },
      href: '/projets/arm3-systeme-information-benin',
    },
    {
      id: 'irs-nord-benin',
      metric: 'IRS',
      title: { fr: 'Pulvérisation intradomiciliaire au nord du Bénin', en: 'Indoor residual spraying in northern Benin' },
      text: { fr: 'Décennie de suivi d\'impact de l\'IRS : leçons apprises et prise de décision fondée sur les données entomologiques.', en: 'A decade of IRS impact monitoring: lessons learned and entomology-driven decision-making.' },
      href: '/projets/irs-nord-benin',
    },
    {
      id: 'g2g-pnlp',
      metric: '3 000 000 $',
      title: { fr: 'Contrat G2G avec le PNLP Bénin', en: 'G2G contract with Benin\'s NMCP' },
      text: { fr: 'Négociation d\'un contrat de gouvernement à gouvernement générant jusqu\'à 3 000 000 $ d\'économies sur 5 ans.', en: 'Negotiated a government-to-government contract saving the U.S. government up to $3,000,000 over 5 years.' },
      href: '/projets/contrat-g2g-pnlp-benin',
    },
  ],
  en: [
    {
      id: 'milda-digitalisation',
      metric: '$3,150,000',
      title: { fr: 'Digitalisation des campagnes MILDA au Bénin', en: 'Digitalized LLIN campaigns in Benin' },
      text: { fr: 'Subvention CRS de 3 ans pour numériser la distribution de moustiquaires et fiabiliser la couverture réelle des ménages.', en: 'A 3-year CRS grant to digitize net distribution and make real household coverage reliable.' },
      href: '/projets/digitalisation-milda-benin',
    },
    {
      id: 'malariya-pi',
      metric: 'National warehouse',
      title: { fr: 'Données paludisme au Burundi', en: 'Malaria data in Burundi' },
      text: { fr: 'Appui à la mise en place d\'un entrepôt national de données paludisme, financé par la Fondation Gates et la Belgique.', en: 'Support for a national malaria data warehouse, funded by the Gates Foundation and Belgium.' },
      href: '/projets/malariya-pi-burundi',
    },
    {
      id: 'cps-msh',
      metric: '$272,000',
      title: { fr: 'Recherche sur la chimioprévention saisonnière', en: 'Seasonal chemoprevention research' },
      text: { fr: 'Recherche opérationnelle sur l\'efficacité et l\'équité de la CPS dans les zones d\'accès difficile au Bénin.', en: 'Operational research on the effectiveness and equity of SMC in hard-to-reach areas of Benin.' },
      href: '/projets/recherche-cps-smc',
    },
    {
      id: 'arm3-systeme-information',
      metric: '35% → 94%',
      title: { fr: 'Système d\'information de routine', en: 'Routine information system' },
      text: { fr: 'Hausse de la complétude des données paludisme et baisse du taux d\'erreur national de 44 % à 5 % sur 1 114 centres de santé.', en: 'Raised malaria data completeness and cut the national error rate from 44% to 5% across 1,114 health facilities.' },
      href: '/projets/arm3-systeme-information-benin',
    },
    {
      id: 'irs-nord-benin',
      metric: 'IRS',
      title: { fr: 'Pulvérisation intradomiciliaire au nord du Bénin', en: 'Indoor residual spraying in northern Benin' },
      text: { fr: 'Décennie de suivi d\'impact de l\'IRS : leçons apprises et prise de décision fondée sur les données entomologiques.', en: 'A decade of IRS impact monitoring: lessons learned and entomology-driven decision-making.' },
      href: '/projets/irs-nord-benin',
    },
    {
      id: 'g2g-pnlp',
      metric: '$3,000,000',
      title: { fr: 'Contrat G2G avec le PNLP Bénin', en: 'G2G contract with Benin\'s NMCP' },
      text: { fr: 'Négociation d\'un contrat de gouvernement à gouvernement générant jusqu\'à 3 000 000 $ d\'économies sur 5 ans.', en: 'Negotiated a government-to-government contract saving the U.S. government up to $3,000,000 over 5 years.' },
      href: '/projets/contrat-g2g-pnlp-benin',
    },
  ],
};
