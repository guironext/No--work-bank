import { PageTitle } from "@/components/ui";
import { listAudit } from "@/lib/data";
import { formatDateTime } from "@/lib/format";

export const instant = false;
export const metadata = { title: "Audit" };

export default async function AuditPage() {
  const rows = await listAudit();
  return (
    <div>
      <PageTitle title="Journal des opérations" />
      <div className="grid gap-2 text-sm">
        {rows.map((row) => (
          <p key={row.id} className="card p-3">
            {formatDateTime(row.createdAt)} · {row.action} · {row.entity} {row.entityId}
          </p>
        ))}
        {rows.length === 0 ? <p className="text-ink/60">Aucune opération enregistrée.</p> : null}
      </div>
    </div>
  );
}
