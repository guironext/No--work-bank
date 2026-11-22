import { redirect } from "next/navigation";
import { Shell } from "@/components/shell";
import { unreadCount } from "@/lib/data";
import { getMember } from "@/lib/member";

export const instant = false;

export default async function EspaceLayout({ children }: { children: React.ReactNode }) {
  const member = await getMember();
  if (!member) redirect("/bienvenue");
  if (member.approvalStatus !== "approved") redirect("/validation-compte");
  const unread = await unreadCount(member.id);
  return (
    <Shell member={member} unread={unread}>
      {children}
    </Shell>
  );
}
