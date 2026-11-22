import "server-only";

import { randomBytes } from "crypto";
import { cache } from "react";
import { connection } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "./db";

function token(size = 3) {
  return randomBytes(size).toString("hex").toUpperCase();
}

export function isAdminEmail(email: string | null | undefined) {
  const allowed = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
  return Boolean(email && allowed.includes(email.toLowerCase()));
}

export const getMember = cache(async () => {
  await connection();
  const { userId } = await auth();
  if (!userId) return null;
  const member = await db.member.findUnique({ where: { clerkUserId: userId } });
  if (!member) return null;

  if (isAdminEmail(member.email) && !member.isAdmin) {
    await db.member.update({ where: { id: member.id }, data: { isAdmin: true } });
    member.isAdmin = true;
  }

  const stale =
    !member.lastSeenAt || Date.now() - member.lastSeenAt.getTime() > 12 * 60 * 60 * 1000;
  if (stale) {
    const seen = new Date();
    await db.member.update({ where: { id: member.id }, data: { lastSeenAt: seen } });
    member.lastSeenAt = seen;
  }
  return member;
});

export async function requireMember() {
  const member = await getMember();
  if (!member) redirect("/bienvenue");
  if (member.approvalStatus !== "approved") redirect("/validation-compte");
  return member;
}

export async function requireAdmin() {
  const member = await requireMember();
  if (!member.isAdmin && member.role !== "admin") redirect("/tableau-de-bord");
  return member;
}

export async function memberCount() {
  return db.member.count();
}

export function createProfessionalId(country = "CI") {
  return `NOE-${country}-${token(3)}`;
}

export function createReferralCode() {
  return token(4);
}
