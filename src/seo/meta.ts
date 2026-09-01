/* Single source of truth for page metadata.
   Consumed twice: by <Seo /> at runtime (client-side navigation) and by
   scripts/prerender.mjs at build time (static <head> per route). Keep it
   free of React and of any DOM access so the build script can import it. */

import { UI } from '@/i18n/translations';
import { DEFAULT_LANG, localePath } from '@/i18n/routing';
import { SUPPORTED, type Lang } from '@/i18n/lang';
import { TRIBUNES } from '@/data/tribunes';
import { PROJECTS } from '@/data/projects';
import { MEDIA_ITEMS, type MediaEntry } from '@/data/media';
import { AGENDA_ITEMS } from '@/data/agenda';
import { FAQ_ITEMS } from '@/data/faq';
import { PUB_ITEMS } from '@/data/publications';

export const SITE_URL = 'https://seynudedagnon.com';

/** Absolute URL of a logical path in a given language. The English root is
    the one URL that keeps its trailing slash, so canonical and sitemap agree. */
export const absUrl = (lang: Lang, path: string) => SITE_URL + localePath(lang, path);
const homeUrl = (lang: Lang) => absUrl(lang, '/');

/* ── Page-level SEO data ──────────────────────────────────────── */

/* Titles kept to ~60 chars and descriptions to ~150 — past that, Google
   truncates the SERP snippet mid-word rather than at a sentence boundary. */
export const SEO: Record<Lang, { title: string; description: string; keywords: string; ogLocale: string }> = {
  fr: {
    title: 'Dr. Seynudé Dagnon — Santé Publique & Paludisme',
    description:
      "Site officiel du Dr. Seynudé Jean-Fortuné Dagnon, MD, MPH — Leader en santé publique et lutte contre le paludisme en Afrique (Fondation Gates, USAID, PMI).",
    keywords: 'Dr. Seynudé Dagnon, Dr Seynudé Dagnon, Seynudé Dagnon, Seynude Dagnon, Dr Dagnon, Fortuné Dagnon, Jean-Fortuné Dagnon, Dr. Fortuné Dagnon, DAGNON, site officiel Seynudé Dagnon, paludisme, santé publique, Fondation Gates, USAID, PMI, Bénin, Afrique francophone',
    ogLocale: 'fr_FR',
  },
  en: {
    title: 'Dr. Seynudé Dagnon — Public Health & Malaria Leader',
    description:
      'Official website of Dr. Seynudé Jean-Fortuné Dagnon, MD, MPH — Public Health & Malaria Leader in Africa (Gates Foundation, USAID, PMI).',
    keywords: 'Dr. Seynude Dagnon, Dr Seynude Dagnon, Seynudé Dagnon, Seynude Dagnon, Dr Dagnon, Fortuné Dagnon, Fortune Dagnon, Jean-Fortuné Dagnon, Dr. Fortune Dagnon, DAGNON, official website Seynude Dagnon, malaria, public health, Gates Foundation, USAID, PMI, Benin, Francophone Africa',
    ogLocale: 'en_US',
  },
};

export const CONTACT_SEO: Record<Lang, { title: string; description: string; keywords: string }> = {
  fr: {
    title: 'Contact — Dr. Seynudé Jean-Fortuné DAGNON',
    description: 'Contactez le Dr. Seynudé Jean-Fortuné Dagnon pour un partenariat, une conférence ou un conseil technique sur le paludisme et la santé publique.',
    keywords: 'contact Dr Dagnon, contact Seynude Dagnon, email Seynudé Dagnon, email santé publique, partenariat paludisme, conférence Afrique, conseil technique Bénin, Cotonou, Dakar, Sénégal, Fortuné Dagnon contact, DAGNON contact',
  },
  en: {
    title: 'Contact — Seynudé Jean-Fortuné DAGNON, MD, MPH',
    description: 'Contact Dr. Seynudé Jean-Fortuné Dagnon for partnerships, conferences or technical advice on malaria and public health in Francophone Africa.',
    keywords: 'contact Dr Dagnon, contact Seynude Dagnon, email Seynudé Dagnon, public health email, malaria partnership, Africa conference, technical advice Benin, Cotonou, Dakar, Senegal, Fortune Dagnon contact, DAGNON contact',
  },
};

export const MEDIA_SEO: Record<Lang, { title: string; description: string; keywords: string }> = {
  fr: {
    title: 'Médias — Interviews, Conférences & Engagements du Dr. Dagnon',
    description: 'Interviews, conférences, discours, presse et engagement communautaire du Dr. Seynudé Jean-Fortuné Dagnon sur le paludisme et la santé publique en Afrique.',
    keywords: 'interviews Dr Dagnon, Seynude Dagnon interviews, conférences paludisme, discours santé publique, presse Bénin, engagements communautaires, Nuit du Paludisme, media malaria Africa, Fortuné Dagnon médias, DAGNON vidéo',
  },
  en: {
    title: 'Media — Interviews, Conferences & Engagements of Dr. Dagnon',
    description: 'Interviews, conferences, speeches, press coverage and community engagement by Dr. Seynudé Jean-Fortuné Dagnon on malaria and public health in Africa.',
    keywords: 'Dr Dagnon interviews, Seynude Dagnon media, malaria conferences, public health speeches, press Benin, community engagement, Night Against Malaria, media malaria Africa, Fortune Dagnon video, DAGNON media',
  },
};

/** Short brand suffix for titles that need to stay under ~60 chars —
    "Seynudé Jean-Fortuné DAGNON, MD, MPH" alone eats most of that budget. */
const shortName = (lang: Lang) => (lang === 'fr' ? 'Dr. Dagnon' : 'Seynudé Dagnon');

/* ── Community photo pages ─────────────────────────────────────── */

const PHOTO_DESC_SUFFIX: Record<Lang, string> = {
  fr: 'Galerie communautaire du Dr. Seynudé Dagnon — Bénin.',
  en: 'Community gallery of Dr. Seynudé Dagnon — Benin.',
};

/** Real pixel dimensions of the community photos (public/community/*.webp),
    used for the og:image size tags and the <img> attributes on photo pages. */
export const PHOTO_DIMS: Record<string, { width: number; height: number }> = {
  'nuit-paludisme-1': { width: 1280, height: 852 },
  'nuit-paludisme-2': { width: 1280, height: 853 },
  'nuit-paludisme-3': { width: 1280, height: 913 },
  'nuit-paludisme-4': { width: 1280, height: 853 },
  'nuit-paludisme-5': { width: 1280, height: 867 },
  'nuit-paludisme-5e-1': { width: 972, height: 1280 },
  'nuit-paludisme-5e-2': { width: 1280, height: 824 },
  'nuit-paludisme-5e-3': { width: 984, height: 1092 },
  'nuit-paludisme-5e-4': { width: 716, height: 1071 },
  'nuit-paludisme-5e-5': { width: 1280, height: 913 },
  'nuit-paludisme-5e-6': { width: 1280, height: 891 },
  'nuit-paludisme-5e-7': { width: 1280, height: 717 },
  'nuit-paludisme-5e-8': { width: 1280, height: 660 },
  'philantropie-1': { width: 1280, height: 853 },
  'philantropie-2': { width: 1178, height: 652 },
  'philantropie-3': { width: 960, height: 1280 },
  'philantropie-4': { width: 960, height: 1280 },
  'philantropie-5': { width: 960, height: 1280 },
  'philantropie-6': { width: 853, height: 1280 },
  'philantropie-7': { width: 1280, height: 853 },
  'genies-1': { width: 960, height: 1280 },
  'genies-2': { width: 960, height: 1280 },
  'genies-3': { width: 960, height: 1280 },
  'genies-4': { width: 960, height: 1280 },
  'genies-5': { width: 960, height: 1280 },
  'genies-6': { width: 960, height: 1280 },
};

/** Captions read "Album — detail" ("5e Nuit du Paludisme — Remise
    d'attestation à …"). For the <title> keep only the detail — the album
    context already lives in the URL and the breadcrumb — and cut it at a
    word boundary so the ~60-char SERP budget is never exceeded. When the
    detail is too generic to identify the photo on its own (an org name, a
    brand — "ONG Reel Concept & Plus" turns up on several pictures), fall
    back to the full caption, which still fits the budget and stays unique. */
const photoTitleShort = (lang: Lang, photo: MediaEntry) => {
  const caption = photo.title[lang];
  const parts = caption.split(' — ');
  const candidate = parts.length > 1 && parts.slice(1).join(' — ').length >= 25 ? parts.slice(1).join(' — ') : caption;
  if (candidate.length <= 58) return candidate;
  const cut = candidate.slice(0, 58).lastIndexOf(' ');
  return `${candidate.slice(0, cut > 40 ? cut : 58)}…`;
};

const photoDescription = (lang: Lang, photo: MediaEntry) =>
  `${photo.title[lang]} — ${PHOTO_DESC_SUFFIX[lang]}`;

export const CAT_NAMES: Record<string, { fr: string; en: string }> = {
  interview: { fr: 'Interviews', en: 'Interviews' },
  conference: { fr: 'Présentations & Conférences', en: 'Presentations & Conferences' },
  speaking: { fr: 'Discours publics', en: 'Public Speaking' },
  press: { fr: 'Presse', en: 'Press' },
  community: { fr: 'Engagement communautaire et philanthropique', en: 'Community and Philanthropic Engagement' },
};

