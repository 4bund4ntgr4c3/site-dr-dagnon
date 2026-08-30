import type { Lang } from '@/i18n/lang';
import type { TribuneBlock } from '@/data/tribunes';

/* Full reprint bodies of the hosted op-eds, keyed by tribune slug. Split
   from tribunes.ts so the main bundle (SEO meta) never ships article
   bodies. Imported only by the lazy TribuneArticle page. */

export const TRIBUNE_BODIES: Record<string, Record<Lang, TribuneBlock[]>> = {
  'de-la-lutte-a-lelimination-afrique-francophone': {
    fr: [
      { kind: 'byline', text: 'Par Seynudé Jean-Fortune Dagnon, Senior Program Officer — Paludisme / Afrique francophone, Fondation Gates.' },
      { kind: 'p', text: 'À l’occasion de la Journée mondiale du moustique, l’Afrique francophone est confrontée à une question décisive : pouvons-nous passer d’une gestion du paludisme comme fardeau sanitaire permanent, à une élimination délibérée, région par région ?' },
      { kind: 'p', text: 'Il est six heures du matin dans le poste de santé d’un village d’Afrique de l’Ouest. Une mère attend, son enfant de deux ans dans les bras, brûlant de fièvre. Elle n’a pas fermé l’œil de la nuit. Un seul moustique, entré par une fenêtre sans moustiquaire, a suffi. Cet anophèle femelle, minuscule, a transmis le paludisme à 282 millions de personnes et causé 610 000 décès en 2024, dont 95 % en Afrique. Trois quarts des décès concernaient des enfants de moins de cinq ans.' },
      { kind: 'p', text: 'Depuis 2000, la lutte a permis d’éviter 2,3 milliards de cas et 14 millions de décès, grâce aux moustiquaires de nouvelle génération, aux deux vaccins déployés dans une vingtaine de pays et aux nouveaux traitements. Quarante-sept pays sont aujourd’hui certifiés exempts de paludisme. Mais la prochaine révolution tiendra moins à un nouvel outil qu’à la façon de déployer ceux déjà disponibles : nous ne pouvons pas éliminer le paludisme partout en faisant la même chose partout.' },
      { kind: 'h2', text: 'Une région, des réalités très différentes' },
      { kind: 'p', text: 'L’Afrique francophone ne constitue pas une zone épidémiologique unique. Dans un même pays, un district peut connaître une transmission intense et permanente, un autre une transmission fortement saisonnière, tandis qu’un troisième peut avoir atteint des niveaux très faibles. Or les programmes ont historiquement été conçus autour de stratégies nationales et de paquets standardisés.' },
      { kind: 'h2', text: 'L’adaptation infranationale : le pont entre la lutte et l’élimination' },
      { kind: 'p', text: 'L’adaptation infranationale consiste à utiliser les données épidémiologiques, entomologiques, démographiques, sanitaires, climatiques et contextuelles locales pour déterminer la combinaison d’interventions la plus appropriée pour une zone donnée. Le manuel OMS 2025 la décrit comme stratifiée, modélisée et coût-efficace.' },
      { kind: 'h2', text: 'Une bataille qui se joue chez nous' },
      { kind: 'p', text: 'La Côte d’Ivoire, le Mali, le Burkina Faso comptent parmi les dix pays concentrant deux tiers des cas mondiaux. C’est le poste de santé de Kédougou, de Bobo-Dioulasso, de Kayes. C’est une classe qui perd un enfant à chaque saison des pluies. L’adaptation infranationale permet de concentrer les ressources rares là où elles sauvent le plus de vies.' },
      { kind: 'p', text: 'Or le financement mondial n’a atteint que 3,9 milliards de dollars en 2024, soit moins de la moitié des 9,3 milliards jugés nécessaires. Une réduction de 30 % entraînerait 146 millions de cas supplémentaires et 400 000 décès d’ici 2030 selon l’Union africaine. Ce sont ces financements qui permettent de recueillir les données fines sans lesquelles aucune stratégie différenciée n’est possible.' },
      { kind: 'quote', text: 'Cette mère ne devrait plus jamais avoir à passer une nuit blanche à cause d’un moustique. Nous avons les outils. Il nous faut la volonté politique, les moyens financiers, et le courage de ne plus faire la même chose partout — pour enfin finir le travail.' },
    ],
    en: [
      { kind: 'byline', text: 'By Seynudé Jean-Fortune Dagnon, Senior Program Officer — Malaria / Francophone Africa, Gates Foundation.' },
      { kind: 'p', text: 'On World Mosquito Day, Francophone Africa faces a decisive question: can we move from managing malaria as a permanent health burden to deliberate, region-by-region elimination?' },
      { kind: 'p', text: 'At six in the morning in a West African health post, a mother waits with her two-year-old, feverish, having not slept. One mosquito through an unscreened window was enough. That tiny female Anopheles transmitted malaria to 282 million people and caused 610,000 deaths in 2024, 95% in Africa.' },
      { kind: 'p', text: 'Since 2000, control has averted 2.3 billion cases and 14 million deaths via next-generation nets, two vaccines in ~20 countries and new treatments. Forty-seven countries are now certified malaria-free. But the next revolution will be about how we deploy existing tools: we cannot eliminate malaria everywhere by doing the same thing everywhere.' },
      { kind: 'h2', text: 'One region, many realities' },
      { kind: 'p', text: 'Francophone Africa is not one epidemiological zone. Within one country, one district may have intense perennial transmission, another highly seasonal, a third very low. Yet programs have historically been built around national, standardized packages.' },
      { kind: 'h2', text: 'Subnational tailoring: the bridge' },
      { kind: 'p', text: 'Subnational tailoring uses local epi, ento, demographic, health, climate and contextual data to choose the right mix for each geography. The WHO 2025 manual frames it as stratified, modeled and cost-effective.' },
      { kind: 'h2', text: 'A battle at home' },
      { kind: 'p', text: 'Côte d’Ivoire, Mali, Burkina Faso are among ten countries concentrating two-thirds of global cases. It’s the health post in Kédougou, Bobo-Dioulasso, Kayes. Subnational tailoring focuses scarce resources where they save the most lives.' },
      { kind: 'p', text: 'Global funding was $3.9B in 2024, less than half the $9.3B needed. A 30% cut would mean 146M extra cases and 400k deaths by 2030 (AU). That funding collects the granular data without which no differentiated strategy works.' },
      { kind: 'quote', text: 'That mother should never again lose a night to a mosquito. We have the tools. We need political will, financing, and the courage to stop doing the same thing everywhere — to finally finish the job.' },
    ],
  },
  'from-malaria-control-to-elimination': {
      en: [
        {
          kind: 'byline',
          text: 'By Professor Rose Leke, Malaria expert and Chair of the Gavi Independent Review Committee and Dr. Seynudé Jean Fortune Dagnon, Senior Program Officer, Malaria, Gates Foundation.',
        },
        {
          kind: 'p',
          text: 'In small towns across Africa, malaria does not arrive as a headline. It comes quietly, in cycles: a fever that keeps a child out of school, a parent too weak to work, a clinic that never quite empties. In some places, malaria has become a constant feature of life, persistent enough to shape everyday life, familiar enough to risk being normalised. For many in our communities, malaria is seen as simply part of life, a perception that must change if we are to eliminate the disease.',
        },
        {
          kind: 'p',
          text: 'Over the past two decades, countries across Africa have made real progress. Expanded use of bed nets, improved diagnostics, effective treatments, seasonal prevention, and more recently malaria vaccines have saved millions of lives. According to the World Health Organization (WHO), malaria interventions have prevented over two billion cases and millions of deaths globally since 2000, with Africa accounting for the majority of those lives saved.',
        },
        {
          kind: 'p',
          text: 'However, World Malaria Day presents us with an opportunity to ask a longer-horizon question: what kind of progress will be needed to truly end malaria as a public health threat? Three observations stand out as essential in helping us guide our reflection and action;',
        },
        { kind: 'quote', text: '(1) Strategies designed for control are not designed for permanence.' },
        { kind: 'quote', text: '(2) Elimination is fundamentally about equity, reaching those who are consistently left out.' },
        {
          kind: 'quote',
          text: '(3) Innovation must be understood broadly, as a portfolio of tools and approaches shaped and led by countries themselves to address malaria in a systemic way.',
        },
        {
          kind: 'p',
          text: 'To truly eliminate malaria in Africa, one additional move is needed: beyond technical progress, we must work with our communities to understand and communicate that we are moving past the era of control toward permanently interrupting transmission. It is possible to eliminate malaria. This shift in mindset must be shaped with our communities.',
        },
        { kind: 'h2', text: 'The limits of strategies designed for control' },
        {
          kind: 'p',
          text: 'Control has been highly effective at reducing deaths, particularly among children. But it relies on continuous repetition. Bed nets must be replaced, medicines restocked, prevention campaigns repeated year after year. Yet the most recent global data show that malaria cases and deaths remain heavily concentrated in the African region, which still accounts for around 94–95 percent of global malaria deaths, despite widespread coverage of core tools.',
        },
        {
          kind: 'p',
          text: 'These patterns suggest that while control saves lives, it does not always interrupt transmission permanently. Elimination changes the way the problem is framed, shifting attention from managing malaria season after season to breaking the chain of transmission itself, reducing long-term dependence on repeated interventions.',
        },
        { kind: 'h2', text: 'Malaria elimination is about equity' },
        {
          kind: 'p',
          text: 'Malaria increasingly persists in the same places: remote rural areas, border communities, informal settlements, and regions where health systems face chronic constraints. WHO and partner analyses show that a relatively small number of high-burden countries account for the majority of global malaria cases, even as national tool coverage improves.',
        },
        {
          kind: 'p',
          text: 'Elimination refocuses attention on these remaining gaps. Beyond national averages, success takes into account whether transmission continues anywhere, and why. In that sense, elimination is also about equity, prioritising children and communities who are consistently hardest to reach and sometimes last to benefit. This requires deeper involvement of our communities, not only as recipients of interventions but as active partners and leaders in elimination efforts.',
        },
        { kind: 'h2', text: 'Country-led innovation is a game changer' },
        {
          kind: 'p',
          text: 'Innovation in malaria spans a broad portfolio: the roll-out of new malaria vaccines now introduced in multiple African countries, next-generation insecticide-treated nets, improved diagnostics, enhanced surveillance systems, and approaches that seek to address malaria transmission at its source, alongside more precise delivery strategies.',
        },
        {
          kind: 'p',
          text: 'According to WHO, the combined impact of new tools and improved delivery approaches saved more than a million lives globally in recent years alone, even as emerging challenges such as insecticide and drug resistance threaten existing gains. The core issue here is addressing the challenge in countries across Africa is not the use of any single tool, but how countries assemble the right mix of interventions for their national contexts.',
        },
        {
          kind: 'p',
          text: 'Innovation is also about robust institutions. New approaches must be evaluated rigorously, regulated transparently, and shaped by national priorities. Community engagement is central to this process, and an integral part of how those decisions are made. Trust, governance, and leadership are as essential as technical effectiveness.',
        },
        {
          kind: 'p',
          text: 'Across Africa, scientists, regulators, and public health institutions are already strengthening this capacity, building evidence, reinforcing regulatory oversight, and developing frameworks to govern innovation responsibly at the country level.',
        },
        { kind: 'h2', text: 'Why this matters' },
        {
          kind: 'p',
          text: 'Taken together, these observations point in the same direction. Bed nets, treatment, preventive therapies, and vaccines remain indispensable. They are the reason millions of children are alive today. But relying on these tools alone keeps the global response oriented around containment. Complementing them with sustained investments aimed at elimination, stronger health systems, responsible innovation, regional coordination, and community leadership, opens the possibility of a different outcome. Centering community leadership and ownership alongside these investments strengthens the possibility of a different, lasting outcome.',
        },
        {
          kind: 'p',
          text: 'Elimination is demanding. It requires long-term commitment, cooperation across borders, and the patience to invest even when results are not immediate. But malaria has endured for centuries in part because it adapts to the spaces we leave unattended. Ending it will require sustained attention of a different kind, deliberate, collaborative, and forward-looking.',
        },
        {
          kind: 'p',
          text: 'World Malaria Day is a moment to reflect on whether we are ready to make that turn.',
        },
      ],
      fr: [
        {
          kind: 'byline',
          text: 'Par la Professeure Rose Leke, experte du paludisme et présidente du comité de revue indépendant de Gavi, et le Dr Seynudé Jean Fortune Dagnon, chargé de programme principal — paludisme, Fondation Gates.',
        },
        {
          kind: 'p',
          text: 'Dans les petites villes d\'Afrique, le paludisme n\'arrive pas en gros titres. Il s\'installe en silence, par cycles : une fièvre qui retient un enfant à la maison, un parent trop affaibli pour travailler, un centre de santé qui ne désemplit jamais. Par endroits, le paludisme est devenu un trait constant de la vie, assez persistant pour en modeler le quotidien, assez familier pour risquer d\'être banalisé. Pour beaucoup dans nos communautés, le paludisme est perçu comme une simple fatalité de la vie, une perception qui doit changer si nous voulons éliminer la maladie.',
        },
        {
          kind: 'p',
          text: 'Au cours des deux dernières décennies, les pays africains ont accompli de réels progrès. L\'usage élargi des moustiquaires, l\'amélioration du diagnostic, des traitements efficaces, la prévention saisonnière et, plus récemment, les vaccins antipaludiques ont sauvé des millions de vies. Selon l\'Organisation mondiale de la Santé (OMS), les interventions antipaludiques ont permis d\'éviter plus de deux milliards de cas et des millions de décès dans le monde depuis 2000, l\'Afrique représentant la majorité de ces vies sauvées.',
        },
        {
          kind: 'p',
          text: 'La Journée mondiale de lutte contre le paludisme est pourtant l\'occasion de poser une question à plus long terme : quels progrès faudra-t-il accomplir pour réellement mettre fin au paludisme en tant que menace de santé publique ? Trois constats s\'imposent pour guider notre réflexion et notre action :',
        },
        {
          kind: 'quote',
          text: '(1) Les stratégies conçues pour le contrôle ne sont pas conçues pour la permanence.',
        },
        {
          kind: 'quote',
          text: '(2) L\'élimination relève fondamentalement de l\'équité : il s\'agit d\'atteindre ceux qui sont systématiquement laissés de côté.',
        },
        {
          kind: 'quote',
          text: '(3) L\'innovation doit être comprise au sens large, comme un portefeuille d\'outils et d\'approches façonnés et dirigés par les pays eux-mêmes pour traiter le paludisme de manière systémique.',
        },
        {
          kind: 'p',
          text: 'Pour véritablement éliminer le paludisme en Afrique, une démarche supplémentaire s\'impose : au-delà des progrès techniques, nous devons travailler avec nos communautés pour faire comprendre et pour communiquer que nous sortons de l\'ère du contrôle pour aller vers l\'interruption durable de la transmission. Éliminer le paludisme est possible. Ce changement de mentalité doit être construit avec nos communautés.',
        },
        { kind: 'h2', text: 'Les limites des stratégies conçues pour le contrôle' },
        {
          kind: 'p',
          text: 'Le contrôle a été très efficace pour réduire les décès, notamment chez les enfants. Mais il repose sur une répétition continue : renouveler les moustiquaires, réapprovisionner les médicaments, reconduire les campagnes de prévention année après année. Or les données mondiales les plus récentes montrent que les cas et les décès dus au paludisme restent massivement concentrés dans la région africaine, qui représente encore environ 94 à 95 % des décès mondiaux, malgré une couverture étendue des outils essentiels.',
        },
        {
          kind: 'p',
          text: 'Ces schémas suggèrent que si le contrôle sauve des vies, il n\'interrompt pas toujours durablement la transmission. L\'élimination change la manière dont le problème est posé : l\'attention passe de la gestion du paludisme saison après saison à la rupture de la chaîne de transmission elle-même, réduisant la dépendance de long terme aux interventions répétées.',
        },
        { kind: 'h2', text: 'L\'élimination du paludisme est une question d\'équité' },
        {
          kind: 'p',
          text: 'Le paludisme persiste de plus en plus aux mêmes endroits : zones rurales isolées, communautés frontalières, quartiers informels et régions où les systèmes de santé connaissent des contraintes chroniques. Les analyses de l\'OMS et de ses partenaires montrent qu\'un nombre relativement restreint de pays à forte charge de morbidité concentre la majorité des cas mondiaux, même lorsque la couverture nationale en outils s\'améliore.',
        },
        {
          kind: 'p',
          text: 'L\'élimination recentre l\'attention sur ces lacunes résiduelles. Au-delà des moyennes nationales, la réussite prend en compte la question de savoir si la transmission se poursuit quelque part, et pourquoi. En ce sens, l\'élimination est aussi une question d\'équité : elle donne la priorité aux enfants et aux communautés les plus difficiles à atteindre, souvent les derniers à bénéficier des progrès. Cela exige une implication plus profonde de nos communautés, non seulement comme bénéficiaires des interventions, mais comme partenaires actifs et leaders des efforts d\'élimination.',
        },
        { kind: 'h2', text: 'L\'innovation menée par les pays change la donne' },
        {
          kind: 'p',
          text: 'L\'innovation contre le paludisme couvre un large portefeuille : le déploiement des nouveaux vaccins antipaludiques, désormais introduits dans plusieurs pays africains, les moustiquaires imprégnées de nouvelle génération, l\'amélioration du diagnostic, des systèmes de surveillance renforcés et des approches qui cherchent à traiter la transmission du paludisme à sa source, aux côtés de stratégies de délivrance plus ciblées.',
        },
        {
          kind: 'p',
          text: 'Selon l\'OMS, l\'effet combiné des nouveaux outils et des meilleures approches de délivrance a permis de sauver plus d\'un million de vies dans le monde ces dernières années, alors même que des défis émergents comme la résistance aux insecticides et aux médicaments menacent les acquis. La question centrale dans les pays africains n\'est pas l\'usage d\'un outil unique, mais la manière dont chaque pays assemble la bonne combinaison d\'interventions adaptée à son contexte national.',
        },
        {
          kind: 'p',
          text: 'L\'innovation, c\'est aussi des institutions solides. Les nouvelles approches doivent être évaluées rigoureusement, réglementées de manière transparente et façonnées par les priorités nationales. L\'engagement communautaire est au cœur de ce processus et participe pleinement à ces décisions. La confiance, la gouvernance et le leadership sont aussi essentiels que l\'efficacité technique.',
        },
        {
          kind: 'p',
          text: 'Partout en Afrique, scientifiques, régulateurs et institutions de santé publique renforcent déjà cette capacité : ils produisent des données probantes, consolident la surveillance réglementaire et développent des cadres pour encadrer une innovation responsable au niveau national.',
        },
        { kind: 'h2', text: 'Pourquoi cela compte' },
        {
          kind: 'p',
          text: 'Pris ensemble, ces constats vont dans le même sens. Moustiquaires, traitements, thérapies préventives et vaccins restent indispensables : ils sont la raison pour laquelle des millions d\'enfants sont en vie aujourd\'hui. Mais s\'appuyer uniquement sur ces outils maintient la réponse mondiale dans une logique de confinement. En les complétant par des investissements soutenus en faveur de l\'élimination, de systèmes de santé plus solides, d\'une innovation responsable, d\'une coordination régionale et d\'un leadership communautaire, une autre issue devient possible. Placer le leadership et l\'appropriation communautaires au centre de ces investissements renforce la possibilité d\'un résultat différent et durable.',
        },
        {
          kind: 'p',
          text: 'L\'élimination est exigeante. Elle requiert un engagement de long terme, une coopération transfrontalière et la patience d\'investir même quand les résultats ne sont pas immédiats. Mais le paludisme perdure depuis des siècles, en partie parce qu\'il s\'adapte aux espaces que nous laissons sans surveillance. Y mettre fin exigera une attention soutenue d\'une autre nature : délibérée, collaborative et tournée vers l\'avenir.',
        },
        {
          kind: 'p',
          text: 'La Journée mondiale de lutte contre le paludisme est un moment pour réfléchir à notre disposition à faire ce virage.',
        },
      ],
  },
};
