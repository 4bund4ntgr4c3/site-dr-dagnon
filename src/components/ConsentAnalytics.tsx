import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

/* Vercel's scripts are cookieless measurement (no cross-site tracking, no
   identifier stored), so they load for every visitor without consent.
   Google Analytics stays consent-gated — see src/lib/consent.ts, which only
   injects gtag after an explicit grant. */
export function ConsentAnalytics() {
  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
