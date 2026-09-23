# Content Quality (E-E-A-T, readability, thin content) — seynudedagnon.com

Business type detected: **personal thought-leadership portfolio** (physician + malaria program leader; academic publications + case studies + op-eds). Not local-service, not e-commerce — `seo-local`/`seo-maps`/`seo-ecommerce` not applicable. Content-strategy signals present (tribunes, publications, projets pillars) — cluster/SXO covered inline.

## What works
- Strong E-E-A-T: named author with MD/MPH/PhD-track credentials, ORCID, Google Scholar, Wikidata Q141154548, Gates/USAID/PMI roles, awards (PMI FSN 2020, USAID LES 2019, 2025 recognition), press kit + FAQPage JSON-LD, 16 research publications explicitly distinguished from 1 blog article, 7 case studies with measurable outcomes (35%→94% HMIS, $3M G2G savings, 1,114 facilities).
- Bilingual EN/FR with real translations (not query-param), `x-default` → EN.
- RSS (33 items), podcast RSS, ICS agenda, BibTeX/RIS/APA exports, press kit assets.

## Re-audit delta (2026-09-06)
- Counters still prerender as `>0<` ×4; thin-gallery (26 pages), short-titles (4), stale `/media/conference` lastmod all unchanged.
- **IMPROVEMENT (in src, not yet built): uncommitted `src/data/legal.ts` adds a bilingual medical-disclaimer section** (portfolio scope, no individual medical advice, consult a licensed physician). Strong YMYL/E-E-A-T signal — but `dist/legal/index.html` does not contain it yet. Rebuild (`npm run build`) and verify before claiming the win.

## Findings
1. **[High] Animated impact stats prerender as "0".** Static EN home contains `>0<` ×4 in the stats band (live FR markdown renders "0+ années d'expérience", "0 publications de recherche", "0 centres de santé couverts", "0 pays PMI"). Hero badges (17+, 27) prerender correctly, so this is the JS count-up component initializing at zero. Crawlers, unfurlers, and AI extractors that read static HTML see "0 publications / 0 centers". Recommendation: prerender final values in `scripts/prerender.mjs` (or server-render the end state with animation as progressive enhancement) and keep a `<noscript>`-visible value.
2. **[Medium] Thin single-photo gallery pages at scale.** 26 community photo pages (`/media/community/*`, priority 0.4) = ~40% of indexable URLs. Each is one image + caption (good `PHOTO_DIMS`, unique titles). Risk: Panda-style thin-content dilution. Recommendation: add 150+ words of unique context per page (event, date, role, outcome + 2–3 internal links to related tribune/projet), starting with the 5 highest-impression pages; keep `priority 0.4`.
3. **[Medium] Short/weak titles on 4 pages** (<30 chars decoded): `Changelog — Seynudé Dagnon` (noindex, ignore), `Dr. Dagnon avec les lauréats`, `Dr. Dagnon official portrait`, `Speech by patron Dr. Dagnon`. Recommendation: expand photo titles to ~45–55 chars with event + year (e.g. "Génies en Herbe 2025 — Dr. Dagnon with laureates").
4. **[Low] Stale `lastmod`.** `/media/conference` shows `2024-04-25` while siblings are 2026. If accurate, fine; otherwise refresh on content change so crawlers reprioritize correctly.
5. **[Info] No duplicate titles or over-long descriptions.** 0 duplicate `<title>`, 0 titles >60 chars, 0 descriptions >160 chars across 137 files — keep the `src/seo/meta.ts` single-source-of-truth workflow.
