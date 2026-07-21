import { useState, type FormEvent } from 'react';
import { Mail, Phone, MapPin, Linkedin, Youtube, Send, CheckCircle2, AlertCircle, Lock } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { useLang } from '@/i18n/useLang';
import { UI } from '@/i18n/translations';
import { LINKS } from '@/data/content';

type Status = 'idle' | 'sending' | 'success' | 'error';

const fieldClass =
  'w-full rounded-xl border border-pine-900/15 bg-white px-4 py-3 text-sm text-pine-900 placeholder:text-pine-900/40 outline-none transition-colors focus:border-gold-500 focus:bg-pine-50';

export default function Contact() {
  const { lang } = useLang();
  const t = UI[lang];

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>('idle');
  const revealed = status === 'success';

  const update = (k: keyof typeof form, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = t['contact.required'];
    if (!form.email.trim()) e.email = t['contact.required'];
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = t['contact.emailInvalid'];
    if (!form.message.trim()) e.message = t['contact.required'];
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('failed');
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <main id="main-content" className="min-h-screen">
      {/* header — hero background */}
      <section className="relative overflow-hidden bg-pine-950">
        <div className="absolute inset-0 texture-net" />
        <div className="absolute -top-40 -right-40 h-[560px] w-[560px] rounded-full bg-pine-600/25 blur-[130px]" />
        <div className="absolute bottom-0 -left-40 h-[460px] w-[460px] rounded-full bg-gold-600/12 blur-[120px]" />

        <div className="relative mx-auto max-w-6xl px-5 pb-24 pt-32 lg:px-8 lg:pt-36">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-300">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
              {t['contact.title']}
            </span>
            <h1 className="mt-7 font-display text-[2.6rem] leading-[1.05] font-medium text-pine-100 sm:text-6xl lg:text-[4.4rem]">
              {(() => {
                const parts = t['hero.name'].split(' ');
                const idx = parts.findIndex((w) => w.toUpperCase().startsWith('DAGNON'));
                return parts.map((w, i) =>
                  i === idx ? (
                    <span key={i} className="text-gold-400 italic">
                      {w}
                      {i === parts.length - 1 ? '' : ' '}
                    </span>
                  ) : (
                    <span key={i}>
                      {w}
                      {i === parts.length - 1 ? '' : ' '}
                    </span>
                  ),
                );
              })()}
            </h1>
            <p className="mt-4 font-display text-lg italic text-pine-200/90 sm:text-xl">
              {t['contact.intro']}
            </p>
          </Reveal>
        </div>
      </section>

      {/* content — light */}
      <section className="bg-pine-50 py-20 lg:py-24">
        <div className="relative mx-auto max-w-6xl px-5 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            {/* contact info */}
            <Reveal delay={0.1}>
              <div className="rounded-3xl border border-pine-900/10 bg-white p-8 shadow-[0_24px_60px_-40px_rgba(2,36,32,0.45)]">
                <h2 className="font-display text-xl font-semibold text-pine-900">{t['contact.infoTitle']}</h2>

                <ul className="mt-6 space-y-5">
                  {/* email — always visible */}
                  <li className="flex items-center gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold-500/15 text-gold-600 ring-1 ring-gold-500/30">
                      <Mail size={18} />
                    </span>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-pine-900/50">
                        {t['contact.emailLabel']}
                      </p>
                      <a href={`mailto:${t['contact.email']}`} className="text-sm font-medium text-pine-900 transition-colors hover:text-gold-600">
                        {t['contact.email']}
                      </a>
                    </div>
                  </li>

                  {/* phone — hidden until the message is sent */}
                  {revealed ? (
                    t['contact.phone'].split(/\s-\s/).map((p, i) => (
                      <li key={i} className="flex items-center gap-4">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold-500/15 text-gold-600 ring-1 ring-gold-500/30">
                          <Phone size={18} />
                        </span>
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-pine-900/50">
                            {t['contact.phoneLabel']}
                          </p>
                          <a href={`tel:${p.replace(/\s/g, '')}`} className="text-sm font-medium text-pine-900 transition-colors hover:text-gold-600">
                            {p}
                          </a>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="flex items-center gap-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold-500/15 text-gold-600 ring-1 ring-gold-500/30">
                        <Phone size={18} />
                      </span>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-pine-900/50">
                          {t['contact.phoneLabel']}
                        </p>
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-pine-900/55">
                          <Lock size={13} /> {t['contact.locked']}
                        </span>
                      </div>
                    </li>
                  )}

                  {/* location — always visible */}
                  {t['contact.location'].split(/\s-\s/).map((l, i) => (
                    <li key={i} className="flex items-center gap-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold-500/15 text-gold-600 ring-1 ring-gold-500/30">
                        <MapPin size={18} />
                      </span>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-pine-900/50">
                          {t['contact.locationLabel']}
                        </p>
                        <p className="text-sm font-medium text-pine-900">{l}</p>
                      </div>
                    </li>
                  ))}
                </ul>

                {!revealed && (
                  <p className="mt-5 text-[13px] leading-relaxed text-pine-900/60">{t['contact.revealHint']}</p>
                )}

                <div className="mt-8 flex gap-3">
                  <a
                    href={LINKS.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn"
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-pine-900/15 text-pine-900/70 transition-colors hover:bg-gold-500 hover:text-white"
                  >
                    <Linkedin size={18} />
                  </a>
                  <a
                    href={LINKS.youtube}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="YouTube"
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-pine-900/15 text-pine-900/70 transition-colors hover:bg-gold-500 hover:text-white"
                  >
                    <Youtube size={18} />
                  </a>
                </div>
              </div>
            </Reveal>

            {/* form */}
            <Reveal delay={0.18}>
              <div className="rounded-3xl border border-pine-900/10 bg-white p-8 shadow-[0_24px_60px_-40px_rgba(2,36,32,0.45)]">
                {status === 'success' ? (
                  <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                    <CheckCircle2 size={48} className="text-gold-500" />
                    <h2 className="font-display text-2xl font-semibold text-pine-900">{t['contact.sentTitle']}</h2>
                    <p className="max-w-sm text-sm text-pine-900/60">{t['contact.sentText']}</p>
                  </div>
                ) : (
                  <form onSubmit={onSubmit} noValidate className="space-y-5">
                    <div>
                      <label htmlFor="contact-name" className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.18em] text-pine-900/60">
                        {t['contact.name']}
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        value={form.name}
                        onChange={(e) => update('name', e.target.value)}
                        className={fieldClass}
                        placeholder={t['contact.name']}
                        aria-required="true"
                        aria-invalid={!!errors.name}
                      />
                      {errors.name && <p role="alert" className="mt-1 text-xs text-red-500">{errors.name}</p>}
                    </div>

                    <div>
                      <label htmlFor="contact-email" className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.18em] text-pine-900/60">
                        {t['contact.emailField']}
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        value={form.email}
                        onChange={(e) => update('email', e.target.value)}
                        className={fieldClass}
                        placeholder="name@email.com"
                        aria-required="true"
                        aria-invalid={!!errors.email}
                      />
                      {errors.email && <p role="alert" className="mt-1 text-xs text-red-500">{errors.email}</p>}
                    </div>

                    <div>
                      <label htmlFor="contact-subject" className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.18em] text-pine-900/60">
                        {t['contact.subject']}
                      </label>
                      <input
                        id="contact-subject"
                        type="text"
                        value={form.subject}
                        onChange={(e) => update('subject', e.target.value)}
                        className={fieldClass}
                        placeholder={t['contact.subject']}
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-message" className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.18em] text-pine-900/60">
                        {t['contact.message']}
                      </label>
                      <textarea
                        id="contact-message"
                        rows={5}
                        value={form.message}
                        onChange={(e) => update('message', e.target.value)}
                        className={`${fieldClass} resize-none`}
                        placeholder={t['contact.message']}
                        aria-required="true"
                        aria-invalid={!!errors.message}
                      />
                      {errors.message && <p role="alert" className="mt-1 text-xs text-red-500">{errors.message}</p>}
                    </div>

                    {status === 'error' && (
                      <div role="alert" className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600">
                        <AlertCircle size={16} /> {t['contact.errorText']}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-7 py-3.5 text-sm font-semibold text-pine-950 transition-all hover:-translate-y-0.5 hover:bg-gold-400 disabled:opacity-60"
                    >
                      {status === 'sending' ? t['contact.sending'] : t['contact.send']}
                      <Send size={15} />
                    </button>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}
