export const chipClasses = (active: boolean) =>
  `rounded-full border px-4 py-1.5 text-[13px] font-medium transition-colors ${
    active
      ? 'border-gold-500 bg-gold-500 text-pine-950'
      : 'border-pine-900/15 text-pine-900/70 hover:border-gold-500/50 hover:text-gold-600'
  }`;
