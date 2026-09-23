# Performance (CWV, lab observations only) — seynudedagnon.com

No CrUX/GSC/GA4 field data available (no credentials) — all values are build-artifact observations, not field CWV. Run `node scripts/audit-production.mjs` for lab timings.

## What works
- Full prerender (EN home 176 KB HTML) → fast FCP without JS; fonts preloaded (`fraunces-latin`, `inter-latin` woff2, `fetchpriority=high`); hero image preloaded with responsive `imagesrcset` (400w/694w); immutable caching on `/assets/*`; SW is network-first for navigations, cache-first for fingerprinted assets.
- JS is route-split (60+ chunks); per-route payloads are small (e.g. Home ~13.8 KB, Contact ~19.7 KB).

## Re-audit delta (2026-09-06)
- **IMPROVEMENT: hero re-encoded** (`dr-seynude-dagnon.webp` 47,682→38,990 B, −18%; 400w 20,824→17,766 B, −15%; commit `d306ef6`) and **YouTube preconnect dropped** (`yt_preconnect=false` in dist home).
- Unchanged: index chunk 219,690 B (≈same), react-dom 184,037 B, motion chunk still bundled (134,096 B), CSS 88,018 B, total `dist/assets` 1.37 MB. JS-hydration finding stands; no field data yet.

## Findings
1. **[Medium] Heavy shared vendor weight.** `index-*.js` 219 KB + `react-dom` 184 KB + `motion` 126 KB + `router` 35 KB + `lucide-icons` 34 KB ≈ 600 KB raw JS before gzip/Brotli. Prerender hides it from FCP but hydration still costs mobile CPU/INP. Recommendation: lazy-load `framer-motion` below the fold, tree-shake lucide imports per route (already chunked — verify no full-icon barrel), defer `gtag.js`/Vercel Analytics after `onload`.
2. **[Low] Third-party embeds.** `youtube-nocookie` preconnect + `img.youtube.com/hqdefault.jpg` thumbnails on media/podcast sections. Recommendation: facade pattern (click-to-load iframe) + self-hosted WebP posters; already using `nocookie`, keep it.
3. **[Low] CSS 88 KB single file.** Fine, but verify unused-Tailwind purge stays clean as routes grow.
4. **[Info] No field data.** Wire GSC + CrUX when possible; the Performance score (75) is capped until field LCP/INP/CLS replace lab estimates.
