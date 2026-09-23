# Schema / Structured Data — seynudedagnon.com

## What works
- Home: `Person+Physician` (with `@id …/#person`, honorifics, 60+ `alternateName` variants, `worksFor` Gates Foundation, `alumniOf` ×3 with Wikipedia `sameAs`, `hasOccupation` ×2, `knowsLanguage`, `award` ×3, `knowsAbout` with 14 Wikidata `DefinedTerm` links), `WebSite` (publisher → `#person`), `BreadcrumbList`. Validated live 2026-09-06.
- Across 137 files: Person+Physician ×131, WebSite ×131, BreadcrumbList ×130, CollectionPage ×36, ContactPage ×2, ProfilePage ×2 (CV), WebPage ×4, ImageObject ×52, FAQPage ×2 (presse), Article ×20 (tribunes/projets), PodcastEpisode ×2.
- Authoritative `sameAs`: ORCID, Scholar, Wikidata, LinkedIn, YouTube, Facebook, X. No fake `SearchAction` (correctly omitted — filters are client-side state, not URL-addressable).

## Re-audit delta (2026-09-06)
- **IMPROVEMENT (live in dist): entity-graph linking via uncommitted `src/seo/meta.ts`.** `Person` and `WebSite` now carry `@id` (`…/#person`, `…/#website`); `WebSite.publisher` → `#person`; article/project authors reference `#person` by `@id`; tribunes/projets emit `Article @id={url}#article` + `isPartOf` → `#website`. Verified in `dist/index.html` (`person_id=true`). This converts flat blocks into a linked knowledge graph — the single biggest schema upgrade available to the site.
- `@graph` validity note unchanged.

## Findings
1. **[Info] `@graph` blocks flagged as "missing @type" by naive parsers are valid.** Media index pages wrap CollectionPage + ItemList in `@graph`; the top-level node has no `@type` by design. No action — keep, and validate with Schema.org / Rich Results Test rather than regex audits.
2. **[Low] Add `inLanguage` consistently on Article/CollectionPage photo nodes** (home WebSite already uses `inLanguage: [lang]`). Cheap win for FR/EN disambiguation in AI citation.
3. **[Low] Consider `LearningResource`/`HowTo` on `/toolkit` protocols** (LLIN, G2G, DHIS2, SMC) once the counter and thin-content fixes land — matches the page's how-to intent better than generic WebPage.
