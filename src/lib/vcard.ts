/**
 * Generates and triggers download of a standardized vCard (.vcf) file
 * for Dr. Seynudé Jean-Fortuné Dagnon.
 */
export function downloadVCard(lang: 'fr' | 'en' = 'fr') {
  const isFr = lang === 'fr';

  const title = isFr
    ? 'Senior Program Officer — Paludisme & Santé Publique (Afrique francophone)'
    : 'Senior Program Officer — Malaria & Public Health (Francophone Africa)';

  const org = isFr
    ? 'Fondation Bill & Melinda Gates'
    : 'Bill & Melinda Gates Foundation';

  const note = isFr
    ? 'Médecin spécialiste en santé publique, leader des programmes paludisme et économie de la santé. Ancien conseiller résident USAID/PMI.'
    : 'Public health physician, malaria program leader and health economist. Former USAID/PMI Resident Advisor.';

  const vcardContent = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'N:Dagnon;Seynudé;Jean-Fortuné;Dr.;MD, MPH',
    'FN:Dr. Seynudé Jean-Fortuné Dagnon, MD, MPH',
    `ORG:${org}`,
    `TITLE:${title}`,
    'EMAIL;type=INTERNET,pref:contact@seynudedagnon.com',
    'URL;type=WORK:https://seynudedagnon.com',
    'URL;type=LINKEDIN:https://www.linkedin.com/in/seynud%C3%A9-jean-fortune-dagnon-md-mph-seynudedagnon-com-093a5a2a/',
    'URL;type=ORCID:https://orcid.org/0009-0006-5022-1399',
    'URL;type=SCHOLAR:https://scholar.google.com/citations?user=Q6NT-4gAAAAJ',
    'ADR;type=WORK:;;Cotonou;;;Benin',
    `NOTE:${note}`,
    'X-SOCIALPROFILE;type=twitter:https://x.com/SeynudeD',
    'END:VCARD',
  ].join('\r\n');

  const blob = new Blob([vcardContent], { type: 'text/vcard;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'Dr_Seynude_Dagnon.vcf');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
