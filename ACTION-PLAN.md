# Plan d’action — audit du 4 septembre 2026

Ce plan découle du [rapport complet](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/FULL-AUDIT-REPORT.md>) : **37 constats étayés, dont 10 P1, 21 P2 et 6 P3**. Aucun correctif n’a été appliqué. Il s’agit d’un ordre de traitement proposé, pas d’une autorisation de modifier le projet ni d’un devis.

## Décision de validation

Ne pas confondre « build réussi / 389 tests verts » avec « plateforme validée ». Le lint est rouge et plusieurs parcours déterminants sont cassés.

Pour une nouvelle validation de production, résoudre les P1 ou documenter formellement une mesure compensatoire approuvée. Pour les modèles scientifiques, une mesure compensatoire possible à valider est de retirer temporairement leur apparence officielle et de les signaler clairement comme démonstrations ; cela ne remplace pas la revue scientifique.

### Légende

- **P1** : priorité avant nouvelle validation.
- **P2** : prochain cycle de correction.
- **P3** : maintenance planifiée.
- **S / M / L** : effort relatif localisé / plusieurs composants / chantier transversal. L’effort de validation juridique ou scientifique n’est pas estimé en jours.

## Ordre de travail

| Lot | Objectif | Dépendances | Critère de sortie |
|---|---|---|---|
| 1 | Contrats et robustesse | Aucun | Lint vert, téléphone et préférences opérationnels, stockage bloqué toléré |
| 2 | Consentement et contenu de confiance | Peut avancer avec le lot 1 | Désinscription réelle, non-rejeu, choix traqueurs cohérents, contenus approuvés |
| 3 | Conversion et accessibilité | Contrats UI stabilisés | Réservation non circulaire, flux audio valide, contrôles nommés, mobile lisible |
| 4 | Communications et stockage | Modèle de consentement fixé | Fréquences respectées, aucune perte/doublon à la reprise, appels bornés |
| 5 | Livraison et performance | Build sans effets externes | Cache sobre, runtime reproductible, tests réalistes et production vérifiée |
| 6 | Métadonnées et maintenance | Données éditoriales validées | Sources/types/langues cohérents et runbook exploitable |

Les correctifs rapides les plus rentables sont F01, F02, F03, F09, F10, F11, F12, F24, F25, F31 et F36. Les chantiers structurants sont F06, F08, F16, F17, F18 et F20.

## Lot 1 — Rétablir les parcours bloquants

Responsables suggérés : Frontend + backend.

À traiter avant nouvelle validation de production. Ne pas modifier les mécanismes de sécurité pour contourner les erreurs UI.

### F10 · P1 · Qualité et CI

Le lint échoue sur l’état audité.

- Action : Revoir l’initialisation du bandeau sans cascade d’effet et sans compromettre SSR/stockage ; ne pas désactiver la règle par défaut.
- Réception : npm run lint termine avec code 0 et le test de stockage bloqué reste vert.
- Effort relatif : **S**. Point d’entrée : [src/components/ConsentBanner.tsx](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/src/components/ConsentBanner.tsx:18>).

### F09 · P1 · Robustesse navigateur

Un stockage navigateur indisponible peut vider toute l’application.

- Action : Encapsuler tous les accès au stockage du consentement et prévoir un état mémoire ; ajouter une limite d’erreur couvrant le shell.
- Réception : Avec Storage.getItem/setItem qui lèvent SecurityError, navigation et refus du consentement restent utilisables.
- Effort relatif : **S**. Point d’entrée : [src/components/ConsentBanner.tsx](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/src/components/ConsentBanner.tsx:17>).

### F01 · P1 · Parcours contact

Le code de déverrouillage du téléphone ne peut pas être saisi intégralement.

- Action : Partager le contrat de longueur, accepter 10 caractères côté UI et harmoniser les libellés FR/EN.
- Réception : Un test navigateur colle le code produit par une API simulée et affiche le téléphone sans manipulation du DOM.
- Effort relatif : **S**. Point d’entrée : [src/pages/Contact.tsx](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/src/pages/Contact.tsx:296>).

### F02 · P1 · Préférences newsletter

Le POST des préférences rejette le corps JSON fourni par Vercel.

- Action : Accepter un objet déjà parsé, puis valider explicitement sa structure ; conserver le support chaîne si nécessaire.
- Réception : Tests objet, chaîne, null, tableaux et JSON invalide ; test HTTP sur environnement de validation Vercel.
- Effort relatif : **S**. Point d’entrée : [api/newsletter.ts](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/api/newsletter.ts:481>).

