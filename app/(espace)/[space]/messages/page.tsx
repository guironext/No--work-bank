import Link from "next/link";
import { PageTitle } from "@/components/ui";
import { listConversations } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { requireMember } from "@/lib/member";
import { conversationHref } from "@/lib/space";

export const instant = false;
export const metadata = { title: "Messages" };

export default async function MessagesPage() {
  const member = await requireMember();
  const rows = await listConversations(member.id);
  return (
    <div>
      <PageTitle title="Messagerie" text="Échanges entre candidats et recruteurs. Un message peut être signalé." />
      <div className="grid gap-2">
        {rows.map((row) => (
          <Link key={row.id} href={conversationHref(member.role, row.id)} className="card p-4">
            <p className="font-semibold text-navy">{row.subject}</p>
            <p className="text-sm text-ink/60">{formatDate(row.createdAt)}</p>
          </Link>
        ))}
        {rows.length === 0 ? <p className="text-sm text-ink/65">Aucune conversation. Contactez un recruteur depuis une offre.</p> : null}
      </div>
    </div>
  );
}
