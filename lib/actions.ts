"use server";

import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "./db";
import {
  APPLICATION_STATUSES,
  JOB_STATUSES,
  PAYMENT_STATUSES,
  ROLE_VALUES,
  VERIFICATION,
} from "./db/schema";
import type {
  AccountRole,
  ApplicationStatus,
  ApprovalStatus,
  CommissionStatus,
  JobStatus,
  ManagerExamType,
  PaymentStatus,
  PayoutStatus,
  VerificationStatus,
} from "./generated/prisma/client";
import { activeSubscription, companyByOwner, getJob } from "./data";
import { done, fail, integer, isUniqueViolation, pair, text } from "./http";
import { findActiveInvitation, hashInvitationToken, INVITATION_TTL_MS } from "./invitations";
import {
  removeCvDocument,
  removeManagerExamDocument,
  storeCvDocument,
  storeManagerExamDocument,
} from "./uploads";
import {
  createProfessionalId,
  createReferralCode,
  isAdminEmail,
  memberCount,
  requireAdmin,
  requireMember,
} from "./member";
import { audit, notify } from "./notify";
import { APPLICATION_LABELS } from "./constants";
import {
  applicationsHref,
  companyHref,
  conversationHref,
  favoritesHref,
  messagesHref,
  newJobHref,
  notificationsHref,
  paymentsHref,
  plansHref,
  profileHref,
  receivedApplicationHref,
  receivedApplicationsHref,
  referralHref,
  settingsHref,
  SPACE_SLUGS,
  spaceHome,
  supportHref,
} from "./space";

async function roleOf(memberId: string) {
  const row = await db.member.findUnique({ where: { id: memberId }, select: { role: true } });
  return row?.role ?? "candidat";
}

async function refresh(...paths: string[]) {
  for (const path of paths) revalidatePath(path);
}

async function savedProfile(role: string, message: string) {
  await refresh(profileHref(role), "/profil", spaceHome(role), "/tableau-de-bord", "/candidature");
  done(profileHref(role), message);
}

export async function completeOnboarding(formData: FormData) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const user = await currentUser();
  const existing = await db.member.findUnique({
    where: { clerkUserId: userId },
    select: { role: true, approvalStatus: true },
  });
  if (existing) {
    redirect(existing.approvalStatus === "approved" ? spaceHome(existing.role) : "/validation-compte");
  }

  const firstName = text(formData, "firstName", 80);
  const lastName = text(formData, "lastName", 80);
  const phone = text(formData, "phone", 30);
  const email = text(formData, "email", 120).toLowerCase();
  const role = text(formData, "role", 40);
  const countryCode = text(formData, "countryCode", 2) || "CI";
  const city = text(formData, "city", 80);
  const domain = text(formData, "domain", 120);
  const referral = text(formData, "referral", 16).toUpperCase();
  const consent = formData.get("consent") === "on";
  if (!firstName || !lastName) fail("/bienvenue", "Indiquez votre nom et vos prénoms.");
  if (!phone) fail("/bienvenue", "Le numéro de téléphone est requis.");
  if (role === "admin" || !ROLE_VALUES.includes(role as (typeof ROLE_VALUES)[number])) {
    fail("/bienvenue", "Choisissez un type de compte.");
  }
  if (!consent) fail("/bienvenue", "Le consentement est nécessaire pour créer le compte.");

  const userEmail = user?.primaryEmailAddress?.emailAddress?.trim().toLowerCase();
  if (userEmail) {
    const activeInvitation = await db.memberInvitation.findFirst({
      where: {
        email: userEmail,
        acceptedAt: null,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      select: { id: true },
    });
    if (activeInvitation) {
      fail("/bienvenue", "Ce compte dispose d’une invitation. Utilisez le lien reçu par l’administrateur.");
    }
  }

  const total = await memberCount();
  let referredById: string | null = null;
  if (referral) {
    const sponsor = await db.member.findUnique({ where: { referralCode: referral } });
    if (!sponsor) fail("/bienvenue", "Ce code de parrainage est introuvable.");
    referredById = sponsor.id;
  }

  const resolvedEmail = email || userEmail || null;
  let professionalId = createProfessionalId(countryCode);
  let referralCode = createReferralCode();
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      await db.member.create({
        data: {
          clerkUserId: userId,
          role: role as AccountRole,
          isAdmin: total === 0 || isAdminEmail(resolvedEmail),
          firstName,
          lastName,
          phone,
          email: resolvedEmail,
          countryCode,
          city,
          domain,
          professionalId,
          referralCode,
          referredById,
          locale: text(formData, "locale", 2) === "en" ? "en" : "fr",
          consentAt: new Date(),
        },
      });
      break;
    } catch (error) {
      if (!isUniqueViolation(error)) {
        console.error("Member creation failed during onboarding.", error);
        fail("/bienvenue", "Le compte n'a pas pu être créé. Réessayez.");
      }
      if (attempt === 3) {
        console.error("Could not generate unique onboarding identifiers after retries.", error);
        fail("/bienvenue", "Le compte n'a pas pu être créé. Réessayez.");
      }
      professionalId = createProfessionalId(countryCode);
      referralCode = createReferralCode();
    }
  }
  redirect(spaceHome(role));
}

export async function completeInvitedOnboarding(formData: FormData) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const token = text(formData, "invitation", 64).toLowerCase();
  const path = `/onboarding?invitation=${encodeURIComponent(token)}`;
  const user = await currentUser();
  const primaryEmail = user?.primaryEmailAddress;
  const email = primaryEmail?.emailAddress?.trim().toLowerCase();
  if (!email || primaryEmail?.verification?.status !== "verified") {
    fail(path, "Confirmez votre adresse e-mail principale avant de continuer.");
  }

  const invitation = await findActiveInvitation(token);
  if (!invitation || invitation.email !== email) {
    fail(path, "Cette invitation est invalide, expirée ou ne correspond pas à votre adresse e-mail.");
  }

  const existing = await db.member.findUnique({
    where: { clerkUserId: userId },
    select: { role: true, approvalStatus: true },
  });
  if (existing) {
    redirect(existing.approvalStatus === "approved" ? spaceHome(existing.role) : "/validation-compte");
  }

  const firstName = text(formData, "firstName", 80);
  const lastName = text(formData, "lastName", 80);
  const phone = text(formData, "phone", 40);
  const countryCode = text(formData, "countryCode", 2).toUpperCase();
  const city = text(formData, "city", 80);
  const domain = text(formData, "domain", 120);
  if (!firstName || !lastName) fail(path, "Indiquez vos prénoms et votre nom.");
  if (!phone) fail(path, "Indiquez un numéro de téléphone.");
  if (!countryCode || !city || !domain) {
    fail(path, "Indiquez votre pays, votre ville et votre département.");
  }
  if (formData.get("consent") !== "on") {
    fail(path, "Votre consentement est nécessaire pour créer le compte.");
  }
  const country = await db.country.findUnique({ where: { code: countryCode }, select: { code: true } });
  if (!country) fail(path, "Sélectionnez un pays valide.");

  let professionalId = createProfessionalId(countryCode);
  let referralCode = createReferralCode();
  let created = false;
  let invitationUnavailable = false;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      const member = await db.$transaction(async (tx) => {
        const accepted = await tx.memberInvitation.updateMany({
          where: {
            id: invitation.id,
            email,
            acceptedAt: null,
            revokedAt: null,
            expiresAt: { gt: new Date() },
          },
          data: { acceptedAt: new Date() },
        });
        if (accepted.count !== 1) return null;
        return tx.member.create({
          data: {
            clerkUserId: userId,
            role: invitation.role,
            isAdmin: invitation.role === "admin" || isAdminEmail(email),
            approvalStatus: "pending",
            firstName,
            lastName,
            phone,
            email,
            countryCode,
            city,
            domain,
            professionalId,
            referralCode,
            consentAt: new Date(),
          },
        });
      });
      if (!member) {
        invitationUnavailable = true;
        break;
      }
      created = true;
      break;
    } catch (error) {
      if (!isUniqueViolation(error)) {
        console.error("Invited member creation failed.", error);
        fail(path, "Le compte n’a pas pu être créé. Réessayez.");
      }
      if (attempt === 3) {
        console.error("Could not generate unique invited-member identifiers after retries.", error);
        fail(path, "Le compte n’a pas pu être créé. Réessayez.");
      }
      professionalId = createProfessionalId(countryCode);
      referralCode = createReferralCode();
    }
  }
  if (invitationUnavailable) fail(path, "Cette invitation a déjà été utilisée ou n’est plus valide.");
  if (!created) fail(path, "Le compte n’a pas pu être créé. Réessayez.");
  redirect("/validation-compte");
}

