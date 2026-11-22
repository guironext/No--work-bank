import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicFrame } from "@/components/public-frame";
import { SubmitButton } from "@/components/submit";
import { Flash } from "@/components/ui";
import { submitOpportunityApplication } from "@/lib/actions";
import { getValidatedOpportunity } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { one } from "@/lib/http";

export const instant = false;
export const metadata = { title: "Opportunité" };

type OpportunityPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

async function OpportunityDetails({ params, searchParams }: OpportunityPageProps) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const opportunity = await getValidatedOpportunity(id);
  if (!opportunity) notFound();

  return (
    <PublicFrame>
      <main className="mx-auto w-full max-w-5xl">
        <Link
          href="/#opportunites"
          className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-blue transition hover:text-navy focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
        >
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-4">
            <path d="M16 10H4m5 5-5-5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Toutes les opportunités
        </Link>

        <Flash error={one(query.erreur)} ok={one(query.ok)} />

        <header className="relative mt-3 overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-navy via-blue to-leaf px-5 py-7 text-white shadow-xl shadow-navy/15 sm:px-8 sm:py-10">
          <div aria-hidden="true" className="absolute -right-10 -top-16 size-56 rounded-full border-[28px] border-white/10" />
          <div className="relative">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">
              <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-4">
                <path d="m4 10 4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Opportunité validée
            </span>
            <h1 className="display mt-4 max-w-3xl break-words text-3xl leading-tight sm:text-5xl">
              {opportunity.title}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/85">
              <p className="flex items-center gap-2">
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-4 shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 3v3m10-3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13H4V6a1 1 0 0 1 1-1Z" />
                </svg>
                <span>Du {formatDate(opportunity.validFrom)} au {formatDate(opportunity.validUntil)}</span>
              </p>
              {opportunity.location ? (
                <p className="flex items-center gap-2">
                  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-4 shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
                    <circle cx="12" cy="10" r="2" />
                  </svg>
                  {opportunity.location}
                </p>
              ) : null}
            </div>
          </div>
        </header>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <article className="card min-w-0 p-5 sm:p-7">
            <h2 className="text-lg font-bold text-navy">À propos de cette opportunité</h2>
            <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-ink/75">
              {opportunity.description}
            </p>

            {opportunity.registrationLink || opportunity.contact || opportunity.contactPeople ? (
              <dl className="mt-6 grid gap-4 border-t border-line pt-5 sm:grid-cols-2">
                {opportunity.contact ? (
                  <div className="min-w-0">
                    <dt className="text-xs font-semibold text-ink/50">Contact</dt>
                    <dd className="mt-1 break-words text-sm font-medium text-navy">{opportunity.contact}</dd>
                  </div>
                ) : null}
                {opportunity.contactPeople ? (
                  <div className="min-w-0">
                    <dt className="text-xs font-semibold text-ink/50">Personnes à contacter</dt>
                    <dd className="mt-1 whitespace-pre-line break-words text-sm text-navy">{opportunity.contactPeople}</dd>
                  </div>
                ) : null}
                {opportunity.registrationLink ? (
                  <div className="min-w-0">
                    <dt className="text-xs font-semibold text-ink/50">Lien d’inscription</dt>
                    <dd className="mt-1">
                      <a
                        href={opportunity.registrationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="break-all text-sm font-semibold text-blue underline decoration-blue/30 underline-offset-4 hover:decoration-blue"
                      >
                        Ouvrir le lien
                      </a>
                    </dd>
                  </div>
                ) : null}
              </dl>
            ) : null}
          </article>

          <aside className="card grid content-start gap-3 p-5">
            <p className="text-xs font-bold tracking-[0.16em] text-green uppercase">Période de validité</p>
            <p className="font-semibold text-navy">Du {formatDate(opportunity.validFrom)}</p>
            <p className="-mt-2 text-sm text-ink/65">Au {formatDate(opportunity.validUntil)}</p>
            <a href="#candidature" className="btn btn-gold mt-2 w-full">
              Envoyer mes coordonnées
            </a>
          </aside>
        </div>

        <section id="candidature" aria-labelledby="application-title" className="mt-8 scroll-mt-24">
          <div className="overflow-hidden rounded-[1.75rem] border border-line/80 bg-white shadow-lg shadow-navy/5">
            <header className="border-b border-line/80 bg-paper/70 px-5 py-5 sm:px-8">
              <p className="text-xs font-bold tracking-[0.16em] text-green uppercase">Nous contacter</p>
              <h2 id="application-title" className="display mt-1 text-2xl text-navy sm:text-3xl">
                Manifester mon intérêt
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/65">
                Laissez vos coordonnées pour être contacté au sujet de cette opportunité.
              </p>
            </header>

            <form action={submitOpportunityApplication} className="grid gap-4 p-5 sm:grid-cols-2 sm:p-8">
              <input type="hidden" name="opportunityId" value={opportunity.id} />
              <label className="field">
                <span>Nom complet</span>
                <input name="fullName" type="text" autoComplete="name" minLength={2} maxLength={160} required />
              </label>
              <label className="field">
                <span>Email</span>
                <input name="email" type="email" autoComplete="email" maxLength={254} required />
              </label>
              <label className="field">
                <span>Tel/cel</span>
                <input name="phone" type="tel" autoComplete="tel" maxLength={30} required />
              </label>
              <label className="field sm:col-span-2">
                <span>Titre de l’opportunité</span>
                <input value={opportunity.title} readOnly aria-readonly="true" className="bg-paper text-ink/70" />
              </label>
              <div className="sm:col-span-2">
                <SubmitButton variant="btn btn-green min-h-12 w-full rounded-2xl sm:w-auto sm:px-8">
                  Envoyer mes coordonnées
                </SubmitButton>
                <p className="mt-3 text-xs leading-5 text-ink/50">
                  Vos coordonnées seront enregistrées afin que l’équipe puisse vous recontacter.
                </p>
              </div>
            </form>
          </div>
        </section>
      </main>
    </PublicFrame>
  );
}

export default function OpportunityPage(props: OpportunityPageProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-paper" />}>
      <OpportunityDetails {...props} />
    </Suspense>
  );
}
