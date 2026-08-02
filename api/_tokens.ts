/* Stateless HMAC tokens shared by the newsletter endpoints and the two bulk
 * senders (digest, agenda reminders). One function to issue, one to check,
 * and a purpose bound into the token so a confirmation link can never be
 * reused as an unsubscribe link. Same scheme as the verification codes in
 * verify-phone.ts: serverless instances share no memory, so the token
 * carries everything and an HMAC (keyed by a server-only secret) makes it
 * unforgeable.
 *
 * The underscore prefix keeps Vercel from turning this file into a route —
 * see the comment atop _rate-limit.ts. */

import crypto from 'node:crypto';

export type TokenPurpose = 'nl-confirm' | 'nl-unsub' | 'nl-prefs';

/* confirmation links are valid for 7 days, unsubscribe and preferences
   links for 90 */
export const TOKEN_TTL_MS: Record<TokenPurpose, number> = {
  'nl-confirm': 7 * 24 * 60 * 60 * 1000,
  'nl-unsub': 90 * 24 * 60 * 60 * 1000,
  'nl-prefs': 90 * 24 * 60 * 60 * 1000,
};

/* A dedicated secret is mandatory in production: falling back to the Resend
   key would let anyone who ever leaks it (logs, webhooks, a compromised
   email provider) sign confirmation/unsubscribe/preferences links and phone
   codes. The fallback stays for local development and preview deployments,
   where a missing VERIFY_SECRET must not block the build. */
const SECRET =
  process.env.VERIFY_SECRET ||
  (process.env.VERCEL_ENV === 'production' ? '' : process.env.RESEND_API_KEY || '');

const b64url = (b: Buffer) => b.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const hmac = (data: string) => b64url(crypto.createHmac('sha256', SECRET).update(data).digest());

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

/** null when no secret is configured — the caller must then fail closed. */
export function issueToken(purpose: TokenPurpose, email: string): string | null {
  if (!SECRET) return null;
  const exp = Date.now() + TOKEN_TTL_MS[purpose];
  const payload = b64url(Buffer.from(JSON.stringify({ p: purpose, e: email, x: exp, h: hmac(`${purpose}|${email}|${exp}`) })));
  return `${payload}.${hmac(payload)}`;
}

export function checkToken(purpose: TokenPurpose, token: string, email: string): 'ok' | 'expired' | 'invalid' {
  if (!SECRET) return 'invalid';
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return 'invalid';
  if (!safeEqual(sig, hmac(payload))) return 'invalid';
  let data: { p?: string; e?: string; x?: number; h?: string };
  try {
    data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'));
  } catch {
    return 'invalid';
  }
  if (data.p !== purpose || !data.e || !data.x || !data.h) return 'invalid';
  if (data.e !== email) return 'invalid';
  if (Date.now() > data.x) return 'expired';
  return safeEqual(data.h, hmac(`${purpose}|${email}|${data.x}`)) ? 'ok' : 'invalid';
}