export async function createAdminInvitation(formData: FormData) {
  const admin = await requireAdmin();
  const email = text(formData, "email", 120).toLowerCase();
  const role = text(formData, "role", 40);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Indiquez une adresse e-mail valide.", path: null };
  }
  if (!ROLE_VALUES.includes(role as (typeof ROLE_VALUES)[number])) {
    return { error: "Sélectionnez un rôle valide.", path: null };
  }

  const existingMember = await db.member.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
    select: { id: true },
  });
  if (existingMember) return { error: "Un compte utilise déjà cette adresse e-mail.", path: null };

  const token = randomBytes(32).toString("hex");
  const now = new Date();
  const invitation = await db.$transaction(async (tx) => {
    await tx.memberInvitation.updateMany({
      where: { email, acceptedAt: null, revokedAt: null },
      data: { revokedAt: now },
    });
    return tx.memberInvitation.create({
      data: {
        email,
        role: role as AccountRole,
        tokenHash: hashInvitationToken(token),
        createdById: admin.id,
        expiresAt: new Date(now.getTime() + INVITATION_TTL_MS),
      },
    });
  });

  await audit(admin.id, "member_invitation_created", "member_invitation", invitation.id);
  await refresh("/admin/utilisateurs");
  return { error: null, path: `/sign-up?invitation=${token}` };
}

export async function updateProfile(formData: FormData) {
  const member = await requireMember();
  await db.member.update({
    where: { id: member.id },
    data: {
      firstName: text(formData, "firstName", 80) || member.firstName,
      lastName: text(formData, "lastName", 80) || member.lastName,
      phone: text(formData, "phone", 30),
      email: text(formData, "email", 120).toLowerCase(),
      countryCode: text(formData, "countryCode", 2) || "CI",
      city: text(formData, "city", 80),
      domain: text(formData, "domain", 120),
      educationLevel: text(formData, "educationLevel", 40),
      availability: text(formData, "availability", 40),
      jobType: text(formData, "jobType", 40),
      headline: text(formData, "headline", 140),
      bio: text(formData, "bio", 2000),
    },
  });
  await savedProfile(member.role, "Profil enregistré.");
}

export async function addSkill(formData: FormData) {
  const member = await requireMember();
  const name = text(formData, "name", 80);
  const kind = text(formData, "kind", 20) === "comportementale" ? "comportementale" : "technique";
  const level = Math.min(5, Math.max(1, integer(formData, "level") ?? 3));
  if (!name) fail(profileHref(member.role), "Nommez la compétence.");
  await db.skill.create({ data: { memberId: member.id, name, kind, level } });
  await savedProfile(member.role, "Compétence ajoutée.");
}

export async function deleteSkill(formData: FormData) {
  const member = await requireMember();
  await db.skill.deleteMany({ where: { id: text(formData, "id", 40), memberId: member.id } });
  await savedProfile(member.role, "Compétence retirée.");
}

export async function addEducation(formData: FormData) {
  const member = await requireMember();
  const title = text(formData, "title", 120);
  const institution = text(formData, "institution", 120);
  const kind = text(formData, "kind", 20) === "certificat" ? "certificat" : "diplome";
  const where = profileHref(member.role);
  if (!title || !institution) {
    fail(where, kind === "certificat" ? "Indiquez le certificat et l'organisme." : "Indiquez le diplôme et l'établissement.");
  }
  const uploaded = await storeCvDocument(member.id, formData.get("document"));
  if (uploaded.error) fail(where, uploaded.error);
  await db.education.create({
    data: {
      memberId: member.id,
      title,
      institution,
      year: text(formData, "year", 12),
      kind,
      documentUrl: uploaded.url || text(formData, "documentUrl", 400),
    },
  });
  await savedProfile(member.role, kind === "certificat" ? "Certificat ajouté." : "Diplôme ajouté.");
}

export async function deleteEducation(formData: FormData) {
  const member = await requireMember();
  const id = text(formData, "id", 40);
  const row = await db.education.findFirst({
    where: { id, memberId: member.id },
    select: { documentUrl: true },
  });
  await db.education.deleteMany({ where: { id, memberId: member.id } });
  if (row) await removeCvDocument(member.id, row.documentUrl);
  await savedProfile(member.role, "Document retiré.");
}

export async function addExperience(formData: FormData) {
  const member = await requireMember();
  const title = text(formData, "title", 120);
  const organization = text(formData, "organization", 120);
  if (!title || !organization) fail(profileHref(member.role), "Indiquez le poste et l'organisation.");
  await db.experience.create({
    data: {
      memberId: member.id,
      title,
      organization,
      startDate: text(formData, "startDate", 20),
      endDate: text(formData, "endDate", 20),
      current: formData.get("current") === "on",
      description: text(formData, "description", 1000),
    },
  });
  await savedProfile(member.role, "Expérience ajoutée.");
}

export async function deleteExperience(formData: FormData) {
  const member = await requireMember();
  await db.experience.deleteMany({ where: { id: text(formData, "id", 40), memberId: member.id } });
  await savedProfile(member.role, "Expérience retirée.");
}

export async function addPortfolio(formData: FormData) {
  const member = await requireMember();
  const title = text(formData, "title", 120);
  if (!title) fail(profileHref(member.role), "Donnez un titre à la réalisation.");
  await db.portfolioItem.create({
    data: {
      memberId: member.id,
      title,
      description: text(formData, "description", 500),
      url: text(formData, "url", 400),
    },
  });
  await savedProfile(member.role, "Réalisation ajoutée au portfolio.");
}

export async function deletePortfolio(formData: FormData) {
  const member = await requireMember();
  await db.portfolioItem.deleteMany({ where: { id: text(formData, "id", 40), memberId: member.id } });
  await savedProfile(member.role, "Réalisation retirée.");
}

export async function addReference(formData: FormData) {
  const member = await requireMember();
  const name = text(formData, "name", 120);
  if (!name) fail(profileHref(member.role), "Indiquez le nom de la référence.");
  await db.professionalReference.create({
    data: {
      memberId: member.id,
      name,
      role: text(formData, "role", 80),
      organization: text(formData, "organization", 120),
      contact: text(formData, "contact", 120),
      note: text(formData, "note", 400),
    },
  });
  await savedProfile(member.role, "Référence ajoutée.");
}

