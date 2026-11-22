import { Suspense } from "react";
import Link from "next/link";
import { PublicManagerCompanyCard } from "@/components/public-manager-company-card";
import { PublicFrame } from "@/components/public-frame";
import { listValidatedManagerCompanyListings } from "@/lib/data";
import { getMember } from "@/lib/member";

async function ValidatedCompanies() {
  const [companies, member] = await Promise.all([
    listValidatedManagerCompanyListings(),
    getMember(),
  ]);
  const managerControls = member?.role === "manager" && member.approvalStatus === "approved";

  return (
    <main className="mx-auto w-full max-w-6xl">
      <header className="relative isolate mb-8 overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-navy via-blue to-[#0c6b30] px-5 py-7 text-white shadow-xl shadow-navy/10 sm:px-8 sm:py-9">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-14 -top-20 size-64 rounded-full border-[28px] border-white/10 sm:-right-8 sm:-top-28 sm:size-80"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-36 right-1/4 size-56 rounded-full border border-white/10"
        />
        <div className="relative max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-bold tracking-[0.16em] text-white/90 uppercase ring-1 ring-white/15 sm:text-xs">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-gold" />
            NOÉ BUSINESS · Réseau vérifié
          </span>
          <h1 className="display mt-4 text-3xl leading-tight sm:text-5xl">
            Des entreprises qui font avancer vos projets
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80 sm:text-base sm:leading-7">
            Découvrez les organisations présentées et validées par nos managers. Consultez chaque fiche pour en savoir plus et prendre contact.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2.5 text-sm text-white/90">
            <span className="font-bold text-white">{companies.length}</span>
            <span>{companies.length === 1 ? "entreprise validée" : "entreprises validées"}</span>
          </div>
        </div>
      </header>

      <section aria-labelledby="validated-companies-title">
        <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold tracking-[0.16em] text-green uppercase">Partenaires de confiance</p>
            <h2 id="validated-companies-title" className="display mt-1 text-2xl text-navy sm:text-3xl">
              Toutes les entreprises
            </h2>
          </div>
          <Link
            href="/#entreprises"
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-line bg-white px-4 text-sm font-semibold text-blue shadow-sm transition hover:border-blue/30 hover:bg-blue/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
          >
            Retour à l’accueil
          </Link>
        </header>

        {companies.length > 0 ? (
          <div className="grid items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {companies.map((company) => (
              <PublicManagerCompanyCard
                key={company.id}
                company={company}
                managerControls={managerControls}
              />
            ))}
          </div>
        ) : (
          <div className="card relative isolate overflow-hidden px-5 py-12 text-center sm:py-16">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-24 -z-10 size-64 rounded-full bg-green/5 blur-3xl"
            />
            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-green/10 text-green">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="size-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 20h16M6 17V7l6-3 6 3v13M9 10h.01M15 10h.01M9 13h.01M15 13h.01M10 17v-2h4v2" />
              </svg>
            </span>
            <h3 className="mt-4 text-lg font-bold text-navy">Les prochaines entreprises arrivent bientôt</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink/65">
              Les fiches validées par nos managers apparaîtront ici.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

export function ValidatedCompaniesPage() {
  return (
    <PublicFrame>
      <Suspense fallback={<div aria-hidden="true" className="card h-96 animate-pulse" />}>
        <ValidatedCompanies />
      </Suspense>
    </PublicFrame>
  );
}
