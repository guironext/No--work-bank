import Link from "next/link";
import { PageTitle } from "@/components/ui";
import { APPLICATION_LABELS } from "@/lib/constants";
import { listApplications } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { requireMember } from "@/lib/member";

export async function ApplicationsScreen() {
  const member = await requireMember();
  const rows = await listApplications(member.id);
  return (
    <div>
      <PageTitle kicker="NOÉ JOBS" title="Mes candidatures" text="Chaque dossier avance selon les sept statuts du recrutement." />
      <div id="entretien" className="grid scroll-mt-24 gap-3">
        <span id="recrutement" className="scroll-mt-24" />
        <span id="evaluation" className="scroll-mt-24" />
        {rows.map((row) => (
          <article key={row.application.id} className="card grid gap-2 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Link href={`/emplois/${row.job.id}`} className="font-semibold text-navy">
                  {row.job.title}
                </Link>
                <p className="text-sm text-ink/65">
                  {row.company.legalName} · {formatDate(row.application.createdAt)}
                </p>
              </div>
              <span className="chip">{APPLICATION_LABELS[row.application.status]}</span>
            </div>
          </article>
        ))}
        {rows.length === 0 ? <p className="text-sm text-ink/65">Vous n&apos;avez pas encore postulé.</p> : null}
      </div>
    </div>
  );
}