export async function deleteReference(formData: FormData) {
  const member = await requireMember();
  await db.professionalReference.deleteMany({
    where: { id: text(formData, "id", 40), memberId: member.id },
  });
  await savedProfile(member.role, "Référence retirée.");
}

export async function updateSettings(formData: FormData) {
  const member = await requireMember();
  await db.member.update({
    where: { id: member.id },
    data: {
      locale: text(formData, "locale", 2) === "en" ? "en" : "fr",
      shareWithRecruiters: formData.get("shareWithRecruiters") === "on",
      cvPublic: formData.get("cvPublic") === "on",
    },
  });
  await refresh(settingsHref(member.role), "/parametres", profileHref(member.role), "/profil");
  done(settingsHref(member.role), "Préférences enregistrées.");
}

export async function requestDeletion() {
  const member = await requireMember();
  await db.member.update({ where: { id: member.id }, data: { deletionRequestedAt: new Date() } });
  await db.ticket.create({
    data: {
      memberId: member.id,
      subject: "Demande de suppression de compte",
      body: `${member.firstName} ${member.lastName} demande la suppression de ses données.`,
    },
  });
  await audit(member.id, "deletion_requested", "member", member.id);
  done(settingsHref(member.role), "Demande de suppression enregistrée. L'équipe NOÉ la traitera.");
}

export async function toggleFavorite(formData: FormData) {
  const member = await requireMember();
  const jobId = text(formData, "jobId", 40);
  const existing = await db.favorite.findUnique({
    where: { memberId_jobId: { memberId: member.id, jobId } },
  });
  if (existing) {
    await db.favorite.delete({ where: { memberId_jobId: { memberId: member.id, jobId } } });
  } else {
    await db.favorite.create({ data: { memberId: member.id, jobId } });
  }
  await refresh(`/emplois/${jobId}`, favoritesHref(member.role), "/favoris");
  redirect(`/emplois/${jobId}`);
}

export async function applyToJob(formData: FormData) {
  const member = await requireMember();
  const jobId = text(formData, "jobId", 40);
  const job = await getJob(jobId);
  if (!job || job.job.status !== "publiee") fail("/emplois", "Cette offre n'est plus disponible.");
  if (job.company.ownerMemberId === member.id) {
    fail(`/emplois/${jobId}`, "Vous ne pouvez pas postuler à votre propre offre.");
  }
  try {
    await db.application.create({
      data: {
        jobId,
        memberId: member.id,
        coverLetter: text(formData, "coverLetter", 4000),
        status: "envoyee",
      },
    });
  } catch (error) {
    if (isUniqueViolation(error)) fail(`/emplois/${jobId}`, "Vous avez déjà postulé à cette offre.");
    fail(`/emplois/${jobId}`, "La candidature n'a pas pu être envoyée.");
  }
  if (job.company.ownerMemberId) {
    await notify(
      job.company.ownerMemberId,
      "Nouvelle candidature",
      `${member.firstName} ${member.lastName} a postulé à « ${job.job.title} ».`,
      receivedApplicationsHref(await roleOf(job.company.ownerMemberId)),
    );
  }
  await notify(
    member.id,
    "Candidature envoyée",
    `Votre dossier pour « ${job.job.title} » a bien été transmis.`,
    applicationsHref(member.role),
  );
  await audit(member.id, "application_sent", "job", jobId);
  await refresh(applicationsHref(member.role), "/candidatures", `/emplois/${jobId}`);
  done(applicationsHref(member.role), "Candidature envoyée.");
}

export async function saveCompany(formData: FormData) {
  const member = await requireMember();
  const legalName = text(formData, "legalName", 160);
  if (!legalName) fail(companyHref(member.role), "La dénomination sociale est requise.");
  const values = {
    legalName,
    registrationNumber: text(formData, "registrationNumber", 60),
    sector: text(formData, "sector", 80),
    address: text(formData, "address", 200),
    city: text(formData, "city", 80),
    countryCode: text(formData, "countryCode", 2) || "CI",
    phone: text(formData, "phone", 30),
    email: text(formData, "email", 120),
    representative: text(formData, "representative", 120),
    description: text(formData, "description", 3000),
    kind: member.role === "universite" ? "universite" : member.role === "recruteur" ? "cabinet" : "entreprise",
  };
  const current = await companyByOwner(member.id);
  let companyId = current?.id;
  if (current) {
    await db.company.update({ where: { id: current.id }, data: values });
  } else {
    const created = await db.company.create({
      data: { ...values, ownerMemberId: member.id, verification: "en_attente" },
    });
    companyId = created.id;
  }
  const docLabel = text(formData, "documentLabel", 80);
  const docUrl = text(formData, "documentUrl", 400);
  if (companyId && docLabel && docUrl) {
    await db.companyDocument.create({ data: { companyId, label: docLabel, url: docUrl } });
  }
  await audit(member.id, "company_saved", "company", companyId);
  await refresh(companyHref(member.role), "/entreprise", "/entreprises");
  done(companyHref(member.role), "Fiche entreprise enregistrée. La vérification des documents est en cours.");
}

export async function publishJob(formData: FormData) {
  const member = await requireMember();
  const company = await companyByOwner(member.id);
  if (!company) fail(companyHref(member.role), "Créez d'abord la fiche de votre organisation.");
  const title = text(formData, "title", 140);
  const description = text(formData, "description", 8000);
  if (!title || !description) fail(newJobHref(member.role), "Le titre et la description sont requis.");
  const created = await db.job.create({
    data: {
      companyId: company.id,
      title,
      description,
      missions: text(formData, "missions", 4000),
      requiredSkills: text(formData, "requiredSkills", 500),
      educationLevel: text(formData, "educationLevel", 40),
      experience: text(formData, "experience", 80),
      city: text(formData, "city", 80),
      countryCode: text(formData, "countryCode", 2) || company.countryCode,
      sector: text(formData, "sector", 80) || company.sector,
      contractType: text(formData, "contractType", 40) || "CDI",
      salaryMin: integer(formData, "salaryMin"),
      salaryMax: integer(formData, "salaryMax"),
      currency: "XOF",
      deadline: text(formData, "deadline", 20),
      openings: Math.max(1, integer(formData, "openings") ?? 1),
      status: "publiee",
    },
  });
  const subscription = await activeSubscription(company.id);
  if (!subscription) {
    const plan = await db.plan.findUnique({ where: { code: "publication_offre" } });
    await db.payment.create({
      data: {
        memberId: member.id,
        companyId: company.id,
        planId: plan?.id,
        jobId: created.id,
        amount: plan?.amount ?? 15000,
        currency: plan?.currency ?? "XOF",
        provider: "cinetpay",
        status: "en_attente",
        reference: `WB-${Date.now().toString(36).toUpperCase()}`,
        purpose: `Publication de l'offre « ${title} »`,
      },
    });
  }
  await audit(member.id, "job_published", "job", created.id);
  await refresh("/emplois", companyHref(member.role), "/entreprise");
  done(companyHref(member.role), "Offre publiée.");
}

export async function setJobStatus(formData: FormData) {
  const member = await requireMember();
  const company = await companyByOwner(member.id);
  const status = text(formData, "status", 20);
  if (!company || !JOB_STATUSES.includes(status as (typeof JOB_STATUSES)[number])) {
    fail(companyHref(member.role), "Action impossible.");
  }
  await db.job.updateMany({
    where: { id: text(formData, "jobId", 40), companyId: company.id },
    data: { status: status as JobStatus },
  });
  await refresh(companyHref(member.role), "/entreprise", "/emplois");
  done(companyHref(member.role), "Statut de l'offre mis à jour.");
}

