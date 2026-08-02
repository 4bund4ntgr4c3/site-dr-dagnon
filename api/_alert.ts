import { rateLimit } from './_rate-limit.js';

/* Best-effort owner alerts.
 *
 * When a handler fails on the provider side — Resend refused a send, or an
 * unexpected error escaped a try — the visitor already received their error
 * page, but nobody would ever know. This emails the owner so the failure can
 * be fixed: the visitor-facing error is silent by design, the alert is the
 * other half of it.
 *
 * One alert per topic per window (15 minutes) via the shared rate limiter, so
 * a burst of failures cannot bury the owner in emails. Everything here is
 * best-effort: if the alert itself cannot go out, nothing else is broken by
 * trying.
 *
 * The underscore prefix keeps Vercel from turning this file into a route —
 * see the comment atop _rate-limit.ts. */

const WINDOW_MS = 15 * 60_000;

/** Fires an alert email to the owner, at most once per topic per window. */
export async function alertOwner(topic: string, detail: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) return;
  try {
    if (!(await rateLimit(`alert:${topic}`, 1, WINDOW_MS))) return;
    const from = process.env.CONTACT_FROM_EMAIL || 'Portfolio <admin@seynudedagnon.com>';
    const env = process.env.VERCEL_ENV || 'development';
    const url = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://seynudedagnon.com';
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `[Site] API failure — ${topic}`,
        text: `The site API hit a provider failure that needs attention.\n\nTopic: ${topic}\nDetail: ${detail}\nEnvironment: ${env}\nDeployment: ${url}\n\nThis alert is rate-limited to one per topic per 15 minutes.`,
      }),
    });
    if (!response.ok) console.error(`[alert] ${topic} alert not delivered (${response.status})`);
  } catch (e) {
    console.error('[alert] failed to send', e);
  }
}
