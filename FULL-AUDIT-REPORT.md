# Audit transversal du projet Dr Seynudé Dagnon

Date : **4 septembre 2026**. Périmètre : site complet (« full-site »), code local dans son état modifié, API, génération statique, tests, navigation et échantillon public de production. Ce rapport couvre les domaines examinables depuis ce dépôt ; il ne certifie pas l’absence de défauts et distingue les limites d’accès. Aucun correctif applicatif ni déploiement n’a été effectué.

## A. Synthèse de l’audit

### Verdict

**Socle technique sérieux, mais plusieurs parcours clés et garanties de confiance doivent être corrigés avant validation finale.** Le volume de fonctionnalités et les tests sont de vrais atouts ; ils ne compensent pas les écarts observés entre contrats UI/API, consentement, données scientifiques et fonctionnement réel.

**37 constats : 10 P1, 21 P2 et 6 P3.** P1 signifie à traiter avant une nouvelle validation de production ; P2 signifie correction au prochain cycle ; P3 signifie fiabilisation et maintenance. Aucun constat n’est classé P0 : aucune compromission active ou perte massive de données n’a été démontrée. Ces priorités ne sont pas des scores CVSS.

Les trois groupes les plus importants :

1. **Parcours cassés** : téléphone (10 caractères générés, 6 saisissables), préférences newsletter (JSON rejeté et paramètres perdus), demande de créneau circulaire.
2. **Consentement et fiabilité** : désinscription annoncée malgré une panne, lien de confirmation rejouable, traceurs non pilotés de façon cohérente et recherche libre conservée sans rétention.
3. **Confiance scientifique** : courbe illustrative attribuée à l’OMS, faux rafraîchissement « Live », modèles non traçables présentés avec des références institutionnelles.

Trois leviers immédiats : corriger les contrats partagés UI/API ; faire des tests E2E des garde-fous de livraison ; faire valider les données/modèles et rendre explicites leurs limites.

### Résultats mesurés

| Contrôle | Résultat |
|---|---|
| TypeScript | `tsc -b` : succès |
| Bundle production | Vite 7.3.6 : succès ; avertissement Tailwind sur une classe easing ambiguë |
| Prérendu | 130 pages, 65 par langue, 404, sitemap, flux, calendrier et SW générés |
| Tests existants | **389/389 passent**, 0 échec, 0 ignoré ; environ 240 s |
| Lint | **Échec : 1 erreur** dans ConsentBanner |
| Audit npm | **0 vulnérabilité connue signalée** au moment du contrôle ; ce n’est pas une garantie de sécurité du code |
| Tests complémentaires API | Préférences objet JSON 400 ; faux succès désinscription/push en panne ; confirmation sans pending acceptée ; query numérique lève une exception ; DNS mixte accepté |
| Mobile Chromium | 7 routes FR à 390×844 : pas de débordement horizontal global ; un H1 par page ; défauts de contrastes, noms de contrôles et en-tête |
| Robustesse | Stockage bloqué : écran vide ; lien préférences redirigé en FR : paramètres supprimés |
| Sans JavaScript | H1 de l’accueil présent dans HTML mais opacity=0 |
| Précache | 217 URL ; 11,52 Mo bruts ; environ 3,35 Mo avec gzip estimé pour les textes, hors entêtes |
| HTTP public | Accueil EN/FR et impact 200 ; URL inexistante vraie 404 ; préférences sans token 404 malgré rewrite locale |
| PageSpeed / CrUX | API PageSpeed limitée par quota ; aucune métrique terrain obtenue |

### Performances locales — ne pas confondre avec la production mobile

Mesures de la suite existante, Chromium desktop 1280×800, serveur local et certains services tiers bloqués. Ce n’est pas du CrUX, ni un percentile de vrais visiteurs. Le service worker n’est pas validé comme un scénario d’installation réelle de production par ces chiffres.

| Route | LCP local | CLS local |
|---|---:|---:|
| / | 2 268 ms | 0,006 |
| /publications | 1 476 ms | 0,003 |
| /tribunes/from-malaria-control-to-elimination | 1 408 ms | 0,003 |
| /impact | 1 708 ms | 0,003 |
| /fr | 1 880 ms | 0 |

Ces cinq résultats sont encourageants. Aucun INP n’est mesuré. La suite autorise un LCP allant jusqu’à 5 500 ms : il s’agit d’un seuil anti-régression interne, pas d’une validation des Core Web Vitals.

Le bundle principal fait environ 217,69 ko bruts / 60,50 ko gzip, React DOM 184,04 / 57,63 ko, Motion 134,43 / 44,51 ko et le CSS 86,76 / 14,45 ko. Ces valeurs concernent les fichiers, pas la somme réellement transférée pour une route. Les photos locales sont largement en WebP ; le MP3 principal pèse 22,68 Mo et n’est pas précaché.

### Couverture par domaine

| Domaine | Bilan |
|---|---|
| Architecture / code | TypeScript strict, modules de données, routes et composants organisés ; duplications SSR/client et helpers à maîtriser |
| Sécurité | HMAC, comparaisons sûres sur tokens, échappement HTML, allowlist push, protections d’origine et en-têtes présents ; anti-abus/rejeu/pannes à corriger |
| Fonctionnel / conversion | Contact structuré, recherche, exports et CTA présents ; téléphone, préférences, créneaux et podcast ont des défauts concrets |
| Données / backend | KV partagé prévu ; certaines erreurs ignorées et règles de diffusion incompatibles avec les préférences |
| Confidentialité / conformité | Notice et bandeau présents ; cohérence technique et information des traitements insuffisantes, revue juridique nécessaire |
| Accessibilité / UX | Liens d’évitement, labels nombreux, focus traps et tests axe présents ; défauts réels après chargement, pas de certification WCAG |
| Design responsive | Direction visuelle cohérente, typographie et hiérarchie lisibles sur desktop ; densité du header mobile à réduire |
| Performance / sobriété | Mesures locales bonnes sur 5 routes, découpage des pages et polices locales ; précache global et stratégie de cache pénalisants |
| SEO / international | HTML pré-rendu, canonicals, hreflang, OG/Twitter et vraie 404 ; données structurées, fraîcheur et langue à fiabiliser |
| Contenu / réputation | Biographie, DOI, cas d’étude et sources externes utiles ; erreurs factuelles et apparence de validation scientifique à traiter |
| CI/CD / exploitation | Workflow CI et tests présents ; lint rouge, runtime trop permissif et effets métier dans le build |
| Mesure / gouvernance | Analytics et alertes prévus ; couverture conversion, logs de production, rétention, sauvegardes et restauration non attestés |

**Note globale chiffrée : non attribuée.** Une note SEO/produit unique masquerait les inconnues de trafic, CWV terrain, sécurité opérationnelle et validation scientifique. Le constat qualitatif est suffisamment étayé pour prioriser les corrections, pas pour certifier une « santé à X/100 ».

### Points forts à préserver

- Métadonnées et génération du site largement centralisées ; contenu HTML réel sur les pages principales, canonicals et hreflang présents.
- Routes explicites et vraie page 404 en production ; pas de catch-all généralisé répondant 200 à toute URL.
- Découpage des pages, polices auto-hébergées, images WebP et chargement de certains médias à la demande.
- Secrets prévus côté serveur, numéro absent du bundle selon le test existant, échappement des valeurs utilisateur dans les emails, jetons signés et distincts par usage.
- API admin protégée par secret et réponse `private, no-store` ; règles HSTS, CSP, nosniff, anti-framing et permissions observées publiquement. Leur présence seule ne garantit pas leur efficacité complète.
- 389 tests couvrant de nombreux contrats, compilation API incluse ; CI utilisant `npm ci` et Chromium.
- Bibliographie structurée, DOI, citations et cas d’étude bilingues. Ces bases sont plus utiles à la confiance que l’ajout de nouveaux widgets.

