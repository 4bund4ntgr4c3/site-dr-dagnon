import type { Lang } from '@/i18n/lang';

/* CV-only content — profile bullets, peer reviews and memberships — that has
   no home elsewhere on the site. Everything else on the CV page (experience,
   education, teaching, awards, publications) is reused from the site's own
   data files so the document cannot drift from the website. */

export const CV_PROFILE: Record<Lang, string[]> = {
  fr: [
    'Médecin diplômé, titulaire d’un master en santé publique option lutte contre les maladies (Institut de Médecine Tropicale d’Anvers, Belgique).',
    'Excellente maîtrise du français (5/5, langue maternelle) et bon niveau professionnel d’anglais (4,5/5).',
    'Expérience significative au sein d’institutions internationales : Fondation Bill & Melinda Gates, U.S. President’s Malaria Initiative, MCDI, MSH et URC-CHS.',
    'Dix-sept ans d’expérience dans la conception, la programmation, le suivi, la gestion, la mise en œuvre et l’évaluation de projets de développement et de recherche en maladies tropicales — paludisme, VIH/SIDA, maladies tropicales négligées, épidémies, santé maternelle, néonatale et infantile — au Bénin et en Afrique.',
    'Forte expérience de collaboration avec des organisations internationales (États-Unis, Europe, Asie) et des entités gouvernementales africaines dans des pays anglophones et francophones (Bénin, Burkina-Faso, Sénégal, Mali, Côte d’Ivoire, Niger, RDC, Tchad, Burundi, Rwanda, Cameroun, Sierra Leone, Liberia, Nigéria, Guinée, etc.).',
    'Déplacements professionnels d’au moins 40 % du temps de travail au cours des trois dernières années.',
    'Solides compétences en gestion de portefeuille et de projets, réseautage, mobilisation des donateurs, budgétisation et analyse financière.',
    'Bonnes connaissances en analyse de données épidémiologiques, qualitatives et quantitatives.',
    'Expérience dans la conception, la conduite et le suivi d’enquêtes et d’évaluations, du point de vue des bénéficiaires comme des donateurs : protocoles d’enquête, collecte et assurance qualité des données épidémiologiques, conception et gestion de bases de données sous Access ou EpiData, analyse quantitative.',
    'Excellente aptitude à communiquer avec les partenaires : ONG locales et internationales, gouvernements, ministères de la Santé, organisations internationales, société civile et structures de santé.',
    'Excellente connaissance des procédures administratives et financières de l’USAID, du Fonds mondial et de la Fondation Bill & Melinda Gates.',
    'Excellentes compétences en rédaction et évaluation de propositions.',
    'Maîtrise de Microsoft Office : Excel, Word, PowerPoint, Outlook.',
    'Relecteur pour des revues scientifiques à facteur d’impact élevé : PLOS ONE et BMC.',
    '15 publications relues par les pairs dans des revues scientifiques à facteur d’impact élevé.',
  ],
  en: [
    'Medical doctor with master’s degree in public health option disease control (Institute of Tropical Medicine of Antwerp, BELGIUM).',
    'Excellent knowledge and full professional proficiency in French (5/5 native language), advanced knowledge of English (4.5/5).',
    'Relevant experience working for global institutions, including the Bill and Melinda Gates Foundation, the U.S. President’s Malaria Initiative, MCDI, MSH, and URC-CHS.',
    'Seventeen years of relevant experience in designing, programming, overseeing, managing, implementing, monitoring, and evaluating development and research projects in tropical diseases in the areas of malaria, HIV/AIDS, neglected tropical diseases, outbreaks, and maternal, neonatal and child health in Benin and Africa.',
    'Strong experience in collaborating with global organizations in the USA, Europe, Asia, and African government entities in anglophone and francophone countries (Benin, Burkina Faso, Senegal, Mali, Côte d’Ivoire, Niger, DRC, Chad, Burundi, Rwanda, Cameroon, Sierra Leone, Liberia, Nigeria, Guinea, etc.).',
    'Traveled at least 40% of work time during the last three years.',
    'Strong capacities in portfolio and project management, networking, donor mobilization, budgeting, and financial analysis.',
    'Good knowledge of epidemiological, qualitative, and quantitative data analysis.',
    'Relevant experience designing, conducting, and overseeing surveys and evaluations from recipients’ and donors’ perspectives (survey and evaluation protocol design, collection and quality assurance of epidemiological data, design and management of databases in Access or EpiData, and quantitative data analysis).',
    'Excellent aptitude in communicating with partners in multiple areas (including local and international NGOs, government entities, Ministries of Health, international organizations, civil society, and health facilities).',
    'Strong knowledge of USAID, Global Fund, and BMGF administrative and financial procedures.',
    'Excellent skills and experience in proposal writing and assessment.',
    'Mastery of Microsoft Office: Excel, Word, PowerPoint, Outlook.',
    'Reviewer for high-impact factor scientific journals, PLOS ONE and BMC.',
    '15 peer-reviewed publications in high-impact factor scientific journals.',
  ],
};

