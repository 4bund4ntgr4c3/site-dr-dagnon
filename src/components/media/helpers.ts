import type { UI } from '@/i18n/translations';

/* The translation object type used across the media components. */
export type T = (typeof UI)['fr'];

export function formatDate(iso: string, lang: 'fr' | 'en') {
  return new Date(iso).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/* media ids end with a numeric suffix (nuit-paludisme-5e-5): when entries
   share the same date, the higher suffix is the more recently added photo */
export function photoOrder(id: string): number {
  const m = id.match(/(\d+)$/);
  return m ? Number(m[1]) : 0;
}

/* subtype → translation key; the label and the description live in
   translations.ts, not here, so both languages stay in one place */
const SUBTYPE_KEY: Record<string, string> = {
  'malaria-night': 'mediaPage.subMalariaNight',
  'nuit-paludisme-5e': 'mediaPage.subMalariaNight5e',
  'school-kits': 'mediaPage.subSchoolKits',
  genies: 'mediaPage.subGenies',
};

export const subtypeLabel = (t: T, key: string) =>
  t[`${SUBTYPE_KEY[key] ?? ''}` as keyof typeof t] || key;
export const subtypeDesc = (t: T, key: string) =>
  t[`${SUBTYPE_KEY[key] ?? ''}Desc` as keyof typeof t] || '';

/* dedicated 800px thumbnails: these are rendered in ~400px cards, so the
   full-size photo would be several times the bytes actually needed */
export const ALBUM_COVERS: Record<string, string> = {
  'malaria-night': '/community/nuit-paludisme-1-thumb.webp',
  'nuit-paludisme-5e': '/community/nuit-paludisme-5e-1-thumb.webp',
  'school-kits': '/community/philantropie-1-thumb.webp',
  genies: '/community/genies-1-thumb.webp',
};