### F03 · P1 · Internationalisation

Le changement de langue détruit les paramètres d’URL.

- Action : Préserver search et hash lors des deux navigations ; privilégier une suggestion de langue ou des liens explicites.
- Réception : Tests première visite FR, switch FR/EN, paramètres encodés, hash et absence de boucle.
- Effort relatif : **S**. Point d’entrée : [src/i18n/LanguageContext.tsx](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/src/i18n/LanguageContext.tsx:60>).

## Lot 2 — Restaurer les garanties de consentement et de confiance

Responsables suggérés : Backend + référent confidentialité + responsable scientifique.

Même priorité que le lot 1. Les contenus scientifiques et les bases légales doivent être approuvés par leurs responsables.

### F04 · P1 · Désinscription

Une panne de stockage est annoncée comme une désinscription réussie.

- Action : N’annoncer le succès qu’après suppression vérifiée ; retourner une erreur temporaire exploitable et alerter hors du fournisseur défaillant.
- Réception : KV absent, HTTP 500 et erreurs Redis par commande ne doivent jamais produire Unsubscribed.
- Effort relatif : **S**. Point d’entrée : [api/newsletter.ts](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/api/newsletter.ts:374>).

### F05 · P1 · Cycle de consentement

Un ancien lien de confirmation peut réinscrire après désabonnement.

- Action : Consommer atomiquement un état pending/noncé non réutilisable ; révoquer les confirmations lors du désabonnement.
- Réception : Séquence souscrire → confirmer → désabonner → rejouer la confirmation : aucune réinscription.
- Effort relatif : **M**. Point d’entrée : [api/newsletter.ts](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/api/newsletter.ts:143>).

### F06 · P1 · Confidentialité et consentement

Le bandeau ne pilote pas réellement tous les traitements annoncés et n’offre pas de retrait intégré.

- Action : Créer un état de consentement unique, limiter les finalités accordées, ajouter « Gérer mes choix » permanent et documenter le comportement de chaque traceur ; faire valider les bases légales.
- Réception : Tests réseau avant choix/après refus/après acceptation/après retrait ; aucune finalité publicitaire accordée par le bouton d’audience.
- Effort relatif : **M**. Point d’entrée : [src/components/ConsentBanner.tsx](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/src/components/ConsentBanner.tsx:20>).

### F07 · P1 · Fiabilité éditoriale

Une courbe illustrative est créditée à l’OMS et présentée comme actualisée en direct.

- Action : Utiliser une série primaire vérifiable avec tableau, année, unité et date de mise à jour ; sinon afficher clairement données fictives, sans attribution causale ni faux direct.
- Réception : Chaque point doit être retraçable à une source ; le statut de fraîcheur représente une vraie actualisation de données.
- Effort relatif : **M**. Point d’entrée : [src/components/MalariaBarometer.tsx](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/src/components/MalariaBarometer.tsx:10>).

### F08 · P1 · Modèles scientifiques

Les calculateurs et mémorandums se présentent comme outils institutionnels sans validation traçable.

- Action : Revue par le propriétaire scientifique ; sources primaires versionnées, hypothèses, domaine de validité, analyses de sensibilité et limites explicites ; retirer les labels officiels non justifiés, corriger le champ vecteur.
- Réception : Validation signée du contenu et du modèle ; tout résultat/export porte sources et avertissement adéquat ; tests des formules et valeurs limites.
- Effort relatif : **L**. Point d’entrée : [src/components/HealthEconomicsSimulator.tsx](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/src/components/HealthEconomicsSimulator.tsx:18>).

## Lot 3 — Corriger les parcours secondaires et l’accessibilité

Responsables suggérés : Frontend + QA.

Après stabilisation des contrats. Vérifier les interactions dans les deux langues, pas seulement le HTML initial.

### F11 · P2 · Accessibilité

Le simulateur d’impact comporte trois boutons et un curseur sans nom accessible.

- Action : Relier un label au range ; utiliser checkbox ou role=switch avec aria-checked et un nom lié au texte visible.
- Réception : Axe après chargement et après défilement : zéro violation ; test clavier et lecteur d’écran des quatre contrôles.
- Effort relatif : **S**. Point d’entrée : [src/components/HealthEconomicsSimulator.tsx](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/src/components/HealthEconomicsSimulator.tsx:112>).

