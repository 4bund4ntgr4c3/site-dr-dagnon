# Plan de validation — 5 septembre 2026

**État :** corrections locales validées par build, lint, 138 tests de contrats et 14 contrôles navigateur ciblés. Publication et réception HTTP de production encore à effectuer.

## 1. Livraison des correctifs locaux

**P1, faible effort.** Après validation locale, livrer les corrections de réécriture, les six fichiers privés noindex et les deux corrections d’accessibilité.

Réception sur le domaine public : `/admin`, `/fr/admin`, `/changelog`, `/fr/changelog`, `/newsletter/preferences` et `/fr/newsletter/preferences` doivent répondre HTTP 200, avec `noindex` dans le HTML initial. Une adresse inconnue doit rester en 404. Les 130 pages du sitemap doivent rester en 200. Les pages privées ne doivent pas entrer dans le sitemap.

## 2. Contrôles après livraison

**P2, faible effort.** Relancer `scripts/audit-production.mjs` dans un nouveau dossier. Vérifier la disparition des erreurs de contraste LinkedIn et du repère manquant pour les cookies. Comparer le robots.txt public au fichier du dépôt et au bloc injecté par Cloudflare pour obtenir une politique cohérente.

## 3. Validation transactionnelle contrôlée

**P1 pour déclarer tous les parcours opérationnels, dépend d’un destinataire de test et de la configuration serveur.** Tester contact, réception du code de téléphone, abonnement confirmé, sauvegarde des préférences et désinscription sur une adresse de test autorisée. Vérifier les erreurs temporaires de KV et de messagerie dans l’environnement de validation. Aucun de ces envois n’a été réalisé dans cet audit.

## 4. Performance

**P2, effort moyen.** Refaire les mesures sans suite de tests concurrente, avec plusieurs passes desktop et mobile, puis consulter les données terrain disponibles. Les observations de cette passe ne suffisent pas à annoncer un succès ou un échec Core Web Vitals. PageSpeed a été bloqué par son quota.

## 5. Suivi documentaire

Conserver l’audit initial comme historique, les preuves datées de production et la version exacte livrée. Réutiliser les critères de réception ci-dessus pour les futures livraisons. La revue juridique et scientifique reste du ressort des responsables concernés.