async function assertCompanyApplication(applicationId: string, ownerId: string) {
  const row = await db.application.findUnique({
    where: { id: applicationId },
    include: { jobs: { include: { companies: true } }, members: true },
  });
  if (!row || row.jobs.companies.ownerMemberId !== ownerId) return null;
  const { jobs: jobWithCompany, members: member, ...application } = row;
  const { companies: company, ...job } = jobWithCompany;
  return { application, job, company, member };
}

export async function updateApplication(formData: FormData) {
  const member = await requireMember();
  const applicationId = text(formData, "applicationId", 40);
  const status = text(formData, "status", 40);
  if (!APPLICATION_STATUSES.includes(status as (typeof APPLICATION_STATUSES)[number])) {
    fail(receivedApplicationsHref(member.role), "Statut inconnu.");
  }
  const row = await assertCompanyApplication(applicationId, member.id);
  if (!row) fail(receivedApplicationsHref(member.role), "Candidature introuvable.");
  const next = status as (typeof APPLICATION_STATUSES)[number];
  await db.application.update({ where: { id: applicationId }, data: { status: next as ApplicationStatus } });
  await notify(
    row.member.id,
    "Suivi de candidature",
    `« ${row.job.title} » : ${APPLICATION_LABELS[next]}.`,
    applicationsHref(row.member.role),
  );
  await audit(member.id, "application_status", "application", applicationId);
  await refresh(receivedApplicationsHref(member.role), "/entreprise/candidatures", applicationsHref(row.member.role), "/candidatures");
  done(receivedApplicationHref(member.role, applicationId), "Statut mis à jour.");
}

export async function scheduleInterview(formData: FormData) {
  const member = await requireMember();
  const applicationId = text(formData, "applicationId", 40);
  const when = text(formData, "scheduledAt", 40);
  const row = await assertCompanyApplication(applicationId, member.id);
  if (!row) fail(receivedApplicationsHref(member.role), "Candidature introuvable.");
  const scheduledAt = new Date(when);
  if (Number.isNaN(scheduledAt.getTime())) {
    fail(receivedApplicationHref(member.role, applicationId), "Indiquez une date d'entretien valide.");
  }
  await db.interview.create({
    data: {
      applicationId,
      scheduledAt,
      location: text(formData, "location", 200),
      notes: text(formData, "notes", 1000),
    },
  });
  await db.application.update({ where: { id: applicationId }, data: { status: "entretien" } });
  await notify(
    row.member.id,
    "Entretien programmé",
    `Un entretien est proposé pour « ${row.job.title} ».`,
    applicationsHref(row.member.role),
  );
  await refresh(receivedApplicationsHref(member.role), "/entreprise/candidatures", applicationsHref(row.member.role), "/candidatures");
  done(receivedApplicationHref(member.role, applicationId), "Entretien programmé.");
}

export async function startConversation(formData: FormData) {
  const member = await requireMember();
  const jobId = text(formData, "jobId", 40);
  const job = await getJob(jobId);
  if (!job?.company.ownerMemberId) {
    fail(`/emplois/${jobId}`, "Cette offre de démonstration n'a pas encore de recruteur associé.");
  }
  if (job.company.ownerMemberId === member.id) {
    fail(`/emplois/${jobId}`, "Vous êtes déjà le recruteur de cette offre.");
  }
  const [memberA, memberB] = pair(member.id, job.company.ownerMemberId);
  const existing = await db.conversation.findFirst({ where: { memberA, memberB, jobId } });
  if (existing) redirect(conversationHref(member.role, existing.id));
  const created = await db.conversation.create({
    data: {
      subject: job.job.title,
      jobId,
      memberA,
      memberB,
    },
  });
  const body =
    text(formData, "body", 4000) ||
    `Bonjour, je vous contacte au sujet de l'offre « ${job.job.title} ».`;
  await db.message.create({ data: { conversationId: created.id, senderId: member.id, body } });
  await notify(
    job.company.ownerMemberId,
    "Nouveau message",
    body.slice(0, 140),
    conversationHref(await roleOf(job.company.ownerMemberId), created.id),
  );
  redirect(conversationHref(member.role, created.id));
}

export async function sendMessage(formData: FormData) {
  const member = await requireMember();
  const conversationId = text(formData, "conversationId", 40);
  const body = text(formData, "body", 4000);
  if (!body) fail(conversationHref(member.role, conversationId), "Écrivez un message.");
  const conversation = await db.conversation.findUnique({ where: { id: conversationId } });
  if (!conversation || (conversation.memberA !== member.id && conversation.memberB !== member.id)) {
    fail(messagesHref(member.role), "Conversation introuvable.");
  }
  await db.message.create({ data: { conversationId, senderId: member.id, body } });
  const other = conversation.memberA === member.id ? conversation.memberB : conversation.memberA;
  await notify(other, "Nouveau message", body.slice(0, 140), conversationHref(await roleOf(other), conversationId));
  await refresh(conversationHref(member.role, conversationId), `/messages/${conversationId}`);
  redirect(conversationHref(member.role, conversationId));
}

export async function reportMessage(formData: FormData) {
  const member = await requireMember();
  const messageId = text(formData, "messageId", 40);
  const message = await db.message.findUnique({ where: { id: messageId } });
  if (!message) fail(messagesHref(member.role), "Message introuvable.");
  const conversation = await db.conversation.findUnique({ where: { id: message.conversationId } });
  if (!conversation || (conversation.memberA !== member.id && conversation.memberB !== member.id)) {
    fail(messagesHref(member.role), "Message introuvable.");
  }
  await db.message.update({ where: { id: messageId }, data: { reported: true } });
  await audit(member.id, "message_reported", "message", messageId);
  done(conversationHref(member.role, message.conversationId), "Message signalé. L'équipe de modération est prévenue.");
}

export async function markNotificationsRead() {
  const member = await requireMember();
  await db.notification.updateMany({
    where: { memberId: member.id, readAt: null },
    data: { readAt: new Date() },
  });
  await refresh(notificationsHref(member.role), "/notifications", spaceHome(member.role), "/tableau-de-bord");
  redirect(notificationsHref(member.role));
}

export async function requestPlan(formData: FormData) {
  const member = await requireMember();
  const planId = text(formData, "planId", 40);
  const provider = text(formData, "provider", 20) || "cinetpay";
  const plan = await db.plan.findUnique({ where: { id: planId } });
  if (!plan || !plan.active) fail(plansHref(member.role), "Cette offre tarifaire n'est plus disponible.");
  const company = await companyByOwner(member.id);
  await db.payment.create({
    data: {
      memberId: member.id,
      companyId: company?.id,
      planId: plan.id,
      amount: plan.amount,
      currency: plan.currency,
      provider,
      status: "en_attente",
      reference: `WB-${Date.now().toString(36).toUpperCase()}`,
      purpose: plan.name,
    },
  });
  await refresh(paymentsHref(member.role), plansHref(member.role), "/paiements", "/abonnements");
  done(
    paymentsHref(member.role),
    "Demande enregistrée. Le règlement sera confirmé dès l'activation de CinetPay, ou par l'administration.",
  );
}

