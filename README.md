# seynudedagnon.com

Official website and institutional platform of Dr. Seynudé Jean-Fortuné Dagnon — React 19, Vite and Tailwind, deployed on Vercel with 8 serverless functions (contact/phone verification, newsletter, push, search analytics, admin, changelog and reminders).

## Commands

```bash
npm run dev      # dev server on :3000
npm run build    # side-effect-free: typecheck, bundle and prerender pages/feeds/PWA
npm test         # build, then the complete Node/Playwright suite
npm run lint
npm run indexnow # submit sitemap URLs to IndexNow (Bing/Yandex) — 130 URLs, needs dist/sitemap.xml
npm run postdeploy:notify # explicitly send the newsletter digest, then notify IndexNow
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
| `VERIFY_SECRET` | yes in production | signs phone, newsletter and reminder tokens; there is no production fallback |
| `CONTACT_PHONE` | yes (phone reveal) | the protected phone number, so it can change without a code deploy |
| `ALLOWED_ORIGINS` | no | comma-separated origin allowlist for the API |
| `KV_REST_API_URL` + `KV_REST_API_TOKEN` | yes for newsletter/push | subscriber state, delivery cursors, push state and shared rate limits |
| `ADMIN_SECRET` | yes (admin) | bearer token for `/api/admin` and `/api/changelog` (push composer, dashboard, changelog page) |
| `CRON_SECRET` | yes (reminders) | bearer token for the cron endpoints (`agenda-reminders`, `event-reminders`); fallback for `/api/admin` and `/api/push-send` |
| `VAPID_PUBLIC_KEY` + `VAPID_PRIVATE_KEY` | yes (push) | web-push VAPID key pair, generated with `web-push generate-vapid-keys --json` |

Attaching a Vercel KV store sets the `KV_*` pair automatically. Upstash's own
`UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` are read too.

### Newsletter delivery

The build is deliberately side-effect-free: previews, retries and CI never
send e-mail. After a successful production deployment, run
`npm run postdeploy:notify` from a trusted deployment job. The newsletter script reads the subscriber list
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

**The `<head>` and initial body are statically rendered.** `scripts/prerender.mjs` writes one
HTML file per route per language, with its own title, canonical, hreflang and
JSON-LD, all from `src/seo/meta.ts` — the same module `<Seo />` uses at
runtime. Link unfurlers do not run JavaScript, so this is where it matters.
The sitemap, `404.html`, the RSS feed and the service worker come from the
same run. The script fails the build rather than skipping quietly, which an
earlier Playwright-based version did on every deploy without anyone noticing.

**The site is a PWA.** `scripts/prerender.mjs` also writes `dist/sw.js`, which
precaches only the app shell and explicit offline pages, with a cache name
hashed from file contents. Pages and media are cached when visited. Navigations
and stable asset URLs are network-first; fingerprinted Vite assets are
cache-first. Updates wait for the visitor to accept a refresh. It is registered in `src/main.tsx` in production only, and
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