### F12 · P2 · Conversion

Le choix d’un créneau ne mène pas à une demande préremplie.

- Action : Diriger vers /contact avec type, date, heure et fuseau préremplis ; filtrer les dates passées ou supprimer la disponibilité indicative.
- Réception : Depuis chaque créneau, une demande complète éditable arrive dans le formulaire ; test avec date courante après septembre.
- Effort relatif : **S**. Point d’entrée : [src/components/BookingWidget.tsx](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/src/components/BookingWidget.tsx:61>).

### F15 · P2 · Notifications push

L’inscription push affiche un succès même lorsque la persistance échoue.

- Action : Valider chaque écriture et remonter une erreur récupérable ; permettre de resynchroniser l’abonnement navigateur avec le backend.
- Réception : Échec KV → réponse non-2xx et UI honnête ; reprise sans abonnement incohérent.
- Effort relatif : **S**. Point d’entrée : [api/push.ts](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/api/push.ts:120>).

### F21 · P2 · Podcast et flux

Le flux podcast référence des pages HTML, pas des fichiers audio.

- Action : Générer depuis les épisodes disposant d’un média réellement lisible ; URL audio, MIME, taille, GUID et langue corrects.
- Réception : Validation du flux dans un lecteur et validation Apple ; téléchargement de chaque enclosure audio ; FR/EN cohérents.
- Effort relatif : **M**. Point d’entrée : [src/seo/meta.ts](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/src/seo/meta.ts:1289>).

### F24 · P2 · Accessibilité visuelle

Des textes du module podcast ont un contraste insuffisant.

- Action : Assombrir les couleurs de texte et vérifier tous les états clairs/sombres, sans compter sur le mode contraste optionnel.
- Réception : Ratio minimum 4,5:1 sur petit texte normal ; zéro color-contrast après chargement et défilement.
- Effort relatif : **S**. Point d’entrée : [src/components/PodcastSection.tsx](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/src/components/PodcastSection.tsx:309>).

### F25 · P2 · Design responsive

Le nom du logo chevauche les commandes du menu mobile.

- Action : Réserver une largeur minimale aux actions, masquer/tronquer le nom à un breakpoint cohérent ; garder le nom accessible.
- Réception : Captures 320/360/390/768 px, texte agrandi et deux langues : aucune collision des rectangles.
- Effort relatif : **S**. Point d’entrée : [src/components/Navbar.tsx](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/src/components/Navbar.tsx:219>).

### F31 · P2 · Rendu sans JavaScript

Le titre principal prérendu est invisible lorsque JavaScript ne s’exécute pas.

- Action : Rendre le contenu critique visible par défaut en SSR et activer l’animation seulement après amélioration progressive.
- Réception : H1, portrait et CTA visibles avec JS désactivé et chunk d’accueil bloqué.
- Effort relatif : **S**. Point d’entrée : [src/sections/Hero.tsx](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/src/sections/Hero.tsx:13>).

## Lot 4 — Fiabiliser les données et communications

Responsables suggérés : Backend + exploitation.

Découpler compilation et envois avant d’introduire la planification par destinataire. Tester les pannes sans toucher aux abonnés réels.

### F13 · P2 · Données personnelles

Les recherches libres sont stockées sans durée de rétention et sans filtre de consentement.

- Action : Minimiser/filtrer les requêtes, décider du besoin de stockage, définir TTL/cap et base légale, documenter les catégories, fournisseurs et suppressions.
- Réception : Refus respecté selon la politique validée, termes sensibles non conservés, suppression automatique testée et notice cohérente.
- Effort relatif : **M**. Point d’entrée : [src/components/SearchModal.tsx](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/src/components/SearchModal.tsx:302>).

### F14 · P2 · Sécurité des API

L’API de recherche utilise une IP non fiable et ne valide pas le type de query.

- Action : Réutiliser clientIp, refuser l’absence d’IP fiable, contrôler les types avant transformation et borner le stockage.
- Réception : Tests d’entêtes contradictoires et de query numérique/objet ; 400 déterministe et aucun enregistrement.
- Effort relatif : **S**. Point d’entrée : [api/search-log.ts](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/api/search-log.ts:51>).

### F16 · P2 · Règles de diffusion

Les choix hebdomadaire/mensuel et de rubrique ne sont pas respectés de bout en bout.

