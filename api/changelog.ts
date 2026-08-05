/* Private changelog endpoint: version history for the site, fetched by the
 * /changelog page. Protected by the same bearer secret as /api/admin
 * (ADMIN_SECRET, falling back to CRON_SECRET). The entries live here,
 * server-side, on purpose: a password-gated page whose content shipped in
 * the client bundle would be readable by anyone with the JS.
 *
 *  Read only. Add new releases at the TOP of CHANGELOG_ENTRIES, newest
 *  first; each entry lists its changes in both languages. */

export interface ChangelogEntry {
  date: string;
  version?: string;
  fr: string[];
  en: string[];
}

export const CHANGELOG_ENTRIES: ChangelogEntry[] = [
  {
    date: '2026-08-05',
    version: '2.1.0',
    fr: [
      'Nouvelle page « Accessibilité » : structure, navigation clavier, recherche Ctrl+K, contrastes, aides techniques et signalement des difficultés.',
      'Bouton WhatsApp sur la page Contact, affiché après vérification du numéro de téléphone.',
      'Page Changelog protégée par mot de passe, accessible depuis le pied de page.',
    ],
    en: [
      'New "Accessibility" page: structure, keyboard navigation, Ctrl+K search, contrast, assistive technology and issue reporting.',
      'WhatsApp button on the Contact page, shown after phone verification.',
      'Password-protected Changelog page, reachable from the footer.',
    ],
  },
];

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

const SECRET = process.env.ADMIN_SECRET || process.env.CRON_SECRET || '';

interface Req { method: string; headers: Record<string, string | string[] | undefined> }
interface Res { status(c: number): Res; json(d: unknown): void; setHeader(k: string, v: string): void }

export default async function handler(req: Req, res: Res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'private, no-store');
  if (req.method !== 'GET') { res.status(405).json({ error: 'Method not allowed' }); return; }

  if (!SECRET) { res.status(503).json({ error: 'Not configured' }); return; }
  const auth = typeof req.headers?.authorization === 'string' ? req.headers.authorization : '';
  if (!safeEqual(`Bearer ${SECRET}`, auth)) { res.status(401).json({ error: 'Unauthorized' }); return; }

  res.status(200).json({ ok: true, entries: CHANGELOG_ENTRIES });
}
