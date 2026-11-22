import "server-only";

import { connection } from "next/server";
import { Prisma } from "./generated/prisma/client";
import { db } from "./db";
import type { Member } from "./db/schema";

function like(value: string) {
  return value.replace(/[%_]/g, "").slice(0, 80);
}

export async function listCountries() {
  return db.country.findMany({ orderBy: { name: "asc" } });
}

export async function listCities(countryCode?: string) {
  return db.city.findMany({
    where: countryCode ? { countryCode } : undefined,
    orderBy: { name: "asc" },
  });
}

export type JobFilters = {
  q?: string;
  city?: string;
  sector?: string;
  contract?: string;
  min?: number;
};

export async function listJobs(filters: JobFilters = {}) {
  const conditions: Prisma.JobWhereInput[] = [{ status: "publiee" }];
  if (filters.q) {
    const pattern = like(filters.q);
    conditions.push({
      OR: [
        { title: { contains: pattern, mode: "insensitive" } },
        { city: { contains: pattern, mode: "insensitive" } },
        { sector: { contains: pattern, mode: "insensitive" } },
        { requiredSkills: { contains: pattern, mode: "insensitive" } },
        { companies: { is: { legalName: { contains: pattern, mode: "insensitive" } } } },
      ],
    });
  }
  if (filters.city) {
    conditions.push({ city: { contains: like(filters.city), mode: "insensitive" } });
  }
  if (filters.sector) conditions.push({ sector: filters.sector });
  if (filters.contract) conditions.push({ contractType: filters.contract });
  if (filters.min) {
    conditions.push({
      OR: [{ salaryMax: { gte: filters.min } }, { salaryMin: { gte: filters.min } }],
    });
  }
  const rows = await db.job.findMany({
    where: { AND: conditions },
    include: { companies: true },
    orderBy: { createdAt: "desc" },
    take: 48,
  });
  return rows.map(({ companies: company, ...job }) => ({ job, company }));
}

export async function getJob(id: string) {
  const row = await db.job.findUnique({ where: { id }, include: { companies: true } });
  if (!row) return null;
  const { companies: company, ...job } = row;
  return { job, company };
}

export async function listCompanies() {
  return db.company.findMany({ orderBy: { createdAt: "desc" }, take: 48 });
}

export async function getCompany(id: string) {
  const company = await db.company.findUnique({ where: { id } });
  if (!company) return null;
  const [offers, documents] = await Promise.all([
    db.job.findMany({
      where: { companyId: id, status: "publiee" },
      orderBy: { createdAt: "desc" },
    }),
    db.companyDocument.findMany({ where: { companyId: id } }),
  ]);
  return { company, offers, documents };
}

export async function companyByOwner(memberId: string) {
  return db.company.findFirst({ where: { ownerMemberId: memberId } });
}

export async function profileBundle(memberId: string) {
  const [skills, educations, experiences, portfolio, references] = await Promise.all([
    db.skill.findMany({ where: { memberId } }),
    db.education.findMany({ where: { memberId } }),
    db.experience.findMany({ where: { memberId } }),
    db.portfolioItem.findMany({ where: { memberId } }),
    db.professionalReference.findMany({ where: { memberId } }),
  ]);
  return { skills, educations, experiences, portfolio, references };
}

export function completion(
  member: Member,
  counts: { skills: number; educations: number; experiences: number },
) {
  const checks = [
    member.firstName,
    member.lastName,
    member.phone,
    member.city,
    member.domain,
    member.bio,
    counts.skills > 0,
    counts.educations > 0,
    counts.experiences > 0,
  ];
  return Math.round((100 * checks.filter(Boolean).length) / checks.length);
}

export async function listTalents() {
  return db.member.findMany({
    where: { shareWithRecruiters: true },
    orderBy: { updatedAt: "desc" },
    take: 48,
  });
}

export async function getTalent(id: string) {
  const member = await db.member.findUnique({ where: { id } });
  if (!member) return null;
  return { member, ...(await profileBundle(id)) };
}

export async function viewerCanSeeTalent(viewer: Member | null, talent: Member) {
  if (talent.shareWithRecruiters || talent.cvPublic) return true;
  if (!viewer) return false;
  if (viewer.id === talent.id || viewer.isAdmin) return true;
  const company = await companyByOwner(viewer.id);
  if (!company) return false;
  const hit = await db.application.findFirst({
    where: {
      memberId: talent.id,
      jobs: { is: { companies: { is: { id: company.id } } } },
    },
    select: { id: true },
  });
  return Boolean(hit);
}