export const CAT_DESCRIPTIONS: Record<string, { fr: string; en: string; keywords: string }> = {
  interview: {
    fr: "Interviews du Dr. Seynudé Jean-Fortuné Dagnon sur la lutte contre le paludisme et les systèmes de santé en Afrique francophone.",
    en: "Interviews with Dr. Seynudé Jean-Fortuné Dagnon on malaria control, African health systems and malaria elimination in Francophone Africa.",
    keywords: 'interview Dr Dagnon, interview Seynude Dagnon, paludisme Afrique, santé publique interview, malaria expert interview, Gates Foundation, Fortuné Dagnon interview',
  },
  conference: {
    fr: "Conférences et présentations du Dr. Seynudé Jean-Fortuné Dagnon lors d'événements internationaux sur le paludisme et les politiques de santé.",
    en: "Conferences and presentations by Dr. Seynudé Jean-Fortuné Dagnon at international events on malaria, operational research and health policy.",
    keywords: 'conférence Dr Dagnon, conférence Seynude Dagnon, présentation paludisme, malaria conference, health policy Africa, operational research malaria, Fortuné Dagnon conference',
  },
  speaking: {
    fr: "Discours du Dr. Seynudé Jean-Fortuné Dagnon lors de réunions de partenaires, lancements de campagnes antipaludiques et cérémonies officielles en Afrique.",
    en: "Speeches by Dr. Seynudé Jean-Fortuné Dagnon at partner meetings, anti-malaria campaign launches and official ceremonies in Africa.",
    keywords: 'discours Dr Dagnon, discours Seynude Dagnon, campagne paludisme, campaign launch malaria, partner meeting Africa, official ceremony Benin, Fortuné Dagnon discours',
  },
  press: {
    fr: "Articles de presse, tribunes et couvertures médiatiques mettant en avant le travail du Dr. Dagnon sur le paludisme et la santé publique en Afrique francophone.",
    en: "Press articles, op-eds and media coverage highlighting Dr. Dagnon's work on malaria and public health in Francophone Africa.",
    keywords: 'presse Dr Dagnon, presse Seynude Dagnon, article paludisme, malaria press, media coverage Africa, op-ed health Benin, SMC Alliance, AIRID, Fortuné Dagnon presse',
  },
  community: {
    fr: "Engagement communautaire et philanthropique du Dr. Dagnon : Nuit du Paludisme, fournitures scolaires, Génies en Herbe — actions de terrain au Bénin.",
    en: "Community and philanthropic engagement by Dr. Dagnon: Night Against Malaria, school kits, Génies en Herbe — field activities in Benin.",
    keywords: 'engagement communautaire, engagement Seynude Dagnon, Nuit du Paludisme, fournitures scolaires, Génies en Herbe, community malaria Benin, philanthropy Africa, Fortuné Dagnon philanthropie',
  },
};

export const PUB_SEO: Record<Lang, { title: string; description: string; keywords: string }> = {
  fr: {
    title: 'Publications scientifiques — Dr. Seynudé Jean-Fortuné DAGNON',
    description: "Publications scientifiques du Dr. Seynudé Jean-Fortuné Dagnon dans Malaria Journal, Parasites & Vectors et autres revues. Entomologie, lutte antipaludique.",
    keywords: 'publications Dr Dagnon, publications Seynude Dagnon, Malaria Journal, Parasites Vectors, Frontiers Tropical Diseases, recherche paludisme, entomologie, IRS, SMC, vector control Africa, Fortuné Dagnon publications, DAGNON publications scientifiques',
  },
  en: {
    title: 'Scientific Publications — Seynudé Jean-Fortuné DAGNON',
    description: 'Scientific publications by Seynudé Jean-Fortuné Dagnon in Malaria Journal, Parasites & Vectors. Malaria control and elimination in Francophone Africa.',
    keywords: 'Dr Dagnon publications, Seynude Dagnon publications, Malaria Journal, Parasites Vectors, Frontiers Tropical Diseases, malaria research, entomology, IRS, SMC, vector control Africa, Fortune Dagnon publications, DAGNON scientific papers',
  },
};

export const AGENDA_SEO: Record<Lang, { title: string; description: string; keywords: string }> = {
  fr: {
    title: 'Agenda — Conférences & engagements du Dr. Dagnon',
    description: 'Conférences, prises de parole et engagements communautaires du Dr. Seynudé Jean-Fortuné Dagnon — dates clés en Afrique.',
    keywords: 'agenda Dr Dagnon, agenda Seynude Dagnon, conférences paludisme, prise de parole, Nuit du Paludisme, agenda santé publique Afrique, événements malaria, Fortuné Dagnon agenda',
  },
  en: {
    title: 'Agenda — Conferences & Engagements of Dr. Dagnon',
    description: 'Conferences, speaking engagements and community commitments of Dr. Seynudé Jean-Fortuné Dagnon — key dates across Africa.',
    keywords: 'Dr Dagnon agenda, Seynude Dagnon events, malaria conferences, speaking engagements, Night Against Malaria, public health events Africa, malaria events, Fortune Dagnon agenda',
  },
};

export const PRESSE_SEO: Record<Lang, { title: string; description: string; keywords: string }> = {
  fr: {
    title: 'Kit de presse — Dr. Dagnon',
    description: "Kit de presse du Dr. Seynudé Jean-Fortuné Dagnon : biographie, chiffres clés, photo et contact pour les journalistes et les médias.",
    keywords: 'kit de presse Dr Dagnon, kit presse Seynude Dagnon, biographie paludisme, photo presse, contact médias, expert paludisme Afrique, porte-parole santé publique, Fortuné Dagnon presse, DAGNON bio',
  },
  en: {
    title: 'Press Kit — Seynudé Dagnon',
    description: "Press kit for Dr. Seynudé Jean-Fortuné Dagnon: biography, key figures, photo and contact for journalists and media teams.",
    keywords: 'Dr Dagnon press kit, Seynude Dagnon press kit, malaria biography, press photo, media contact, malaria expert Africa, public health spokesperson, Fortune Dagnon press, DAGNON bio',
  },
};

export const INVITER_SEO: Record<Lang, { title: string; description: string; keywords: string }> = {
  fr: {
    title: 'Inviter le Dr. Dagnon — Conférences & médias',
    description: "Invitez le Dr. Seynudé Dagnon : conférences, panels, formations et interviews sur le paludisme et la santé publique en Afrique francophone.",
    keywords: 'inviter Dr Dagnon, inviter Seynude Dagnon, conférencier paludisme, keynote santé publique, panel Afrique, intervenant Fondation Gates, conférence malaria, Fortuné Dagnon conférencier',
  },
  en: {
    title: 'Invite Dr. Dagnon — Conferences & Media',
    description: "Invite Dr. Seynudé Dagnon: conferences, panels, workshops and interviews on malaria and public health across Francophone Africa.",
    keywords: 'invite Dr Dagnon, invite Seynude Dagnon, malaria speaker, public health keynote, Africa panel, Gates Foundation speaker, malaria conference, Fortune Dagnon speaker',
  },
};

export const COLLAB_SEO: Record<Lang, { title: string; description: string; keywords: string }> = {
  fr: {
    title: 'Collaborer — Recherche, programmes & partenariats',
    description: "Collaborez avec le Dr. Seynudé Dagnon : recherche opérationnelle, programmes de santé publique, conseil technique et partenariats stratégiques en Afrique.",
    keywords: 'collaborer Dr Dagnon, collaborer Seynude Dagnon, partenariat paludisme, recherche opérationnelle Afrique, conseil technique santé publique, programme paludisme Bénin, Fortuné Dagnon partenariat',
  },
  en: {
    title: 'Collaborate — Research, Programs & Partnerships',
    description: "Collaborate with Dr. Seynudé Dagnon: operational research, public health programs, technical advisory and strategic partnerships across Africa.",
    keywords: 'collaborate Dr Dagnon, collaborate Seynude Dagnon, malaria partnership, operational research Africa, technical advisory public health, malaria program Benin, Fortune Dagnon partnership',
  },
};

export const NEWSLETTER_SEO: Record<Lang, { title: string; description: string; keywords: string }> = {
  fr: {
    title: 'Newsletter — Dr. Dagnon',
    description: "Archives de la newsletter du Dr. Seynudé Dagnon : analyses, dates clés et avancées de la lutte contre le paludisme en Afrique.",
    keywords: 'newsletter Dr Dagnon, newsletter Seynude Dagnon, archive newsletter paludisme, lettre information santé publique, veille malaria Afrique, actualités santé Afrique francophone, Fortuné Dagnon newsletter, DAGNON lettre',
  },
  en: {
    title: 'Newsletter — Seynudé Dagnon',
    description: "Archive of Dr. Seynudé Dagnon's newsletter: analysis, key dates and progress in the malaria fight across Africa.",
    keywords: 'Dr Dagnon newsletter, Seynude Dagnon newsletter, malaria newsletter archive, public health newsletter, malaria news Africa, health policy insights, Fortune Dagnon newsletter, DAGNON updates',
  },
};

export const IMPACT_SEO: Record<Lang, { title: string; description: string; keywords: string }> = {
  fr: {
    title: 'Impact & résultats — Dr. Dagnon',
    description: "Résultats mesurables du Dr. Seynudé Dagnon : 1 114 centres de santé, complétude des données de 35 % à 94 %, économies de 3 M$ et portefeuille de 180 M$.",
    keywords: 'impact Dr Dagnon, impact Seynude Dagnon, résultats paludisme, données de santé Bénin, IRS nord Bénin, digitalisation MILDA, économies G2G, portfolio Fondation Gates, indicateurs santé publique Afrique, Fortuné Dagnon impact, DAGNON réalisations',
  },
  en: {
    title: 'Impact & Results — Seynudé Dagnon',
    description: "Measurable results by Dr. Seynudé Dagnon: 1,114 health facilities, data completeness from 35% to 94%, $3M in savings and a $180M portfolio.",
    keywords: 'Dr Dagnon impact, Seynude Dagnon impact, malaria results, health data Benin, IRS northern Benin, LLIN digitization, G2G savings, Gates Foundation portfolio, public health metrics Africa, Fortune Dagnon results, DAGNON achievements',
  },
};

export const LEGAL_SEO: Record<Lang, { title: string; description: string; keywords: string }> = {
  fr: {
    title: 'Mentions légales & RGPD — Dr. Dagnon',
    description: 'Mentions légales, hébergement, données personnelles (RGPD), cookies et droits des visiteurs du site du Dr. Seynudé Dagnon.',
    keywords: 'mentions légales Dr Dagnon, mentions légales Seynude Dagnon, RGPD site santé publique, données personnelles, cookies, politique confidentialité, Fortuné Dagnon mentions légales',
  },
  en: {
    title: 'Legal notice & GDPR — Seynudé Dagnon',
    description: 'Legal notice, hosting, personal data (GDPR), cookies and visitor rights on Dr. Seynudé Dagnon\'s website.',
    keywords: 'Dr Dagnon legal notice, Seynude Dagnon legal, GDPR public health website, personal data, cookies, privacy policy, Fortune Dagnon legal',
  },
};

