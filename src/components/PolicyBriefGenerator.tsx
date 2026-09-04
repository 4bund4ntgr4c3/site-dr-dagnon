import { useState } from 'react';
import { FileText, Printer, Copy, CheckCircle2, ShieldCheck, Sparkles, Building2, TrendingUp } from 'lucide-react';
import { useLang } from '@/i18n/useLang';

interface PolicyBrief {
  id: string;
  category: string;
  title: { fr: string; en: string };
  subtitle: { fr: string; en: string };
  context: { fr: string; en: string };
  targetAudience: { fr: string; en: string };
  recommendations: {
    title: { fr: string; en: string };
    action: { fr: string; en: string };
  }[];
  indicators: { label: { fr: string; en: string }; target: string }[];
  date: string;
}

const POLICY_BRIEFS: PolicyBrief[] = [
  {
    id: 'g2g-direct-financing',
    category: 'Gouvernance & Financement',
    date: '2026',
    title: {
      fr: 'Mémorandum Stratégique : Accélération du Financement Direct G2G en Santé Publique',
      en: 'Strategic Policy Brief: Accelerating Direct G2G Financing in Public Health',
    },
    subtitle: {
      fr: 'Recommandations pour les ministères de la santé et bailleurs bilatéraux en Afrique francophone',
      en: 'Actionable roadmap for health ministries and bilateral donors across Francophone Africa',
    },
    context: {
      fr: 'La dépendance aux intermédiaires internationaux absorbe jusqu’à 20% des enveloppes d’aide. Le modèle de contrat direct d’État à État (G2G) réinjecte ces ressources directement dans les systèmes de santé nationaux, tout en garantissant des audits financiers stricts et des décaissements indexés sur la performance.',
      en: 'Reliance on international intermediaries consumes up to 20% of bilateral health grants. Direct Government-to-Government (G2G) funding redirects these resources straight into national systems, backed by strict fiduciary audits and performance-linked disbursements.',
    },
    targetAudience: {
      fr: 'Ministres de la Santé, Secrétaires Généraux, Directeurs de la Coopération Internationale',
      en: 'Ministers of Health, Permanent Secretaries, Heads of International Cooperation',
    },
    recommendations: [
      {
        title: {
          fr: '1. Sanctuariser un compte séquestre au Trésor Public',
          en: '1. Establish a dedicated Treasury sub-account',
        },
        action: {
          fr: 'Mettre en place une double signature (Ministère / Bailleur) et un manuel de procédures comptables certifié par un audit NUPAS.',
          en: 'Implement dual-signature approval mechanisms with an aligned accounting procedures manual pre-certified via NUPAS.',
        },
      },
      {
        title: {
          fr: '2. Indexer 40% des fonds sur des indicateurs programmatiques certifiés (DLI)',
          en: '2. Index 40% of grant tranches to verified milestone indicators (DLI)',
        },
        action: {
          fr: 'Conditionner les tranches semestrielles à la transmission des données de couverture sanitaire validées sous 45 jours.',
          en: 'Condition bi-annual tranches on validated epidemiological coverage data submitted within 45 days.',
        },
      },
      {
        title: {
          fr: '3. Digitaliser intégralement la chaîne de justification financière',
          en: '3. Digitize end-to-end expenditure justification vouchers',
        },
        action: {
          fr: 'Supprimer les pièces justificatives papier au profit d’un archivage électronique sécurisé et accessible en temps réel aux auditeurs.',
          en: 'Replace paper receipts with a secure cloud-backed digital archive accessible in real-time to external auditors.',
        },
      },
      {
        title: {
          fr: '4. Instituer une revue technique conjointe mensuelle',
          en: '4. Institute monthly joint technical reviews',
        },
        action: {
          fr: 'Créer un comité de pilotage paritaire pour lever immédiatement les goulots d’étranglement de passation de marchés.',
          en: 'Form a high-level joint taskforce to clear public procurement and logistics bottlenecks immediately.',
        },
      },
    ],
    indicators: [
      { label: { fr: 'Taux de décaissement', en: 'Disbursement rate' }, target: '> 98%' },
      { label: { fr: 'Économies de frais généraux', en: 'Overhead savings' }, target: '+18%' },
      { label: { fr: 'Conformité d’audit', en: 'Audit compliance' }, target: '100%' },
    ],
  },
  {
    id: 'next-gen-milda-rollout',
    category: 'Lutte Antivectorielle',
    date: '2026',
    title: {
      fr: 'Note d’Orientation : Généralisation des Moustiquaires à Double Principe Actif (Dual-AI)',
      en: 'Policy Guidance: Universal Adoption of Dual-AI Next-Gen Mosquito Nets',
    },
    subtitle: {
      fr: 'Surmonter la résistance aux pyréthrinoïdes et maximiser l’efficacité des campagnes de masse',
      en: 'Overcoming pyrethroid resistance and maximizing mass campaign cost-efficiency',
    },
    context: {
      fr: 'La résistance métabolique des vecteurs anophèles aux pyréthrinoïdes standards menace les acquis de deux décennies. Les MILDA combinant Chlorfénapyr ou PBO rétablissent une mortalité vectorielle supérieure à 85% et réduisent l’incidence palustre de 45% supplémentaires.',
      en: 'Widespread vector resistance to standard pyrethroids threatens 20 years of malaria progress. Dual-active ingredient nets combining Chlorfenapyr or PBO restore vector mortality above 85% and deliver a 45% additional drop in child malaria.',
    },
    targetAudience: {
      fr: 'Directeurs PNLP, Spécialistes Entomologie, Équipes d’Achats Fonds Mondial',
      en: 'NMCP Directors, Vector Control Specialists, Global Fund Procurement Teams',
    },
    recommendations: [
      {
        title: {
          fr: '1. Adopter le Chlorfénapyr + Pyréthrinoïde comme standard par défaut',
          en: '1. Adopt Chlorfenapyr + Pyrethroid as the default procurement standard',
        },
        action: {
          fr: 'Éliminer progressivement les moustiquaires pyréthrinoïdes simples des plans de réapprovisionnement nationaux.',
          en: 'Phase out plain pyrethroid nets entirely from upcoming national strategic grant proposals.',
        },
      },
      {
        title: {
          fr: '2. Déployer un dénombrement géolocalisé pour éviter la sous-couverture',
          en: '2. Enforce geolocated household enumeration to prevent under-coverage',
        },
        action: {
          fr: 'Utiliser la micro-planification SIG pour garantir 1 moustiquaire pour 2 personnes dans chaque foyer rural et périurbain.',
          en: 'Leverage GIS microplanning to ensure 1 net per 2 occupants across every rural and peri-urban household.',
        },
      },
      {
        title: {
          fr: '3. Mettre en place un suivi entomologique de bio-efficacité semestriel',
          en: '3. Establish biannual net bioefficacy monitoring',
        },
        action: {
          fr: 'Tester la rémanence du produit insecticide sur des cohortes de moustiquaires à 6, 12, 24 et 36 mois après distribution.',
          en: 'Track insecticide durability and wash-resistance across net cohorts at 6, 12, 24, and 36 months post-distribution.',
        },
      },
    ],
    indicators: [
      { label: { fr: 'Réduction de l’incidence', en: 'Incidence reduction' }, target: '-45%' },
      { label: { fr: 'Taux de couverture ménages', en: 'Household coverage' }, target: '> 95%' },
      { label: { fr: 'Durabilité insecticide', en: 'Net durability' }, target: '36 mois' },
    ],
  },
  {
    id: 'smc-dynamic-scaling',
    category: 'Chimioprévention Saisonnière',
    date: '2026',
    title: {
      fr: 'Mémorandum : Extension Dynamique de la Chimioprévention du Paludisme Saisonnier (CPS)',
      en: 'Strategic Memo: Dynamic Scaling of Seasonal Malaria Chemoprevention (SMC)',
    },
    subtitle: {
      fr: 'Adapter les cycles de protection aux dérèglements pluviométriques et étendre la tranche d’âge',
      en: 'Adapting protective cycles to rainfall shifts and extending coverage beyond 5 years old',
    },
    context: {
      fr: 'Le réchauffement climatique allonge la saison de transmission au-delà des 4 mois traditionnels. L’extension à un 5e cycle dans les zones de transmission tardive et l’inclusion des enfants jusqu’à 10 ans permettent de prévenir jusqu’à 75% des hospitalisations pédiatriques.',
      en: 'Climate anomalies are lengthening malaria transmission beyond historical 4-month windows. Expanding to a 5th extension cycle and protecting children up to 10 years old prevents up to 75% of pediatric hospital admissions.',
    },
    targetAudience: {
      fr: 'Coordonnateurs régionaux de santé, Partenaires de mise en œuvre, Bailleurs RBM',
      en: 'Regional Health Directors, Implementing Partners, RBM Donors',
    },
    recommendations: [
      {
        title: {
          fr: '1. Calibrer les passages sur les modèles météo satellite',
          en: '1. Align distribution cycles with satellite precipitation models',
        },
        action: {
          fr: 'Déclencher le Cycle 1 deux semaines avant le pic des pluies et planifier un 5e cycle d’extension en novembre.',
          en: 'Launch Cycle 1 two weeks prior to peak rainfall and schedule a 5th extension cycle in November.',
        },
      },
      {
        title: {
          fr: '2. Renforcer le Traitement Directement Observé (TDO)',
          en: '2. Enforce Directly Observed Therapy (DOT) on Day 1',
        },
        action: {
          fr: 'Administrer systématiquement la première dose de SP+AQ devant les parents avec marquage indélébile de l’ongle.',
          en: 'Systematically administer Day 1 SP+AQ under parental supervision with indelible fingernail marking.',
        },
      },
      {
        title: {
          fr: '3. Intégrer la surveillance de l’observance J2 / J3 par SMS ou relais',
          en: '3. Monitor Day 2/3 home adherence via community focal points',
        },
        action: {
          fr: 'Mobiliser les agents communautaires pour vérifier la prise complète des doses à domicile.',
          en: 'Deploy community health workers for spot-check visits ensuring full 3-day treatment completion.',
        },
      },
    ],
    indicators: [
      { label: { fr: 'Baisse des cas sévères', en: 'Severe malaria drop' }, target: '-75%' },
      { label: { fr: 'Taux d’observance complète', en: 'Full adherence rate' }, target: '> 94%' },
      { label: { fr: 'Coût par enfant / an', en: 'Cost per child / year' }, target: '< $4.00' },
    ],
  },
  {
    id: 'anopheles-stephensi-urban-threat',
    category: 'Surveillance & Climat',
    date: '2026',
    title: {
      fr: 'Alerte Sanitaire : Risque d’Invasion Urbaine d’Anopheles stephensi en Afrique Côtière',
      en: 'Policy Alert: Containing the Urban Invasion of Anopheles stephensi across Coastal Africa',
    },
    subtitle: {
      fr: 'Stratégie de riposte préventive pour les métropoles et zones portuaires d’Afrique de l’Ouest',
      en: 'Early detection and containment roadmap for West African seaports and urban centers',
    },
    context: {
      fr: 'Contrairement aux vecteurs ruraux traditionnels, Anopheles stephensi prolifère dans les récipients d’eau propre artificiels (citernes, chantiers, pneus) au cœur des mégapoles urbaines et résiste à multiples classes d’insecticides. Sans surveillance proactive, il menace d’ajouter des millions de cas de paludisme urbain dans des villes historiquement peu touchées.',
      en: 'Unlike traditional rural vectors, Anopheles stephensi breeds in artificial urban water containers (cisterns, construction sites, discarded tires) and exhibits high insecticide resistance. Without proactive surveillance, it threatens to trigger unprecedented urban malaria outbreaks across major African coastal cities.',
    },
    targetAudience: {
      fr: 'Maires des grandes villes, Directeurs de l’Hygiène Publique, Équipes Entomologiques Portuaires',
      en: 'City Mayors, Public Health Officers, Port Health and Vector Surveillance Teams',
    },
    recommendations: [
      {
        title: {
          fr: '1. Établir des cordons de surveillance entomologique moléculaire dans les ports et aéroports',
          en: '1. Establish molecular entomological surveillance cordons at ports and airports',
        },
        action: {
          fr: 'Déployer des pièges sentinelles BG-Sentinel et tester par PCR l’ADN des larves collectées dans un rayon de 10 km des nœuds logistiques.',
          en: 'Deploy BG-Sentinel traps and run routine PCR molecular assays on collected larvae within 10 km of trade hubs.',
        },
      },
      {
        title: {
          fr: '2. Imposer le traitement larvicide biologique (Bti) des réservoirs urbains',
          en: '2. Enforce biological larviciding (Bti) across urban artificial water storage',
        },
        action: {
          fr: 'Traiter systématiquement les citernes ouvertes, chantiers immobiliers et bassins de rétention avec du Bacillus thuringiensis israelensis.',
          en: 'Systematically treat open cisterns, construction retention ponds, and rainwater tanks with eco-friendly Bti larvicides.',
        },
      },
      {
        title: {
          fr: '3. Cartographier les gîtes larvaires par imagerie drone haute résolution',
          en: '3. Map urban breeding hotspots using high-resolution drone imagery',
        },
        action: {
          fr: 'Intégrer les coordonnées GPS des points d’eau stagnante urbains dans le module SIG du DHIS2 municipal.',
          en: 'Feed geospatial coordinates of stagnant urban water bodies directly into municipal DHIS2 GIS layers.',
        },
      },
    ],
    indicators: [
      { label: { fr: 'Détection précoce', en: 'Early detection window' }, target: '< 14 jours' },
      { label: { fr: 'Couverture larvicide urbaine', en: 'Urban larviciding coverage' }, target: '> 90%' },
      { label: { fr: 'Incidence urbaine évitée', en: 'Averted urban cases' }, target: '100% stable' },
    ],
  },
  {
    id: 'malaria-vaccine-integration-r21',
    category: 'Vaccination & Systèmes de Santé',
    date: '2026',
    title: {
      fr: 'Feuille de Route : Intégration Économique des Vaccins Antipaludiques (R21 / RTS,S) dans le PEV',
      en: 'Strategic Roadmap: Cost-Effective Integration of Malaria Vaccines (R21 / RTS,S) into EPI',
    },
    subtitle: {
      fr: 'Maximiser le retour sur investissement sanitaire par la combinaison synergique Vaccin + CPS + MILDA',
      en: 'Maximizing health ROI through the layered synergy of Vaccines, SMC, and Next-Gen Nets',
    },
    context: {
      fr: 'L’introduction des vaccins R21/Matrix-M et RTS,S marque un tournant historique. Cependant, leur coût unitaire et la logistique de 4 doses exigent un ciblage infranational rigoureux : les modèles démontrent que l’impact est démultiplié (+60% de mortalité évitée) lorsque le vaccin est déployé en synergie avec la chimioprévention saisonnière dans les zones à forte transmission.',
      en: 'The rollout of R21/Matrix-M and RTS,S vaccines is a historic milestone. However, procurement costs and 4-dose cold-chain logistics necessitate precision subnational targeting: health economics models prove that vaccine impact surges (+60% child mortality averted) when layered synchronously with seasonal chemoprevention.',
    },
    targetAudience: {
      fr: 'Coordonnateurs PEV, Directeurs Santé Mère-Enfant, Conseillers Économie de la Santé Gavi/UNICEF',
      en: 'EPI Coordinators, Maternal and Child Health Directors, Gavi/UNICEF Health Economists',
    },
    recommendations: [
      {
        title: {
          fr: '1. Prioriser l’introduction dans les districts à forte charge et accès restreint aux soins',
          en: '1. Prioritize introduction in high-burden districts with high pediatric mortality',
        },
        action: {
          fr: 'Allouer les premières cohortes vaccinales aux zones rurales où l’accès aux structures hospitalières dépasse 2 heures de trajet.',
          en: 'Direct initial vaccine cohorts to remote rural health districts where emergency pediatric care is over 2 hours away.',
        },
      },
      {
        title: {
          fr: '2. Synchroniser la 4e dose de rappel avec le premier cycle de CPS',
          en: '2. Synchronize the 4th booster dose with SMC Cycle 1 campaigns',
        },
        action: {
          fr: 'Coupler le passage communautaire de la chimioprévention pour rattraper les enfants ayant manqué leur dose de rappel vaccinal à 18 mois.',
          en: 'Leverage door-to-door SMC distribution to catch up children who missed their 18-month EPI booster appointment.',
        },
      },
      {
        title: {
          fr: '3. Digitaliser le carnet vaccinal électronique dans le registre DHIS2 Tracker',
          en: '3. Digitize electronic immunization registries using DHIS2 Tracker',
        },
        action: {
          fr: 'Envoyer des rappels SMS automatiques aux mères de famille 48h avant chaque échéance vaccinale (Mois 5, 6, 7 et 18).',
          en: 'Trigger automated SMS appointment reminders to caregivers 48 hours prior to each scheduled vaccination dose.',
        },
      },
    ],
    indicators: [
      { label: { fr: 'Taux de complétude 4 doses', en: '4-dose completion rate' }, target: '> 85%' },
      { label: { fr: 'Baisse de mortalité toutes causes', en: 'All-cause child mortality drop' }, target: '-13%' },
      { label: { fr: 'Coût / année de vie gagnée (DALY)', en: 'Cost per DALY averted' }, target: '< $65' },
    ],
  },
];