export async function requestPayout() {
  const member = await requireMember();
  if (member.role !== "ambassadeur" && !member.isAdmin) {
    fail(referralHref(member.role), "Les reversements concernent les ambassadeurs NOÉ.");
  }
  const open = await db.commission.findMany({
    where: { ambassadorId: member.id, status: "validee", payoutId: null },
  });
  const amount = open.reduce((sum, item) => sum + item.amount, 0);
  if (amount <= 0) fail(referralHref(member.role), "Aucune commission validée n'est disponible.");
  const payout = await db.payout.create({
    data: { memberId: member.id, amount, currency: "XOF", status: "demandee" },
  });
  await db.commission.updateMany({
    where: { id: { in: open.map((item) => item.id) } },
    data: { payoutId: payout.id },
  });
  await audit(member.id, "payout_requested", "payout", payout.id);
  done(referralHref(member.role), "Demande de reversement envoyée.");
}

export async function createTicket(formData: FormData) {
  const member = await requireMember();
  const subject = text(formData, "subject", 140);
  const body = text(formData, "body", 4000);
  if (!subject || !body) fail(supportHref(member.role), "Décrivez votre demande.");
  await db.ticket.create({ data: { memberId: member.id, subject, body } });
  done(supportHref(member.role), "Votre demande a été transmise à l'équipe NOÉ.");
}

function parseDateOnly(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) return null;
  return date;
}

export async function createManagerOpportunity(formData: FormData) {
  const member = await requireMember();
  if (member.role !== "manager") {
    return { error: "Cette action est réservée à l’espace Manager." };
  }

  const title = text(formData, "title", 160);
  const validFrom = parseDateOnly(text(formData, "validFrom", 10));
  const validUntil = parseDateOnly(text(formData, "validUntil", 10));
  const description = text(formData, "description", 5000);
  const location = text(formData, "location", 180);
  const rawRegistrationLink = text(formData, "registrationLink", 1000);
  const contact = text(formData, "contact", 180);
  const contactPeople = text(formData, "contactPeople", 1200);

  if (!title || !validFrom || !validUntil || !description) {
    return { error: "Renseignez le titre, la période de validité et la description." };
  }
  if (validFrom > validUntil) {
    return { error: "La fin de validité doit être postérieure au début." };
  }

  let registrationLink: string | null = null;
  if (rawRegistrationLink) {
    try {
      const parsed = new URL(rawRegistrationLink);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        return { error: "Le lien d’inscription doit commencer par http:// ou https://." };
      }
      registrationLink = parsed.toString();
    } catch {
      return { error: "Saisissez un lien d’inscription valide." };
    }
  }

  await db.opportunity.create({
    data: {
      title,
      validFrom,
      validUntil,
      description,
      location: location || null,
      registrationLink,
      contact: contact || null,
      contactPeople: contactPeople || null,
      createdById: member.id,
    },
  });
  await refresh("/manager/opportunites");
  return { success: true };
}

export async function createManagerTraining(formData: FormData) {
  const member = await requireMember();
  if (member.role !== "manager") {
    return { error: "Cette action est réservée à l’espace Manager." };
  }

  const title = text(formData, "title", 160);
  const startDate = parseDateOnly(text(formData, "startDate", 10));
  const validFrom = parseDateOnly(text(formData, "validFrom", 10));
  const validUntil = parseDateOnly(text(formData, "validUntil", 10));
  const description = text(formData, "description", 5000);
  const location = text(formData, "location", 180);
  const rawRegistrationLink = text(formData, "registrationLink", 1000);
  const contact = text(formData, "contact", 180);
  const contactPeople = text(formData, "contactPeople", 1200);

  if (!title || !startDate || !validFrom || !validUntil || !description) {
    return { error: "Renseignez le titre, la date de début, la période de validité et la description." };
  }
  if (validFrom > validUntil) {
    return { error: "La fin de validité doit être postérieure au début." };
  }

  let registrationLink: string | null = null;
  if (rawRegistrationLink) {
    try {
      const parsed = new URL(rawRegistrationLink);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        return { error: "Le lien d’inscription doit commencer par http:// ou https://." };
      }
      registrationLink = parsed.toString();
    } catch {
      return { error: "Saisissez un lien d’inscription valide." };
    }
  }

  await db.managerTraining.create({
    data: {
      managerId: member.id,
      title,
      startDate,
      validFrom,
      validUntil,
      description,
      location: location || null,
      registrationLink,
      contact: contact || null,
      contactPeople: contactPeople || null,
    },
  });
  await refresh("/manager/formation");
  return { success: true };
}

export async function createManagerEmploymentPost(formData: FormData) {
  const member = await requireMember();
  if (member.role !== "manager") {
    return { error: "Cette action est réservée à l’espace Manager." };
  }

  const title = text(formData, "title", 160);
  const companyName = text(formData, "companyName", 180);
  const location = text(formData, "location", 180);
  const offerDate = parseDateOnly(text(formData, "offerDate", 10));
  const description = text(formData, "description", 5000);
  const mission = text(formData, "mission", 4000);
  const profile = text(formData, "profile", 3000);
  const level = text(formData, "level", 120);
  const workplace = text(formData, "workplace", 180);
  const experience = text(formData, "experience", 180);
  const salary = text(formData, "salary", 180);
  const email = text(formData, "email", 254).toLowerCase();

  if (!title || !companyName || !location || !offerDate || !description || !mission || !profile || !level || !workplace || !experience || !email) {
    return { error: "Renseignez les informations principales et les détails obligatoires du poste." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Saisissez une adresse e-mail valide." };
  }

  await db.managerEmploymentPost.create({
    data: {
      managerId: member.id,
      title,
      companyName,
      location,
      offerDate,
      description,
      mission,
      profile,
      level,
      workplace,
      experience,
      salary: salary || null,
      email,
    },
  });
  await refresh("/manager/emplois-stages");
  return { success: true };
}

export async function validateEmploymentPost(postId: string) {
  const member = await requireMember();
  const isAdmin = member.isAdmin || member.role === "admin";
  if (member.role !== "manager" && !isAdmin) {
    return { error: "Cette action est réservée aux managers et administrateurs." };
  }
  if (!/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(postId)) {
    return { error: "Cette offre est invalide." };
  }

  const result = await db.managerEmploymentPost.updateMany({
    where: { id: postId, validatedAt: null },
    data: { validatedAt: new Date() },
  });
  if (result.count === 0) {
    const existing = await db.managerEmploymentPost.findUnique({
      where: { id: postId },
      select: { id: true },
    });
    if (!existing) return { error: "Cette offre n’existe plus." };
  } else {
    await audit(member.id, "employment_post_validated", "manager_employment_post", postId);
  }

  await refresh("/manager/emplois-stages", "/admin/offres");
  return { success: true };
}

export async function deleteManagerEmploymentPost(postId: string) {
  const member = await requireMember();
  if (member.role !== "manager") {
    return { error: "Cette action est réservée à l’espace Manager." };
  }
  if (!/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(postId)) {
    return { error: "Cette offre est invalide." };
  }

  const result = await db.managerEmploymentPost.deleteMany({ where: { id: postId } });
  if (result.count === 0) return { error: "Cette offre n’existe plus." };

  await refresh("/manager/emplois-stages");
  return { success: true };
}

export async function createManagerOnlineEmploymentPost(formData: FormData) {
  const member = await requireMember();
  if (member.role !== "manager") {
    return { error: "Cette action est réservée à l’espace Manager." };
  }

  const title = text(formData, "title", 180);
  const description = text(formData, "description", 5000);
  const companyName = text(formData, "companyName", 180);
  const rawRegistrationLink = text(formData, "registrationLink", 1000);
  const contact = text(formData, "contact", 180);

  if (!title || !description || !companyName) {
    return { error: "Renseignez le titre, la description et l’entreprise." };
  }

  let registrationLink: string | null = null;
  if (rawRegistrationLink) {
    try {
      const parsed = new URL(rawRegistrationLink);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        return { error: "Le lien d’inscription doit commencer par http:// ou https://." };
      }
      registrationLink = parsed.toString();
    } catch {
      return { error: "Saisissez un lien d’inscription valide." };
    }
  }

  await db.managerOnlineEmploymentPost.create({
    data: {
      managerId: member.id,
      title,
      description,
      companyName,
      registrationLink,
      contact: contact || null,
    },
  });
  await refresh("/manager/emploi-ligne");
  return { success: true };
}

