import type { Lang } from '@/i18n/lang';

export interface LegalSection {
  id: string;
  title: Record<Lang, string>;
  body: Record<Lang, string[]>;
}

/** Last substantive revision of the legal pages (ISO date, shown verbatim). */
export const LEGAL_LAST_UPDATED = '2026-09-04';

export const LEGAL_SECTIONS: LegalSection[] = [
  {
    id: 'editeur',
    title: { fr: 'Éditeur du site', en: 'Site editor' },
    body: {
      fr: [
        'Ce site est édité et publié par Dr. Seynudé Jean-Fortuné Dagnon, MD, MPH — leader de programme santé publique et paludisme, basé à Cotonou (Bénin).',
        'Directeur de la publication : Dr. Seynudé Jean-Fortuné Dagnon.',
        'Pour toute question relative au site, à son contenu ou à vos données personnelles, utilisez la page Contact de ce site : les messages y sont traités dans un délai de 72 heures ouvrées.',
      ],
      en: [
        'This site is edited and published by Dr. Seynudé Jean-Fortuné Dagnon, MD, MPH — public health and malaria program leader, based in Cotonou, Benin.',
        'Publication director: Dr. Seynudé Jean-Fortuné Dagnon.',
        'For any question about the site, its content or your personal data, use the Contact page of this site: messages are answered within 72 business hours.',
      ],
    },
  },
  {
    id: 'hebergement',
    title: { fr: 'Hébergement', en: 'Hosting' },
    body: {
      fr: [
        'Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis.',
        'Les fichiers du site sont servis depuis un réseau de distribution de contenu (CDN) mondial ; les adresses IP des visiteurs peuvent transiter par les serveurs de l\'hébergeur, situés aux États-Unis et en Europe.',
      ],
      en: [
        'The site is hosted by Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, United States.',
        'Site files are served from a worldwide content delivery network (CDN); visitor IP addresses may transit through the host\'s servers, located in the United States and Europe.',
      ],
    },
  },
  {
    id: 'donnees',
    title: { fr: 'Données personnelles', en: 'Personal data' },
    body: {
      fr: [
        'Conformément au Règlement (UE) 2016/679 (RGPD), les données collectées sur ce site et leur traitement sont décrits ci-dessous.',
        'Formulaire de contact : nom, adresse e-mail, numéro de téléphone, objet et message. Finalité : répondre à votre demande. Base légale : intérêt légitime (art. 6.1.f). Données conservées jusqu\'au traitement de la demande, puis supprimées.',
        'Newsletter : adresse e-mail, langue choisie et préférence de fréquence (hebdomadaire ou mensuelle). Finalité : envoi de la lettre d\'information demandée. Base légale : consentement (art. 6.1.a) via le double opt-in. Données conservées jusqu\'à votre désabonnement, à tout moment via le lien prévu dans chaque message.',
        'Abonnements de rappel d\'agenda (push) : abonnement au service de notifications du navigateur. Finalité : rappels des événements à venir. Base légale : consentement (art. 6.1.a). Abonnements conservés 24 mois au maximum.',
        'Mesure d\'audience : après votre consentement explicite (art. 6.1.a), Google Analytics 4 et Vercel Analytics peuvent traiter des données d\'usage (pages visitées, durée de session, zone géographique approximative). Les recherches internes sont journalisées uniquement avec ce consentement, après réduction des données sensibles apparentes, et supprimées au plus tard après 90 jours.',
        'Aucune donnée n\'est vendue ni cédée à des tiers à des fins commerciales.',
      ],
      en: [
        'In accordance with Regulation (EU) 2016/679 (GDPR), the data collected on this site and how it is processed are described below.',
        'Contact form: name, e-mail address, phone number, subject and message. Purpose: to answer your request. Legal basis: legitimate interest (art. 6.1.f). Data is kept until the request is handled, then deleted.',
        'Newsletter: e-mail address, chosen language and frequency preference (weekly or monthly). Purpose: sending the requested newsletter. Legal basis: consent (art. 6.1.a) via double opt-in. Data is kept until you unsubscribe, at any time via the link provided in every message.',
        'Agenda reminder subscriptions (push): browser notification service subscription. Purpose: reminders of upcoming events. Legal basis: consent (art. 6.1.a). Subscriptions are kept for up to 24 months.',
        'Audience measurement: after your explicit consent (art. 6.1.a), Google Analytics 4 and Vercel Analytics may process usage data (pages visited, session duration, approximate geography). Internal searches are logged only with this consent, after apparent sensitive data is minimized, and deleted within 90 days.',
        'No data is sold or transferred to third parties for commercial purposes.',
      ],
    },
  },
  {
    id: 'cookies',
    title: { fr: 'Cookies et traceurs', en: 'Cookies and trackers' },
    body: {
      fr: [
        'Ce site n\'utilise aucun stockage publicitaire. Le thème et la langue sont conservés localement pour le fonctionnement du site. Google Analytics et Vercel Analytics ne sont chargés qu\'après votre accord explicite.',
        'Vous pouvez accepter, refuser ou modifier ce choix à tout moment avec le bouton « Gérer les cookies » affiché sur le site. Le refus n\'affecte pas les fonctionnalités essentielles.',
        'Aucune donnée de santé ou donnée sensible n\'est collectée par les traceurs de ce site.',
      ],
      en: [
        'This site uses no advertising storage. Theme and language are stored locally for site operation. Google Analytics and Vercel Analytics load only after your explicit agreement.',
        'You can accept, decline or change this choice at any time using the “Manage cookies” button shown on the site. Declining does not affect essential features.',
        'No health or sensitive data is collected by this site\'s trackers.',
      ],
    },
  },
  {
    id: 'droits',
    title: { fr: 'Vos droits', en: 'Your rights' },
    body: {
      fr: [
        'Conformément aux articles 15 à 22 du RGPD, vous disposez des droits suivants sur vos données : accès, rectification, effacement, limitation du traitement, opposition et portabilité.',
        'Pour les exercer, écrivez via la page Contact en précisant « Droits RGPD » et l\'adresse e-mail concernée. Votre demande est traitée dans un délai de 30 jours.',
        'Vous pouvez vous désabonner de la newsletter à tout moment via le lien présent dans chaque message, sans justification.',
        'Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès de l\'autorité de contrôle compétente (en France : CNIL — cnil.fr ; au Bénin : APDP — apdp.bj).',
      ],
      en: [
        'Under articles 15 to 22 of the GDPR, you have the following rights over your data: access, rectification, erasure, restriction of processing, objection and portability.',
        'To exercise them, write via the Contact page, mentioning "GDPR rights" and the e-mail address concerned. Your request is answered within 30 days.',
        'You can unsubscribe from the newsletter at any time via the link in every message, without having to justify it.',
        'If you believe your rights are not respected, you can lodge a complaint with the competent supervisory authority (in France: CNIL — cnil.fr; in Benin: APDP — apdp.bj).',
      ],
    },
  },
  {
    id: 'propriete',
    title: { fr: 'Propriété intellectuelle', en: 'Intellectual property' },
    body: {
      fr: [
        'Les textes, analyses, tribunes et photographies publiés sur ce site sont la propriété de leurs auteurs respectifs. Les tribunes rééditées sur ce site sont reprises avec l\'accord de leurs co-auteurs et/ou éditeurs, en citant intégralement les sources.',
        'La reproduction d\'un contenu de ce site est autorisée à condition d\'en mentionner clairement la source, l\'auteur et la date de publication, et de ne pas en altérer le sens. Toute utilisation commerciale nécessite une autorisation écrite préalable.',
      ],
      en: [
        'The texts, analyses, op-eds and photographs published on this site are the property of their respective authors. Op-eds reprinted on this site are reproduced with the agreement of their co-authors and/or publishers, with full attribution.',
        'Reproduction of content from this site is permitted provided the source, author and publication date are clearly credited, and the meaning is not altered. Any commercial use requires prior written permission.',
      ],
    },
  },
];
