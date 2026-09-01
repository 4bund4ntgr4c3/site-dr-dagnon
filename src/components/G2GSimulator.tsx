import { useState, useId } from 'react';
import { DollarSign, Landmark, ShieldCheck, TrendingUp, Users, Pill, Activity, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useLang } from '@/i18n/useLang';
import { G2G_READINESS_TIERS, G2G_DLI_MILESTONES, type G2GReadinessTier } from '@/data/g2g-calculator';

export function G2GSimulator() {
  const { lang } = useLang();
  const isFr = lang === 'fr';

  const [grantAmount, setGrantAmount] = useState<number>(25000000); // $25M
  const [selectedTier, setSelectedTier] = useState<G2GReadinessTier>(G2G_READINESS_TIERS[0]);

  const grantInputId = useId();

  // Calculations
  const traditionalIntermediaryCost = Math.round(grantAmount * 0.20); // 20% standard overhead
  const g2gAuditCost = Math.round(grantAmount * selectedTier.auditFeeRate);
  const netSavingsUnlocked = traditionalIntermediaryCost - g2gAuditCost;
  const netFieldBudget = grantAmount - g2gAuditCost;

  // Impact equivalents
  const actTreatmentsFunded = Math.round(netSavingsUnlocked / 1.20);
  const rdtTestsFunded = Math.round(netSavingsUnlocked / 0.45);
  const chwSalariesFunded = Math.round(netSavingsUnlocked / 1200);
  const dualAiNetsFunded = Math.round(netSavingsUnlocked / 2.80);

  return (
    <div className="rounded-3xl border border-pine-900/15 bg-white p-6 shadow-xl sm:p-8 lg:p-10">
      {/* Header */}
      <div className="border-b border-pine-900/10 pb-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-3.5 py-1 text-[11px] font-semibold tracking-wider text-gold-700 uppercase">
          <Landmark size={13} className="text-gold-600" />
          {isFr ? 'Modèle Économique & Fiducière G2G' : 'Government-to-Government (G2G) Direct Financing'}
        </div>
        <h2 className="mt-3 font-display text-2xl font-bold text-pine-950 sm:text-3xl">
          {isFr ? 'Calculateur d’Économies & de Transition G2G' : 'G2G Overhead Savings & Field Impact Calculator'}
        </h2>
        <p className="mt-2 max-w-2xl text-[14px] text-pine-900/75 sm:text-[15px]">
          {isFr
            ? 'Mesurez concrètement comment l’élimination des intermédiaires administratifs réinjecte 18 à 22% des subventions bilatérales directement sur le terrain sanitaire.'
            : 'Simulate how eliminating intermediary administrative layers redirects 18% to 22% of health grants directly into frontline commodities and community health workers.'}
        </p>
      </div>

      {/* 1. Grant Amount Slider */}
      <div className="mt-8 rounded-2xl border border-pine-900/10 bg-pine-50/70 p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label htmlFor={grantInputId} className="flex items-center gap-2 text-[13px] font-semibold tracking-wider text-pine-900 uppercase">
            <DollarSign size={16} className="text-gold-600" />
            {isFr ? 'Montant total de la subvention santé :' : 'Total Health Grant Amount:'}
          </label>
          <span className="font-mono text-2xl font-bold text-pine-950">
            ${(grantAmount / 1000000).toFixed(0)} 000 000 USD
          </span>
        </div>
        <input
          id={grantInputId}
          type="range"
          min={5000000}
          max={100000000}
          step={5000000}
          value={grantAmount}
          onChange={(e) => setGrantAmount(Number(e.target.value))}
          className="mt-4 h-2.5 w-full cursor-pointer appearance-none rounded-lg bg-pine-200 accent-gold-500"
          aria-label={isFr ? 'Montant de la subvention' : 'Grant amount'}
        />
        <div className="mt-2 flex justify-between text-[11px] font-medium text-pine-700">
          <span>$5M USD</span>
          <span>$50M USD</span>
          <span>$100M USD</span>
        </div>
      </div>

      {/* 2. Readiness Tier Selector */}
      <div className="mt-8 space-y-4">
        <label className="text-[13px] font-semibold tracking-wider text-pine-900/80 uppercase">
          {isFr ? '2. Niveau de maturité fiducière du Ministère :' : '2. Ministry Fiduciary Readiness Tier:'}
        </label>
        <div className="grid gap-3 sm:grid-cols-3">
          {G2G_READINESS_TIERS.map((tier) => {
            const isSelected = tier.id === selectedTier.id;
            return (
              <button
                key={tier.id}
                type="button"
                onClick={() => setSelectedTier(tier)}
                className={`flex flex-col justify-between rounded-2xl border p-4 text-left transition-all ${
                  isSelected
                    ? 'border-gold-500 bg-pine-950 text-white shadow-lg ring-2 ring-gold-400/40'
                    : 'border-pine-900/15 bg-pine-50/50 text-pine-900 hover:border-gold-500/40 hover:bg-pine-50'
                }`}
                aria-pressed={isSelected}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        isSelected ? 'bg-gold-400 text-pine-950' : 'bg-pine-200 text-pine-800'
                      }`}
                    >
                      {tier.fiduciaryRiskRating} Risk
                    </span>
                    <span className="font-mono text-[11px] text-gold-400 font-semibold">
                      +{Math.round((tier.overheadSavingsRate - tier.auditFeeRate) * 100)}% {isFr ? 'net' : 'net'}
                    </span>
                  </div>
                  <h3 className={`mt-2 font-display text-[14.5px] font-semibold leading-snug ${isSelected ? 'text-pine-50' : 'text-pine-950'}`}>
                    {tier.name[lang]}
                  </h3>
                </div>
                <p className={`mt-2 text-[12px] leading-relaxed ${isSelected ? 'text-pine-200/80' : 'text-pine-700'}`}>
                  {tier.description[lang]}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Financial Comparison & Savings Dashboard */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Frais Intermédiaires Éliminés */}
        <div className="rounded-2xl border border-pine-900/10 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-pine-700">{isFr ? 'Frais d’Intermédiation Éliminés' : 'Overhead Fees Removed'}</span>
            <TrendingUp size={18} className="text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-emerald-700">
            +${(netSavingsUnlocked / 1000000).toFixed(2)}M
          </div>
          <p className="mt-1 text-[11px] text-pine-600">
            {isFr ? 'Réinjecté à 100% sur le terrain' : '100% redirected to field operations'}
          </p>
        </div>

        {/* Coût d'Audit Fiducière */}
        <div className="rounded-2xl border border-pine-900/10 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-pine-700">{isFr ? 'Audit & Contrôle Fiducière' : 'Fiduciary Audit Cost'}</span>
            <ShieldCheck size={18} className="text-gold-600" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-pine-950">
            ${(g2gAuditCost / 1000).toFixed(0)}k
          </div>
          <p className="mt-1 text-[11px] text-pine-600">
            {(selectedTier.auditFeeRate * 100).toFixed(1)}% {isFr ? 'du montant global' : 'of grant envelope'}
          </p>
        </div>

        {/* Budget Net Terrain */}
        <div className="rounded-2xl border border-pine-900/10 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-pine-700">{isFr ? 'Budget Net Déployé' : 'Net Direct Grant Deployed'}</span>
            <Landmark size={18} className="text-pine-700" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-pine-950">
            ${(netFieldBudget / 1000000).toFixed(2)}M
          </div>
          <p className="mt-1 text-[11px] text-pine-600">
            {isFr ? 'Sur compte Trésor National' : 'Direct to National Treasury'}
          </p>
        </div>

        {/* Gain d'Efficience Global */}
        <div className="rounded-2xl border border-pine-900/10 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-pine-700">{isFr ? 'Gain d’Efficience Net' : 'Net Efficiency Surge'}</span>
            <ArrowRight size={18} className="text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-emerald-700">
            +{Math.round((netSavingsUnlocked / grantAmount) * 100)}%
          </div>
          <p className="mt-1 text-[11px] text-pine-600">
            {isFr ? 'De valeur opérationnelle en plus' : 'More frontline purchasing power'}
          </p>
        </div>
      </div>

      {/* 4. Equivalent Intrants Sanitaires Débloqués */}
      <div className="mt-10 rounded-2xl border border-gold-500/30 bg-pine-950 p-6 text-white sm:p-8">
        <div className="flex items-center gap-2 text-gold-400">
          <CheckCircle2 size={18} />
          <h3 className="font-display text-lg font-bold tracking-wide uppercase sm:text-xl">
            {isFr ? 'Intrants & Ressources Sanitaires Achetés avec les Économies G2G' : 'Tangible Health Impact Purchased from G2G Savings'}
          </h3>
        </div>
        <p className="mt-2 text-[13.5px] text-pine-200/85">
          {isFr
            ? `Grâce aux $${(netSavingsUnlocked / 1000000).toFixed(2)}M USD d'économies de frais généraux générées par le modèle direct G2G, le pays finance en supplément :`
            : `With the $${(netSavingsUnlocked / 1000000).toFixed(2)}M USD in overhead savings unlocked via direct G2G financing, the ministry directly finances:`}
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
            <Pill size={24} className="mx-auto text-gold-400" />
            <div className="mt-2 font-mono text-xl font-bold text-white">
              +{actTreatmentsFunded.toLocaleString(isFr ? 'fr-FR' : 'en-US')}
            </div>
            <p className="mt-1 text-[11.5px] text-pine-200/80">
              {isFr ? 'Traitements ACT pédiatriques' : 'Pediatric ACT treatment courses'}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
            <Activity size={24} className="mx-auto text-gold-400" />
            <div className="mt-2 font-mono text-xl font-bold text-white">
              +{rdtTestsFunded.toLocaleString(isFr ? 'fr-FR' : 'en-US')}
            </div>
            <p className="mt-1 text-[11.5px] text-pine-200/80">
              {isFr ? 'Tests de diagnostic rapide (TDR)' : 'Rapid Diagnostic Tests (RDTs)'}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
            <Users size={24} className="mx-auto text-gold-400" />
            <div className="mt-2 font-mono text-xl font-bold text-white">
              +{chwSalariesFunded.toLocaleString(isFr ? 'fr-FR' : 'en-US')}
            </div>
            <p className="mt-1 text-[11.5px] text-pine-200/80">
              {isFr ? 'Salaires annuels d’agents ASBC' : 'Annual CHW stipends funded'}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
            <ShieldCheck size={24} className="mx-auto text-gold-400" />
            <div className="mt-2 font-mono text-xl font-bold text-white">
              +{dualAiNetsFunded.toLocaleString(isFr ? 'fr-FR' : 'en-US')}
            </div>
            <p className="mt-1 text-[11.5px] text-pine-200/80">
              {isFr ? 'Moustiquaires Dual-AI Next-Gen' : 'Next-Gen Dual-AI mosquito nets'}
            </p>
          </div>
        </div>
      </div>

      {/* 5. 24-Month DLI Disbursement Roadmap */}
      <div className="mt-10 space-y-4">
        <h3 className="font-display text-lg font-bold text-pine-950 sm:text-xl">
          {isFr ? 'Calendrier de Décaissement Indexé sur les Résultats (DLI 24 Mois)' : '24-Month Disbursement-Linked Indicators (DLI) Roadmap'}
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {G2G_DLI_MILESTONES.map((dli) => (
            <div key={dli.month} className="rounded-2xl border border-pine-900/10 bg-pine-50/60 p-4">
              <div className="flex items-center justify-between text-[12px] font-bold text-gold-700">
                <span>Mois {dli.month}</span>
                <span className="rounded bg-gold-500/20 px-2 py-0.5 text-pine-950 font-mono text-[11px]">
                  {dli.disbursementShare}
                </span>
              </div>
              <h4 className="mt-2 font-display text-[14px] font-semibold text-pine-950">
                {dli.title[lang]}
              </h4>
              <p className="mt-2 text-[12px] text-pine-800 leading-relaxed">
                {dli.requirement[lang]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