export const BIBLIOGRAPHY_SEO: Record<Lang, { title: string; description: string; keywords: string }> = {
  fr: {
    title: 'Bibliographie scientifique — Dr. Dagnon',
    description: 'Publications de recherche du Dr. Seynudé Dagnon indexées par DOI : paludisme, moustiquaires imprégnées, pulvérisation intradomiciliaire.',
    keywords: 'bibliographie Dr Dagnon, bibliographie Seynude Dagnon, publications paludisme DOI, chimioprévention, MILDA, IRS Bénin, entomologie médicale, citations BibTeX, APA, articles scientifiques pairs, Fortuné Dagnon bibliographie, DAGNON recherche',
  },
  en: {
    title: 'Scientific bibliography — Seynudé Dagnon',
    description: 'DOI-indexed research publications by Dr. Seynudé Dagnon: malaria, insecticide-treated nets, indoor residual spraying, insecticide resistance.',
    keywords: 'Dr Dagnon bibliography, Seynude Dagnon bibliography, malaria publications DOI, chemoprevention, LLIN, IRS Benin, entomology, BibTeX citations, APA, peer-reviewed articles, Fortune Dagnon bibliography, DAGNON research',
  },
};

export const PUBLICATIONS_PDF_SEO: Record<Lang, { title: string; description: string; keywords: string }> = {
  fr: {
    title: 'Publications (PDF) — Dr. Seynudé Dagnon',
    description: 'Liste complète des publications scientifiques du Dr. Seynudé Dagnon, téléchargeable en PDF. ORCID, Google Scholar, citations.',
    keywords: 'publications Dr Dagnon PDF, publications Seynude Dagnon PDF, liste publications paludisme, ORCID, Google Scholar, CV scientifique, télécharger publications Dagnon, Fortuné Dagnon PDF',
  },
  en: {
    title: 'Publications (PDF) — Dr. Dagnon',
    description: 'Complete list of scientific publications by Dr. Seynudé Dagnon, downloadable as PDF. ORCID, Google Scholar, citations.',
    keywords: 'Dr Dagnon publications PDF, Seynude Dagnon publications PDF, malaria publications list, ORCID, Google Scholar, academic CV, download publications Dagnon, Fortune Dagnon PDF',
  },
};

export const ACCESSIBILITY_SEO: Record<Lang, { title: string; description: string; keywords: string }> = {
  fr: {
    title: 'Accessibilité — Dr. Seynudé Dagnon',
    description: "Déclaration d'accessibilité du site du Dr. Seynudé Dagnon : clavier, recherche Ctrl+K, contrastes, lecteurs d'écran, signalement des difficultés.",
    keywords: 'accessibilité Dr Dagnon, accessibilité Seynude Dagnon, navigation clavier, lecteur écran, contrastes, déclaration accessibilité site santé publique, RGAA, WCAG',
  },
  en: {
    title: 'Accessibility — Seynudé Dagnon',
    description: "Accessibility statement for Dr. Seynudé Dagnon's website: keyboard navigation, Ctrl+K global search, contrast, screen readers and reporting difficulties.",
    keywords: 'Dr Dagnon accessibility, Seynude Dagnon accessibility, keyboard navigation, screen reader, contrast, accessibility statement public health site, WCAG compliance',
  },
};

/** The admin dashboard is a real page (it must never look like a 404) but is
    deliberately noindex and never prerendered or sitemapped. */
export const ADMIN_SEO: Record<Lang, { title: string; description: string; keywords: string }> = {
  fr: {
    title: 'Administration — Dr. Seynudé Dagnon',
    description: 'Tableau de bord privé du site du Dr. Seynudé Dagnon.',
    keywords: '',
  },
  en: {
    title: 'Administration — Seynudé Dagnon',
    description: 'Private dashboard of Dr. Seynudé Dagnon\'s website.',
    keywords: '',
  },
};

/** Newsletter preferences center — same status as /admin: a real page that
    must not look like a 404, noindex, never prerendered. */
export const PREFERENCES_SEO: Record<Lang, { title: string; description: string; keywords: string }> = {
  fr: {
    title: 'Préférences de newsletter — Dr. Seynudé Dagnon',
    description: 'Gérez la fréquence de votre newsletter.',
    keywords: '',
  },
  en: {
    title: 'Newsletter preferences — Seynudé Dagnon',
    description: 'Manage your newsletter frequency.',
    keywords: '',
  },
};

/** Password-protected changelog — same status as /admin: a real page that
    must not look like a 404, noindex, never prerendered. */
export const CHANGELOG_SEO: Record<Lang, { title: string; description: string; keywords: string }> = {
  fr: {
    title: 'Changelog — Dr. Seynudé Dagnon',
    description: "Historique des versions du site du Dr. Seynudé Dagnon.",
    keywords: '',
  },
  en: {
    title: 'Changelog — Seynudé Dagnon',
    description: "Version history of Dr. Seynudé Dagnon's website.",
    keywords: '',
  },
};

export const PODCASTS_SEO: Record<Lang, { title: string; description: string; keywords: string }> = {
  fr: {
    title: 'Podcasts & Audio — Dr. Seynudé Jean-Fortuné DAGNON',
    description: 'Écoutez les podcasts et entretiens audio du Dr. Seynudé Jean-Fortuné Dagnon sur le paludisme, la santé publique et les systèmes de santé en Afrique.',
    keywords: 'podcast Dr Dagnon, podcast paludisme, podcast santé publique Afrique, audio Seynude Dagnon, podcast Ndëp Dr Dagnon, interviews audio, écoute tribunes paludisme, Fortuné Dagnon podcast, DAGNON audio',
  },
  en: {
    title: 'Podcasts & Audio — Seynudé Jean-Fortuné DAGNON, MD, MPH',
    description: 'Listen to podcast episodes and audio discussions by Dr. Seynudé Jean-Fortuné Dagnon on malaria elimination, public health, and health systems in Africa.',
    keywords: 'Dr Dagnon podcast, malaria podcast, public health podcast Africa, Seynude Dagnon audio, Ndëp podcast Dr Dagnon, audio interviews, op-ed audio, Fortune Dagnon podcast, DAGNON audio',
  },
};

export const TRIBUNES_SEO: Record<Lang, { title: string; description: string; keywords: string }> = {
  fr: {
    title: 'Tribunes & Analyses — Dr. Dagnon',
    description: 'Tribunes et analyses du Dr. Seynudé Jean-Fortuné Dagnon — textes hébergés, indexés et partageables sur le paludisme et la santé publique.',
    keywords: 'tribune Dr Dagnon, tribune Seynude Dagnon, op-ed paludisme, analyse santé publique, élimination paludisme, Afrique francophone, tribunes hébergées, plaidoyer santé, Rose Leke Dagnon, Africa Health Watch, Fortuné Dagnon tribune, DAGNON op-ed',
  },
  en: {
    title: 'Op-Eds & Analyses — Seynudé Dagnon',
    description: 'Op-eds and analyses by Dr. Seynudé Jean-Fortuné Dagnon — hosted, indexable and shareable texts on malaria and public health in Africa.',
    keywords: 'Dr Dagnon op-ed, Seynude Dagnon op-ed, malaria op-ed, public health analysis, malaria elimination, Francophone Africa, hosted tribunes, health advocacy, Rose Leke Dagnon, Africa Health Watch, Fortune Dagnon analysis, DAGNON commentary',
  },
};

export const PROJETS_SEO: Record<Lang, { title: string; description: string; keywords: string }> = {
  fr: {
    title: 'Projets & Études de cas — Dr. Dagnon',
    description: 'Études de cas du Dr. Seynudé Dagnon : campagnes MILDA digitalisées, données paludisme au Burundi, CPS, IRS au nord du Bénin — avec résultats.',
    keywords: 'projets Dr Dagnon, projets Seynude Dagnon, études de cas paludisme, digitalisation campagnes MILDA Bénin, données paludisme Burundi, CPS SMC chimioprévention, IRS pulvérisation Atacora Donga, contrat G2G PNLP USAID, santé numérique Afrique, Fortuné Dagnon projets, DAGNON études de cas',
  },
  en: {
    title: 'Projects & Case Studies — Seynudé Dagnon',
    description: 'Case studies by Dr. Seynudé Dagnon: digitalized LLIN campaigns, malaria data in Burundi, SMC scale-up, IRS in northern Benin — with measurable results.',
    keywords: 'Dr Dagnon projects, Seynude Dagnon projects, malaria case studies, LLIN campaign digitization Benin, malaria data Burundi, SMC scale-up chemoprevention, IRS northern Benin, G2G contract NMCP USAID, digital health Africa, Fortune Dagnon projects, DAGNON case studies',
  },
};

export const CV_SEO: Record<Lang, { title: string; description: string; keywords: string }> = {
  fr: {
    title: 'Curriculum Vitae — Dr. Seynudé Dagnon',
    description: 'CV complet du Dr. Seynudé Dagnon : 17 ans dans les programmes paludisme, formation, enseignements, distinctions et publications. Imprimable en PDF.',
    keywords: 'CV Dr Dagnon, CV Seynude Dagnon, curriculum vitae santé publique, parcours paludisme, expérience Fondation Gates, Gates Foundation Senior Program Officer, USAID PMI Resident Advisor, formation Groningen doctorat, ITG Anvers MPH, médecin Cotonou Bénin, Fortuné Dagnon CV, Jean-Fortuné Dagnon CV, DAGNON parcours professionnel',
  },
  en: {
    title: 'Resume — Dr. Seynudé Dagnon, malaria program leader',
    description: 'Full resume of Dr. Seynudé Dagnon: 17+ years in malaria programs, education, teaching, awards and publications. Print-ready PDF version.',
    keywords: 'Dr Dagnon resume, Seynude Dagnon CV, public health resume, malaria career track record, Gates Foundation Senior Program Officer, USAID PMI Resident Advisor, Groningen PhD, ITG Antwerp MPH, medical doctor Benin, Fortune Dagnon resume, Jean-Fortune Dagnon CV, DAGNON professional profile',
  },
};

export const PORTFOLIO_SEO: Record<Lang, { title: string; description: string; keywords: string }> = {
  fr: {
    title: 'Portfolio complet — Dr. Seynudé Dagnon',
    description: 'Portfolio complet du Dr. Seynudé Dagnon : CV, projets, publications et distinctions en un seul document imprimable.',
    keywords: 'portfolio Dr Dagnon, portfolio Seynude Dagnon, CV complet, projets paludisme, publications, Burkina Burundi Bénin, Gates Foundation, USAID, MPH, DAGNON portfolio',
  },
  en: {
    title: 'Full Portfolio — Seynudé Dagnon',
    description: 'Full portfolio of Dr. Seynudé Dagnon: CV, projects, publications and awards in one print-ready document.',
    keywords: 'Seynude Dagnon portfolio, full portfolio, CV projects publications, Benin Burkina Burundi, Gates Foundation, USAID, MPH, DAGNON portfolio',
  },
};

