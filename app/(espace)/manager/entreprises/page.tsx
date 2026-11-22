import { ManagerCompanyActions } from "@/components/manager-company-actions";
import { ManagerCompanyDialog } from "@/components/manager-company-dialog";
import { Empty } from "@/components/ui";
import { listManagerCompanyListings } from "@/lib/data";

export const instant = false;
export const metadata = { title: "Entreprises" };

export default async function ManagerCompaniesPage() {
  const companies = await listManagerCompanyListings();

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6 pb-4 sm:gap-8">
      <header className="relative isolate overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-navy via-blue to-[#0c6b30] p-5 text-white shadow-xl shadow-navy/10 sm:rounded-[1.75rem] sm:p-8">
        <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full border-[28px] border-white/10 sm:right-12 sm:-top-36 sm:size-80" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 left-1/3 size-56 rounded-full border-[22px] border-white/5" />
        <div className="relative grid gap-5 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-bold tracking-[0.14em] text-[#f3c56a] uppercase sm:text-xs">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-[#f3c56a]" />
              Espace Manager · Réseau professionnel
            </p>
            <h1 className="display mt-3 text-[1.8rem] leading-tight sm:mt-4 sm:text-4xl">Entreprises</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/75 sm:mt-3 sm:text-base">
              Présentez les entreprises et créez de nouvelles connexions professionnelles.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-xs font-medium text-white/90">
              <span className="font-bold text-white">{companies.length}</span>
              {companies.length === 1 ? "entreprise référencée" : "entreprises référencées"}
            </div>
          </div>
          <div className="min-w-0 lg:pb-1">
            <ManagerCompanyDialog />
          </div>
        </div>
      </header>

      <section aria-labelledby="manager-company-list-title" className="grid gap-4">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold tracking-[0.16em] text-green uppercase">Votre réseau</p>
            <h2 id="manager-company-list-title" className="mt-1 text-xl font-bold text-navy sm:text-2xl">
              Toutes les entreprises
            </h2>
          </div>
          {companies.length > 0 ? <span className="chip">{companies.length} {companies.length === 1 ? "entreprise" : "entreprises"}</span> : null}
        </header>

        {companies.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {companies.map((company) => (
              <article
                key={company.id}
                className="card group relative flex h-[26rem] min-w-0 flex-col overflow-hidden p-4 transition-shadow hover:shadow-lg sm:h-[28rem] sm:p-5"
              >
                <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-green via-blue to-gold" />
                <div
                  tabIndex={0}
                  aria-label={`Fiche de l’entreprise ${company.companyName}`}
                  className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1 [scrollbar-width:thin]"
                >
                  <header className="flex min-w-0 items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-[10px] font-bold tracking-[0.14em] text-green uppercase">Entreprise</p>
                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${company.validatedAt ? "bg-green/10 text-leaf" : "bg-gold/15 text-[#82570d]"}`}>
                          {company.validatedAt ? "Validée" : "À valider"}
                        </span>
                      </div>
                      <h3 className="mt-1.5 break-words text-lg font-bold leading-snug text-navy sm:text-xl">{company.title}</h3>
                    </div>
                    <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-xl bg-green/10 text-green">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 20h16M6 17V7l6-3 6 3v13M9 10h.01M15 10h.01M9 13h.01M15 13h.01M10 17v-2h4v2" />
                      </svg>
                    </span>
                  </header>

                  <dl className="mt-3 grid gap-2 rounded-xl bg-paper p-3 sm:grid-cols-2">
                    <div className="min-w-0">
                      <dt className="text-xs font-semibold text-ink/50">Entreprise</dt>
                      <dd className="mt-0.5 break-words text-sm font-medium text-navy">{company.companyName}</dd>
                    </div>
                    <div className="min-w-0">
                      <dt className="text-xs font-semibold text-ink/50">Localisation</dt>
                      <dd className="mt-0.5 break-words text-sm font-medium text-navy">{company.location}</dd>
                    </div>
                  </dl>

                  <div className="mt-3">
                    <h4 className="text-sm font-bold text-navy">À propos</h4>
                    <p className="mt-0.5 whitespace-pre-wrap break-words text-sm leading-5 text-ink/75">{company.description}</p>
                  </div>

                  {company.contact ? (
                    <div className="mt-3 border-t border-line/80 pt-3">
                      <h4 className="text-xs font-semibold text-ink/50">Contact</h4>
                      <p className="mt-0.5 whitespace-pre-line break-words text-sm text-navy">{company.contact}</p>
                    </div>
                  ) : null}

                  {company.website ? (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex min-h-10 max-w-full items-center gap-2 rounded-xl border border-blue/15 bg-blue/5 px-3 py-2 text-sm font-semibold text-blue transition hover:border-blue/30 hover:bg-blue/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
                    >
                      <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-4 shrink-0">
                        <path d="M11 3h6v6m0-6-8 8M15 11v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className="truncate">Visiter le site web</span>
                    </a>
                  ) : null}
                </div>

                <ManagerCompanyActions
                  id={company.id}
                  title={company.title}
                  initiallyValidated={company.validatedAt !== null}
                />
              </article>
            ))}
          </div>
        ) : (
          <Empty
            title="Aucune entreprise pour le moment"
            text="Ajoutez la première entreprise : sa fiche apparaîtra ici après son enregistrement."
          />
        )}
      </section>
    </div>
  );
}
