# Images — seynudedagnon.com

## What works
- Modern formats: hero `dr-seynude-dagnon.webp` 47.7 KB + 400w variant 20.8 KB with `imagesrcset`/`imagesizes` + `fetchpriority=high`; OG `og-image.jpg` 92 KB (1200×630, within budget); per-tribune/per-projet OG images (`.en.jpg`/`.fr.jpg` in `public/og/`); community gallery 30 files / 3.4 MB (~113 KB avg WebP); `PHOTO_DIMS` documents real pixel dims for `og:image` + `<img>` attributes.
- Accessibility: 0 `<img>` without `alt` on home, CV, publications, projet, and sampled photo page (9/9 with alt).

## Re-audit delta (2026-09-06)
- **IMPROVEMENT: hero WebP re-encoded at q60** (−18% / −15% measured above); alt coverage still 0-missing on all sampled pages. YouTube-poster and zero-`<img>`-template findings unchanged.

## Findings
1. **[Low] YouTube thumbnails bypass the pipeline.** `img.youtube.com/hqdefault.jpg` are fixed-size JPEGs with no srcset. Recommendation: download at build, convert to WebP via `npm run images`, serve responsive.
2. **[Low] CV/publications/projet templates render 0 `<img>`.** Not an error, but a missed image-search opportunity. Recommendation: add one relevant OG/figure image per case study with descriptive alt + `ImageObject` schema (already used on 52 pages — extend the pattern).
3. **[Info] Keep the one-off WebP workflow.** `npm run images` (quality 72, committed output) is correct — deploys must not depend on `sharp` at runtime.
