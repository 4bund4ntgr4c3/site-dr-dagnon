import { Reveal } from './Reveal';

export function SectionHeading({
  eyebrow,
  title,
  intro,
  dark = false,
  align = 'left',
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  dark?: boolean;
  align?: 'left' | 'center';
}) {
  return (
    <Reveal className={align === 'center' ? 'text-center' : ''}>
      <p
        className={`text-xs font-semibold uppercase tracking-[0.28em] ${
          dark ? 'text-gold-400' : 'text-pine-600'
        }`}
      >
        {eyebrow}
      </p>
      <h2
        className={`mt-3 font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-medium leading-tight text-balance ${
          dark ? 'text-ivory' : 'text-pine-950'
        }`}
      >
        {title}
      </h2>
      <div
        className={`mt-5 h-[3px] w-16 rounded-full bg-gradient-to-r from-gold-500 to-gold-300 ${
          align === 'center' ? 'mx-auto' : ''
        }`}
      />
      {intro && (
        <p
          className={`mt-5 max-w-2xl text-base leading-relaxed ${
            dark ? 'text-pine-100/80' : 'text-ink/70'
          } ${align === 'center' ? 'mx-auto' : ''}`}
        >
          {intro}
        </p>
      )}
    </Reveal>
  );
}
