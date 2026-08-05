import { useEffect, useState, type FormEvent } from 'react';
import { Lock, History, LogOut } from 'lucide-react';
import { useLang } from '@/i18n/useLang';
import { UI } from '@/i18n/translations';

/* Private changelog, client-only: the route is served through the SPA
   rewrite (vercel.json) and never prerendered, sitemapped or indexed. The
   page itself reasserts noindex on mount, and the entries come from
   /api/changelog — never from the bundle. */

interface ChangelogEntry {
  date: string;
  version?: string;
  fr: string[];
  en: string[];
}

const AUTH_KEY = 'changelog-auth';

export default function Changelog() {
  const { lang } = useLang();
  const t = UI[lang];
  const [token, setToken] = useState(() => sessionStorage.getItem(AUTH_KEY) ?? '');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [entries, setEntries] = useState<ChangelogEntry[] | null>(null);

  useEffect(() => {
    document.title = t['changelog.title'];
    const robots = document.querySelector('meta[name="robots"]');
    if (robots) robots.setAttribute('content', 'noindex, follow');
    document.head.querySelectorAll('link[rel="canonical"]').forEach((el) => el.remove());
  }, [t]);

  const load = async (secret: string) => {
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/changelog', {
        headers: { Authorization: `Bearer ${secret}` },
      });
      if (!response.ok) {
        setError(response.status === 401 ? t['admin.errorAuth'] : t['admin.errorServer']);
        return;
      }
      const body = (await response.json()) as { entries: ChangelogEntry[] };
      setEntries(body.entries);
      sessionStorage.setItem(AUTH_KEY, secret);
    } catch {
      setError(t['admin.errorNetwork']);
    } finally {
      setBusy(false);
    }
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const value = (e.target as HTMLFormElement).querySelector('input')?.value ?? '';
    if (value) void load(value);
  };

  const logout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    setToken('');
    setEntries(null);
  };

  const fmtDate = (iso: string) =>
    new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(
      new Date(`${iso}T00:00:00Z`),
    );

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-pine-950">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 texture-net" />
        <div className="absolute -top-40 -right-40 h-[560px] w-[560px] rounded-full bg-pine-600/25 blur-[130px]" />

        <div className="relative mx-auto max-w-4xl px-5 pb-24 pt-32 lg:px-8 lg:pt-36">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-300">
            <History size={13} />
            {t['changelog.badge']}
          </span>
          <h1 className="mt-7 font-display text-[2.6rem] leading-[1.05] font-medium text-pine-100 sm:text-6xl">
            {t['changelog.title']}
          </h1>
          <p className="mt-4 max-w-2xl font-display text-lg italic text-pine-200/90 sm:text-xl">
            {t['changelog.intro']}
          </p>

          {!entries && (
            <form onSubmit={submit} className="mt-10 max-w-md">
              <label htmlFor="changelog-secret" className="text-[12.5px] font-semibold uppercase tracking-[0.2em] text-pine-100/70">
                {t['admin.secretLabel']}
              </label>
              <div className="mt-3 flex gap-3">
                <input
                  id="changelog-secret"
                  type="password"
                  autoComplete="current-password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm text-ivory outline-none transition-colors placeholder:text-pine-100/40 focus:border-gold-500/50"
                />
                <button
                  type="submit"
                  disabled={busy || !token}
                  className="shrink-0 rounded-full bg-gold-500 px-7 py-3 text-sm font-semibold text-pine-950 transition-all hover:-translate-y-0.5 hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {busy ? '…' : t['admin.enter']}
                </button>
              </div>
              {error && <p className="mt-3 text-[13px] font-medium text-red-300">{error}</p>}
            </form>
          )}

          {entries && (
            <div className="mt-10">
              <ol className="relative space-y-8 border-l border-white/10 pl-8">
                {entries.map((entry) => (
                  <li key={entry.date} className="relative">
                    <span className="absolute top-1.5 -left-[2.35rem] flex h-5 w-5 items-center justify-center rounded-full border border-gold-500/40 bg-pine-950">
                      <span className="h-2 w-2 rounded-full bg-gold-400" />
                    </span>
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <time dateTime={entry.date} className="text-[12.5px] font-semibold uppercase tracking-[0.2em] text-pine-100/70">
                        {fmtDate(entry.date)}
                      </time>
                      {entry.version && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-500/40 bg-gold-500/10 px-3 py-1 text-[11px] font-bold text-gold-300">
                          <Lock size={10} />
                          v{entry.version}
                        </span>
                      )}
                    </div>
                    <ul className="mt-3 space-y-2">
                      {(lang === 'fr' ? entry.fr : entry.en).map((change, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-[14.5px] leading-relaxed text-pine-100/80">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold-400" />
                          {change}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>

              <button
                type="button"
                onClick={logout}
                className="mt-10 inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-2.5 text-sm font-semibold text-pine-100/80 transition-colors hover:border-gold-400 hover:text-gold-300"
              >
                <LogOut size={15} />
                {t['admin.logout']}
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
