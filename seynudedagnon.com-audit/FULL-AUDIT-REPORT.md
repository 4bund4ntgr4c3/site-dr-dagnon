# FULL AUDIT REPORT — seynudedagnon.com (re-audit 2026-09-06)

**Health score: 84/100** (prior: 83) · Business type: **personal thought-leadership portfolio** (physician + malaria program leader)
Method: repo build inspection (`dist/` 137 HTML files, sitemap, robots, `vercel.json`, `src/seo/meta.ts`, `public/`) + live fetches (`/robots.txt`, `/llms.txt`) + working-tree diff vs HEAD. No GSC/CrUX/DataForSEO credentials — performance is lab-observation only, backlinks/SERP not measured. `bin/claude-seo` helpers are not installed, so all specialist tracks ran inline; evidence files live in `findings/`.

## Executive summary
No indexation blocker. Since the prior audit, the working tree gained real SEO improvements — JSON-LD entity-graph linking (`@id` person/website/articles, live in `dist/`), Google Scholar `citation_*` meta on publication pages (5 tags, live in `dist/`), hero WebP re-encode (−18%), dropped YouTube preconnect, `llms.txt` link section, and a bilingual medical disclaimer (in `src/`, **not yet built into `dist/`**). Counterweight: an **uncommitted `public/robots.txt` flip back to Allow-all AI bots** that contradicts HEAD, the live Cloudflare edge block, and `Content-Signal: ai-train=no` — deploy-blocking until the AI-crawl policy is settled. Scores move net +1.

Top findings and quick wins are in `audit-data.json` summary and `ACTION-PLAN.md`. Per-category detail: `findings/technical.md`, `findings/content.md`, `findings/onpage.md`, `findings/schema.md`, `findings/performance.md`, `findings/images.md`, `findings/ai-readiness.md`, `findings/sxo-cluster.md`.

## Scores (weights per spec)
| Category | Score | Weight | Contribution |
|---|---|---|---|
| Technical SEO | 87 | 22% | 19.14 |
| Content Quality | 79 | 23% | 18.17 |
| On-Page SEO | 86 | 20% | 17.20 |
| Schema / Structured Data | 93 | 10% | 9.30 |
| Performance (CWV, lab only) | 76 | 10% | 7.60 |
| AI Search Readiness | 80 | 10% | 8.00 |
| Images | 89 | 5% | 4.45 |
| **Total** | | | **≈84** |

## Technical SEO (87, −1)
Sitemap: 130 URLs, 0 missing files, hreflang fr/en/x-default on every entry (390 alternates), 18 distinct `lastmod`. Canonical/H1 100% on indexable pages (7 canon-less pages are intentional `noindex` shells). Prerender complete (EN home 176,070 bytes, unchanged). `vercel.json` hardening unchanged. Change since last audit: HEAD `public/robots.txt` had aligned with live (Disallow training crawlers); the working tree flips back to Allow-all (+Applebot), and `dist/robots.txt` already carries the flipped copy — so the next deploy ships the contradiction (repo-allow vs edge-disallow vs `ai-train=no`). New `scripts/audit-production.mjs` + `reports/` observed — adopt for HTTP-evidence captures. `/offline` indexed+sitemapped and `/publications-pdf` duplicate findings stand. Detail: `findings/technical.md`.

## Content Quality (79, +1)
E-E-A-T strong (ORCID/Scholar/Wikidata, Gates/USAID/PMI, awards, 16 papers vs 1 blog, 7 quantified case studies, press kit + FAQ). Plus: bilingual medical disclaimer added in `src/data/legal.ts` (YMYL trust signal) — pending `npm run build` (`dist/legal` lacks it). Unchanged issues: animated stats prerender as `>0<` ×4 (High); 26 thin photo pages (Medium); 3 short photo titles (Medium); stale `/media/conference` lastmod (Low). Zero dup titles, zero >60-char titles, zero >160-char descriptions. Detail: `findings/content.md`.

## On-Page SEO (86, +1)
Unchanged base: ~50-char titles, ~150-char descriptions, canonical + hreflang + OG/Twitter + RSS, single H1 + 11 H2, 108 internal links, `/en→/` correct. Plus: 5× Scholar `citation_*` meta tags live on `/publications` (author/title/URL/date/language). Next: add per-paper `citation_doi` where DOIs render. Residual: obsolete `keywords` + `geo.*`/`ICBM` bloat (Low). Detail: `findings/onpage.md`.

## Schema (93, +1)
Entity-graph upgrade live in `dist/`: `@id` on Person (`…/#person`) and WebSite (`…/#website`), `publisher` → `#person`, authors by `@id`, `Article @id={url}#article` + `isPartOf` → `#website` on tribunes/projets. Base unchanged: Person+Physician ×131 (60+ name variants, Wikidata DefinedTerms), WebSite ×131, Breadcrumb ×130, Collection ×36, Article ×20, FAQ ×2, PodcastEpisode ×2; no fake SearchAction; `@graph` wrappers valid. Next: consistent `inLanguage` on Article nodes; `LearningResource` for `/toolkit`. Detail: `findings/schema.md`.

## Performance (76, +1, lab only)
Hero −18%/−15%, YouTube preconnect removed. Unchanged: index 219,690 B, react-dom 184,037 B, motion still bundled (134,096 B), CSS 88,018 B, assets total 1.37 MB — hydration/INP finding stands. No field data; score capped until CrUX/GSC wired. Detail: `findings/performance.md`.

## Images (89, +1)
Hero re-encode measured; 0 missing alt on all sampled pages; `PHOTO_DIMS` + per-page OG images intact. Residual: YouTube posters bypass pipeline; CV/publications/projets render 0 `<img>`. Detail: `findings/images.md`.

## AI Search Readiness (80, unchanged)
`llms.txt` improved (+Links section, 5,043 B, public/dist in sync) but the working-tree robots flip cancels the gain until policy is settled — still the top AI finding and now deploy-blocking. Podcast RSS still single-EN-episode. Detail: `findings/ai-readiness.md`.

## SXO + Clusters
Unchanged: intents map cleanly (≤3 clicks, no page-type mismatch); hubs `/projets` (7), `/tribunes` (3), `/publications` (16+1), `/media` (5→26). Gaps stand: sideways links on photo leaves; `/toolkit` spoke field-notes. Detail: `findings/sxo-cluster.md`.

## Limitations
No backlink/SERP data (no Moz/Bing/DataForSEO creds), no CrUX/GSC/GA4 field data, no screenshots (run `node scripts/audit-production.mjs <outdir>` for HTTP evidence + captures). Crawl scope: 137 local prerendered files + live robots/llms fetches (within 500-page cap; robots respected). `dist/` is partially stale vs `src/` (legal disclaimer) — rebuild before relying on local evidence for `/legal`.
