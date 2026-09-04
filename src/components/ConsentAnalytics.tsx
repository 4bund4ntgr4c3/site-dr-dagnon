import { useEffect, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { ANALYTICS_CONSENT_EVENT, readAnalyticsConsent } from '@/lib/consent';

export function ConsentAnalytics() {
  const [enabled, setEnabled] = useState(() => readAnalyticsConsent() === 'granted');

  useEffect(() => {
    const update = () => setEnabled(readAnalyticsConsent() === 'granted');
    window.addEventListener(ANALYTICS_CONSENT_EVENT, update);
    return () => window.removeEventListener(ANALYTICS_CONSENT_EVENT, update);
  }, []);

  return enabled ? <><Analytics /><SpeedInsights /></> : null;
}