## B. Constats détaillés

Chaque constat ci-dessous a une preuve dans le code, un résultat de test ou une observation HTTP. **Confirmed** porte sur cette preuve ; un impact formulé comme risque n’est pas transformé en incident avéré. Sévérité SEO standard : Warning pour les écarts ; aucun blocage global d’indexation n’est établi. Effort relatif : S = localisé, M = plusieurs composants, L = chantier transversal ou validation métier. Les efforts ne constituent pas un devis.

### Index des constats

| ID | Priorité | Domaine | Constat | Point d’entrée |
|---|---|---|---|---|
| F01 | P1 | Parcours contact | Le code de déverrouillage du téléphone ne peut pas être saisi intégralement. | [src/pages/Contact.tsx](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/src/pages/Contact.tsx:296>) |
| F02 | P1 | Préférences newsletter | Le POST des préférences rejette le corps JSON fourni par Vercel. | [api/newsletter.ts](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/api/newsletter.ts:481>) |
| F03 | P1 | Internationalisation | Le changement de langue détruit les paramètres d’URL. | [src/i18n/LanguageContext.tsx](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/src/i18n/LanguageContext.tsx:60>) |
| F04 | P1 | Désinscription | Une panne de stockage est annoncée comme une désinscription réussie. | [api/newsletter.ts](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/api/newsletter.ts:374>) |
| F05 | P1 | Cycle de consentement | Un ancien lien de confirmation peut réinscrire après désabonnement. | [api/newsletter.ts](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/api/newsletter.ts:143>) |
| F06 | P1 | Confidentialité et consentement | Le bandeau ne pilote pas réellement tous les traitements annoncés et n’offre pas de retrait intégré. | [src/components/ConsentBanner.tsx](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/src/components/ConsentBanner.tsx:20>) |
| F07 | P1 | Fiabilité éditoriale | Une courbe illustrative est créditée à l’OMS et présentée comme actualisée en direct. | [src/components/MalariaBarometer.tsx](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/src/components/MalariaBarometer.tsx:10>) |
| F08 | P1 | Modèles scientifiques | Les calculateurs et mémorandums se présentent comme outils institutionnels sans validation traçable. | [src/components/HealthEconomicsSimulator.tsx](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/src/components/HealthEconomicsSimulator.tsx:18>) |
| F09 | P1 | Robustesse navigateur | Un stockage navigateur indisponible peut vider toute l’application. | [src/components/ConsentBanner.tsx](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/src/components/ConsentBanner.tsx:17>) |
| F10 | P1 | Qualité et CI | Le lint échoue sur l’état audité. | [src/components/ConsentBanner.tsx](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/src/components/ConsentBanner.tsx:18>) |
| F11 | P2 | Accessibilité | Le simulateur d’impact comporte trois boutons et un curseur sans nom accessible. | [src/components/HealthEconomicsSimulator.tsx](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/src/components/HealthEconomicsSimulator.tsx:112>) |
| F12 | P2 | Conversion | Le choix d’un créneau ne mène pas à une demande préremplie. | [src/components/BookingWidget.tsx](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/src/components/BookingWidget.tsx:61>) |
| F13 | P2 | Données personnelles | Les recherches libres sont stockées sans durée de rétention et sans filtre de consentement. | [src/components/SearchModal.tsx](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/src/components/SearchModal.tsx:302>) |
| F14 | P2 | Sécurité des API | L’API de recherche utilise une IP non fiable et ne valide pas le type de query. | [api/search-log.ts](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/api/search-log.ts:51>) |
| F15 | P2 | Notifications push | L’inscription push affiche un succès même lorsque la persistance échoue. | [api/push.ts](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/api/push.ts:120>) |
| F16 | P2 | Règles de diffusion | Les choix hebdomadaire/mensuel et de rubrique ne sont pas respectés de bout en bout. | [scripts/send-newsletter.mjs](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/scripts/send-newsletter.mjs:318>) |
| F17 | P2 | Déploiement et fiabilité des emails | Le build envoie des messages, sans protection contre les doublons de traitement. | [package.json](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/package.json:11>) |
| F18 | P2 | Résilience et montée en charge | Les appels externes n’ont pas de timeout applicatif et les envois sont largement séquentiels. | [api/_rate-limit.ts](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/api/_rate-limit.ts:58>) |
| F19 | P2 | Performance et sobriété | Le service worker télécharge l’ensemble des pages et chunks au premier install. | [scripts/prerender.mjs](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/scripts/prerender.mjs:304>) |
| F20 | P2 | Cache et mises à jour | Les ressources non fingerprintées peuvent rester périmées et l’activation est agressive. | [scripts/prerender.mjs](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/scripts/prerender.mjs:347>) |
| F21 | P2 | Podcast et flux | Le flux podcast référence des pages HTML, pas des fichiers audio. | [src/seo/meta.ts](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/src/seo/meta.ts:1289>) |
| F22 | P2 | SEO et intégrité bibliographique | Le schéma et llms.txt surévaluent le corpus scientifique. | [src/seo/meta.ts](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/src/seo/meta.ts:941>) |
| F23 | P2 | Internationalisation éditoriale | Plusieurs modules anglais affichent des chaînes françaises. | [src/data/genomics.ts](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/src/data/genomics.ts:10>) |
| F24 | P2 | Accessibilité visuelle | Des textes du module podcast ont un contraste insuffisant. | [src/components/PodcastSection.tsx](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/src/components/PodcastSection.tsx:309>) |
| F25 | P2 | Design responsive | Le nom du logo chevauche les commandes du menu mobile. | [src/components/Navbar.tsx](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/src/components/Navbar.tsx:219>) |
| F26 | P2 | Couverture de tests | Les tests verts donnent une assurance insuffisante sur les parcours et le rendu final. | [tests/a11y.test.mjs](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/tests/a11y.test.mjs:114>) |
| F27 | P2 | État déployé | Une route publique attendue diverge de la configuration locale. | [vercel.json](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/vercel.json:664>) |
| F28 | P3 | Robots et politique IA | Les règles IA servies par le CDN et celles du dépôt sont contradictoires. | [public/robots.txt](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/public/robots.txt:5>) |
| F29 | P3 | SEO technique | La fraîcheur du sitemap et la sélection des pages techniques sont perfectibles. | [src/seo/meta.ts](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/src/seo/meta.ts:1764>) |
| F30 | P3 | Métadonnées de navigation | Les balises citation_* restent celles de la page chargée initialement. | [src/components/Seo.tsx](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/src/components/Seo.tsx>) |
| F31 | P2 | Rendu sans JavaScript | Le titre principal prérendu est invisible lorsque JavaScript ne s’exécute pas. | [src/sections/Hero.tsx](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/src/sections/Hero.tsx:13>) |
| F32 | P3 | Architecture et maintenabilité | Les variantes serveur/client et les helpers dupliqués augmentent le risque de divergence. | [src/entry-server.tsx](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/src/entry-server.tsx:4>) |
| F33 | P2 | Compatibilité d’environnement | La version Node annoncée est trop permissive. | [package.json](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/package.json:6>) |
| F34 | P2 | Défense SSRF | Le contrôle DNS accepte une réponse mixte publique/privée contrairement à son contrat. | [api/_push-guard.ts](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/api/_push-guard.ts:111>) |
| F35 | P3 | Documentation et exploitation | Plusieurs passages du README ne décrivent plus le comportement courant. | [README.md](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/README.md:1>) |
| F36 | P2 | Exactitude institutionnelle | Le développement du sigle AIRID est erroné. | [src/data/agenda.ts](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/src/data/agenda.ts:44>) |
| F37 | P3 | Contrat du formulaire | Le message est tronqué/normalisé côté serveur sans limites équivalentes dans l’UI. | [api/contact.ts](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/api/contact.ts:54>) |

