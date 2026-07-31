import { Mail } from 'lucide-react';
import { SectionHeading } from '@/components/SectionHeading';
import { Reveal } from '@/components/Reveal';
import { NewsletterForm } from '@/components/NewsletterForm';
import { useLang } from '@/i18n/useLang';
import { UI } from '@/i18n/translations';

export function Newsletter() {
  const { lang } = useLang();
  const t = UI[lang];

  return (
    <section id="newsletter" className="relative overflow-hidden bg-pine-50 py-24 lg:py-32">
      <div className="absolute -top-24 -left-24 h-[380px] w-[380px] rounded-full bg-gold-600/10 blur-[110px]" />
      <div className="absolute -right-24 -bottom-24 h-[380px] w-[380px] rounded-full bg-pine-600/10 blur-[110px]" />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            align="center"
            eyebrow={t['newsletter.eyebrow']}
            title={t['newsletter.title']}
            intro={t['newsletter.text']}
          />
          <Reveal delay={0.12}>
            <div className="mt-12 rounded-3xl border border-pine-900/10 bg-white p-8 shadow-card sm:p-10">
              <NewsletterForm />
              <p className="mt-5 flex items-center justify-center gap-1.5 text-[12.5px] text-pine-900/65">
                <Mail size={13} className="shrink-0" />
                {t['newsletter.privacy']}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
