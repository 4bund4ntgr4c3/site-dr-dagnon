import { readFileSync } from 'fs';
import { join } from 'path';

export default function handler(_req: any, res: any) {
  const xml = readFileSync(join(process.cwd(), 'public', 'sitemap.xml'), 'utf-8');
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.status(200).send(xml);
}
