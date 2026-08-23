/* Private changelog endpoint: version history for the site, fetched by the
 * /changelog page. Protected by the same bearer secret as /api/admin
 * (ADMIN_SECRET, falling back to CRON_SECRET). The entries live here,
 * server-side, on purpose: a password-gated page whose content shipped in
 * the client bundle would be readable by anyone with the JS.
 *
 *  Read only. Add new releases at the TOP of CHANGELOG_ENTRIES, newest
 *  first; each entry lists its changes in both languages. Keep the
 *  CHANGELOG_HEADER stats (commits/versions/tests/pages/period) in step
 *  with the repository on every release. */

export interface ChangelogEntry {
  /** ISO date for the <time datetime> attribute, when the release has one */
  date?: string;
  /** Version number, e.g. "2.2" (rendered as a v2.2 badge) */
  version: string;
  /** Display label per language (supports date ranges) */
  label: { fr: string; en: string };
  title: { fr: string; en: string };
  fr: string[];
  en: string[];
}

/** Header block served to the /changelog page (site name, subtitle and
 *  stats bar). */
export interface ChangelogHeader {
  title: { fr: string; en: string };
  sub: { fr: string; en: string };
  stats: {
    value: { fr: string; en: string };
    label?: { fr: string; en: string };
  }[];
}

export const CHANGELOG_HEADER: ChangelogHeader = {
  title: { fr: 'Site Dr. Seynude Dagnon', en: 'Dr. Seynude Dagnon' },
  sub: {
    fr: 'Portfolio & site vitrine — site-dr-dagnon',
    en: 'Portfolio & showcase website — site-dr-dagnon',
  },
  stats: [
    { value: { fr: '267', en: '267' }, label: { fr: 'commits', en: 'commits' } },
    { value: { fr: '27', en: '27' }, label: { fr: 'versions', en: 'versions' } },
    { value: { fr: '343', en: '343' }, label: { fr: 'tests automatisés', en: 'automated tests' } },
    { value: { fr: '112', en: '112' }, label: { fr: 'pages prérendues', en: 'prerendered pages' } },
    { value: { fr: '16 juil – 23 août 2026', en: '16 Jul – 23 Aug 2026' } },
  ],
};

