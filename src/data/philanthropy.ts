import type { Lang } from '@/i18n/lang';

export interface PhilanthropicImpactMetric {
  value: string;
  label: Record<Lang, string>;
}

export interface PhilanthropicEdition {
  id: string;
  albumKey: string;
  title: Record<Lang, string>;
  description: Record<Lang, string>;
  date: string;
  photoIds: string[];
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
  editions?: PhilanthropicEdition[];
}

export const PHILANTHROPIC_STATS: { value: string; label: Record<Lang, string> }[] = [
  {
    value: '5+',
    label: {
      fr: 'Éditions de la Nuit du Paludisme parrainées depuis 2021',
      en: 'Night Against Malaria editions sponsored since 2021',
    },
  },
  {
    value: '100+',
    label: {
      fr: 'Kits scolaires complets distribués aux enfants démunis',
      en: 'Complete school kits distributed to underserved children',
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
      fr: 'Acteurs de terrain, chercheurs & soignants honorés',
      en: 'Frontline health workers, researchers & actors honored',
    },
  },
];

export const PHILANTHROPIC_INITIATIVES: PhilanthropicInitiative[] = [
  {
    id: 'nuit-paludisme',
    albumKey: 'nuit-paludisme-5e',
    title: {
      fr: 'Santé Communautaire & Plaidoyer : La Nuit du Paludisme',
      en: 'Community Health & Advocacy: The Night Against Malaria',
    },
    subtitle: {
      fr: 'Parrain officiel et président d’honneur depuis la 1ère édition (2021) — Célébration des héros de la santé et mobilisation nationale contre le paludisme',
      en: 'Official patron and honorary president since the 1st edition (2021) — Celebrating health heroes and national mobilization against malaria',
    },
    partner: {
      name: 'ONG Icône 360° · Expertise France · Ministère de la Santé',
      role: {
        fr: 'Organisation citoyenne, coopération technique et autorité sanitaire',
        en: 'Civic organization, technical cooperation, and health authority',
      },
    },
    period: 'Depuis 2021 (Annuel)',
    location: {
      fr: 'Cotonou, Bénin',
      en: 'Cotonou, Benin',
    },
    context: {
      fr: "Créée en 2021 pour porter la voix des acteurs de première ligne et sensibiliser la nation à l'urgence de l'élimination du paludisme, La Nuit du Paludisme est le grand rendez-vous citoyen et institutionnel de santé publique au Bénin. Dès sa genèse, le Dr. Seynudé Dagnon en a accepté le parrainage exclusif et la présidence d'honneur, convaincu que la victoire contre la maladie exige de reconnaître les soignants et d'unir la société civile, les partenaires internationaux et le gouvernement.",
      en: 'Founded in 2021 to amplify the voice of frontline health actors and rally the nation behind malaria elimination, The Night Against Malaria is Benin’s premier civic and institutional public health gala. From its inception, Dr. Seynudé Dagnon has served as its official patron and honorary president, driven by the conviction that defeating malaria requires honoring frontline clinicians and bridging civil society, international agencies, and government.',
    },
    mission: {
      fr: "Présidence annuelle des cérémonies officielles, mobilisation de mécènes et de partenaires (Expertise France, Ministère de la Santé), remise solennelle de prix et d'attestations d'honneur aux médecins, chercheurs et agents de santé communautaire, et plaidoyer médiatique continu.",
      en: 'Annual presidency of official ceremonies, mobilizing sponsors and partners (Expertise France, Ministry of Health), solemn presentation of awards and honorary citations to physicians, researchers, and community health workers, alongside ongoing media advocacy.',
    },
    quote: {
      fr: 'Tant qu’un enfant ou une mère perdra la vie à cause du paludisme, notre mobilisation citoyenne ne faiblira pas. Être le parrain de cette grande œuvre depuis ses débuts est un engagement du cœur auprès de tous ceux qui luttent au quotidien.',
      en: 'As long as a child or a mother loses their life to malaria, our civic mobilization will never waver. Serving as patron of this great initiative since the beginning is a heartfelt commitment to all those fighting every day on the frontlines.',
    },
    metrics: [
      {
        value: '5+',
        label: {
          fr: 'Éditions annuelles célébrées et pérennisées',
          en: 'Annual editions celebrated and sustained',
        },
      },
      {
        value: '50+',
        label: {
          fr: 'Soignants et experts de terrain distingués',
          en: 'Frontline clinicians and experts honored',
        },
      },
      {
        value: '13',
        label: {
          fr: 'Photographies documentant les galas et distinctions',
          en: 'Photographs documenting galas and awards',
        },
      },
    ],
    featuredPhotoIds: [
      'nuit-paludisme-5e-1',
      'nuit-paludisme-5e-5',
      'nuit-paludisme-1',
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
      'nuit-paludisme-1',
      'nuit-paludisme-2',
      'nuit-paludisme-3',
      'nuit-paludisme-4',
      'nuit-paludisme-5',
    ],
    editions: [
      {
        id: 'nuit-paludisme-5e',
        albumKey: 'nuit-paludisme-5e',
        title: {
          fr: '5e Nuit du Paludisme (Juillet 2025) — Soirée de Gala & Célébration des Héros',
          en: '5th Night Against Malaria (July 2025) — Gala Evening & Celebrating Health Heroes',
        },
        description: {
          fr: 'Grand gala institutionnel réunissant Expertise France, le Ministère de la Santé et les partenaires techniques. Remise solennelle d’attestations d’honneur aux médecins et soignants de première ligne, allocution d’orientation stratégique du parrain Dr. Dagnon et photo de groupe des lauréats.',
          en: 'High-level institutional gala convening Expertise France, the Ministry of Health, and technical partners. Solemn presentation of honor certificates to frontline clinicians, strategic address by patron Dr. Dagnon, and group portrait of laureates.',
        },
        date: '2025-07-15',
        photoIds: [
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
          fr: 'Soirée de Gala & Parrainage Officiel — Hommage aux Acteurs de Terrain',
          en: 'Gala Evening & Official Patronage — Tribute to Frontline Champions',
        },
        description: {
          fr: 'Cérémonie officielle de remise de l’attestation de Parrain de la lutte contre le paludisme au Dr. Seynudé Dagnon par l’ONG Icône 360°, discours d’engagement civique, animations culturelles et hommages aux acteurs de terrain.',
          en: 'Official ceremony presenting the Malaria Fight Patron certificate to Dr. Seynudé Dagnon by NGO Icône 360°, civic engagement addresses, cultural ceremonies, and tributes to frontline actors.',
        },
        date: '2025-06-01',
        photoIds: [
          'nuit-paludisme-1',
          'nuit-paludisme-2',
          'nuit-paludisme-3',
          'nuit-paludisme-4',
          'nuit-paludisme-5',
        ],
      },
    ],
  },
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
];