- Action : Planifier par période et destinataire avec curseur propre, respecter les rubriques dans tous les canaux, conserver les choix tant que l’abonnement est actif.
- Réception : Simulation multi-déploiements sur deux mois : aucun contenu perdu, fréquence bornée, rubrique exclue respectée, langue stable.
- Effort relatif : **M**. Point d’entrée : [scripts/send-newsletter.mjs](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/scripts/send-newsletter.mjs:318>).

### F17 · P2 · Déploiement et fiabilité des emails

Le build envoie des messages, sans protection contre les doublons de traitement.

- Action : Rendre le build sans effet externe ; déclencher les communications après déploiement vérifié ; file/outbox, verrou et identifiant idempotent par destinataire/contenu.
- Réception : Build/test sans réseau métier ; échec au destinataire N puis reprise ne renvoie pas les N−1 messages ; deux jobs simultanés ne doublonnent pas.
- Effort relatif : **L**. Point d’entrée : [package.json](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/package.json:11>).

### F18 · P2 · Résilience et montée en charge

Les appels externes n’ont pas de timeout applicatif et les envois sont largement séquentiels.

- Action : Timeouts et budgets par opération, erreurs différenciées, concurrence bornée/queue, reprise persistante et alerte indépendante du canal en panne.
- Réception : Tests fournisseurs lents/429/5xx ; traitement paginé interrompu puis repris sans perte ni doublon ; temps borné.
- Effort relatif : **M**. Point d’entrée : [api/_rate-limit.ts](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/api/_rate-limit.ts:58>).

### F34 · P2 · Défense SSRF

Le contrôle DNS accepte une réponse mixte publique/privée contrairement à son contrat.

- Action : Exiger une liste non vide et toutes les adresses autorisées ; vérifier les représentations IPv6 et les redirections/résolutions utilisées pour l’envoi.
- Réception : Tests public seul accepté, mixte/privé/échec DNS refusés, contrat identique dans les deux implémentations.
- Effort relatif : **S**. Point d’entrée : [api/_push-guard.ts](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/api/_push-guard.ts:111>).

## Lot 5 — Stabiliser livraison, cache et qualité

Responsables suggérés : Frontend + exploitation + QA.

Les tests de non-régression accompagnent aussi les lots précédents. Commencer par confirmer l’état du déploiement public.

### F19 · P2 · Performance et sobriété

Le service worker télécharge l’ensemble des pages et chunks au premier install.

- Action : Précacher shell, offline, ressources indispensables et pages choisies ; runtime-cache borné pour le reste, concurrence réduite et respect de Save-Data.
- Réception : Premier chargement mesuré avec SW actif ; budget de précache documenté et fortement réduit sans perdre la navigation offline prévue.
- Effort relatif : **M**. Point d’entrée : [scripts/prerender.mjs](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/scripts/prerender.mjs:304>).

### F20 · P2 · Cache et mises à jour

Les ressources non fingerprintées peuvent rester périmées et l’activation est agressive.

- Action : Fingerprint/version de contenu pour actifs stables, politiques séparées avec expiration, activation contrôlée et suppression limitée aux caches applicatifs obsolètes.
- Réception : Tests mise à jour PDF sans JS modifié, mode offline, install partielle et deux onglets de versions différentes.
- Effort relatif : **M**. Point d’entrée : [scripts/prerender.mjs](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/scripts/prerender.mjs:347>).

### F26 · P2 · Couverture de tests

Les tests verts donnent une assurance insuffisante sur les parcours et le rendu final.

- Action : Ajouter E2E des parcours clés, attentes métier explicites, défilement des contenus Reveal, mobile/dark, simulation du runtime et des pannes ; distinguer budget anti-régression et CWV.
- Réception : Chaque défaut confirmé obtient un test rouge avant correction ; tests axe ne s’exécutent plus sur un fallback incomplet.
- Effort relatif : **M**. Point d’entrée : [tests/a11y.test.mjs](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/tests/a11y.test.mjs:114>).

### F27 · P2 · État déployé

Une route publique attendue diverge de la configuration locale.

- Action : Comparer commit/configuration du déploiement actif, règles CDN et rewrites, puis vérifier le comportement voulu sans utiliser de vrais jetons.
- Réception : GET sans token renvoie une page préférences invalide explicite et non une 404 ; route valide testée en staging avec faux compte.
- Effort relatif : **M**. Point d’entrée : [vercel.json](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/vercel.json:664>).

