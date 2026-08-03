import { useEffect, useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router';
import { SlidersHorizontal, Check, CalendarClock, MailWarning } from 'lucide-react';
import { useLang } from '@/i18n/useLang';
import { UI } from '@/i18n/translations';

/* Client-only page, reached from the "Préférences / Preferences" link in
   every digest email. The email+token pair in the URL authenticates the
   subscriber (purpose 'nl-prefs', see api/_tokens.ts); the page reads and
   saves the frequency via /api/newsletter-prefs. Never prerendered or
   indexed (rewritten to the SPA shell in vercel.json). */

export default function NewsletterPrefs() {
  const { lang } = useLang();
  const t = UI[lang];
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') ?? '';
  const token = searchParams.get('token') ?? '';

  const [frequency, setFrequency] = useState<'weekly' | 'monthly' | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'invalid' | 'saving' | 'saved' | 'error'>(
    () => (email && token ? 'loading' : 'invalid'),
  );
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = t['prefs.title'];
    const robots = document.querySelector('meta[name="robots"]');
    if (robots) robots.setAttribute('content', 'noindex, follow');
    document.head.querySelectorAll('link[rel="canonical"]').forEach((el) => el.remove());
  }, [t]);

  useEffect(() => {
    if (!email || !token) return;
    let cancelled = false;
    const load = async () => {
      try {
        const response = await fetch(`/api/newsletter-prefs?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`);
        if (!response.ok) {
          if (!cancelled) setStatus('invalid');
          return;
        }
        const body = (await response.json()) as { frequency?: 'weekly' | 'monthly' };
        if (!cancelled) {
          setFrequency(body.frequency ?? 'weekly');
          setStatus('ready');
        }
      } catch {
        if (!cancelled) setStatus('invalid');
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [email, token]);

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!frequency) return;
    setStatus('saving');
    try {
      const response = await fetch(`/api/newsletter-prefs?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ frequency }),
      });
      if (!response.ok) {
        setError(response.status === 400 ? t['prefs.errorInvalid'] : t['prefs.errorServer']);
        setStatus('error');
        return;
      }
      setStatus('saved');
    } catch {
      setError(t['prefs.errorNetwork']);
      setStatus('error');
    }
  };

  const options = [
    { value: 'weekly', icon: MailWarning, title: t['prefs.weekly'], detail: t['prefs.weeklyDetail'] },
    { value: 'monthly', icon: CalendarClock, title: t['prefs.monthly'], detail: t['prefs.monthlyDetail'] },
  ] as const;

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-pine-950">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 texture-net" />
        <div className="absolute -top-40 -right-40 h-[560px] w-[560px] rounded-full bg-pine-600/25 blur-[130px]" />

        <div className="relative mx-auto max-w-2xl px-5 pb-24 pt-32 lg:px-8 lg:pt-36">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-300">
            <SlidersHorizontal size={13} />
            {t['prefs.badge']}
          </span>
          <h1 className="mt-7 font-display text-[2.6rem] leading-[1.05] font-medium text-pine-100 sm:text-5xl">
            {t['prefs.title']}
          </h1>
          {email && status !== 'invalid' && (
            <p className="mt-3 text-sm text-pine-100/85">
              {t['prefs.for']} <span className="font-semibold text-pine-100/90">{email}</span>
            </p>
          )}

          {status === 'loading' && <p className="mt-10 text-sm text-pine-100/70">{t['prefs.loading']}</p>}

          {status === 'invalid' && (
            <p className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-pine-100/80">
              {t['prefs.invalid']}
            </p>
          )}

          {status !== 'loading' && status !== 'invalid' && (
            <form onSubmit={save} className="mt-10 space-y-4">
              <div role="radiogroup" aria-label={t['prefs.title']} className="space-y-3">
                {options.map((o) => (
                  <label
                    key={o.value}
                    className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-5 transition-colors ${
                      frequency === o.value
                        ? 'border-gold-500/60 bg-gold-500/10'
                        : 'border-white/10 bg-white/5 hover:border-white/25'
                    }`}
                  >
                    <input
                      type="radio"
                      name="frequency"
                      value={o.value}
                      checked={frequency === o.value}
                      onChange={() => setFrequency(o.value)}
                      disabled={status === 'saving' || status === 'saved'}
                      className="mt-1 h-4 w-4 accent-gold-500"
                    />
                    <span>
                      <span className="flex items-center gap-2 font-display text-base font-semibold text-ivory">
                        <o.icon size={15} className="text-gold-400" />
                        {o.title}
                      </span>
                      <span className="mt-1 block text-[13px] leading-relaxed text-pine-100/65">{o.detail}</span>
                    </span>
                  </label>
                ))}
              </div>

              {status === 'saved' ? (
                <p className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-pine-950">
                  <Check size={16} />
                  {t['prefs.saved']}
                </p>
              ) : (
                <button
                  type="submit"
                  disabled={status === 'saving' || !frequency}
                  className="rounded-full bg-gold-500 px-7 py-3 text-sm font-semibold text-pine-950 transition-all hover:-translate-y-0.5 hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {status === 'saving' ? '…' : t['prefs.save']}
                </button>
              )}
              {status === 'error' && <p className="text-[13px] font-medium text-red-300">{error}</p>}

              <p className="pt-4 text-[12.5px] leading-relaxed text-pine-100/70">{t['prefs.unsubNote']}</p>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
