import { useState } from 'react';
import { ChevronDown, MapPin, Building2, Award, Calendar } from 'lucide-react';
import { useLang } from '@/i18n/useLang';
import { EXPERIENCE } from '@/data/site';

export function CareerTimeline() {
  const { lang } = useLang();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="relative">
      <div className="absolute left-4 top-2 h-[calc(100%-16px)] w-px bg-gradient-to-b from-gold-500/60 via-pine-900/10 to-transparent sm:left-6" aria-hidden="true" />
      <div className="space-y-6">
        {EXPERIENCE[lang].map((exp, i) => {
          const isOpen = open === i;
          return (
            <div key={`${exp.org}-${i}`} className="relative pl-10 sm:pl-14">
              {/* dot */}
              <div className={`absolute left-0 top-3 flex h-8 w-8 items-center justify-center rounded-full border-2 bg-white shadow-sm sm:left-2 ${exp.current ? 'border-gold-500 bg-gold-500 text-pine-950' : 'border-pine-900/15 bg-white text-pine-700'}`}>
                {exp.current ? <Award size={14} /> : <Building2 size={14} />}
                {exp.current && <span className="absolute inset-0 animate-ping rounded-full border border-gold-500/40" aria-hidden="true" />}
              </div>

              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-start justify-between gap-3 rounded-xl border border-pine-900/10 bg-white px-4 py-4 text-left shadow-sm transition-all hover:border-gold-500/30 hover:shadow-md sm:px-5"
              >
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2 text-xs">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${exp.current ? 'bg-gold-500 text-pine-950' : 'bg-pine-950 text-gold-400'}`}>
                      <Calendar size={11} /> {exp.period}
                    </span>
                    <span className="inline-flex items-center gap-1 text-pine-900/70"><MapPin size={11} /> {exp.org}</span>
                  </span>
                  <span className="mt-2 block font-display text-[15px] font-semibold leading-tight text-pine-950">{exp.role}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-pine-900 line-clamp-2">{exp.text}</span>
                </span>
                <ChevronDown size={18} className={`mt-1 shrink-0 text-gold-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>

              {isOpen && (
                <div className="ml-1 mt-3 rounded-xl border border-pine-900/5 bg-pine-50 p-4 sm:ml-2 sm:p-5">
                  <ul className="space-y-1.5">
                    {exp.details.responsibilities.slice(0, 4).map((r, j) => (
                      <li key={j} className="flex gap-2 text-sm leading-relaxed text-pine-900">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold-500" aria-hidden="true" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                  {exp.details.achievement && (
                    <p className="mt-3 rounded-lg bg-gold-500/10 px-3 py-2 text-sm font-medium leading-relaxed text-pine-900">
                      <Award size={14} className="mr-1.5 inline text-gold-600" />{exp.details.achievement}
                    </p>
                  )}
                  {exp.details.projects && exp.details.projects.length > 0 && (
                    <p className="mt-3 text-xs text-pine-900/70">
                      {lang === 'fr' ? `${exp.details.projects.length} subventions` : `${exp.details.projects.length} grants`} · {exp.details.projects.slice(0, 2).map((p) => p.name).join(' · ')}
                      {exp.details.projects.length > 2 ? ' …' : ''}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