export const OFFLINE_SEO: Record<Lang, { title: string; description: string; keywords: string }> = {
  fr: {
    title: 'Hors-ligne — Contenu disponible sans connexion',
    description: 'Mode hors-ligne : recherche, pages et médias en cache restent accessibles sans connexion.',
    keywords: 'hors-ligne, offline, PWA, cache, Seynude Dagnon, contenu disponible',
  },
  en: {
    title: 'Offline — Cached content available',
    description: 'Offline mode: search, pages and cached media stay available without connection.',
    keywords: 'offline, PWA, cache, Seynude Dagnon, cached content',
  },
};

export const CAREER_SEO: Record<Lang, { title: string; description: string; keywords: string }> = {
  fr: {
    title: 'Parcours — 17 ans en santé publique & paludisme',
    description: 'Frise interactive du parcours du Dr. Seynudé Dagnon : Fondation Gates, USAID/PMI, MCDI/ARM3 — 17 ans, 6 postes, distinctions et projets.',
    keywords: 'parcours Dr Dagnon, carrière Seynude Dagnon, Gates Foundation, USAID PMI, MCDI ARM3, timeline carrière, santé publique, Bénin, Fortuné Dagnon parcours',
  },
  en: {
    title: 'Career — 17 years in public health & malaria',
    description: 'Interactive career timeline of Dr. Seynudé Dagnon: Gates Foundation, USAID/PMI, MCDI/ARM3 — 17 years, 6 roles, awards and projects.',
    keywords: 'Seynude Dagnon career, Dr Dagnon timeline, Gates Foundation, USAID PMI, MCDI ARM3, career timeline, public health, Benin, Fortune Dagnon career',
  },
};

export const CONNECT_SEO: Record<Lang, { title: string; description: string; keywords: string }> = {
  fr: {
    title: 'Carte de Visite Digitale & Contact — Dr. Seynudé Dagnon',
    description: 'Carte de visite digitale du Dr. Seynudé Jean-Fortuné Dagnon : coordonnées officielles, vCard (.vcf), QR Code et profil professionnel.',
    keywords: 'vcard Dr Dagnon, QR Code Seynude Dagnon, contact digital, carte de visite, Gates Foundation, ASTMH, PAMCA, Cotonou, coordonnées officielles',
  },
  en: {
    title: 'Digital Business Card & Contact — Dr. Seynudé Dagnon',
    description: 'Official digital business card of Dr. Seynudé Jean-Fortuné Dagnon: official contact details, vCard (.vcf), QR Code and verified profile.',
    keywords: 'vcard Dr Dagnon, QR code Seynude Dagnon, digital business card, Gates Foundation contact, ASTMH, PAMCA, official contact info',
  },
};

export const TOOLKIT_SEO: Record<Lang, { title: string; description: string; keywords: string }> = {
  fr: {
    title: 'Boîte à Outils & Protocoles — Dr. Seynudé Dagnon',
    description: 'Guides méthodologiques et protocoles opérationnels du Dr. Seynudé Dagnon : digitalisation de campagnes MILDA, contrats G2G, audit DHIS2 et ciblage CPS.',
    keywords: 'toolkit santé publique, protocole MILDA, financement direct G2G, audit DHIS2, ciblage CPS, Dr Dagnon outils, santé publique Afrique, Fortuné Dagnon',
  },
  en: {
    title: 'Public Health Toolkit & Protocols — Dr. Seynudé Dagnon',
    description: 'Field-tested operational guidelines by Dr. Seynudé Dagnon: mass campaign digitalization, G2G direct financing, DHIS2 audit, and SMC targeting.',
    keywords: 'public health toolkit, LLIN protocol, G2G financing guide, DHIS2 data audit, SMC targeting matrix, Dr Dagnon toolkit, global health',
  },
};

export const MENTORSHIP_SEO: Record<Lang, { title: string; description: string; keywords: string }> = {
  fr: {
    title: 'Boussole & Mentorat en Santé Mondiale — Dr. Seynudé Dagnon',
    description: 'Guide de mentorat et carrières en santé mondiale du Dr. Seynudé Dagnon : recherche (PhD), programmes bilatéraux (USAID) et philanthropie (Gates Foundation).',
    keywords: 'mentorat santé mondiale, carrières santé publique Afrique, PhD économie de la santé, USAID PMI carrières, Fondation Gates recrutement, Dr Dagnon mentorat, Fortuné Dagnon',
  },
  en: {
    title: 'Global Health Mentorship & Career — Dr. Seynudé Dagnon',
    description: 'Global health mentorship by Dr. Seynudé Dagnon: academic research (PhD), bilateral leadership (USAID/PMI), and philanthropy (Gates Foundation).',
    keywords: 'global health mentorship, African public health careers, health economics PhD, USAID PMI careers, Gates Foundation careers, Dr Dagnon mentorship',
  },
};

/** Short headline for the <title> budget: whatever comes after a colon is
    treated as a subtitle and dropped (a French colon has a space before it,
    hence the trim). */
const tribuneShortTitle = (lang: Lang, entry: (typeof TRIBUNES)[number]) =>
  `${entry.title[lang].split(':')[0].trim()} — ${shortName(lang)}`;

/* Case study titles: a colon only separates a meaningful prefix when that
   prefix is more than a single word (e.g. "ARM3 : ..." would truncate too
   far), so the split is applied only in that case. */
const projectShortTitle = (lang: Lang, entry: (typeof PROJECTS)[number]) => {
  const [head, ...rest] = entry.title[lang].split(':');
  const truncated = rest.length > 0 && head.trim().split(' ').length > 1;
  return `${(truncated ? head : entry.title[lang]).trim()} — ${shortName(lang)}`;
};

const fullName = (lang: Lang) => (lang === 'fr' ? 'Dr. Seynudé Jean-Fortuné DAGNON' : 'Seynudé Jean-Fortuné DAGNON, MD, MPH');

/* ── JSON-LD builders ─────────────────────────────────────────── */

