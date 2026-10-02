import type { Lang } from '@/i18n/lang';

export interface PhilanthropicImpactMetric {
  value: string;
  label: Record<Lang, string>;
}

export interface PhilanthropicInitiative {
  id: string;
  albumKey: string;
  title: Record<Lang, string>;
  subtitle: Record<Lang, string>;
  partner: {
    name: string;
    role: Record<Lang, string>;
  };
  period: string;
  location: Record<Lang, string>;
  context: Record<Lang, string>;
  mission: Record<Lang, string>;
  quote: Record<Lang, string>;
  metrics: PhilanthropicImpactMetric[];
  featuredPhotoIds: string[];
  allPhotoIds: string[];
}

export const PHILANTHROPIC_STATS: { value: string; label: Record<Lang, string> }[] = [
  {
    value: '5+',
    label: {
      fr: 'Éditions de la Nuit du Paludisme parrainées',
      en: 'Night Against Malaria editions sponsored',
    },
  },
  {
    value: '100+',
    label: {
      fr: 'Kits scolaires complets distribués',
      en: 'Complete school kits distributed',
    },
  },
  {
    value: '100 000 FCFA',
    label: {
      fr: 'Bourses d’excellence par lauréat « Génies en Herbe »',
      en: 'Excellence scholarships per "Génies en Herbe" winner',
    },
  },
  {
    value: '50+',
    label: {
      fr: 'Acteurs de terrain & soignants honorés',
      en: 'Frontline health workers & actors honored',
    },
  },
];

