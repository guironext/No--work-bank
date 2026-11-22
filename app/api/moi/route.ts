import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { profileBundle } from "@/lib/data";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Connexion requise" }, { status: 401 });
  const member = await db.member.findUnique({ where: { clerkUserId: userId } });
  if (!member) return Response.json({ error: "Profil incomplet" }, { status: 404 });
  if (member.approvalStatus !== "approved") {
    return Response.json({ error: "Votre compte est en attente de validation" }, { status: 403 });
  }
  const bundle = await profileBundle(member.id);
  return Response.json({ member, ...bundle });
}