export function personJsonLd(lang: Lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: fullName(lang),
    givenName: 'Seynudé',
    familyName: 'Dagnon',
    additionalName: ['Jean-Fortuné', 'Fortuné'],
    honorificPrefix: 'Dr.',
    honorificSuffix: 'MD, MPH',
    alternateName: [
      // Standard & Officiel (Français)
      'Seynudé Dagnon',
      'Dr. Seynudé Dagnon',
      'Dr Seynudé Dagnon',
      'Docteur Seynudé Dagnon',
      'Dr. Seynudé Jean-Fortuné Dagnon',
      'Dr Seynudé Jean-Fortuné Dagnon',
      'Dr. Seynudé Jean-Fortuné DAGNON',
      'Seynudé Jean-Fortuné Dagnon',
      'Seynudé Jean-Fortuné DAGNON',
      'Seynudé DAGNON',
      'Jean-Fortuné Dagnon',
      'Dr. Jean-Fortuné Dagnon',
      'Dr Jean-Fortuné Dagnon',
      'Fortuné Dagnon',
      'Dr. Fortuné Dagnon',
      'Dr Fortuné Dagnon',
      'Docteur Fortuné Dagnon',
      'Fortuné DAGNON',

      // International & Anglophone (Sans accents / ASCII / Translitérations)
      'Seynude Dagnon',
      'Dr. Seynude Dagnon',
      'Dr Seynude Dagnon',
      'Doctor Seynude Dagnon',
      'Seynude Jean-Fortune Dagnon',
      'Dr. Seynude Jean-Fortune Dagnon',
      'Dr Seynude Jean-Fortune Dagnon',
      'Seynude Jean-Fortune DAGNON',
      'Seynude Jean Fortune Dagnon',
      'Seynude Jean-Fortune Dagnon, MD, MPH',
      'Seynudé Jean-Fortuné Dagnon, MD, MPH',
      'Seynude DAGNON',
      'Jean-Fortune Dagnon',
      'Dr. Jean-Fortune Dagnon',
      'Dr Jean-Fortune Dagnon',
      'Jean Fortune Dagnon',
      'Dr. Jean Fortune Dagnon',
      'Fortune Dagnon',
      'Dr. Fortune Dagnon',
      'Dr Fortune Dagnon',
      'Doctor Fortune Dagnon',
      'Fortune DAGNON',

      // Titres courts & usuels
      'Dr Dagnon',
      'Dr. Dagnon',
      'Docteur Dagnon',
      'Doctor Dagnon',

      // Formats académiques, bibliographiques & inversés (Nom Prénom / Indexation)
      'Dagnon Seynudé',
      'Dagnon Seynude',
      'Dagnon, Seynudé',
      'Dagnon, Seynude',
      'Dagnon Jean-Fortuné',
      'Dagnon Jean-Fortune',
      'Dagnon, Jean-Fortuné',
      'Dagnon, Jean-Fortune',
      'Dagnon Fortuné',
      'Dagnon Fortune',
      'Dagnon, Fortuné',
      'Dagnon, Fortune',
      'Dagnon Seynudé Jean-Fortuné',
      'Dagnon Seynude Jean-Fortune',
      'Dagnon, Seynudé Jean-Fortuné',
      'Dagnon, Seynude Jean-Fortune',
      'S.J.F. Dagnon',
      'S. J. F. Dagnon',
      'SJF Dagnon',
      'Dagnon S.J.F.',
      'Dagnon SJF',
      'Dagnon, S.J.F.',
      'Dagnon, SJF',
      'S. Dagnon',
      'Dagnon S.',
      'Dagnon, S.',
      'J.F. Dagnon',
      'Dagnon J.F.',
      'Dagnon, J.F.',
    ],
    jobTitle: lang === 'fr' ? 'Senior Program Officer — Paludisme & Santé Publique (Afrique francophone)' : 'Senior Program Officer — Malaria & Public Health (Francophone Africa)',
    description: SEO[lang].description,
    url: homeUrl(lang),
    image: `${SITE_URL}/og-image.jpg`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': homeUrl(lang) },
    sameAs: [
      'https://scholar.google.com/citations?user=Q6NT-4gAAAAJ',
      'https://orcid.org/0009-0006-5022-1399',
      'https://www.wikidata.org/wiki/Q141154548',
      'https://www.linkedin.com/in/seynud%C3%A9-jean-fortune-dagnon-md-mph-seynudedagnon-com-093a5a2a/',
      'https://www.youtube.com/@seynudedagnon6233',
      'https://www.facebook.com/jeanfortune.dagnon/',
      'https://x.com/SeynudeD',
    ],
    alumniOf: [
      {
        '@type': 'CollegeOrUniversity',
        name: lang === 'fr' ? 'Institut de Médecine Tropicale d’Anvers' : 'Institute of Tropical Medicine, Antwerp',
        url: 'https://www.itg.be/',
        sameAs: 'https://en.wikipedia.org/wiki/Institute_of_Tropical_Medicine_Antwerp',
      },
      {
        '@type': 'CollegeOrUniversity',
        name: lang === 'fr' ? 'Université de Groningen' : 'University of Groningen',
        url: 'https://www.rug.nl/',
        sameAs: 'https://en.wikipedia.org/wiki/University_of_Groningen',
      },
      {
        '@type': 'CollegeOrUniversity',
        name: lang === 'fr' ? 'Université Gamal Abdel Nasser de Conakry' : 'Gamal Abdel Nasser University of Conakry',
        sameAs: 'https://en.wikipedia.org/wiki/Gamal_Abdel_Nasser_University_of_Conakry',
      },
    ],
    worksFor: {
      '@type': 'Organization',
      name: lang === 'fr' ? 'Fondation Bill & Melinda Gates' : 'Bill & Melinda Gates Foundation',
      url: 'https://www.gatesfoundation.org/',
      sameAs: 'https://en.wikipedia.org/wiki/Bill_%26_Melinda_Gates_Foundation',
    },
    memberOf: [
      {
        '@type': 'Organization',
        name: 'Alliance for Malaria Prevention (AMP)',
        url: 'https://allianceformalariaprevention.com/',
      },
    ],
    hasOccupation: [
      {
        '@type': 'Occupation',
        name: lang === 'fr' ? 'Médecin spécialiste en santé publique' : 'Public Health Physician',
        occupationalCategory: '29-1069.00',
        skills: lang === 'fr'
          ? ['Santé publique', 'Épidémiologie', 'Économie de la santé', 'Renforcement des systèmes de santé']
          : ['Public Health', 'Epidemiology', 'Health Economics', 'Health Systems Strengthening'],
      },
      {
        '@type': 'Occupation',
        name: lang === 'fr' ? 'Leader de programmes de lutte contre le paludisme' : 'Malaria Program Leader & Senior Officer',
        skills: lang === 'fr'
          ? ['Élimination du paludisme', 'Lutte antivectorielle', 'Digitalisation de campagnes MILDA', 'Financement direct G2G', 'DHIS2']
          : ['Malaria Elimination', 'Vector Control', 'LLIN Campaign Digitalization', 'Direct G2G Financing', 'DHIS2'],
      },
    ],
    knowsLanguage: ['fr', 'en', 'de', 'es'],
    award: [
      'PMI FSN Employee of the Year 2020 — U.S. President’s Malaria Initiative',
      'USAID LES Employee of the Year 2019 — U.S. Agency for International Development',
      'Special Recognition Award 2025',
    ],
    knowsAbout: [
      // Concepts & Disciplines (Bilingue)
      'Malaria', 'Paludisme',
      'Public Health', 'Santé publique',
      'Health Systems Strengthening', 'Renforcement des systèmes de santé',
      'Malaria Elimination', 'Élimination du paludisme',
      'Digital Health', 'Santé numérique',
      'DHIS2', 'HMIS', 'SIGS',
      'Epidemiology', 'Épidémiologie',
      'Vector Control', 'Lutte antivectorielle',
      'Health Economics', 'Économie de la santé',
      'Health Financing', 'Financement de la santé',
      'Seasonal Malaria Chemoprevention', 'Chimioprévention du paludisme saisonnier', 'SMC', 'CPS',
      'Indoor Residual Spraying', 'Pulvérisation intradomiciliaire', 'IRS', 'PID',
      'Insecticide-Treated Nets', 'Moustiquaires imprégnées d’insecticide', 'MILDA', 'LLIN', 'PBO nets', 'Dual-AI nets',
      'Genomic Surveillance', 'Surveillance génomique', 'Insecticide Resistance', 'Résistance aux insecticides',
      'Data-Driven Decision Making', 'Prise de décision basée sur les données',
      'Policy Analysis', 'Analyse des politiques de santé', 'Policy Brief', 'Note d’orientation stratégique',
      'Subnational Tailoring', 'Adaptation infranationale',
      'PMI', 'USAID', 'Gates Foundation', 'Fondation Gates',
      'Global Fund', 'Fonds mondial', 'World Health Organization', 'OMS',
      'Entomology', 'Entomologie médicale', 'Anopheles gambiae', 'Anopheles coluzzii', 'Anopheles funestus',
      'Program Management', 'Gestion de programmes de santé', 'G2G direct financing', 'Financement direct G2G',
      'Francophone Africa', 'Afrique francophone', 'Bénin', 'Burundi', 'Burkina Faso', 'Sénégal', 'RDC', 'Nigéria',

      // Entités sémantiques formelles (Wikidata URIs)
      {
        '@type': 'DefinedTerm',
        name: 'Malaria',
        sameAs: 'https://www.wikidata.org/wiki/Q12156',
      },
      {
        '@type': 'DefinedTerm',
        name: 'Health Economics',
        sameAs: 'https://www.wikidata.org/wiki/Q1661146',
      },
      {
        '@type': 'DefinedTerm',
        name: 'Public Health',
        sameAs: 'https://www.wikidata.org/wiki/Q189603',
      },
      {
        '@type': 'DefinedTerm',
        name: 'Vector Control',
        sameAs: 'https://www.wikidata.org/wiki/Q169544',
      },
      {
        '@type': 'DefinedTerm',
        name: 'DHIS2',
        sameAs: 'https://www.wikidata.org/wiki/Q17009477',
      },
      {
        '@type': 'DefinedTerm',
        name: 'Epidemiology',
        sameAs: 'https://www.wikidata.org/wiki/Q133805',
      },
      {
        '@type': 'DefinedTerm',
        name: 'Chemoprevention',
        sameAs: 'https://www.wikidata.org/wiki/Q5090623',
      },
      {
        '@type': 'DefinedTerm',
        name: 'Insecticide-Treated Net',
        sameAs: 'https://www.wikidata.org/wiki/Q5363402',
      },
      {
        '@type': 'DefinedTerm',
        name: 'Indoor Residual Spraying',
        sameAs: 'https://www.wikidata.org/wiki/Q11075678',
      },
      {
        '@type': 'DefinedTerm',
        name: 'President’s Malaria Initiative',
        sameAs: 'https://www.wikidata.org/wiki/Q7241285',
      },
      {
        '@type': 'DefinedTerm',
        name: 'Bill & Melinda Gates Foundation',
        sameAs: 'https://www.wikidata.org/wiki/Q180516',
      },
      {
        '@type': 'DefinedTerm',
        name: 'Global Fund to Fight AIDS, Tuberculosis and Malaria',
        sameAs: 'https://www.wikidata.org/wiki/Q1048680',
      },
      {
        '@type': 'DefinedTerm',
        name: 'World Health Organization',
        sameAs: 'https://www.wikidata.org/wiki/Q7809',
      },
      {
        '@type': 'DefinedTerm',
        name: 'Anopheles gambiae',
        sameAs: 'https://www.wikidata.org/wiki/Q133379',
      },
    ],
    hasCredential: [
      { '@type': 'EducationalOccupationalCredential', credentialCategory: 'degree', name: 'MD — Doctor of Medicine' },
      { '@type': 'EducationalOccupationalCredential', credentialCategory: 'degree', name: 'MPH — Master of Public Health' },
      { '@type': 'EducationalOccupationalCredential', credentialCategory: 'degree', name: 'PhD — Doctor of Philosophy in Health Economics (in progress)' },
    ],
    nationality: { '@type': 'Country', name: lang === 'fr' ? 'Bénin' : 'Benin' },
    address: { '@type': 'PostalAddress', addressLocality: 'Cotonou', addressCountry: 'BJ' },
  };
}

export function webSiteJsonLd(lang: Lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SEO[lang].title,
    url: homeUrl(lang),
    description: SEO[lang].description,
    author: { '@type': 'Person', name: fullName(lang) },
    inLanguage: [lang],
    /* No SearchAction here: the site has no query-param-driven search route
       for Google to link to. The filters on /media and /publications are
       client-side React state, not URL-addressable, so a Sitelinks Search Box
       schema would point at a search that doesn't exist. */
  };
}

export function contactPageJsonLd(lang: Lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: CONTACT_SEO[lang].title,
    description: CONTACT_SEO[lang].description,
    url: absUrl(lang, '/contact'),
    mainEntity: {
      '@type': 'Person',
      name: fullName(lang),
      jobTitle: lang === 'fr' ? 'Leader de programme en santé publique et paludisme' : 'Public Health & Malaria Program Leader',
      email: 'contact@seynudedagnon.com',
      address: { '@type': 'PostalAddress', addressLocality: 'Cotonou', addressCountry: 'BJ' },
    },
  };
}

export function collectionPageJsonLd(lang: Lang, pageTitle: string, pageDesc: string, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: pageTitle,
    description: pageDesc,
    url,
    author: { '@type': 'Person', name: fullName(lang) },
    inLanguage: [lang],
  };
}

export function profilePageJsonLd(lang: Lang, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    name: CV_SEO[lang].title,
    description: CV_SEO[lang].description,
    url,
    mainEntity: personJsonLd(lang),
  };
}

export function publicationsPageJsonLd(lang: Lang, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: PUB_SEO[lang].title,
    description: PUB_SEO[lang].description,
    url,
    author: { '@type': 'Person', name: fullName(lang) },
    inLanguage: [lang],
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: PUB_ITEMS.map((item, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        item: {
          '@type': 'ScholarlyArticle',
          headline: item.title[lang],
          name: item.title[lang],
          description: item.description[lang],
          datePublished: String(item.year),
          author: { '@type': 'Person', name: item.authors[lang] },
          publication: {
            '@type': 'PublicationIssue',
            name: item.journal[lang],
          },
          ...(item.url ? { url: item.url } : {}),
        },
      })),
    },
  };
}

/** One page per community photo, so every caption is crawlable text and
    every image has its own addressable, shareable URL. */
export function imageObjectJsonLd(lang: Lang, photo: MediaEntry, url: string) {
  const caption = photo.title[lang];
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    name: caption,
    caption,
    description: caption,
    contentUrl: `${SITE_URL}${photo.src}`,
    url,
    datePublished: photo.date,
    encodingFormat: 'image/webp',
    representativeOfPage: true,
    inLanguage: [lang],
    author: { '@type': 'Person', name: fullName(lang) },
    creator: { '@type': 'Person', name: fullName(lang) },
  };
}

