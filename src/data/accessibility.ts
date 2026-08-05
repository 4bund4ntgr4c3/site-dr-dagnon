import type { Lang } from '@/i18n/lang';

export interface AccessibilitySection {
  id: string;
  title: Record<Lang, string>;
  body: Record<Lang, string[]>;
}

/** Last substantive revision of the accessibility statement (ISO date, shown verbatim). */
export const ACCESSIBILITY_LAST_UPDATED = '2026-08-05';

export const ACCESSIBILITY_SECTIONS: AccessibilitySection[] = [
  {
    id: 'structure',
    title: { fr: 'Navigation et structure', en: 'Navigation and structure' },
    body: {
      fr: [
        'Ce site est conçu selon une structure sémantique : en-tête, navigation principale, contenu principal (balise <main>), navigation de pied de page. Un lien « Aller au contenu » est disponible en tout début de page pour les utilisateurs de clavier et de lecteurs d\'écran.',
        'Les pages utilisent une hiérarchie de titres ordonnée (h1, h2, h3) et des fils d\'Ariane sur les pages de contenu, pour se repérer et naviguer facilement.',
        'Le menu principal est entièrement utilisable à la souris comme au clavier : la touche Entrée ouvre les sous-menus, les flèches déplacent le focus, Échap les referme.',
      ],
      en: [
        'This site follows a semantic structure: header, main navigation, main content (a <main> element), footer navigation. A "Skip to content" link is available at the very top of every page for keyboard and screen-reader users.',
        'Pages use an ordered heading hierarchy (h1, h2, h3) and breadcrumbs on content pages, making it easy to orient and navigate.',
        'The main menu is fully usable with mouse and keyboard alike: Enter opens submenus, arrow keys move focus, Escape closes them.',
      ],
    },
  },
  {
    id: 'clavier',
    title: { fr: 'Utilisation au clavier', en: 'Keyboard use' },
    body: {
      fr: [
        'Toutes les fonctionnalités du site sont accessibles au clavier : les liens, boutons et champs de formulaire reçoivent un indicateur de focus visible, et l\'ordre de tabulation suit l\'ordre visuel des contenus.',
        'Raccourcis clavier : Ctrl + K (ou Cmd + K sur Mac) ouvre la recherche globale, depuis n\'importe quelle page ; Échap ferme les fenêtres, menus et modales.',
        'Les menus déroulants, la modale de recherche et les fenêtres de citation verrouillent le focus (piège de tabulation) tant qu\'elles sont ouvertes, puis le restituent au bouton d\'origine à la fermeture.',
      ],
      en: [
        'Every feature of the site is keyboard-accessible: links, buttons and form fields show a visible focus indicator, and the tab order follows the visual order of content.',
        'Keyboard shortcuts: Ctrl + K (Cmd + K on Mac) opens global search from any page; Escape closes windows, menus and modals.',
        'Dropdown menus, the search modal and citation dialogs trap the focus while open, then return it to the triggering button on close.',
      ],
    },
  },
  {
    id: 'recherche',
    title: { fr: 'Recherche globale', en: 'Global search' },
    body: {
      fr: [
        'Une recherche globale indexe tout le contenu du site : pages, sections, tribunes, projets, publications, médias, agenda et presse.',
        'Elle s\'ouvre par le bouton de recherche du menu (titre « Rechercher — Ctrl+K ») ou directement par le raccourci Ctrl + K. Les résultats se parcourent au clavier (flèches) et s\'ouvrent avec Entrée.',
      ],
      en: [
        'A global search indexes every type of content on the site: pages, sections, op-eds, projects, publications, media, agenda and press.',
        'It opens from the search button in the menu (labelled "Search — Ctrl+K") or directly with the Ctrl + K shortcut. Results are navigated with the keyboard (arrow keys) and opened with Enter.',
      ],
    },
  },
  {
    id: 'affichage',
    title: { fr: 'Texte, zoom et contrastes', en: 'Text, zoom and contrast' },
    body: {
      fr: [
        'Le site est conçu en responsive : le contenu s\'adapte à toutes les tailles d\'écran et supporte le zoom du navigateur jusqu\'à 200 % sans perte d\'information.',
        'Les articles (tribunes, projets) proposent un réglage de taille de texte intégré (+/−) ainsi qu\'une version imprimable en PDF.',
        'Les combinaisons de couleurs du thème sont choisies pour respecter des contrastes suffisants entre texte et fond, y compris en thème sombre. Les informations ne sont jamais transmises par la couleur seule.',
      ],
      en: [
        'The site is responsive: content adapts to every screen size and supports browser zoom up to 200% without losing information.',
        'Articles (op-eds, projects) offer a built-in text size setting (+/−) as well as a printable PDF version.',
        'The theme colour combinations are chosen to keep sufficient contrast between text and background, including in dark mode. Information is never conveyed by colour alone.',
      ],
    },
  },
  {
    id: 'aides',
    title: { fr: 'Lecteurs d\'écran et aides techniques', en: 'Screen readers and assistive technology' },
    body: {
      fr: [
        'Les boutons à icône seule portent tous un libellé accessible (aria-label), les images du site ont un texte alternatif, et les sections sont annoncées avec des régions ARIA appropriées.',
        'Les erreurs de formulaire sont annoncées immédiatement (rôle alert) et les confirmations de succès déplacent le focus pour être lues à voix haute.',
        'Les champs de formulaire sont associés à leur étiquette et les pièges anti-spam sont invisibles aux lecteurs d\'écran.',
      ],
      en: [
        'Every icon-only button carries an accessible label (aria-label), images have alt text, and sections are announced with appropriate ARIA regions.',
        'Form errors are announced immediately (alert role) and success confirmations move focus so they are read aloud.',
        'Form fields are associated with their labels, and anti-spam honeypots are hidden from screen readers.',
      ],
    },
  },
  {
    id: 'medias',
    title: { fr: 'Médias et documents', en: 'Media and documents' },
    body: {
      fr: [
        'Les vidéos intégrées proviennent de YouTube et disposent, selon les vidéos, de sous-titres activables. Les légendes des photographies accompagnent chaque image.',
        'Les documents téléchargeables (CV, dossier de presse, calendrier iCal) ont toujours une alternative utilisable en ligne : pages HTML, biographie en clair ou flux calendrier.',
      ],
      en: [
        'Embedded videos come from YouTube and offer, where available, captions that can be turned on. Photo captions accompany every image.',
        'Downloadable documents (CV, press kit, iCal calendar) always have a usable online alternative: HTML pages, plain-text biography or calendar feed.',
      ],
    },
  },
  {
    id: 'signaler',
    title: { fr: 'Signaler un problème', en: 'Report an issue' },
    body: {
      fr: [
        'Ce site est une démarche d\'amélioration continue de l\'accessibilité. Si vous rencontrez une difficulté, décrivez-la via la page Contact en précisant la page concernée, votre navigateur et le type d\'aide technique utilisée.',
        'Tout signalement est traité dans un délai de 72 heures ouvrées, et les corrections sont publiées lors de la mise à jour suivante du site.',
      ],
      en: [
        'Accessibility is a continuous improvement effort on this site. If you encounter any difficulty, describe it via the Contact page, mentioning the page concerned, your browser and the assistive technology you use.',
        'Every report is handled within 72 business hours, and fixes ship with the next site update.',
      ],
    },
  },
];
