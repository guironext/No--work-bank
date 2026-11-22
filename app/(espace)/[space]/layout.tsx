import { redirect } from "next/navigation";
import { requireMember } from "@/lib/member";
import { roleFromSpace, spaceHome } from "@/lib/space";

export const instant = false;

export default async function RoleSpaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ space: string }>;
}) {
  const { space } = await params;
  const member = await requireMember();
  const owner = roleFromSpace(space);
  if (!owner || member.role !== owner) redirect(spaceHome(member.role));
  return children;
}
