/* Origin allowlist shared by both handlers. Underscore-prefixed so Vercel
 * bundles this into the functions that import it without also turning it
 * into its own route — see the comment atop _rate-limit.ts for why that
 * distinction matters here.
 *
 * Not a security boundary — Origin and Referer are both attacker-controlled
 * on a raw HTTP client — but it costs real browsers nothing (they always
 * attach Origin to a same-origin POST) while turning away scripts that just
 * POST at the endpoint directly.
 *
 * This previously lived duplicated in both api/contact.ts and
 * api/verify-phone.ts, with a hardcoded list of seynudedagnon.com + *.vercel.app
 * + localhost. That list didn't know about sd.studio26.online, the staging
 * preview domain — so a legitimate same-origin request from staging was
 * rejected by its own origin check. One list now, extendable without a code
 * change via ALLOWED_ORIGINS. */

const ALLOWED_ORIGINS = (
  process.env.ALLOWED_ORIGINS || 'https://seynudedagnon.com,https://www.seynudedagnon.com'
)
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

/* Preview infrastructure that isn't worth hardcoding per project — but the
 * two wildcard forms that used to live here (`*.vercel.app`, `*.studio26.online`)
 * are gone: anyone can register their own vercel.app subdomain, so a wildcard
 * turns the check into an allow-all for browsers. Previews are matched by this
 * project's own name only (`site-dr-dagnon…` deployments belong to this
 * project), the staging domain is matched exactly, and local development stays
 * open. Anything else goes through ALLOWED_ORIGINS. */
const PREVIEW_PATTERNS = [
  /^https:\/\/site-dr-dagnon(?:-[a-z0-9-]+)?\.vercel\.app$/,
  /^https:\/\/sd\.studio26\.online$/,
  /^http:\/\/localhost(:\d+)?$/,
];

export function originAllowed(headers: Record<string, string | string[] | undefined>): boolean {
  const raw = (headers.origin || headers.referer || '').toString();
  if (!raw) return false;
  let origin: string;
  try {
    origin = new URL(raw).origin;
  } catch {
    return false;
  }
  return ALLOWED_ORIGINS.includes(origin) || PREVIEW_PATTERNS.some((p) => p.test(origin));
}
