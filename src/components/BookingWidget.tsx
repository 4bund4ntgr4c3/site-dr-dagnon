import { useState } from 'react';
import { Calendar, Clock, Video, MapPin, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router';
import { useLang } from '@/i18n/useLang';
import { localePath } from '@/i18n/routing';

const SLOTS = [
  { date: '2026-09-10', time: '10:00', tz: 'CET', type: 'Visio' },
  { date: '2026-09-17', time: '14:30', tz: 'CET', type: 'Visio' },
  { date: '2026-09-24', time: '09:00', tz: 'CET', type: 'Cotonou' },
];

export function BookingWidget() {
  const { lang } = useLang();
  const [picked, setPicked] = useState<number | null>(null);
  const [openedAt] = useState(() => Date.now());
  const slots = SLOTS.filter((slot) => new Date(`${slot.date}T${slot.time}:00+01:00`).getTime() > openedAt);
  const selected = picked === null ? null : slots[picked] ?? null;
  const contactParams = new URLSearchParams({
    type: 'speaking',
    subject: lang === 'fr' ? 'Demande de rendez-vous' : 'Meeting request',
    message: selected
      ? (lang === 'fr'
          ? `Bonjour, je souhaite demander le créneau du ${selected.date} à ${selected.time} ${selected.tz} (${selected.type}, 30 min).`
          : `Hello, I would like to request the ${selected.date} at ${selected.time} ${selected.tz} slot (${selected.type}, 30 min).`)
      : '',
  });

  return (
    <div className="rounded-2xl border border-pine-900/10 bg-white p-5 shadow-card sm:p-6">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-pine-600">
        <Calendar size={14} /> {lang === 'fr' ? 'Prendre un rendez-vous' : 'Book a meeting'}
      </p>
      <h3 className="mt-2 font-display text-lg font-semibold text-pine-950">
        {lang === 'fr' ? 'Disponibilités du Dr Dagnon' : 'Dr Dagnon’s availability'}
      </h3>
      <p className="mt-1 text-sm text-pine-900/65">
        {lang === 'fr' ? 'Créneaux indicatifs — confirmation par email sous 24 h.' : 'Indicative slots — confirmation by email within 24h.'}
      </p>

      <div className="mt-4 grid gap-2">
        {slots.map((s, i) => (
          <button
            key={`${s.date}-${s.time}`}
            type="button"
            onClick={() => setPicked(i)}
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all ${picked === i ? 'border-gold-500 bg-gold-500/10' : 'border-pine-900/10 bg-pine-50 hover:border-gold-500/30 hover:bg-white'}`}
          >
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${picked === i ? 'bg-gold-500 text-pine-950' : 'bg-pine-950 text-gold-400'}`}>
              {s.type === 'Visio' ? <Video size={16} /> : <MapPin size={16} />}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-pine-950">{s.date} · {s.time} {s.tz}</span>
              <span className="block text-xs text-pine-900/60">{s.type} · 30 min</span>
            </span>
            {picked === i ? <CheckCircle2 size={18} className="text-gold-600" /> : <Clock size={16} className="text-pine-900/25" />}
          </button>
        ))}
      </div>

      {slots.length === 0 && (
        <p className="mt-4 rounded-xl bg-pine-50 p-4 text-sm text-pine-900/70">
          {lang === 'fr' ? 'Aucun créneau indicatif n’est actuellement publié. Envoyez une demande pour convenir d’une date.' : 'No indicative slot is currently published. Send a request to arrange a date.'}
        </p>
      )}

      <Link
        to={`${localePath(lang, '/contact')}?${contactParams.toString()}`}
        className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all ${selected || slots.length === 0 ? 'bg-gold-500 text-pine-950 hover:bg-gold-400 hover:-translate-y-0.5' : 'bg-pine-100 text-pine-900/40'}`}
        aria-disabled={!selected && slots.length > 0}
        onClick={(e) => { if (!selected && slots.length > 0) e.preventDefault(); }}
      >
        {selected ? (lang === 'fr' ? 'Demander ce créneau' : 'Request this slot') : (lang === 'fr' ? 'Proposer une autre date' : 'Suggest another date')}
        <ArrowUpRight size={16} />
      </Link>
      <p className="mt-2 text-center text-[11px] text-pine-900/50">
        {lang === 'fr' ? 'Via le formulaire — sujet pré-rempli. Aucune donnée de calendrier externe.' : 'Via the form — subject pre-filled. No external calendar data.'}
      </p>
    </div>
  );
}
