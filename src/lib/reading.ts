/* Reading-time estimates for the hosted long-form pages. ~200 words per
   minute is the standard reference for adult readers of technical prose. */

const WPM = 200;

export const countWords = (...texts: string[]): number =>
  texts.reduce((total, text) => total + (text.trim().split(/\s+/).filter(Boolean).length || 0), 0);

export const readingMinutes = (words: number): number => Math.max(1, Math.round(words / WPM));