export function breadcrumbJsonLd(lang: Lang, path: string) {
  const items: { name: string; url: string }[] = [
    { name: lang === 'fr' ? 'Dr. Seynudé Jean-Fortuné DAGNON' : 'Seynudé Dagnon', url: homeUrl(lang) },
  ];
  if (path.startsWith('/contact')) {
    items.push({ name: 'Contact', url: absUrl(lang, '/contact') });
  } else if (path.startsWith('/cv')) {
    items.push({ name: lang === 'fr' ? 'Curriculum Vitae' : 'Resume', url: absUrl(lang, '/cv') });
  } else if (path.startsWith('/media')) {
    items.push({ name: lang === 'fr' ? 'Médias' : 'Media', url: absUrl(lang, '/media') });
    const cat = path.split('/media/')[1]?.split('/')[0];
    if (cat && CAT_NAMES[cat]) items.push({ name: CAT_NAMES[cat][lang], url: absUrl(lang, `/media/${cat}`) });
    const photoId = path.split('/media/community/')[1];
    const photo = photoId ? MEDIA_ITEMS.find((m) => m.id === photoId && m.category === 'community') : null;
    if (photo) items.push({ name: photoTitleShort(lang, photo), url: absUrl(lang, path) });
  } else if (path === '/publications-pdf') {
    items.push({ name: lang === 'fr' ? 'Publications (PDF)' : 'Publications (PDF)', url: absUrl(lang, '/publications-pdf') });
  } else if (path.startsWith('/publications')) {
    items.push({ name: 'Publications', url: absUrl(lang, '/publications') });
  } else if (path.startsWith('/tribunes')) {
    items.push({ name: lang === 'fr' ? 'Tribunes' : 'Op-Eds', url: absUrl(lang, '/tribunes') });
    const tribuneSlug = path.split('/tribunes/')[1]?.split('/')[0];
    const tribune = tribuneSlug ? TRIBUNES.find((t) => t.slug === tribuneSlug) : null;
    if (tribune) items.push({ name: tribune.title[lang], url: absUrl(lang, `/tribunes/${tribune.slug}`) });
  } else if (path.startsWith('/projets')) {
    items.push({ name: lang === 'fr' ? 'Projets' : 'Projects', url: absUrl(lang, '/projets') });
    const projectSlug = path.split('/projets/')[1]?.split('/')[0];
    const project = projectSlug ? PROJECTS.find((p) => p.slug === projectSlug) : null;
    if (project) items.push({ name: project.title[lang], url: absUrl(lang, `/projets/${project.slug}`) });
  } else if (path.startsWith('/agenda')) {
    items.push({ name: 'Agenda', url: absUrl(lang, '/agenda') });
  } else if (path === '/presse') {
    items.push({ name: lang === 'fr' ? 'Kit de presse' : 'Press kit', url: absUrl(lang, '/presse') });
  } else if (path === '/inviter') {
    items.push({ name: lang === 'fr' ? 'Inviter le Dr' : 'Invite the Dr', url: absUrl(lang, '/inviter') });
  } else if (path === '/collaborate') {
    items.push({ name: lang === 'fr' ? 'Collaborer' : 'Collaborate', url: absUrl(lang, '/collaborate') });
  } else if (path === '/newsletter') {
    items.push({ name: 'Newsletter', url: absUrl(lang, '/newsletter') });
  } else if (path === '/impact') {
    items.push({ name: lang === 'fr' ? 'Impact & résultats' : 'Impact & results', url: absUrl(lang, '/impact') });
  } else if (path === '/legal') {
    items.push({ name: lang === 'fr' ? 'Mentions légales' : 'Legal notice', url: absUrl(lang, '/legal') });
  } else if (path === '/accessibility') {
    items.push({ name: lang === 'fr' ? 'Accessibilité' : 'Accessibility', url: absUrl(lang, '/accessibility') });
    } else if (path === '/bibliography') {
      items.push({ name: lang === 'fr' ? 'Bibliographie' : 'Bibliography', url: absUrl(lang, '/bibliography') });
    } else if (path === '/portfolio') {
      items.push({ name: lang === 'fr' ? 'Portfolio complet' : 'Full portfolio', url: absUrl(lang, '/portfolio') });
    } else if (path === '/offline') {
      items.push({ name: 'Offline', url: absUrl(lang, '/offline') });
    } else if (path === '/parcours') {
      items.push({ name: lang === 'fr' ? 'Parcours' : 'Career', url: absUrl(lang, '/parcours') });
    } else if (path === '/podcasts') {
      items.push({ name: lang === 'fr' ? 'Podcasts & Audio' : 'Podcasts & Audio', url: absUrl(lang, '/podcasts') });
    } else if (path === '/connect') {
      items.push({ name: lang === 'fr' ? 'Carte Digitale & Contact' : 'Digital Card & Connect', url: absUrl(lang, '/connect') });
    } else if (path === '/toolkit') {
      items.push({ name: lang === 'fr' ? 'Boîte à Outils' : 'Toolkit', url: absUrl(lang, '/toolkit') });
    } else if (path === '/mentorat') {
      items.push({ name: lang === 'fr' ? 'Mentorat & Académie' : 'Mentorship & Academy', url: absUrl(lang, '/mentorat') });
    }
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.name, item: item.url })),
  };
}

export function articleJsonLd(lang: Lang, entry: (typeof TRIBUNES)[number], url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: entry.title[lang],
    description: entry.description[lang],
    datePublished: entry.date,
    inLanguage: [lang],
    /* co-authors, including the site's owner — the reprint is attributed in
       full rather than presented as a solo piece */
    author: [
      { '@type': 'Person', name: 'Professor Rose Leke' },
      { '@type': 'Person', name: 'Seynudé Jean-Fortuné Dagnon' },
    ],
    publisher: { '@type': 'Organization', name: entry.source.name, url: entry.source.url },
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    image: `${SITE_URL}/og/${entry.slug}.${lang}.jpg`,
  };
}

export function projectJsonLd(lang: Lang, entry: (typeof PROJECTS)[number], url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: entry.title[lang],
    description: entry.description[lang],
    datePublished: entry.date,
    inLanguage: [lang],
    author: { '@type': 'Person', name: fullName(lang) },
    about: { '@type': 'Thing', name: entry.tag[lang] },
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    image: `${SITE_URL}/og/${entry.slug}.${lang}.jpg`,
  };
}

/* ── RSS feed ──────────────────────────────────────────────────── */

/* One feed for the whole site, pointing at the canonical (English) URLs —
   RSS 2.0 has no per-item language alternates, and splitting the feed per
   language would halve its reach. Consumed only by scripts/prerender.mjs at
   build time; it ships as dist/feed.xml. */
export function buildRss(): string {
  const xmlEscape = (s: string) =>
    String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const rfc822 = (iso: string) => new Date(`${iso}T00:00:00Z`).toUTCString();

  /* Press coverage points to the external article; the agenda anchors to its
     on-site section, or the external source when it is not already the link
     of a press item (each feed <link> must stay unique). */
  const pressLinks = new Set(MEDIA_ITEMS.filter((m) => m.category === 'press' && m.url).map((m) => m.url));
  const pressItems = MEDIA_ITEMS.filter((m) => m.category === 'press' && m.url)
    .map((m) => ({
      title: m.title.en,
      link: m.url!,
      pubDate: rfc822(m.date),
      description: m.description?.en ?? '',
      category: 'press',
      image: m.thumb ?? '',
    }));

  const agendaItems = AGENDA_ITEMS.map((e) => ({
    title: e.title.en,
    link: e.link && !pressLinks.has(e.link) ? e.link : absUrl('en', `/agenda#${e.id}`),
    pubDate: rfc822(e.date),
    description: e.description.en,
    category: e.type,
    image: '',
  }));

  const items: {
    title: string;
    link: string;
    pubDate: string;
    description: string;
    category: string;
    image: string;
  }[] = [
    ...TRIBUNES.map((e) => ({
      title: e.title.en,
      link: absUrl('en', `/tribunes/${e.slug}`),
      pubDate: rfc822(e.date),
      description: e.description.en,
      category: 'opinion',
      image: `${SITE_URL}/og/${e.slug}.en.jpg`,
    })),
    ...PROJECTS.map((e) => ({
      title: e.title.en,
      link: absUrl('en', `/projets/${e.slug}`),
      pubDate: rfc822(e.date),
      description: e.description.en,
      category: 'case-study',
      image: `${SITE_URL}/og/${e.slug}.en.jpg`,
    })),
    ...pressItems,
    ...agendaItems,
  ].sort((a, b) => b.pubDate.localeCompare(a.pubDate));

  const itemXml = items
    .map(
      (i) => `  <item>
    <title>${xmlEscape(i.title)}</title>
    <link>${i.link}</link>
    <guid isPermaLink="true">${i.link}</guid>
    <pubDate>${i.pubDate}</pubDate>
    <description>${xmlEscape(i.description)}</description>
    <category>${xmlEscape(i.category)}</category>
    <author>${xmlEscape(fullName('en'))}</author>
    ${i.image ? `    <media:content url="${i.image}" medium="image"/>` : ''}
  </item>`,
    )
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">',
    '  <channel>',
    `    <title>${xmlEscape(SEO.en.title)}</title>`,
    `    <link>${homeUrl('en')}</link>`,
    `    <description>${xmlEscape(SEO.en.description)}</description>`,
    '    <language>en</language>',
    `    <lastBuildDate>${rfc822(new Date().toISOString().slice(0, 10))}</lastBuildDate>`,
    `    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>`,
    itemXml,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');
}

