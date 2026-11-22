import { redirect } from "next/navigation";
import { requireMember } from "@/lib/member";
import { referralHref, withSearch } from "@/lib/space";

export const instant = false;

export default async function Page(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const member = await requireMember();
  redirect(withSearch(referralHref(member.role), await props.searchParams));
}