export async function listApplications(memberId: string) {
  const rows = await db.application.findMany({
    where: { memberId },
    include: { jobs: { include: { companies: true } } },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(({ jobs: jobWithCompany, ...application }) => {
    const { companies: company, ...job } = jobWithCompany;
    return { application, job, company };
  });
}

export async function listCompanyApplications(companyId: string) {
  const rows = await db.application.findMany({
    where: { jobs: { is: { companyId } } },
    include: { jobs: true, members: true },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(({ jobs: job, members: member, ...application }) => ({
    application,
    job,
    member,
  }));
}

export async function getApplication(id: string) {
  const row = await db.application.findUnique({
    where: { id },
    include: {
      jobs: { include: { companies: true } },
      members: true,
      interviews: { orderBy: { scheduledAt: "desc" } },
    },
  });
  if (!row) return null;
  const { jobs: jobWithCompany, members: member, interviews: meetings, ...application } = row;
  const { companies: company, ...job } = jobWithCompany;
  return { application, job, company, member, meetings, ...(await profileBundle(member.id)) };
}

export async function existingApplication(jobId: string, memberId: string) {
  return db.application.findFirst({ where: { jobId, memberId } });
}

export async function listFavorites(memberId: string) {
  const rows = await db.favorite.findMany({
    where: { memberId },
    include: { jobs: { include: { companies: true } } },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(({ jobs: jobWithCompany }) => {
    const { companies: company, ...job } = jobWithCompany;
    return { job, company };
  });
}

export async function isFavorite(memberId: string, jobId: string) {
  return Boolean(
    await db.favorite.findUnique({ where: { memberId_jobId: { memberId, jobId } } }),
  );
}

export async function recommendJobs(member: Member) {
  const skillRows = await db.skill.findMany({ where: { memberId: member.id } });
  const offers = await listJobs();
  const ranked = offers
    .map((row) => {
      const hay =
        `${row.job.title} ${row.job.requiredSkills ?? ""} ${row.job.sector ?? ""} ${row.job.description}`.toLowerCase();
      let score = 0;
      for (const skill of skillRows) {
        if (hay.includes(skill.name.toLowerCase())) score += 2;
      }
      if (member.domain && hay.includes(member.domain.toLowerCase())) score += 2;
      if (member.city && row.job.city && row.job.city.toLowerCase() === member.city.toLowerCase()) {
        score += 1;
      }
      if (member.jobType && row.job.contractType === member.jobType) score += 1;
      return { ...row, score };
    })
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
  return ranked.length > 0 ? ranked : offers.slice(0, 4).map((row) => ({ ...row, score: 0 }));
}

export async function searchAll(q: string) {
  const pattern = like(q);
  const [offers, talents, companies] = await Promise.all([
    listJobs({ q }),
    db.member.findMany({
      where: {
        shareWithRecruiters: true,
        OR: [
          { firstName: { contains: pattern, mode: "insensitive" } },
          { lastName: { contains: pattern, mode: "insensitive" } },
          { domain: { contains: pattern, mode: "insensitive" } },
          { city: { contains: pattern, mode: "insensitive" } },
        ],
      },
      take: 12,
    }),
    db.company.findMany({
      where: {
        OR: [
          { legalName: { contains: pattern, mode: "insensitive" } },
          { sector: { contains: pattern, mode: "insensitive" } },
          { city: { contains: pattern, mode: "insensitive" } },
        ],
      },
      take: 12,
    }),
  ]);
  return { offers, talents, companies };
}

export async function listConversations(memberId: string) {
  return db.conversation.findMany({
    where: { OR: [{ memberA: memberId }, { memberB: memberId }] },
    orderBy: { createdAt: "desc" },
  });
}

export async function getConversation(id: string, memberId: string) {
  const conversation = await db.conversation.findUnique({ where: { id } });
  if (!conversation || (conversation.memberA !== memberId && conversation.memberB !== memberId)) {
    return null;
  }
  const otherId = conversation.memberA === memberId ? conversation.memberB : conversation.memberA;
  const [thread, other] = await Promise.all([
    db.message.findMany({ where: { conversationId: id }, orderBy: { createdAt: "asc" } }),
    db.member.findUnique({ where: { id: otherId } }),
  ]);
  return { conversation, thread, other };
}

export async function listNotifications(memberId: string) {
  return db.notification.findMany({
    where: { memberId },
    orderBy: { createdAt: "desc" },
    take: 40,
  });
}

export async function unreadCount(memberId: string) {
  return db.notification.count({ where: { memberId, readAt: null } });
}

export async function listPlans() {
  return db.plan.findMany({ orderBy: { amount: "asc" } });
}

export async function listPayments(memberId: string) {
  return db.payment.findMany({ where: { memberId }, orderBy: { createdAt: "desc" } });
}

export async function activeSubscription(companyId: string) {
  await connection();
  const now = new Date();
  return db.subscription.findFirst({
    where: {
      companyId,
      status: "actif",
      OR: [{ endsAt: null }, { endsAt: { gte: now } }],
    },
  });
}

export async function listReferrals(memberId: string) {
  return db.member.findMany({ where: { referredById: memberId } });
}

export async function listCommissions(memberId: string) {
  return db.commission.findMany({
    where: { ambassadorId: memberId },
    orderBy: { createdAt: "desc" },
  });
}

export async function listPayouts(memberId: string) {
  return db.payout.findMany({ where: { memberId }, orderBy: { createdAt: "desc" } });
}

export async function adminOverview() {
  await connection();
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const [
    people,
    active,
    verifiedPeople,
    verifiedCompanies,
    companies,
    openJobs,
    applications,
    hires,
  ] = await Promise.all([
    db.member.count(),
    db.member.count({ where: { lastSeenAt: { gte: since } } }),
    db.member.count({ where: { verification: "verifie" } }),
    db.company.count({ where: { verification: "verifie" } }),
    db.company.count(),
    db.job.count({ where: { status: "publiee" } }),
    db.application.count(),
    db.application.count({ where: { status: "recrutement_confirme" } }),
  ]);
  return {
    people,
    active,
    verifiedPeople,
    verifiedCompanies,
    companies,
    openJobs,
    applications,
    hires,
  };
}

export async function listMembersAdmin() {
  return db.member.findMany({
    orderBy: [{ approvalStatus: "asc" }, { createdAt: "desc" }],
  });
}

export async function listManagerOpportunities() {
  await connection();
  return db.opportunity.findMany({ orderBy: { createdAt: "desc" } });
}

export async function listManagerTrainings() {
  await connection();
  return db.managerTraining.findMany({ orderBy: { createdAt: "desc" } });
}

export async function listManagerExamConcours() {
  await connection();
  return db.managerExamConcours.findMany({ orderBy: { createdAt: "desc" } });
}

export async function listManagerEmploymentPosts() {
  await connection();
  return db.managerEmploymentPost.findMany({ orderBy: { createdAt: "desc" } });
}

export async function listManagerOnlineEmploymentPosts() {
  await connection();
  return db.managerOnlineEmploymentPost.findMany({ orderBy: { createdAt: "desc" } });
}

export async function listManagerCompanyListings() {
  await connection();
  return db.managerCompanyListing.findMany({ orderBy: { createdAt: "desc" } });
}

export async function listValidatedManagerCompanyListings() {
  await connection();
  return db.managerCompanyListing.findMany({
    where: { validatedAt: { not: null } },
    orderBy: { validatedAt: "desc" },
    select: {
      id: true,
      title: true,
      description: true,
      companyName: true,
      location: true,
      website: true,
      contact: true,
    },
  });
}

export async function getValidatedManagerCompanyListing(id: string) {
  await connection();
  if (!/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(id)) return null;
  return db.managerCompanyListing.findFirst({
    where: { id, validatedAt: { not: null } },
    select: {
      id: true,
      title: true,
      description: true,
      companyName: true,
      location: true,
      website: true,
      contact: true,
    },
  });
}

export async function listValidatedOpportunities() {
  await connection();
  return db.opportunity.findMany({
    where: { validatedAt: { not: null } },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      description: true,
      validFrom: true,
      validUntil: true,
      location: true,
    },
  });
}

export async function listValidatedManagerEmploymentPosts() {
  await connection();
  return db.managerEmploymentPost.findMany({
    where: { validatedAt: { not: null } },
    orderBy: { validatedAt: "desc" },
    select: {
      id: true,
      title: true,
      companyName: true,
      location: true,
      offerDate: true,
      description: true,
      mission: true,
      profile: true,
      level: true,
      workplace: true,
      experience: true,
      salary: true,
      email: true,
    },
  });
}

export async function listValidatedManagerOnlineEmploymentPosts() {
  await connection();
  return db.managerOnlineEmploymentPost.findMany({
    where: { validatedAt: { not: null } },
    orderBy: { validatedAt: "desc" },
    select: {
      id: true,
      title: true,
      description: true,
      companyName: true,
      registrationLink: true,
      contact: true,
      validatedAt: true,
    },
  });
}

export async function getValidatedManagerOnlineEmploymentPost(id: string) {
  await connection();
  if (!/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(id)) return null;
  return db.managerOnlineEmploymentPost.findFirst({
    where: { id, validatedAt: { not: null } },
    select: {
      id: true,
      title: true,
      description: true,
      companyName: true,
      registrationLink: true,
      contact: true,
    },
  });
}

export async function listValidatedManagerTrainings() {
  await connection();
  return db.managerTraining.findMany({
    where: { validatedAt: { not: null } },
    orderBy: { validatedAt: "desc" },
    select: {
      id: true,
      title: true,
      startDate: true,
      validFrom: true,
      validUntil: true,
      description: true,
      location: true,
    },
  });
}

export async function listValidatedManagerExamConcours() {
  await connection();
  return db.managerExamConcours.findMany({
    where: { validatedAt: { not: null } },
    orderBy: { validatedAt: "desc" },
    select: {
      id: true,
      title: true,
      type: true,
      validFrom: true,
      validUntil: true,
      description: true,
      ministry: true,
      documentUrl: true,
      documentName: true,
      validatedAt: true,
    },
  });
}

export async function getValidatedManagerExamConcours(id: string) {
  await connection();
  if (!/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(id)) return null;
  return db.managerExamConcours.findFirst({
    where: { id, validatedAt: { not: null } },
    select: {
      id: true,
      title: true,
      type: true,
      validFrom: true,
      validUntil: true,
      description: true,
      ministry: true,
      documentUrl: true,
      documentName: true,
    },
  });
}

export async function getValidatedManagerTraining(id: string) {
  await connection();
  if (!/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(id)) return null;
  return db.managerTraining.findFirst({
    where: { id, validatedAt: { not: null } },
    select: {
      id: true,
      title: true,
      startDate: true,
      validFrom: true,
      validUntil: true,
      description: true,
      location: true,
      registrationLink: true,
      contact: true,
      contactPeople: true,
    },
  });
}

export async function getValidatedManagerEmploymentPost(id: string) {
  await connection();
  if (!/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(id)) return null;
  return db.managerEmploymentPost.findFirst({
    where: { id, validatedAt: { not: null } },
    select: {
      id: true,
      title: true,
      companyName: true,
      location: true,
      offerDate: true,
      description: true,
      mission: true,
      profile: true,
      level: true,
      workplace: true,
      experience: true,
      salary: true,
      email: true,
    },
  });
}

export async function getValidatedOpportunity(id: string) {
  await connection();
  if (!/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(id)) return null;
  return db.opportunity.findFirst({
    where: { id, validatedAt: { not: null } },
    select: {
      id: true,
      title: true,
      description: true,
      validFrom: true,
      validUntil: true,
      location: true,
      registrationLink: true,
      contact: true,
      contactPeople: true,
    },
  });
}

export async function listInactiveMembersAdmin() {
  await connection();
  const activeSince = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  return db.member.findMany({
    where: { OR: [{ lastSeenAt: null }, { lastSeenAt: { lt: activeSince } }] },
    orderBy: { lastSeenAt: "asc" },
    take: 100,
  });
}

export async function listCompaniesAdmin() {
  return db.company.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
}

export async function listJobsAdmin() {
  const rows = await db.job.findMany({
    include: { companies: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return rows.map(({ companies: company, ...job }) => ({ job, company }));
}

export async function listPaymentsAdmin() {
  return db.payment.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
}

export async function listCommissionsAdmin() {
  const rows = await db.commission.findMany({
    include: { members: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return rows.map(({ members: member, ...commission }) => ({ commission, member }));
}

export async function listPayoutsAdmin() {
  const rows = await db.payout.findMany({
    include: { members: true },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(({ members: member, ...payout }) => ({ payout, member }));
}

export async function listAudit() {
  return db.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 80 });
}

export async function listReportedMessages() {
  const rows = await db.message.findMany({
    where: { reported: true },
    include: { members: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return rows.map(({ members: sender, ...message }) => ({ message, sender }));
}

export async function listTicketsAdmin() {
  return db.ticket.findMany({ orderBy: { createdAt: "desc" }, take: 50 });
}

export async function companyJobs(companyId: string) {
  return db.job.findMany({ where: { companyId }, orderBy: { createdAt: "desc" } });
}