export function buildPodcastRss(): string {
  const xmlEscape = (s: string) =>
    String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const rfc822 = (iso: string) => new Date(`${iso}T00:00:00Z`).toUTCString();
  const items = [...TRIBUNES]
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((t) => {
      const link = `${SITE_URL}/tribunes/${t.slug}`;
      return `  <item>
    <title>${xmlEscape(t.title.en)}</title>
    <link>${link}</link>
    <guid isPermaLink="true">${link}</guid>
    <pubDate>${rfc822(t.date)}</pubDate>
    <description>${xmlEscape(t.description.en)}</description>
    <itunes:author>${xmlEscape(fullName('en'))}</itunes:author>
    <itunes:summary>${xmlEscape(t.description.en)}</itunes:summary>
    <enclosure url="${link}" type="text/html" length="0" />
  </item>`;
    })
    .join('\n');
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${xmlEscape('Seynudé Dagnon — Tribunes & Talks')}</title>`,
    `    <link>${SITE_URL}/tribunes</link>`,
    `    <description>${xmlEscape('Op-eds and talks by Dr. Seynudé Dagnon on malaria and public health — audio companion.')}</description>`,
    '    <language>en</language>',
    `    <lastBuildDate>${rfc822(new Date().toISOString().slice(0, 10))}</lastBuildDate>`,
    `    <atom:link href="${SITE_URL}/podcast.xml" rel="self" type="application/rss+xml"/>`,
    '    <itunes:author>Seynudé Dagnon</itunes:author>',
    '    <itunes:category text="Science" />',
    `    <itunes:image href="${SITE_URL}/og-image.jpg" />`,
    items,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');
}

/* ── Agenda events (JSON-LD) ───────────────────────────────────── */

/* Future events only: a listing of past appearances has no business
   appearing in a search result as an upcoming event. Start dates are
   compared lexically (ISO strings), the same way the agenda page splits
   upcoming from past. Null when nothing is upcoming — an empty @graph is
   noise, and the agenda page falls back to its contact call-to-action. */
export function eventsJsonLd(lang: Lang): object | null {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const upcoming = AGENDA_ITEMS.filter((e) => e.date > todayStr)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((e) => ({
      '@type': 'Event',
      '@id': absUrl(lang, '/agenda') + `#${e.id}`,
      name: e.title[lang],
      description: e.description[lang],
      startDate: e.date,
      location: {
        '@type': 'Place',
        name: e.location[lang],
      },
      organizer: {
        '@type': 'Person',
        name: fullName(lang),
        url: absUrl(lang, '/'),
      },
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      eventStatus: 'https://schema.org/EventScheduled',
      url: absUrl(lang, '/agenda') + `#${e.id}`,
    }));
  return upcoming.length === 0 ? null : { '@context': 'https://schema.org', '@graph': upcoming };
}

/* ── Press kit FAQ (JSON-LD) ───────────────────────────────────── */

/* FAQPage structured data for the /presse page. Built from the same
   src/data/faq.ts the visible block renders, so the schema and the page can
   never disagree. Null everywhere else — a FAQ page is a FAQ page. */
export function faqJsonLd(lang: Lang): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((f) => ({
      '@type': 'Question',
      name: f.question[lang],
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer[lang],
      },
    })),
  };
}

/* ── iCal feed ─────────────────────────────────────────────────── */

/* The subscribable calendar, one static file for the whole site in the
   canonical (English) labels — the same convention as the RSS feed, since
   iCal has no per-language alternates either. Consumed by
   scripts/prerender.mjs at build time; it ships as dist/agenda.ics. */
export function buildIcsFeed(): string {
  const icsEscape = (s: string) =>
    String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
  /* iCal lines longer than 75 octets must be folded with a CRLF + space; the
     continuation segment carries the leading space, so it may only hold 73
     more characters (first segment 74) to keep every physical line at or
     under the 75-octet limit. */
  const fold = (line: string): string => {
    if (line.length <= 74) return line;
    const chunks: string[] = [line.slice(0, 74)];
    let rest = line.slice(74);
    while (rest.length > 73) {
      chunks.push(rest.slice(0, 73));
      rest = rest.slice(73);
    }
    chunks.push(rest);
    return chunks.join('\r\n ');
  };
  const now = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//seynudedagnon.com//Agenda//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Dr Seynude Dagnon — Agenda',
    ...AGENDA_ITEMS.sort((a, b) => a.date.localeCompare(b.date)).flatMap((e) => [
      'BEGIN:VEVENT',
      `UID:${e.id}@seynudedagnon.com`,
      `DTSTAMP:${now}`,
      `DTSTART;VALUE=DATE:${e.date.replace(/-/g, '')}`,
      `SUMMARY:${icsEscape(e.title.en)}`,
      `DESCRIPTION:${icsEscape(e.description.en)}`,
      `LOCATION:${icsEscape(e.location.en)}`,
      ...(e.link ? [`URL:${e.link}`] : []),
      'END:VEVENT',
    ]),
    'END:VCALENDAR',
  ];
  return lines.map(fold).join('\r\n') + '\r\n';
}

/* ── Resolved metadata for one route ──────────────────────────── */

export interface PageMeta {
  title: string;
  description: string;
  keywords: string;
  url: string;
  /** true when the path matches no known route — the page must not be indexed */
  notFound: boolean;
  /** true for private pages that exist but must not be indexed (e.g. /admin) */
  noindex?: boolean;
  /** Real per-language URLs — this is what makes the hreflang tags useful. */
  alternates: { hreflang: string; href: string }[];
  /** Per-page share image: the actual photo on photo pages, the generic
      og-image.jpg everywhere else. */
  ogImage: string;
  ogImageWidth: number;
  ogImageHeight: number;
  ogImageType: string;
  /** 'article' on op-ed/project pages so social platforms render a rich
      card, 'website' elsewhere */
  ogType: string;
  ogLocale: string;
  ogLocaleAlternate: string;
  siteName: string;
  jsonLd: {
    person: object;
    website: object;
    breadcrumb: object;
    page: object | null;
    events: object | null;
    faq: object | null;
  };
}

/** `path` is the language-agnostic route ('/media/press'), never the
    prefixed pathname — call splitPath() first if you have the latter. */
export function pageMeta(lang: Lang, path: string): PageMeta {
  /* canonical URLs never carry a trailing slash (the sitemap has none either) */
  const route = path.replace(/\/+$/, '') || '/';
  const isContact = route.startsWith('/contact');
  const isCv = route === '/cv';
  const isMedia = route.startsWith('/media');
  const isMediaLanding = route === '/media';
  const mediaCategory = isMedia && !isMediaLanding ? route.split('/media/')[1]?.split('/')[0] || null : null;
  const isPublicationsPdf = route === '/publications-pdf';
  const isPub = route.startsWith('/publications') && !isPublicationsPdf;
  const isAgenda = route.startsWith('/agenda');
  const isPresse = route === '/presse';
  const isInvite = route === '/inviter';
  const isCollaborate = route === '/collaborate';
  const isNewsletter = route === '/newsletter';
  const isImpact = route === '/impact';
  const isLegal = route === '/legal';
  const isAccessibility = route === '/accessibility';
  const isBibliography = route === '/bibliography';
  const isPortfolio = route === '/portfolio';
  const isOffline = route === '/offline';
  const isCareer = route === '/parcours';
  const isPodcasts = route === '/podcasts';
  const isConnect = route === '/connect';
  const isToolkit = route === '/toolkit';
  const isMentorship = route === '/mentorat';
  const isAdmin = route === '/admin';
  const isPreferences = route === '/newsletter/preferences';
  const isChangelog = route === '/changelog';
  const isNoindex = isAdmin || isPreferences || isChangelog;
  const isTribunes = route === '/tribunes';
  const isTribuneArticle = route.startsWith('/tribunes/') && !isTribunes;
  const tribuneSlug = isTribuneArticle ? route.split('/tribunes/')[1]?.split('/')[0] || null : null;
  const tribune = tribuneSlug ? TRIBUNES.find((t) => t.slug === tribuneSlug) || null : null;
  const isProjects = route === '/projets';
  const isProjectArticle = route.startsWith('/projets/') && !isProjects;
  const projectSlug = isProjectArticle ? route.split('/projets/')[1]?.split('/')[0] || null : null;
  const project = projectSlug ? PROJECTS.find((p) => p.slug === projectSlug) || null : null;
  const photoId = route.split('/media/community/')[1] || null;
  const photo = photoId ? MEDIA_ITEMS.find((m) => m.id === photoId && m.category === 'community') || null : null;
  const notFound = !PRERENDER_ROUTES.includes(route) && !isNoindex;

  const catName = mediaCategory ? CAT_NAMES[mediaCategory] : null;
  const catDesc = mediaCategory ? CAT_DESCRIPTIONS[mediaCategory] : null;

  const data = notFound
    ? {
        title: `404 — ${UI[lang]['notFound.title']} | ${fullName(lang)}`,
        description: SEO[lang].description,
        keywords: SEO[lang].keywords,
      }
    : tribune
      ? {
          title: tribuneShortTitle(lang, tribune),
          description: tribune.description[lang],
          keywords: `${tribune.title[lang]}, ${TRIBUNES_SEO[lang].keywords}, Seynudé Dagnon, Seynude Dagnon, Fortuné Dagnon, Dr Dagnon, DAGNON`,
        }
      : isTribunes
        ? TRIBUNES_SEO[lang]
        : project
      ? {
          title: projectShortTitle(lang, project),
          description: project.description[lang],
          keywords: `${project.title[lang]}, ${project.tag[lang]}, ${project.location[lang]}, ${PROJETS_SEO[lang].keywords}, Seynudé Dagnon, Seynude Dagnon, Fortuné Dagnon, Dr Dagnon, DAGNON`,
        }
      : isProjects
        ? PROJETS_SEO[lang]
        : isPub
    ? PUB_SEO[lang]
    : photo
      ? {
          title: photoTitleShort(lang, photo),
          description: photoDescription(lang, photo),
          keywords: `${photo.title[lang]}, ${CAT_DESCRIPTIONS.community.keywords}, Seynudé Dagnon, Seynude Dagnon, Fortuné Dagnon, Dr Dagnon, DAGNON, Bénin, santé publique`,
        }
      : isMedia && catName
      ? {
          /* the brand name, not the generic "Media"/"Médias" suffix every
             category used to share — that gave /media/press a 15-char title
             with no differentiator and no brand */
          title: `${catName[lang]} — ${shortName(lang)}`,
          description: catDesc?.[lang] || MEDIA_SEO[lang].description,
          keywords: catDesc?.keywords || MEDIA_SEO[lang].keywords,
        }
      : isMedia
        ? MEDIA_SEO[lang]
      : isContact
        ? CONTACT_SEO[lang]
        : isCv
          ? CV_SEO[lang]
          : isAgenda
            ? AGENDA_SEO[lang]
            : isPresse
              ? PRESSE_SEO[lang]
              : isInvite
                ? INVITER_SEO[lang]
                : isCollaborate
                  ? COLLAB_SEO[lang]
                  : isNewsletter
                  ? NEWSLETTER_SEO[lang]
                  : isImpact
                    ? IMPACT_SEO[lang]
                    : isLegal
                      ? LEGAL_SEO[lang]
                      : isAccessibility
                        ? ACCESSIBILITY_SEO[lang]
                        : isBibliography
                          ? BIBLIOGRAPHY_SEO[lang]
                          : isPortfolio
                            ? PORTFOLIO_SEO[lang]
                          : isOffline
                            ? OFFLINE_SEO[lang]
                          : isCareer
                            ? CAREER_SEO[lang]
                          : isPublicationsPdf
                            ? PUBLICATIONS_PDF_SEO[lang]
                          : isPodcasts
                            ? PODCASTS_SEO[lang]
                          : isConnect
                            ? CONNECT_SEO[lang]
                          : isToolkit
                            ? TOOLKIT_SEO[lang]
                          : isMentorship
                            ? MENTORSHIP_SEO[lang]
                        : isAdmin
                          ? ADMIN_SEO[lang]
                          : isPreferences
                            ? PREFERENCES_SEO[lang]
                            : isChangelog
                              ? CHANGELOG_SEO[lang]
                              : SEO[lang];

  const url = absUrl(lang, route);

  /* op-eds and project write-ups are articles for social platforms — a
     website og:type would strip the share card of its rich formatting */
  const ogType = tribune || project ? 'article' : 'website';

  /* every article gets its own social card (scripts/gen-article-og.mjs draws
     the title on the brand background); photos and everything else keep the
     site-wide card */
  const ogImage = photo
    ? `${SITE_URL}${photo.src}`
    : tribune
      ? `${SITE_URL}/og/${tribune.slug}.${lang}.jpg`
      : project
        ? `${SITE_URL}/og/${project.slug}.${lang}.jpg`
        : `${SITE_URL}/og-image.jpg`;
  const ogImageWidth = photo ? PHOTO_DIMS[photo.id]?.width || 1200 : 1200;
  const ogImageHeight = photo ? PHOTO_DIMS[photo.id]?.height || 630 : 630;
  const ogImageType = photo ? 'image/webp' : 'image/jpeg';

  return {
    title: data.title,
    description: data.description,
    keywords: data.keywords,
    url,
    notFound,
    noindex: isNoindex,
    alternates: [
      ...SUPPORTED.map((l) => ({ hreflang: l, href: absUrl(l, route) })),
      { hreflang: 'x-default', href: absUrl(DEFAULT_LANG, route) },
    ],
    ogImage,
    ogImageWidth,
    ogImageHeight,
    ogImageType,
    ogType,
    ogLocale: SEO[lang].ogLocale,
    ogLocaleAlternate: SEO[lang === 'fr' ? 'en' : 'fr'].ogLocale,
    siteName: fullName(lang),
    jsonLd: {
      person: personJsonLd(lang),
      website: webSiteJsonLd(lang),
      breadcrumb: breadcrumbJsonLd(lang, route),
      events: isAgenda && !notFound ? eventsJsonLd(lang) : null,
      faq: isPresse && !notFound ? faqJsonLd(lang) : null,
      page: notFound
        ? null
        : isContact
          ? contactPageJsonLd(lang)
          : isCv
            ? profilePageJsonLd(lang, url)
            : isPub || isBibliography || isPublicationsPdf
              ? publicationsPageJsonLd(lang, url)
              : tribune
                ? articleJsonLd(lang, tribune, url)
                : project
                  ? projectJsonLd(lang, project, url)
                  : photo
                    ? imageObjectJsonLd(lang, photo, url)
                    : isMedia || isAgenda || isTribunes || isProjects || isPresse || isInvite || isCollaborate || isNewsletter || isImpact || isLegal || isAccessibility || isPortfolio || isOffline || isCareer || isPodcasts
                      ? collectionPageJsonLd(lang, data.title, data.description, url)
                      : null,
    },
  };
}

