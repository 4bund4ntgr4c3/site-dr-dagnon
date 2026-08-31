import { useState } from 'react';
import {
  Wrench,
  CheckCircle2,
  Copy,
  FileCheck,
  Building2,
  Sparkles,
} from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { useLang } from '@/i18n/useLang';
import { TOOLKITS, type ToolkitGuide } from '@/data/toolkits';

export default function Toolkit() {
  const { lang } = useLang();
  const isFr = lang === 'fr';

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: isFr ? 'Tous les guides' : 'All guides' },
    { id: 'digital', label: isFr ? 'Digitalisation & SIG' : 'Digital & GIS' },
    { id: 'governance', label: isFr ? 'Financement G2G' : 'G2G Financing' },
    { id: 'surveillance', label: isFr ? 'Surveillance DHIS2' : 'DHIS2 Surveillance' },
    { id: 'smc', label: isFr ? 'Chimioprévention (CPS)' : 'SMC Scaling' },
  ];

  const filteredToolkits = activeCategory === 'all'
    ? TOOLKITS
    : TOOLKITS.filter((tk) => tk.category === activeCategory);

  const copyToolkit = async (tk: ToolkitGuide) => {
    const text = `
GUIDE OPÉRATIONNEL : ${tk.title[lang]}
${tk.subtitle[lang]}
--------------------------------------------------
Public cible : ${tk.targetAudience[lang]}

ÉTAPES & PROTOCOLE :
${tk.steps.map((s) => `${s.phase} : ${s.title[lang]}\n${s.details[lang].map((d) => `  - ${d}`).join('\n')}`).join('\n\n')}

POINTS D'ATTENTION DU DR. SEYNUDÉ DAGNON :
${tk.keyTakeaways[lang].map((k) => `* ${k}`).join('\n')}

Source : Plateforme officielle du Dr. Seynudé Jean-Fortuné DAGNON (https://seynudedagnon.com/toolkit)
    `.trim();

    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(tk.id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch {
      // ignore
    }
  };

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-pine-950 text-ivory">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-pine-950">
        <div className="absolute inset-0 texture-net pointer-events-none opacity-50" />
        <div className="absolute -top-40 -right-40 h-[560px] w-[560px] rounded-full bg-pine-600/20 blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 -left-40 h-[460px] w-[460px] rounded-full bg-gold-600/10 blur-[130px] pointer-events-none" />

        <div className="relative mx-auto max-w-5xl px-5 pb-20 pt-32 lg:px-8 lg:pt-36">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-300">
              <Wrench size={13} />
              {isFr ? 'Ressources & Guides Opérationnels' : 'Public Health Toolkit'}
            </span>
            <h1 className="mt-6 font-display text-[2.5rem] leading-[1.08] font-medium text-pine-100 sm:text-5xl lg:text-6xl">
              {isFr ? 'Boîte à Outils & Protocoles pour Décideurs' : 'Practical Guides & Toolkits for Health Leaders'}
            </h1>
            <p className="mt-4 max-w-3xl font-display text-lg italic text-pine-200/90 sm:text-xl">
              {isFr
                ? 'Méthodologies, checklists et protocoles standardisés développés sur le terrain pour la digitalisation des campagnes, les contrats G2G et l’audit des données sanitaires.'
                : 'Field-tested methodologies, checklists, and standardized protocols for campaign digitalization, G2G direct grants, and DHIS2 health data auditing.'}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Main Toolkits List */}
      <section className="relative py-12 lg:py-16 border-t border-gold-500/20">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2 pb-8 border-b border-white/10">
            {categories.map((cat) => {
              const active = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                    active
                      ? 'bg-gold-500 text-pine-950 shadow-md shadow-gold-500/20 font-bold'
                      : 'border border-white/15 bg-white/5 text-pine-200 hover:border-gold-400/50 hover:text-pine-100'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Cards */}
          <div className="mt-10 space-y-10">
            {filteredToolkits.map((tk, idx) => (
              <Reveal key={tk.id} delay={idx * 0.08}>
                <div className="rounded-3xl border border-gold-500/30 bg-gradient-to-b from-pine-900 to-pine-950 p-6 sm:p-8 shadow-xl">
                  {/* Header of Toolkit */}
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-white/10 pb-6">
                    <div>
                      <span className="inline-block rounded-full bg-gold-500/20 border border-gold-500/40 px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-gold-300">
                        {tk.category.toUpperCase()}
                      </span>
                      <h2 className="mt-2 font-display text-xl sm:text-2xl font-bold text-pine-100">
                        {tk.title[lang]}
                      </h2>
                      <p className="text-xs sm:text-sm text-gold-300/90 italic mt-1">
                        {tk.subtitle[lang]}
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0 self-start">
                      <button
                        type="button"
                        onClick={() => copyToolkit(tk)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-medium text-pine-200 hover:border-gold-400 hover:text-gold-300 transition-colors"
                      >
                        {copiedId === tk.id ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Copy size={14} />}
                        <span>{copiedId === tk.id ? (isFr ? 'Protocole copié !' : 'Copied!') : (isFr ? 'Copier le protocole' : 'Copy protocol')}</span>
                      </button>
                    </div>
                  </div>

                  {/* Description & Target Audience */}
                  <div className="mt-4">
                    <p className="text-xs sm:text-sm text-pine-200/85 leading-relaxed">
                      {tk.description[lang]}
                    </p>
                    <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-pine-950/80 border border-white/10 px-3 py-1.5 text-xs text-pine-300">
                      <Building2 size={13} className="text-gold-400 shrink-0" />
                      <span className="font-semibold">{isFr ? 'Public cible :' : 'Target audience:'}</span>
                      <span>{tk.targetAudience[lang]}</span>
                    </div>
                  </div>

                  {/* Key Operational Impact Metrics */}
                  <div className="mt-6 grid grid-cols-3 gap-3">
                    {tk.metrics.map((m, mIdx) => (
                      <div key={mIdx} className="rounded-xl border border-white/10 bg-pine-950/90 p-3 text-center">
                        <p className="text-[11px] font-medium text-pine-300/80">{m.label[lang]}</p>
                        <p className="font-display text-lg sm:text-xl font-bold text-gold-300 mt-0.5">{m.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Phased Action Steps */}
                  <div className="mt-8 space-y-4">
                    <h3 className="font-display text-sm font-bold uppercase tracking-wider text-pine-100 flex items-center gap-2">
                      <FileCheck size={16} className="text-gold-400" />
                      {isFr ? 'Étapes de Déploiement & Checklist' : 'Deployment Phases & Checklist'}
                    </h3>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {tk.steps.map((s, sIdx) => (
                        <div key={sIdx} className="rounded-2xl border border-white/10 bg-pine-950/70 p-4">
                          <span className="rounded bg-gold-500/20 text-gold-300 font-mono text-[10px] font-bold px-2 py-0.5 uppercase">
                            {s.phase}
                          </span>
                          <h4 className="font-display text-sm font-bold text-pine-100 mt-1.5 mb-2">
                            {s.title[lang]}
                          </h4>
                          <ul className="space-y-1.5">
                            {s.details[lang].map((detail, dIdx) => (
                              <li key={dIdx} className="flex items-start gap-2 text-xs text-pine-200/80 leading-relaxed">
                                <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Key Takeaways Callout */}
                  <div className="mt-6 rounded-2xl border border-gold-500/30 bg-gold-500/10 p-4">
                    <p className="text-xs font-bold text-gold-300 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                      <Sparkles size={14} className="text-gold-400" />
                      {isFr ? 'Recommandations & Points d’Attention du Dr. Seynudé Dagnon' : 'Key Field Takeaways by Dr. Seynudé Dagnon'}
                    </p>
                    <ul className="space-y-1">
                      {tk.keyTakeaways[lang].map((k, kIdx) => (
                        <li key={kIdx} className="text-xs text-pine-100 italic leading-relaxed">
                          « {k} »
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
