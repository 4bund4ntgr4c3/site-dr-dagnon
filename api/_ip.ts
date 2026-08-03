/* Trustworthy client IP for rate-limit keys.
 *
 * On Vercel, `x-vercel-forwarded-for` is appended by the platform's own
 * proxy and cannot be spoofed from the outside; `x-forwarded-for` is
 * client-controlled, so keying rate limits off it lets an attacker rotate a
 * fresh budget per fake address — and, worse, exhaust a *victim's* shared
 * budget by sending requests claiming their IP. The fallbacks (first value
 * of x-forwarded-for, then the socket address) only exist for local
 * development and direct invocations.
 *
 * Returns '' when the request carries no usable IP. Callers must then refuse
 * the request rather than fall back to a shared bucket: a constant key like
 * 'unknown' would make every header-less request collide in one counter,
 * turning a garbage flood into a lockout for everyone.
 *
 * The underscore prefix keeps Vercel from turning this file into a route —
 * see the comment atop _rate-limit.ts. */

type Headers = Record<string, string | string[] | undefined>;

export function clientIp(headers: Headers, remoteAddress?: string): string {
  const pick = (v: string | string[] | undefined): string =>
    typeof v === 'string' ? v : Array.isArray(v) && v.length > 0 ? String(v[0]) : '';
  const raw =
    pick(headers['x-vercel-forwarded-for']) ||
    pick(headers['x-forwarded-for']).split(',')[0].trim() ||
    remoteAddress ||
    '';
  const ip = raw.trim();
  /* plausible IPv4/IPv6 only — anything else (labels, header junk) must not
     become a key */
  return /^[0-9a-fA-F:.]+$/.test(ip) ? ip : '';
}