### F33 · P2 · Compatibilité d’environnement

La version Node annoncée est trop permissive.

- Action : Déclarer une plage compatible, verrouiller/versionner le runtime choisi en local/CI/Vercel et vérifier installation propre.
- Réception : npm ci + lint + build + tests sur la plus ancienne version officiellement supportée.
- Effort relatif : **S**. Point d’entrée : [package.json](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/package.json:6>).

## Lot 6 — Fiabilisation éditoriale et maintenance

Responsables suggérés : Éditorial + frontend + exploitation.

F22/F23/F36 sont P2 ; les autres sont P3. Ne pas utiliser ces améliorations pour retarder les corrections P1.

### F22 · P2 · SEO et intégrité bibliographique

Le schéma et llms.txt surévaluent le corpus scientifique.

- Action : Compter/typer par nature réelle de contenu et construire chaque schéma sur la collection affichée.
- Réception : 16 publications plus un blog explicitement distingués, données structurées et compteurs cohérents sur toutes les pages.
- Effort relatif : **S**. Point d’entrée : [src/seo/meta.ts](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/src/seo/meta.ts:941>).

### F23 · P2 · Internationalisation éditoriale

Plusieurs modules anglais affichent des chaînes françaises.

- Action : Typer les libellés en Record<Lang,string>, traduire toutes les valeurs et exporter dans la langue choisie.
- Réception : Revue des modules et exports en EN, tests vérifiant que les libellés FR ne sont pas injectés.
- Effort relatif : **M**. Point d’entrée : [src/data/genomics.ts](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/src/data/genomics.ts:10>).

### F36 · P2 · Exactitude institutionnelle

Le développement du sigle AIRID est erroné.

- Action : Corriger FR/EN, régénérer agenda/ICS et vérifier les autres noms propres et affiliations avec leurs sources.
- Réception : Libellés conformes à la source officielle sur la page et les exports.
- Effort relatif : **S**. Point d’entrée : [src/data/agenda.ts](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/src/data/agenda.ts:44>).

### F28 · P3 · Robots et politique IA

Les règles IA servies par le CDN et celles du dépôt sont contradictoires.

- Action : Choisir une politique unique, synchroniser CDN/code et reporter les exclusions métier nécessaires dans les groupes concernés.
- Réception : Vérification des règles réellement servies avec jeux d’URL publics/privés et agents concernés.
- Effort relatif : **S**. Point d’entrée : [public/robots.txt](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/public/robots.txt:5>).

### F29 · P3 · SEO technique

La fraîcheur du sitemap et la sélection des pages techniques sont perfectibles.

- Action : Date de modification éditoriale explicite, sans mise à jour artificielle ; exclure offline du sitemap et le passer noindex tout en gardant son cache.
- Réception : Build sans changement éditorial ne change pas lastmod ; sitemap sans pages de secours.
- Effort relatif : **S**. Point d’entrée : [src/seo/meta.ts](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/src/seo/meta.ts:1764>).

### F30 · P3 · Métadonnées de navigation

Les balises citation_* restent celles de la page chargée initialement.

- Action : Mettre à jour et supprimer les balises de citation avec les autres métadonnées ; compléter les coauteurs.
- Réception : Navigation article A → B → accueil : citations de B puis absence de citations non pertinentes.
- Effort relatif : **S**. Point d’entrée : [src/components/Seo.tsx](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/src/components/Seo.tsx>).

### F32 · P3 · Architecture et maintenabilité

Les variantes serveur/client et les helpers dupliqués augmentent le risque de divergence.

- Action : Factoriser les arbres avec composants injectés ; centraliser les helpers compilables ; évaluer une hydratation compatible plutôt qu’une migration automatique.
- Réception : Tests de parité contenu SSR/client, un seul contrat de tokens/guards, mesure avant/après tout changement de rendu.
- Effort relatif : **M**. Point d’entrée : [src/entry-server.tsx](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/src/entry-server.tsx:4>).

### F35 · P3 · Documentation et exploitation

Plusieurs passages du README ne décrivent plus le comportement courant.

- Action : Mettre à jour le runbook à partir des contrats réels, inventorier sauvegarde/restauration KV, rotation des secrets et contrôle post-déploiement.
- Réception : Un tiers peut installer et diagnostiquer la plateforme depuis les instructions sans hypothèses implicites.
- Effort relatif : **S**. Point d’entrée : [README.md](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/README.md:1>).

