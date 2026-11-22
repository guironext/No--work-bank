import Link from "next/link";
import { redirect } from "next/navigation";
import { PageTitle } from "@/components/ui";
import { APPLICATION_LABELS, canPostJobs } from "@/lib/constants";
import { companyByOwner, listCompanyApplications } from "@/lib/data";
import { requireMember } from "@/lib/member";
import { companyHref, receivedApplicationHref, spaceHome } from "@/lib/space";

export const instant = false;
export const metadata = { title: "Candidatures reçues" };

export default async function ReceivedApplicationsPage() {
  const member = await requireMember();
  if (!canPostJobs(member.role)) redirect(spaceHome(member.role));
  const company = await companyByOwner(member.id);
  if (!company) redirect(companyHref(member.role));
  const rows = await listCompanyApplications(company.id);
  return (
    <div>
      <PageTitle title="Candidatures reçues" text={company.legalName} />
      <div className="grid gap-3">
        {rows.map((row) => (
          <Link key={row.application.id} href={receivedApplicationHref(member.role, row.application.id)} className="card flex items-center justify-between gap-3 p-4">
            <span>
              <span className="font-semibold text-navy">{row.member.firstName} {row.member.lastName}</span>
              <span className="mt-1 block text-sm text-ink/65">{row.job.title}</span>
            </span>
            <span className="chip">{APPLICATION_LABELS[row.application.status]}</span>
          </Link>
        ))}
        {rows.length === 0 ? <p className="text-sm text-ink/65">Aucune candidature reçue.</p> : null}
      </div>
    </div>
  );
}
