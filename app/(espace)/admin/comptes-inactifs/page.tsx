import { Empty, PageTitle } from "@/components/ui";
import { listInactiveMembersAdmin } from "@/lib/data";
import { formatDateTime, fullName } from "@/lib/format";
import { roleLabel } from "@/lib/constants";

export const instant = false;
export const metadata = { title: "Comptes inactifs" };

export default async function InactiveAccountsAdminPage() {
  const members = await listInactiveMembersAdmin();

  return (
    <div>
      <PageTitle title="Comptes inactifs" text="Comptes sans activité depuis plus de 30 jours." />
      {members.length ? (
        <div className="grid gap-3">
          {members.map((member) => (
            <article key={member.id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <p className="font-semibold text-navy">{fullName(member)}</p>
                <p className="text-sm text-ink/60">{member.email || member.professionalId}</p>
              </div>
              <div className="text-sm text-ink/70">
                <p>{roleLabel(member.role)}</p>
                <p>Dernière activité : {formatDateTime(member.lastSeenAt)}</p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <Empty title="Aucun compte inactif" text="Tous les comptes ont été actifs au cours des 30 derniers jours." />
      )}
    </div>
  );
}
