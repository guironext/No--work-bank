import "server-only";

import { db } from "./db";

export async function notify(memberId: string, title: string, body: string, href?: string) {
  await db.notification.create({ data: { memberId, title, body, href } });
}

export async function audit(
  actorId: string | null,
  action: string,
  entity: string,
  entityId?: string | null,
) {
  await db.auditLog.create({ data: { actorId, action, entity, entityId: entityId ?? null } });
}
