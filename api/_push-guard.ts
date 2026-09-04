/* Web push endpoint guard.
 *
 * api/push-subscribe.ts stores whatever endpoint a visitor POSTs, and the
 * senders (api/agenda-reminders.ts, scripts/send-newsletter.mjs) later POST
 * the push payload to it from the server. Without a whitelist that store
 * would be an SSRF primitive: `https://169.254.169.254/…`,
 * `https://[::1]:8443/…` or any internal HTTPS service would receive the
 * server's POSTs. Only well-known push service hosts are accepted, the port
 * must be the default 443, and IP-literal hosts are rejected outright.
 *
 * `isAllowedPushEndpoint` is the synchronous, cheap check used both when
 * storing a subscription and again at send time (defense in depth against
 * endpoints stored before this guard existed). `isSafePushEndpoint` adds a
 * DNS resolution pass — none of an allowed host's addresses may be private,
 * loopback, link-local or reserved, and a resolution failure fails closed —
 * which the senders run per subscription before the outbound POST.
 *
 * The underscore prefix keeps Vercel from turning this file into a route —
 * see the comment atop _rate-limit.ts. */

import dns from 'node:dns/promises';

/* hosts browsers actually deliver push messages through; subdomains of these
   are the deployment-specific ones (e.g. updates.push.services.mozilla.com) */
const ALLOWED_PUSH_HOSTS = [
  'fcm.googleapis.com', // Chrome, Android, some Firefox builds
  'android.googleapis.com', // legacy GCM endpoints
  'push.apple.com', // Safari: web.push.apple.com
  'push.services.mozilla.com', // Firefox desktop (autopush)
  'notify.windows.com', // Edge legacy / Windows
  'pushpad.xyz', // Pushpad hosted subscriptions
];

export function isAllowedPushEndpoint(endpoint: string): boolean {
  if (!endpoint || !endpoint.startsWith('https://')) return false;
  let url: URL;
  try {
    url = new URL(endpoint);
  } catch {
    return false;
  }
  if (url.protocol !== 'https:' || url.username || url.password) return false;
  if (url.port !== '' && url.port !== '443') return false;
  const host = url.hostname.toLowerCase();
  /* no raw IPs — every browser push endpoint is DNS-based */
  if (/^[\d.]+$/.test(host) || host.includes(':') || host.startsWith('[')) return false;
  return ALLOWED_PUSH_HOSTS.some((h) => host === h || host.endsWith(`.${h}`));
}

export type Lookup = (
  hostname: string,
  options: { all: true; verbatim: boolean },
) => Promise<{ address: string; family: number }[]>;

export function isPrivateAddress(ip: string): boolean {
  const v4 = ip.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (v4) {
    const [a, b] = [Number(v4[1]), Number(v4[2])];
    if (a === 0) return true; // 0.0.0.0/8
    if (a === 10) return true; // 10.0.0.0/8
    if (a === 100 && b >= 64 && b <= 127) return true; // CGNAT 100.64/10
    if (a === 127) return true; // loopback
    if (a === 169 && b === 254) return true; // link-local
    if (a === 172 && b >= 16 && b <= 31) return true; // 172.16/12
    if (a === 192 && b === 168) return true; // 192.168/16
    if (a === 198 && (b === 18 || b === 19)) return true; // benchmarking
    if (a >= 224) return true; // multicast and reserved
    return false;
  }
  const lower = ip.toLowerCase();
  if (lower === '::1') return true; // loopback
  if (lower.startsWith('::ffff:')) return isPrivateAddress(lower.slice(7)); // v4-mapped
  if (lower.startsWith('fc') || lower.startsWith('fd')) return true; // ULA fc00::/7
  if (lower.startsWith('fe8') || lower.startsWith('fe9') || lower.startsWith('fea') || lower.startsWith('feb')) return true; // link-local fe80::/10
  if (lower.startsWith('::') || lower.startsWith('2001:db8')) return true; // unspecified / documentation
  return false;
}

/** Full check for the senders: allowlist, then no resolved address may be
 *  private. A failed lookup fails closed (the subscription is unusable). */
export async function isSafePushEndpoint(
  endpoint: string,
  lookup: Lookup = dns.lookup,
): Promise<boolean> {
  if (!isAllowedPushEndpoint(endpoint)) return false;
  const host = new URL(endpoint).hostname.toLowerCase();
  try {
    const addresses = await lookup(host, { all: true, verbatim: true });
    return addresses.length > 0 && addresses.every(({ address }) => !isPrivateAddress(address));
  } catch {
    return false;
  }
}