### F37 · P3 · Contrat du formulaire

Le message est tronqué/normalisé côté serveur sans limites équivalentes dans l’UI.

- Action : Préserver les retours à la ligne du message, rejeter ou signaler les dépassements et partager les limites ; transmettre la langue pour l’accusé de réception.
- Réception : Message multiligne intact et test aux limites ; aucun tronquage silencieux ; accusé FR/EN cohérent.
- Effort relatif : **S**. Point d’entrée : [api/contact.ts](<D:/Studio26/Portfolio/Dr Seynude Dagnon/site-dr-dagnon/api/contact.ts:54>).


## Garde-fous d’exécution

1. Partir de l’état courant en préservant les modifications préexistantes et clarifier leur périmètre avant de découper les correctifs.
2. Créer les tests de reproduction avant chaque fix et limiter les changements à un groupe cohérent.
3. Utiliser un stockage et des destinataires de staging distincts. Ne jamais faire un test de panne sur la newsletter réelle.
4. Ne pas lancer le script global actuel de build/test avec des secrets de production : il comporte des effets externes.
5. Vérifier lint, typecheck, génération des 130 pages et suite complète après chaque lot.
6. Après autorisation de déploiement, valider les routes, en-têtes, contenus et parcours avec un compte de test ; prévoir le rollback.
7. Mettre à jour la documentation et les critères de réception en même temps que les contrats modifiés.

## Matrice minimale de réception

| Scénario | Résultat exigé |
|---|---|
| Contact FR/EN | Validation claire ; message multiligne complet ; accusé cohérent |
| Vérification du téléphone | Code réel de 10 caractères saisissable ; faux/expiré rejeté |
| Préférences newsletter | JSON objet accepté ; jetons préservés en FR/EN ; rubriques sauvegardées |
| Désinscription + panne KV | Pas de faux succès ; reprise possible |
| Désinscription + ancien lien | Pas de réinscription sans nouvelle demande explicite |
| Consentement | Acceptation, refus et retrait pilotent les traitements annoncés |
| Stockage navigateur bloqué | Aucune page blanche, fonctionnalités essentielles disponibles |
| Rendez-vous | Date, heure et fuseau transmis au formulaire |
| Accessibilité | Contrôles nommés/état exposé ; contrastes AA ; focus et clavier testés |
| Mobile | 320, 360, 390 et 768 px : pas de chevauchement ; zoom et deux langues |
| Scientificité | Chaque série/paramètre/recommandation a une source ou un statut démonstratif visible |
| Envoi partiellement échoué | Reprise sans doublonner les destinataires déjà traités |
| Deux jobs concurrents | Un seul envoi logique par destinataire/contenu |
| Fréquences de newsletter | Pas de contenu manqué pour mensuels ; pas de rythme hebdo dépassé |
| API dépendance lente / 429 / 500 | Durée bornée, erreur explicite, retry maîtrisé |
| SW et nouvelle version | PDF/image actualisé même sans changement JS ; offline cohérent |
| Podcast | Fichier audio lisible derrière chaque enclosure ; flux linguistique honnête |
| Build / CI | Aucun envoi réel ou IndexNow ; runtime déclaré compatible |
| Déploiement | Version active et configuration identifiées, vraie 404 et préférences accessibles |

## Vérifications nécessitant vos accès ou une validation métier

- Vercel/Cloudflare : commit actif, règles de routage, protections et régions.
- Resend/domaine email : SPF, DKIM, DMARC, quotas, délivrabilité et gestion des rebonds.
- Upstash/KV : contenu/rétention, sauvegarde, restauration et consommation.
- Search Console / analytics : indexation effective, trafic, conversion, CWV terrain.
- Responsable scientifique : sources, modèles, interprétations, affiliations et références institutionnelles.
- Référent juridique : territoires concernés, bases légales, sous-traitants, transferts et droits de réutilisation.
- QA accessibilité : lecteurs d’écran, documents PDF, sous-titrage, transcriptions et appareils réels.

## Définition de « terminé »

Les correctifs sont considérés comme terminés lorsque leurs critères de réception sont vérifiés, que les nouveaux tests reproduisent les anciennes défaillances, que la CI est verte, que les responsables scientifiques/confidentialité ont approuvé les éléments qui les concernent et qu’un contrôle de l’environnement déployé autorisé confirme la cohérence. Une simple hausse du nombre de tests ou d’un score SEO ne suffit pas.
