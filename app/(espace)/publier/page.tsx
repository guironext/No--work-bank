import { redirect } from "next/navigation";
import { requireMember } from "@/lib/member";
import { publishHref } from "@/lib/space";

export const instant = false;

export default async function Page() {
  const member = await requireMember();
  redirect(publishHref(member.role));
}
