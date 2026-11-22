import { redirect } from "next/navigation";
import { requireMember } from "@/lib/member";
import { spaceHome } from "@/lib/space";

export const instant = false;

export default async function CandidatureLayout({ children }: { children: React.ReactNode }) {
  const member = await requireMember();
  if (member.role !== "candidat") redirect(spaceHome(member.role));
  return children;
}