export const PHILANTHROPIC_INITIATIVES: PhilanthropicInitiative[] = [
  {
    id: 'school-kits',
    albumKey: 'school-kits',
    title: {
      fr: 'Éducation & Solidarité : Fournitures Scolaires pour Enfants Vulnérables',
      en: 'Education & Solidarity: School Kits for Vulnerable Children',
    },
    subtitle: {
      fr: 'Soutien direct aux élèves des zones défavorisées en partenariat avec l’ONG Reel Concept & Plus',
      en: 'Direct support to students in underserved communities in partnership with NGO Reel Concept & Plus',
    },
    partner: {
      name: 'ONG Reel Concept & Plus',
      role: {
        fr: 'Partenaire opérationnel de distribution communautaire',
        en: 'Grassroots operational distribution partner',
      },
    },
    period: 'Depuis 2025',
    location: {
      fr: 'Bénin (zones périurbaines et rurales)',
      en: 'Benin (peri-urban and rural areas)',
    },
    context: {
      fr: "Dans de nombreuses communautés vulnérables, le coût des fournitures scolaires élémentaires constitue une barrière majeure à la scolarisation et un facteur d'abandon précoce. Pour le Dr. Dagnon, médecin de santé publique, l'accès à l'éducation constitue le premier déterminant social de la santé.",
      en: 'In many vulnerable communities, the cost of basic school supplies is a major barrier to enrollment and a primary cause of early dropout. For Dr. Dagnon, a public health physician, education access is the foundational social determinant of health.',
    },
    mission: {
      fr: 'Fourniture de cartables, cahiers, manuels scolaires et matériels didactiques complets remis en main propre aux enfants et orphelins démunis, pour leur garantir une rentrée digne, sereine et pérenne.',
      en: 'Providing backpacks, notebooks, textbooks, and full learning materials handed directly to vulnerable children and orphans, securing a dignified, confident, and sustained start to the school year.',
    },
    quote: {
      fr: "L'éducation est le bouclier le plus puissant contre la précarité. Donner à un enfant les moyens d'étudier, c'est protéger la santé et l'avenir de toute sa communauté.",
      en: 'Education is the strongest shield against vulnerability. Giving a child the tools to study safeguards the health and future of their entire community.',
    },
    metrics: [
      {
        value: '100+',
        label: {
          fr: 'Enfants directement équipés pour l’année',
          en: 'Children directly equipped for the school year',
        },
      },
      {
        value: '100%',
        label: {
          fr: 'Maintien scolaire des élèves bénéficiaires',
          en: 'School retention rate among beneficiaries',
        },
      },
      {
        value: '0 FCFA',
        label: {
          fr: 'Coût restant à charge pour les familles soutenues',
          en: 'Remaining expense for supported families',
        },
      },
    ],
    featuredPhotoIds: ['philantropie-1', 'philantropie-2', 'philantropie-7', 'philantropie-4'],
    allPhotoIds: [
      'philantropie-1',
      'philantropie-2',
      'philantropie-3',
      'philantropie-4',
      'philantropie-5',
      'philantropie-6',
      'philantropie-7',
    ],
  },
  {
    id: 'genies-en-herbe',
    albumKey: 'genies',
    title: {
      fr: 'Excellence & Jeunesse : Concours « Génies en Herbe »',
      en: 'Excellence & Youth: "Génies en Herbe" Academic Competition',
    },
    subtitle: {
      fr: 'Édition Dr. Seynudé Fortuné Dagnon : parrainage, bourses d’études et émulation intellectuelle',
      en: 'Dr. Seynudé Fortuné Dagnon Edition: sponsorship, scholarships, and academic emulation',
    },
    partner: {
      name: 'Comité d’Organisation Génies en Herbe',
      role: {
        fr: 'Promotion de la culture générale et scientifique',
        en: 'Advancing scientific and general knowledge',
      },
    },
    period: '2025',
    location: {
      fr: 'Cotonou, Bénin',
      en: 'Cotonou, Benin',
    },
    context: {
      fr: "La valorisation de l'excellence académique et de la curiosité intellectuelle est indispensable pour former la future génération de cadres, de scientifiques et de leaders africains. Dr. Dagnon a choisi de parrainer personnellement cette édition pour encourager l'effort et le dépassement de soi.",
      en: 'Fostering academic excellence and intellectual curiosity is vital to nurturing Africa’s next generation of scientists, executives, and leaders. Dr. Dagnon sponsored this edition to actively reward academic rigor and dedication.',
    },
    mission: {
      fr: 'Parrainage officiel de la compétition, financement de bourses d’études d’excellence (chèques de 100 000 FCFA), remise de trophées aux meilleurs marqueurs et temps d’échange inspirants avec les étudiants sur les métiers scientifiques et la santé publique.',
      en: 'Official patronage of the tournament, funding merit scholarships (100,000 FCFA checks), awarding top scorers, and hosting inspirational mentorship sessions on scientific careers and global health.',
    },
    quote: {
      fr: 'Célébrer le savoir, la vivacité d’esprit et le travail rigoureux chez nos jeunes, c’est semer les graines des découvertes et du leadership de demain.',
      en: 'Celebrating knowledge, intellectual agility, and hard work in our youth plants the seeds for tomorrow’s breakthroughs and leadership.',
    },
    metrics: [
      {
        value: '100 000 FCFA',
        label: {
          fr: 'Bourse d’encouragement par lauréat majeur',
          en: 'Merit scholarship per major winner',
        },
      },
      {
        value: '1er',
        label: {
          fr: 'Trophée d’honneur du meilleur marqueur',
          en: 'Honorary trophy for best individual scorer',
        },
      },
      {
        value: '6',
        label: {
          fr: 'Équipes finalistes célébrées et récompensées',
          en: 'Finalist teams celebrated and awarded',
        },
      },
    ],
    featuredPhotoIds: ['genies-1', 'genies-3', 'genies-4', 'genies-2'],
    allPhotoIds: ['genies-1', 'genies-2', 'genies-3', 'genies-4', 'genies-5', 'genies-6'],
  },
  {
    id: 'nuit-paludisme-5e',
    albumKey: 'nuit-paludisme-5e',
    title: {
      fr: '5e Nuit du Paludisme : Célébration des Héros de la Santé',
      en: '5th Night Against Malaria: Honoring Frontline Health Heroes',
    },
    subtitle: {
      fr: 'Soirée de gala et de plaidoyer de haut niveau avec l’ONG Icône 360°, Expertise France et le Ministère de la Santé',
      en: 'High-level advocacy and gala evening with NGO Icône 360°, Expertise France, and Ministry of Health',
    },
    partner: {
      name: 'ONG Icône 360° · Expertise France · Ministère de la Santé',
      role: {
        fr: 'Alliance tripartite de plaidoyer et d’action sanitaire',
        en: 'Tripartite advocacy and healthcare alliance',
      },
    },
    period: 'Juillet 2025',
    location: {
      fr: 'Cotonou, Bénin',
      en: 'Cotonou, Benin',
    },
    context: {
      fr: "Les soignants, chercheurs et relais communautaires mènent un combat quotidien contre le paludisme, souvent dans l'ombre. La 5e édition a marqué un tournant institutionnel en réunissant partenaires internationaux et autorités sanitaires pour consacrer leur engagement.",
      en: 'Healthcare professionals, researchers, and community focal points lead a daily fight against malaria, often unheralded. The 5th edition marked a milestone gathering of international partners and health authorities to celebrate their dedication.',
    },
    mission: {
      fr: 'Sous le haut parrainage du Dr. Seynudé Dagnon, remise solennelle d’attestations de reconnaissance aux médecins et acteurs de terrain méritants, discours d’orientation stratégique et renforcement des synergies multisectorielles.',
      en: 'Under the high patronage of Dr. Seynudé Dagnon, solemn awarding of certificates of distinction to meritorious frontline doctors and actors, strategic addresses, and strengthening multisectoral synergies.',
    },
    quote: {
      fr: 'L’éradication du paludisme n’est pas qu’un objectif technique : c’est un devoir humain porté par le dévouement exceptionnel de nos soignants de terrain.',
      en: 'Malaria elimination is not solely a technical objective: it is a moral imperative carried by the outstanding dedication of our frontline healthcare workers.',
    },
    metrics: [
      {
        value: '5e',
        label: {
          fr: 'Édition anniversaire pérennisée avec succès',
          en: 'Anniversary edition successfully sustained',
        },
      },
      {
        value: '10+',
        label: {
          fr: 'Soignants et experts de terrain distingués',
          en: 'Frontline clinicians and experts awarded',
        },
      },
      {
        value: '3',
        label: {
          fr: 'Partenaires majeurs unis pour l’élimination',
          en: 'Major partners united for malaria elimination',
        },
      },
    ],
    featuredPhotoIds: [
      'nuit-paludisme-5e-1',
      'nuit-paludisme-5e-5',
      'nuit-paludisme-5e-6',
      'nuit-paludisme-5e-8',
    ],
    allPhotoIds: [
      'nuit-paludisme-5e-1',
      'nuit-paludisme-5e-2',
      'nuit-paludisme-5e-3',
      'nuit-paludisme-5e-4',
      'nuit-paludisme-5e-5',
      'nuit-paludisme-5e-6',
      'nuit-paludisme-5e-7',
      'nuit-paludisme-5e-8',
    ],
  },
  {
    id: 'nuit-paludisme-fondation',
    albumKey: 'malaria-night',
    title: {
      fr: 'La Nuit du Paludisme : Plaidoyer & Engagement Pérenne',
      en: 'The Night Against Malaria: Grassroots Advocacy & Sustained Commitment',
    },
    subtitle: {
      fr: 'Présidence d’honneur et parrainage continu de la grande initiative citoyenne de lutte antipaludique au Bénin',
      en: 'Honorary presidency and ongoing patronage of Benin’s prominent anti-malaria civic initiative',
    },
    partner: {
      name: 'ONG Icône 360°',
      role: {
        fr: 'Organisateur citoyen et mobilisation communautaire',
        en: 'Civic organizer and grassroots mobilization',
      },
    },
    period: 'Depuis 2021',
    location: {
      fr: 'Bénin',
      en: 'Benin',
    },
    context: {
      fr: "Créée pour sensibiliser la société civile, les décideurs et les citoyens à l'urgence d'accélérer l'élimination du paludisme, cette initiative repose sur la mobilisation communautaire, la philanthropie et le plaidoyer de proximité.",
      en: 'Launched to mobilize civil society, policymakers, and citizens on the urgency of accelerating malaria elimination, this initiative relies on grassroots mobilization, philanthropy, and community advocacy.',
    },
    mission: {
      fr: 'Présidence des cérémonies officielles, mobilisation d’acteurs influents et de mécènes, plaidoyer auprès des médias pour le maintien de la lutte contre le paludisme au sommet des priorités de santé publique.',
      en: 'Chairing official galas, engaging influential partners and supporters, and advocating through media to keep malaria elimination at the top of the national public health agenda.',
    },
    quote: {
      fr: 'Tant qu’un enfant perdra la vie à cause d’une piqûre de moustique évitable, notre mobilisation citoyenne et philanthropique ne faiblira pas.',
      en: 'As long as a child loses their life to a preventable mosquito bite, our civic and philanthropic mobilization will never waver.',
    },
    metrics: [
      {
        value: '2021',
        label: {
          fr: 'Année de création sous le parrainage du Dr. Dagnon',
          en: 'Founding year under Dr. Dagnon’s patronage',
        },
      },
      {
        value: '50+',
        label: {
          fr: 'Personnalités et soignants distingués au total',
          en: 'Total health champions & dignitaries honored',
        },
      },
      {
        value: '100%',
        label: {
          fr: 'Engagement citoyen bénévole et philanthropique',
          en: 'Voluntary civic and philanthropic commitment',
        },
      },
    ],
    featuredPhotoIds: [
      'nuit-paludisme-1',
      'nuit-paludisme-4',
      'nuit-paludisme-5',
      'nuit-paludisme-2',
    ],
    allPhotoIds: [
      'nuit-paludisme-1',
      'nuit-paludisme-2',
      'nuit-paludisme-3',
      'nuit-paludisme-4',
      'nuit-paludisme-5',
    ],
  },
];
