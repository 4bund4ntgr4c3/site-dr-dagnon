import { useRef, useState, type FormEvent } from 'react';
import { Mail, Phone, MapPin, Linkedin, Youtube, Facebook, Send, CheckCircle2, AlertCircle, Lock, ShieldCheck, Mic, Mic2, Handshake, Newspaper, FileText } from 'lucide-react';
import { Link } from 'react-router';
import { Reveal } from '@/components/Reveal';
import { NameHighlight } from '@/components/NameHighlight';
import { useLang } from '@/i18n/useLang';
import { UI } from '@/i18n/translations';
import { LINKS } from '@/data/content';
import { localePath } from '@/i18n/routing';

type Status = 'idle' | 'sending' | 'success' | 'error';
type VerifyStatus = 'idle' | 'sending' | 'code-sent' | 'verifying' | 'verified' | 'error';

const fieldClass =
  'w-full rounded-xl border border-pine-900/15 bg-white px-4 py-3 text-sm text-pine-900 placeholder:text-pine-900/65 outline-none transition-colors focus:border-gold-500 focus:bg-pine-50 focus:ring-2 focus:ring-gold-500/20';

/* Every type pre-fills the subject with a relevant default (editable) and is
   sent to the API so the message is easy to route. */
const REQUEST_TYPES: { value: string; icon: typeof Mail; labelKey: string; subjectKey: string }[] = [
  { value: 'general', icon: Mail, labelKey: 'contact.type.general', subjectKey: '' },
  { value: 'speaking', icon: Mic, labelKey: 'contact.type.speaking', subjectKey: 'contact.subject.speaking' },
  { value: 'interview', icon: Mic2, labelKey: 'contact.type.interview', subjectKey: 'contact.subject.interview' },
  { value: 'press', icon: Newspaper, labelKey: 'contact.type.press', subjectKey: 'contact.subject.press' },
  { value: 'partnership', icon: Handshake, labelKey: 'contact.type.partnership', subjectKey: 'contact.subject.partnership' },
];

