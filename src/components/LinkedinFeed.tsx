import { Linkedin, ExternalLink, ArrowUpRight } from 'lucide-react';
import { useLang } from '@/i18n/useLang';
import { LINKS } from '@/data/content';

const POSTS = [
  { date: '2026-07-21', text: { fr: 'Visite AIRID — renforcer la recherche au Bénin', en: 'AIRID visit — strengthening research in Benin' }, url: 'https://airid-africa.com/public/news/28-airid-welcomes-dr-seynude-jean-fortune-dagnon-from-the-gates-foundation' },
  { date: '2026-06-17', text: { fr: 'Cours paludisme — Harvard SDM', en: 'Malaria course — Harvard SDM' }, url: LINKS.linkedin },
  { date: '2026-05-01', text: { fr: 'Tribune : du contrôle à l’élimination', en: 'Op-ed: from control to elimination' }, url: 'https://africahealthwatch.com/from-malaria-control-to-elimination-the-turn-we-need-to-make/' },
];

export function LinkedinFeed() {
  const { lang } = useLang();
  return (
    <div className="rounded-2xl border border-pine-900/10 bg-white p-6 shadow-card sm:p-7">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-pine-600">
        <Linkedin size={14} className="text-[#0A66C2]" /> {lang === 'fr' ? 'Sur LinkedIn' : 'On LinkedIn'}
      </p>
      <h3 className="mt-2 font-display text-xl font-semibold text-pine-950">
        {lang === 'fr' ? 'Dernières publications' : 'Recent posts'}
      </h3>
      <div className="mt-4 space-y-3">
        {POSTS.map((p) => (
          <a key={p.date} href={p.url} target="_blank" rel="noreferrer" className="flex items-start gap-3 rounded-xl border border-pine-900/5 bg-pine-50 px-4 py-3 transition-colors hover:border-[#0A66C2]/30 hover:bg-white dark:border-white/5 dark:bg-pine-900/30 dark:hover:border-gold-500/30 dark:hover:bg-pine-800/60">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0A66C2] text-white">
              <Linkedin size={13} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium leading-tight text-pine-950">{p.text[lang]}</span>
              <span className="block text-xs text-pine-900/60">{p.date}</span>
            </span>
            <ExternalLink size={14} className="mt-1 shrink-0 text-pine-900/25" />
          </a>
        ))}
      </div>
      <a href={LINKS.linkedin} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0A66C2] hover:underline">
        {lang === 'fr' ? 'Voir le profil' : 'View profile'} <ArrowUpRight size={14} />
      </a>
    </div>
  );
}
