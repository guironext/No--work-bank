import { redirect } from "next/navigation";
import { requireMember } from "@/lib/member";
import { cvHref } from "@/lib/space";

export const instant = false;

export default async function Page() {
  const member = await requireMember();
  redirect(cvHref(member.role));
}
