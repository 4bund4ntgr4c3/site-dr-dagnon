import { useEffect, useState, type FormEvent } from 'react';
import { Lock, Users, BellRing, Mail, CalendarClock, LogOut } from 'lucide-react';
import { useLang } from '@/i18n/useLang';
import { UI } from '@/i18n/translations';

/* Private dashboard, client-only: the route is served through the SPA
   rewrite (vercel.json) and never prerendered, sitemapped or indexed. The
   page itself reasserts noindex on mount in case it is ever reached with a
   stale <head>. */

interface Dashboard {
  subscribers: number;
  subscribersSample: string[];
  pushSubs: number;
  lastDigest: { ids: string[] };
  remindedEvents: { ids: string[] };
}

const AUTH_KEY = 'admin-auth';

export default function Admin() {
  const { lang } = useLang();
  const t = UI[lang];
  const [token, setToken] = useState(() => sessionStorage.getItem(AUTH_KEY) ?? '');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [data, setData] = useState<Dashboard | null>(null);

  useEffect(() => {
    document.title = t['admin.title'];
    const robots = document.querySelector('meta[name="robots"]');
    if (robots) robots.setAttribute('content', 'noindex, follow');
    document.head.querySelectorAll('link[rel="canonical"]').forEach((el) => el.remove());
  }, [t]);

  const load = async (secret: string) => {
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/admin', {
        headers: { Authorization: `Bearer ${secret}` },
      });
      if (!response.ok) {
        setError(response.status === 401 ? t['admin.errorAuth'] : t['admin.errorServer']);
        return;
      }
      const body = (await response.json()) as Dashboard;
      setData(body);
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
    setData(null);
  };

  const cards = data
    ? [
        { icon: Users, label: t['admin.subscribers'], value: data.subscribers },
        { icon: BellRing, label: t['admin.pushSubs'], value: data.pushSubs },
        { icon: Mail, label: t['admin.lastDigest'], value: String(data.lastDigest.ids.length) },
        { icon: CalendarClock, label: t['admin.reminded'], value: String(data.remindedEvents.ids.length) },
      ]
    : [];

  return (
    <main id="main-content" className="min-h-screen bg-pine-950">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 texture-net" />
        <div className="absolute -top-40 -right-40 h-[560px] w-[560px] rounded-full bg-pine-600/25 blur-[130px]" />

        <div className="relative mx-auto max-w-4xl px-5 pb-24 pt-32 lg:px-8 lg:pt-36">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-300">
            <Lock size={13} />
            {t['admin.badge']}
          </span>
          <h1 className="mt-7 font-display text-[2.6rem] leading-[1.05] font-medium text-pine-100 sm:text-6xl">
            {t['admin.title']}
          </h1>

          {!data && (
            <form onSubmit={submit} className="mt-10 max-w-md">
              <label htmlFor="admin-secret" className="text-[12.5px] font-semibold uppercase tracking-[0.2em] text-pine-100/70">
                {t['admin.secretLabel']}
              </label>
              <div className="mt-3 flex gap-3">
                <input
                  id="admin-secret"
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

          {data && (
            <div className="mt-10">
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {cards.map((c) => (
                  <div key={c.label} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                    <c.icon size={18} className="text-gold-400" />
                    <p className="mt-3 font-display text-3xl font-semibold text-ivory">{c.value}</p>
                    <p className="mt-1 text-[11.5px] font-semibold uppercase tracking-wider text-pine-100/60">{c.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <h2 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-gold-300">
                    {t['admin.subscribersSample']}
                  </h2>
                  {data.subscribersSample.length === 0 ? (
                    <p className="mt-3 text-[13px] text-pine-100/60">{t['admin.empty']}</p>
                  ) : (
                    <ul className="mt-3 space-y-1.5 text-[13px] text-pine-100/80">
                      {data.subscribersSample.map((email) => (
                        <li key={email} className="truncate">
                          {email}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <h2 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-gold-300">
                    {t['admin.lastDigestIds']}
                  </h2>
                  {data.lastDigest.ids.length === 0 ? (
                    <p className="mt-3 text-[13px] text-pine-100/60">{t['admin.empty']}</p>
                  ) : (
                    <ul className="mt-3 space-y-1.5 text-[13px] text-pine-100/80">
                      {data.lastDigest.ids.map((id) => (
                        <li key={id} className="truncate font-mono text-[12px]">
                          {id}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={logout}
                className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-2.5 text-sm font-semibold text-pine-100/80 transition-colors hover:border-gold-400 hover:text-gold-300"
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
