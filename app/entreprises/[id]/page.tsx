import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicFrame } from "@/components/public-frame";
import { getCompany, getValidatedManagerCompanyListing } from "@/lib/data";
import { formatRange } from "@/lib/format";
import { VERIFICATION_LABELS } from "@/lib/constants";

export const instant = false;
export const metadata = { title: "Entreprise" };

export default async function CompanyPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const listing = await getValidatedManagerCompanyListing(id);
  if (listing) {
    return (
      <PublicFrame>
        <main className="mx-auto w-full max-w-5xl">
          <Link
            href="/entreprises"
            className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-blue transition hover:text-navy focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
          >
            <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-4">
              <path d="M16 10H4m5 5-5-5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Toutes les entreprises
          </Link>

          <header className="relative mt-3 overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-navy via-blue to-leaf px-5 py-7 text-white shadow-xl shadow-navy/15 sm:px-8 sm:py-10">
            <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-16 size-56 rounded-full border-[28px] border-white/10" />
            <div className="relative">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">
                <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-4">
                  <path d="m4 10 4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Entreprise validée
              </span>
              <h1 className="display mt-4 max-w-3xl break-words text-3xl leading-tight sm:text-5xl">{listing.title}</h1>
              <p className="mt-3 text-sm text-white/80">{listing.companyName} · {listing.location}</p>
            </div>
          </header>

          <article className="card mt-6 p-5 sm:p-7">
            <h2 className="text-lg font-bold text-navy">À propos</h2>
            <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-ink/75">{listing.description}</p>
            {listing.contact || listing.website ? (
              <dl className="mt-6 grid gap-4 border-t border-line pt-5 sm:grid-cols-2">
                {listing.contact ? (
                  <div className="min-w-0">
                    <dt className="text-xs font-semibold text-ink/50">Contact</dt>
                    <dd className="mt-1 whitespace-pre-line break-words text-sm text-navy">{listing.contact}</dd>
                  </div>
                ) : null}
                {listing.website ? (
                  <div className="min-w-0">
                    <dt className="text-xs font-semibold text-ink/50">Site web</dt>
                    <dd className="mt-1">
                      <a
                        href={listing.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="break-all text-sm font-semibold text-blue underline decoration-blue/30 underline-offset-4 hover:decoration-blue"
                      >
                        {listing.website}
                      </a>
                    </dd>
                  </div>
                ) : null}
              </dl>
            ) : null}
          </article>
        </main>
      </PublicFrame>
    );
  }

  const row = await getCompany(id);
  if (!row) notFound();
  const { company, offers } = row;
  return (
    <PublicFrame>
      <p className="text-xs font-bold tracking-[0.16em] text-green uppercase">
        {VERIFICATION_LABELS[company.verification]}
        {company.isDemo ? " · Démonstration" : ""}
      </p>
      <h1 className="display mt-2 text-4xl text-navy">{company.legalName}</h1>
      <p className="mt-2 text-sm text-ink/70">
        {company.sector} · {company.address} {company.city} · {company.countryCode}
      </p>
      <p className="mt-4 max-w-3xl text-sm leading-7">{company.description}</p>
      {company.representative ? (
        <p className="mt-3 text-sm">Représentant : {company.representative}</p>
      ) : null}
      <h2 className="mt-8 text-xl font-bold text-navy">Offres publiées</h2>
      <div className="mt-3 grid gap-3">
        {offers.length === 0 ? <p className="text-sm">Aucune offre ouverte.</p> : null}
        {offers.map((job) => (
          <Link key={job.id} href={`/emplois/${job.id}`} className="card flex items-center justify-between gap-3 p-4">
            <span>
              <span className="font-semibold text-navy">{job.title}</span>
              <span className="mt-1 block text-sm text-ink/65">
                {job.contractType} · {job.city}
              </span>
            </span>
            <span className="text-sm font-semibold">{formatRange(job.salaryMin, job.salaryMax, job.currency)}</span>
          </Link>
        ))}
      </div>
    </PublicFrame>
  );
}