export const CV_REVIEWS: Record<Lang, { journal: string; title: Record<Lang, string>; ref?: string }[]> = {
  fr: [
    { journal: 'PLOS ONE', ref: 'PONE-D-16-46355', title: { fr: 'Willingness to Pay for Health Insurance in the Informal Sector of Sierra Leone', en: 'Willingness to Pay for Health Insurance in the Informal Sector of Sierra Leone' } },
    { journal: 'BMC', title: { fr: 'Porous safety net : dépenses de santé catastrophiques et leurs déterminants parmi les ménages assurés au Togo', en: 'Porous safety net: catastrophic health expenditure and its determinants among insured households in Togo' } },
    { journal: 'PLOS ONE', title: { fr: 'Effets de l’hétérogénéité géographique et économique sur le fardeau de la diarrhée à rotavirus et l’impact et le rapport coût-efficacité de la vaccination au Nigéria', en: 'Effects of Geographic and Economic Heterogeneity on the Burden of Rotavirus Diarrhea and the Impact and Cost-Effectiveness of Vaccination in Nigeria' } },
  ],
  en: [
    { journal: 'PLOS ONE', ref: 'PONE-D-16-46355', title: { fr: 'Willingness to Pay for Health Insurance in the Informal Sector of Sierra Leone', en: 'Willingness to Pay for Health Insurance in the Informal Sector of Sierra Leone' } },
    { journal: 'BMC', title: { fr: 'Porous safety net : dépenses de santé catastrophiques et leurs déterminants parmi les ménages assurés au Togo', en: 'Porous safety net: catastrophic health expenditure and its determinants among insured households in Togo' } },
    { journal: 'PLOS ONE', title: { fr: 'Effets de l’hétérogénéité géographique et économique sur le fardeau de la diarrhée à rotavirus et l’impact et le rapport coût-efficacité de la vaccination au Nigéria', en: 'Effects of Geographic and Economic Heterogeneity on the Burden of Rotavirus Diarrhea and the Impact and Cost-Effectiveness of Vaccination in Nigeria' } },
  ],
};

export const CV_MEMBERSHIPS: Record<Lang, { period: string; org: string }[]> = {
  fr: [
    { period: 'Depuis 2016', org: 'Membre de l’American Society of Tropical Medicine and Hygiene (ASTMH)' },
    { period: 'Depuis 2012', org: 'Membre du Malaria Core Group, Washington DC' },
    { period: 'Depuis 2011', org: 'Membre de l’International Health Economics Association (IHEA)' },
    { period: '2009–2011', org: 'Membre de l’International AIDS Society (IAS)' },
    { period: '2023', org: 'Membre du comité scientifique de la conférence Multilateral Initiative on Malaria (MIM)' },
  ],
  en: [
    { period: 'Since 2016', org: 'Member of the American Society of Tropical Medicine and Hygiene (ASTMH)' },
    { period: 'Since 2012', org: 'Member of the Malaria Core Group, Washington DC' },
    { period: 'Since 2011', org: 'Member of the International Health Economics Association (IHEA)' },
    { period: '2009–2011', org: 'Member of the International AIDS Society (IAS)' },
    { period: '2023', org: 'Member of the scientific committee of the Multilateral Initiative on Malaria (MIM) conference' },
  ],
};
