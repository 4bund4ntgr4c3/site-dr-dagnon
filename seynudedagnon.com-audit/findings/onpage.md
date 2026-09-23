# On-Page SEO — seynudedagnon.com

Sample: `dist/index.html`, `dist/fr/index.html`, `dist/projets/digitalisation-milda-benin/index.html`, `dist/contact/index.html`, plus full 137-file title/description scan.

## What works
- EN home: `Dr. Seynudé Dagnon — Public Health & Malaria Leader` (~50 chars), description ~150 chars, canonical `https://seynudedagnon.com/`, 3 hreflang links, OG + Twitter large-image complete (1200×630 + alt), RSS alternate, `robots index,follow`, viewport, `lang`, skip-link + `<main>`, single H1 + 11 H2, 108 links (strong internal linking).
- FR home mirrors correctly: canonical `/fr`, hreflang fr/en/x-default, `og:locale fr_FR`.
- Deep pages carry canonical + 3 hreflang + per-page OG images (tribunes/projets have `.en.jpg`/`.fr.jpg` variants).
- Heading and meta hygiene: 0 missing titles, 0 missing descriptions, 0 duplicate titles across 137 files.

## Re-audit delta (2026-09-06)
- **IMPROVEMENT (live in dist): 5× `citation_*` Scholar meta tags on `/publications`** (`citation_author=Dagnon, Seynudé Jean-Fortuné`, `citation_title`, `citation_public_url`, `citation_publication_date=2026/09/01`, `citation_language`), applied to publications/bibliography/publications-pdf via uncommitted `src/seo/meta.ts`. Genuine scholarly-indexing win — keep and extend `citation_doi` per paper if DOIs render on the page.
- Title/description hygiene unchanged (0 dup, 0 >60, 0 >160).

## Findings
1. **[Low] Obsolete meta tags (bloat, not penalty).** `meta[name=keywords]` on every page and `geo.region/geo.placename/geo.position/ICBM` on home. Google ignores both. Recommendation: drop `keywords`; keep at most one `geo` signal or move location into JSON-LD `address` (already present).
2. **[Low] `apple-mobile-web-app-capable` is deprecated** (kept alongside the standard `mobile-web-app-capable`). Harmless; remove at next head cleanup.
3. **[Info] `/en` handling is correct.** `/en` and `/en/*` 301 to `/` and `/:path*` — no duplicate EN index. Do not add an `/en` sitemap branch.
4. **[Info] Internal linking is a strength.** Keep breadcrumb JSON-LD + visible breadcrumbs on tribunes/projets/photo pages so the 26 gallery pages pass equity upward to `/media/community`.
