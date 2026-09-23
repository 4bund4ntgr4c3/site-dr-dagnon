# Technical SEO — seynudedagnon.com

Method: local `dist/` build inspection (137 prerendered HTML files, `dist/sitemap.xml`, `dist/robots.txt`, `vercel.json`) + live fetches of `/`, `/fr`, `/robots.txt`, `/sitemap.xml`, `/llms.txt` on 2026-09-06.

## What works
- 130 sitemap URLs, 0 missing prerendered files; every sitemap entry carries `hreflang fr/en/x-default` (390 alternates). `lastmod` has 18 distinct values (fresh: 2026-09-04).
- Canonical coverage 100% on indexable pages; the only 7 pages without canonical are intentional `noindex, follow` shells (`404`, `admin`, `changelog`, `newsletter/preferences` + FR variants). H1 coverage 100% on indexable pages for the same reason.
- Prerendered HTML is complete (EN home 176,070 bytes, full body, no JS required) — correct for link unfurlers and crawlers.
- `vercel.json` sets HSTS (2y, preload), `nosniff`, `DENY` framing, `same-origin` COOP, restrictive CSP, immutable caching for `/assets/*`, `max-age=0` for `/sw.js`, explicit 404 routing (no soft-404), and 21 permanent redirects (`/blog→/tribunes`, `/articles→/publications`, `/en/*→/*`, etc.).
- `robots.txt` blocks `/api/`, `/admin`, `/changelog`, `/newsletter/preferences` (+FR) and declares the sitemap. `security.txt` + `/.well-known/llms.txt` exist.

## Re-audit delta (2026-09-06)
- Sitemap still 130 URLs / 0 missing / 390 hreflang; canonical/H1 findings unchanged (7/6 all intentional `noindex` shells).
- **REGRESSION — uncommitted `public/robots.txt` flip.** HEAD matches live (Disallow training crawlers); the working tree re-allows GPTBot/ClaudeBot/Anthropic-AI/Google-Extended (+Applebot). `dist/robots.txt` already carries the flipped version, so the next deploy will push Allow-all to production while Cloudflare edge + `Content-Signal: ai-train=no` still block training crawls — a three-layer contradiction. Do not deploy as-is: decide the policy first (finding #1), then align repo + edge + llms.txt in one change.
- New `scripts/audit-production.mjs` (untracked) + `reports/` dir observed — use it for HTTP-evidence captures going forward.

## Findings
1. **[High] Live robots.txt contradicts repo robots.txt and llms.txt on AI crawlers.** `public/robots.txt` Allows GPTBot/ClaudeBot/CCBot/Google-Extended. Live `/robots.txt` prepends a Cloudflare Managed block (`Content-Signal: search=yes,ai-train=no`, Disallow for Amazonbot, Applebot-Extended, Bytespider, CCBot, ClaudeBot, Google-Extended, GPTBot, meta-externalagent) and the site section sets `GPTBot: Disallow`, `ClaudeBot: Disallow`, `Anthropic-AI: Disallow`, `Google-Extended: Disallow`, `CCBot: Disallow` while Allowing OAI-SearchBot, ChatGPT-User, PerplexityBot. `llms.txt` still says `Allow: GPTBot/ClaudeBot/CCBot/Bytespider`. Net effect is defensible (allow AI search/citation, block training) but the three layers disagree. Recommendation: decide the policy explicitly (suggested: keep `ai-train=no`, allow search/citation bots), then make `public/robots.txt`, Cloudflare rules, and `llms.txt` say the same thing; document the intent in `llms.txt` Notes.
2. **[High] `/offline` is indexed and sitemapped.** `dist/offline/index.html` is `index, follow` with canonical and is in the sitemap (priority 0.3). It is a PWA utility page, not a search destination. Recommendation: `noindex, follow` + remove from sitemap (same treatment as `admin`/`changelog`).
3. **[Medium] `/publications-pdf` vs `/publications` near-duplicate.** Both indexed with distinct but overlapping titles (`Publications (PDF) — Dr. Dagnon` vs `Scientific Publications — …`). If the PDF page is a print view, canonicalize it to `/publications` or `noindex` it and drop from sitemap to consolidate signals.
4. **[Medium] Sitemap includes other utility pages** (`/legal`, `/accessibility`, `/offline` at priority 0.3/yearly). Legal/accessibility are fine to index once, but keep them at low priority and ensure they are not counted as content pillars.
5. **[Info] Feed i18n.** `/fr/feed.xml` rewrites to the same `/feed.xml` (mixed EN/FR, `FEED_HAS_FR=true`, 33 items). Acceptable, but either filter by language or note it in `llms.txt`/page copy so FR subscribers know what to expect.
