/* Generates public/presse/press-kit.zip — one download for journalists:
   the portrait photo, the short and long biographies in both languages and
   the contact details, all plain text so they survive any editor.
   Run manually (like gen-og.mjs): `node scripts/gen-press-kit.mjs`.
   The build ships whatever public/ contains; dist/ is rebuilt from public/
   by vite, so no build step is needed after running this script. */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import AdmZip from 'adm-zip';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(root, 'public');

const BIO = {
  fr: "Dr. Seynudé Jean-Fortuné Dagnon, MD, MPH, est Senior Program Officer — Paludisme / Afrique francophone à la Fondation Gates. Depuis plus de 17 ans, il pilote des programmes de lutte contre le paludisme en Afrique de l'Ouest et centrale : digitalisation des campagnes, chimioprévention saisonnière, lutte antivectorielle et systèmes de données. Il a dirigé des programmes USAID/PMI au Bénin et a été distingué FSN Employee of the Year 2020. Doctorant en économie de la santé (Université de Groningen), il intervient régulièrement dans les médias et les conférences internationales.",
  en: "Dr. Seynudé Jean-Fortuné Dagnon, MD, MPH, is Senior Program Officer — Malaria / Francophone Africa at the Gates Foundation. For over 17 years he has led malaria programs across West and Central Africa: campaign digitalization, seasonal chemoprevention, vector control and data systems. He directed USAID/PMI programs in Benin and was named FSN Employee of the Year 2020. A PhD candidate in health economics (University of Groningen), he regularly speaks to the media and at international conferences.",
};

const SHORT_BIO = {
  fr: 'Dr. Seynudé Jean-Fortuné Dagnon — leader de programme en santé publique et paludisme (Fondation Gates), 17+ ans d’expérience en Afrique de l’Ouest et centrale.',
  en: 'Dr. Seynudé Jean-Fortuné Dagnon — public health & malaria program leader (Gates Foundation), 17+ years across West and Central Africa.',
};

const CONTACT = `Dr. Seynudé Jean-Fortuné Dagnon — contact

Email: contact@seynudedagnon.com
Site web: https://seynudedagnon.com
LinkedIn: https://www.linkedin.com/in/seynud%C3%A9-jean-fortune-dagnon-md-mph-p-h-d-in-progress-093a5a2a/
YouTube: https://www.youtube.com/@seynudedagnon6233
X (Twitter): https://x.com/SeynudeD

Formulaires de contact du site (demande d'interview / invitation) :
https://seynudedagnon.com/contact
`;

const README = `Dossier de presse — Dr. Seynudé Jean-Fortuné Dagnon
==================================================

Contenu du dossier :
  bio-fr.txt / bio-en.txt   Biographie longue (bilingue)
  bio-courte-fr.txt / bio-courte-en.txt   Biographie courte (1-2 phrases)
  contact.txt               Coordonnées et réseaux
  portrait.webp             Photo de portrait (libre de droits pour la presse)

Site web : https://seynudedagnon.com
`;

const zip = new AdmZip();

const add = (name, content) => zip.addFile(name, Buffer.from(content, 'utf8'));

add('README.txt', README);
add('bio-fr.txt', BIO.fr);
add('bio-en.txt', BIO.en);
add('bio-courte-fr.txt', SHORT_BIO.fr);
add('bio-courte-en.txt', SHORT_BIO.en);
add('contact.txt', CONTACT);

const photo = path.join(publicDir, 'dr-seynude-dagnon.webp');
if (!fs.existsSync(photo)) {
  throw new Error(`portrait photo missing: ${photo}`);
}
zip.addLocalFile(photo, undefined, 'portrait.webp');

const out = path.join(publicDir, 'presse', 'press-kit.zip');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, zip.toBuffer());

const size = (fs.statSync(out).size / 1024).toFixed(1);
console.log(`[gen-press-kit] wrote ${path.relative(root, out)} (${size} KiB, ${zip.getEntries().length} files)`);
