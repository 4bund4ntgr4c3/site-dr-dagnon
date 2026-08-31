export interface CountryPolicy {
  id: string;
  name: { fr: string; en: string };
  flag: string;
  population: string;
  netsType: { fr: string; en: string; status: 'optimal' | 'intermediate' | 'basic' };
  smcProtocol: { fr: string; en: string; status: 'optimal' | 'intermediate' | 'none' };
  dhis2Maturity: { fr: string; en: string; status: 'optimal' | 'intermediate' | 'basic' };
  g2gStatus: { fr: string; en: string; status: 'active' | 'in_progress' | 'planned' };
  vaccineRollout: { fr: string; en: string; status: 'active' | 'planned' | 'none' };
  dagnonRecommendation: { fr: string; en: string };
}

export const COUNTRY_BENCHMARKS: CountryPolicy[] = [
  {
    id: 'benin',
    name: { fr: 'Bénin', en: 'Benin' },
    flag: '🇧🇯',
    population: '13.7M',
    netsType: {
      fr: '100% Moustiquaires Nouvelle Génération (Dual-AI / PBO)',
      en: '100% Next-Gen Nets (Dual-AI / PBO)',
      status: 'optimal',
    },
    smcProtocol: {
      fr: '4 cycles étendus avec dénombrement géolocalisé',
      en: '4 extended cycles with geolocated enumeration',
      status: 'optimal',
    },
    dhis2Maturity: {
      fr: 'Nationalisé, traçabilité stocks temps réel',
      en: 'Fully nationalized, real-time stock monitoring',
      status: 'optimal',
    },
    g2gStatus: {
      fr: 'Contrat direct d’État à État actif (USAID / Ministère)',
      en: 'Active direct G2G award (USAID / Ministry)',
      status: 'active',
    },
    vaccineRollout: {
      fr: 'Vaccin R21 intégré au PEV de routine (14 districts)',
      en: 'R21 vaccine integrated into routine EPI (14 districts)',
      status: 'active',
    },
    dagnonRecommendation: {
      fr: 'Modèle pionnier : consolider le passage à 5 cycles de CPS dans le département de l’Atacora et exporter le framework G2G aux pays voisins.',
      en: 'Pioneer model: consolidate transition to 5 SMC cycles in Atacora department and export the G2G governance framework to regional neighbors.',
    },
  },
  {
    id: 'senegal',
    name: { fr: 'Sénégal', en: 'Senegal' },
    flag: '🇸🇳',
    population: '17.8M',
    netsType: {
      fr: 'Mixte PBO + Dual-AI dans le sud et l’est',
      en: 'Mixed PBO + Dual-AI in southern/eastern zones',
      status: 'optimal',
    },
    smcProtocol: {
      fr: '4 cycles complets avec stratification fine par district',
      en: '4 full cycles with fine subnational district stratification',
      status: 'optimal',
    },
    dhis2Maturity: {
      fr: 'DHIS2 intégré avec alertes PECADOM communautaires',
      en: 'Integrated DHIS2 with PECADOM community triggers',
      status: 'optimal',
    },
    g2gStatus: {
      fr: 'Accords directs partiels en gestion financière',
      en: 'Partial direct PFM agreements active',
      status: 'in_progress',
    },
    vaccineRollout: {
      fr: 'Phase pilote dans les zones à haute transmission',
      en: 'Pilot phase across high transmission zones',
      status: 'planned',
    },
    dagnonRecommendation: {
      fr: 'Accélérer la transition vers 100% de financement direct G2G pour les achats de MILDA et renforcer la surveillance transfrontalière avec la Gambie.',
      en: 'Accelerate transition to 100% direct G2G procurement for LLINs and bolster cross-border surveillance with The Gambia.',
    },
  },
  {
    id: 'burkina-faso',
    name: { fr: 'Burkina Faso', en: 'Burkina Faso' },
    flag: '🇧🇫',
    population: '22.7M',
    netsType: {
      fr: 'Dual-AI dans les districts à résistance extrême',
      en: 'Dual-AI in extreme resistance districts',
      status: 'optimal',
    },
    smcProtocol: {
      fr: '4 cycles massifs couvrant plus de 3.5 millions d’enfants',
      en: 'Massive 4 cycles covering over 3.5M children',
      status: 'optimal',
    },
    dhis2Maturity: {
      fr: 'Système centralisé avec défis de connectivité rurale',
      en: 'Centralized system with rural connectivity challenges',
      status: 'intermediate',
    },
    g2gStatus: {
      fr: 'Négociations pour contrats fiduciaires renforcés',
      en: 'Negotiations ongoing for reinforced fiduciary awards',
      status: 'in_progress',
    },
    vaccineRollout: {
      fr: 'Déploiement national R21 prioritaire en cours',
      en: 'Priority national R21 vaccine rollout underway',
      status: 'active',
    },
    dagnonRecommendation: {
      fr: 'Généraliser les applications mobiles hors-ligne (Offline-First) pour la CPS et synchroniser les campagnes de moustiquaires avec le Mali.',
      en: 'Scale offline-first mobile apps for SMC tracking and synchronize mass mosquito net campaigns with Mali.',
    },
  },
  {
    id: 'cote-ivoire',
    name: { fr: 'Côte d’Ivoire', en: 'Ivory Coast' },
    flag: '🇨🇮',
    population: '29.3M',
    netsType: {
      fr: 'Transition progressive vers PBO et Chlorfenapyr',
      en: 'Progressive transition to PBO and Chlorfenapyr',
      status: 'intermediate',
    },
    smcProtocol: {
      fr: 'Déployé dans le nord sahélien (Savanes, Denguélé)',
      en: 'Deployed in northern savannah belts',
      status: 'intermediate',
    },
    dhis2Maturity: {
      fr: 'DHIS2 étendu avec intégration du secteur privé',
      en: 'Expanded DHIS2 with private clinic integration',
      status: 'optimal',
    },
    g2gStatus: {
      fr: 'Mécanismes bilatéraux en cours d’évaluation',
      en: 'Bilateral direct funding under assessment',
      status: 'planned',
    },
    vaccineRollout: {
      fr: 'Lancement du vaccin R21 dans 38 districts sanitaires',
      en: 'R21 vaccine launched across 38 health districts',
      status: 'active',
    },
    dagnonRecommendation: {
      fr: 'Étendre la CPS aux enfants de 5 à 10 ans dans le nord et sanctuariser la traçabilité des intrants contre les ruptures de stock.',
      en: 'Expand SMC to children aged 5 to 10 in northern belts and establish end-to-end stock visibility to prevent stockouts.',
    },
  },
  {
    id: 'burundi',
    name: { fr: 'Burundi', en: 'Burundi' },
    flag: '🇧🇮',
    population: '13.2M',
    netsType: {
      fr: 'Campagne universelle numérisée (PBO / Dual-AI)',
      en: 'Universal digitized campaign (PBO / Dual-AI)',
      status: 'optimal',
    },
    smcProtocol: {
      fr: 'Transmission pérenne : pas de CPS saisonnière',
      en: 'Perennial transmission: SMC not indicated',
      status: 'none',
    },
    dhis2Maturity: {
      fr: 'Micro-planification SIG nationale et suivi GPS',
      en: 'National GIS microplanning and GPS tracking',
      status: 'optimal',
    },
    g2gStatus: {
      fr: 'Appui direct aux structures sanitaires publiques',
      en: 'Direct assistance to public health structures',
      status: 'in_progress',
    },
    vaccineRollout: {
      fr: 'Préparation du plan d’introduction vaccinale',
      en: 'Vaccine introduction roadmap in preparation',
      status: 'planned',
    },
    dagnonRecommendation: {
      fr: 'Capitaliser sur la digitalisation exemplaire des campagnes pour automatiser la surveillance épidémique dans les provinces des hauts plateaux.',
      en: 'Leverage the exemplary campaign digitalization to automate epidemic outbreak surveillance across highland provinces.',
    },
  },
  {
    id: 'nigeria',
    name: { fr: 'Nigéria', en: 'Nigeria' },
    flag: '🇳🇬',
    population: '223M',
    netsType: {
      fr: 'Mixte selon les États (Dual-AI dans les foyers critiques)',
      en: 'State-specific mix (Dual-AI in hotspot states)',
      status: 'intermediate',
    },
    smcProtocol: {
      fr: 'Plus grand programme mondial de CPS (> 25M d’enfants)',
      en: 'World’s largest SMC program (> 25M children)',
      status: 'optimal',
    },
    dhis2Maturity: {
      fr: 'DHIS2 fédéré au niveau fédéral et des 36 États',
      en: 'Federated DHIS2 across federal & 36 states',
      status: 'intermediate',
    },
    g2gStatus: {
      fr: 'Mécanismes décentralisés par État',
      en: 'Decentralized state-level award frameworks',
      status: 'in_progress',
    },
    vaccineRollout: {
      fr: 'Priorisation dans les États du Nord (Kano, Kebbi, Sokoto)',
      en: 'Prioritization in northern states (Kano, Kebbi, Sokoto)',
      status: 'active',
    },
    dagnonRecommendation: {
      fr: 'Harmoniser les protocoles de dénombrement numérique entre États frontaliers avec le Bénin et le Niger pour éliminer les zones d’ombre.',
      en: 'Harmonize digital enumeration protocols across border states with Benin and Niger to eliminate surveillance blindspots.',
    },
  },
];
