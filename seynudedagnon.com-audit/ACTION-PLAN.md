# ACTION PLAN — seynudedagnon.com (Health 84, re-audit 2026-09-06)

Priority definitions: Critical = blocks indexing/penalty; High = significant ranking impact (1 week); Medium = 1 month; Low = backlog.

## No Critical issues. Do not invent any — indexation works.

## High (Week 1 — deploy-blocking first)
1. **Settle the AI-crawl policy BEFORE deploying.** Working-tree `public/robots.txt` (Allow-all) contradicts HEAD, live Cloudflare edge, and `Content-Signal: ai-train=no`. Decide (suggested: keep `ai-train=no`, allow search/citation bots), align repo + edge + `llms.txt` in one change, then deploy. Verify live: `curl -s https://seynudedagnon.com/robots.txt`.
2. **Prerender counter end-states** — `scripts/prerender.mjs`: render final stat values (17+ years, 16 publications +1 blog, 1,114 facilities, 27 countries) with count-up as enhancement. Verify: stats band contains no `>0<`; live text extraction shows real numbers.
3. **Rebuild + ship the src wins.** `npm run build` to carry the medical disclaimer (`src/data/legal.ts`) and confirm `citation_*`/`@id` output in `dist/`; then `npm test`. Verify: `dist/legal` contains `avertissement-m`; publications page keeps 5× `citation_*`.
4. **De-index `/offline`** — `noindex, follow`, remove from sitemap (same pattern as `admin`/`changelog`). Minutes.

## Medium (Month 1)
5. **Consolidate `/publications-pdf`** — canonical to `/publications` or noindex + drop from sitemap (note: it now shares the new `citation_*` block — deduplicate intentionally).
6. **Thicken gallery cluster** — 150+ words + 2–3 internal links on top-5 photo pages first, then remaining 21; add sideways "related tribune/projet" links.
7. **Cut hydration weight** — lazy-load `framer-motion` below fold (still 134 KB bundled), confirm lucide tree-shaking, defer `gtag.js`/Analytics, facade YouTube iframes + self-host WebP posters.
8. **Expand 3 short photo titles** to 45–55 chars (event + year); add per-paper `citation_doi` where DOIs render.

## Low (Backlog)
- Drop `meta keywords` + `geo.*`/`ICBM`; remove deprecated `apple-mobile-web-app-capable`.
- Grow `podcast.xml` (FR entries, transcripts → tribunes); clarify `/fr/feed.xml` language scope.
- Refresh `/media/conference` lastmod if stale; consider `LearningResource` schema for `/toolkit`.
- Add one figure + `ImageObject` to CV/publications/projet templates; consistent `inLanguage` on Article nodes.

## Verify after deploy
```bash
curl -s https://seynudedagnon.com/fr/contact | grep -o '<title>[^<]*</title>'
curl -sI https://seynudedagnon.com/sitemap.xml | grep -i content-type
curl -sI https://seynudedagnon.com/this-does-not-exist | head -1
curl -s https://seynudedagnon.com/robots.txt | head -30
node scripts/audit-production.mjs node_modules/.tmp/production-audit
```
Expected: FR contact title, `application/xml`, `HTTP/2 404`, settled robots policy, clean production audit.
