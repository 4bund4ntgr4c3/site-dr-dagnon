import { PUB_ITEMS, type PubEntry } from './publications';

/** A bibliography entry is a scholarly publication whose full-text (or
    preprint) is indexed under a DOI. It carries every field of the source
    publication plus the bibliographic metadata citation managers care about.
    volume/issue/pages stay undefined where they are not known for certain —
    the citation generators simply omit them. */
export interface BibEntry extends PubEntry {
  doi?: string;
  volume?: string;
  issue?: string;
  pages?: string;
}

/** Matches a DOI anywhere in a URL: doi.org prefixes (doi.org/10.x/…,
    dx.doi.org/…) and publisher article URLs that embed one (e.g. the
    biomedcentral.com/articles/10.1186/… pattern). */
const DOI_RE = /(10\.\d{4,9}\/[^\s"'<>]+)/;

const doiOf = (url: string): string | undefined => url.match(DOI_RE)?.[1];

/** The bibliography is derived from PUB_ITEMS so the two lists can never
    drift apart: every publication with a DOI is included, in source order. */
export const BIB_ITEMS: BibEntry[] = PUB_ITEMS.filter(
  (p): p is BibEntry => p.type === 'publication' && typeof p.url === 'string' && !!doiOf(p.url),
).map((p) => ({ ...p, doi: doiOf(p.url!) }));
