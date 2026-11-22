export type { Application, Company, Job, Member } from "../generated/prisma/client";

export const ROLE_VALUES = [
  "candidat",
  "professionnel",
  "entrepreneur",
  "entreprise",
  "universite",
  "recruteur",
  "investisseur",
  "formateur",
  "ambassadeur",
  "admin",
  "manager",
  "comptable",
] as const;

export const SKILL_KINDS = ["technique", "comportementale"] as const;
export const VERIFICATION = ["en_attente", "verifie", "rejete"] as const;
export const JOB_STATUSES = ["brouillon", "publiee", "cloturee"] as const;
export const APPLICATION_STATUSES = [
  "envoyee",
  "recue",
  "preselectionnee",
  "entretien",
  "retenue",
  "non_retenue",
  "recrutement_confirme",
] as const;
export const PAYMENT_STATUSES = ["en_attente", "paye", "echoue", "rembourse"] as const;
export const BILLING_INTERVALS = ["acte", "mois", "an"] as const;
export const COMMISSION_STATUSES = ["en_attente", "validee", "payee", "rejetee"] as const;
export const PAYOUT_STATUSES = ["demandee", "validee", "payee", "rejetee"] as const;
export const TICKET_STATUSES = ["ouvert", "en_cours", "clos"] as const;
