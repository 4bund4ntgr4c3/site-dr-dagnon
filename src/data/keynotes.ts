export interface KeynoteChapter {
  time: string;
  title: { fr: string; en: string };
  summary: { fr: string; en: string };
}

export interface Keynote {
  id: string;
  conference: string;
  location: string;
  year: string;
  title: { fr: string; en: string };
  subtitle: { fr: string; en: string };
  audience: { fr: string; en: string };
  duration: string;
  chapters: KeynoteChapter[];
  quotes: {
    fr: string;
    en: string;
  }[];
  keyTakeaway: { fr: string; en: string };
}

export const KEYNOTES: Keynote[] = [
  {
    id: 'astmh-chicago-g2g',
    conference: 'ASTMH Annual Meeting',
    location: 'Chicago, USA',
    year: '2025',
    duration: '28 min',
    title: {
      fr: 'Passage à l’Échelle des Contrats Directs G2G & Moustiquaires Dual-AI en Afrique de l’Ouest',
      en: 'Scaling Direct G2G Awards & Dual-AI Nets Across Francophone West Africa',
    },
    subtitle: {
      fr: 'Plénière ministérielle sur l’efficacité des financements bilatéraux et la lutte antivectorielle',
      en: 'Ministerial plenary on bilateral financing efficiency and next-generation vector control',
    },
    audience: {
      fr: 'Chercheurs ASTMH, Directeurs USAID/PMI, Bailleurs multilatéraux',
      en: 'ASTMH Scientists, USAID/PMI Leadership, Global Donors',
    },
    chapters: [
      {
        time: '00:00',
        title: { fr: 'Introduction & Le Défi de la Résistance', en: 'Introduction & Resistance Challenge' },
        summary: {
          fr: 'Constat de l’épuisement des pyréthrinoïdes simples et nécessité d’une rupture méthodologique.',
          en: 'Overview of standard pyrethroid exhaustion and the need for programmatic disruption.',
        },
      },
      {
        time: '07:20',
        title: { fr: 'Architecture du Contrat Direct G2G au Bénin', en: 'Benin G2G Direct Contract Architecture' },
        summary: {
          fr: 'Démonstration du modèle fiduciaire sans intermédiaire et du décaissement indexé sur la performance.',
          en: 'Walkthrough of the zero-intermediary fiduciary framework with milestone-linked disbursements.',
        },
      },
      {
        time: '16:45',
        title: { fr: 'Résultats d’Impact : -45% de Morbidité Pédiatrique', en: 'Impact Evidence: -45% Pediatric Morbidity' },
        summary: {
          fr: 'Présentation des données épidémiologiques et de la réduction massive des hospitalisations.',
          en: 'Presentation of clinical epidemiology metrics and hospital admission reductions.',
        },
      },
      {
        time: '24:10',
        title: { fr: 'Perspectives : Modélisation Régionale 2030', en: 'Outlook: 2030 Regional Roadmap' },
        summary: {
          fr: 'Feuille de route pour l’adoption universelle des MILDA Chlorfenapyr dans 8 pays sahéliens.',
          en: 'Strategic roadmap for universal Chlorfenapyr net adoption across 8 Sahelian nations.',
        },
      },
    ],
    quotes: [
      {
        fr: 'Le financement direct d’État à État n’est pas seulement un mécanisme financier : c’est l’acte fondateur de la souveraineté sanitaire africaine.',
        en: 'Direct government-to-government financing is not merely a funding mechanism: it is the cornerstone of African health sovereignty.',
      },
    ],
    keyTakeaway: {
      fr: 'Combiner financements directs nationaux et technologies vectorielles de pointe réduit les coûts programmatiques de 18% tout en doublant l’impact pédiatrique.',
      en: 'Pairing direct national financing with cutting-edge vector technologies slashes overhead by 18% while doubling pediatric health gains.',
    },
  },
  {
    id: 'pamca-kigali-digitalization',
    conference: 'PAMCA Annual Conference',
    location: 'Kigali, Rwanda',
    year: '2024',
    duration: '22 min',
    title: {
      fr: 'Digitalisation des Campagnes MILDA : La Stratégie Zéro-Doublon au Bénin & Burundi',
      en: 'Digitalizing Mass LLIN Campaigns: The Zero-Ghost-Household Strategy in Benin & Burundi',
    },
    subtitle: {
      fr: 'Session spéciale sur la micro-planification SIG et la traçabilité des stocks en temps réel',
      en: 'Special keynote on GIS microplanning and real-time pharmaceutical stock reconciliation',
    },
    audience: {
      fr: 'Entomologistes africains, Cadres de ministères, Spécialistes DHIS2',
      en: 'African Entomologists, NMCP Teams, DHIS2 System Specialists',
    },
    chapters: [
      {
        time: '00:00',
        title: { fr: 'Les Failles du Dénombrement Papier Traditionnel', en: 'Flaws of Traditional Paper Enumeration' },
        summary: {
          fr: 'Analyse des distorsions démographiques et des déperditions d’intrants lors des campagnes historiques.',
          en: 'Analysis of demographic discrepancies and supply leakages in legacy paper campaigns.',
        },
      },
      {
        time: '06:15',
        title: { fr: 'Le Protocole Mobile & Découpage SIG', en: 'Mobile Protocols & GIS Mapping' },
        summary: {
          fr: 'Mise en œuvre des tablettes hors-ligne avec validation par géofencing des concessions.',
          en: 'Deploying offline-first mobile tablets with boundary polygon geofencing validation.',
        },
      },
      {
        time: '14:30',
        title: { fr: 'Génération de Coupons QR & Retrait Instantané', en: 'QR Voucher Generation & Real-time Redemption' },
        summary: {
          fr: 'Élimination des files d’attente et sécurisation de 100% de la chaîne de distribution.',
          en: 'Eliminating distribution queue delays and securing 100% supply chain custody.',
        },
      },
    ],
    quotes: [
      {
        fr: 'Sans données géolocalisées rigoureuses, même la meilleure moustiquaire du monde risque d’être distribuée au mauvais endroit.',
        en: 'Without rigorous geolocated data, even the most effective net in the world risks being delivered to the wrong place.',
      },
    ],
    keyTakeaway: {
      fr: 'La digitalisation intégrale élimine 98% des doublons et garantit une équité de distribution parfaite jusqu’au dernier kilomètre.',
      en: 'End-to-end campaign digitization eliminates 98% of ghost duplicates and ensures equitable last-mile delivery.',
    },
  },
];
