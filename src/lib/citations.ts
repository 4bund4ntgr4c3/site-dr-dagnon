/* Citation generators for the publications list — BibTeX, RIS and APA.
   Pure functions on the fields a PubEntry carries, so the node test runner
   can compile and test them without dragging in the data files. */

export interface CitationSource {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  url?: string;
  /** Digital Object Identifier (without the https://doi.org/ prefix). */
  doi?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  type: 'paper' | 'blog' | 'report' | 'book';
}

const bibtexEscape = (s: string) =>
  String(s)
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/[{}]/g, (m) => `\\${m}`)
    .replace(/&/g, '\\&')
    .replace(/%/g, '\\%')
    .replace(/#/g, '\\#')
    .replace(/_/g, '\\_');

const yearOf = (p: CitationSource) => String(p.year);

export function citationBibtex(p: CitationSource): string {
  const key = p.id.replace(/[^\w:-]/g, '');
  const volume = p.volume ? `  volume = {${bibtexEscape(p.volume)}},\n` : '';
  const issue = p.issue ? `  number = {${bibtexEscape(p.issue)}},\n` : '';
  const pages = p.pages ? `  pages = {${bibtexEscape(p.pages)}},\n` : '';
  const doi = p.doi ? `  doi = {${bibtexEscape(p.doi)}},\n` : '';
  const url = p.url ? `  url = {${p.url}},\n` : '';
  return `@${p.type === 'blog' ? 'misc' : 'article'}{${key},
  author = {${bibtexEscape(p.authors)}},
  title = {${bibtexEscape(p.title)}},
  journal = {${bibtexEscape(p.journal)}},
  year = {${yearOf(p)}},${volume ? `\n${volume.trimEnd()}` : ''}${issue ? `\n${issue.trimEnd()}` : ''}${pages ? `\n${pages.trimEnd()}` : ''}${doi ? `\n${doi.trimEnd()}` : ''}${url ? `\n${url.trimEnd()}` : ''}
}
`;
}

export function citationRis(p: CitationSource): string {
  const type = p.type === 'blog' ? 'GEN' : p.type === 'report' ? 'RPRT' : 'JOUR';
  return [
    `TY  - ${type}`,
    `TI  - ${p.title}`,
    `AU  - ${p.authors}`,
    `JO  - ${p.journal}`,
    `PY  - ${yearOf(p)}`,
    ...(p.volume ? [`VL  - ${p.volume}`] : []),
    ...(p.issue ? [`IS  - ${p.issue}`] : []),
    ...(p.pages ? [`SP  - ${p.pages}`] : []),
    ...(p.doi ? [`DO  - ${p.doi}`] : []),
    ...(p.url ? [`UR  - ${p.url}`] : []),
    `ER  - `,
  ].join('\n');
}

export function citationApa(p: CitationSource): string {
  /* APA 7: Author. (Year). Title. Journal. URL — the author string is used
     as written, since the data does not carry name parts to invert. A DOI
     always wins over the bare URL, per APA 7 §9.34. */
  const locator = p.doi ? ` https://doi.org/${p.doi}` : p.url ? ` ${p.url}` : '';
  return `${p.authors}. (${yearOf(p)}). ${p.title}. ${p.journal}.${locator}`;
}
