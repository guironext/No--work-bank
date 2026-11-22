import { SubmitButton } from "@/components/submit";
import { Flash, PageTitle } from "@/components/ui";
import { setCompanyVerification } from "@/lib/actions";
import { VERIFICATION_LABELS } from "@/lib/constants";
import { listCompaniesAdmin } from "@/lib/data";
import { one } from "@/lib/http";

export const instant = false;
export const metadata = { title: "Entreprises" };

export default async function CompaniesAdminPage(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const rows = await listCompaniesAdmin();
  const sp = await props.searchParams;
  return (
    <div>
      <PageTitle title="Vérification des entreprises" />
      <Flash ok={one(sp.ok)} error={one(sp.erreur)} />
      <div className="mt-4 grid gap-3">
        {rows.map((company) => (
          <form key={company.id} action={setCompanyVerification} className="card flex flex-wrap items-center justify-between gap-3 p-4">
            <input type="hidden" name="companyId" value={company.id} />
            <span>
              <span className="font-semibold text-navy">{company.legalName}</span>
              <span className="mt-1 block text-sm text-ink/60">{company.city} · {company.registrationNumber || "Sans immatriculation"} {company.isDemo ? "· Démo" : ""}</span>
            </span>
            <span className="flex gap-2">
              <select name="verification" defaultValue={company.verification} className="rounded-xl border border-line bg-white px-2">
                {Object.entries(VERIFICATION_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
              <SubmitButton variant="btn btn-small">Enregistrer</SubmitButton>
            </span>
          </form>
        ))}
      </div>
    </div>
  );
}
