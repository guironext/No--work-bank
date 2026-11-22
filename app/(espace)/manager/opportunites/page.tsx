import { ManagerOpportunityDialog } from "@/components/manager-opportunity-dialog";
import { ManagerOpportunityActions } from "@/components/manager-opportunity-actions";
import { Empty } from "@/components/ui";
import { formatDate } from "@/lib/format";
import { listManagerOpportunities } from "@/lib/data";

export const instant = false;
export const metadata = { title: "Opportunités" };

export default async function OpportunitiesPage() {
  const opportunities = await listManagerOpportunities();

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6 sm:gap-8">
      <header className="flex flex-col gap-4 rounded-3xl bg-gradient-to-br from-navy via-blue to-[#0c6b30] p-5 text-white shadow-xl shadow-navy/10 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="min-w-0">
          <p className="text-xs font-bold tracking-[0.18em] text-[#f3c56a] uppercase">Espace Manager</p>
          <h1 className="display mt-2 text-3xl sm:text-4xl">Opportunités</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/75">
            Créez et partagez les opportunités à saisir par votre communauté.
          </p>
        </div>
        <ManagerOpportunityDialog />
      </header>

      <section aria-labelledby="opportunities-list-title" className="grid gap-4">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold tracking-[0.16em] text-green uppercase">Votre sélection</p>
            <h2 id="opportunities-list-title" className="mt-1 text-xl font-bold text-navy sm:text-2xl">
              Opportunités publiées
            </h2>
          </div>
          {opportunities.length > 0 ? (
            <span className="chip">{opportunities.length} {opportunities.length === 1 ? "opportunité" : "opportunités"}</span>
          ) : null}
        </header>

        {opportunities.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {opportunities.map((opportunity) => (
              <article
                key={opportunity.id}
                className="card group relative flex min-w-0 flex-col overflow-hidden p-4 transition-shadow hover:shadow-lg sm:p-6"
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-green via-blue to-gold"
                />
                <header className="flex min-w-0 items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold tracking-[0.14em] text-green uppercase">Opportunité</p>
                    <h3 className="mt-2 break-words text-xl font-bold leading-snug text-navy sm:text-2xl">
                      {opportunity.title}
                    </h3>
                  </div>
                  <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-green/10 text-lg text-green">
                    ✦
                  </span>
                </header>

                <div className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl bg-paper px-3 py-2.5 text-sm text-navy">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="size-4 shrink-0 text-green"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 3v3m10-3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13H4V6a1 1 0 0 1 1-1Z" />
                  </svg>
                  <span className="font-semibold">Valide du</span>
                  <time dateTime={opportunity.validFrom.toISOString().slice(0, 10)}>{formatDate(opportunity.validFrom)}</time>
                  <span aria-hidden="true" className="text-ink/40">→</span>
                  <time dateTime={opportunity.validUntil.toISOString().slice(0, 10)}>{formatDate(opportunity.validUntil)}</time>
                </div>

                <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-6 text-ink/75">
                  {opportunity.description}
                </p>

                {opportunity.location || opportunity.contact || opportunity.contactPeople || opportunity.registrationLink ? (
                  <dl className="mt-5 grid gap-3 border-t border-line pt-4 sm:grid-cols-2">
                    {opportunity.location ? (
                      <div className="min-w-0">
                        <dt className="text-xs font-semibold text-ink/50">Lieu</dt>
                        <dd className="mt-1 break-words text-sm font-medium text-navy">{opportunity.location}</dd>
                      </div>
                    ) : null}
                    {opportunity.contact ? (
                      <div className="min-w-0">
                        <dt className="text-xs font-semibold text-ink/50">Contact</dt>
                        <dd className="mt-1 break-words text-sm font-medium text-navy">{opportunity.contact}</dd>
                      </div>
                    ) : null}
                    {opportunity.contactPeople ? (
                      <div className="min-w-0">
                        <dt className="text-xs font-semibold text-ink/50">Personnes à contacter</dt>
                        <dd className="mt-1 whitespace-pre-line break-words text-sm text-navy">
                          {opportunity.contactPeople}
                        </dd>
                      </div>
                    ) : null}
                    {opportunity.registrationLink ? (
                      <div className="min-w-0">
                        <dt className="text-xs font-semibold text-ink/50">Inscription</dt>
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
                <ManagerOpportunityActions
                  id={opportunity.id}
                  title={opportunity.title}
                  initiallyValidated={opportunity.validatedAt !== null}
                />
              </article>
            ))}
          </div>
        ) : (
          <Empty
            title="Aucune opportunité pour le moment"
            text="Créez votre première opportunité : elle apparaîtra ici après son enregistrement."
          />
        )}
      </section>
    </div>
  );
}
