# Audit de production — seynudedagnon.com

Audit technique multi-pages réalisé dans la nuit du 4 au 5 septembre 2026 (Europe/Berlin). Périmètre : HTTP sur les 130 URL du sitemap et les points d’entrée privés, métadonnées HTML, disponibilité des flux, navigateur Chromium mobile, consentement, changement de langue et service worker. Ce complément ne remplace pas la revue scientifique ou éditoriale de l’audit initial.

## Résultat

Les **130 URL du sitemap répondent HTTP 200**. Chacune présente un titre H1 unique, une canonical et du JSON-LD, sans directive noindex dans le HTML collecté. Les six points d’entrée privés répondent encore **404 en production**. Les corrections de routage et d’accessibilité sont préparées localement, sans publication pendant cette reprise. Une validation après déploiement reste nécessaire.

Les trois priorités sont le rétablissement des routes privées, le contraste des dates LinkedIn et la synchronisation du robots.txt servi avec celui du dépôt. Les opportunités suivantes sont un audit reproductible après chaque livraison, une mesure de performance isolée et un test de livraison des communications sur des destinataires de test autorisés.

Pas de note globale : l’absence de données terrain et de tests transactionnels réels rendrait cette note trompeuse.

## Constats vérifiés

| ID / domaine | Sévérité | Confiance | Constat et preuve | Impact et correction |
|---|---|---|---|---|
| P01 — Routage | Warning, priorité fonctionnelle P1 | Confirmed | `/admin`, `/fr/admin`, `/changelog`, `/fr/changelog`, `/newsletter/preferences`, `/fr/newsletter/preferences` répondent 404. Le fichier Vercel contient `cleanUrls: true` avec des destinations en `.html`. | Accès direct défaillant, notamment depuis les liens de préférences. Omettre `.html` dans les destinations et produire six fichiers de démarrage localisés et noindex. Correctif local. |
| P02 — Contraste | Warning, P2 | Confirmed | Axe sur `/` et `/fr`, à 390 × 844 : trois dates du composant LinkedIn ont un contraste de 3,98:1 au lieu du minimum attendu de 4,5:1 pour ce texte de 12 px. | Lecture difficile. Opacité du texte augmentée de 60 % à 75 %. Correctif local. |
| P03 — Repères accessibles | Warning, P2 | Confirmed | Axe signale le texte du bandeau de cookies hors des repères de page sur les sept pages échantillonnées. | Navigation moins claire avec les technologies d’assistance. Ajout d’une région nommée en FR/EN. Correctif local. |
| P04 — Politique des robots | Warning, P2 | Confirmed | Le robots.txt public comporte des groupes Cloudflare `Disallow: /` et des groupes du site `Allow: /` pour les mêmes robots, alors que le fichier local interdit déjà plusieurs robots d’entraînement. | Politique incohérente et dépendante de l’interprétation des robots. Publier la version locale puis contrôler le résultat combiné avec Cloudflare. Ne pas prendre l’analyse simplifiée du script pour une preuve de blocage effectif. |
| P05 — Performance | Info | Confirmed pour les mesures, Hypothesis pour l’expérience terrain | Les LCP de cette passe Chromium vont de 3,15 à 6,42 s sur les six pages publiques échantillonnées ; CLS de 0 à 0,0771. Mesures sans limitation réseau, pendant d’autres vérifications locales. | Signal à investiguer. Refaire des mesures isolées et obtenir les données terrain avant d’attribuer ces temps au seul site. Aucun verdict Core Web Vitals. |
| V01 — Indexabilité | Pass | Confirmed | Les 130 URL déclarées au sitemap répondent 200 ; l’URL inexistante `/audit-missing-route` répond 404 ; `/en/contact` redirige en 308 vers `/contact`. | Maintenir ces contrôles après livraison. |
| V02 — Consentement | Pass | Confirmed | Aucun appel aux services Analytics observé avant choix ou après refus. Après acceptation : chargement de Google Tag Manager, Vercel Insights et Speed Insights ; stockage `consent-analytics=granted`. | Parcours observé conforme au fonctionnement prévu. Cela ne certifie pas la conformité juridique ni tous les scénarios de retrait du consentement. |
| V03 — Langue | Pass | Confirmed | Le passage à FR conserve `?email=reader%40example.test&token=audit-invalid#settings` sur `/fr/contact`. | Les paramètres nécessaires aux liens signés survivent au changement de langue. |
| V04 — Sécurité HTTP | Pass | Confirmed | HTTPS, HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy et Permissions-Policy présents sur l’accueil. | Vérification des en-têtes, sans prétendre à un audit de sécurité complet. |
| V05 — Mobile et PWA | Pass | Confirmed | Aucun débordement horizontal sur les sept pages à 390 px. Pas d’erreur JavaScript sur les six pages publiques testées. Service worker enregistré et contrôlant la page. | Bon état sur cet échantillon. Le mode hors ligne complet et les mises à jour entre deux versions ne sont pas certifiés par ce contrôle. |
| V06 — Flux | Pass | Confirmed | Sitemap, RSS, podcast, manifeste et service worker répondent 200. | La disponibilité ne prouve pas à elle seule la validité complète de chaque format ou la lecture intégrale des médias. |

