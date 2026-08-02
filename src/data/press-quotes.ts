import type { Lang } from '@/i18n/lang';

/* Short press excerpts shown on the homepage — each is a line taken from
   the coverage already referenced in src/data/media.ts (category: 'press'),
   kept in sync with those entries (same id, date and url). */

export interface PressQuote {
  id: string;
  quote: Record<Lang, string>;
  source: string;
  date: string;
  url: string;
}

export const PRESS_QUOTES: PressQuote[] = [
  {
    id: 'airid-welcome-2026',
    quote: {
      fr: 'L\'AIRID a accueilli le Dr Dagnon pour une visite axée sur le renforcement des partenariats de recherche et l\'innovation scientifique au service de la santé au Bénin.',
      en: 'AIRID hosted Dr. Dagnon for a visit centered on strengthening research partnerships and advancing scientific innovation for health outcomes in Benin.',
    },
    source: 'AIRID Africa',
    date: '2026-07-21',
    url: 'https://airid-africa.com/public/news/28-airid-welcomes-dr-seynude-jean-fortune-dagnon-from-the-gates-foundation',
  },
  {
    id: 'seneweb-data-2026',
    quote: {
      fr: 'Des données de santé fiables sont indispensables au suivi des maladies et à l\'allocation des ressources — le Sénégal s\'impose comme un leader régional.',
      en: 'Reliable health data is essential to disease tracking and resource allocation — with Senegal emerging as a regional leader.',
    },
    source: 'Seneweb',
    date: '2026-05-12',
    url: 'https://www.seneweb.com/en/news/24/systemes-sanitaires-africains-la-bataille-strategique-des-donnees-au-coeur-des-politiques-de-survie-1_n_492306.html',
  },
  {
    id: 'bluesquare-2026',
    quote: {
      fr: 'Un entrepôt national de données paludisme voit le jour au Burundi dans le cadre du projet Malariya Pi, financé par la Fondation Gates et la Belgique.',
      en: 'A national malaria data warehouse is taking shape in Burundi under the Gates- and Belgium-funded Malariya Pi project.',
    },
    source: 'Bluesquare',
    date: '2026-03-31',
    url: 'https://www.bluesquarehub.com/fr/bluesquare-news-structurer-lutilisation-des-donnees-dans-la-lutte-contre-le-paludisme-au-burundi/',
  },
  {
    id: 'stopblablacam-2022',
    quote: {
      fr: 'Le ministre Malachie Manaouda et le Dr Dagnon de la Fondation Gates ont évoqué le renforcement de la surveillance et des données dans la lutte contre le paludisme.',
      en: 'Health minister Malachie Manaouda and Dr. Dagnon of the Gates Foundation discussed strengthening surveillance and data systems in the fight against malaria.',
    },
    source: 'StopBlaBlaCam',
    date: '2022-03-07',
    url: 'https://www.stopblablacam.com/societe/0703-8389-lutte-contre-le-paludisme-le-gouvernement-et-la-fondation-bill-melinda-gates-s-accordent',
  },
  {
    id: 'minsante-2022',
    quote: {
      fr: 'L\'élimination du paludisme au centre des échanges entre le Minsanté et la Fondation Gates.',
      en: 'Malaria elimination at the center of exchanges between Minsante and the Gates Foundation.',
    },
    source: 'Minsanté',
    date: '2022-03-23',
    url: 'https://www.minsante.cm/site/?q=en/node/4224',
  },
];
