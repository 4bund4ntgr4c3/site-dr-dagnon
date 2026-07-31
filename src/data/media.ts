import type { Lang } from '@/i18n/lang';

export type MediaType = 'video' | 'image' | 'document';
export type MediaCategory = 'interview' | 'conference' | 'speaking' | 'press' | 'community';

export interface MediaEntry {
  id: string;
  type: MediaType;
  category: MediaCategory;
  subType?: string;
  date: string;
  title: Record<Lang, string>;
  /** One-sentence factual summary, shown on the card — press articles only. */
  description?: Record<Lang, string>;
  youtubeId?: string;
  thumb?: string;
  src?: string;
  url?: string;
  fileLabel?: Record<Lang, string>;
}

export const MEDIA_ITEMS: MediaEntry[] = [
  // ── Interviews ───────────────────────────────────────────────────
  {
    id: 'interview-health-financing',
    type: 'video',
    category: 'interview',
    date: '2026-06-17',
    title: {
      fr: 'Interview — Financement de la santé et paludisme',
      en: 'Interview — Health financing on malaria',
    },
    youtubeId: '5yh0ODmp47s',
    thumb: 'https://img.youtube.com/vi/5yh0ODmp47s/hqdefault.jpg',
  },
  {
    id: 'canal3-benin-2022',
    type: 'video',
    category: 'interview',
    date: '2023-01-26',
    title: {
      fr: 'Canal 3 Bénin — Mai 2022',
      en: 'Canal 3 Benin — May 2022',
    },
    youtubeId: 'JmhHzsW9bVs',
    thumb: 'https://img.youtube.com/vi/JmhHzsW9bVs/hqdefault.jpg',
  },
  // ── Presentation & Conference ────────────────────────────────────
  {
    id: 'mim-2024',
    type: 'video',
    category: 'conference',
    date: '2024-04-25',
    title: {
      fr: 'Initiative multilatérale pour le paludisme 2024',
      en: 'Multilateral Initiative for Malaria 2024',
    },
    youtubeId: 'D8kTMA4dDyg',
    thumb: 'https://img.youtube.com/vi/D8kTMA4dDyg/hqdefault.jpg',
  },
  {
    id: 'astmh-2022',
    type: 'video',
    category: 'conference',
    date: '2022-11-09',
    title: {
      fr: 'ASTMH 2022 — Durabilité des moustiquaires imprégnées',
      en: 'ASTMH 2022 — LLIN durability monitoring',
    },
    youtubeId: 'skmrswZhGZE',
    thumb: 'https://img.youtube.com/vi/skmrswZhGZE/hqdefault.jpg',
  },
  {
    id: 'cs4me-2022',
    type: 'video',
    category: 'conference',
    date: '2022-09-10',
    title: {
      fr: 'Keynote — Société civile pour l\'élimination du paludisme',
      en: 'Keynote — Civil society for malaria elimination (CS4ME)',
    },
    youtubeId: 'ZjznHt_dAaU',
    thumb: 'https://img.youtube.com/vi/ZjznHt_dAaU/hqdefault.jpg',
  },
  {
    id: 'covid19-webinar',
    type: 'video',
    category: 'conference',
    date: '2021-08-15',
    title: {
      fr: 'Intervenant — Webinaire COVID-19 BFLAPE Bénin',
      en: 'Speaker — COVID-19 webinar BFLAPE Benin',
    },
    youtubeId: 'S01-Mv1eors',
    thumb: 'https://img.youtube.com/vi/S01-Mv1eors/hqdefault.jpg',
  },
  // ── Public Speaking ──────────────────────────────────────────────
  {
    id: 'harvard-sdm',
    type: 'video',
    category: 'speaking',
    date: '2026-06-17',
    title: {
      fr: 'Discours — Harvard SDM, cours sur le paludisme',
      en: 'Speech — Harvard SDM malaria course',
    },
    youtubeId: '7zuqZfH4bzQ',
    thumb: 'https://img.youtube.com/vi/7zuqZfH4bzQ/hqdefault.jpg',
  },
  {
    id: 'gates-benin-2023',
    type: 'video',
    category: 'speaking',
    date: '2023-12-12',
    title: {
      fr: 'Réunion Fondation Gates — Paludisme au Bénin, 12 déc. 2023',
      en: 'Gates Foundation meeting — Malaria in Benin, Dec 12 2023',
    },
    youtubeId: '2mNE0Bx0A3o',
    thumb: 'https://img.youtube.com/vi/2mNE0Bx0A3o/hqdefault.jpg',
  },
  {
    id: 'bmgf-partners-2022',
    type: 'video',
    category: 'speaking',
    date: '2022-12-01',
    title: {
      fr: 'Partenaires BMGF — Réunion paludisme Bénin 2022',
      en: 'BMGF partners — Malaria meeting Benin 2022',
    },
    youtubeId: 'vHxKgLVdyQ4',
    thumb: 'https://img.youtube.com/vi/vHxKgLVdyQ4/hqdefault.jpg',
  },
  {
    id: 'pamca-2022',
    type: 'video',
    category: 'speaking',
    date: '2022-09-28',
    title: {
      fr: 'Discours d\'ouverture — 8e conférence PAMCA',
      en: 'Opening speech — 8th PAMCA conference',
    },
    youtubeId: 'ZTW9HqJ57kA',
    thumb: 'https://img.youtube.com/vi/ZTW9HqJ57kA/hqdefault.jpg',
  },
  {
    id: 'cameroon-2022',
    type: 'video',
    category: 'speaking',
    date: '2022-03-01',
    title: {
      fr: 'Discours — Lancement campagne Stop Paludisme au Cameroun',
      en: 'Speech — Stop Malaria Campaign launch in Cameroon',
    },
    youtubeId: 'dxBGiEW41aM',
    thumb: 'https://img.youtube.com/vi/dxBGiEW41aM/hqdefault.jpg',
  },
  {
    id: 'usaid-smc-2019',
    type: 'video',
    category: 'speaking',
    date: '2019-06-01',
    title: {
      fr: 'USAID Bénin — Lancement de la campagne SMC',
      en: 'USAID Benin — SMC campaign launch',
    },
    youtubeId: 'rmEXxvOC2S4',
    thumb: 'https://img.youtube.com/vi/rmEXxvOC2S4/hqdefault.jpg',
  },
  {
    id: 'census-kandi-2017',
    type: 'video',
    category: 'speaking',
    date: '2017-09-01',
    title: {
      fr: 'Lancement du recensement ménager à Kandi',
      en: 'Household census launch in Kandi',
    },
    youtubeId: 'EZbXBNsjdpQ',
    thumb: 'https://img.youtube.com/vi/EZbXBNsjdpQ/hqdefault.jpg',
  },
  {
    id: 'irs-2018',
    type: 'video',
    category: 'speaking',
    date: '2018-04-01',
    title: {
      fr: 'Lancement de la campagne IRS 2018',
      en: 'IRS campaign launch 2018',
    },
    youtubeId: 'PmGRAr1EyGk',
    thumb: 'https://img.youtube.com/vi/PmGRAr1EyGk/hqdefault.jpg',
  },
  // ── Press ────────────────────────────────────────────────────────
  {
    id: 'airid-welcome-2026',
    type: 'document',
    category: 'press',
    date: '2026-07-21',
    title: {
      fr: 'AIRID accueille le Dr. Seynudé Jean-Fortuné Dagnon de la Fondation Gates',
      en: 'AIRID welcomes Dr. Seynudé Jean-Fortuné Dagnon from the Gates Foundation',
    },
    description: { fr: 'L\'AIRID a accueilli le Dr Dagnon pour une visite axée sur le renforcement des partenariats de recherche et l\'innovation scientifique au service de la santé au Bénin.', en: 'AIRID hosted Dr. Dagnon for a visit centered on strengthening research partnerships and advancing scientific innovation for health outcomes in Benin.' },
    url: 'https://airid-africa.com/public/news/28-airid-welcomes-dr-seynude-jean-fortune-dagnon-from-the-gates-foundation',
    thumb: 'https://airid-africa.com/public/assets/news/1784645757_6a5f887df2de0_10.jpg',
    fileLabel: { fr: 'Article · AIRID Africa', en: 'Article · AIRID Africa' },
  },
  {
    id: 'oped-ahw-2026',
    type: 'document',
    category: 'press',
    date: '2026-05-01',
    title: {
      fr: 'Tribune — Du contrôle à l\'élimination du paludisme',
      en: 'Op-ed — From malaria control to elimination',
    },
    description: { fr: 'Tribune plaidant pour un passage, en Afrique, de la gestion des flambées de paludisme à l\'arrêt définitif de la transmission, via des stratégies équitables et pilotées localement.', en: 'Op-ed arguing that African nations must shift from managing malaria outbreaks to permanently ending transmission, through equity-focused, locally-led strategies.' },
    url: 'https://africahealthwatch.com/from-malaria-control-to-elimination-the-turn-we-need-to-make/',
    thumb: 'https://africahealthwatch.com/wp-content/uploads/2026/01/Africa-Health-Watch-1024x824.png',
    fileLabel: { fr: 'Article · Africa Health Watch', en: 'Article · Africa Health Watch' },
  },
  {
    id: 'seneweb-data-2026',
    type: 'document',
    category: 'press',
    date: '2026-05-12',
    title: {
      fr: 'Systèmes sanitaires africains : la bataille stratégique des données au cœur des politiques de survie',
      en: 'African health systems: the strategic battle for data at the heart of survival policies',
    },
    description: { fr: 'Relate une rencontre à Dakar où des experts de la Fondation Gates ont souligné que des données de santé fiables sont indispensables au suivi des maladies et à l\'allocation des ressources, le Sénégal s\'imposant comme un leader régional.', en: 'Reports from a Dakar meeting where Gates Foundation experts stressed that reliable health data is essential to disease tracking and resource allocation, with Senegal emerging as a regional leader.' },
    url: 'https://www.seneweb.com/en/news/24/systemes-sanitaires-africains-la-bataille-strategique-des-donnees-au-coeur-des-politiques-de-survie-1_n_492306.html',
    thumb: 'https://image.seneweb.com/content/news/2026-20-12//thumb_1260x800_6a03084b80aed_oftrk0p0cQ.jpg',
    fileLabel: { fr: 'Article · Seneweb', en: 'Article · Seneweb' },
  },
  {
    id: 'smc-alliance-2026',
    type: 'document',
    category: 'press',
    date: '2026-02-28',
    title: {
      fr: 'Présentations — Réunion annuelle conjointe SMC 2026',
      en: 'Presentations — Joint SMC Annual Meeting 2026',
    },
    description: { fr: 'Présentations de la première réunion conjointe SMC Alliance / Alliance for Malaria Prevention à Kampala, portant sur la digitalisation des campagnes, l\'optimisation des coûts et les stratégies de chimioprévention.', en: 'Presentations from the first joint SMC Alliance / Alliance for Malaria Prevention meeting in Kampala, covering campaign digitalization, cost optimization and chemoprevention strategies.' },
    url: 'https://www.smc-alliance.org/smc-resources/joint-smc-amp-annual-meetings-2026-presentations',
    fileLabel: { fr: 'Présentation · SMC Alliance', en: 'Presentation · SMC Alliance' },
  },
  {
    id: 'bluesquare-2026',
    type: 'document',
    category: 'press',
    date: '2026-03-31',
    title: {
      fr: 'Structurer l\'utilisation des données dans la lutte contre le paludisme au Burundi',
      en: 'Structuring data use in the fight against malaria in Burundi',
    },
    description: { fr: 'Présente l\'appui de Bluesquare au ministère de la Santé du Burundi pour la mise en place d\'un entrepôt national de données paludisme, dans le cadre du projet Malariya Pi financé par la Fondation Gates et la Belgique.', en: 'Covers Bluesquare\'s support for Burundi\'s Ministry of Health in building a national malaria data warehouse under the Gates- and Belgium-funded Malariya Pi project.' },
    url: 'https://www.bluesquarehub.com/fr/bluesquare-news-structurer-lutilisation-des-donnees-dans-la-lutte-contre-le-paludisme-au-burundi/',
    thumb: 'https://www.bluesquarehub.com/wp-content/uploads/2026/04/1774973041604.jpeg',
    fileLabel: { fr: 'Article · Bluesquare', en: 'Article · Bluesquare' },
  },
  {
    id: 'lebledparle-2022',
    type: 'document',
    category: 'press',
    date: '2022-03-07',
    title: {
      fr: 'Le Cameroun et la fondation Bill & Mélinda Gates s\'accordent sur la lutte contre le paludisme',
      en: 'Cameroon and the Bill & Melinda Gates Foundation agree on malaria fight',
    },
    description: { fr: 'Relate la rencontre entre le ministère de la Santé du Cameroun et la Fondation Gates pour renforcer le programme national de lutte contre le paludisme.', en: 'Reports on Cameroon\'s Ministry of Health meeting with the Gates Foundation to strengthen the national malaria control program.' },
    url: 'https://www.lebledparle.com/le-cameroun-et-la-fondation-bill-melinda-gates-s-accordent-sur-la-lutte-contre-le-paludisme/',
    thumb: 'https://www.lebledparle.com/wp-content/uploads/2020/09/Bill.jpg',
    fileLabel: { fr: 'Article · Lebledparle', en: 'Article · Lebledparle' },
  },
  {
    id: 'stopblablacam-2022',
    type: 'document',
    category: 'press',
    date: '2022-03-07',
    title: {
      fr: 'Lutte contre le paludisme : le gouvernement et la fondation Bill & Melinda Gates s\'accordent',
      en: 'Malaria fight: government and Bill & Melinda Gates Foundation agree',
    },
    description: { fr: 'Le ministre camerounais Malachie Manaouda et le Dr Dagnon de la Fondation Gates ont évoqué le renforcement de la surveillance et des données ; l\'OMS a demandé un accès rapide aux traitements et une place dans la distribution du futur vaccin.', en: 'Cameroon\'s health minister Malachie Manaouda and Dr. Dagnon of the Gates Foundation discussed strengthening surveillance and data systems; WHO called for faster treatment access and future vaccine allocation for Cameroon.' },
    url: 'https://www.stopblablacam.com/societe/0703-8389-lutte-contre-le-paludisme-le-gouvernement-et-la-fondation-bill-melinda-gates-s-accordent',
    thumb: 'https://www.stopblablacam.com/media/k2/items/cache/ad30481943e896916174a77f4c826900_L.jpg',
    fileLabel: { fr: 'Article · StopBlaBlaCam', en: 'Article · StopBlaBlaCam' },
  },
  {
    id: 'stopblablacam-en-2022',
    type: 'document',
    category: 'press',
    date: '2022-03-07',
    title: {
      fr: 'Paludisme : le Cameroun et la fondation Bill & Melinda Gates discutent de la meilleure stratégie d\'éradication',
      en: 'Malaria: Cameroon, Bill & Melinda Gates discuss best eradication strategy',
    },
    description: { fr: 'La Fondation Gates s\'est engagée à soutenir le programme de lutte contre le paludisme du Cameroun — renforcement de la surveillance et des données — tandis que l\'OMS a réclamé un accès plus rapide aux traitements et une place dans la distribution du futur vaccin.', en: 'The Gates Foundation pledged support for Cameroon\'s malaria control program — bolstering surveillance and data systems — while WHO pressed for faster treatment access and future vaccine allocation.' },
    url: 'https://www.stopblablacam.com/society/0703-8390-malaria-cameroon-bill-melinda-gates-discuss-best-eradication-strategy',
    thumb: 'https://www.stopblablacam.com/media/k2/items/cache/ad30481943e896916174a77f4c826900_L.jpg',
    fileLabel: { fr: 'Article · StopBlaBlaCam', en: 'Article · StopBlaBlaCam' },
  },
  {
    id: 'minsante-2022',
    type: 'document',
    category: 'press',
    date: '2022-03-23',
    title: {
      fr: 'L\'élimination du paludisme au centre des échanges entre le Minsanté et la Fondation Gates',
      en: 'Malaria elimination at the center of exchanges between Minsante and Gates Foundation',
    },
    description: { fr: 'Le ministère camerounais de la Santé a annoncé une campagne de mobilisation du secteur privé contre le paludisme, lancée le 10 mars 2022 sous le patronage de la Première dame Chantal Biya, à l\'issue d\'échanges avec la Fondation Gates sur la surveillance et les données.', en: 'Cameroon\'s Ministry of Health announced a private-sector malaria campaign launching March 10, 2022 under First Lady Chantal Biya\'s patronage, following talks with the Gates Foundation on surveillance and data.' },
    url: 'https://www.minsante.cm/site/?q=en/node/4224',
    thumb: 'https://www.minsante.cm/site/sites/default/files/styles/slider__af_/public/field/image/fondation%20Bill%20melinda%20gate.png',
    fileLabel: { fr: 'Article · Minsante', en: 'Article · Minsante' },
  },
  {
    id: 'usaid-60th-2020',
    type: 'video',
    category: 'press',
    date: '2020-12-01',
    title: {
      fr: 'Dr. Dagnon — USAID Bénin, 60e anniversaire',
      en: 'Dr. Dagnon — USAID Benin 60th Anniversary',
    },
    youtubeId: 'UoMp2gsHbkQ',
    thumb: 'https://img.youtube.com/vi/UoMp2gsHbkQ/hqdefault.jpg',
  },
  // ── Community — Night Against Malaria ────────────────────────────
  {
    id: 'nuit-paludisme-1',
    type: 'image',
    category: 'community',
    subType: 'malaria-night',
    date: '2025-06-01',
    title: {
      fr: 'La Nuit du Paludisme — Gala Icône 360, portrait officiel',
      en: 'Night Against Malaria — Icône 360 gala, official portrait',
    },
    src: '/community/nuit-paludisme-1.webp',
  },
  {
    id: 'nuit-paludisme-2',
    type: 'image',
    category: 'community',
    subType: 'malaria-night',
    date: '2025-06-01',
    title: {
      fr: 'La Nuit du Paludisme — Gala Icône 360, avec invités',
      en: 'Night Against Malaria — Icône 360 gala, with guests',
    },
    src: '/community/nuit-paludisme-2.webp',
  },
  {
    id: 'nuit-paludisme-3',
    type: 'image',
    category: 'community',
    subType: 'malaria-night',
    date: '2025-06-01',
    title: {
      fr: 'La Nuit du Paludisme — Discours et animations',
      en: 'Night Against Malaria — Speeches and ceremonies',
    },
    src: '/community/nuit-paludisme-3.webp',
  },
  {
    id: 'nuit-paludisme-4',
    type: 'image',
    category: 'community',
    subType: 'malaria-night',
    date: '2025-06-01',
    title: {
      fr: 'La Nuit du Paludisme — Remise de prix Icône 360',
      en: 'Night Against Malaria — Icône 360 awards ceremony',
    },
    src: '/community/nuit-paludisme-4.webp',
  },
  {
    id: 'nuit-paludisme-5',
    type: 'image',
    category: 'community',
    subType: 'malaria-night',
    date: '2025-06-01',
    title: {
      fr: 'Parrain de la lutte contre le paludisme — Attestation Icône 360 / Expertise France',
      en: 'Malaria fight godfather — Icône 360 / Expertise France attestation',
    },
    src: '/community/nuit-paludisme-5.webp',
  },
  // ── Community — 5e Nuit du Paludisme (Icône 360°) ──────────────
  {
    id: 'nuit-paludisme-5e-1',
    type: 'image',
    category: 'community',
    subType: 'nuit-paludisme-5e',
    date: '2025-07-15',
    title: {
      fr: '5e Nuit du Paludisme — Portrait officiel du Dr. Dagnon',
      en: '5th Night Against Malaria — Dr. Dagnon official portrait',
    },
    src: '/community/nuit-paludisme-5e-1.webp',
  },
  {
    id: 'nuit-paludisme-5e-2',
    type: 'image',
    category: 'community',
    subType: 'nuit-paludisme-5e',
    date: '2025-07-15',
    title: {
      fr: '5e Nuit du Paludisme — Échange avec un invité d\'honneur',
      en: '5th Night Against Malaria — Conversation with a guest of honor',
    },
    src: '/community/nuit-paludisme-5e-2.webp',
  },
  {
    id: 'nuit-paludisme-5e-3',
    type: 'image',
    category: 'community',
    subType: 'nuit-paludisme-5e',
    date: '2025-07-15',
    title: {
      fr: '5e Nuit du Paludisme — Photo avec partenaire Expertise France',
      en: '5th Night Against Malaria — Photo with Expertise France partner',
    },
    src: '/community/nuit-paludisme-5e-3.webp',
  },
  {
    id: 'nuit-paludisme-5e-4',
    type: 'image',
    category: 'community',
    subType: 'nuit-paludisme-5e',
    date: '2025-07-15',
    title: {
      fr: '5e Nuit du Paludisme — Photo avec invitée',
      en: '5th Night Against Malaria — Photo with guest',
    },
    src: '/community/nuit-paludisme-5e-4.webp',
  },
  {
    id: 'nuit-paludisme-5e-5',
    type: 'image',
    category: 'community',
    subType: 'nuit-paludisme-5e',
    date: '2025-07-15',
    title: {
      fr: '5e Nuit du Paludisme — Remise d\'attestation à Dr. Christiane Lokossou Dossouho',
      en: '5th Night Against Malaria — Attestation presented to Dr. Christiane Lokossou Dossouho',
    },
    src: '/community/nuit-paludisme-5e-5.webp',
  },
  {
    id: 'nuit-paludisme-5e-6',
    type: 'image',
    category: 'community',
    subType: 'nuit-paludisme-5e',
    date: '2025-07-15',
    title: {
      fr: '5e Nuit du Paludisme — Remise d\'attestation à Dr. Cédric Gandondoudjro',
      en: '5th Night Against Malaria — Attestation presented to Dr. Cédric Gandondoudjro',
    },
    src: '/community/nuit-paludisme-5e-6.webp',
  },
  {
    id: 'nuit-paludisme-5e-7',
    type: 'image',
    category: 'community',
    subType: 'nuit-paludisme-5e',
    date: '2025-07-15',
    title: {
      fr: '5e Nuit du Paludisme — Discours du parrain Dr. Dagnon',
      en: '5th Night Against Malaria — Speech by patron Dr. Dagnon',
    },
    src: '/community/nuit-paludisme-5e-7.webp',
  },
  {
    id: 'nuit-paludisme-5e-8',
    type: 'image',
    category: 'community',
    subType: 'nuit-paludisme-5e',
    date: '2025-07-15',
    title: {
      fr: '5e Nuit du Paludisme — Photo de groupe des lauréats, soirée de gala',
      en: '5th Night Against Malaria — Group photo of awardees, gala evening',
    },
    src: '/community/nuit-paludisme-5e-8.webp',
  },
  // ── Community — School Kits Distribution ─────────────────────────
  {
    id: 'philantropie-1',
    type: 'image',
    category: 'community',
    subType: 'school-kits',
    date: '2025-07-01',
    title: {
      fr: 'Distribution de fournitures scolaires — ONG Reel Concept & Plus',
      en: 'School kits distribution — ONG Reel Concept & Plus',
    },
    src: '/community/philantropie-1.webp',
  },
  {
    id: 'philantropie-2',
    type: 'image',
    category: 'community',
    subType: 'school-kits',
    date: '2025-07-01',
    title: {
      fr: 'Aide aux enfants démunis — ONG Reel Concept & Plus',
      en: 'Support for underprivileged children — ONG Reel Concept & Plus',
    },
    src: '/community/philantropie-2.webp',
  },
  {
    id: 'philantropie-3',
    type: 'image',
    category: 'community',
    subType: 'school-kits',
    date: '2025-07-01',
    title: {
      fr: 'Soutien scolaire communautaire',
      en: 'Community education support',
    },
    src: '/community/philantropie-3.webp',
  },
  {
    id: 'philantropie-4',
    type: 'image',
    category: 'community',
    subType: 'school-kits',
    date: '2025-07-01',
    title: {
      fr: 'Distribution de livres et fournitures',
      en: 'Books and supplies distribution',
    },
    src: '/community/philantropie-4.webp',
  },
  {
    id: 'philantropie-5',
    type: 'image',
    category: 'community',
    subType: 'school-kits',
    date: '2025-07-01',
    title: {
      fr: 'Équipe ONG Reel Concept & Plus et partenaires',
      en: 'ONG Reel Concept & Plus team and partners',
    },
    src: '/community/philantropie-5.webp',
  },
  {
    id: 'philantropie-6',
    type: 'image',
    category: 'community',
    subType: 'school-kits',
    date: '2025-07-01',
    title: {
      fr: 'Collaboration communautaire et solidarité',
      en: 'Community collaboration and solidarity',
    },
    src: '/community/philantropie-6.webp',
  },
  {
    id: 'philantropie-7',
    type: 'image',
    category: 'community',
    subType: 'school-kits',
    date: '2025-07-01',
    title: {
      fr: 'Enfants heureux avec leurs fournitures scolaires',
      en: 'Happy children with school supplies',
    },
    src: '/community/philantropie-7.webp',
  },
  // ── Community — Génies en Herbe ─────────────────────────────────
  {
    id: 'genies-1',
    type: 'image',
    category: 'community',
    subType: 'genies',
    date: '2025-01-01',
    title: {
      fr: 'Génies en Herbe — Édition Dr. Seynudé Fortuné Dagnon, cérémonie de remise des prix',
      en: 'Génies en Herbe — Dr. Seynudé Fortuné Dagnon edition, awards ceremony',
    },
    src: '/community/genies-1.webp',
  },
  {
    id: 'genies-2',
    type: 'image',
    category: 'community',
    subType: 'genies',
    date: '2025-01-01',
    title: {
      fr: 'Génies en Herbe — Prix du meilleur marqueur',
      en: 'Génies en Herbe — Best scorer award',
    },
    src: '/community/genies-2.webp',
  },
  {
    id: 'genies-3',
    type: 'image',
    category: 'community',
    subType: 'genies',
    date: '2025-01-01',
    title: {
      fr: 'Génies en Herbe — Dr. Dagnon avec les lauréats',
      en: 'Génies en Herbe — Dr. Dagnon with winners',
    },
    src: '/community/genies-3.webp',
  },
  {
    id: 'genies-4',
    type: 'image',
    category: 'community',
    subType: 'genies',
    date: '2025-01-01',
    title: {
      fr: 'Génies en Herbe — Remise du chèque de 100 000 FCFA',
      en: 'Génies en Herbe — Presentation of 100,000 FCFA check',
    },
    src: '/community/genies-4.webp',
  },
  {
    id: 'genies-5',
    type: 'image',
    category: 'community',
    subType: 'genies',
    date: '2025-01-01',
    title: {
      fr: 'Génies en Herbe — Équipe participante et Dr. Dagnon',
      en: 'Génies en Herbe — Participating team and Dr. Dagnon',
    },
    src: '/community/genies-5.webp',
  },
  {
    id: 'genies-6',
    type: 'image',
    category: 'community',
    subType: 'genies',
    date: '2025-01-01',
    title: {
      fr: 'Génies en Herbe — Photo de groupe avec les étudiants',
      en: 'Génies en Herbe — Group photo with students',
    },
    src: '/community/genies-6.webp',
  },
];