/* Every language-agnostic route rendered to static HTML at build time, in
   every supported language. The sitemap is generated from this list too, so
   the two can no longer drift apart. */
export const PRERENDER_ROUTES = [
  '/',
  '/contact',
  '/cv',
  '/media',
  '/media/interview',
  '/media/conference',
  '/media/speaking',
  '/media/press',
  '/media/community',
  ...MEDIA_ITEMS.filter((m) => m.category === 'community').map((m) => `/media/community/${m.id}`),
  '/publications',
  '/tribunes',
  ...TRIBUNES.map((t) => `/tribunes/${t.slug}`),
  '/projets',
  ...PROJECTS.map((p) => `/projets/${p.slug}`),
  '/agenda',
  '/presse',
  '/inviter',
  '/collaborate',
  '/newsletter',
  '/impact',
  '/legal',
  '/accessibility',
  '/bibliography',
  '/portfolio',
  '/offline',
  '/parcours',
  '/publications-pdf',
  '/podcasts',
  '/connect',
  '/toolkit',
  '/mentorat',
];

export const PRERENDER_LANGS: Lang[] = SUPPORTED;

/** Sitemap weighting per route, kept next to the route list it describes. */
export const ROUTE_PRIORITY: Record<string, { priority: string; changefreq: string }> = {
  '/': { priority: '1.0', changefreq: 'weekly' },
  '/contact': { priority: '0.7', changefreq: 'monthly' },
  '/connect': { priority: '0.8', changefreq: 'monthly' },
  '/toolkit': { priority: '0.8', changefreq: 'monthly' },
  '/mentorat': { priority: '0.8', changefreq: 'monthly' },
  '/cv': { priority: '0.7', changefreq: 'monthly' },
  '/media': { priority: '0.9', changefreq: 'weekly' },
  '/publications': { priority: '0.9', changefreq: 'weekly' },
  '/tribunes': { priority: '0.8', changefreq: 'weekly' },
  '/projets': { priority: '0.8', changefreq: 'weekly' },
  '/agenda': { priority: '0.8', changefreq: 'weekly' },
  '/presse': { priority: '0.5', changefreq: 'monthly' },
  '/inviter': { priority: '0.5', changefreq: 'monthly' },
  '/collaborate': { priority: '0.7', changefreq: 'monthly' },
  '/newsletter': { priority: '0.5', changefreq: 'weekly' },
  '/impact': { priority: '0.7', changefreq: 'monthly' },
  '/legal': { priority: '0.3', changefreq: 'yearly' },
  '/accessibility': { priority: '0.3', changefreq: 'yearly' },
  '/bibliography': { priority: '0.7', changefreq: 'weekly' },
  '/portfolio': { priority: '0.8', changefreq: 'monthly' },
  '/offline': { priority: '0.3', changefreq: 'yearly' },
  '/parcours': { priority: '0.8', changefreq: 'monthly' },
  '/publications-pdf': { priority: '0.6', changefreq: 'monthly' },
  '/podcasts': { priority: '0.8', changefreq: 'weekly' },
  ...Object.fromEntries(
    TRIBUNES.map((t) => [`/tribunes/${t.slug}`, { priority: '0.7', changefreq: 'monthly' }]),
  ),
  ...Object.fromEntries(
    PROJECTS.map((p) => [`/projets/${p.slug}`, { priority: '0.7', changefreq: 'monthly' }]),
  ),
  /* individual photos: leaf pages, crawled from the album page and the
     sitemap — low priority by design */
  ...Object.fromEntries(
    MEDIA_ITEMS.filter((m) => m.category === 'community').map((m) => [
      `/media/community/${m.id}`,
      { priority: '0.4', changefreq: 'monthly' },
    ]),
  ),
};
export const DEFAULT_ROUTE_PRIORITY = { priority: '0.8', changefreq: 'monthly' };

/** Last modification date for a route, as `YYYY-MM-DD`.
 *  Entity pages use their own publication/date; collection pages use the
 *  newest item they list; everything else falls back to the build date.
 *  MEDIA dates are ISO strings and PUB year is synthesised to `YYYY-01-01`. */
export function routeLastmod(route: string, fallback: string): string {
  // entity pages — own date
  if (route.startsWith('/media/community/')) {
    const id = route.slice('/media/community/'.length);
    const item = MEDIA_ITEMS.find((m) => m.id === id && m.category === 'community');
    if (item?.date) return item.date;
  }
  if (route.startsWith('/tribunes/')) {
    const slug = route.slice('/tribunes/'.length);
    const t = TRIBUNES.find((x) => x.slug === slug);
    if (t?.date) return t.date;
  }
  if (route.startsWith('/projets/')) {
    const slug = route.slice('/projets/'.length);
    const p = PROJECTS.find((x) => x.slug === slug);
    if (p?.date) return p.date;
  }
  // collection pages — newest item
  if (route === '/publications' || route === '/publications-pdf' || route === '/bibliography') {
    const maxYear = Math.max(...PUB_ITEMS.map((p) => p.year));
    if (Number.isFinite(maxYear)) return `${maxYear}-01-01`;
  }
  if (route === '/portfolio' || route === '/parcours') {
    const cand = [
      ...TRIBUNES.map((t) => t.date),
      ...PROJECTS.map((p) => p.date),
      ...MEDIA_ITEMS.map((m) => m.date),
      ...AGENDA_ITEMS.map((e) => e.date),
      `${Math.max(...PUB_ITEMS.map((p) => p.year))}-01-01`,
    ];
    const max = cand.reduce((m, c) => (c > m ? c : m), '1970-01-01');
    if (max !== '1970-01-01') return max;
  }
  if (route === '/tribunes') {
    const max = TRIBUNES.reduce((m, t) => (t.date > m ? t.date : m), '1970-01-01');
    if (max !== '1970-01-01') return max;
  }
  if (route === '/projets') {
    const max = PROJECTS.reduce((m, p) => (p.date > m ? p.date : m), '1970-01-01');
    if (max !== '1970-01-01') return max;
  }
  if (route === '/agenda') {
    const max = AGENDA_ITEMS.reduce((m, e) => (e.date > m ? e.date : m), '1970-01-01');
    if (max !== '1970-01-01') return max;
  }
  if (route === '/podcasts') {
    return '2026-08-25';
  }
  if (route.startsWith('/media')) {
    const cat = route === '/media' ? null : route.split('/media/')[1]?.split('/')[0] || null;
    const items = cat ? MEDIA_ITEMS.filter((m) => m.category === cat) : MEDIA_ITEMS;
    const max = items.reduce((m, e) => (e.date > m ? e.date : m), '1970-01-01');
    if (max !== '1970-01-01') return max;
  }
  return fallback;
}

/* re-exported so scripts/prerender.mjs works from this module alone */
export { localePath, DEFAULT_LANG } from '@/i18n/routing';
/* re-exported so scripts/gen-article-og.mjs can render one card per article
   from the compiled bundle instead of parsing TypeScript itself */
export { TRIBUNES } from '@/data/tribunes';
export { PROJECTS } from '@/data/projects';
