import type { Lang } from '@/i18n/lang';

/* The press kit FAQ. Single source of truth for two consumers: the FAQ
   block on the /presse page and the FAQPage JSON-LD in src/seo/meta.ts —
   keeping them in one file guarantees the structured data can never drift
   from the visible questions and answers. */

export interface FaqEntry {
  question: Record<Lang, string>;
  answer: Record<Lang, string>;
}

export const FAQ_ITEMS: FaqEntry[] = [
  {
    question: {
      fr: 'Qui est le Dr. Seynudé Jean-Fortuné Dagnon ?',
      en: 'Who is Dr. Seynudé Jean-Fortuné Dagnon?',
    },
    answer: {
      fr: 'Dr. Seynudé Jean-Fortuné Dagnon, MD, MPH, est Senior Program Officer — Paludisme / Afrique francophone à la Fondation Gates. Depuis plus de 17 ans, il pilote des programmes de lutte contre le paludisme en Afrique de l\'Ouest et centrale : digitalisation des campagnes, chimioprévention saisonnière, lutte antivectorielle et systèmes de données. Il a dirigé des programmes USAID/PMI au Bénin et a été distingué FSN Employee of the Year 2020.',
      en: 'Dr. Seynudé Jean-Fortuné Dagnon, MD, MPH, is Senior Program Officer — Malaria / Francophone Africa at the Gates Foundation. For over 17 years he has led malaria programs across West and Central Africa: campaign digitalization, seasonal chemoprevention, vector control and data systems. He directed USAID/PMI programs in Benin and was named FSN Employee of the Year 2020.',
    },
  },
  {
    question: {
      fr: 'Le site est-il disponible en plusieurs langues ?',
      en: 'Is the site available in multiple languages?',
    },
    answer: {
      fr: 'Oui. Chaque page existe en français et en anglais, avec un basculement instantané en haut de page. Les publications, tribunes, projets et actualités sont entièrement traduits dans les deux langues.',
      en: 'Yes. Every page exists in both French and English, with an instant switch at the top of the page. Publications, op-eds, case studies and news are fully translated into both languages.',
    },
  },
  {
    question: {
      fr: 'Comment obtenir la photo de portrait et le dossier de presse ?',
      en: 'How can I get the portrait photo and the press kit?',
    },
    answer: {
      fr: 'La photo de portrait en haute définition et le dossier de presse complet (biographies FR/EN, chiffres clés et contact) sont en téléchargement libre sur cette page, ainsi que les versions PDF du kit et du CV. Les contenus sont libres de droits pour la presse, avec mention du nom.',
      en: 'The high-resolution portrait photo and the complete press kit (FR/EN biographies, key figures and contact) are freely downloadable on this page, along with PDF versions of the kit and the CV. The content is royalty-free for the press, with a credit line.',
    },
  },
  {
    question: {
      fr: 'Le Dr. Dagnon est-il disponible pour des interviews et des conférences ?',
      en: 'Is Dr. Dagnon available for interviews and conferences?',
    },
    answer: {
      fr: 'Oui. Il intervient régulièrement dans les médias et lors de conférences internationales sur le paludisme et les systèmes de santé en Afrique francophone. Pour une interview, un commentaire ou un sujet de fond, utilisez le formulaire de contact avec le motif « Presse ».',
      en: 'Yes. He regularly speaks to the media and at international conferences on malaria and health systems in Francophone Africa. For an interview, a comment or an in-depth story, use the contact form with the "Press" subject.',
    },
  },
  {
    question: {
      fr: 'Où trouver la liste complète des publications ?',
      en: 'Where can I find the full list of publications?',
    },
    answer: {
      fr: 'Toutes les publications sont listées sur la page Publications, triées par année, avec export en BibTeX, RIS et citation APA. Les tribunes et études de cas sont publiées sur leurs pages dédiées.',
      en: 'All publications are listed on the Publications page, sorted by year, with BibTeX, RIS and APA citation export. Op-eds and case studies are published on their dedicated pages.',
    },
  },
  {
    question: {
      fr: 'Puis-je reprendre les articles et contenus de ce site ?',
      en: 'May I reuse articles and content from this site?',
    },
    answer: {
      fr: 'Oui, les tribunes, articles et contenus peuvent être repris avec attribution explicite et lien vers la source. Pour tout autre usage (traduction, adaptation, usage commercial), contactez-nous au préalable.',
      en: 'Yes, op-eds, articles and content may be reused with explicit attribution and a link to the source. For any other use (translation, adaptation, commercial use), please contact us beforehand.',
    },
  },
  {
    question: {
      fr: 'Quelles sont les différentes graphies et variantes du nom du Dr. Dagnon ?',
      en: 'What are the different spellings and variants of Dr. Dagnon’s name?',
    },
    answer: {
      fr: 'Le nom officiel complet est Dr. Seynudé Jean-Fortuné DAGNON. Dans les publications internationales, les moteurs de recherche et la presse, il est fréquemment référencé sous les formes sans accents : Seynude Dagnon, Fortune Dagnon, Seynude Jean-Fortune Dagnon, Jean-Fortuné Dagnon, ou abrégé en Dr. Fortuné Dagnon et S.J.F. Dagnon.',
      en: 'The full official name is Seynudé Jean-Fortuné DAGNON, MD, MPH. In international literature, media, and search engines, it is commonly spelled without diacritics: Seynude Dagnon, Fortune Dagnon, Seynude Jean-Fortune Dagnon, or abbreviated as Dr. Fortune Dagnon and S.J.F. Dagnon.',
    },
  },
];
