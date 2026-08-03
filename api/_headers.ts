/* Security headers for API responses.
 *
 * vercel.json header rules do not apply to Serverless Function responses
 * (Vercel documented limitation), so every handler sets its own. JSON
 * endpoints get `nosniff`; the standalone HTML pages served by the
 * confirmation and unsubscribe endpoints get a strict CSP too — they are
 * raw HTML with no app shell, so there is nothing to allow except the
 * inline styles already in the templates.
 *
 * The underscore prefix keeps Vercel from turning this file into a route —
 * see the comment atop _rate-limit.ts. */

export function applyJsonHeaders(res: { setHeader(k: string, v: string): void }): void {
  res.setHeader('X-Content-Type-Options', 'nosniff');
}

export function applyPageHeaders(res: { setHeader(k: string, v: string): void }): void {
  applyJsonHeaders(res);
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Content-Security-Policy', "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'");
}
