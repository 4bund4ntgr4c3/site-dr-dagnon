import { useState, type FormEvent } from 'react';
import { Mail, Phone, MapPin, Linkedin, Youtube, Send, CheckCircle2, AlertCircle, Lock } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { useLang } from '@/i18n/useLang';
import { UI } from '@/i18n/translations';
import { LINKS } from '@/data/content';

type Status = 'idle' | 'sending' | 'success' | 'error';

const fieldClass =
  'w-full rounded-xl border border-white/10 bg-pine-900/60 px-4 py-3 text-sm text-ivory placeholder:text-pine-100/40 outline-none transition-colors focus:border-gold-400 focus:bg-pine-900';

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
    <main className="min-h-screen bg-pine-950 pt-28 lg:pt-36">
      <div className="absolute inset-x-0 top-0 -z-10 h-[420px] bg-gradient-to-b from-pine-900 to-pine-950" />
      <div className="relative mx-auto max-w-6xl px-5 pb-28 lg:px-8">
        {/* header — hero style */}
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

        <div className="mt-14 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          {/* contact info */}
          <Reveal delay={0.1}>
            <div className="rounded-3xl border border-white/10 bg-pine-900/40 p-8 backdrop-blur">
              <h2 className="font-display text-xl font-semibold text-ivory">{t['contact.infoTitle']}</h2>

              <ul className="mt-6 space-y-5">
                {/* email — always visible */}
                <li className="flex items-center gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold-500/15 text-gold-400 ring-1 ring-gold-500/30">
                    <Mail size={18} />
                  </span>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-pine-100/50">
                      {t['contact.emailLabel']}
                    </p>
                    <a href={`mailto:${t['contact.email']}`} className="text-sm font-medium text-ivory transition-colors hover:text-gold-300">
                      {t['contact.email']}
                    </a>
                  </div>
                </li>

                {/* phone — hidden until the message is sent */}
                {revealed ? (
                  t['contact.phone'].split(/\s-\s/).map((p, i) => (
                    <li key={i} className="flex items-center gap-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold-500/15 text-gold-400 ring-1 ring-gold-500/30">
                        <Phone size={18} />
                      </span>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-pine-100/50">
                          {t['contact.phoneLabel']}
                        </p>
                        <a href={`tel:${p.replace(/\s/g, '')}`} className="text-sm font-medium text-ivory transition-colors hover:text-gold-300">
                          {p}
                        </a>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="flex items-center gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold-500/15 text-gold-400 ring-1 ring-gold-500/30">
                      <Phone size={18} />
                    </span>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-pine-100/50">
                        {t['contact.phoneLabel']}
                      </p>
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-pine-100/55">
                        <Lock size={13} /> {t['contact.locked']}
                      </span>
                    </div>
                  </li>
                )}

                {/* location — always visible */}
                {t['contact.location'].split(/\s-\s/).map((l, i) => (
                  <li key={i} className="flex items-center gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold-500/15 text-gold-400 ring-1 ring-gold-500/30">
                      <MapPin size={18} />
                    </span>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-pine-100/50">
                        {t['contact.locationLabel']}
                      </p>
                      <p className="text-sm font-medium text-ivory">{l}</p>
                    </div>
                  </li>
                ))}
              </ul>

              {!revealed && (
                <p className="mt-5 text-[13px] leading-relaxed text-pine-100/55">{t['contact.revealHint']}</p>
              )}

              <div className="mt-8 flex gap-3">
                <a
                  href={LINKS.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 text-gold-300 transition-colors hover:bg-gold-500 hover:text-pine-950"
                >
                  <Linkedin size={18} />
                </a>
                <a
                  href={LINKS.youtube}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube"
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 text-gold-300 transition-colors hover:bg-gold-500 hover:text-pine-950"
                >
                  <Youtube size={18} />
                </a>
              </div>
            </div>
          </Reveal>

          {/* form */}
          <Reveal delay={0.18}>
            <div className="rounded-3xl border border-white/10 bg-pine-900/40 p-8 backdrop-blur">
              {status === 'success' ? (
                <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                  <CheckCircle2 size={48} className="text-gold-400" />
                  <h2 className="font-display text-2xl font-semibold text-ivory">{t['contact.sentTitle']}</h2>
                  <p className="max-w-sm text-sm text-pine-100/65">{t['contact.sentText']}</p>
                </div>
              ) : (
                <form onSubmit={onSubmit} noValidate className="space-y-5">
                  <div>
                    <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.18em] text-pine-100/55">
                      {t['contact.name']}
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => update('name', e.target.value)}
                      className={fieldClass}
                      placeholder={t['contact.name']}
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.18em] text-pine-100/55">
                      {t['contact.emailField']}
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => update('email', e.target.value)}
                      className={fieldClass}
                      placeholder="name@email.com"
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.18em] text-pine-100/55">
                      {t['contact.subject']}
                    </label>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={(e) => update('subject', e.target.value)}
                      className={fieldClass}
                      placeholder={t['contact.subject']}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.18em] text-pine-100/55">
                      {t['contact.message']}
                    </label>
                    <textarea
                      rows={5}
                      value={form.message}
                      onChange={(e) => update('message', e.target.value)}
                      className={`${fieldClass} resize-none`}
                      placeholder={t['contact.message']}
                    />
                    {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message}</p>}
                  </div>

                  {status === 'error' && (
                    <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
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
    </main>
  );
}
