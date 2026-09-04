declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function track(event: string, params?: Record<string, unknown>) {
  try {
    if (window.localStorage.getItem('consent-analytics') === 'granted') {
      window.gtag?.('event', event, params ?? {});
    }
  } catch {
    /* Analytics is optional; blocked storage must never break the UI. */
  }
}
