# AI Search Readiness (GEO) — seynudedagnon.com

## What works
- `llms.txt` is excellent: title, description, EN/FR notice, ORCID/Scholar/Wikidata, citation format with name variants, full content map, feeds/sitemap/ICS/IndexNow key, "no JS required" note, hreflang guidance. Served at `/llms.txt` and `/.well-known/llms.txt`.
- AI-friendly architecture: full prerender, semantic headings, BreadcrumbList, FAQPage, Article with DOI links, Wikidata `DefinedTerm` grounding, `sameAs` identity cluster, `Content-Signal: search=yes,ai-train=no` on live robots (allows citation/grounding, reserves training rights under EU 2019/790).
- Brand-variant coverage (60+ `alternateName` incl. ASCII transliterations) directly addresses the Seynudé/Seynude/Fortuné/Fortune fragmentation.

## Re-audit delta (2026-09-06)
- **IMPROVEMENT: live `llms.txt` gained a `# Links` section** (10 absolute markdown links; `dist/llms.txt` 4,555→5,043 B, in sync with `public/`).
- **REGRESSION RISK: working-tree `public/robots.txt` re-allows training crawlers** while live edge + `Content-Signal: ai-train=no` block them. Net AI-readiness unchanged (gains cancel the risk until the policy is settled) — resolving finding #1 is now deploy-blocking.

## Findings
1. **[High] Robots vs llms.txt contradiction (same as Technical #1).** Live robots Disallow GPTBot/ClaudeBot/CCBot/Google-Extended for crawl; `llms.txt` says `Allow:` the same bots. Crawlers that honor robots will never fetch what `llms.txt` invites them to read. Recommendation: align to the `Content-Signal` intent — e.g. keep training-crawl Disallow, explicitly Allow `OAI-SearchBot`, `ChatGPT-User`, `PerplexityBot`, `Applebot`, and rewrite `llms.txt` Permissions to describe *retrieval/citation* permission (which lives outside robots) separately from *crawl* permission.
2. **[Low] Podcast discoverability.** `podcast.xml` has 1 episode, `language: en`, single 1.6 KB channel. Recommendation: add FR episodes/entries or a `podcast-fr.xml` already referenced by the FR page (`/podcast-fr.xml` link exists — verify it is generated and submitted), plus `<podcast:transcript>` or show-notes links to tribunes for citability.
3. **[Info] No `seo-geo` blocker.** Every page readable without JS; paraphrase-with-link guidance in `llms.txt` is the right granularity for op-eds.
