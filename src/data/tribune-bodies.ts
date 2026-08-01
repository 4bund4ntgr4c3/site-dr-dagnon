import type { Lang } from '@/i18n/lang';
import type { TribuneBlock } from '@/data/tribunes';

/* Full reprint bodies of the hosted op-eds, keyed by tribune slug. Split
   from tribunes.ts so the main bundle (SEO meta) never ships article
   bodies. Imported only by the lazy TribuneArticle page. */

export const TRIBUNE_BODIES: Record<string, Record<Lang, TribuneBlock[]>> = {
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
