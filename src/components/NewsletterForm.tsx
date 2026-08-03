import { useId, useState, type FormEvent } from 'react';
import { CheckCircle2, MailCheck, AlertCircle, Send } from 'lucide-react';
import { useLang } from '@/i18n/useLang';
import { UI } from '@/i18n/translations';

type Status = 'idle' | 'sending' | 'pending' | 'success' | 'error';

/* One form, two sizes: the section variant sits on the home page, the
   compact one in the footer. Both share the same API contract, states and
   honeypot. Subscribing now means "requesting an invitation": the API
   emails a confirmation link (double opt-in), so `pending` is the normal
   end state — `success` only appears when the address was already on the
   list. */
export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const { lang } = useLang();
  const t = UI[lang];
  const id = useId();

  const [email, setEmail] = useState('');
  /* `website` is the honeypot — never shown, never filled by a person. */
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (status === 'sending') return;
    if (!validEmail) {
      setStatus('error');
      setMessage(t['newsletter.invalid']);
      return;
    }
    setStatus('sending');
    setMessage('');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), lang, website }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) throw new Error('failed');
      /* the API answers identically whether the address was already on the
         list or newly staged — no oracle for probing subscriptions */
      if (body?.pending) {
        setStatus('pending');
        setEmail('');
      } else {
        setStatus('success');
      }
    } catch {
      setStatus('error');
      setMessage(t['newsletter.error']);
    }
  };

  if (status === 'pending') {
    return (
      <div
        role="status"
        className={`flex items-center justify-center gap-2 rounded-full border text-sm font-semibold ${
          compact
            ? 'h-11 border-white/10 bg-white/5 px-6 text-pine-100/85 backdrop-blur'
            : 'border-pine-900/10 bg-white px-6 py-3.5 text-pine-900 shadow-sm'
        }`}
      >
        <MailCheck size={18} className={`shrink-0 ${compact ? 'text-gold-400' : 'text-gold-500'}`} />
        <span className="text-center">{t['newsletter.pending']}</span>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div
        role="status"
        className={`flex items-center justify-center gap-2 rounded-full border text-sm font-semibold ${
          compact
            ? 'h-11 border-white/10 bg-white/5 px-6 text-pine-100/85 backdrop-blur'
            : 'border-pine-900/10 bg-white px-6 py-3.5 text-pine-900 shadow-sm'
        }`}
      >
        <CheckCircle2 size={18} className={`shrink-0 ${compact ? 'text-gold-400' : 'text-gold-500'}`} />
        <span className="text-center">{message || t['newsletter.success']}</span>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      {/* honeypot — hidden from people, ignored by screen readers,
          skipped by keyboard navigation. Bots fill it; the API then drops
          the subscription without sending anything. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={`${id}-website`}>Do not fill this in</label>
        <input
          id={`${id}-website`}
          type="text"
          name="website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className={`flex gap-2.5 ${compact ? '' : 'mx-auto max-w-xl'}`}>
        <label htmlFor={`${id}-email`} className="sr-only">
          {t['newsletter.placeholder']}
        </label>
        <input
          id={`${id}-email`}
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t['newsletter.placeholder']}
          aria-required="true"
          aria-invalid={status === 'error'}
          className={`w-full rounded-full border text-sm outline-none transition-colors focus:ring-2 ${
            compact
              ? 'h-11 border-white/10 bg-white/5 px-5 text-ivory placeholder:text-pine-100/55 backdrop-blur focus:border-gold-400/50 focus:ring-gold-400/10'
              : 'border-pine-900/10 bg-white px-6 py-3.5 text-pine-900 placeholder:text-pine-900/65 focus:border-gold-500/40 focus:ring-gold-500/10'
          }`}
        />
        <button
          type="submit"
          disabled={status === 'sending'}
          className={`inline-flex shrink-0 items-center gap-2 rounded-full bg-gold-500 font-semibold text-pine-950 transition-all hover:-translate-y-0.5 hover:bg-gold-400 disabled:opacity-60 ${
            compact ? 'h-11 px-5 text-[13px]' : 'px-7 py-3.5 text-sm'
          }`}
        >
          {status === 'sending' ? t['newsletter.sending'] : t['newsletter.button']}
          <Send size={15} />
        </button>
      </div>

      {status === 'error' && (
        <p
          role="alert"
          className={`flex items-center justify-center gap-1.5 text-xs ${compact ? 'mt-2' : 'mt-3'}`}
        >
          <AlertCircle size={13} className={`shrink-0 ${compact ? 'text-red-500' : 'text-red-600'}`} />
          <span className={compact ? 'text-red-500' : 'text-red-600'}>{message}</span>
        </p>
      )}
    </form>
  );
}
