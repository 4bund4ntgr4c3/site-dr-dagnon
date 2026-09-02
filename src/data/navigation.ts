/* Single source of truth for every routed page that lives under the
   "More" dropdown and the footer bottom bar. Add a new page here and both
   places update — no more drift between header and footer.
   When creating a new page:
   1. Add its SEO in src/seo/meta.ts (PORTFOLIO_SEO etc.)
   2. Add its path to PRERENDER_ROUTES + ROUTE_PRIORITY + routeLastmod
   3. Add its rewrites in vercel.json (/path and /fr/path)
   4. Add its route in src/App.tsx / src/main.tsx / src/entry-server.tsx
   5. Add its entry here — footer + "More" stay in sync automatically
   6. Add its translations (nav.* / footer.*) in src/i18n/translations.ts
   7. Add its path to tests/prerender.test.mjs ROUTES
*/

export interface NavPage {
  id: string;
  path: string;
  label: string; // UI key, e.g. 'nav.career' or 'footer.linkPresse'
}

export const MORE_PAGES: NavPage[] = [
  { id: 'connect', path: '/connect', label: 'nav.connect' },
  { id: 'toolkit', path: '/toolkit', label: 'nav.toolkit' },
  { id: 'mentorship', path: '/mentorat', label: 'nav.mentorship' },
  { id: 'podcasts', path: '/podcasts', label: 'nav.podcasts' },
  { id: 'parcours', path: '/parcours', label: 'nav.career' },
  { id: 'portfolio', path: '/portfolio', label: 'nav.portfolio' },
  { id: 'cv', path: '/cv', label: 'cvPage.badge' },
  { id: 'presse', path: '/presse', label: 'footer.linkPresse' },
  { id: 'inviter', path: '/inviter', label: 'footer.linkInviter' },
  { id: 'collaborate', path: '/collaborate', label: 'footer.linkCollaborer' },
  { id: 'newsletter', path: '/newsletter', label: 'footer.linkNewsletter' },
  { id: 'impact', path: '/impact', label: 'footer.linkImpact' },
  { id: 'bibliography', path: '/bibliography', label: 'footer.linkBibliography' },
  { id: 'publications-pdf', path: '/publications-pdf', label: 'pubPdf.badge' },
  { id: 'legal', path: '/legal', label: 'footer.linkLegal' },
  { id: 'accessibility', path: '/accessibility', label: 'footer.linkAccessibility' },
];

/* Footer bottom bar = dynamic NAV links (apropos etc. filtered) + MORE_PAGES.
   Pages like /offline are intentionally omitted (utility, not navigation). */
export const FOOTER_MORE_IDS = new Set(MORE_PAGES.map((p) => p.id));