export async function validateManagerOnlineEmploymentPost(postId: string) {
  const member = await requireMember();
  if (member.role !== "manager") {
    return { error: "Cette action est réservée à l’espace Manager." };
  }
  if (!/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(postId)) {
    return { error: "Cet emploi en ligne est invalide." };
  }

  const result = await db.managerOnlineEmploymentPost.updateMany({
    where: { id: postId, validatedAt: null },
    data: { validatedAt: new Date() },
  });
  if (result.count === 0) {
    const existing = await db.managerOnlineEmploymentPost.findUnique({
      where: { id: postId },
      select: { id: true },
    });
    if (!existing) return { error: "Cet emploi en ligne n’existe plus." };
  }

  await refresh("/manager/emploi-ligne", "/emploi-en-ligne", "/");
  return { success: true };
}

export async function deleteManagerOnlineEmploymentPost(postId: string) {
  const member = await requireMember();
  if (member.role !== "manager") {
    return { error: "Cette action est réservée à l’espace Manager." };
  }
  if (!/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(postId)) {
    return { error: "Cet emploi en ligne est invalide." };
  }

  const result = await db.managerOnlineEmploymentPost.deleteMany({ where: { id: postId } });
  if (result.count === 0) return { error: "Cet emploi en ligne n’existe plus." };

  await refresh("/manager/emploi-ligne", "/emploi-en-ligne", "/");
  return { success: true };
}

export async function createManagerCompanyListing(formData: FormData) {
  const member = await requireMember();
  if (member.role !== "manager") {
    return { error: "Cette action est réservée à l’espace Manager." };
  }

  const title = text(formData, "title", 180);
  const description = text(formData, "description", 5000);
  const companyName = text(formData, "companyName", 180);
  const location = text(formData, "location", 180);
  const rawWebsite = text(formData, "website", 1000);
  const contact = text(formData, "contact", 180);

  if (!title || !description || !companyName || !location) {
    return { error: "Renseignez le titre, la description, l’entreprise et la localisation." };
  }

  let website: string | null = null;
  if (rawWebsite) {
    try {
      const parsed = new URL(rawWebsite);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        return { error: "Le site web doit commencer par http:// ou https://." };
      }
      website = parsed.toString();
    } catch {
      return { error: "Saisissez une adresse de site web valide." };
    }
  }

  await db.managerCompanyListing.create({
    data: {
      managerId: member.id,
      title,
      description,
      companyName,
      location,
      website,
      contact: contact || null,
    },
  });
  await refresh("/manager/entreprises");
  return { success: true };
}

export async function validateManagerCompanyListing(listingId: string) {
  const member = await requireMember();
  if (member.role !== "manager") {
    return { error: "Cette action est réservée à l’espace Manager." };
  }
  if (!/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(listingId)) {
    return { error: "Cette entreprise est invalide." };
  }

  const result = await db.managerCompanyListing.updateMany({
    where: { id: listingId, validatedAt: null },
    data: { validatedAt: new Date() },
  });
  if (result.count === 0) {
    const existing = await db.managerCompanyListing.findUnique({
      where: { id: listingId },
      select: { id: true },
    });
    if (!existing) return { error: "Cette entreprise n’existe plus." };
  }

  await refresh("/manager/entreprises", "/entreprises", "/");
  return { success: true };
}

export async function deleteManagerCompanyListing(listingId: string) {
  const member = await requireMember();
  if (member.role !== "manager") {
    return { error: "Cette action est réservée à l’espace Manager." };
  }
  if (!/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(listingId)) {
    return { error: "Cette entreprise est invalide." };
  }

  const result = await db.managerCompanyListing.deleteMany({ where: { id: listingId } });
  if (result.count === 0) return { error: "Cette entreprise n’existe plus." };

  await refresh("/manager/entreprises", "/entreprises", "/");
  return { success: true };
}

export async function validateManagerOpportunity(opportunityId: string) {
  const member = await requireMember();
  if (member.role !== "manager") {
    return { error: "Cette action est réservée à l’espace Manager." };
  }
  if (!/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(opportunityId)) {
    return { error: "Cette opportunité est invalide." };
  }

  const result = await db.opportunity.updateMany({
    where: { id: opportunityId, validatedAt: null },
    data: { validatedAt: new Date() },
  });
  if (result.count === 0) {
    const existing = await db.opportunity.findUnique({
      where: { id: opportunityId },
      select: { id: true },
    });
    if (!existing) return { error: "Cette opportunité n’existe plus." };
  }

  await refresh("/manager/opportunites");
  return { success: true };
}

export async function deleteManagerOpportunity(opportunityId: string) {
  const member = await requireMember();
  if (member.role !== "manager") {
    return { error: "Cette action est réservée à l’espace Manager." };
  }
  if (!/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(opportunityId)) {
    return { error: "Cette opportunité est invalide." };
  }

  const result = await db.opportunity.deleteMany({ where: { id: opportunityId } });
  if (result.count === 0) return { error: "Cette opportunité n’existe plus." };

  await refresh("/manager/opportunites");
  return { success: true };
}

export async function validateManagerTraining(trainingId: string) {
  const member = await requireMember();
  if (member.role !== "manager") {
    return { error: "Cette action est réservée à l’espace Manager." };
  }
  if (!/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(trainingId)) {
    return { error: "Cette formation est invalide." };
  }

  const result = await db.managerTraining.updateMany({
    where: { id: trainingId, validatedAt: null },
    data: { validatedAt: new Date() },
  });
  if (result.count === 0) {
    const existing = await db.managerTraining.findUnique({
      where: { id: trainingId },
      select: { id: true },
    });
    if (!existing) return { error: "Cette formation n’existe plus." };
  }

  await refresh("/manager/formation");
  return { success: true };
}

export async function deleteManagerTraining(trainingId: string) {
  const member = await requireMember();
  if (member.role !== "manager") {
    return { error: "Cette action est réservée à l’espace Manager." };
  }
  if (!/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(trainingId)) {
    return { error: "Cette formation est invalide." };
  }

  const result = await db.managerTraining.deleteMany({ where: { id: trainingId } });
  if (result.count === 0) return { error: "Cette formation n’existe plus." };

  await refresh("/manager/formation");
  return { success: true };
}

function isManagerExamType(value: string): value is ManagerExamType {
  return value === "examen" || value === "concours";
}

