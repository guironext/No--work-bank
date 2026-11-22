import Link from "next/link";
import { SubmitButton } from "@/components/submit";
import { PageTitle } from "@/components/ui";
import { markNotificationsRead } from "@/lib/actions";
import { listNotifications } from "@/lib/data";
import { formatDateTime } from "@/lib/format";
import { requireMember } from "@/lib/member";

export const instant = false;
export const metadata = { title: "Notifications" };

export default async function NotificationsPage() {
  const member = await requireMember();
  const rows = await listNotifications(member.id);
  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <PageTitle title="Alertes" text="Candidatures, messages, paiements et entretiens." />
        <form action={markNotificationsRead}><SubmitButton variant="btn btn-ghost">Tout lire</SubmitButton></form>
      </div>
      <div className="grid gap-2">
        {rows.map((item) => (
          <article key={item.id} className="card p-4">
            <p className="font-semibold text-navy">{item.title}</p>
            <p className="text-sm leading-6">{item.body}</p>
            <p className="mt-1 text-xs text-ink/50">{formatDateTime(item.createdAt)} {item.readAt ? "" : "· Non lue"}</p>
            {item.href ? <Link className="text-sm font-semibold text-blue" href={item.href}>Ouvrir</Link> : null}
          </article>
        ))}
        {rows.length === 0 ? <p className="text-sm text-ink/65">Aucune alerte.</p> : null}
      </div>
    </div>
  );
}
