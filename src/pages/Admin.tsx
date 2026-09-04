import { useEffect, useState, type FormEvent } from 'react';
import { Lock, Users, BellRing, Mail, CalendarClock, LogOut, Send, CheckCircle2, AlertCircle, Search, BarChart3 } from 'lucide-react';
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
  searchTotal: number;
  topQueries: { query: string; count: number }[];
  recentQueries: string[];
}

const AUTH_KEY = 'admin-auth';
const readToken = () => { try { return sessionStorage.getItem(AUTH_KEY) ?? ''; } catch { return ''; } };
const saveToken = (value: string) => { try { sessionStorage.setItem(AUTH_KEY, value); } catch { /* session-only fallback */ } };
const clearToken = () => { try { sessionStorage.removeItem(AUTH_KEY); } catch { /* already unavailable */ } };

export default function Admin() {
  const { lang } = useLang();
  const t = UI[lang];
  const [token, setToken] = useState(readToken);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [data, setData] = useState<Dashboard | null>(null);

  /* push composer state */
  const [pushTitle, setPushTitle] = useState('');
  const [pushBody, setPushBody] = useState('');
  const [pushUrl, setPushUrl] = useState('');
  const [pushStatus, setPushStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [pushResult, setPushResult] = useState<{ sent: number; failed: number } | null>(null);

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
      saveToken(secret);
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
    clearToken();
    setToken('');
    setData(null);
  };

  const cards = data
    ? [
        { icon: Users, label: t['admin.subscribers'], value: data.subscribers },
        { icon: BellRing, label: t['admin.pushSubs'], value: data.pushSubs },
        { icon: Mail, label: t['admin.lastDigest'], value: String(data.lastDigest.ids.length) },
        { icon: CalendarClock, label: t['admin.reminded'], value: String(data.remindedEvents.ids.length) },
        { icon: Search, label: t['admin.searchTotal'], value: data.searchTotal },
      ]
    : [];

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-pine-950">
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
                    <p className="mt-1 text-[11.5px] font-semibold uppercase tracking-wider text-pine-100/85">{c.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <h2 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-gold-300">
                    {t['admin.subscribersSample']}
                  </h2>
                  {data.subscribersSample.length === 0 ? (
                    <p className="mt-3 text-[13px] text-pine-100/85">{t['admin.empty']}</p>
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
                    <p className="mt-3 text-[13px] text-pine-100/85">{t['admin.empty']}</p>
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

              {/* push notification composer */}
              <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
                <h2 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-gold-300">
                  {t['admin.pushComposer']}
                </h2>
                <p className="mt-2 text-[13px] text-pine-100/70">
                  {t['admin.pushComposerDesc']}
                </p>
                {pushStatus === 'done' && pushResult ? (
                  <div className="mt-4 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-pine-100/85">
                    <CheckCircle2 size={16} className="text-gold-400" />
                    {t['admin.pushDone'].replace('{sent}', String(pushResult.sent)).replace('{failed}', String(pushResult.failed))}
                  </div>
                ) : (
                  <form
                    className="mt-4 space-y-3"
                    onSubmit={async (ev) => {
                      ev.preventDefault();
                      if (pushStatus === 'sending') return;
                      setPushStatus('sending');
                      setPushResult(null);
                      try {
                        const res = await fetch('/api/push-send', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                          body: JSON.stringify({ title: pushTitle, body: pushBody, url: pushUrl || undefined }),
                        });
                        const body = (await res.json().catch(() => null)) as { sent?: number; failed?: number; error?: string } | null;
                        if (!res.ok) throw new Error(body?.error || 'failed');
                        setPushResult({ sent: body?.sent ?? 0, failed: body?.failed ?? 0 });
                        setPushStatus('done');
                        setPushTitle('');
                        setPushBody('');
                        setPushUrl('');
                      } catch {
                        setPushStatus('error');
                      }
                    }}
                  >
                    <div>
                      <label htmlFor="push-title" className="sr-only">{t['admin.pushTitle']}</label>
                      <input
                        id="push-title"
                        type="text"
                        required
                        maxLength={200}
                        value={pushTitle}
                        onChange={(e) => setPushTitle(e.target.value)}
                        placeholder={t['admin.pushTitle']}
                        className="w-full rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-ivory outline-none transition-colors placeholder:text-pine-100/40 focus:border-gold-500/50"
                      />
                    </div>
                    <div>
                      <label htmlFor="push-body" className="sr-only">{t['admin.pushBody']}</label>
                      <textarea
                        id="push-body"
                        required
                        maxLength={500}
                        rows={3}
                        value={pushBody}
                        onChange={(e) => setPushBody(e.target.value)}
                        placeholder={t['admin.pushBody']}
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-ivory outline-none transition-colors placeholder:text-pine-100/40 focus:border-gold-500/50 resize-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="push-url" className="sr-only">{t['admin.pushUrl']}</label>
                      <input
                        id="push-url"
                        type="url"
                        value={pushUrl}
                        onChange={(e) => setPushUrl(e.target.value)}
                        placeholder={t['admin.pushUrlOptional']}
                        className="w-full rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-ivory outline-none transition-colors placeholder:text-pine-100/40 focus:border-gold-500/50"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="submit"
                        disabled={pushStatus === 'sending' || !pushTitle.trim() || !pushBody.trim()}
                        className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-2.5 text-sm font-semibold text-pine-950 transition-all hover:-translate-y-0.5 hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {pushStatus === 'sending' ? '…' : t['admin.pushSend']}
                        <Send size={14} />
                      </button>
                      {pushStatus === 'error' && (
                        <span className="flex items-center gap-1.5 text-[13px] text-red-300">
                          <AlertCircle size={14} />
                          {t['admin.pushError']}
                        </span>
                      )}
                    </div>
                  </form>
                )}
              </div>

              {/* search analytics */}
              <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
                <h2 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-gold-300">
                  {t['admin.searchAnalytics']}
                </h2>
                {data.topQueries.length === 0 && data.recentQueries.length === 0 ? (
                  <p className="mt-3 text-[13px] text-pine-100/85">{t['admin.searchEmpty']}</p>
                ) : (
                  <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    {data.topQueries.length > 0 && (
                      <div>
                        <h3 className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider text-pine-100/70">
                          <BarChart3 size={13} />
                          {t['admin.searchTop']}
                        </h3>
                        <ul className="mt-2 space-y-1">
                          {data.topQueries.map(({ query, count }) => (
                            <li key={query} className="flex items-center justify-between text-[13px] text-pine-100/80">
                              <span className="truncate">«&nbsp;{query}&nbsp;»</span>
                              <span className="ml-2 shrink-0 rounded-full bg-white/5 px-2 py-0.5 text-[11px] font-semibold text-gold-400">
                                {count}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {data.recentQueries.length > 0 && (
                      <div>
                        <h3 className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider text-pine-100/70">
                          <Search size={13} />
                          {t['admin.searchRecent']}
                        </h3>
                        <ul className="mt-2 space-y-1 text-[13px] text-pine-100/80">
                          {data.recentQueries.slice(0, 10).map((q, i) => (
                            <li key={`${q}-${i}`} className="truncate">«&nbsp;{q}&nbsp;»</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
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
