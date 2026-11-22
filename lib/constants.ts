export const ROLES = [
  ["candidat", "Candidat / Étudiant", "CV, candidatures et formations"],
  ["professionnel", "Diplômé / Professionnel", "Portfolio, emplois et missions"],
  ["entrepreneur", "Entrepreneur", "Projets, partenaires et marchés"],
  ["entreprise", "Entreprise", "Recrutement, prestataires et marchés"],
  ["universite", "Université / École", "Diplômés, formations et insertion"],
  ["recruteur", "Recruteur / Cabinet RH", "Recherche, présélection et recrutement"],
  ["investisseur", "Investisseur / Partenaire", "Consultation des projets autorisés"],
  ["formateur", "Formateur", "Cours, évaluations et certifications"],
  ["ambassadeur", "Ambassadeur NOÉ", "Prospection, parrainage et commissions"],
  ["admin", "Administrateur", "Administration et gestion de la plateforme"],
  ["manager", "Manager", "Pilotage d'équipe et opérations"],
  ["comptable", "Comptable", "Gestion comptable et financière"],
] as const;

export const APPLICATION_LABELS: Record<string, string> = {
  envoyee: "Candidature envoyée",
  recue: "Candidature reçue",
  preselectionnee: "Profil présélectionné",
  entretien: "Entretien programmé",
  retenue: "Candidature retenue",
  non_retenue: "Candidature non retenue",
  recrutement_confirme: "Recrutement confirmé",
};

export const VERIFICATION_LABELS: Record<string, string> = {
  en_attente: "En attente",
  verifie: "Vérifié",
  rejete: "Rejeté",
};

export const SECTORS = [
  "Numérique",
  "BTP",
  "Agro-industrie",
  "Banque et finance",
  "Énergie",
  "Santé",
  "Éducation",
  "Commerce",
  "Transport",
  "Industrie",
  "Services",
];

export const CONTRACTS = ["CDI", "CDD", "Stage", "Alternance", "Mission", "Freelance"];

export const EDUCATION_LEVELS = [
  "Secondaire",
  "Baccalauréat",
  "Brevet de technicien",
  "Bac+2",
  "Bac+3",
  "Bac+4",
  "Bac+5",
  "Ingénieur",
  "Licence",
  "Master",
  "Doctorat",
  "Autre",
];

export const AVAILABILITY = ["Immédiate", "Sous 1 mois", "Sous 3 mois", "En poste"];

export const PROVIDERS = [
  ["cinetpay", "CinetPay"],
  ["orange", "Orange Money"],
  ["mtn", "MTN Mobile Money"],
  ["moov", "Moov Money"],
  ["wave", "Wave"],
  ["carte", "Carte bancaire"],
];

export function canPostJobs(role: string) {
  return role === "entreprise" || role === "recruteur" || role === "universite";
}

export function roleLabel(role: string) {
  return ROLES.find((item) => item[0] === role)?.[1] ?? role;
}
