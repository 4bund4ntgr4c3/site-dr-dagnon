import type { Lang } from '@/i18n/lang';

export type PubType = 'publication' | 'blog';

export interface PubEntry {
  id: string;
  type: PubType;
  title: Record<Lang, string>;
  authors: Record<Lang, string>;
  journal: Record<Lang, string>;
  /** One-sentence factual summary of the paper's findings, shown on its card. */
  description: Record<Lang, string>;
  year: number;
  url?: string;
  featured?: boolean;
}

export const PUB_ITEMS: PubEntry[] = [
  // ── Publications ──────────────────────────────────────────────────
  {
    id: 'aled-nature-2026',
    type: 'blog',
    featured: true,
    year: 2026,
    title: {
      fr: 'Du contrôle du paludisme à son élimination : le virage que nous devons prendre',
      en: 'From Malaria Control to Elimination: The Turn We Need to Make',
    },
    authors: { fr: 'Rose Leke, Seynudé Jean Fortune Dagnon', en: 'Rose Leke, Seynudé Jean Fortune Dagnon' },
    journal: { fr: 'Africa Health Watch — Perspectives', en: 'Africa Health Watch — Perspectives' },
    description: { fr: 'Plaide pour un passage du contrôle à l\'élimination du paludisme en Afrique : viser l\'arrêt de la transmission, prioriser les zones frontalières mal desservies et renforcer le leadership des institutions locales.', en: 'Argues that African countries must move from malaria control to elimination: redefining success as ending transmission, prioritizing underserved border regions, and empowering local institutions to lead.' },
    url: 'https://africahealthwatch.com/from-malaria-control-to-elimination-the-turn-we-need-to-make/',
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
    description: { fr: 'S\'appuie sur un atelier de parties prenantes à Kigali pour identifier les freins à l\'adoption de la chimioprévention saisonnière du paludisme chez les enfants d\'âge scolaire en Afrique francophone.', en: 'Draws on a Kigali stakeholder workshop to identify barriers to seasonal malaria chemoprevention uptake in school-aged children across Francophone Africa.' },
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
    description: { fr: 'A détecté le triple mutant Pfdhfr chez 84,6 % des isolats parasitaires au Bénin, mais le quintuple mutant pleinement résistant à la sulfadoxine chez seulement 0,8 % — confirmant la pertinence de poursuivre la chimioprévention à base de SP.', en: 'Found the Pfdhfr triple mutant in 84.6% of parasite isolates in Benin, but the fully sulfadoxine-resistant quintuple mutant in only 0.8% — supporting continued use of SP-based chemoprevention.' },
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
    description: { fr: 'A suivi 1 500 moustiquaires imprégnées de longue durée de trois marques après la campagne de distribution 2017 au Bénin ; le taux de survie physique est passé de 90,3 % à 6 mois à 37,9 % à 24 mois.', en: 'Tracked 1,500 long-lasting insecticidal nets of three brands after Benin\'s 2017 distribution campaign; physical survival fell from 90.3% at 6 months to 37.9% at 24 months.' },
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
    description: { fr: 'Compare l\'effet de barrière chimique et la survie des moustiques exposés à deux marques de moustiquaires imprégnées de longue durée sur le terrain au Bénin.', en: 'Compares the chemical barrier effect and mosquito survivorship of two long-lasting insecticidal net brands in the field in Benin.' },
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
    description: { fr: 'Examine comment une mauvaise utilisation des outils de prévention des piqûres de moustique — moustiquaires, répulsifs, vêtements protecteurs — influe sur le risque d\'exposition au paludisme au Bénin.', en: 'Examines how improper use of mosquito bite prevention tools — nets, repellents, protective clothing — affects malaria exposure risk in Benin.' },
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
    description: { fr: 'A montré un pic des piqûres infectantes en août et octobre, la vitesse du vent, l\'humidité, l\'ensoleillement et la température influençant l\'agressivité d\'Anopheles dans les districts sous pulvérisation intradomiciliaire du nord du Bénin.', en: 'Found that infective mosquito bites peaked in August and October, with wind speed, humidity, sunshine and temperature all shaping Anopheles aggression in IRS-treated districts of northern Benin.' },
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
    description: { fr: 'Une décennie de pulvérisation intradomiciliaire au Bénin a réduit le taux d\'inoculation entomologique de 80 à 90 %, mais plus de 90 % des habitants restaient exposés entre 19h et 22h en raison d\'activités en extérieur.', en: 'A decade of indoor residual spraying in Benin cut the entomological inoculation rate by 80-90%, but over 90% of residents remained unprotected between 7 and 10 p.m. due to outdoor evening activity.' },
    url: 'https://malariajournal.biomedcentral.com/articles/10.1186/s12936-020-3131-1',
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
    description: { fr: 'L\'arrêt de la pulvérisation intradomiciliaire dans la région de l\'Atacora au Bénin a triplé l\'abondance des vecteurs et fait passer les piqûres infectantes de 17-25 à 95-129 par personne et par an en deux ans.', en: 'Withdrawing indoor residual spraying in Benin\'s Atacora region tripled vector abundance and raised infective bites from 17-25 to 95-129 per person per year within two years.' },
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
    description: { fr: 'Évalue la durabilité de terrain des moustiquaires imprégnées de longue durée Yorkool® en conditions réelles au Bénin.', en: 'Assesses the field durability of Yorkool® long-lasting insecticidal nets under real-world conditions in Benin.' },
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
    description: { fr: 'La pulvérisation intradomiciliaire à l\'Actellic 300 CS dans le nord du Bénin a réduit les piqûres infectantes de 12,11 à 1,6 par personne et par mois — une baisse de 86,78 % — tout en abaissant la parité et le taux de sporozoïtes des moustiques.', en: 'Actellic 300 CS indoor residual spraying in northern Benin cut infective bites from 12.11 to 1.6 per person per month — an 86.78% reduction — while lowering mosquito parity and sporozoite rates.' },
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
    description: { fr: 'A recensé 12 sites du nord du Bénin avant une campagne de pulvérisation intradomiciliaire, capturant plus de 10 000 moustiques : Anopheles gambiae dominait et piquait davantage en zone rurale, Culex quinquefasciatus en zone urbaine.', en: 'Surveyed 12 sites in northern Benin before an IRS campaign, capturing over 10,000 mosquitoes: Anopheles gambiae dominated and bit more in rural areas, Culex quinquefasciatus in urban ones.' },
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
    description: { fr: 'Un préprint antérieur examinant comment les facteurs climatiques influencent l\'agressivité d\'Anopheles et le risque de transmission du paludisme au nord du Bénin.', en: 'An earlier preprint examining how climatic factors shape Anopheles aggression and malaria transmission risk in northern Benin.' },
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
    description: { fr: 'Anopheles gambiae dans le nord du Bénin a montré une résistance aux pyréthrinoïdes (25-83 % de mortalité à la deltaméthrine), largement restaurée par le synergiste PBO, tout en restant pleinement sensible au pirimiphos-méthyl.', en: 'Anopheles gambiae in northern Benin showed pyrethroid resistance (25-83% mortality to deltamethrin), largely restored by the PBO synergist, while remaining fully susceptible to pirimiphos-methyl.' },
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
    description: { fr: 'A comparé le comportement alimentaire de deux espèces sœurs dans le nord du Bénin : Anopheles gambiae se nourrissait davantage de sang, mais Anopheles coluzzii était responsable de 86 % des infections en saison sèche à Alibori.', en: 'Compared feeding behaviour of two sibling species in northern Benin: Anopheles gambiae fed more on blood overall, but Anopheles coluzzii drove 86% of dry-season infections in Alibori.' },
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
    description: { fr: 'Évalue la transmission résiduelle du paludisme dans la région de l\'Atacora au Bénin en amont d\'une intervention prévue de pulvérisation intradomiciliaire.', en: 'Assesses residual malaria transmission in Benin\'s Atacora region ahead of a planned indoor residual spraying intervention.' },
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
    description: { fr: 'A établi les données de référence sur la transmission dans le nord du Bénin : le taux d\'inoculation entomologique atteignait 16,84-17,64 piqûres infectantes par mois à Donga, contre 10,74-11,04 à Alibori.', en: 'Established baseline transmission data in northern Benin: the entomological inoculation rate reached 16.84-17.64 infective bites per month in Donga, versus 10.74-11.04 in Alibori.' },
    url: 'https://doi.org/10.1186/s12936-018-2507-y',
  },
];