### Analyse, impact et critères de correction

### F01 — Le code de déverrouillage du téléphone ne peut pas être saisi intégralement.

**P1 · Parcours contact · Confiance : Confirmed · Effort : S**

Preuve : api/contact.ts:179 génère 10 caractères ; src/pages/Contact.tsx:294 et :296 annoncent et limitent la saisie à 6. Point d’entrée : [src/pages/Contact.tsx](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/src/pages/Contact.tsx:296>).

Impact : Le parcours normal de révélation du téléphone échoue, même avec le bon email et le bon code.

Correction proposée : Partager le contrat de longueur, accepter 10 caractères côté UI et harmoniser les libellés FR/EN.

Critère de validation : Un test navigateur colle le code produit par une API simulée et affiche le téléphone sans manipulation du DOM.

### F02 — Le POST des préférences rejette le corps JSON fourni par Vercel.

**P1 · Préférences newsletter · Confiance : Confirmed · Effort : S**

Preuve : api/newsletter.ts:481 parse uniquement une chaîne ; src/pages/NewsletterPrefs.tsx:81 envoie application/json. Simulation : objet → 400 Invalid request ; chaîne équivalente → 200. Point d’entrée : [api/newsletter.ts](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/api/newsletter.ts:481>).

Impact : Les utilisateurs ne peuvent pas enregistrer leurs choix sur le runtime prévu.

Correction proposée : Accepter un objet déjà parsé, puis valider explicitement sa structure ; conserver le support chaîne si nécessaire.

Critère de validation : Tests objet, chaîne, null, tableaux et JSON invalide ; test HTTP sur environnement de validation Vercel.

