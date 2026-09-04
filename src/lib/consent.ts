export type AnalyticsConsent = 'granted' | 'denied' | null;

export const ANALYTICS_CONSENT_KEY = 'consent-analytics';
export const ANALYTICS_CONSENT_EVENT = 'analytics-consent-change';
const GA_ID = 'G-S4KYJWSXBJ';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}
export function readAnalyticsConsent(): AnalyticsConsent {
  try {
    const value = window.localStorage.getItem(ANALYTICS_CONSENT_KEY);
    return value === 'granted' || value === 'denied' ? value : null;
  } catch {
    return null;
  }
}

function ensureGtag(): void {
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || ((...args: unknown[]) => window.dataLayer?.push(args));
}

function loadGoogleAnalytics(): void {
  if (document.getElementById('google-analytics-script')) return;
  const script = document.createElement('script');
  script.id = 'google-analytics-script';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
  document.head.append(script);
  window.gtag?.('js', new Date());
  window.gtag?.('config', GA_ID, { anonymize_ip: true });
}

export function applyAnalyticsConsent(consent: Exclude<AnalyticsConsent, null>): void {
  ensureGtag();
  window.gtag?.('consent', 'update', {
    analytics_storage: consent,
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  if (consent === 'granted') loadGoogleAnalytics();
}

export function saveAnalyticsConsent(consent: Exclude<AnalyticsConsent, null>): void {
  try {
    window.localStorage.setItem(ANALYTICS_CONSENT_KEY, consent);
  } catch {
    /* Consent still applies for this page even when storage is unavailable. */
  }
  applyAnalyticsConsent(consent);
  window.dispatchEvent(new CustomEvent(ANALYTICS_CONSENT_EVENT, { detail: consent }));
}
