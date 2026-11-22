import { redirect } from "next/navigation";
import { requireMember } from "@/lib/member";
import { conversationHref, withSearch } from "@/lib/space";

export const instant = false;

export default async function Page(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const member = await requireMember();
  const { id } = await props.params;
  redirect(withSearch(conversationHref(member.role, id), await props.searchParams));
}
