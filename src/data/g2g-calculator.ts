import type { Lang } from '@/i18n/lang';

export interface G2GReadinessTier {
  id: string;
  name: Record<Lang, string>;
  description: Record<Lang, string>;
  overheadSavingsRate: number; // 0.18 - 0.22
  auditFeeRate: number; // 0.035
  fiduciaryRiskRating: 'Low' | 'Medium' | 'Controlled';
}

export const G2G_READINESS_TIERS: G2GReadinessTier[] = [
  {
    id: 'tier-1-nupas-certified',
    name: {
      fr: 'Niveau 1 : Pré-Certification NUPAS Complète (Modèle Bénin)',
      en: 'Tier 1: Full NUPAS Pre-Certification (Benin Model)',
    },
    description: {
      fr: 'Ministère doté d’un manuel de procédures pré-audité, d’un compte séquestre au Trésor et d’un DHIS2 national à >90% de complétude.',
      en: 'Ministry with pre-audited financial procedures manual, dedicated Treasury sub-account, and national DHIS2 reporting >90%.',
    },
    overheadSavingsRate: 0.20,
    auditFeeRate: 0.032,
    fiduciaryRiskRating: 'Low',
  },
  {
    id: 'tier-2-hybrid-escrow',
    name: {
      fr: 'Niveau 2 : Compte Séquestre Conjoint & Co-Signature',
      en: 'Tier 2: Joint Escrow Sub-Account & Co-Signature',
    },
    description: {
      fr: 'Décaissements conditionnés par double signature (Ministère / Représentant Bailleur) avec assistance technique fiduciaire intégrée.',
      en: 'Disbursements governed by dual-signature (Ministry / Donor Lead) with embedded fiduciary technical assistance.',
    },
    overheadSavingsRate: 0.16,
    auditFeeRate: 0.045,
    fiduciaryRiskRating: 'Controlled',
  },
  {
    id: 'tier-3-phased-transition',
    name: {
      fr: 'Niveau 3 : Transition Progressive & Justification Dématérialisée',
      en: 'Tier 3: Phased Transition & Digital Cloud Voucher System',
    },
    description: {
      fr: 'Phase d’amorçage avec archivage électronique en temps réel des pièces comptables et audits trimestriels.',
      en: 'Initial incubation phase with real-time digital expenditure archiving and quarterly rolling audits.',
    },
    overheadSavingsRate: 0.12,
    auditFeeRate: 0.055,
    fiduciaryRiskRating: 'Medium',
  },
];

export interface DliMilestone {
  month: number;
  title: Record<Lang, string>;
  requirement: Record<Lang, string>;
  disbursementShare: string;
}

export const G2G_DLI_MILESTONES: DliMilestone[] = [
  {
    month: 6,
    title: {
      fr: 'Jalon 1 : Sancturisation du Compte & Audit Initial',
      en: 'Milestone 1: Dedicated Treasury Sub-Account & Baseline Audit',
    },
    requirement: {
      fr: 'Validation du compte séquestre au Trésor Public et alignement du manuel de procédures comptables certifié NUPAS.',
      en: 'Approval of dedicated Treasury sub-account and adoption of NUPAS-certified financial SOP manual.',
    },
    disbursementShare: '25% des fonds',
  },
  {
    month: 12,
    title: {
      fr: 'Jalon 2 : Complétude des Données Sanitaires (>90%)',
      en: 'Milestone 2: Health Facility DHIS2 Data Completeness (>90%)',
    },
    requirement: {
      fr: 'Transmission électronique mensuelle des rapports épidémiologiques par plus de 90% des centres de santé du pays.',
      en: 'Timely monthly electronic epidemiological reporting submitted by >90% of national health facilities.',
    },
    disbursementShare: '25% des fonds',
  },
  {
    month: 18,
    title: {
      fr: 'Jalon 3 : Zéro Rupture de Stock en Intrants Essentiels',
      en: 'Milestone 3: Zero-Stockout Commodity Supply Chain',
    },
    requirement: {
      fr: 'Taux de disponibilité continu des tests TDR et traitements ACT supérieur à 95% dans tous les districts sanitaires.',
      en: 'Continuous stock availability of RDTs and ACT treatment courses >95% across all health districts.',
    },
    disbursementShare: '25% des fonds',
  },
  {
    month: 24,
    title: {
      fr: 'Jalon 4 : Clôture Fiducière & Pérennisation Budgétaire',
      en: 'Milestone 4: Final Fiduciary Clearance & Domestic Budget Line',
    },
    requirement: {
      fr: 'Rapport d’audit externe sans réserve et inscription d’une ligne budgétaire nationale de contrepartie par l’État.',
      en: 'Unqualified clean external audit report and establishment of dedicated domestic government co-financing.',
    },
    disbursementShare: '25% des fonds',
  },
];
