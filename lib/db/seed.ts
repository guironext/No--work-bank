import { db } from "./index";

const countryRows = [
  { code: "CI", name: "Côte d'Ivoire", currency: "XOF" },
  { code: "SN", name: "Sénégal", currency: "XOF" },
  { code: "BJ", name: "Bénin", currency: "XOF" },
  { code: "TG", name: "Togo", currency: "XOF" },
  { code: "BF", name: "Burkina Faso", currency: "XOF" },
  { code: "ML", name: "Mali", currency: "XOF" },
  { code: "GN", name: "Guinée", currency: "GNF" },
  { code: "CM", name: "Cameroun", currency: "XAF" },
];

const cityRows = [
  ["CI", "Abidjan"],
  ["CI", "Bouaké"],
  ["CI", "Yamoussoukro"],
  ["CI", "San-Pédro"],
  ["CI", "Korhogo"],
  ["CI", "Daloa"],
  ["CI", "Man"],
  ["CI", "Gagnoa"],
  ["SN", "Dakar"],
  ["BJ", "Cotonou"],
  ["TG", "Lomé"],
] as const;

async function main() {
  await db.country.createMany({ data: countryRows, skipDuplicates: true });
  await db.city.createMany({
    data: cityRows.map(([countryCode, name]) => ({ countryCode, name })),
    skipDuplicates: true,
  });
  await db.setting.upsert({
    where: { key: "commission_rate_percent" },
    update: {},
    create: { key: "commission_rate_percent", value: "10" },
  });

  const planRows = [
    {
      code: "candidat_premium",
      name: "Compte candidat Premium",
      description: "Visibilité renforcée du profil et alertes prioritaires.",
      audience: "candidat",
      amount: 5000,
      currency: "XOF",
      interval: "mois" as const,
    },
    {
      code: "publication_offre",
      name: "Publication d'une offre",
      description: "Mise en ligne d'une offre d'emploi, de stage ou de mission.",
      audience: "entreprise",
      amount: 15000,
      currency: "XOF",
      interval: "acte" as const,
    },
    {
      code: "entreprise_mois",
      name: "Compte entreprise mensuel",
      description: "Recrutement, présélection et suivi des candidatures.",
      audience: "entreprise",
      amount: 50000,
      currency: "XOF",
      interval: "mois" as const,
    },
    {
      code: "entreprise_an",
      name: "Compte entreprise annuel",
      description: "Abonnement annuel de l'espace entreprise.",
      audience: "entreprise",
      amount: 480000,
      currency: "XOF",
      interval: "an" as const,
    },
  ];
  for (const plan of planRows) {
    await db.plan.upsert({ where: { code: plan.code }, update: {}, create: plan });
  }

  const catalog = [
    {
      key: "lagune-digital",
      legalName: "Lagune Digital",
      sector: "Numérique",
      city: "Abidjan",
      description:
        "Studio logiciel abidjanais. Catalogue de démonstration pour découvrir NOÉ JOBS avant l'arrivée des premières entreprises vérifiées.",
      jobs: [
        {
          key: "lagune-fullstack",
          title: "Développeur full stack junior",
          contractType: "CDI",
          salaryMin: 350000,
          salaryMax: 550000,
          educationLevel: "Licence",
          experience: "0 à 2 ans",
          requiredSkills: "JavaScript, React, SQL, communication",
          missions: "Construire des interfaces, corriger des incidents et documenter les livraisons.",
          description:
            "Lagune Digital recrute un développeur junior pour accompagner la livraison d'applications métier. Le poste est basé à Abidjan, avec une journée de télétravail.",
        },
        {
          key: "lagune-stage",
          title: "Stage développement web",
          contractType: "Stage",
          salaryMin: 80000,
          salaryMax: 120000,
          educationLevel: "Bac+2",
          experience: "Étudiant",
          requiredSkills: "HTML, CSS, JavaScript, curiosité",
          missions: "Intégrer des pages, tester des parcours et participer aux revues d'équipe.",
          description:
            "Stage de quatre à six mois, ouvert aux étudiants et jeunes diplômés du numérique.",
        },
      ],
    },
    {
      key: "sahel-agro",
      legalName: "Sahel Agro",
      sector: "Agro-industrie",
      city: "Bouaké",
      description: "Transformation agricole et logistique régionale. Fiche de démonstration.",
      jobs: [
        {
          key: "sahel-maintenance",
          title: "Technicien de maintenance industrielle",
          contractType: "CDI",
          salaryMin: 280000,
          salaryMax: 420000,
          educationLevel: "Bac+2",
          experience: "2 ans",
          requiredSkills: "mécanique, électricité, sécurité, rigueur",
          missions: "Prévenir les arrêts de chaîne et tenir le cahier de maintenance.",
          description: "Poste terrain à Bouaké, au sein d'une unité de transformation.",
        },
      ],
    },
    {
      key: "atlantique-btp",
      legalName: "Atlantique BTP",
      sector: "BTP",
      city: "San-Pédro",
      description: "Entreprise de travaux et de conduite de chantier. Fiche de démonstration.",
      jobs: [
        {
          key: "atlantique-commercial",
          title: "Commercial terrain",
          contractType: "CDD",
          salaryMin: 250000,
          salaryMax: 400000,
          educationLevel: "Baccalauréat",
          experience: "1 an",
          requiredSkills: "négociation, prospection, relation client",
          missions: "Identifier des maîtres d'ouvrage et suivre les consultations locales.",
          description: "Contrat de douze mois, déplacements sur le littoral ouest.",
        },
      ],
    },
    {
      key: "grands-ponts",
      legalName: "Clinique Les Grands Ponts",
      sector: "Santé",
      city: "Abidjan",
      description: "Établissement de soins privé. Fiche de démonstration.",
      jobs: [
        {
          key: "ponts-comptable",
          title: "Assistant comptable",
          contractType: "CDI",
          salaryMin: 220000,
          salaryMax: 320000,
          educationLevel: "Bac+2",
          experience: "1 an",
          requiredSkills: "comptabilité, Excel, discrétion, organisation",
          missions: "Saisir les pièces, préparer les rapprochements et classer les dossiers.",
          description: "Le poste est rattaché à la direction administrative et financière.",
        },
      ],
    },
    {
      key: "noe-polytechnique",
      legalName: "NOÉ Polytechnique",
      sector: "Éducation",
      city: "Abidjan",
      description:
        "Partenaire institutionnel de référence. Les programmes APPRIVOR, ADN de l'entrepreneur 360 et Anglais 5G Professionnel rejoindront NOÉ JOB ACADEMY.",
      jobs: [
        {
          key: "noe-recrutement",
          title: "Chargé de recrutement",
          contractType: "CDD",
          salaryMin: 400000,
          salaryMax: 600000,
          educationLevel: "Licence",
          experience: "2 ans",
          requiredSkills: "recrutement, entretien, rédaction, écoute",
          missions: "Qualifier les candidatures, organiser les entretiens et suivre les intégrations.",
          description:
            "Vous accompagnez les entreprises partenaires dans leurs premiers recrutements sur NOÉ WORK BANK.",
        },
        {
          key: "noe-alternance",
          title: "Alternance relation entreprises",
          contractType: "Alternance",
          salaryMin: 100000,
          salaryMax: 180000,
          educationLevel: "Licence",
          experience: "Débutant",
          requiredSkills: "communication, organisation, anglais professionnel",
          missions: "Préparer les rencontres entreprises et tenir le suivi des conventions.",
          description: "Alternance pensée pour les apprenants de NOÉ Polytechnique.",
        },
      ],
    },
  ];

  for (const entry of catalog) {
    const company = await db.company.upsert({
      where: { seedKey: entry.key },
      update: {},
      create: {
            seedKey: entry.key,
            legalName: entry.legalName,
            sector: entry.sector,
            city: entry.city,
            countryCode: "CI",
            description: entry.description,
            representative: "Direction",
            email: `contact@${entry.key}.example`,
            isDemo: true,
            verification: "verifie",
      },
    });
    for (const offer of entry.jobs) {
      await db.job.upsert({
        where: { seedKey: offer.key },
        update: {},
        create: {
          companyId: company.id,
          seedKey: offer.key,
          title: offer.title,
          description: offer.description,
          missions: offer.missions,
          requiredSkills: offer.requiredSkills,
          educationLevel: offer.educationLevel,
          experience: offer.experience,
          city: entry.city,
          countryCode: "CI",
          sector: entry.sector,
          contractType: offer.contractType,
          salaryMin: offer.salaryMin,
          salaryMax: offer.salaryMax,
          openings: 1,
          status: "publiee",
          isDemo: true,
        },
      });
    }
  }
  console.log("Catalogue NOÉ WORK BANK prêt.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
