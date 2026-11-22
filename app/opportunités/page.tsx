import { Suspense } from "react";
import Link from "next/link";
import { PublicFrame } from "@/components/public-frame";
import { PageTitle } from "@/components/ui";
import { listValidatedOpportunities } from "@/lib/data";
import { formatDate } from "@/lib/format";

export const instant = false;
export const metadata = { title: "Toutes les opportunités" };

async function ValidatedOpportunityList() {
  const opportunities = await listValidatedOpportunities();

  if (opportunities.length === 0) {
    return (
      <div className="card px-5 py-10 text-center sm:py-14">
        <p className="font-semibold text-navy">Aucune opportunité validée pour le moment.</p>
        <p className="mt-2 text-sm text-ink/65">Revenez bientôt pour découvrir les nouvelles opportunités.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {opportunities.map((opportunity) => (
        <Link
          key={opportunity.id}
          href={`/opportunites/${opportunity.id}`}
          className="card group flex min-w-0 flex-col overflow-hidden p-5 transition duration-200 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue sm:p-6"
        >
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-green/10 px-2.5 py-1 text-[11px] font-bold text-leaf">
            <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-3.5">
              <path d="m4 10 4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Validée
          </span>
          <h2 className="mt-4 break-words text-xl font-bold leading-snug text-navy transition group-hover:text-blue">
            {opportunity.title}
          </h2>
          <p className="mt-2 line-clamp-4 text-sm leading-6 text-ink/65">{opportunity.description}</p>
          <div className="mt-5 grid gap-2 border-t border-line pt-4 text-xs text-ink/65">
            <p className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
              <span className="font-semibold text-navy">Période :</span>
              <time dateTime={opportunity.validFrom.toISOString().slice(0, 10)}>{formatDate(opportunity.validFrom)}</time>
              <span aria-hidden="true">–</span>
              <time dateTime={opportunity.validUntil.toISOString().slice(0, 10)}>{formatDate(opportunity.validUntil)}</time>
            </p>
            {opportunity.location ? (
              <p className="break-words">
                <span className="font-semibold text-navy">Lieu :</span> {opportunity.location}
              </p>
            ) : null}
          </div>
          <span className="mt-auto flex items-center gap-2 pt-5 text-sm font-bold text-blue">
            Découvrir l’opportunité
            <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-4 transition-transform group-hover:translate-x-1">
              <path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </Link>
      ))}
    </div>
  );
}

export default function OpportunitiesPage() {
  return (
    <PublicFrame>
      <main className="mx-auto w-full max-w-6xl">
        <PageTitle
          kicker="OPPORTUNITÉS VALIDÉES"
          title="Toutes les opportunités"
          text="Parcourez les opportunités vérifiées et contactez l’équipe depuis leur fiche."
        />
        <Suspense fallback={<div aria-hidden="true" className="card h-64 animate-pulse" />}>
          <ValidatedOpportunityList />
        </Suspense>
        <div className="mt-8">
          <Link href="/#opportunites" className="text-sm font-semibold text-blue hover:text-navy">
            Retour à l’accueil
          </Link>
        </div>
      </main>
    </PublicFrame>
  );
}
