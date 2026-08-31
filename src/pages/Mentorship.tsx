import { useState } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  GraduationCap,
  Building2,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Send,
  Linkedin,
  Award,
} from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { useLang } from '@/i18n/useLang';
import { localePath } from '@/i18n/routing';
import { LINKS } from '@/data/content';
import { MENTORSHIP_TRACKS, type MentorshipTrack } from '@/data/mentorship';

export default function Mentorship() {
  const { lang } = useLang();
  const isFr = lang === 'fr';

  const [selectedTrack, setSelectedTrack] = useState<MentorshipTrack>(MENTORSHIP_TRACKS[0]);

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
              <Compass size={13} />
              {isFr ? 'Mentorat & Carrières Internationales' : 'Mentorship & Career Compass'}
            </span>
            <h1 className="mt-6 font-display text-[2.5rem] leading-[1.08] font-medium text-pine-100 sm:text-5xl lg:text-6xl">
              {isFr ? 'Boussole de Carrière en Santé Mondiale' : 'Global Health Leadership Compass'}
            </h1>
            <p className="mt-4 max-w-3xl font-display text-lg italic text-pine-200/90 sm:text-xl">
              {isFr
                ? 'Conseils méthodologiques, compétences clés et retours d’expérience pour guider la prochaine génération de leaders africains en santé publique.'
                : 'Strategic career guidance, skill maps, and actionable advice to empower the next generation of African global health leaders.'}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Main Track Selection & Roadmap Content */}
      <section className="relative py-12 lg:py-16 border-t border-gold-500/20">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          {/* Track Selector Tabs */}
          <div className="grid gap-3 sm:grid-cols-3">
            {MENTORSHIP_TRACKS.map((track) => {
              const active = selectedTrack.id === track.id;
              return (
                <button
                  key={track.id}
                  type="button"
                  onClick={() => setSelectedTrack(track)}
                  className={`flex flex-col justify-between rounded-2xl p-5 text-left transition-all ${
                    active
                      ? 'border-2 border-gold-500 bg-gold-500/15 shadow-xl shadow-gold-500/10 scale-[1.01]'
                      : 'border border-white/10 bg-pine-900/60 hover:border-gold-400/40 hover:bg-pine-900'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-gold-400">
                      FILIÈRE {track.id === 'academic-health-economics' ? '1' : track.id === 'bilateral-program-management' ? '2' : '3'}
                    </span>
                    <h3 className="font-display text-base font-bold text-pine-100 mt-1">
                      {track.title[lang].replace(/^[0-9]\.\s*/, '')}
                    </h3>
                  </div>
                  <p className="text-xs text-pine-300/80 mt-2 line-clamp-2">
                    {track.subtitle[lang]}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Selected Track Detailed Blueprint Sheet */}
          <div className="mt-10 rounded-3xl border border-gold-500/30 bg-gradient-to-b from-pine-900 to-pine-950 p-6 sm:p-10 shadow-2xl">
            {/* Header of Track */}
            <div className="border-b border-white/10 pb-6">
              <span className="inline-block rounded-full bg-gold-500/20 border border-gold-500/40 px-3.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-gold-300">
                {isFr ? 'Feuille de Route Stratégique' : 'Strategic Roadmap'}
              </span>
              <h2 className="mt-3 font-display text-2xl sm:text-3xl font-bold text-pine-100">
                {selectedTrack.title[lang]}
              </h2>
              <p className="text-sm text-gold-300/90 italic mt-1">
                {selectedTrack.subtitle[lang]}
              </p>
              <p className="text-xs sm:text-sm text-pine-200/85 mt-3 leading-relaxed">
                {selectedTrack.description[lang]}
              </p>
            </div>

            {/* Degrees & Competencies Grid */}
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {/* Box 1: Diplomas */}
              <div className="rounded-2xl border border-white/10 bg-pine-950/80 p-5">
                <h3 className="font-display text-sm font-bold uppercase tracking-wider text-pine-100 flex items-center gap-2 mb-3">
                  <GraduationCap size={16} className="text-gold-400" />
                  {isFr ? 'Diplômes & Certifications Clés' : 'Recommended Degrees & Certifications'}
                </h3>
                <ul className="space-y-2">
                  {selectedTrack.recommendedDegrees[lang].map((deg, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-pine-200/90">
                      <CheckCircle2 size={13} className="text-gold-400 shrink-0 mt-0.5" />
                      <span>{deg}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Box 2: Core Competencies */}
              <div className="rounded-2xl border border-white/10 bg-pine-950/80 p-5">
                <h3 className="font-display text-sm font-bold uppercase tracking-wider text-pine-100 flex items-center gap-2 mb-3">
                  <Award size={16} className="text-gold-400" />
                  {isFr ? 'Compétences Distinctives à Développer' : 'Core High-Impact Skills'}
                </h3>
                <ul className="space-y-2">
                  {selectedTrack.coreCompetencies[lang].map((comp, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-pine-200/90">
                      <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                      <span>{comp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Career Timeline Milestones */}
            <div className="mt-8">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-pine-100 flex items-center gap-2 mb-4">
                <Compass size={16} className="text-gold-400" />
                {isFr ? 'Jalons & Progression par Décennie' : 'Career Progression Milestones'}
              </h3>
              <div className="grid gap-3 sm:grid-cols-3">
                {selectedTrack.milestones.map((m, i) => (
                  <div key={i} className="rounded-2xl border border-white/10 bg-pine-950/70 p-4 flex flex-col justify-between">
                    <div>
                      <span className="font-mono text-[10px] font-bold uppercase bg-gold-500/20 text-gold-300 px-2 py-0.5 rounded">
                        {m.stage}
                      </span>
                      <h4 className="font-display text-sm font-bold text-pine-100 mt-2">
                        {m.label[lang]}
                      </h4>
                    </div>
                    <p className="text-xs text-pine-300/80 mt-2 leading-relaxed">
                      {m.advice[lang]}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pitfalls to Avoid */}
            <div className="mt-8 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5">
              <h3 className="font-display text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2 mb-2">
                <AlertTriangle size={14} className="text-amber-400" />
                {isFr ? 'Pièges Fréquents à Éviter Absolument' : 'Common Pitfalls to Avoid'}
              </h3>
              <ul className="space-y-1.5">
                {selectedTrack.pitfallsToAvoid[lang].map((pit, i) => (
                  <li key={i} className="text-xs text-pine-200/90 leading-relaxed">
                    • {pit}
                  </li>
                ))}
              </ul>
            </div>

            {/* Golden Rule Callout */}
            <div className="mt-6 rounded-2xl border border-gold-500/40 bg-gold-500/15 p-5">
              <p className="text-xs font-bold text-gold-300 uppercase tracking-wider flex items-center gap-2 mb-1.5">
                <Sparkles size={14} className="text-gold-400" />
                {isFr ? 'La Règle d’Or du Dr. Seynudé Jean-Fortuné Dagnon' : 'Dr. Seynudé Dagnon’s Golden Rule'}
              </p>
              <p className="text-xs sm:text-sm text-pine-100 italic leading-relaxed">
                « {selectedTrack.dagnonGoldenRule[lang]} »
              </p>
            </div>

            {/* Direct Connect CTA Banner */}
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="font-display text-base font-bold text-pine-100">
                  {isFr ? 'Vous souhaitez échanger ou solliciter un conseil ?' : 'Seeking mentorship advice or collaboration?'}
                </p>
                <p className="text-xs text-pine-300/80 mt-0.5">
                  {isFr ? 'Écrivez directement au Dr. Dagnon ou connectez-vous sur LinkedIn.' : 'Reach out directly to Dr. Dagnon or connect on LinkedIn.'}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Link
                  to={localePath(lang, '/contact')}
                  className="inline-flex items-center gap-2 rounded-xl bg-gold-500 px-4 py-2.5 text-xs font-bold text-pine-950 shadow-md hover:bg-gold-400 transition-colors"
                >
                  <Send size={13} />
                  <span>{isFr ? 'Formulaire de contact' : 'Contact Form'}</span>
                </Link>
                <a
                  href={LINKS.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-semibold text-pine-200 hover:border-gold-400 hover:text-gold-300 transition-colors"
                >
                  <Linkedin size={13} className="text-gold-400" />
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
