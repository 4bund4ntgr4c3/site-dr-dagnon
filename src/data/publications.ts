import type { Lang } from '@/i18n/lang';

export type PubType = 'publication' | 'blog';

export interface PubEntry {
  id: string;
  type: PubType;
  title: Record<Lang, string>;
  authors: Record<Lang, string>;
  journal: Record<Lang, string>;
  year: number;
  url?: string;
  featured?: boolean;
}

export const PUB_ITEMS: PubEntry[] = [
  // ── Publications ──────────────────────────────────────────────────
  {
    id: 'aled-nature-2026',
    type: 'publication',
    featured: true,
    year: 2026,
    title: {
      fr: 'Du contrôle du paludisme à son élimination : le virage que nous devons prendre',
      en: 'From Malaria Control to Elimination: The Turn We Need to Make',
    },
    authors: { fr: 'Rose Leke, Seynudé Jean Fortune Dagnon', en: 'Rose Leke, Seynudé Jean Fortune Dagnon' },
    journal: { fr: 'Africa Health Watch — Perspectives', en: 'Africa Health Watch — Perspectives' },
    url: 'https://www.africahealthwatch.com/p/from-malaria-control-to-elimination?utm_source=publication-search',
  },
  {
    id: 'frontiers-chemoprevention-2025',
    type: 'publication',
    year: 2025,
    title: {
      fr: 'Barrières à l\'adoption et à la mise en œuvre de la chimioprévention du paludisme chez les enfants d\'âge scolaire',
      en: 'Barriers to uptake and implementation of malaria chemoprevention in school-aged children',
    },
    authors: {
      fr: 'Morlino C., Byrne I., Achan J., … Dagnon S.J.F., … Cohee L.M.',
      en: 'Morlino C., Byrne I., Achan J., … Dagnon S.J.F., … Cohee L.M.',
    },
    journal: { fr: 'Frontiers in Tropical Diseases', en: 'Frontiers in Tropical Diseases' },
    url: 'https://doi.org/10.3389/fitd.2025.1480907',
  },
  {
    id: 'mj-dhps-2021',
    type: 'publication',
    year: 2021,
    title: {
      fr: 'Faible prévalence d\'allèles de dihydropteroate synthase hautement résistants à la sulfadoxine au Bénin',
      en: 'Low prevalence of highly sulfadoxine-resistant dihydropteroate synthase alleles in Benin',
    },
    authors: {
      fr: 'Souza Svigel S., Adeothy A., Kpemasse A., … Dagnon F., … Lucchi N.W.',
      en: 'Souza Svigel S., Adeothy A., Kpemasse A., … Dagnon F., … Lucchi N.W.',
    },
    journal: { fr: 'Malaria Journal', en: 'Malaria Journal' },
    url: 'https://doi.org/10.1186/s12936-021-03605-5',
  },
  {
    id: 'jbls-llin-2020',
    type: 'publication',
    year: 2020,
    title: {
      fr: 'Durabilité et bio-efficacité de trois moustiquaires imprégnées de longue durée après la campagne 2017 au Bénin',
      en: 'Assessment of the Durability and Bio-effectiveness of Three Long-Lasting Insecticidal Nets in Benin',
    },
    authors: {
      fr: 'Ahogni I.B., Salako A.S., Dagnon J.F., … Akogbeto M.C.',
      en: 'Ahogni I.B., Salako A.S., Dagnon J.F., … Akogbeto M.C.',
    },
    journal: { fr: 'Journal of Biology and Life Science', en: 'Journal of Biology and Life Science' },
    url: 'https://doi.org/10.5296/jbls.v11i2.17645',
  },
  {
    id: 'ijmr-chemical-barrier-2020',
    type: 'publication',
    year: 2020,
    title: {
      fr: 'Barrière chimique et survie : étude comparative de deux marques de moustiquaires au Bénin',
      en: 'Chemical barrier and survivorship: Comparative study of two brands of polyester nets in Benin',
    },
    authors: {
      fr: 'Ahogni I.B., Aïkpon R.Y., Dagnon J.F., … Akogbéto M.C.',
      en: 'Ahogni I.B., Aïkpon R.Y., Dagnon J.F., … Akogbéto M.C.',
    },
    journal: { fr: 'International Journal of Mosquito Research', en: 'International Journal of Mosquito Research' },
  },
  {
    id: 'rs-risks-2020',
    type: 'publication',
    year: 2020,
    title: {
      fr: 'Risques paludiques liés aux mauvaises pratiques d\'utilisation des outils de lutte contre les piqûres',
      en: 'Malaria Risks Related to Poor Practices in The Use of Mosquito Bite Control Tools',
    },
    authors: {
      fr: 'Sominahouin A., Dagnon F., Padonou G.G., Akogbéto M.C.',
      en: 'Sominahouin A., Dagnon F., Padonou G.G., Akogbéto M.C.',
    },
    journal: { fr: 'Preprint — Research Square', en: 'Preprint — Research Square' },
    url: 'https://doi.org/10.21203/rs.3.rs-38144/v1',
  },
  {
    id: 'ajlm-climatic-2020',
    type: 'publication',
    year: 2020,
    title: {
      fr: 'Influence des facteurs climatiques sur l\'agressivité d\'Anopheles dans les districts de pulvérisation au nord du Bénin',
      en: 'Influence of Climatic Factors on Aggression and Infectivity of Anopheles in IRS Districts in Northern Benin',
    },
    authors: {
      fr: 'Sominahouin A., Padonou G.G., Landéhou R., … Dagnon F., … Akogbéto M.',
      en: 'Sominahouin A., Padonou G.G., Landéhou R., … Dagnon F., … Akogbéto M.',
    },
    journal: { fr: 'American Journal of Laboratory Medicine', en: 'American Journal of Laboratory Medicine' },
    url: 'https://doi.org/10.11648/j.ajlm.20200501.11',
  },
  {
    id: 'mj-lessons-2020',
    type: 'publication',
    year: 2020,
    title: {
      fr: 'Leçons apprises, défis et perspectives après une décennie de suivi de l\'impact de la pulvérisation intradomiciliaire au Bénin',
      en: 'Lessons learned, challenges, and outlooks for decision-making after a decade of IRS monitoring in Benin',
    },
    authors: {
      fr: 'Akogbéto M.C., Dagnon F., Aïkpon R., … Padonou G.G.',
      en: 'Akogbéto M.C., Dagnon F., Aïkpon R., … Padonou G.G.',
    },
    journal: { fr: 'Malaria Journal', en: 'Malaria Journal' },
    url: 'https://malariajournal.biomedcentral.com/articles/10.1186/s12936-020-3112-9',
  },
  {
    id: 'mj-increase-2020',
    type: 'publication',
    year: 2020,
    title: {
      fr: 'Augmentation de la transmission du paludisme après le retrait de la pulvérisation intradomiciliaire au Bénin',
      en: 'Increase in malaria transmission after indoor residual spraying withdrawal in Benin',
    },
    authors: {
      fr: 'Aïkpon R.Y., Padonou G., Dagnon F., … Akogbéto M.',
      en: 'Aïkpon R.Y., Padonou G., Dagnon F., … Akogbéto M.',
    },
    journal: { fr: 'Malaria Journal', en: 'Malaria Journal' },
    url: 'https://doi.org/10.1186/s12936-019-3086-2',
  },
  {
    id: 'ae-yorkool-2020',
    type: 'publication',
    year: 2020,
    title: {
      fr: 'Durabilité de terrain des moustiquaires Yorkool® au Bénin',
      en: 'Field durability of Yorkool® nets in Benin',
    },
    authors: {
      fr: 'Ahogni B., Aïkpon R.Y., Ossè R.A., Dagnon J.F., … Akogbéto M.C.',
      en: 'Ahogni B., Aïkpon R.Y., Ossè R.A., Dagnon J.F., … Akogbéto M.C.',
    },
    journal: { fr: 'Advances in Entomology', en: 'Advances in Entomology' },
    url: 'https://www.scirp.org/journal/ae',
  },
  {
    id: 'pv-actellic-2019',
    type: 'publication',
    year: 2019,
    title: {
      fr: 'Efficacité de la pulvérisation intradomiciliaire à base d\'Actellic 300 CS au nord du Bénin',
      en: 'Efficacy of Actellic 300 CS indoor residual spraying in northern Benin',
    },
    authors: {
      fr: 'Salako A.S., Dagnon F., Sovi A., … Akogbéto M.C.',
      en: 'Salako A.S., Dagnon F., Sovi A., … Akogbéto M.C.',
    },
    journal: { fr: 'Parasites & Vectors', en: 'Parasites & Vectors' },
    url: 'https://doi.org/10.1186/s13071-019-3865-1',
  },
  {
    id: 'vbzd-dynamics-2019',
    type: 'publication',
    year: 2019,
    title: {
      fr: 'Dynamique des populations d\'Anopheles gambiae s.l. avant une campagne de pulvérisation au nord du Bénin',
      en: 'Population dynamics of Anopheles gambiae s.l. before IRS campaign in northern Benin',
    },
    authors: {
      fr: 'Salako A.S., Ossè R., Padonou G.G., Dagnon F., … Akogbéto M.C.',
      en: 'Salako A.S., Ossè R., Padonou G.G., Dagnon F., … Akogbéto M.C.',
    },
    journal: { fr: 'Vector-Borne and Zoonotic Diseases', en: 'Vector-Borne and Zoonotic Diseases' },
    url: 'https://doi.org/10.1089/vbz.2018.2409',
  },
  {
    id: 'rs-climatic-2019',
    type: 'publication',
    year: 2019,
    title: {
      fr: 'L\'influence des facteurs climatiques sur l\'agressivité d\'Anopheles au nord du Bénin',
      en: 'Influence of climatic factors on Anopheles aggression in northern Benin',
    },
    authors: {
      fr: 'Sominahouin A., Padonou G.G., Landéhou R., … Dagnon F., … Akogbéto M.C.',
      en: 'Sominahouin A., Padonou G.G., Landéhou R., … Dagnon F., … Akogbéto M.C.',
    },
    journal: { fr: 'Preprint — Research Square', en: 'Preprint — Research Square' },
    url: 'https://doi.org/10.21203/rs.2.14494/v1',
  },
  {
    id: 'pv-resistance-2018',
    type: 'publication',
    year: 2018,
    title: {
      fr: 'Statut de résistance aux insecticides chez Anopheles gambiae dans deux régions du nord du Bénin',
      en: 'Insecticide resistance status of Anopheles gambiae in two regions of northern Benin',
    },
    authors: {
      fr: 'Salako A.S., Ahogni I., Aïkpon R., … Dagnon F., … Akogbéto M.C.',
      en: 'Salako A.S., Ahogni I., Aïkpon R., … Dagnon F., … Akogbéto M.C.',
    },
    journal: { fr: 'Parasites & Vectors', en: 'Parasites & Vectors' },
    url: 'https://doi.org/10.1186/s13071-018-3180-2',
  },
  {
    id: 'mj-coluzzii-2018',
    type: 'publication',
    year: 2018,
    title: {
      fr: 'Comparaison du comportement alimentaire d\'Anopheles coluzzii et Anopheles gambiae au nord du Bénin',
      en: 'Feeding behaviour comparison of Anopheles coluzzii and Anopheles gambiae in northern Benin',
    },
    authors: {
      fr: 'Akogbéto M.C., Salako A.S., Dagnon F., … Sezonlin M.',
      en: 'Akogbéto M.C., Salako A.S., Dagnon F., … Sezonlin M.',
    },
    journal: { fr: 'Malaria Journal', en: 'Malaria Journal' },
    url: 'https://doi.org/10.1186/s12936-018-2452-9',
  },
  {
    id: 'jezs-residual-2018',
    type: 'publication',
    year: 2018,
    title: {
      fr: 'Évaluation de la transmission résiduelle du paludisme dans la région de l\'Atacora au Bénin',
      en: 'Assessment of residual malaria transmission in the Atacora region of Benin',
    },
    authors: {
      fr: 'Aïkpon R., Ossè R., Ahogni I., Dagnon F., Lyikirenga L., Akogbéto M.',
      en: 'Aïkpon R., Ossè R., Ahogni I., Dagnon F., Lyikirenga L., Akogbéto M.',
    },
    journal: { fr: 'Journal of Entomology and Zoology Studies', en: 'Journal of Entomology and Zoology Studies' },
  },
  {
    id: 'mj-entomological-2018',
    type: 'publication',
    year: 2018,
    title: {
      fr: 'Données entomologiques de référence sur la transmission du paludisme au nord du Bénin',
      en: 'Entomological baseline data on malaria transmission in northern Benin',
    },
    authors: {
      fr: 'Salako A.S., Ahogni I., Kpanou C., … Dagnon F., … Akogbéto M.C.',
      en: 'Salako A.S., Ahogni I., Kpanou C., … Dagnon F., … Akogbéto M.C.',
    },
    journal: { fr: 'Malaria Journal', en: 'Malaria Journal' },
    url: 'https://doi.org/10.1186/s12936-018-2507-y',
  },
];
