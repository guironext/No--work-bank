import "server-only";

import { createHash } from "crypto";
import { db } from "./db";

export const INVITATION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export function hashInvitationToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function findActiveInvitation(token: string) {
  if (!/^[\da-f]{64}$/i.test(token)) return null;

  return db.memberInvitation.findFirst({
    where: {
      tokenHash: hashInvitationToken(token),
      acceptedAt: null,
      revokedAt: null,
      expiresAt: { gt: new Date() },
    },
  });
}
