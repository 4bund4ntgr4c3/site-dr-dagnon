import type { IncomingMessage, ServerResponse } from 'http';

const XML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url><loc>https://seynudedagnon.com/</loc><lastmod>2026-07-28</lastmod><changefreq>weekly</changefreq><priority>1.0</priority><xhtml:link rel="alternate" hreflang="en" href="https://seynudedagnon.com/"/><xhtml:link rel="alternate" hreflang="fr" href="https://seynudedagnon.com/"/><xhtml:link rel="alternate" hreflang="x-default" href="https://seynudedagnon.com/"/></url>
  <url><loc>https://seynudedagnon.com/contact</loc><lastmod>2026-07-28</lastmod><changefreq>monthly</changefreq><priority>0.7</priority><xhtml:link rel="alternate" hreflang="en" href="https://seynudedagnon.com/contact"/><xhtml:link rel="alternate" hreflang="fr" href="https://seynudedagnon.com/contact"/><xhtml:link rel="alternate" hreflang="x-default" href="https://seynudedagnon.com/contact"/></url>
  <url><loc>https://seynudedagnon.com/media</loc><lastmod>2026-07-28</lastmod><changefreq>weekly</changefreq><priority>0.9</priority><xhtml:link rel="alternate" hreflang="en" href="https://seynudedagnon.com/media"/><xhtml:link rel="alternate" hreflang="fr" href="https://seynudedagnon.com/media"/><xhtml:link rel="alternate" hreflang="x-default" href="https://seynudedagnon.com/media"/></url>
  <url><loc>https://seynudedagnon.com/media/interview</loc><lastmod>2026-07-28</lastmod><changefreq>monthly</changefreq><priority>0.8</priority><xhtml:link rel="alternate" hreflang="en" href="https://seynudedagnon.com/media/interview"/><xhtml:link rel="alternate" hreflang="fr" href="https://seynudedagnon.com/media/interview"/><xhtml:link rel="alternate" hreflang="x-default" href="https://seynudedagnon.com/media/interview"/></url>
  <url><loc>https://seynudedagnon.com/media/conference</loc><lastmod>2026-07-28</lastmod><changefreq>monthly</changefreq><priority>0.8</priority><xhtml:link rel="alternate" hreflang="en" href="https://seynudedagnon.com/media/conference"/><xhtml:link rel="alternate" hreflang="fr" href="https://seynudedagnon.com/media/conference"/><xhtml:link rel="alternate" hreflang="x-default" href="https://seynudedagnon.com/media/conference"/></url>
  <url><loc>https://seynudedagnon.com/media/speaking</loc><lastmod>2026-07-28</lastmod><changefreq>monthly</changefreq><priority>0.8</priority><xhtml:link rel="alternate" hreflang="en" href="https://seynudedagnon.com/media/speaking"/><xhtml:link rel="alternate" hreflang="fr" href="https://seynudedagnon.com/media/speaking"/><xhtml:link rel="alternate" hreflang="x-default" href="https://seynudedagnon.com/media/speaking"/></url>
  <url><loc>https://seynudedagnon.com/media/press</loc><lastmod>2026-07-28</lastmod><changefreq>monthly</changefreq><priority>0.8</priority><xhtml:link rel="alternate" hreflang="en" href="https://seynudedagnon.com/media/press"/><xhtml:link rel="alternate" hreflang="fr" href="https://seynudedagnon.com/media/press"/><xhtml:link rel="alternate" hreflang="x-default" href="https://seynudedagnon.com/media/press"/></url>
  <url><loc>https://seynudedagnon.com/media/community</loc><lastmod>2026-07-28</lastmod><changefreq>monthly</changefreq><priority>0.8</priority><xhtml:link rel="alternate" hreflang="en" href="https://seynudedagnon.com/media/community"/><xhtml:link rel="alternate" hreflang="fr" href="https://seynudedagnon.com/media/community"/><xhtml:link rel="alternate" hreflang="x-default" href="https://seynudedagnon.com/media/community"/></url>
  <url><loc>https://seynudedagnon.com/publications</loc><lastmod>2026-07-28</lastmod><changefreq>weekly</changefreq><priority>0.9</priority><xhtml:link rel="alternate" hreflang="en" href="https://seynudedagnon.com/publications"/><xhtml:link rel="alternate" hreflang="fr" href="https://seynudedagnon.com/publications"/><xhtml:link rel="alternate" hreflang="x-default" href="https://seynudedagnon.com/publications"/></url>
</urlset>`;

export default function handler(_req: IncomingMessage, res: ServerResponse) {
  res.writeHead(200, {
    'Content-Type': 'application/xml; charset=utf-8',
    'Cache-Control': 'public, max-age=86400',
  });
  res.end(XML);
}