export const CHANGELOG_ENTRIES: ChangelogEntry[] = [
  {
    date: '2026-08-23',
    version: '2.5',
    label: { fr: '23 août 2026', en: '23 August 2026' },
    title: { fr: 'Drawer mobile, menu « Plus », optimisation serverless, SEO enrichi & dark mode corrigé', en: 'Mobile drawer, More menu, serverless consolidation, SEO enrichment & dark mode fix' },
    fr: [
      'Drawer mobile — le menu hamburger a été remplacé par un panneau latéral glissant depuis la droite (translate-x, overlay backdrop, transitions CSS fluides) avec zone scrollable, logo + bouton fermer en en-tête, et CTA LinkedIn/YouTube en pied. Largeur augmentée pour une meilleure lisibilité sur mobile.',
      'Menu « Plus » — toutes les pages routées absentes de la barre (CV, Kit de presse, Inviter le Dr, Collaborer, Newsletter, Impact, Bibliographie, Publications PDF, Mentions légales, Accessibilité, Changelog) sont regroupées dans un dropdown « Plus » / « More » sur desktop (hover, échappement, navigation aux flèches) et un sous-menu repliable sur mobile.',
      'Fonctions serverless — réduction de 14 à 8 fonctions par fusion ciblée : contact absorbe verify-phone, push fusionne push-subscribe et push-send, newsletter absorbe newsletter-confirm, newsletter-unsubscribe et newsletter-prefs. Dispatch par path, rewrites vercel.json mises à jour. Limite Hobby Vercel respectée.',
      'Dark mode corrigé — le corps des entrées utilisait text-ink/80, la seule opacité sans override dark dans index.css ; ajout de .dark .text-ink/80 (rgba(236,236,236,0.84)). Corrige aussi les pages Legal et Accessibilité qui partageaient le même motif.',
      'Timeline centrée — les points des timelines Changelog et Tribunes étaient décalés de ~5 px par rapport à la ligne verticale ; recalculé à -43 px (Changelog, point 20 px) et -41 px / -57 px (Tribunes, point 16 px) en fonction du padding-left et du border-l.',
      'SEO enrichi — variations de nom ajoutées aux keywords bilingues (Seynude, Fortuné, Jean-Fortuné, Dr Dagnon, DAGNON, etc.) et au schema.org Person (alternateName étendu, givenName/familyName/additionalName). Schema Person enrichi : honorificPrefix (Dr.), honorificSuffix (MD, MPH), memberOf (AMP), hasOccupation (2 rôles), knowsLanguage (fr/en/de/es), awards (PMI/USAID 2019–2020), alumniOf avec sameAs Wikipedia, knowsAbout élargi (DHIS2, Global Fund, PID, PBO nets, pays cibles). Entité Wikidata officielle (Q141154548) ajoutée au sameAs.',
      'Tests — 343 tests au vert ; lint, tsc et build validés (112 pages, 165 URLs precached).',
    ],
    en: [
      'Mobile drawer — the hamburger menu was replaced by a slide-in side panel from the right (translate-x, backdrop overlay, smooth CSS transitions) with a scrollable nav area, logo + close button in the header, and LinkedIn/YouTube CTAs in the footer. Increased width for better mobile readability.',
      'More menu — all routed pages missing from the bar (CV, Press kit, Invite, Collaborate, Newsletter, Impact, Bibliography, Publications PDF, Legal, Accessibility, Changelog) are grouped under a "More" dropdown on desktop (hover, escape, arrow-key navigation) and a collapsible submenu on mobile.',
      'Serverless consolidation — reduced from 14 to 8 functions by targeted merging: contact absorbs verify-phone, push merges push-subscribe and push-send, newsletter absorbs newsletter-confirm, newsletter-unsubscribe and newsletter-prefs. Path-based dispatch, Vercel rewrites updated. Hobby limit respected.',
      'Dark mode fixed — entry body text used text-ink/80, the only opacity missing a dark override in index.css; added .dark .text-ink/80 (rgba(236,236,236,0.84)). Also fixes Legal and Accessibility pages that shared the same pattern.',
      'Timeline centering — the Changelog and Tribunes timeline dots were offset ~5 px from the vertical rule; recalculated to -43 px (Changelog, 20 px dot) and -41 px / -57 px (Tribunes, 16 px dot) based on padding-left and border-l width.',
      'SEO enrichment — name variations added to bilingual keywords (Seynude, Fortune, Jean-Fortune, Dr Dagnon, DAGNON, etc.) and to the schema.org Person (extended alternateName, givenName/familyName/additionalName). Person schema enriched: honorificPrefix (Dr.), honorificSuffix (MD, MPH), memberOf (AMP), hasOccupation (2 roles), knowsLanguage (fr/en/de/es), awards (PMI/USAID 2019–2020), alumniOf with Wikipedia sameAs, expanded knowsAbout (DHIS2, Global Fund, PID, PBO nets, target countries). Official Wikidata entity (Q141154548) added to sameAs.',
      'Tests — 343 tests green; lint, tsc and build validated (112 pages, 165 URLs precached).',
    ],
  },
  {
    date: '2026-08-07',
    version: '2.4',
    label: { fr: '7 août 2026', en: '7 August 2026' },
    title: { fr: 'Performance GTmetrix, export PDF par publication, agenda depuis les médias, timeline des tribunes & témoignages', en: 'GTmetrix performance, per-publication PDF export, add-to-calendar from media, tribunes timeline & testimonials' },
    fr: [
      'Performance — icônes lucide regroupées en un seul chunk (68 → 34 requêtes JS) ; préchargement de la police Fraunces en priorité haute (LCP) ; le service worker ne précache plus les médias lourds à la demande (communauté/OG/presse, −3,9 Mo et −46 requêtes au premier chargement) — GTmetrix A, performance ~86 %, LCP 2,4 s.',
      'Export PDF par publication — bouton Imprimer/PDF sur chaque carte de /publications qui ouvre /publications-pdf?id=<slug> : une seule publication, mise en page A4 imprimable, retour vers la liste.',
      'Agenda depuis les médias — bouton « Ajouter au calendrier » (Google Calendar) sur les vidéos datées de /media.',
      'Timeline & filtres des tribunes — /tribunes réorganisé en frise chronologique avec filtres année + thème (paludisme, santé publique, numérique, leadership), état partageable dans l\'URL.',
      'Témoignages — section « Ce que disent les collaborateurs » sur /collaborate (paroles professionnelles par rôle institutionnel).',
      'Accessibilité — contraste des étiquettes de filtres des tribunes corrigé (pine-900/60 → /80, ratio ≥ 4,5:1 sur ivoire).',
      'Maintenance — page Médias décomposée de 883 lignes en composants réutilisables (src/components/media/ : MediaLanding, CategoryView, CommunityView, PhotoView, MediaCard, categories, helpers).',
      'Tests — 343 tests au vert ; suite complète prerender, API, accessibility, newsletter, push, search.',
    ],
    en: [
      'Performance — lucide icons bundled into one chunk (68 → 34 JS requests); hero Fraunces font preload marked high priority (LCP); the service worker no longer precaches heavy on-demand media (community/OG/press, −3.9 MB and −46 requests on first load) — GTmetrix A, performance ~86%, LCP 2.4s.',
      'Per-publication PDF export — Print/PDF button on every /publications card that opens /publications-pdf?id=<slug>: a single publication, print-ready A4 layout, back to the list.',
      'Add-to-calendar from media — "Add to Google Calendar" button on dated videos on /media.',
      'Tribunes timeline & filters — /tribunes reorganized as a chronological timeline with year + theme filters (malaria, public health, digital, leadership), shareable state in the URL.',
      'Testimonials — "What collaborators say" section on /collaborate (professional quotes by institutional role).',
      'Accessibility — fixed contrast of the tribunes filter labels (pine-900/60 → /80, ratio ≥ 4.5:1 on ivory).',
      'Maintenance — Media page split from 883 lines into reusable components (src/components/media/: MediaLanding, CategoryView, CommunityView, PhotoView, MediaCard, categories, helpers).',
      'Tests — 343 tests green; full suite: prerender, API, accessibility, newsletter, push, search.',
    ],
  },
  {
    date: '2026-08-05',
    version: '2.3',
    label: { fr: '5 août 2026', en: '5 August 2026' },
    title: { fr: 'Push composer, analytique de recherche, publications enrichies, collaboration, rubriques newsletter & lightbox', en: 'Push composer, search analytics, enriched publications, collaboration, newsletter sections & lightbox' },
    fr: [
      'Push composer — onglet « Notifications push » dans /admin : titre, corps, URL optionnelle, envoi via /api/push-send (SMEMBERS push:subs, nettoyage des endpoints morts 404/410).',
      'Analytique de recherche — endpoint /api/search-log (POST, rate-limité 30/min/IP) : compteurs globaux, top queries, historique récent (max 20) ; dashboard admin enrichi.',
      'Publications enrichies — liens ORCID et Google Scholar sur /publications ; nouvelle page /publications-pdf (A4 imprimable, téléchargement FR/EN) ; SEO, breadcrumb, sitemap.',
      'Page Collaborer — nouvelle route /collaborate : recherche opérationnelle, programmes de santé, conseil technique, partenariats stratégiques ; liens footer et recherche.',
      'Rubriques newsletter — 4 sections sélectionnables (publications, tribunes, agenda, projets) ; checkboxes dans les préférences ; le digest filtre par rubrique.',
      'Lightbox photos — composant réutilisable PhotoLightbox extrait de Media.tsx : navigation tactile (swipe), autoplay, clavier, focus trap, lien vers la page photo.',
      'Tests — 342 tests au vert (298 → 342) ; suite complète : prerender, API, accessibility, newsletter, push, search.',
    ],
    en: [
      'Push composer — "Push notifications" tab in /admin: title, body, optional URL, sent via /api/push-send (SMEMBERS push:subs, dead endpoint cleanup 404/410).',
      'Search analytics — /api/search-log endpoint (POST, rate-limited 30/min/IP): global counters, top queries, recent history (max 20); enriched admin dashboard.',
      'Enriched publications — ORCID and Google Scholar links on /publications; new /publications-pdf page (print-ready A4, FR/EN download); SEO, breadcrumb, sitemap.',
      'Collaborate page — new /collaborate route: operational research, public health programs, technical advisory, strategic partnerships; footer and search links.',
      'Newsletter sections — 4 selectable sections (publications, op-eds, agenda, projects); checkboxes in preferences; digest filters by section.',
      'Photo lightbox — reusable PhotoLightbox component extracted from Media.tsx: touch swipe navigation, autoplay, keyboard, focus trap, link to photo page.',
      'Tests — 342 tests green (298 → 342); full suite: prerender, API, accessibility, newsletter, push, search.',
    ],
  },
  {
    date: '2026-08-05',
    version: '2.2.1',
    label: { fr: '5 août 2026', en: '5 August 2026' },
    title: { fr: 'Audit complet — corrections tests, réécritures manquantes & métadonnées', en: 'Full audit — test fixes, missing rewrites & metadata' },
    fr: [
      'Correctif pré-rendu — la liste de contrôle des routes du test sitemap prévoyait 106 pages alors que le site en pré-rend 108 : /accessibility manquait au check-list délibéré ; le test exige désormais les 108.',
      'Correctif production — /accessibility et /fr/accessibility n\'avaient pas de réécriture explicite dans vercel.json : elles sont désormais servies directement (HTTP 200, sans redirection).',
      'SEO — description FR de la page Accessibilité raccourcie de 169 à 145 caractères (budget de snippet ~160).',
      'Statistiques — en-tête du changelog à jour (246 commits ; 24 versions) ; suite complète : 298 tests au vert.',
    ],
    en: [
      'Prerender fix — the sitemap test route checklist expected 106 pages while the site prerenders 108: /accessibility was missing from the deliberate checklist; the test now requires all 108.',
      'Production fix — /accessibility and /fr/accessibility had no explicit rewrite in vercel.json: now served directly (HTTP 200, no redirect).',
      'SEO — FR accessibility page description trimmed from 169 to 145 characters (~160 snippet budget).',
      'Stats — changelog header refreshed (246 commits; 24 versions); full suite: 298 tests green.',
    ],
  },
  {
    date: '2026-08-05',
    version: '2.2',
    label: { fr: '5 août 2026', en: '5 August 2026' },
    title: { fr: 'Accessibilité documentée, contact WhatsApp & changelog protégé', en: 'Documented accessibility, WhatsApp contact & protected changelog' },
    fr: [
      'Page Accessibilité — nouvelle route /accessibility (et /fr/accessibility) : structure et navigation, utilisation au clavier (Ctrl+K, Échap, flèches), recherche globale, texte/zoom/contrastes, lecteurs d\'écran, médias et signalement des difficultés ; fil d\'Ariane, JSON-LD CollectionPage, sitemap (priorité 0,3) et lien dans le footer.',
      'Contact WhatsApp — bouton dans la rangée sociale de la page Contact, visible après vérification du téléphone ; le lien wa.me est construit depuis le numéro servi par /api/verify-phone, jamais présent dans le bundle.',
      'Changelog protégé — route client-only /changelog en fin de pied de page : mot de passe partagé avec l\'administration (ADMIN_SECRET, secours CRON_SECRET), session en sessionStorage, chronologie FR/EN ; entrées servies par /api/changelog (jamais dans le bundle), page jamais pré-rendue ni indexée.',
    ],
    en: [
      'Accessibility page — new /accessibility route (and /fr/accessibility): structure and navigation, keyboard use (Ctrl+K, Escape, arrows), global search, text/zoom/contrast, screen readers, media and issue reporting; breadcrumb, CollectionPage JSON-LD, sitemap (0.3 priority) and footer link.',
      'WhatsApp contact — button in the social row of the Contact page, shown after phone verification; the wa.me link is built from the number served by /api/verify-phone, never shipped in the bundle.',
      'Protected changelog — client-only /changelog route at the end of the footer: password shared with the admin dashboard (ADMIN_SECRET, CRON_SECRET fallback), sessionStorage session, FR/EN timeline; entries served by /api/changelog (never in the bundle), never prerendered or indexed.',
    ],
  },
  {
    date: '2026-08-03',
    label: { fr: '3 août 2026', en: '3 August 2026' },
    version: '2.1',
    title: { fr: 'Audit, deuxième passe — réseau durci, accessibilité de masse, polices auto-hébergées, 296 tests', en: 'Second audit pass — hardened network, mass accessibility, self-hosted fonts, 296 tests' },
    fr: [
      'Sécurité — codes de vérification à 10 caractères ; limite de contact par adresse destinataire (3/h) en plus de la limite par IP ; utilitaires _ip/_headers/_origin/_push-guard mutualisés ; envois groupés fail-closed ; Cross-Origin-Opener-Policy: same-origin ; échantillon admin borné.',
      'Accessibilité — axe-core audite les 106 routes statiques (FR + EN) et la recherche ; lien d\'évitement dédoublonné ; tabIndex=-1 sur les 18 main ; fil d\'Ariane traduit ; contraste des badges de résultats corrigé ; manifeste PWA complété.',
      'Performance — Fraunces et Inter auto-hébergées en variable (woff2 latin + latin-ext, font-display: swap, préchargement) ; preconnects Google Fonts supprimés ; CSP resserré (font-src \'self\') ; framer-motion sorti du bundle principal ; budget LCP à 5,5 s (mesuré 3,5 s à froid).',
      'SEO & i18n — édito « Aled Nature 2026 » reclassé en blog ; compteur de publications du héros dynamique ; og:url retiré des 404 ; descriptions ≤ 155 caractères ; aucune clé de traduction morte.',
      'CI & dépendances — ESLint sur les .mjs (11 erreurs corrigées) ; suites Chromium hermétiques (ports éphémères, origines externes coupées) ; engines.node >= 20 ; dépendances à jour — 0 vulnérabilité.',
    ],
    en: [
      'Security — 10-character verification codes; per-recipient contact rate limit (3/h) on top of the per-IP limit; shared _ip/_headers/_origin/_push-guard utilities; fail-closed bulk sends; Cross-Origin-Opener-Policy: same-origin; bounded admin sample.',
      'Accessibility — axe-core audits all 106 static routes (FR + EN) and the search dialog; deduplicated skip link; tabIndex=-1 on the 18 main landmarks; translated breadcrumb; fixed search result badge contrast; completed PWA manifest.',
      'Performance — Fraunces and Inter self-hosted as variable fonts (woff2 latin + latin-ext, font-display: swap, preload); Google Fonts preconnects removed; tightened CSP (font-src \'self\'); framer-motion out of the main bundle; LCP budget at 5.5s (3.5s measured cold).',
      'SEO & i18n — "Aled Nature 2026" editorial reclassified as blog; dynamic hero publication counter; og:url removed from 404s; descriptions ≤ 155 chars; no dead translation keys.',
      'CI & dependencies — ESLint on .mjs files (11 pre-existing errors fixed); hermetic Chromium suites (ephemeral ports, external origins aborted); engines.node >= 20; dependencies updated — 0 vulnerabilities.',
    ],
  },
  {
    date: '2026-08-03',
    label: { fr: '3 août 2026', en: '3 August 2026' },
    version: '2.0.1',
    title: { fr: 'Audit complet — durcissement sécurité, corrections SEO, accessibilité & PWA', en: 'Full audit — security hardening, SEO fixes, accessibility & PWA' },
    fr: [
      'Sécurité — VERIFY_SECRET désormais obligatoire en production pour signer tokens et codes ; limite par adresse destinataire sur le contact (3/h, anti mail-bombing) ; comparaison du secret de cron en temps constant ; tailles bornées des souscriptions push (endpoint ≤ 2048 octets, clés ≤ 512).',
      'SEO & indexation — robots.txt bloque /admin, /fr/admin, /newsletter/preferences et /fr/newsletter/preferences ; og:type article sur les tribunes et les projets ; URL ContactPage localisée ; tribune « contrôle → élimination » unifiée sur son permalien ; carte sociale régénérée (photo webp, PhD « (en cours) »).',
      'Accessibilité — panneau de succès du contact focalisé avec role="status" ; menu « Accueil » en motif disclosure ; onglets de citation en roving tabindex (flèches, Home/End) ; prefers-reduced-motion respecté partout (MotionConfig, compteurs figés, SMIL retiré).',
      'PWA & CI — icône 192×192 au manifeste ; métas apple-mobile-web-app-capable et mobile-web-app-capable ; concurrence des suites Chromium bridée (--test-concurrency=2) ; budget LCP 4,5 s ; compteur de la bibliographie corrigé (13, pas 24).',
    ],
    en: [
      'Security — VERIFY_SECRET now required in production to sign tokens and phone codes; per-recipient contact rate limit (3/h, anti mail-bombing); constant-time cron secret comparison; bounded push subscription sizes (endpoint ≤ 2048 bytes, keys ≤ 512).',
      'SEO & indexing — robots.txt blocks /admin, /fr/admin, /newsletter/preferences and /fr/newsletter/preferences; og:type article on op-eds and projects; localized ContactPage URL; unified "control → elimination" op-ed permalink; regenerated social card (webp photo, PhD "(in progress)").',
      'Accessibility — contact success panel focused with role="status"; "Home" menu moved to the disclosure pattern; citation tabs with roving tabindex (arrows, Home/End); prefers-reduced-motion respected everywhere (MotionConfig, frozen counters, SMIL removed).',
      'PWA & CI — 192×192 icon in the manifest; apple-mobile-web-app-capable and mobile-web-app-capable metas; bridled Chromium test concurrency (--test-concurrency=2); 4.5s LCP budget; corrected bibliography counter (13, not 24).',
    ],
  },
  {
    date: '2026-08-02',
    label: { fr: '2 août 2026', en: '2 August 2026' },
    version: '2.0',
    title: { fr: 'Mentions légales, bibliographie, administration, préférences, audio & monitoring', en: 'Legal notice, bibliography, admin, preferences, audio & monitoring' },
    fr: [
      'Mentions légales — route /legal (et /fr/legal) : éditeur, hébergement, données personnelles, cookies, vos droits, propriété intellectuelle ; JSON-LD CollectionPage, sitemap (priorité 0,3) et lien footer.',
      'Bibliographie scientifique — route /bibliography : 13 publications DOI, filtres par année et tri, recherche partagée par URL, export BibTeX/RIS/APA (le DOI est privilégié dans l\'APA).',
      'Administration — route client-only /admin : abonnés newsletter, abonnés push, dernier digest et rappels, agrégés en un aller-retour KV ; jeton porteur, session sessionStorage, jamais pré-rendue ni indexée.',
      'Préférences newsletter — lien « Préférences » dans chaque digest : fréquence hebdomadaire ou mensuelle, lien signé 90 jours ; le sender partitionne ses envois selon la fréquence.',
      'Tribunes en audio — bouton d\'écoute (synthèse vocale du navigateur, langue FR/EN selon la page, débit ajusté), désactivé si non supporté.',
      'Monitoring — @vercel/analytics et @vercel/speed-insights (Web Vitals réels) ; suite de performance CI : budgets LCP < 3,5 s et CLS < 0,1.',
    ],
    en: [
      'Legal notice — /legal route (and /fr/legal): editor, hosting, personal data, cookies, your rights, intellectual property; CollectionPage JSON-LD, sitemap (0.3 priority) and footer link.',
      'Scientific bibliography — /bibliography route: 13 DOI-indexed publications, year filters and sorting, URL-shareable search, BibTeX/RIS/APA export (DOI preferred in APA).',
      'Admin dashboard — client-only /admin route: newsletter subscribers, push subscribers, last digest and reminders, aggregated in a single KV round-trip; bearer token, sessionStorage session, never prerendered or indexed.',
      'Newsletter preferences — "Preferences" link in every digest: weekly or monthly frequency, 90-day signed link; the sender partitions sends by frequency.',
      'Op-ed audio — listen button (browser speech synthesis, FR/EN per page, adjusted rate), disabled when unsupported.',
      'Monitoring — @vercel/analytics and @vercel/speed-insights (real Web Vitals); CI performance suite: LCP < 3.5s and CLS < 0.1 budgets.',
    ],
  },
  {
    date: '2026-08-02',
    label: { fr: '2 août 2026', en: '2 August 2026' },
    version: '1.9',
    title: { fr: 'Page Impact, newsletter par langue, rappels push & alertes d\'échec', en: 'Impact page, per-language newsletter, push reminders & failure alerts' },
    fr: [
      'Page Impact — route /impact (et /fr/impact) : bandeau de statistiques (1 114 centres de santé, prévalence 44 % → 5 %, 3 M$ mobilisés, 180 M$+ de financements), six études d\'impact reliées aux études de cas, JSON-LD, sitemap.',
      'Newsletter par langue — langue d\'inscription persistée à la confirmation ; digest entièrement FR ou EN ; abonnés historiques en bilingue par défaut.',
      'Rappels agenda par push — le cron hebdomadaire envoie aussi une notification web push (VAPID) aux abonnés : titre bilingue, trois premiers événements, lien vers /agenda ; souscriptions révoquées purgées.',
      'Alertes d\'échec — module partagé _alert.ts : email au propriétaire quand Resend refuse un envoi ou qu\'une erreur s\'échappe d\'un handler, limité à une alerte par sujet toutes les 15 minutes.',
      'Citations de presse sur l\'accueil — extraits de parutions réelles (Airid, Seneweb, Bluesquare, StopBlaBlaCam, Minsanté) avec lien vers chaque source.',
      'Extraits des newsletters — « Lire l\'extrait » / « Masquer » (aria-expanded) sur chaque numéro des archives.',
      'CI — binaires Chromium installés dans GitHub Actions pour que la suite axe-core s\'exécute à chaque poussée ; 184 tests.',
    ],
    en: [
      'Impact page — /impact route (and /fr/impact): statistics banner (1,114 health facilities, prevalence 44% → 5%, $3M mobilized, $180M+ in funding), six impact studies linked to case studies, JSON-LD, sitemap.',
      'Per-language newsletter — signup language persisted at confirmation; fully FR or EN digests; legacy subscribers keep the bilingual digest by default.',
      'Push agenda reminders — the weekly cron also sends a web push notification (VAPID) to subscribers: bilingual title, first three events, link to /agenda; revoked subscriptions purged.',
      'Failure alerts — shared _alert.ts module: emails to the owner when Resend refuses a send or an error escapes a handler, limited to one alert per subject every 15 minutes.',
      'Press quotes on the home page — excerpts from real coverage (Airid, Seneweb, Bluesquare, StopBlaBlaCam, Minsanté) with links to each source.',
      'Newsletter excerpts — "Read the excerpt" / "Hide" (aria-expanded) on every archived issue.',
      'CI — Chromium binaries installed in GitHub Actions so the axe-core suite really runs on every push; 184 tests.',
    ],
  },
  {
    date: '2026-08-02',
    label: { fr: '2 août 2026', en: '2 August 2026' },
    version: '1.8',
    title: { fr: 'Newsletter en double opt-in, notifications push, PDF stylés & FAQ', en: 'Double opt-in newsletter, push notifications, styled PDFs & FAQ' },
    fr: [
      'Double opt-in newsletter — /api/newsletter met l\'adresse en attente (7 jours) et envoie une confirmation ; seul le clic sur le lien signé (HMAC, but/adresse/expiration/signature) ajoute l\'adresse ; lien expiré, falsifié ou réutilisé refusé avant toute écriture ; « déjà inscrit » géré.',
      'Désabonnement en un clic — lien propre par destinataire dans chaque email ; envois du digest et des rappels individualisés (plus de bcc partagé).',
      'Notifications push — /api/push-subscribe (VAPID, souscriptions par hash d\'endpoint, expiration 2 ans) ; bouton PushButton sur la newsletter ; gestionnaires push/notificationclick dans le service worker.',
      'PDF stylés — gen-pdfs.mjs imprime les pages pré-rendues du CV (8 pages) et du press-kit (5 pages) avec la feuille @media print du site.',
      'FAQ presse — six questions bilingues en accordéon accessible sur /presse + schéma FAQPage, même source de données (un test garantit qu\'elles ne divergent jamais).',
      'Filtre année agenda — /agenda?y=2026 filtre à venir et passé, vue partageable.',
      'Presse dans la recherche — type « Presse » dédié (badge, icône mégaphone) menant à l\'article d\'origine.',
    ],
    en: [
      'Double opt-in newsletter — /api/newsletter holds the address pending (7 days) and sends a confirmation; only the click on the signed link (HMAC, purpose/address/expiry/signature) adds the address; expired, forged or reused links rejected before any write; "already subscribed" handled.',
      'One-click unsubscribe — per-recipient link in every email; individual digest and reminder sends (no more shared bcc).',
      'Push notifications — /api/push-subscribe (VAPID, subscriptions keyed by endpoint hash, 2-year expiry); PushButton on the newsletter page; push/notificationclick handlers in the service worker.',
      'Styled PDFs — gen-pdfs.mjs prints the prerendered CV (8 pages) and press kit (5 pages) pages using the site\'s @media print stylesheet.',
      'Press FAQ — six bilingual questions in an accessible accordion on /presse plus FAQPage schema, from the same data file (a test guarantees they never diverge).',
      'Agenda year filter — /agenda?y=2026 filters upcoming and past, shareable view.',
      'Press in search — dedicated "Press" type (badge, megaphone icon) linking to the original article.',
    ],
  },
  {
    date: '2026-08-02',
    label: { fr: '2 août 2026', en: '2 August 2026' },
    version: '1.7',
    title: { fr: 'Partage natif, accessibilité auditée, recherche plein texte & rappels agenda', en: 'Native sharing, audited accessibility, full-text search & agenda reminders' },
    fr: [
      'Partage natif — bouton « Partager » via navigator.share (feuille native des mobiles et PWA), boutons sociaux en repli ; événement share_click suivi.',
      'Suite d\'accessibilité axe-core — 19 routes auditées par Playwright, aucune violation critique ou sérieuse ; corrections de contraste et aria-label au passage.',
      'Cartes OG par article — le JSON-LD Article référence la carte de partage /og/<slug>.<lang>.jpg, couvert par un test.',
      'Kit de presse ZIP — gen-press-kit.mjs génère public/presse/press-kit.zip (portrait, biographies bilingues, contact).',
      'Recherche plein texte — le corps entier des tribunes (TRIBUNE_BODIES) alimente la recherche.',
      'Compte à rebours agenda — badges « Aujourd\'hui », « Demain » ou « Dans N jours » sur les événements à venir.',
      'Copie d\'extrait — sélection ≥ 20 caractères dans une tribune ou étude de cas → bouton flottant qui copie la citation avec sa source (SelectionQuote).',
      'Rappels agenda par email — cron hebdomadaire (lundi 8 h UTC, CRON_SECRET) : événements à 14 jours envoyés aux abonnés avec boutons Google Agenda/Outlook ; état agenda:reminded (91 jours) pour éviter les doublons.',
    ],
    en: [
      'Native sharing — "Share" button via navigator.share (native sheet on mobiles and PWAs), social buttons as fallback; share_click event tracked.',
      'axe-core accessibility suite — 19 routes audited with Playwright, no critical or serious violations; contrast and aria-label fixes along the way.',
      'Per-article OG cards — Article JSON-LD references the /og/<slug>.<lang>.jpg share card, covered by a test.',
      'Press kit ZIP — gen-press-kit.mjs builds public/presse/press-kit.zip (portrait, bilingual biographies, contact).',
      'Full-text search — the entire op-ed bodies (TRIBUNE_BODIES) feed the search.',
      'Agenda countdown — "Today", "Tomorrow" or "In N days" badges on upcoming events.',
      'Quote copy — selecting ≥ 20 characters in an op-ed or case study shows a floating button that copies the quote with its source (SelectionQuote).',
      'Email agenda reminders — weekly cron (Monday 8am UTC, CRON_SECRET): events within 14 days sent to subscribers with Google Calendar/Outlook buttons; agenda:reminded state (91 days) prevents duplicates.',
    ],
  },
  {
    date: '2026-08-02',
    label: { fr: '2 août 2026', en: '2 August 2026' },
    version: '1.6',
    title: { fr: 'Cartes de partage, fil d\'Ariane, citations & mode lecture', en: 'Share cards, breadcrumbs, citations & reading mode' },
    fr: [
      'Cartes de partage par article — gen-article-og.mjs rend une carte 1200×630 par tribune et étude de cas, dans chaque langue ; og:image/width/height/type/alt pointent vers /og/<slug>.<lang>.jpg.',
      'Fil d\'Ariane visible — composant Breadcrumbs (clair/sombre) sur les articles, études de cas et vues médias, pendant visible du JSON-LD BreadcrumbList.',
      'Citations exportables — bouton « Citer » sur chaque publication : BibTeX, RIS et APA 7 copiables d\'un clic dans une modale accessible.',
      'Deep-links agenda — « Ajouter à Google Calendar » (fin exclusive UTC) et « Ajouter à Outlook » (fin inclusive), URLs construites par URLSearchParams.',
      'Analytics d\'événements — partages sociaux, recherche (débounce 800 ms), export/abonnement iCal, taille de texte, langue et thème.',
      'theme-color adaptatif — la meta suit le thème clair/sombre dès le pre-paint.',
      'Mode lecture — A−/A+ persistant (90 % → 125 %) qui met à l\'échelle le corps de l\'article seul.',
    ],
    en: [
      'Per-article share cards — gen-article-og.mjs renders a 1200×630 card per op-ed and case study, in each language; og:image/width/height/type/alt point to /og/<slug>.<lang>.jpg.',
      'Visible breadcrumbs — Breadcrumbs component (light/dark) on articles, case studies and media views, the visible counterpart of the BreadcrumbList JSON-LD.',
      'Exportable citations — "Cite" button on every publication: BibTeX, RIS and APA 7, one-click copy in an accessible modal.',
      'Agenda deep links — "Add to Google Calendar" (exclusive UTC end) and "Add to Outlook" (inclusive end), URLs built with URLSearchParams.',
      'Event analytics — social shares, search (800ms debounce), iCal export/subscription, text size, language and theme.',
      'Adaptive theme-color — the meta follows the light/dark theme from pre-paint.',
      'Reading mode — persistent A−/A+ (90% → 125%) that scales the article body only.',
    ],
  },
  {
    date: '2026-08-02',
    label: { fr: '2 août 2026', en: '2 August 2026' },
    version: '1.5',
    title: { fr: 'Filtres partageables, agenda abonnable & navigation instantanée', en: 'Shareable filters, subscribable agenda & instant navigation' },
    fr: [
      'Filtres partageables — année, tri et recherche des publications (?y=&sort=&q=) et type/recherche des médias (?type=&q=) vivent dans l\'URL.',
      'Agenda indexé et abonnable — JSON-LD Event (dates à venir uniquement), flux statique /agenda.ics généré au build, lien text/calendar dans le head et bouton « S\'abonner au flux iCal ».',
      'Toast de mise à jour PWA — « Recharger » quand le service worker installe une nouvelle version (masqué à la première visite).',
      'Impression des articles — bouton Imprimer/PDF : héros sombre masqué, titre/date/source ré-imprimés en version encre.',
      'Navigation instantanée — registre route→chunk précharge la page au survol ou au focus d\'un lien interne.',
      'iCal conforme RFC 5545 — pliage des lignes de continuation corrigé (73 caractères, espace de tête).',
    ],
    en: [
      'Shareable filters — year, sort and search of publications (?y=&sort=&q=) and media type/search (?type=&q=) live in the URL.',
      'Indexed and subscribable agenda — Event JSON-LD (upcoming dates only), static /agenda.ics feed generated at build, text/calendar link in the head and "Subscribe to the iCal feed" button.',
      'PWA update toast — "Reload" when the service worker installs a new version (hidden on first visit).',
      'Article printing — Print/PDF button: dark hero hidden, title/date/source reprinted in ink-friendly form.',
      'Instant navigation — route→chunk registry preloads the page on hover or keyboard focus of any internal link.',
      'RFC 5545-compliant iCal — fixed line folding (73 chars, leading space).',
    ],
  },
  {
    date: '2026-08-01',
    label: { fr: '1 août 2026', en: '1 August 2026' },
    version: '1.4',
    title: { fr: 'Lecture immersive, contenus liés & PWA installable', en: 'Immersive reading, related content & installable PWA' },
    fr: [
      'PWA installable — service worker généré au build (même liste que le sitemap + hash de version) : précache des 100 pages, assets versionnés et photos ; navigation network-first avec repli hors-ligne.',
      'Lecture immersive — barre de progression dorée épinglée (throttlée en rAF) et « Temps de lecture · X min » sur chaque tribune et étude de cas.',
      'Contenus liés — bloc « À lire aussi » (les deux plus récents) en fin d\'article et section « Dernière tribune » sur l\'accueil.',
      'Audit des demandes — vérifié que 5 des 7 fonctionnalités demandées existaient déjà (hreflang/canonical, RSS, partage, iCal, honeypot).',
    ],
    en: [
      'Installable PWA — service worker generated at build (same route list as the sitemap plus a version hash): precaches the 100 pages, versioned assets and photos; network-first navigation with offline fallback.',
      'Immersive reading — pinned golden progress bar (rAF-throttled) and "Reading time · X min" on every op-ed and case study.',
      'Related content — "Related reading" block (two most recent) at the end of articles and a "Latest op-ed" section on the home page.',
      'Feature audit — verified 5 of the 7 requested features already existed (hreflang/canonical, RSS, sharing, iCal, honeypot).',
    ],
  },
  {
    date: '2026-08-01',
    label: { fr: '1 août 2026', en: '1 August 2026' },
    version: '1.3',
    title: { fr: 'Photos indexées, médias repensés & finitions', en: 'Indexed photos, reworked media & polish' },
    fr: [
      'Une page par photo — les 26 photos communautaires ont leur page indexable (titre, description, og:image aux dimensions réelles, précédent/suivant) : 100 pages HTML pré-rendues.',
      'Diaporama repensé — photo centrée au ratio réel dans 75 % de hauteur d\'écran, flou d\'arrière-plan, lien « Ouvrir la photo dans sa page ».',
      'Bouton recherche harmonisé — rond translucide comme le thème ; modal en fondu, reste monté le temps de la sortie.',
      'Logo progressif — la ligne de rôle disparaît, puis le texte entier ne laisse que l\'icône « SD » (libellé conservé pour l\'accessibilité).',
      'Agenda — jour, mois et année empilés sur trois lignes.',
      'Performance & sécurité — corps des tribunes et études de cas en chunk à la demande ; react-router 8.3.0 (correctif vulnérabilité CSRF).',
    ],
    en: [
      'One page per photo — all 26 community photos have an indexable page (title, description, real-dimension og:image, previous/next): 100 prerendered HTML pages.',
      'Reworked slideshow — photo centered at its real ratio in 75% of viewport height, blurred background, "Open the photo in its page" link.',
      'Harmonized search button — translucent round like the theme toggle; fading modal that stays mounted through the exit animation.',
      'Progressive logo — the role line drops first, then the whole text leaves only the "SD" icon (label kept for accessibility).',
      'Agenda — day, month and year stacked on three lines.',
      'Performance & security — op-ed and case study bodies as on-demand chunks; react-router 8.3.0 (CSRF vulnerability fix).',
    ],
  },
  {
    date: '2026-08-01',
    label: { fr: '31 juillet – 1 août 2026', en: '31 July – 1 August 2026' },
    version: '1.2',
    title: { fr: 'Recherche étendue, polissage visuel & stabilité', en: 'Extended search, visual polish & stability' },
    fr: [
      'Recherche étendue à tout le site — auteurs de publications, photos de la médiathèque (avec miniatures), CV complet, sections de l\'accueil et textes intégraux des projets.',
      'Accents dorés adoucis — halos épais remplacés par un liseré discret (états actifs, focus, champs).',
      'Fermeture de la recherche au clic à l\'extérieur (en plus d\'Échap et Ctrl+K).',
      'Correctif sous-menu mobile — un conflit mousedown/click annulait le menu « Accueil » à chaque tap.',
      'Correctif contact mobile — le hero et la ligne de vérification débordaient sur mobile.',
      'Plus de page blanche — retry automatique des chunks et ErrorBoundary avec bouton Recharger.',
    ],
    en: [
      'Site-wide search — publication authors, media photos (with thumbnails), full CV, home sections and full project texts.',
      'Softer gold accents — thick halos replaced by a discreet hairline (active states, focus, fields).',
      'Search closes on outside click (on top of Escape and Ctrl+K).',
      'Mobile submenu fix — a mousedown/click conflict cancelled the "Home" menu on every tap.',
      'Mobile contact fix — hero and verification row overflowed the screen width.',
      'No more blank pages — automatic chunk retry and an ErrorBoundary with a Reload button.',
    ],
  },
  {
    date: '2026-07-31',
    label: { fr: '31 juillet 2026', en: '31 July 2026' },
    version: '1.1',
    title: { fr: 'Les 8 fonctionnalités', en: 'The 8 features' },
    fr: [
      'Boutons de partage sur les tribunes et études de cas — X, LinkedIn, WhatsApp et copie du lien avec confirmation accessible.',
      'Export iCal de l\'agenda — bouton « Ajouter au calendrier » téléchargeant un .ics (échappement, UID, fuseau gérés).',
      'Flux RSS — feed.xml listant tribunes, projets, agenda et presse, annoncé par link rel="alternate".',
      'Recherche globale — modal accessible via Ctrl+K / Cmd+K ou la loupe, navigation clavier, résultats classés par type.',
      'Page Kit de presse (/presse) — bio, chiffres clés, photo téléchargeable et contact dédié.',
      'Page « Inviter le Dr » (/inviter) — quatre formats d\'intervention qui pré-remplissent le formulaire de contact.',
      'Page « Archives de la newsletter » (/newsletter).',
      'Pré-remplissage du formulaire de contact via ?type=, ?subject=, ?message=.',
    ],
    en: [
      'Share buttons on op-eds and case studies — X, LinkedIn, WhatsApp and link copy with accessible confirmation.',
      'Agenda iCal export — "Add to calendar" button downloading a .ics file (escaping, UID, timezone handled).',
      'RSS feed — feed.xml listing op-eds, projects, agenda and press, announced by a link rel="alternate".',
      'Global search — keyboard-accessible modal via Ctrl+K / Cmd+K or the magnifier, keyboard navigation, results grouped by type.',
      'Press Kit page (/presse) — bio, key figures, downloadable photo and dedicated contact.',
      '"Invite the Dr" page (/inviter) — four speaking formats that prefill the contact form.',
      '"Newsletter archive" page (/newsletter).',
      'Contact form prefilling via ?type=, ?subject=, ?message=.',
    ],
  },
  {
    date: '2026-07-31',
    label: { fr: '28 – 31 juillet 2026', en: '28 – 31 July 2026' },
    version: '1.0',
    title: { fr: 'CV imprimable, newsletter & thème sombre', en: 'Printable CV, newsletter & dark theme' },
    fr: [
      'Page CV imprimable (/cv) — profil complet, CSS d\'impression, barre « Imprimer / Enregistrer en PDF », liens depuis le footer et le contact.',
      'Newsletter — formulaire d\'inscription (footer et accueil), API avec stockage KV et email de bienvenue bilingue, digest automatisé envoyé depuis le build de production.',
      'Thème sombre — sélecteur système/clair/sombre dans la barre, contrastes AA sur toutes les surfaces, fondu au changement.',
      'Publications — filtres en barre du haut, pastilles défilantes sur mobile, tri sur sa propre ligne.',
      'Contact — bouton TikTok retiré, « Télécharger le CV » intégré aux réseaux sociaux, survols or.',
    ],
    en: [
      'Printable CV page (/cv) — full profile, print CSS, "Print / Save as PDF" bar, links from the footer and contact.',
      'Newsletter — signup form (footer and home), API with KV storage and bilingual welcome email, automated digest sent from the production build.',
      'Dark theme — system/light/dark selector in the bar, AA contrast on every surface, fade on change.',
      'Publications — filters moved to a top bar, horizontally scrolling chips on mobile, sort on its own row.',
      'Contact — TikTok button removed, "Download CV" integrated with the socials, gold hovers.',
    ],
  },
  {
    date: '2026-07-29',
    label: { fr: '28 – 29 juillet 2026', en: '28 – 29 July 2026' },
    version: '0.9',
    title: { fr: 'Contenu & navigation — Agenda, Tribunes, Projets', en: 'Content & navigation — Agenda, Op-Eds, Projects' },
    fr: [
      'Agenda — page des engagements à venir et passés (conférences, prises de parole, communauté, interviews, presse).',
      'Tribunes — réimpressions hébergées d\'éditoriaux avec pages dédiées complètes, bilingues, reprises intégrales.',
      'Projets — études de cas détaillées (contexte, approche, résultats) et cartes entièrement cliquables.',
      'Menu « Accueil » — sections de la page d\'accueil regroupées sous un menu avec ancres et navigation clavier.',
      'Contact — routage par type de demande (conférence, interview, presse, partenariat…) avec objet pré-rempli, téléphone obligatoire.',
      'Page 404 designée aux couleurs du site.',
    ],
    en: [
      'Agenda — page of upcoming and past engagements (conferences, speaking, community, interviews, press).',
      'Op-Eds — hosted reprints of editorials with full dedicated bilingual pages, integral reproductions.',
      'Projects — detailed case studies (context, approach, results) and fully clickable cards.',
      '"Home" menu — home-page sections grouped under one menu with anchors and keyboard navigation.',
      'Contact — routing by request type (conference, interview, press, partnership…) with prefilled subject, phone required.',
      'Designed 404 page in the site colours.',
    ],
  },
  {
    date: '2026-07-28',
    label: { fr: '27 – 28 juillet 2026', en: '27 – 28 July 2026' },
    version: '0.8',
    title: { fr: 'URLs par langue, WebP, suite de tests & SSR du body', en: 'Per-language URLs, WebP, test suite & body SSR' },
    fr: [
      'Une URL par langue — français sous /fr/* (l\'anglais garde les chemins nus), redirection automatique pour les francophones, 48 pages HTML pré-rendues.',
      'Photos en WebP avec miniatures dédiées aux cartes.',
      'Suite de tests automatisée — 4 suites, 95 puis 97 tests, exécutée à chaque build.',
      'SSR du corps de page — le HTML pré-rendu contient le contenu ; H1 distincts par page, longueurs SERP maîtrisées, schémas JSON-LD inventés supprimés.',
      'API durcies — échappement HTML des emails, téléphone protégé (échec sécurisé), limites de débit renforcées.',
      'Performance — framer-motion hors bundle principal, focus trap corrigé, redirections 301 des anciennes URL médias.',
    ],
    en: [
      'One URL per language — French under /fr/* (English keeps bare paths to preserve existing links), automatic redirect for francophone visitors, 48 prerendered HTML pages.',
      'WebP photos with dedicated card thumbnails.',
      'Automated test suite — 4 suites, 95 then 97 tests, run on every build.',
      'Body SSR — the prerendered HTML now contains the content; distinct H1 per page, controlled SERP lengths, made-up JSON-LD schemas removed.',
      'Hardened APIs — HTML escaping of emails, protected phone (fail-safe), strengthened rate limits.',
      'Performance — framer-motion out of the main bundle, fixed focus trap, 301 redirects for legacy media URLs.',
    ],
  },
  {
    date: '2026-07-27',
    label: { fr: '26 – 27 juillet 2026', en: '26 – 27 July 2026' },
    version: '0.7',
    title: { fr: 'Emails brandés & vérification du téléphone', en: 'Branded emails & phone verification' },
    fr: [
      'Vérification du téléphone par code — après soumission du formulaire, un code à 6 caractères est envoyé par email ; seul un code valide (token signé, expirant) débloque le numéro, qui n\'existe jamais côté navigateur avant cette étape.',
      'Emails HTML brandés — confirmation auto-réponse et notifications aux couleurs du site, templates inlinés dans les API.',
      'Scroll to top à chaque changement de route ; audits répétés : types corrigés, code mort supprimé, aria-labels traduits, YouTube en youtube-nocookie.',
      'Sitemap corrigé — Content-Type XML enfin servi correctement.',
    ],
    en: [
      'Phone verification by code — after form submission, a 6-character code is emailed; only a valid code (signed, expiring token) unlocks the number, which never exists client-side before this step.',
      'Branded HTML emails — auto-reply confirmation and notifications in the site colours, templates inlined in the APIs.',
      'Scroll to top on every route change; repeated audits: fixed types, removed dead code, translated aria-labels, youtube-nocookie embeds.',
      'Fixed sitemap — XML Content-Type finally served correctly.',
    ],
  },
  {
    date: '2026-07-26',
    label: { fr: '24 – 26 juillet 2026', en: '24 – 26 July 2026' },
    version: '0.6',
    title: { fr: 'Albums photos, articles de presse & popups formation', en: 'Photo albums, press articles & education popups' },
    fr: [
      'Albums photos — « Génies en Herbe » (6 photos) et albums communauté (Nuit du Paludisme, Icône 360°, ONG Reel Concept) avec descriptions et diaporama à transitions douces (lecture auto, pause/lecture).',
      'Articles de presse — 3 nouvelles parutions avec miniatures (Lebledparle, StopBlaBlaCam, Minsante, Bluesquare, SMC Alliance), triées du plus récent.',
      'Popup Formation — timeline structurée (date, institution, détail) dans le design partagé avec les récompenses ; carte Enseignement ajoutée aux diplômes.',
      'Hero de catégorie média — icône, titre, sous-titre et retour alignés sur une ligne (empilés sur mobile).',
      'Divers — favicon corrigé, bouton « Voir plus » sur les prises de parole, expéditeur admin@seynudedagnon.com.',
    ],
    en: [
      'Photo albums — "Génies en Herbe" (6 photos) and community albums (Night Against Malaria, Icône 360°, ONG Reel Concept) with descriptions and a soft-transition slideshow (autoplay, play/pause).',
      'Press articles — 3 new pieces with thumbnails (Lebledparle, StopBlaBlaCam, Minsante, Bluesquare, SMC Alliance), newest first.',
      'Education popup — structured timeline (date, institution, detail) in the design shared with awards; Teaching card added to the degrees.',
      'Media category hero — icon, title, subtitle and back button aligned on one line (stacked on mobile).',
      'Misc — fixed favicon, "View more" button on talks, sender admin@seynudedagnon.com.',
    ],
  },
  {
    date: '2026-07-23',
    label: { fr: '22 – 23 juillet 2026', en: '22 – 23 July 2026' },
    version: '0.5',
    title: { fr: 'Médias repensés — landing, 5 catégories & photos communauté', en: 'Reworked media — landing, 5 categories & community photos' },
    fr: [
      'Landing médias à deux niveaux — cartes de catégories d\'abord, puis vue par catégorie avec barre de filtres, recherche, sous-catégories et timeline.',
      '5 catégories — interviews, conférences, prises de parole, presse et communauté ; thème clair pour la page.',
      'Photos communautaires — 7 photos ONG Reel Concept & Plus, 5 photos Nuit du Paludisme / Gala Icône 360°.',
      'Correctif page blanche sur les sous-routes — base Vite passée de ./ à /.',
      'SEO étendu — sitemap 10 pages avec hreflang, JSON-LD par page, og:site_name.',
      'Nom harmonisé — « Dr. DAGNON » en FR, « MD, MPH » en EN, sur tout le site.',
    ],
    en: [
      'Two-level media landing — category cards first, then a per-category view with filter bar, search, subcategories and timeline.',
      '5 categories — interviews, conferences, talks, press and community; light theme for the page.',
      'Community photos — 7 ONG Reel Concept & Plus photos, 5 Night Against Malaria / Icône 360° gala photos.',
      'Blank-page fix on subroutes — Vite base switched from ./ to /.',
      'Extended SEO — 10-page sitemap with hreflang, per-page JSON-LD, og:site_name.',
      'Harmonized name — "Dr. DAGNON" in FR, "MD, MPH" in EN, site-wide.',
    ],
  },
  {
    date: '2026-07-22',
    label: { fr: '21 – 22 juillet 2026', en: '21 – 22 July 2026' },
    version: '0.4',
    title: { fr: 'Audit complet & récompenses', en: 'Full audit & awards' },
    fr: [
      'Audit complet — SEO (og:image, twitter:card), accessibilité WCAG (contrastes, aria-labels traduits, lien d\'évitement), sécurité (HSTS, CSP durcie), performance (découpage, chargement différé), route 404, code mort supprimé.',
      'Récompenses & honneurs — section cliquable avec 8 prix en timeline, dont le Prix spécial 2025 pour l\'élimination du paludisme et la cérémonie LES 2019 en vidéo.',
      'Modale d\'expérience — chaque poste du parcours ouvre un détail complet (responsabilités, projets, réalisations).',
      'Héros vidéo — la photo du Dr se transforme en vidéo YouTube au clic (pas d\'autoplay).',
      'SEO Knowledge Panel — JSON-LD enrichi, profils sociaux, twitter:site, dimensions Open Graph.',
    ],
    en: [
      'Full audit — SEO (og:image, twitter:card), WCAG accessibility (contrast, translated aria-labels, skip link), security (HSTS, hardened CSP), performance (code splitting, lazy loading), 404 route, dead code removed.',
      'Awards & honours — clickable section with 8 awards in a timeline, including the 2025 Special Prize for malaria elimination and the LES 2019 ceremony on video.',
      'Experience modal — every career position opens full details (responsibilities, projects, achievements).',
      'Video hero — the Dr\'s photo turns into a YouTube video on click (no autoplay).',
      'SEO Knowledge Panel — enriched JSON-LD, social profiles, twitter:site, Open Graph dimensions.',
    ],
  },
  {
    date: '2026-07-21',
    label: { fr: '20 – 21 juillet 2026', en: '20 – 21 July 2026' },
    version: '0.3',
    title: { fr: 'Page Contact, API & pages Médias / Publications', en: 'Contact page, API & Media / Publications pages' },
    fr: [
      'Page Contact dédiée — en-tête sombre style héros, formulaire envoyé via une fonction serverless (Resend), coordonnées révélées uniquement après soumission.',
      'Réseaux sociaux — LinkedIn, YouTube, Facebook, X (logo SVG) et bouton Contact au footer.',
      'Page Médias — vidéos, images et documents avec filtres type/catégorie/année/tri, sidebar collante, 15 vidéos YouTube.',
      'Page Publications — 18 publications avec sidebar de filtres, recherche et design aligné.',
      'Vidéos YouTube — embed youtube-nocookie ou popup avec lecture au clic.',
      'Analytics — gtag, sections suivies comme pages virtuelles, clics et changements de langue tracés ; domaine seynudedagnon.com.',
    ],
    en: [
      'Dedicated Contact page — dark hero-style header, form sent through a serverless function (Resend), contact details revealed only after submission.',
      'Social networks — LinkedIn, YouTube, Facebook, X (SVG logo) and a Contact button in the footer.',
      'Media page — videos, images and documents with type/category/year/sort filters, sticky sidebar, 15 YouTube videos.',
      'Publications page — 18 publications with filter sidebar, search and aligned design.',
      'YouTube videos — youtube-nocookie embed or popup with click-to-play.',
      'Analytics — gtag, sections tracked as virtual pages, clicks and language changes tracked; final domain seynudedagnon.com.',
    ],
  },
  {
    date: '2026-07-18',
    label: { fr: '17 – 18 juillet 2026', en: '17 – 18 July 2026' },
    version: '0.2',
    title: { fr: 'SEO avancé & pré-rendu statique', en: 'Advanced SEO & static prerendering' },
    fr: [
      'Pré-rendu statique — chaque route générée en HTML complet à la construction (pas besoin de JavaScript pour le référencement), avec hreflang FR/EN et og:image 1200×630 dédiée.',
      'JSON-LD statique — schéma Person (coordonnées géographiques), twitter:image:alt, manifest PWA, icône apple-touch-icon.',
      'Anglais par défaut — HTML statique, JSON-LD et meta en EN (la langue française reste un choix explicite).',
      'Badges du héros — « 17+ ans d\'expérience » et « 27 pays » repositionnés sur la photo, plus petits et translucides.',
      'Sécurité de base — en-têtes HTTP de sécurité dans vercel.json, code shadcn/ui inutilisé supprimé.',
    ],
    en: [
      'Static prerendering — every route generated as full HTML at build time (no JavaScript needed for SEO), with FR/EN hreflang and a dedicated 1200×630 og:image.',
      'Static JSON-LD — Person schema (with geo coordinates), twitter:image:alt, PWA manifest, apple-touch-icon.',
      'English by default — static HTML, JSON-LD and meta in EN (French remains an explicit choice).',
      'Hero badges — "17+ years of experience" and "27 countries" repositioned on the photo, smaller and translucent.',
      'Basic security — HTTP security headers in vercel.json, unused shadcn/ui code removed.',
    ],
  },
  {
    date: '2026-07-17',
    label: { fr: '16 – 17 juillet 2026', en: '16 – 17 July 2026' },
    version: '0.1',
    title: { fr: 'Fondations', en: 'Foundations' },
    fr: [
      'Projet Vite + React + TypeScript avec Tailwind, palette maison (pin vert, or, ivoire) et polices display/sans.',
      'Barre de navigation flottante — transparente en haut de page, se solidifie au défilement ; liens en pastilles, logo complet y compris sur mobile.',
      'i18n FR/EN dès le départ — détection automatique de la langue, sélecteur toujours visible, nom du Dr traduit (« Dr. » en FR, « MD, MPH » en EN).',
      'SEO de base — meta, Open Graph, Twitter Cards, JSON-LD Person, robots.txt et premier sitemap.',
      'Photo du Dr dans le héros avec bordure dorée.',
      'Bouton retour en haut et premiers ajustements responsives.',
    ],
    en: [
      'Vite + React + TypeScript project with Tailwind, custom palette (pine green, gold, ivory) and display/sans fonts.',
      'Floating navigation bar — transparent at the top, solidifies on scroll; pill links, full logo including on mobile.',
      'FR/EN i18n from day one — automatic browser language detection, always-visible selector, translated Dr name ("Dr." in FR, "MD, MPH" in EN).',
      'Basic SEO — meta, Open Graph, Twitter Cards, Person JSON-LD, robots.txt and first sitemap.',
      'Dr\'s photo in the hero with a golden border.',
      'Back-to-top button and first responsive adjustments.',
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

  res.status(200).json({ ok: true, header: CHANGELOG_HEADER, entries: CHANGELOG_ENTRIES });
}
