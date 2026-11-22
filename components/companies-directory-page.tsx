import { Suspense } from "react";
import Link from "next/link";
import { PublicManagerCompanyCard } from "@/components/public-manager-company-card";
import { PublicFrame } from "@/components/public-frame";
import { PageTitle } from "@/components/ui";
import { listCompanies, listValidatedManagerCompanyListings } from "@/lib/data";
import { VERIFICATION_LABELS } from "@/lib/constants";
import { getMember } from "@/lib/member";

async function ValidatedManagerCompanies() {
  const [companies, member] = await Promise.all([
    listValidatedManagerCompanyListings(),
    getMember(),
  ]);
  const managerControls = member?.role === "manager" && member.approvalStatus === "approved";

  return (
    <section aria-labelledby="validated-manager-companies-title" className="mb-10">
      <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold tracking-[0.16em] text-green uppercase">NOÉ BUSINESS</p>
          <h2 id="validated-manager-companies-title" className="mt-1 text-xl font-bold text-navy sm:text-2xl">
            Entreprises validées
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/65">
            Les entreprises présentées et approuvées par nos managers.
          </p>
        </div>
        <span className="chip">{companies.length} {companies.length === 1 ? "entreprise" : "entreprises"}</span>
      </header>
      {companies.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {companies.map((company) => (
            <PublicManagerCompanyCard key={company.id} company={company} managerControls={managerControls} />
          ))}
        </div>
      ) : (
        <div className="card px-5 py-10 text-center">
          <p className="text-sm leading-6 text-ink/65">Aucune entreprise validée pour le moment. Revenez bientôt.</p>
        </div>
      )}
    </section>
  );
}

export async function CompaniesDirectoryPage() {
  const rows = await listCompanies();
  return (
    <PublicFrame>
      <PageTitle
        kicker="NOÉ BUSINESS"
        title="Entreprises et organisations"
        text="Consultez les organisations présentes sur la plateforme. La vérification des documents est faite par l'administration."
      />
      <Suspense fallback={<div aria-hidden="true" className="card mb-10 h-64 animate-pulse" />}>
        <ValidatedManagerCompanies />
      </Suspense>
      <h2 className="mb-4 text-xl font-bold text-navy sm:text-2xl">Comptes entreprise</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {rows.map((company) => (
          <Link key={company.id} href={`/entreprises/${company.id}`} className="card grid gap-2 p-5">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-lg font-bold text-navy">{company.legalName}</h2>
              <span className={company.verification === "verifie" ? "chip chip-green" : "chip"}>
                {VERIFICATION_LABELS[company.verification]}
              </span>
            </div>
            <p className="text-sm text-ink/70">
              {company.sector} · {company.city}
            </p>
            <p className="line-clamp-3 text-sm leading-6">{company.description}</p>
          </Link>
        ))}
      </div>
    </PublicFrame>
  );
}
