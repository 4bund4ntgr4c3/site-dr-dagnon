import { useState } from 'react';
import { Video, Clock, MapPin, Quote, Copy, CheckCircle2 } from 'lucide-react';
import { useLang } from '@/i18n/useLang';
import { KEYNOTES, type Keynote, type KeynoteChapter } from '@/data/keynotes';

export function ConferenceStudio() {
  const { lang } = useLang();
  const isFr = lang === 'fr';

  const [selectedKeynote, setSelectedKeynote] = useState<Keynote>(KEYNOTES[0]);
  const [activeChapter, setActiveChapter] = useState<KeynoteChapter>(KEYNOTES[0].chapters[0]);
  const [copiedQuote, setCopiedQuote] = useState(false);

  const handleSelectKeynote = (kn: Keynote) => {
    setSelectedKeynote(kn);
    setActiveChapter(kn.chapters[0]);
  };

  const copyQuote = async (quote: string) => {
    const text = `« ${quote} » — Dr. Seynudé Jean-Fortuné DAGNON (${selectedKeynote.conference} ${selectedKeynote.year}, ${selectedKeynote.location})`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedQuote(true);
      setTimeout(() => setCopiedQuote(false), 2500);
    } catch {
      // ignore
    }
  };

  return (
    <div className="rounded-3xl border border-pine-800/70 bg-gradient-to-b from-pine-900 to-pine-950 p-6 shadow-2xl lg:p-10">
      {/* Header */}
      <div className="border-b border-white/10 pb-8">
        <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-300">
          <Video size={13} />
          {isFr ? 'Tribune Oratoire & Conférences' : 'International Keynotes Studio'}
        </span>
        <h3 className="mt-3 font-display text-2xl font-semibold text-pine-100 sm:text-3xl">
          {isFr ? 'Studio de Conférences & Chapitrage Interactif' : 'Keynote Studio & Interactive Chapters'}
        </h3>
        <p className="mt-2 max-w-2xl text-[14px] text-pine-200/80 leading-relaxed">
          {isFr
            ? 'Revivez les temps forts des interventions du Dr. Seynudé Dagnon lors des sommets mondiaux (ASTMH, PAMCA) avec navigation temporelle par chapitre.'
            : 'Explore keynotes delivered by Dr. Seynudé Dagnon at global health summits (ASTMH, PAMCA) with interactive timecoded chapter navigation.'}
        </p>
      </div>

      {/* Keynote Selector Tabs */}
      <div className="mt-6 flex flex-wrap gap-2.5">
        {KEYNOTES.map((kn) => {
          const active = selectedKeynote.id === kn.id;
          return (
            <button
              key={kn.id}
              type="button"
              onClick={() => handleSelectKeynote(kn)}
              className={`rounded-xl px-4 py-2.5 text-xs font-semibold transition-all text-left ${
                active
                  ? 'bg-gold-500 text-pine-950 font-bold shadow-lg shadow-gold-500/20 scale-[1.01]'
                  : 'border border-white/10 bg-pine-950/70 text-pine-200 hover:border-gold-400/40 hover:text-pine-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase opacity-75">{kn.year}</span>
                <span>•</span>
                <span className="text-[10px] font-bold text-gold-300">{kn.conference}</span>
              </div>
              <p className="font-bold truncate max-w-xs mt-0.5">{kn.title[lang].split(':')[0]}</p>
            </button>
          );
        })}
      </div>

      {/* Main Studio Viewport Sheet */}
      <div className="mt-8 rounded-2xl border border-white/10 bg-pine-950/90 p-6 sm:p-8">
        {/* Plenary Info Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="rounded-full bg-gold-500/20 border border-gold-500/40 px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-gold-300">
                {selectedKeynote.conference} · {selectedKeynote.year}
              </span>
              <span className="flex items-center gap-1 text-xs text-pine-300">
                <MapPin size={12} className="text-gold-400" />
                {selectedKeynote.location}
              </span>
              <span className="flex items-center gap-1 text-xs text-pine-300 font-mono">
                <Clock size={12} className="text-gold-400" />
                {selectedKeynote.duration}
              </span>
            </div>
            <h4 className="font-display text-xl sm:text-2xl font-bold text-pine-100">
              {selectedKeynote.title[lang]}
            </h4>
            <p className="text-xs sm:text-sm text-gold-300/90 italic mt-1">
              {selectedKeynote.subtitle[lang]}
            </p>
          </div>

          <div className="bg-pine-900/60 p-3 rounded-xl border border-white/10 shrink-0 text-left sm:text-right">
            <p className="text-[11px] text-pine-400 uppercase font-semibold">{isFr ? 'Public de la session' : 'Session audience'}</p>
            <p className="text-xs text-pine-200 mt-0.5">{selectedKeynote.audience[lang]}</p>
          </div>
        </div>

        {/* 2-Columns: Interactive Chapters (Left) & Active Chapter Detail + Quote (Right) */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_1.2fr] items-start">
          {/* Left: Interactive Timeline Chapter Buttons */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-pine-300 flex items-center gap-1.5 mb-3">
              <Clock size={14} className="text-gold-400" />
              {isFr ? 'Sommaire & Chapitrage Temporel' : 'Timecoded Chapter Navigation'}
            </h5>
            <div className="space-y-2">
              {selectedKeynote.chapters.map((ch, idx) => {
                const isSelected = activeChapter.time === ch.time;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveChapter(ch)}
                    className={`w-full flex items-start gap-3 p-3.5 rounded-xl text-left transition-all ${
                      isSelected
                        ? 'border border-gold-500 bg-gold-500/15 shadow-md text-pine-100'
                        : 'border border-white/5 bg-pine-900/40 text-pine-300 hover:border-gold-400/30 hover:bg-pine-900/70'
                    }`}
                  >
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-pine-950 text-gold-300 border border-white/10 shrink-0">
                      {ch.time}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-pine-100">{ch.title[lang]}</p>
                      <p className="text-[11.5px] text-pine-300/80 mt-0.5 line-clamp-2">{ch.summary[lang]}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Active Chapter Deep-Dive & Quote Clip */}
          <div className="space-y-5">
            {/* Active Chapter Highlight Box */}
            <div className="rounded-2xl border border-white/10 bg-pine-900/70 p-5">
              <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3 mb-3">
                <span className="font-mono text-xs font-bold text-gold-400">
                  {isFr ? `Séquence active : ${activeChapter.time}` : `Active Chapter: ${activeChapter.time}`}
                </span>
                <span className="text-[11px] text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                  {isFr ? 'Point Clé' : 'Key Point'}
                </span>
              </div>
              <h5 className="font-display text-base font-bold text-pine-100">{activeChapter.title[lang]}</h5>
              <p className="text-xs sm:text-sm text-pine-200/90 leading-relaxed mt-2">{activeChapter.summary[lang]}</p>
            </div>

            {/* Quote Clip Box */}
            <div className="rounded-2xl border border-gold-500/40 bg-gold-500/10 p-5">
              <div className="flex items-center justify-between gap-2 mb-2">
                <p className="text-xs font-bold text-gold-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Quote size={14} className="text-gold-400" />
                  {isFr ? 'Citation Marquante de l’Intervention' : 'Key Plenary Quote'}
                </p>
                <button
                  type="button"
                  onClick={() => copyQuote(selectedKeynote.quotes[0][lang])}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-gold-400 hover:text-gold-300 transition-colors"
                >
                  {copiedQuote ? <CheckCircle2 size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  <span>{copiedQuote ? (isFr ? 'Copié !' : 'Copied!') : (isFr ? 'Copier la citation' : 'Copy quote')}</span>
                </button>
              </div>
              <p className="text-xs sm:text-sm text-pine-100 italic leading-relaxed">
                « {selectedKeynote.quotes[0][lang]} »
              </p>
              <p className="text-[11px] font-semibold text-gold-400/90 mt-2 font-display">
                — Dr. Seynudé Jean-Fortuné DAGNON ({selectedKeynote.conference} {selectedKeynote.year})
              </p>
            </div>

            {/* Key Takeaway */}
            <div className="rounded-xl border border-white/10 bg-pine-950 p-4">
              <p className="text-xs text-pine-300 leading-relaxed">
                <strong className="text-pine-100 font-bold">{isFr ? 'Enseignement clé : ' : 'Core Takeaway: '}</strong>
                {selectedKeynote.keyTakeaway[lang]}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