export async function createManagerExamConcours(formData: FormData) {
  const member = await requireMember();
  if (member.role !== "manager") {
    return { error: "Cette action est réservée à l’espace Manager." };
  }

  const title = text(formData, "title", 180);
  const rawType = text(formData, "type", 20);
  const validFrom = parseDateOnly(text(formData, "validFrom", 10));
  const validUntil = parseDateOnly(text(formData, "validUntil", 10));
  const description = text(formData, "description", 5000);
  const ministry = text(formData, "ministry", 180);

  if (!title || !isManagerExamType(rawType) || !validFrom || !validUntil || !description) {
    return { error: "Renseignez le titre, le type, la période de validité et la description." };
  }
  if (validFrom > validUntil) {
    return { error: "La fin de validité doit être postérieure au début." };
  }

  const document = await storeManagerExamDocument(member.id, formData.get("document"));
  if ("error" in document) return { error: document.error };

  try {
    await db.managerExamConcours.create({
      data: {
        managerId: member.id,
        title,
        type: rawType,
        validFrom,
        validUntil,
        description,
        ministry: ministry || null,
        documentUrl: document.url,
        documentName: document.name,
      },
    });
  } catch (error) {
    if (document.url) await removeManagerExamDocument(member.id, document.url);
    throw error;
  }

  await refresh("/manager/examen-concours");
  return { success: true };
}

export async function validateManagerExamConcours(examId: string) {
  const member = await requireMember();
  if (member.role !== "manager") {
    return { error: "Cette action est réservée à l’espace Manager." };
  }
  if (!/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(examId)) {
    return { error: "Cet examen ou concours est invalide." };
  }

  const result = await db.managerExamConcours.updateMany({
    where: { id: examId, validatedAt: null },
    data: { validatedAt: new Date() },
  });
  if (result.count === 0) {
    const existing = await db.managerExamConcours.findUnique({
      where: { id: examId },
      select: { id: true },
    });
    if (!existing) return { error: "Cet examen ou concours n’existe plus." };
  }

  await refresh("/manager/examen-concours", "/concours-examens", "/");
  return { success: true };
}

export async function deleteManagerExamConcours(examId: string) {
  const member = await requireMember();
  if (member.role !== "manager") {
    return { error: "Cette action est réservée à l’espace Manager." };
  }
  if (!/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(examId)) {
    return { error: "Cet examen ou concours est invalide." };
  }

  const existing = await db.managerExamConcours.findUnique({
    where: { id: examId },
    select: { managerId: true, documentUrl: true },
  });
  if (!existing) return { error: "Cet examen ou concours n’existe plus." };

  const result = await db.managerExamConcours.deleteMany({ where: { id: examId } });
  if (result.count === 0) return { error: "Cet examen ou concours n’existe plus." };
  await removeManagerExamDocument(existing.managerId, existing.documentUrl);

  await refresh("/manager/examen-concours", "/concours-examens", "/");
  return { success: true };
}

export async function submitOpportunityApplication(formData: FormData) {
  const opportunityId = text(formData, "opportunityId", 36);
  if (!/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(opportunityId)) {
    fail("/", "Cette opportunité est invalide.");
  }

  const path = `/opportunites/${opportunityId}`;
  const fullName = text(formData, "fullName", 160);
  const email = text(formData, "email", 254).toLowerCase();
  const phone = text(formData, "phone", 30);

  if (fullName.length < 2) fail(path, "Saisissez votre nom complet.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail(path, "Saisissez une adresse e-mail valide.");
  if (phone.replace(/\D/g, "").length < 6) fail(path, "Saisissez un numéro de téléphone valide.");

  const opportunity = await db.opportunity.findFirst({
    where: { id: opportunityId, validatedAt: { not: null } },
    select: { title: true },
  });
  if (!opportunity) fail("/opportunités", "Cette opportunité n’est plus disponible.");

  await db.opportunityApplication.create({
    data: {
      opportunityId,
      opportunityTitle: opportunity.title,
      fullName,
      email,
      phone,
    },
  });
  await refresh(path);
  done(path, "Votre demande a bien été enregistrée.");
}

export async function setLocale(formData: FormData) {
  const locale = text(formData, "locale", 2) === "en" ? "en" : "fr";
  const { cookies } = await import("next/headers");
  (await cookies()).set("noe-locale", locale, { path: "/", maxAge: 60 * 60 * 24 * 365 });
  const { userId } = await auth();
  if (userId) {
    await db.member.updateMany({ where: { clerkUserId: userId }, data: { locale } });
  }
  redirect(locale === "en" ? "/langue?ok=English%20saved" : "/langue?ok=Langue%20enregistr%C3%A9e");
}

export async function setMemberFlags(formData: FormData) {
  const admin = await requireAdmin();
  const memberId = text(formData, "memberId", 40);
  const verification = text(formData, "verification", 20);
  const role = text(formData, "role", 40);
  if (!ROLE_VALUES.includes(role as (typeof ROLE_VALUES)[number])) {
    fail("/admin/utilisateurs", "Rôle invalide.");
  }
  await db.member.updateMany({
    where: { id: memberId },
    data: {
      isAdmin: formData.get("isAdmin") === "on",
      verification: VERIFICATION.includes(verification as (typeof VERIFICATION)[number])
        ? (verification as VerificationStatus)
        : "en_attente",
      role: role as AccountRole,
    },
  });
  await audit(admin.id, "member_updated", "member", memberId);
  await refresh("/admin/utilisateurs");
  done("/admin/utilisateurs", "Membre mis à jour.");
}

export async function setMemberApproval(formData: FormData) {
  const admin = await requireAdmin();
  const memberId = text(formData, "memberId", 40);
  const status = text(formData, "approvalStatus", 20);
  const allowed: ApprovalStatus[] = ["pending", "approved", "rejected"];
  if (!allowed.includes(status as ApprovalStatus)) {
    fail("/admin/utilisateurs", "Statut de validation invalide.");
  }
  const target = await db.member.findUnique({ where: { id: memberId }, select: { id: true } });
  if (!target) fail("/admin/utilisateurs", "Utilisateur introuvable.");
  if (target.id === admin.id && status !== "approved") {
    fail("/admin/utilisateurs", "Vous ne pouvez pas suspendre votre propre compte.");
  }

  await db.member.update({
    where: { id: target.id },
    data: { approvalStatus: status as ApprovalStatus },
  });
  await audit(admin.id, `member_${status}`, "member", target.id);
  await refresh("/admin/utilisateurs");
  done("/admin/utilisateurs", "Statut du compte mis à jour.");
}

export async function deleteMemberAdmin(formData: FormData) {
  const admin = await requireAdmin();
  const memberId = text(formData, "memberId", 40);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(memberId)) {
    fail("/admin/utilisateurs", "Utilisateur invalide.");
  }

  const target = await db.member.findUnique({
    where: { id: memberId },
    select: { id: true, clerkUserId: true, isAdmin: true, role: true },
  });
  if (!target) fail("/admin/utilisateurs", "Utilisateur introuvable.");
  if (target.id === admin.id) {
    fail("/admin/utilisateurs", "Vous ne pouvez pas supprimer votre propre compte.");
  }

  if (target.isAdmin || target.role === "admin") {
    const otherAdmins = await db.member.count({
      where: {
        id: { not: target.id },
        OR: [{ isAdmin: true }, { role: "admin" }],
      },
    });
    if (otherAdmins === 0) {
      fail("/admin/utilisateurs", "Impossible de supprimer le dernier administrateur.");
    }
  }

  const clerk = await clerkClient();
  await clerk.users.deleteUser(target.clerkUserId);
  await db.$transaction(async (tx) => {
    await tx.auditLog.create({
      data: {
        actorId: admin.id,
        action: "member_deleted",
        entity: "member",
        entityId: target.id,
      },
    });
    await tx.member.delete({ where: { id: target.id } });
  });

  await refresh("/admin/utilisateurs", "/admin");
  done("/admin/utilisateurs", "Utilisateur supprimé.");
}