Références : [Source officielle 1](https://vercel.com/kb/guide/handling-node-request-body).

### F03 — Le changement de langue détruit les paramètres d’URL.

**P1 · Internationalisation · Confiance : Confirmed · Effort : S**

Preuve : src/i18n/LanguageContext.tsx:60 et :69 concatènent chemin et hash sans search. Chromium fr-FR : /newsletter/preferences?email=…&token=… devient /fr/newsletter/preferences. Point d’entrée : [src/i18n/LanguageContext.tsx](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/src/i18n/LanguageContext.tsx:60>).

Impact : Jetons newsletter, préremplissages contact et autres paramètres perdus.

Correction proposée : Préserver search et hash lors des deux navigations ; privilégier une suggestion de langue ou des liens explicites.

Critère de validation : Tests première visite FR, switch FR/EN, paramètres encodés, hash et absence de boucle.

### F04 — Une panne de stockage est annoncée comme une désinscription réussie.

**P1 · Désinscription · Confiance : Confirmed · Effort : S**

Preuve : api/newsletter.ts:374 ignore le booléen de removeSubscriber. Simulation KV indisponible : HTTP 200 et Unsubscribed. Point d’entrée : [api/newsletter.ts](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/api/newsletter.ts:374>).

Impact : L’utilisateur croit avoir retiré son consentement mais peut continuer à recevoir les messages.

Correction proposée : N’annoncer le succès qu’après suppression vérifiée ; retourner une erreur temporaire exploitable et alerter hors du fournisseur défaillant.

Critère de validation : KV absent, HTTP 500 et erreurs Redis par commande ne doivent jamais produire Unsubscribed.

### F05 — Un ancien lien de confirmation peut réinscrire après désabonnement.

**P1 · Cycle de consentement · Confiance : Confirmed · Effort : M**

Preuve : api/newsletter.ts:143–147 effectue GET pending puis SADD sans condition. Le token reste valide 7 jours. Simulation pending absent : SADD exécuté et Subscription confirmed. Point d’entrée : [api/newsletter.ts](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/api/newsletter.ts:143>).

Impact : Une ouverture répétée ou automatisée du lien peut annuler le désabonnement.

Correction proposée : Consommer atomiquement un état pending/noncé non réutilisable ; révoquer les confirmations lors du désabonnement.

Critère de validation : Séquence souscrire → confirmer → désabonner → rejouer la confirmation : aucune réinscription.

### F06 — Le bandeau ne pilote pas réellement tous les traitements annoncés et n’offre pas de retrait intégré.

**P1 · Confidentialité et consentement · Confiance : Confirmed · Effort : M**

Preuve : src/components/ConsentBanner.tsx:20–37 accorde aussi ad_storage, ad_user_data et ad_personalization ; :42 stocke le refus sans gestion globale. src/main.tsx:87–88 monte Analytics/SpeedInsights sans condition. index.html:14–15 charge GA systématiquement ; aucun bouton de réouverture trouvé. Point d’entrée : [src/components/ConsentBanner.tsx](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/src/components/ConsentBanner.tsx:20>).

Impact : Écart entre l’information « mesure d’audience » et le choix technique ; refus/retrait non cohérents. La conformité juridique dépend des traitements, contrats et territoires réellement concernés.

Correction proposée : Créer un état de consentement unique, limiter les finalités accordées, ajouter « Gérer mes choix » permanent et documenter le comportement de chaque traceur ; faire valider les bases légales.

Critère de validation : Tests réseau avant choix/après refus/après acceptation/après retrait ; aucune finalité publicitaire accordée par le bouton d’audience.

Références : [Source officielle 1](https://cnil.fr/fr/les-bases-legales/consentement) · [Source officielle 2](https://developers.google.com/tag-platform/security/concepts/consent-mode).

### F07 — Une courbe illustrative est créditée à l’OMS et présentée comme actualisée en direct.

**P1 · Fiabilité éditoriale · Confiance : Confirmed · Effort : M**

Preuve : src/components/MalariaBarometer.tsx:10 marque beninInc illustrative, :84 attribue la baisse aux programmes et :90 affiche WMR 2023. LiveIndicator.tsx:11–15 ne met à jour que l’heure malgré Live / actualisation auto 60s. Point d’entrée : [src/components/MalariaBarometer.tsx](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/src/components/MalariaBarometer.tsx:10>).

Impact : Risque de tromper les lecteurs et de dégrader la crédibilité professionnelle ; aucune causalité n’est démontrée par ce jeu de données.

Correction proposée : Utiliser une série primaire vérifiable avec tableau, année, unité et date de mise à jour ; sinon afficher clairement données fictives, sans attribution causale ni faux direct.

Critère de validation : Chaque point doit être retraçable à une source ; le statut de fraîcheur représente une vraie actualisation de données.

Références : [Source officielle 1](https://www.who.int/news-room/fact-sheets/detail/malaria).

### F08 — Les calculateurs et mémorandums se présentent comme outils institutionnels sans validation traçable.

**P1 · Modèles scientifiques · Confiance : Confirmed · Effort : L**

Preuve : HealthEconomicsSimulator.tsx:18–45 additionne des efficacités fixes, plafonne à 82 % et valorise une vie à 45 000 USD ; :318 cite Groningen/OMS sans étude précise. PolicyBriefGenerator.tsx:379 promet un mémorandum « officiel ». Genomics/stratification contiennent recommandations et prévalences sans provenance structurée. stratification.ts:155 inclut Culex comme primaryVector du paludisme (champ non rendu actuellement). Point d’entrée : [src/components/HealthEconomicsSimulator.tsx](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/src/components/HealthEconomicsSimulator.tsx:18>).

Impact : Des estimations démonstratives peuvent être prises pour des recommandations médicales ou budgétaires validées. Les paramètres ne sont pas tous démontrés faux ; c’est leur validation/provenance qui manque.

Correction proposée : Revue par le propriétaire scientifique ; sources primaires versionnées, hypothèses, domaine de validité, analyses de sensibilité et limites explicites ; retirer les labels officiels non justifiés, corriger le champ vecteur.

Critère de validation : Validation signée du contenu et du modèle ; tout résultat/export porte sources et avertissement adéquat ; tests des formules et valeurs limites.

Références : [Source officielle 1](https://www.who.int/publications/b/81075) · [Source officielle 2](https://www.who.int/health-topics/malaria).

### F09 — Un stockage navigateur indisponible peut vider toute l’application.

**P1 · Robustesse navigateur · Confiance : Confirmed · Effort : S**

Preuve : ConsentBanner.tsx:17 accède à localStorage sans try/catch ; le composant est hors PageErrorBoundary dans App.tsx. Simulation SecurityError : #root ne contient plus aucun enfant. Point d’entrée : [src/components/ConsentBanner.tsx](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/src/components/ConsentBanner.tsx:17>).

Impact : Page blanche dans des contextes de stockage restreint, malgré les protections présentes ailleurs.

Correction proposée : Encapsuler tous les accès au stockage du consentement et prévoir un état mémoire ; ajouter une limite d’erreur couvrant le shell.

Critère de validation : Avec Storage.getItem/setItem qui lèvent SecurityError, navigation et refus du consentement restent utilisables.

### F10 — Le lint échoue sur l’état audité.

**P1 · Qualité et CI · Confiance : Confirmed · Effort : S**

Preuve : npm run lint : react-hooks/set-state-in-effect dans ConsentBanner.tsx:18 ; .github/workflows/ci.yml exécute le lint avant npm test. Point d’entrée : [src/components/ConsentBanner.tsx](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/src/components/ConsentBanner.tsx:18>).

Impact : La chaîne de validation déclarée n’est pas verte ; le build seul ne démontre pas que les contrôles CI passent.

Correction proposée : Revoir l’initialisation du bandeau sans cascade d’effet et sans compromettre SSR/stockage ; ne pas désactiver la règle par défaut.

Critère de validation : npm run lint termine avec code 0 et le test de stockage bloqué reste vert.

### F11 — Le simulateur d’impact comporte trois boutons et un curseur sans nom accessible.

**P2 · Accessibilité · Confiance : Confirmed · Effort : S**

Preuve : Chromium mobile après montage : axe button-name et label (impact critical) sur /fr/impact. HealthEconomicsSimulator.tsx:112, :143, :200, :225. Point d’entrée : [src/components/HealthEconomicsSimulator.tsx](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/src/components/HealthEconomicsSimulator.tsx:112>).

Impact : Les aides techniques ne peuvent pas identifier ces réglages ; l’état des interrupteurs n’est pas exposé.

Correction proposée : Relier un label au range ; utiliser checkbox ou role=switch avec aria-checked et un nom lié au texte visible.

Critère de validation : Axe après chargement et après défilement : zéro violation ; test clavier et lecteur d’écran des quatre contrôles.

### F12 — Le choix d’un créneau ne mène pas à une demande préremplie.

**P2 · Conversion · Confiance : Confirmed · Effort : S**

Preuve : BookingWidget.tsx:61 pointe vers /inviter?slot=DATE, page qui contient le widget lui-même. Test : /fr/inviter?slot=2026-09-10 et zéro formulaire dans main. Invite.tsx ne lit pas slot ; seules trois dates de septembre 2026 sont codées en dur. Point d’entrée : [src/components/BookingWidget.tsx](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/src/components/BookingWidget.tsx:61>).

Impact : Parcours circulaire et promesse de préremplissage non tenue ; créneaux périssables.

Correction proposée : Diriger vers /contact avec type, date, heure et fuseau préremplis ; filtrer les dates passées ou supprimer la disponibilité indicative.

Critère de validation : Depuis chaque créneau, une demande complète éditable arrive dans le formulaire ; test avec date courante après septembre.

### F13 — Les recherches libres sont stockées sans durée de rétention et sans filtre de consentement.

**P2 · Données personnelles · Confiance : Confirmed · Effort : M**

Preuve : SearchModal.tsx:302–310 transmet le texte après 800 ms ; api/search-log.ts:67 garde chaque terme dans un hash sans TTL ni limite de cardinalité ; admin.ts lit HGETALL. Legal.ts/data/legal.ts ne décrivent pas ce traitement ; le téléphone obligatoire est aussi omis de la liste contact. Point d’entrée : [src/components/SearchModal.tsx](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/src/components/SearchModal.tsx:302>).

Impact : Un visiteur peut saisir une information personnelle ou de santé ; la conservation est potentiellement sensible et le coût du hash croît sans borne. Aucune fuite réelle ni présence effective de données sensibles n’a été démontrée.

Correction proposée : Minimiser/filtrer les requêtes, décider du besoin de stockage, définir TTL/cap et base légale, documenter les catégories, fournisseurs et suppressions.

Critère de validation : Refus respecté selon la politique validée, termes sensibles non conservés, suppression automatique testée et notice cohérente.

### F14 — L’API de recherche utilise une IP non fiable et ne valide pas le type de query.

**P2 · Sécurité des API · Confiance : Confirmed · Effort : S**

Preuve : api/search-log.ts:51–56 utilise x-forwarded-for puis .trim() hors try. Simulation : clé rl:search:spoofable malgré x-vercel-forwarded-for présent ; query=42 lève une exception. Point d’entrée : [api/search-log.ts](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/api/search-log.ts:51>).

Impact : Budget anti-abus contournable dans la fonction ; requêtes malformées générant erreurs et coûts. L’exploitabilité externe dépend aussi du proxy.

Correction proposée : Réutiliser clientIp, refuser l’absence d’IP fiable, contrôler les types avant transformation et borner le stockage.

Critère de validation : Tests d’entêtes contradictoires et de query numérique/objet ; 400 déterministe et aucun enregistrement.

### F15 — L’inscription push affiche un succès même lorsque la persistance échoue.

**P2 · Notifications push · Confiance : Confirmed · Effort : S**

Preuve : api/push.ts:120–135 ignore les résultats de kvPipeline ; simulation d’une souscription valide avec KV indisponible : 200 {ok:true}. Point d’entrée : [api/push.ts](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/api/push.ts:120>).

Impact : Le navigateur peut annoncer un abonnement qui ne recevra aucune notification ; suppression non garantie côté stockage.

Correction proposée : Valider chaque écriture et remonter une erreur récupérable ; permettre de resynchroniser l’abonnement navigateur avec le backend.

Critère de validation : Échec KV → réponse non-2xx et UI honnête ; reprise sans abonnement incohérent.

### F16 — Les choix hebdomadaire/mensuel et de rubrique ne sont pas respectés de bout en bout.

**P2 · Règles de diffusion · Confiance : Confirmed · Effort : M**

Preuve : send-newsletter.mjs:318–326 inclut les weekly à chaque déploiement ; :624–626 marque les contenus envoyés globalement même quand les monthly sont exclus. agenda-reminders.ts:247–256 charge tous les abonnés sans leurs rubriques. newsletter.ts:133 expire la langue après 90 jours et :393 les préférences après un an. Point d’entrée : [scripts/send-newsletter.mjs](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/scripts/send-newsletter.mjs:318>).

Impact : Les mensuels peuvent manquer des publications, les hebdomadaires recevoir plusieurs messages dans une semaine et les personnes excluant agenda recevoir ses rappels.

Correction proposée : Planifier par période et destinataire avec curseur propre, respecter les rubriques dans tous les canaux, conserver les choix tant que l’abonnement est actif.

Critère de validation : Simulation multi-déploiements sur deux mois : aucun contenu perdu, fréquence bornée, rubrique exclue respectée, langue stable.

### F17 — Le build envoie des messages, sans protection contre les doublons de traitement.

**P2 · Déploiement et fiabilité des emails · Confiance : Confirmed · Effort : L**

Preuve : package.json:11 inclut send-newsletter puis IndexNow ; indexnow.mjs ne filtre pas l’environnement. send-newsletter.mjs:369 puis :626 enregistre l’état après tous les destinataires, sans clé d’idempotence ni verrou ; même schéma dans les rappels. Point d’entrée : [package.json](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/package.json:11>).

Impact : Messages potentiellement envoyés avant qu’une version soit publiée ; reprise après échec partiel ou exécutions concurrentes susceptible de doubler les envois. Les tests/builds ordinaires soumettent aussi IndexNow.

Correction proposée : Rendre le build sans effet externe ; déclencher les communications après déploiement vérifié ; file/outbox, verrou et identifiant idempotent par destinataire/contenu.

Critère de validation : Build/test sans réseau métier ; échec au destinataire N puis reprise ne renvoie pas les N−1 messages ; deux jobs simultanés ne doublonnent pas.

### F18 — Les appels externes n’ont pas de timeout applicatif et les envois sont largement séquentiels.

**P2 · Résilience et montée en charge · Confiance : Confirmed · Effort : M**

Preuve : fetch dans api/_rate-limit.ts:58, contact.ts:115, newsletter.ts et rappels sans AbortSignal ; boucles sendNotification/fetch séquentielles. vercel.json borne les crons à 60 s ; alertOwner utilise le même fournisseur email. Point d’entrée : [api/_rate-limit.ts](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/api/_rate-limit.ts:58>).

Impact : Une dépendance lente peut immobiliser la fonction ; la fenêtre serveur devient limitante avec plus d’abonnés. Le seuil réel n’a pas été mesuré.

Correction proposée : Timeouts et budgets par opération, erreurs différenciées, concurrence bornée/queue, reprise persistante et alerte indépendante du canal en panne.

Critère de validation : Tests fournisseurs lents/429/5xx ; traitement paginé interrompu puis repris sans perte ni doublon ; temps borné.

### F19 — Le service worker télécharge l’ensemble des pages et chunks au premier install.

**P2 · Performance et sobriété · Confiance : Confirmed · Effort : M**

Preuve : scripts/prerender.mjs:304–327 puis :357 : 217 ressources en Promise.allSettled. Inventaire local : 11 521 705 octets bruts, estimation gzip/binaire 3 351 619 octets, hors entêtes ; inclut 130 pages et documents. Point d’entrée : [scripts/prerender.mjs](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/scripts/prerender.mjs:304>).

Impact : Consommation de données/cache et concurrence réseau supplémentaires sur mobile ; la séparation des chunks n’évite pas ce transfert de fond.

Correction proposée : Précacher shell, offline, ressources indispensables et pages choisies ; runtime-cache borné pour le reste, concurrence réduite et respect de Save-Data.

Critère de validation : Premier chargement mesuré avec SW actif ; budget de précache documenté et fortement réduit sans perdre la navigation offline prévue.

### F20 — Les ressources non fingerprintées peuvent rester périmées et l’activation est agressive.

**P2 · Cache et mises à jour · Confiance : Confirmed · Effort : M**

Preuve : prerender.mjs:347 versionne la liste des URL, pas le contenu ; :445 cache-first aussi pour images/PDF/ICS ; :357 ignore les échecs d’installation, :358 skipWaiting et :367 supprime les anciens caches. vercel.json:154 met les polices non versionnées en immutable. Point d’entrée : [scripts/prerender.mjs](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/scripts/prerender.mjs:347>).

Impact : Une modification image/PDF seule peut conserver le même SW ; suppression d’ancien cache malgré installation partielle et onglets existants.

Correction proposée : Fingerprint/version de contenu pour actifs stables, politiques séparées avec expiration, activation contrôlée et suppression limitée aux caches applicatifs obsolètes.

Critère de validation : Tests mise à jour PDF sans JS modifié, mode offline, install partielle et deux onglets de versions différentes.

### F21 — Le flux podcast référence des pages HTML, pas des fichiers audio.

**P2 · Podcast et flux · Confiance : Confirmed · Effort : M**

Preuve : src/seo/meta.ts:1289–1304 produit enclosure type=text/html length=0 depuis TRIBUNES ; production /podcast.xml idem ; podcast-fr.xml reçoit le même flux. Podcasts.tsx:604–605 promet Apple/Spotify. Point d’entrée : [src/seo/meta.ts](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/src/seo/meta.ts:1289>).

Impact : L’import dans les applications podcast n’a pas le contrat média annoncé.

Correction proposée : Générer depuis les épisodes disposant d’un média réellement lisible ; URL audio, MIME, taille, GUID et langue corrects.

Critère de validation : Validation du flux dans un lecteur et validation Apple ; téléchargement de chaque enclosure audio ; FR/EN cohérents.

Références : [Source officielle 1](https://podcasters.apple.com/support/823-podcast-requirements).

### F22 — Le schéma et llms.txt surévaluent le corpus scientifique.

**P2 · SEO et intégrité bibliographique · Confiance : Confirmed · Effort : S**

Preuve : publications.ts contient 16 publications et un blog ; public/llms.txt:33 et :49 annonce 17 peer-reviewed/DOI-indexed ; meta.ts:941–945 marque toutes les entrées MedicalScholarlyArticle, y compris sur bibliography où la liste visible est filtrée. Point d’entrée : [src/seo/meta.ts](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/src/seo/meta.ts:941>).

Impact : Information structurée ne correspondant pas exactement au contenu visible et comptages contradictoires.

Correction proposée : Compter/typer par nature réelle de contenu et construire chaque schéma sur la collection affichée.

Critère de validation : 16 publications plus un blog explicitement distingués, données structurées et compteurs cohérents sur toutes les pages.

Références : [Source officielle 1](https://developers.google.com/search/docs/appearance/structured-data/sd-policies).

### F23 — Plusieurs modules anglais affichent des chaînes françaises.

**P2 · Internationalisation éditoriale · Confiance : Confirmed · Effort : M**

Preuve : genomics.ts:10–12 region/prevalence sont des chaînes uniques, rendues par GenomicsExplorer.tsx:95 ; stratification.ts coverageTarget/cycles/target rendus sans traduction par SubnationalTailoringSimulator.tsx:212, :230, :248. Point d’entrée : [src/data/genomics.ts](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/src/data/genomics.ts:10>).

Impact : Qualité de la version internationale et compréhension des recommandations diminuées.

Correction proposée : Typer les libellés en Record<Lang,string>, traduire toutes les valeurs et exporter dans la langue choisie.

Critère de validation : Revue des modules et exports en EN, tests vérifiant que les libellés FR ne sont pas injectés.

### F24 — Des textes du module podcast ont un contraste insuffisant.

**P2 · Accessibilité visuelle · Confiance : Confirmed · Effort : S**

Preuve : Axe mobile stable /fr : PodcastSection.tsx:309 ratio 3,05:1 sur blanc pour texte 11px ; :328 ratio 3,98:1 sur fond clair pour texte 12px. Point d’entrée : [src/components/PodcastSection.tsx](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/src/components/PodcastSection.tsx:309>).

Impact : Lecture difficile des métadonnées pour les personnes malvoyantes ; seuil AA du petit texte non atteint.

Correction proposée : Assombrir les couleurs de texte et vérifier tous les états clairs/sombres, sans compter sur le mode contraste optionnel.

Critère de validation : Ratio minimum 4,5:1 sur petit texte normal ; zéro color-contrast après chargement et défilement.

Références : [Source officielle 1](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).

### F25 — Le nom du logo chevauche les commandes du menu mobile.

**P2 · Design responsive · Confiance : Confirmed · Effort : S**

Preuve : Capture Chromium 390×844 /fr : texte Dr. Seynudé DAGNON superposé aux boutons recherche/thème. Navbar.tsx:219–241 combine min-w-0, nom non tronqué et groupe d’actions large. Point d’entrée : [src/components/Navbar.tsx](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/src/components/Navbar.tsx:219>).

Impact : Lisibilité et cibles tactiles dégradées, même sans débordement horizontal global.

Correction proposée : Réserver une largeur minimale aux actions, masquer/tronquer le nom à un breakpoint cohérent ; garder le nom accessible.

Critère de validation : Captures 320/360/390/768 px, texte agrandi et deux langues : aucune collision des rectangles.

### F26 — Les tests verts donnent une assurance insuffisante sur les parcours et le rendu final.

**P2 · Couverture de tests · Confiance : Confirmed · Effort : M**

Preuve : 389/389 passent ; tests/a11y.test.mjs:114 lance axe après domcontentloaded sans attendre tous les composants lazy/animations. tests/newsletter-prefs.test.mjs:94 utilise une chaîne et non l’objet Vercel. tests/performance.test.mjs ne mesure pas INP et autorise LCP jusqu’à 5 500 ms. Point d’entrée : [tests/a11y.test.mjs](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/tests/a11y.test.mjs:114>).

Impact : Les défauts F01/F02/F11/F24 restent invisibles dans la validation existante.

Correction proposée : Ajouter E2E des parcours clés, attentes métier explicites, défilement des contenus Reveal, mobile/dark, simulation du runtime et des pannes ; distinguer budget anti-régression et CWV.

Critère de validation : Chaque défaut confirmé obtient un test rouge avant correction ; tests axe ne s’exécutent plus sur un fallback incomplet.

### F27 — Une route publique attendue diverge de la configuration locale.

**P2 · État déployé · Confiance : Confirmed · Effort : M**

Preuve : GET https://seynudedagnon.com/newsletter/preferences sans jeton : HTTP 404 et page 404 observés ; vercel.json local contient une rewrite de cette route vers /index.html. Point d’entrée : [vercel.json](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/vercel.json:664>).

Impact : Le point d’entrée des préférences est indisponible dans l’état public observé ; la cause n’est pas prouvée.

Correction proposée : Comparer commit/configuration du déploiement actif, règles CDN et rewrites, puis vérifier le comportement voulu sans utiliser de vrais jetons.

Critère de validation : GET sans token renvoie une page préférences invalide explicite et non une 404 ; route valide testée en staging avec faux compte.

### F28 — Les règles IA servies par le CDN et celles du dépôt sont contradictoires.

**P3 · Robots et politique IA · Confiance : Confirmed · Effort : S**

Preuve : public/robots.txt autorise plusieurs bots ; la réponse publique ajoute des interdictions Cloudflare pour certains des mêmes bots. Les groupes spécifiques n’héritent pas des exclusions du groupe générique. Point d’entrée : [public/robots.txt](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/public/robots.txt:5>).

Impact : Politique d’accès ambiguë selon les robots ; pas de preuve d’un blocage global de Google ni d’une perte de trafic.

Correction proposée : Choisir une politique unique, synchroniser CDN/code et reporter les exclusions métier nécessaires dans les groupes concernés.

Critère de validation : Vérification des règles réellement servies avec jeux d’URL publics/privés et agents concernés.

Références : [Source officielle 1](https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec).

### F29 — La fraîcheur du sitemap et la sélection des pages techniques sont perfectibles.

**P3 · SEO technique · Confiance : Confirmed · Effort : S**

Preuve : meta.ts:1764 routeLastmod utilise selon le cas date de publication/événement ou date du build ; /offline est inclus au sitemap et reste indexable. Point d’entrée : [src/seo/meta.ts](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/src/seo/meta.ts:1764>).

Impact : Signal lastmod peu fidèle et page technique proposée à l’index ; aucun effet de classement démontré.

Correction proposée : Date de modification éditoriale explicite, sans mise à jour artificielle ; exclure offline du sitemap et le passer noindex tout en gardant son cache.

Critère de validation : Build sans changement éditorial ne change pas lastmod ; sitemap sans pages de secours.

### F30 — Les balises citation_* restent celles de la page chargée initialement.

**P3 · Métadonnées de navigation · Confiance : Confirmed · Effort : S**

Preuve : prerender.mjs:79 injecte les citations ; src/components/Seo.tsx ne les réconcilie pas lors des changements de route. Point d’entrée : [src/components/Seo.tsx](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/src/components/Seo.tsx>).

Impact : Les outils bibliographiques lisant le DOM après navigation peuvent citer le mauvais article.

Correction proposée : Mettre à jour et supprimer les balises de citation avec les autres métadonnées ; compléter les coauteurs.

Critère de validation : Navigation article A → B → accueil : citations de B puis absence de citations non pertinentes.

### F31 — Le titre principal prérendu est invisible lorsque JavaScript ne s’exécute pas.

**P2 · Rendu sans JavaScript · Confiance : Confirmed · Effort : S**

Preuve : Hero.tsx:13 initialise opacity:0 ; rendu Chromium JavaScript désactivé de dist/fr/index.html : H1 opacity=0, translateY(30px). Le texte est bien présent dans HTML. Point d’entrée : [src/sections/Hero.tsx](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/src/sections/Hero.tsx:13>).

Impact : Présentation d’accueil incomplète sans JS ou avant animation ; ne pas confondre présence du texte dans la source et visibilité réelle.

Correction proposée : Rendre le contenu critique visible par défaut en SSR et activer l’animation seulement après amélioration progressive.

Critère de validation : H1, portrait et CTA visibles avec JS désactivé et chunk d’accueil bloqué.

### F32 — Les variantes serveur/client et les helpers dupliqués augmentent le risque de divergence.

**P3 · Architecture et maintenabilité · Confiance : Confirmed · Effort : M**

Preuve : Home.tsx/Home.server.tsx et Impact.tsx/Impact.server.tsx dupliquent les arbres ; main.tsx:82 recrée le DOM au lieu d’hydrater ; copies de tokens/guards/templates dans send-newsletter et API. Point d’entrée : [src/entry-server.tsx](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/src/entry-server.tsx:4>).

Impact : Coût de maintenance, risque de dérive et travail de remontage. Aucune régression de CLS n’est imputée sans mesure à ce seul choix.

Correction proposée : Factoriser les arbres avec composants injectés ; centraliser les helpers compilables ; évaluer une hydratation compatible plutôt qu’une migration automatique.

Critère de validation : Tests de parité contenu SSR/client, un seul contrat de tokens/guards, mesure avant/après tout changement de rendu.

### F33 — La version Node annoncée est trop permissive.

**P2 · Compatibilité d’environnement · Confiance : Confirmed · Effort : S**

Preuve : package.json engines >=20.0.0 ; manifest installé react-router 8.3.0 exige >=22.22.0 et Vite 7.3.6 exige ^20.19.0 ou >=22.12.0. Machine audit Node 24.20.0, CI major 22. Point d’entrée : [package.json](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/package.json:6>).

Impact : Un environnement autorisé par le projet peut être refusé ou casser dans les dépendances.

Correction proposée : Déclarer une plage compatible, verrouiller/versionner le runtime choisi en local/CI/Vercel et vérifier installation propre.

Critère de validation : npm ci + lint + build + tests sur la plus ancienne version officiellement supportée.

### F34 — Le contrôle DNS accepte une réponse mixte publique/privée contrairement à son contrat.

**P2 · Défense SSRF · Confiance : Confirmed · Effort : S**

Preuve : api/_push-guard.ts:111 utilise addresses.some(nonPrivate), bien que le commentaire demande aucune adresse privée ; copie dans scripts/send-newsletter.mjs. Test DNS simulé [8.8.8.8,127.0.0.1] accepté. Point d’entrée : [api/_push-guard.ts](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/api/_push-guard.ts:111>).

Impact : Défense en profondeur incomplète. L’allowlist limite l’exploitation ; aucun SSRF réel n’a été démontré.

Correction proposée : Exiger une liste non vide et toutes les adresses autorisées ; vérifier les représentations IPv6 et les redirections/résolutions utilisées pour l’envoi.

Critère de validation : Tests public seul accepté, mixte/privé/échec DNS refusés, contrat identique dans les deux implémentations.

### F35 — Plusieurs passages du README ne décrivent plus le comportement courant.

**P3 · Documentation et exploitation · Confiance : Confirmed · Effort : S**

Preuve : README : VERIFY_SECRET recommandé alors qu’obligatoire en production ; envoi BCC par lots de 50 alors que le code envoie par destinataire ; tête statique/corps non rendu alors que SSR présent ; précache annoncé 196 contre 217 observés. Point d’entrée : [README.md](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/README.md:1>).

Impact : Mauvaise configuration possible et coût de reprise du projet ; architecture difficile à exploiter avec confiance.

Correction proposée : Mettre à jour le runbook à partir des contrats réels, inventorier sauvegarde/restauration KV, rotation des secrets et contrôle post-déploiement.

Critère de validation : Un tiers peut installer et diagnostiquer la plateforme depuis les instructions sans hypothèses implicites.

### F36 — Le développement du sigle AIRID est erroné.

**P2 · Exactitude institutionnelle · Confiance : Confirmed · Effort : S**

Preuve : src/data/agenda.ts:44 indique African Institute for Research in Data Intelligence ; l’article officiel lié indique African Institute for Research in Infectious Diseases. Point d’entrée : [src/data/agenda.ts](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/src/data/agenda.ts:44>).

Impact : Erreur factuelle visible dans une actualité et susceptible d’être reprise dans les flux.

Correction proposée : Corriger FR/EN, régénérer agenda/ICS et vérifier les autres noms propres et affiliations avec leurs sources.

Critère de validation : Libellés conformes à la source officielle sur la page et les exports.

Références : [Source officielle 1](https://airid-africa.com/public/news/28-airid-welcomes-dr-seynude-jean-fortune-dagnon-from-the-gates-foundation).

### F37 — Le message est tronqué/normalisé côté serveur sans limites équivalentes dans l’UI.

**P3 · Contrat du formulaire · Confiance : Confirmed · Effort : S**

Preuve : api/contact.ts:54–59 et :88–93 suppriment retours/tabulations et limitent le message à 5 000 caractères ; les champs du formulaire n’ont pas les mêmes maxLength. autoReplyHtml est anglais uniquement. Point d’entrée : [api/contact.ts](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/api/contact.ts:54>).

Impact : Perte silencieuse de texte et de structure, réponse automatique non localisée.

Correction proposée : Préserver les retours à la ligne du message, rejeter ou signaler les dépassements et partager les limites ; transmettre la langue pour l’accusé de réception.

Critère de validation : Message multiligne intact et test aux limites ; aucun tronquage silencieux ; accusé FR/EN cohérent.


## C. Plan d’action priorisé

Le plan complet et ses critères de réception se trouvent dans [ACTION-PLAN.md](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/ACTION-PLAN.md>).

1. **Rétablir les garanties de livraison** : F10 lint, F09 stockage bloqué, F01 code téléphone, F02 corps JSON, F03 paramètres de langue. Écrire les tests reproduisant les défauts avant les correctifs.
2. **Sécuriser le consentement et la confiance** : F04/F05 désinscription et confirmation ; F06 consentement global ; F07/F08 revue des séries/modèles et de leurs labels. Les changements scientifiques nécessitent validation du propriétaire, pas une simple réécriture technique.
3. **Réparer les parcours et l’accessibilité** : F11/F24 contrôles et contrastes, F12 rendez-vous, F15 push, F21 flux audio, F25 menu mobile et F31 rendu sans JS.
4. **Fiabiliser les communications** : F13/F14 recherche, F16 règles de diffusion, F17 envois hors build et idempotence, F18 délais et reprise.
5. **Rendre le déploiement reproductible et sobre** : F19/F20 cache, F26 tests réalistes, F27 état public, F33 runtime et F34 défense DNS.
6. **Assainir métadonnées et contenu** : F22/F23/F36 ; puis F28/F29/F30/F32/F35/F37 pour la maintenance.

Pas de refonte générale ni de migration de framework recommandée en première intention : les défauts prioritaires se situent dans les contrats, les données et les parcours. Décider d’une migration seulement après comparaison mesurée avec les besoins.

## D. Inconnues, limites et vérifications complémentaires

### Ce qui n’est pas démontré par cet audit

- **Production privée** : variables réellement configurées, comptes Vercel/Cloudflare/Resend/Upstash, restrictions d’équipe, protection des previews, régions, quotas, journaux, alertes reçues et facturation. Aucune authentification admin n’a été tentée.
- **Sécurité opérationnelle** : aucune preuve de fuite ou d’intrusion ; absence d’audit exhaustif de l’historique Git, des dépendances internes et de l’infrastructure. `npm audit` ne couvre que les vulnérabilités connues déclarées par le registre.
- **Protection des secrets** : force réelle, rotation et séparation ADMIN_SECRET/CRON_SECRET/VERIFY_SECRET inconnues. Le fallback admin→cron est visible ; recommander des secrets séparés et une authentification forte/traçable si l’outil d’administration devient plus sensible. Le stockage du bearer en sessionStorage augmente l’impact potentiel d’une XSS, sans prouver une XSS existante.
- **Données et conservation** : sauvegardes KV, restauration testée, rétention des emails Resend/boîtes de réception, suppression des données et registre des consentements non contrôlés. La notice affirme des suppressions, mais le dépôt ne suffit pas à attester leur exécution.
- **Juridique** : applicabilité territoriale précise du RGPD, droit béninois, contrats sous-traitants, transferts internationaux, autorisations de photographies/personnes, reprints et marques/logos non validés. Les citations CNIL servent de référence de conception, pas de conclusion juridique définitive.
- **Contenus de santé** : pas de certification scientifique. Vérifier chaque chiffre de pays, prévalence génomique, bénéfice revendiqué, résultat financier et recommandation avec des sources primaires actuelles et le Dr Dagnon. La recherche a vérifié les exemples explicitement cités, pas l’intégralité des faits médicaux.
- **Audience et SEO réel** : Search Console, pages effectivement indexées, positions, trafic, backlinks, conversions, taux d’engagement et provenance des leads indisponibles. Aucune pénalité Google ni baisse de classement n’est alléguée.
- **Performance terrain** : aucune donnée CrUX/INP, aucun test de charge, de bas débit réel en Afrique ou de coût serveur sous trafic distribué. Le résultat PageSpeed bloqué par quota est une limite d’environnement, pas un défaut du site.
- **Accessibilité complète** : échantillon mobile de sept routes, pas toute la matrice navigateur/écran/zoom. Pas de revue VoiceOver/NVDA complète, de certification WCAG/RGAA, ni de validation manuelle exhaustive des vidéos, transcriptions, sous-titres et documents.
- **Fichiers téléchargeables** : les tests existants vérifient la présence/structure de PDF et actifs ; leur exactitude éditoriale, balisage d’accessibilité, liens et mise en page de chaque page PDF n’ont pas été audités visuellement. Les droits du MP3 et des images restent à confirmer.
- **Emails et notifications** : les scénarios ont utilisé uniquement des services simulés. Délivrabilité réelle, SPF/DKIM/DMARC, liens reçus, web push Safari/Firefox/Android et gestion des erreurs fournisseurs doivent être vérifiés avec un compte de test autorisé.
- **PWA** : inventaire et logique du SW inspectés, mais pas une matrice complète d’upgrade/offline/multi-onglets. Le test sans JavaScript et les captures de navigation ne constituent pas un test d’installation PWA.
- **Exhaustivité des liens** : pas de crawl intégral des liens externes. Les endpoints de confirmation/désabonnement n’ont pas été suivis avec des jetons, pour éviter toute mutation.

### Protocole de vérification conseillé avant validation de production

- Sur un environnement de staging isolé : service email de test, faux abonnés et stockage distinct de la production.
- Exécuter l’installation propre sur le runtime déclaré, lint, typecheck, build sans effets externes et tests.
- Tester contact→accusé→code→téléphone, newsletter→confirmation→préférences→changement de langue→désinscription→rejeu.
- Tester les mêmes scénarios avec stockage indisponible, fournisseur lent/429/500, double clic, reprise et jobs concurrents.
- Vérifier desktop/mobile, clavier, thèmes, zoom et préférence de réduction des animations, et attendre le chargement complet des composants.
- Après un déploiement autorisé : vérifier HTTP/canonical/404 et un parcours métier de test, puis comparer la version active au commit attendu.
- Faire approuver les données, modèles, affiliations et mentions de confidentialité par leurs responsables.

### Méthode, provenance et artefacts

Commandes principales réellement exécutées :

~~~text
npm run lint                                  # échec, 1 erreur
node node_modules/typescript/bin/tsc -b         # succès
node node_modules/vite/bin/vite.js build        # succès
node scripts/prerender.mjs                     # succès, 130 pages
npm run test:only                              # succès, 389 tests
npm audit --json                              # 0 vulnérabilité signalée
~~~

La commande globale `npm run build`/`npm test` n’a volontairement pas été utilisée pour éviter l’envoi newsletter/IndexNow qu’elle contient. Les étapes compilatoires et la suite ont été exécutées séparément. Pas de `npm audit fix`, pas d’installation/modification de dépendance, pas de commit ni de push.

La compétence SEO a ajouté une vérification spécialisée, les scripts robots/llms/en-têtes/PageSpeed/social/hreflang/redirections, l’extraction du HTML local et la vérification des constats. Le vérificateur a conservé **37 constats sur 37, zéro doublon supprimé** ; il s’agit d’une normalisation/déduplication, pas d’une preuve indépendante de véracité. Les preuves ont aussi été relues manuellement.

Les références locales de la compétence datent de février/mai 2026, au-delà de 90 jours. Les assertions de facteurs de classement, pénalités ou scores non corroborés n’ont pas été reprises. Le score faible d’un parseur llms.txt n’est pas considéré comme un défaut SEO majeur : [Google ne demande pas de fichier IA spécial pour ses fonctions de recherche IA](https://developers.google.com/search/docs/appearance/ai-features). Les verdicts simplistes « bot entièrement bloqué » ont été écartés lorsque la réponse robots comportait des règles concurrentes.

Artefacts de contrôle :

- [Journal des 389 tests](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/audit-test.log>) — ignoré par Git.
- [Diagnostics API simulés, reproductibles](<C:/Users/Studio26/.codex/visualizations/2026/09/04/01a06cee-e7eb-7203-a55c-fddf98074585/audit-api.mjs>).
- [Diagnostics navigateur, reproductibles](<C:/Users/Studio26/.codex/visualizations/2026/09/04/01a06cee-e7eb-7203-a55c-fddf98074585/audit-browser.mjs>).
- [Résultats navigateur détaillés](<C:/Users/Studio26/.codex/visualizations/2026/09/04/01a06cee-e7eb-7203-a55c-fddf98074585/audit-browser-results.json>).
- [Constats structurés vérifiés](<C:/Users/Studio26/.codex/visualizations/2026/09/04/01a06cee-e7eb-7203-a55c-fddf98074585/audit-findings-verified.json>).
- [Capture mobile](<C:/Users/Studio26/.codex/visualizations/2026/09/04/01a06cee-e7eb-7203-a55c-fddf98074585/audit-mobile.png>) et [capture desktop](<C:/Users/Studio26/.codex/visualizations/2026/09/04/01a06cee-e7eb-7203-a55c-fddf98074585/audit-desktop.png>).

Les scripts de diagnostic résident hors du dépôt et utilisent des identifiants fictifs. Le build a régénéré les sorties ignorées `dist/` et des fichiers temporaires sous `node_modules/.tmp/`. Les changements applicatifs déjà présents avant l’audit ont été conservés. La phrase « seuls les deux fichiers de rapport ont été ajoutés » décrivait la phase d’audit initiale ; elle est désormais remplacée par l’état post-implémentation ci-dessous.

## État post-implémentation — 4 septembre 2026

Les corrections applicatives réalisables localement ont été mises en œuvre après l’audit : contrats contact/newsletter/push, confirmation et désinscription anti-rejeu, consentement analytique explicite et révocable, confidentialité de la recherche, timeouts réseau, idempotence et reprise des envois, fréquences newsletter, PWA à cache réduit et mise à jour consentie, flux podcast valides, SEO/schema/sitemap/robots/llms, robustesse du stockage navigateur, accessibilité des contrôles, navigation mobile, conservation des paramètres lors du changement de langue, sécurité SSRF et documentation d’exploitation.

Les outils scientifiques et de politique publique portent maintenant un statut démonstratif visible, des données fictives ou hypothétiques clairement identifiées et une interdiction explicite d’usage décisionnel lorsqu’aucune validation scientifique n’est fournie. Cela réduit le risque de mésusage mais ne remplace pas la validation d’un responsable scientifique.

Validation finale locale :

~~~text
npm run lint       # succès, 0 erreur
npx tsc -b         # succès
npm run build      # succès, 130 pages pré-rendues, SW limité à 17 ressources
npm run test:only  # succès, 401/401 tests
npm audit          # 0 vulnérabilité signalée lors de la mise à jour du lockfile
~~~

Restent nécessairement hors du périmètre d’une implémentation locale : la vérification du déploiement actif et de ses secrets, la délivrabilité réelle/SPF/DKIM/DMARC, les données Web Vitals terrain, les essais multi-appareils et lecteurs d’écran, ainsi que les validations juridique, scientifique, éditoriale et de droits sur les médias. Aucune publication, aucun envoi réel et aucun changement d’infrastructure distante n’ont été déclenchés.
