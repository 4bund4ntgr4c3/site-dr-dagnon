# seynudedagnon.com

Official Website & Institutional Platform of Dr. Seynudé Jean-Fortuné Dagnon — React 19 + Vite + Tailwind, deployed on Vercel with 8 serverless functions (contact+verify-phone, newsletter×4, push×2, search-log, admin, changelog, agenda-reminders, event-reminders) — under the Hobby 12-function limit.

## Commands

```bash
npm run dev      # dev server on :3000
npm run build    # typecheck, bundle (react/motion split), then prerender 128 pages + sitemap (per-route lastmod) + 404 + service worker (194 precached) + newsletter digest on Vercel production
npm test         # build, then 387 tests (node --test, incl. a11y + seo + indexnow)
npm run lint
npm run indexnow # submit sitemap URLs to IndexNow (Bing/Yandex) — 128 URLs, needs dist/sitemap.xml
npm run images   # one-off: convert public/ photos to WebP (see below)
npm run gen:og   # one-off: regenerate og-image.jpg
```

## Environment variables

Set in the Vercel project settings. Only the first two are required for the
contact form to work at all.

| Variable | Required | Purpose |
|---|---|---|
| `RESEND_API_KEY` | yes | sending mail through Resend |
| `CONTACT_TO_EMAIL` | yes | where contact messages are delivered |
| `CONTACT_FROM_EMAIL` | no | sender identity, defaults to `Dr. Seynudé Dagnon <admin@seynudedagnon.com>` |
| `NEWSLETTER_TO_EMAIL` | yes (newsletter) | the owner's inbox — receives every digest, and is used for the unsubscribe link |
| `NEWSLETTER_FROM_EMAIL` | no | newsletter sender identity, defaults to `Dr. Seynudé Dagnon <admin@seynudedagnon.com>` |
| `VERIFY_SECRET` | recommended | signs the phone-verification tokens; falls back to `RESEND_API_KEY` |
| `CONTACT_PHONE` | yes (phone reveal) | the protected phone number, so it can change without a code deploy |
| `ALLOWED_ORIGINS` | no | comma-separated origin allowlist for the API |
| `KV_REST_API_URL` + `KV_REST_API_TOKEN` | no | shared rate-limit store (see below) |
| `ADMIN_SECRET` | yes (admin) | bearer token for `/api/admin` and `/api/changelog` (push composer, dashboard, changelog page) |
| `CRON_SECRET` | yes (reminders) | bearer token for the cron endpoints (`agenda-reminders`, `event-reminders`); fallback for `/api/admin` and `/api/push-send` |
| `VAPID_PUBLIC_KEY` + `VAPID_PRIVATE_KEY` | yes (push) | web-push VAPID key pair, generated with `web-push generate-vapid-keys --json` |

Attaching a Vercel KV store sets the `KV_*` pair automatically. Upstash's own
`UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` are read too.

### Newsletter automation (Vercel build)

The newsletter digest goes out automatically at the end of every Vercel
**production** deploy — the `build` script ends with
`scripts/send-newsletter.mjs`, which reads the subscriber list
(`newsletter:emails`, written by `/api/newsletter`) and the sent-state
(`newsletter:last-sent`) from the KV store, then mails the new publications
and tribunes via Resend, owner in `to` and subscribers in `bcc` batches of
50. The first run establishes a baseline and sends nothing, so the archive is
never re-mailed.

| Variable | Purpose |
|---|---|
| `NEWSLETTER_FROM_EMAIL` | optional sender identity |

The script skips cleanly on preview deployments and local builds (guarded by
`VERCEL_ENV`), and a failed send leaves the state untouched so the next
deploy retries it.

## Things that are not obvious

**The phone number is not in the client bundle.** It lives in
`api/contact.ts` (merged `verify-phone` handler) and is only returned after a code sent by email is
verified. It comes from `CONTACT_PHONE` with no hardcoded default — if that
variable is unset, the endpoint fails closed rather than revealing a number.
The verification is stateless — a signed token carries an HMAC of
the code — because serverless instances share no memory. A test asserts no
phone-shaped string ever reaches `dist/`.

**Rate limiting degrades gracefully.** `api/_rate-limit.ts` uses the shared KV
store when credentials exist and per-instance memory otherwise. Without the
shared store the limits only slow a single client down; a burst spread across
lambda instances gets through.

**URLs carry the language.** English at the root, French under `/fr`
(`src/i18n/routing.ts`). This is what makes the hreflang tags meaningful. A
French-speaking first-time visitor is redirected once, unless they have picked
a language before — see the comment in `src/i18n/LanguageContext.tsx`, which
also explains how to remove that behaviour.

**The `<head>` is static, the body is not.** `scripts/prerender.mjs` writes one
HTML file per route per language, with its own title, canonical, hreflang and
JSON-LD, all from `src/seo/meta.ts` — the same module `<Seo />` uses at
runtime. Link unfurlers do not run JavaScript, so this is where it matters.
The sitemap, `404.html`, the RSS feed and the service worker come from the
same run. The script fails the build rather than skipping quietly, which an
earlier Playwright-based version did on every deploy without anyone noticing.

**The site is a PWA.** `scripts/prerender.mjs` also writes `dist/sw.js`, which
precaches every prerendered page, the versioned `assets/*` and the community
photos, with a cache name hashed from that list — so the cache version changes
exactly when the content does. Navigations are network-first (fresh HTML
online, the precached copy or the home page offline), other GETs are
cache-first. It is registered in `src/main.tsx` in production only, and
`vercel.json` serves it with `max-age=0` so updates propagate.

**The changelog lives server-side.** `/changelog` is a password-protected,
client-only page (never prerendered or indexed); its release history is served
by `api/changelog.ts`, so the entries never ship in the client bundle. The
header stats (commits, versions, tests, prerendered pages, period) live in the
same file and must be updated on each release — they are the repo's release
log (the former standalone `CHANGELOG.html` is gone).

**Routes are listed explicitly in `vercel.json`** rather than relying on a
catch-all rewrite, so a URL that does not exist gets a real 404 instead of a
soft 200. A test keeps that list in sync with the prerendered routes.

**Images are converted once and committed.** `npm run images` reads `public/`
and writes WebP at quality 72 — chosen by measuring these files, not by
habit; the reasoning is in `scripts/optimize-images.mjs`. Deploys never depend
on `sharp` being installable.

## After deploying

```bash
curl -s https://seynudedagnon.com/fr/contact | grep -o '<title>[^<]*</title>'
curl -sI https://seynudedagnon.com/sitemap.xml | grep -i content-type
curl -sI https://seynudedagnon.com/this-does-not-exist | head -1
```

Expected: the French contact title, `application/xml`, and `HTTP/2 404`.