export default function Contact() {
  const { lang } = useLang();
  const t = UI[lang];

  /* `website` is the honeypot — never shown, never filled by a person.
     The API silently drops any submission that carries it. Deep links from
     /inviter, /presse or the footer can carry ?type=speaking, ?subject=…
     and ?message=… — they pre-fill the form once, at mount, before the
     visitor types. */
  const [form, setForm] = useState(() => {
    const base = { name: '', email: '', phone: '', subject: '', message: '', website: '', type: 'general' };
    if (typeof window === 'undefined') return base;
    const params = new URLSearchParams(window.location.search);
    const rt = REQUEST_TYPES.find((r) => r.value === params.get('type'));
    return {
      ...base,
      type: rt ? rt.value : 'general',
      subject: params.get('subject') ?? (rt?.subjectKey ? t[rt.subjectKey as keyof typeof t] : ''),
      message: params.get('message') ?? '',
    };
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>('idle');
  const [submittedEmail, setSubmittedEmail] = useState('');

  const [verifyStatus, setVerifyStatus] = useState<VerifyStatus>('idle');
  const [verifyCode, setVerifyCode] = useState('');
  const [verifyError, setVerifyError] = useState('');
  const [verifyToken, setVerifyToken] = useState('');
  /* Le numéro n'existe pas côté client tant que l'API ne l'a pas renvoyé. */
  const [phone, setPhone] = useState('');

  const revealed = verifyStatus === 'verified' && !!phone;

  const update = (k: keyof typeof form, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: '' }));
  };

  const selectType = (value: string) => {
    const rt = REQUEST_TYPES.find((r) => r.value === value);
    setForm((f) => ({
      ...f,
      type: value,
      subject: rt?.subjectKey ? t[rt.subjectKey as keyof typeof t] : '',
    }));
  };

  /* Radiogroup keyboard navigation — arrows move between request types,
     Home/End jump to the first/last, focus follows the selection. */
  const typeRef = useRef<HTMLDivElement>(null);
  const onTypeKeyDown = (e: React.KeyboardEvent) => {
    const values = REQUEST_TYPES.map((r) => r.value);
    const idx = values.indexOf(form.type);
    const last = values.length - 1;
    let next = -1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (idx + 1) % values.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (idx - 1 + values.length) % values.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = last;
    else return;
    e.preventDefault();
    selectType(values[next]);
    (typeRef.current?.querySelectorAll('[role="radio"]')[next] as HTMLElement | undefined)?.focus();
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = t['contact.required'];
    if (!form.email.trim()) e.email = t['contact.required'];
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = t['contact.emailInvalid'];
    const digits = (form.phone.match(/\d/g) || []).length;
    if (!form.phone.trim()) e.phone = t['contact.required'];
    else if (!/^[+\d][\d\s().-]*$/.test(form.phone.trim()) || digits < 6 || digits > 15) e.phone = t['contact.phoneInvalid'];
    if (!form.message.trim()) e.message = t['contact.required'];
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setStatus('sending');
    try {
      const rt = REQUEST_TYPES.find((r) => r.value === form.type) ?? REQUEST_TYPES[0];
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, typeLabel: t[rt.labelKey as keyof typeof t] }),
      });
      if (!res.ok) throw new Error('failed');
      setSubmittedEmail(form.email);
      setStatus('success');
      setForm({ name: '', email: '', phone: '', subject: '', message: '', website: '', type: 'general' });
    } catch {
      setStatus('error');
    }
  };

  const sendCode = async () => {
    if (!submittedEmail) return;
    setVerifyStatus('sending');
    setVerifyError('');
    try {
      const res = await fetch('/api/verify-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send', email: submittedEmail }),
      });
      const data = await res.json() as { token?: string; error?: string };
      if (!res.ok || !data.token) throw new Error(data.error || 'failed');
      setVerifyToken(data.token);
      setVerifyCode('');
      setVerifyStatus('code-sent');
    } catch (e) {
      /* si un code a déjà été envoyé, on garde le champ de saisie visible */
      setVerifyStatus(verifyToken ? 'code-sent' : 'error');
      setVerifyError(
        e instanceof Error && e.message === 'Too many requests'
          ? (lang === 'fr' ? 'Trop de demandes, réessayez plus tard' : 'Too many requests, please try again later')
          : (lang === 'fr' ? "Échec de l'envoi du code" : 'Failed to send code'),
      );
    }
  };

  const verifyCode_submit = async () => {
    if (!verifyCode.trim()) return;
    setVerifyStatus('verifying');
    setVerifyError('');
    try {
      const res = await fetch('/api/verify-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', email: submittedEmail, code: verifyCode, token: verifyToken }),
      });
      const data = await res.json() as { phone?: string; error?: string };
      if (!res.ok || !data.phone) throw new Error(data.error || 'failed');
      setPhone(data.phone);
      setVerifyStatus('verified');
    } catch (e) {
      /* le code reste saisissable : on ne retombe pas sur l'écran d'envoi */
      setVerifyStatus('code-sent');
      setVerifyError(e instanceof Error
        ? (e.message === 'Invalid code' ? (lang === 'fr' ? 'Code invalide' : 'Invalid code') : e.message === 'Code expired' ? (lang === 'fr' ? 'Code expiré' : 'Code expired') : e.message === 'Too many requests' ? (lang === 'fr' ? 'Trop de tentatives, réessayez plus tard' : 'Too many attempts, please try again later') : (lang === 'fr' ? 'Erreur de vérification' : 'Verification error'))
        : (lang === 'fr' ? 'Erreur de vérification' : 'Verification error'));
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
              {t['contact.title']} — <NameHighlight />
            </h1>
            <p className="mt-4 font-display text-lg italic text-pine-200/90 sm:text-xl">
              {t['contact.intro']}
            </p>
          </Reveal>
        </div>
      </section>

      {/* content — light */}
      <section className="bg-pine-50 py-20 lg:py-24">
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
            {/* contact info */}
            <Reveal delay={0.1}>
              <div className="rounded-2xl border border-pine-900/10 bg-ivory/60 p-6 lg:sticky lg:top-28">
                <h2 className="font-display text-xl font-semibold text-pine-900">{t['contact.infoTitle']}</h2>

                <ul className="mt-6 space-y-4">
                  {/* email — always visible */}
                  <li className="flex items-center gap-4 rounded-2xl border border-pine-900/10 bg-ivory/60 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-500/40 hover:shadow-card-hover">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pine-900 text-gold-400">
                      <Mail size={18} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-pine-900/75">
                        {t['contact.emailLabel']}
                      </p>
                      <a href={`mailto:${t['contact.email']}`} className="text-sm font-medium text-pine-900 transition-colors hover:text-gold-600">
                        {t['contact.email']}
                      </a>
                    </div>
                  </li>

                  {/* phone — hidden until code verified */}
                  {revealed ? (
                    phone.split(/\s-\s/).map((p, i) => (
                      <li key={i} className="flex items-center gap-4 rounded-2xl border border-pine-900/10 bg-ivory/60 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-500/40 hover:shadow-card-hover">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pine-900 text-gold-400">
                          <Phone size={18} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-pine-900/75">
                            {t['contact.phoneLabel']}
                          </p>
                          <a href={`tel:${p.replace(/\s/g, '')}`} className="text-sm font-medium text-pine-900 transition-colors hover:text-gold-600">
                            {p}
                          </a>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="flex items-center gap-4 rounded-2xl border border-pine-900/10 bg-ivory/60 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-500/40 hover:shadow-card-hover">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pine-900 text-gold-400">
                        <Phone size={18} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-pine-900/75">
                          {t['contact.phoneLabel']}
                        </p>
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-pine-900/75">
                          <Lock size={13} /> {t['contact.locked']}
                        </span>
                      </div>
                    </li>
                  )}

                  {/* location — always visible */}
                  <li className="flex items-center gap-4 rounded-2xl border border-pine-900/10 bg-ivory/60 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-500/40 hover:shadow-card-hover">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pine-900 text-gold-400">
                      <MapPin size={18} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-pine-900/75">
                        {t['contact.locationLabel']}
                      </p>
                      <p className="text-sm font-medium text-pine-900">{t['contact.location']}</p>
                    </div>
                  </li>
                </ul>

                {/* verify phone section — shown after form submit, before verification */}
                {status === 'success' && !revealed && (
                  <div className="mt-5 rounded-xl border border-gold-500/30 bg-gold-500/10 p-4">
                    {verifyStatus === 'code-sent' ? (
                      <div className="space-y-3">
                        <p className="text-[13px] font-medium text-pine-900">
                          {lang === 'fr' ? 'Un code a été envoyé à votre adresse e-mail.' : 'A code has been sent to your email address.'}
                        </p>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={verifyCode}
                            onChange={(e) => { setVerifyCode(e.target.value.toUpperCase()); setVerifyError(''); }}
                            placeholder={lang === 'fr' ? 'Entrez le code à 6 caractères' : 'Enter the 6-character code'}
                            aria-label={lang === 'fr' ? 'Code de vérification' : 'Verification code'}
                            maxLength={6}
                            autoComplete="one-time-code"
                            className="w-full rounded-xl border border-pine-900/15 bg-white px-3 py-2 text-sm uppercase tracking-[0.2em] text-pine-900 placeholder:normal-case placeholder:tracking-normal placeholder:text-pine-900/65 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
                          />
                          <button
                            type="button"
                            onClick={verifyCode_submit}
                            disabled={!verifyCode.trim()}
                            className="shrink-0 rounded-xl bg-gold-500 px-4 py-2 text-sm font-semibold text-pine-950 transition-colors hover:bg-gold-400 disabled:opacity-60"
                          >
                            {lang === 'fr' ? 'Vérifier' : 'Verify'}
                          </button>
                        </div>
                        {verifyError && <p role="alert" className="text-xs text-red-500">{verifyError}</p>}
                        <button
                          type="button"
                          onClick={sendCode}
                          className="text-[12px] text-gold-600 hover:text-gold-500"
                        >
                          {lang === 'fr' ? 'Renvoyer le code' : 'Resend code'}
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-[13px] leading-relaxed text-pine-900/70">
                          {t['contact.revealHint']}
                        </p>
                        <button
                          type="button"
                          onClick={sendCode}
                          disabled={verifyStatus === 'sending'}
                          className="inline-flex items-center gap-2 rounded-lg bg-gold-500 px-4 py-2 text-sm font-semibold text-pine-950 transition-colors hover:bg-gold-400 disabled:opacity-60"
                        >
                          <ShieldCheck size={15} />
                          {verifyStatus === 'sending'
                            ? (lang === 'fr' ? 'Envoi en cours…' : 'Sending…')
                            : (lang === 'fr' ? 'Recevoir le code par e-mail' : 'Receive code by email')}
                        </button>
                        {verifyError && <p role="alert" className="text-xs text-red-500">{verifyError}</p>}
                      </div>
                    )}
                  </div>
                )}

                {status !== 'success' && !revealed && (
                  <p className="mt-5 text-[13px] leading-relaxed text-pine-900/60">{t['contact.revealHint']}</p>
                )}

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <a
                    href={LINKS.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={t['contact.social.linkedin']}
                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-pine-900 text-gold-400 transition-all duration-300 hover:bg-gold-500 hover:text-pine-950"
                  >
                    <Linkedin size={18} />
                  </a>
                  <a
                    href={LINKS.youtube}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={t['contact.social.youtube']}
                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-pine-900 text-gold-400 transition-all duration-300 hover:bg-gold-500 hover:text-pine-950"
                  >
                    <Youtube size={18} />
                  </a>
                  <a
                    href={LINKS.facebook}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={t['contact.social.facebook']}
                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-pine-900 text-gold-400 transition-all duration-300 hover:bg-gold-500 hover:text-pine-950"
                  >
                    <Facebook size={18} />
                  </a>
                  <a
                    href={LINKS.x}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={t['contact.social.x']}
                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-pine-900 text-gold-400 transition-all duration-300 hover:bg-gold-500 hover:text-pine-950"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  <Link
                    to={localePath(lang, '/cv')}
                    className="inline-flex h-11 items-center gap-2 rounded-xl bg-pine-950 px-4 text-sm font-semibold text-gold-400 transition-all duration-300 hover:bg-pine-900"
                  >
                    <FileText size={16} /> {t['cvPage.download']}
                  </Link>
                </div>
              </div>
            </Reveal>

            {/* form */}
            <Reveal delay={0.18}>
              <div className="rounded-3xl border border-pine-900/10 bg-white p-8 shadow-card">
                {status === 'success' ? (
                  <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                    <CheckCircle2 size={48} className="text-gold-500" />
                    <h2 className="font-display text-2xl font-semibold text-pine-900">{t['contact.sentTitle']}</h2>
                    <p className="max-w-sm text-sm text-pine-900/60">{t['contact.sentText']}</p>
                    <button
                      type="button"
                      onClick={() => { setStatus('idle'); setSubmittedEmail(''); setForm({ name: '', email: '', phone: '', subject: '', message: '', website: '', type: 'general' }); setVerifyStatus('idle'); setVerifyCode(''); setVerifyToken(''); setVerifyError(''); setPhone(''); }}
                      className="mt-4 inline-flex items-center gap-2 rounded-full border border-pine-900/15 px-6 py-2.5 text-sm font-medium text-pine-900 transition-colors hover:border-gold-500 hover:text-gold-700"
                    >
                      {lang === 'fr' ? 'Envoyer un autre message' : 'Send another message'}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={onSubmit} noValidate className="space-y-5">
                    <div>
                      <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-pine-900/70">
                        {t['contact.requestType']}
                      </p>
                      <div ref={typeRef} role="radiogroup" aria-label={t['contact.requestType']} onKeyDown={onTypeKeyDown} className="flex flex-wrap gap-2">
                        {REQUEST_TYPES.map((rt) => {
                          const Icon = rt.icon;
                          const active = form.type === rt.value;
                          return (
                            <button
                              key={rt.value}
                              type="button"
                              role="radio"
                              aria-checked={active}
                              onClick={() => selectType(rt.value)}
                              className={`inline-flex items-center gap-2 whitespace-nowrap rounded-xl border px-3 py-2.5 text-[13px] font-semibold transition-all ${
                                active
                                  ? 'border-gold-500 bg-pine-950 text-gold-400 shadow'
                                  : 'border-pine-900/15 bg-pine-900/5 text-pine-900/75 hover:border-gold-500/70 hover:bg-gold-500/10 hover:text-pine-900'
                              }`}
                            >
                              <Icon size={15} className={`shrink-0 ${active ? 'text-gold-400' : 'text-pine-900/70'}`} />
                              {t[rt.labelKey as keyof typeof t]}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="contact-name" className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.18em] text-pine-900/70">
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

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="contact-email" className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.18em] text-pine-900/70">
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
                        <label htmlFor="contact-phone" className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.18em] text-pine-900/70">
                          {t['contact.phoneField']}
                        </label>
                        <input
                          id="contact-phone"
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          value={form.phone}
                          onChange={(e) => update('phone', e.target.value)}
                          className={fieldClass}
                          placeholder={t['contact.phoneField']}
                          aria-required="true"
                          aria-invalid={!!errors.phone}
                        />
                        {errors.phone && <p role="alert" className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="contact-subject" className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.18em] text-pine-900/70">
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

                    {/* honeypot — hidden from people, ignored by screen readers,
                        skipped by keyboard navigation. Bots fill it; the API
                        then drops the submission without sending anything. */}
                    <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
                      <label htmlFor="contact-website">Do not fill this in</label>
                      <input
                        id="contact-website"
                        type="text"
                        name="website"
                        value={form.website}
                        onChange={(e) => update('website', e.target.value)}
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-message" className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.18em] text-pine-900/70">
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