La règle de réécriture est étayée par la [documentation Vercel pour Vite](https://vercel.com/docs/frameworks/frontend/vite) : quand `cleanUrls` est actif, les chemins de réécriture doivent omettre l’extension HTML.

## Mesures de laboratoire

Une seule observation par page, viewport 390 × 844, Chromium local, sans émulation d’un réseau mobile ni ralentissement CPU. Ces valeurs ne sont pas des percentiles de visiteurs réels.

| Page | LCP observé | CLS observé | Débordement horizontal |
|---|---:|---:|---|
| `/` | 6 416 ms | 0 | Non |
| `/fr` | 3 152 ms | 0,0771 | Non |
| `/contact` | 4 272 ms | 0,0001 | Non |
| `/fr/contact` | 4 224 ms | 0 | Non |
| `/publications` | 3 776 ms | 0 | Non |
| `/impact` | 6 036 ms | 0 | Non |

## Correctifs et validation locale

- `vercel.json` : destinations HTML sans extension ; routage propre à chaque page privée.
- `scripts/prerender.mjs` : six fichiers de démarrage FR/EN avec racine React vide, métadonnées localisées et `noindex`, sans contenu privé, canonical ou JSON-LD.
- `tests/prerender.test.mjs` : vérification des destinations selon `cleanUrls` et des fichiers privés, hors sitemap.
- `src/components/LinkedinFeed.tsx` : contraste des dates.
- `src/components/ConsentBanner.tsx` : région accessible nommée.
- `scripts/audit-production.mjs` : collecte reproductible, sauvegarde progressive et limites explicites ; aucun formulaire envoyé.

Résultats finaux de validation locale :

- `npm run build` : réussi, 130 pages publiques et six fichiers privés de démarrage.
- `npm run lint` : réussi, aucune erreur.
- Suites ciblées pré-rendu, routage, contact, préférences et envoi newsletter avec services simulés : **138/138**.
- Contrôles navigateur ciblés : **14/14**, couvrant les accueils FR/EN en mobile, les six pages privées, `/collaborate`, `/fr/accessibility`, stockage bloqué, consentement et préservation des paramètres de langue.
- La première passe complète avait donné **406/408** : deux échecs de contraste sur des éléments en cours d’animation. Le contrôle isolé de `/collaborate` passait déjà. Le test attend désormais le chargement, les polices et la fin des animations finies ; les deux pages passent à la dernière vérification. La suite complète n’a pas été relancée après ces changements : les chiffres 138 et 14 désignent les vérifications ciblées finales.
- Les budgets de performance locaux existants passent dans la première suite complète ; ce résultat ne vaut pas validation des Core Web Vitals en production.
- `git diff --check` : réussi. Quatre constats d’anomalies soumis au vérificateur de la compétence SEO, quatre conservés sans doublon.

## Limites et suivis

- Le lecteur web refuse le domaine ; HTTP direct et Chromium ont fourni les preuves. Ce refus de l’outil n’est pas un défaut du site.
- PageSpeed Insights a retourné une limite de quota. Aucune donnée CrUX, INP terrain ou note Lighthouse exploitable n’a été obtenue.
- Contact et préférences : affichage inspecté, mais aucun message réel, abonnement réel ou modification de préférences d’un abonné n’a été envoyé. La livraison Resend et la configuration KV/Upstash nécessitent un environnement de test autorisé.
- Le changement de routage n’a pas encore été exécuté par Vercel en production. Le build et les tests locaux ne remplacent pas les six requêtes HTTP de réception après déploiement.
- Aucune configuration Cloudflare, Vercel ou secret de production n’a été modifié.

## Preuves et reproduction

Collecte : `node scripts/audit-production.mjs <dossier-sortie>`.

- [Données HTTP et navigateur](<C:/Users/Studio26/.codex/visualizations/2026/09/04/01a06ea0-c585-7e03-afc5-3e064ac1e5f4/production/audit.json>)
- [Capture mobile FR](<C:/Users/Studio26/.codex/visualizations/2026/09/04/01a06ea0-c585-7e03-afc5-3e064ac1e5f4/production/_fr-mobile.png>)
- [Capture bureau](<C:/Users/Studio26/.codex/visualizations/2026/09/04/01a06ea0-c585-7e03-afc5-3e064ac1e5f4/production/home-desktop.png>)
- [En-têtes de sécurité](<C:/Users/Studio26/.codex/visualizations/2026/09/04/01a06ea0-c585-7e03-afc5-3e064ac1e5f4/production/security_headers.txt>)
- [Limite PageSpeed](<C:/Users/Studio26/.codex/visualizations/2026/09/04/01a06ea0-c585-7e03-afc5-3e064ac1e5f4/production/pagespeed.txt>)
- [Validation navigateur finale](<C:/Users/Studio26/.codex/visualizations/2026/09/04/01a06ea0-c585-7e03-afc5-3e064ac1e5f4/production/audit-final-browser.log>)
- [Validation des contrats finale](<C:/Users/Studio26/.codex/visualizations/2026/09/04/01a06ea0-c585-7e03-afc5-3e064ac1e5f4/production/audit-final-contracts.log>)