export function PolicyBriefGenerator() {
  const { lang } = useLang();
  const isFr = lang === 'fr';

  const [selectedBrief, setSelectedBrief] = useState<PolicyBrief>(POLICY_BRIEFS[0]);
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const copyContent = async () => {
    const text = `
DRAFT / BROUILLON NON VALIDÉ — POLICY BRIEF
------------------------------------------------------
Titre: ${selectedBrief.title[lang]}
Sous-titre: ${selectedBrief.subtitle[lang]}
Date: ${selectedBrief.date} | Public cible: ${selectedBrief.targetAudience[lang]}

CONTEXTE & DIAGNOSTIC:
${selectedBrief.context[lang]}

RECOMMANDATIONS STRATÉGIQUES:
${selectedBrief.recommendations.map((r, i) => `${i + 1}. ${r.title[lang]}\n   Action: ${r.action[lang]}`).join('\n\n')}

INDICATEURS CIBLES:
${selectedBrief.indicators.map((ind) => `- ${ind.label[lang]}: ${ind.target}`).join('\n')}

${lang === 'fr' ? 'Auteur : Dr. Seynudé Jean-Fortuné DAGNON' : 'Author: Seynudé Jean-Fortuné DAGNON, MD, MPH'}
${lang === 'fr' ? 'Senior Program Officer — Paludisme & Santé Publique | Fondation Bill & Melinda Gates' : 'Senior Program Officer — Malaria & Public Health | Bill & Melinda Gates Foundation'}
${lang === 'fr' ? 'Démonstration : hypothèses à vérifier avant toute utilisation. https://seynudedagnon.com' : 'Demonstration: verify every assumption before use. https://seynudedagnon.com'}
    `.trim();

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  };

  return (
    <div className="rounded-3xl border border-pine-800/70 bg-gradient-to-b from-pine-900 to-pine-950 p-6 shadow-2xl lg:p-10">
      {/* Top Banner Header */}
      <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-8 md:flex-row md:items-end print:hidden">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-300">
            <FileText size={13} />
            {isFr ? 'Aide à la Décision & Stratégie' : 'Strategic Policy Briefing'}
          </span>
          <h2 className="mt-3 font-display text-2xl font-semibold text-pine-100 sm:text-3xl">
            {isFr ? 'Générateur de Mémorandums & Policy Briefs' : 'Executive Policy Brief & Memo Generator'}
          </h2>
          <p className="mt-2 max-w-2xl text-[14px] text-pine-200/80 leading-relaxed">
            {isFr
              ? 'Créez un brouillon de travail à relire, sourcer et valider avant toute diffusion ou décision.'
              : 'Create a working draft that must be reviewed, sourced, and validated before circulation or decision-making.'}
          </p>
        </div>

        {/* Action Buttons: Print & Copy */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={copyContent}
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-semibold text-pine-200 hover:border-gold-400 hover:text-pine-100 transition-all"
          >
            {copied ? <CheckCircle2 size={15} className="text-emerald-400" /> : <Copy size={15} className="text-gold-400" />}
            <span>{copied ? (isFr ? 'Copié !' : 'Copied!') : (isFr ? 'Copier le mémo' : 'Copy memo text')}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-xl bg-gold-500 px-5 py-2.5 text-xs font-bold text-pine-950 shadow-md shadow-gold-500/20 hover:bg-gold-400 transition-all"
          >
            <Printer size={15} />
            <span>{isFr ? 'Imprimer / Exporter PDF' : 'Print / Export PDF'}</span>
          </button>
        </div>
      </div>

      {/* Select Policy Brief Topic Tabs */}
      <div className="mt-6 flex flex-wrap gap-2.5 print:hidden">
        {POLICY_BRIEFS.map((b) => {
          const active = selectedBrief.id === b.id;
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => setSelectedBrief(b)}
              className={`rounded-xl px-4 py-2.5 text-xs font-semibold transition-all text-left ${
                active
                  ? 'bg-gold-500 text-pine-950 font-bold shadow-lg shadow-gold-500/20'
                  : 'border border-white/10 bg-pine-950/70 text-pine-200 hover:border-gold-400/40 hover:text-pine-100'
              }`}
            >
              <p className="text-[10px] uppercase tracking-wider opacity-80">{b.category}</p>
              <p className="font-bold truncate max-w-xs">{b.title[lang].split(':')[0]}</p>
            </button>
          );
        })}
      </div>

      {/* Official Executive Policy Memo Document Sheet */}
      <div className="mt-8 rounded-2xl border border-white/15 bg-ivory text-pine-950 p-6 sm:p-10 shadow-2xl relative overflow-hidden print:p-0 print:border-none print:shadow-none print:bg-white print:text-black">
        {/* Document Header with Official Credentials */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b-2 border-pine-900/20 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-gold-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ivory">
                {isFr ? 'BROUILLON NON VALIDÉ' : 'UNVALIDATED DRAFT'} · {selectedBrief.date}
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-pine-700">
                {selectedBrief.category}
              </span>
            </div>
            <h3 className="mt-2 font-display text-xl sm:text-2xl font-bold text-pine-950 leading-tight">
              {selectedBrief.title[lang]}
            </h3>
            <p className="text-xs font-semibold text-pine-700 italic mt-1">
              {selectedBrief.subtitle[lang]}
            </p>
          </div>

          <div className="text-left sm:text-right shrink-0">
            <p className="font-display text-xs font-bold text-pine-950">Dr. Seynudé Jean-Fortuné DAGNON</p>
            <p className="text-[11px] text-pine-700">MD, MPH · Spécialiste Santé Publique & Paludisme</p>
            <p className="text-[10px] text-pine-600">Senior Program Officer · Fondation Bill & Melinda Gates</p>
          </div>
        </div>

        {/* Target Audience Line */}
        <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-pine-800 bg-pine-900/5 p-2.5 rounded-lg">
          <Building2 size={14} className="text-gold-700 shrink-0" />
          <span>{isFr ? 'Destinataires institutionnels :' : 'Target audience:'}</span>
          <span className="font-normal text-pine-900">{selectedBrief.targetAudience[lang]}</span>
        </div>

        {/* Section 1: Executive Context & Diagnosis */}
        <div className="mt-6">
          <h4 className="font-display text-sm font-bold uppercase tracking-wider text-pine-900 border-b border-pine-900/10 pb-1 flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-gold-700" />
            {isFr ? '1. Contexte & Diagnostic Stratégique' : '1. Strategic Context & Diagnosis'}
          </h4>
          <p className="mt-2 text-xs sm:text-sm leading-relaxed text-ink/85 text-justify">
            {selectedBrief.context[lang]}
          </p>
        </div>

        {/* Section 2: Actionable Recommendations */}
        <div className="mt-6">
          <h4 className="font-display text-sm font-bold uppercase tracking-wider text-pine-900 border-b border-pine-900/10 pb-1 flex items-center gap-1.5">
            <Sparkles size={14} className="text-gold-700" />
            {isFr ? '2. Recommandations Politiques & Actions Concrètes' : '2. Actionable Policy Recommendations'}
          </h4>
          <div className="mt-3 grid gap-3">
            {selectedBrief.recommendations.map((rec, i) => (
              <div key={i} className="rounded-xl border border-pine-900/10 bg-white p-3.5 shadow-sm">
                <p className="font-bold text-xs sm:text-sm text-pine-950">{rec.title[lang]}</p>
                <p className="mt-1 text-xs text-ink/75 leading-relaxed">{rec.action[lang]}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Target KPIs & Impact Metrics */}
        <div className="mt-6 pt-4 border-t border-pine-900/15">
          <h4 className="font-display text-xs font-bold uppercase tracking-wider text-pine-900 mb-3 flex items-center gap-1.5">
            <TrendingUp size={13} className="text-gold-700" />
            {isFr ? '3. Cibles d’Impact & Indicateurs de Performance' : '3. Target Performance Indicators'}
          </h4>
          <div className="grid grid-cols-3 gap-3">
            {selectedBrief.indicators.map((ind, i) => (
              <div key={i} className="rounded-lg bg-pine-900/5 p-2.5 text-center">
                <p className="text-[11px] font-semibold text-pine-700">{ind.label[lang]}</p>
                <p className="font-display text-base sm:text-lg font-bold text-gold-800 mt-0.5">{ind.target}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Official Signature Footer */}
        <div className="mt-8 pt-4 border-t-2 border-pine-900/20 flex justify-between items-end text-[10px] text-pine-700">
          <div>
            <p className="font-bold text-pine-950">{isFr ? 'Dr. Seynudé Jean-Fortuné DAGNON' : 'Seynudé Jean-Fortuné DAGNON, MD, MPH'}</p>
            <p>{isFr ? 'Doctorant en économie de la santé · Université de Groningen' : 'PhD Candidate (Health Economics) · University of Groningen'}</p>
            <p className="text-gold-800 font-mono mt-0.5">https://seynudedagnon.com/impact</p>
          </div>
          <div className="text-right">
            <p className="italic">{isFr ? 'Démonstration — validation scientifique et institutionnelle requise' : 'Demonstration — scientific and institutional validation required'}</p>
            <p className="font-mono">{isFr ? 'Ne pas diffuser tel quel' : 'Do not distribute as-is'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
