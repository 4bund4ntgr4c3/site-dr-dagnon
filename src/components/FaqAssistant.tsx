import { useMemo, useState } from 'react';
import { Search, MessageCircle, ChevronRight, Sparkles } from 'lucide-react';
import { useLang } from '@/i18n/useLang';
import { FAQ_ITEMS } from '@/data/faq';
import { TRIBUNES } from '@/data/tribunes';
import { PUB_ITEMS } from '@/data/publications';
import { PROJECTS } from '@/data/projects';
import { localePath } from '@/i18n/routing';
import { Link } from 'react-router';

type Hit = { label: string; href: string; excerpt: string; score: number };

function normalize(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function score(query: string, hay: string) {
  const q = normalize(query).split(/\s+/).filter(Boolean);
  const h = normalize(hay);
  let sc = 0;
  for (const w of q) {
    if (h.includes(w)) sc += w.length > 3 ? 2 : 1;
    if (h.split(/\s+/).includes(w)) sc += 1;
  }
  return sc;
}

export function FaqAssistant() {
  const { lang } = useLang();
  const [q, setQ] = useState('');

  const hits: Hit[] = useMemo(() => {
    if (q.trim().length < 2) return [];
    const out: Hit[] = [];
    for (const f of FAQ_ITEMS) {
      const hay = `${f.question[lang]} ${f.answer[lang]}`;
      const s = score(q, hay);
      if (s > 0) out.push({ label: f.question[lang], href: localePath(lang, '/presse'), excerpt: f.answer[lang].slice(0, 120) + '…', score: s + 2 });
    }
    for (const t of TRIBUNES) {
      const hay = `${t.title[lang]} ${t.description[lang]}`;
      const s = score(q, hay);
      if (s > 1) out.push({ label: t.title[lang], href: localePath(lang, `/tribunes/${t.slug}`), excerpt: t.description[lang], score: s });
    }
    for (const p of PUB_ITEMS.slice(0, 8)) {
      const hay = `${p.title[lang]} ${p.journal[lang]}`;
      const s = score(q, hay);
      if (s > 1) out.push({ label: p.title[lang], href: localePath(lang, '/publications'), excerpt: p.journal[lang], score: s });
    }
    for (const pr of PROJECTS) {
      const hay = `${pr.title[lang]} ${pr.description[lang]}`;
      const s = score(q, hay);
      if (s > 1) out.push({ label: pr.title[lang], href: localePath(lang, `/projets/${pr.slug}`), excerpt: pr.description[lang].slice(0, 110) + '…', score: s });
    }
    return out.sort((a, b) => b.score - a.score).slice(0, 6);
  }, [q, lang]);

  return (
    <div className="rounded-2xl border border-pine-900/10 bg-white p-5 shadow-card sm:p-6">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-pine-600">
        <Sparkles size={14} className="text-gold-500" /> {lang === 'fr' ? 'Assistant du site' : 'Site assistant'}
      </p>
      <h3 className="mt-2 font-display text-lg font-semibold text-pine-950">
        {lang === 'fr' ? 'Posez une question au site' : 'Ask the site a question'}
      </h3>
      <p className="mt-1 text-sm text-pine-900/65">
        {lang === 'fr' ? 'Recherche locale dans FAQ, tribunes, publications et projets — sans envoi réseau.' : 'Local search across FAQ, op-eds, publications and projects — no network request.'}
      </p>

      <label className="relative mt-4 flex items-center">
        <Search size={16} className="pointer-events-none absolute left-3.5 text-pine-900/35" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={lang === 'fr' ? 'Ex. chimioprévention, MILDA, Bénin, IRS…' : 'E.g. chemoprevention, LLIN, Benin, IRS…'}
          className="w-full rounded-full border border-pine-900/10 bg-pine-50 py-2.5 pl-10 pr-4 text-sm text-pine-950 placeholder:text-pine-900/45 focus:border-gold-500/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold-500/20"
        />
      </label>

      {q.trim().length >= 2 && (
        <div className="mt-4">
          {hits.length === 0 ? (
            <p className="rounded-xl bg-pine-50 px-4 py-3 text-sm text-pine-900/70">
              {lang === 'fr' ? 'Aucun résultat. Essayez un autre mot-clé.' : 'No results. Try another keyword.'}
            </p>
          ) : (
            <ul className="divide-y divide-pine-900/5 rounded-xl border border-pine-900/5 bg-pine-50/50">
              {hits.map((h) => (
                <li key={h.label}>
                  <Link to={h.href} className="group flex items-start gap-3 px-4 py-3 transition-colors hover:bg-white">
                    <MessageCircle size={16} className="mt-0.5 shrink-0 text-gold-600" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold leading-tight text-pine-950 group-hover:text-gold-700">{h.label}</span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-pine-900/60 line-clamp-2">{h.excerpt}</span>
                    </span>
                    <ChevronRight size={14} className="mt-1 shrink-0 text-pine-900/20 group-hover:text-gold-600" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-2 text-[11px] text-pine-900/45">
            {lang === 'fr' ? 'Astuce : l’assistant ne quitte jamais votre appareil — idéal en zone à faible connectivité.' : 'Tip: the assistant never leaves your device — ideal on low connectivity.'}
          </p>
        </div>
      )}
    </div>
  );
}