export async function setCompanyVerification(formData: FormData) {
  const admin = await requireAdmin();
  const companyId = text(formData, "companyId", 40);
  const verification = text(formData, "verification", 20);
  if (!VERIFICATION.includes(verification as (typeof VERIFICATION)[number])) {
    fail("/admin/entreprises", "Statut invalide.");
  }
  await db.company.updateMany({
    where: { id: companyId },
    data: { verification: verification as VerificationStatus },
  });
  const company = await db.company.findUnique({ where: { id: companyId } });
  if (company?.ownerMemberId) {
    await notify(
      company.ownerMemberId,
      "Vérification de l'entreprise",
      verification === "verifie"
        ? `${company.legalName} est maintenant vérifiée.`
        : `Le statut de ${company.legalName} a été mis à jour.`,
      companyHref(await roleOf(company.ownerMemberId)),
    );
  }
  await audit(admin.id, "company_verification", "company", companyId);
  await refresh("/admin/entreprises");
  done("/admin/entreprises", "Vérification enregistrée.");
}

export async function setPaymentStatus(formData: FormData) {
  const admin = await requireAdmin();
  const paymentId = text(formData, "paymentId", 40);
  const status = text(formData, "status", 20);
  if (!PAYMENT_STATUSES.includes(status as (typeof PAYMENT_STATUSES)[number])) {
    fail("/admin/paiements", "Statut invalide.");
  }
  const payment = await db.payment.findUnique({ where: { id: paymentId } });
  if (!payment) fail("/admin/paiements", "Paiement introuvable.");
  const next = status as PaymentStatus;
  if (payment.status !== "paye" && next === "paye") {
    await settlePayment(payment.id);
  }
  await db.payment.update({ where: { id: paymentId }, data: { status: next } });
  await audit(admin.id, "payment_status", "payment", paymentId);
  await refresh("/admin/paiements", "/admin");
  done("/admin/paiements", "Paiement mis à jour.");
}

async function settlePayment(paymentId: string) {
  const payment = await db.payment.findUnique({ where: { id: paymentId } });
  if (!payment || payment.status === "paye" || !payment.memberId) return;
  const payer = await db.member.findUnique({ where: { id: payment.memberId } });
  const plan = payment.planId ? await db.plan.findUnique({ where: { id: payment.planId } }) : null;
  if (plan && plan.interval !== "acte" && payment.companyId) {
    const ends = new Date();
    if (plan.interval === "mois") ends.setMonth(ends.getMonth() + 1);
    if (plan.interval === "an") ends.setFullYear(ends.getFullYear() + 1);
    await db.subscription.create({
      data: {
        memberId: payment.memberId,
        companyId: payment.companyId,
        planId: plan.id,
        status: "actif",
        endsAt: ends,
      },
    });
  }
  if (payer?.referredById && payment.amount > 0) {
    const sponsor = await db.member.findUnique({ where: { id: payer.referredById } });
    if (sponsor?.role === "ambassadeur") {
      const setting = await db.setting.findUnique({ where: { key: "commission_rate_percent" } });
      const rate = Number(setting?.value ?? 10);
      const amount = Math.round((payment.amount * rate) / 100);
      if (amount > 0) {
        await db.commission.create({
          data: {
            ambassadorId: sponsor.id,
            paymentId: payment.id,
            amount,
            currency: payment.currency,
            status: "en_attente",
          },
        });
        await notify(
          sponsor.id,
          "Commission en attente",
          `Une commission de ${amount} ${payment.currency} attend validation.`,
          referralHref(sponsor.role),
        );
      }
    }
  }
  await notify(
    payment.memberId,
    "Paiement confirmé",
    payment.purpose ?? "Votre règlement est confirmé.",
    paymentsHref(payer?.role ?? "candidat"),
  );
}

export async function updatePlan(formData: FormData) {
  const admin = await requireAdmin();
  const planId = text(formData, "planId", 40);
  const amount = integer(formData, "amount");
  if (amount === null || amount < 0) fail("/admin/tarifs", "Indiquez un montant valide.");
  await db.plan.updateMany({
    where: { id: planId },
    data: {
      amount,
      name: text(formData, "name", 120),
      active: formData.get("active") === "on",
    },
  });
  await audit(admin.id, "plan_updated", "plan", planId);
  await refresh("/admin/tarifs", "/abonnements", ...SPACE_SLUGS.map((slug) => `/${slug}/abonnements`));
  done("/admin/tarifs", "Tarif mis à jour.");
}

export async function setCommissionStatus(formData: FormData) {
  const admin = await requireAdmin();
  const commissionId = text(formData, "commissionId", 40);
  const status = text(formData, "status", 20);
  const allowed: CommissionStatus[] = ["en_attente", "validee", "payee", "rejetee"];
  if (!allowed.includes(status as CommissionStatus)) fail("/admin/commissions", "Statut invalide.");
  await db.commission.updateMany({
    where: { id: commissionId },
    data: { status: status as CommissionStatus },
  });
  await audit(admin.id, "commission_status", "commission", commissionId);
  await refresh("/admin/commissions");
  done("/admin/commissions", "Commission mise à jour.");
}

export async function setPayoutStatus(formData: FormData) {
  const admin = await requireAdmin();
  const payoutId = text(formData, "payoutId", 40);
  const status = text(formData, "status", 20);
  const allowed: PayoutStatus[] = ["demandee", "validee", "payee", "rejetee"];
  if (!allowed.includes(status as PayoutStatus)) fail("/admin/commissions", "Statut invalide.");
  await db.payout.updateMany({ where: { id: payoutId }, data: { status: status as PayoutStatus } });
  if (status === "payee") {
    await db.commission.updateMany({ where: { payoutId }, data: { status: "payee" } });
  }
  if (status === "rejetee") {
    await db.commission.updateMany({ where: { payoutId }, data: { payoutId: null, status: "validee" } });
  }
  await audit(admin.id, "payout_status", "payout", payoutId);
  await refresh("/admin/commissions");
  done("/admin/commissions", "Reversement mis à jour.");
}

export async function addCity(formData: FormData) {
  const admin = await requireAdmin();
  const name = text(formData, "name", 80);
  const countryCode = text(formData, "countryCode", 2) || "CI";
  if (!name) fail("/admin/territoires", "Indiquez la ville.");
  try {
    await db.city.create({ data: { name, countryCode } });
  } catch (error) {
    if (isUniqueViolation(error)) fail("/admin/territoires", "Cette ville existe déjà.");
    fail("/admin/territoires", "La ville n'a pas pu être ajoutée.");
  }
  await audit(admin.id, "city_added", "city", name);
  await refresh("/admin/territoires");
  done("/admin/territoires", "Ville ajoutée.");
}

export async function closeTicket(formData: FormData) {
  const admin = await requireAdmin();
  const ticketId = text(formData, "ticketId", 40);
  await db.ticket.updateMany({ where: { id: ticketId }, data: { status: "clos" } });
  await audit(admin.id, "ticket_closed", "ticket", ticketId);
  await refresh("/admin");
  done("/admin", "Réclamation close.");
}
