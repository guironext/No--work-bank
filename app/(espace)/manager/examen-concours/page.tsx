import { ManagerExamConcoursActions } from "@/components/manager-exam-concours-actions";
import { ManagerExamConcoursDialog } from "@/components/manager-exam-concours-dialog";
import { Empty } from "@/components/ui";
import { formatDate } from "@/lib/format";
import { listManagerExamConcours } from "@/lib/data";

export const instant = false;
export const metadata = { title: "Examens et concours" };

export default async function ManagerExamConcoursPage() {
  const items = await listManagerExamConcours();
  const groups = [
    { type: "examen", title: "Examens", eyebrow: "Épreuves et certifications" },
    { type: "concours", title: "Concours", eyebrow: "Candidatures et admissions" },
  ];

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6 pb-4 sm:gap-8">
      <header className="relative isolate overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-navy via-blue to-[#0c6b30] p-5 text-white shadow-xl shadow-navy/10 sm:rounded-[1.75rem] sm:p-8">
        <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full border-[28px] border-white/10 sm:right-12 sm:-top-36 sm:size-80" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 left-1/3 size-56 rounded-full border-[22px] border-white/5" />
        <div className="relative grid gap-5 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-bold tracking-[0.14em] text-[#f3c56a] uppercase sm:text-xs">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-[#f3c56a]" />
              Espace Manager
            </p>
            <h1 className="display mt-3 text-[1.8rem] leading-tight sm:mt-4 sm:text-4xl">Examens &amp; concours</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/75 sm:mt-3 sm:text-base">
              Centralisez les échéances importantes et gérez leur validation depuis votre espace.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {groups.map((group) => {
                const count = items.filter((item) => item.type === group.type).length;
                return (
                  <span key={group.type} className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-xs font-medium text-white/90">
                    <span className="font-bold text-white">{count}</span>
                    {group.type === "examen" ? "examen(s)" : "concours"}
                  </span>
                );
              })}
            </div>
          </div>
          <div className="min-w-0 lg:pb-1">
            <ManagerExamConcoursDialog />
          </div>
        </div>
      </header>

      <div className="grid gap-8">
        {groups.map((group) => {
          const entries = items.filter((item) => item.type === group.type);
          return (
            <section key={group.type} aria-labelledby={`manager-${group.type}-title`} className="grid gap-4">
              <header className="flex min-w-0 items-center gap-3 rounded-2xl border border-line/80 bg-white p-3 shadow-sm sm:gap-4 sm:p-4">
                <span aria-hidden="true" className={`grid size-11 shrink-0 place-items-center rounded-xl sm:size-12 ${group.type === "examen" ? "bg-blue/10 text-blue" : "bg-green/10 text-green"}`}>
                  {group.type === "examen" ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="size-5 sm:size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 3.75h7l4 4V20a.75.75 0 0 1-.75.75h-9.5A.75.75 0 0 1 7 20V3.75Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 4v4h4M9.5 13h5m-5 3h5" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="size-5 sm:size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m12 3 2.3 5.2 5.7.5-4.3 3.8 1.3 5.6-5-3-5 3 1.3-5.6L4 8.7l5.7-.5L12 3Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 21h8" />
                    </svg>
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold tracking-[0.13em] text-green uppercase sm:text-[11px]">{group.eyebrow}</p>
                  <h2 id={`manager-${group.type}-title`} className="mt-0.5 text-lg font-bold text-navy sm:text-xl">
                    {group.title}
                  </h2>
                </div>
                <span className="chip shrink-0">{entries.length} {entries.length === 1 ? "offre" : "offres"}</span>
              </header>

              {entries.length > 0 ? (
                <div className="grid gap-4 xl:grid-cols-2">
                  {entries.map((item) => (
                    <article
                      key={item.id}
                      className="card group relative flex h-[22rem] min-w-0 flex-col overflow-hidden p-4 transition-shadow hover:shadow-lg sm:h-[23rem] sm:p-5"
                    >
                      <div aria-hidden="true" className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${item.type === "examen" ? "from-blue via-green to-gold" : "from-green via-blue to-gold"}`} />
                      <div
                        tabIndex={0}
                        aria-label={`Contenu de ${item.type === "examen" ? "l’examen" : "du concours"} ${item.title}`}
                        className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1 [scrollbar-width:thin]"
                      >
                        <header className="flex min-w-0 items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className={`text-[10px] font-bold tracking-[0.14em] uppercase ${item.type === "examen" ? "text-blue" : "text-green"}`}>{item.type}</p>
                              <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${item.validatedAt ? "bg-green/10 text-leaf" : "bg-gold/15 text-[#82570d]"}`}>
                                {item.validatedAt ? "Validé" : "À valider"}
                              </span>
                            </div>
                            <h3 className="mt-1.5 break-words text-lg font-bold leading-snug text-navy sm:text-xl">{item.title}</h3>
                          </div>
                          <span aria-hidden="true" className={`grid size-9 shrink-0 place-items-center rounded-xl ${item.type === "examen" ? "bg-blue/10 text-blue" : "bg-green/10 text-green"}`}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="size-5">
                              {item.type === "examen" ? (
                                <>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 3.75h7l4 4V20a.75.75 0 0 1-.75.75h-9.5A.75.75 0 0 1 7 20V3.75Z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 4v4h4M9.5 13h5m-5 3h5" />
                                </>
                              ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" d="m12 3 2.3 5.2 5.7.5-4.3 3.8 1.3 5.6-5-3-5 3 1.3-5.6L4 8.7l5.7-.5L12 3Z" />
                              )}
                            </svg>
                          </span>
                        </header>

                        <dl className="mt-3 grid gap-2.5 rounded-xl bg-paper p-3 sm:grid-cols-2">
                          <div className="min-w-0 sm:col-span-2">
                            <dt className="text-xs font-semibold text-ink/50">Période de validité</dt>
                            <dd className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium text-navy">
                              <time dateTime={item.validFrom.toISOString().slice(0, 10)}>{formatDate(item.validFrom)}</time>
                              <span aria-hidden="true" className="text-ink/40">→</span>
                              <time dateTime={item.validUntil.toISOString().slice(0, 10)}>{formatDate(item.validUntil)}</time>
                            </dd>
                          </div>
                          {item.ministry ? (
                            <div className="min-w-0 sm:col-span-2">
                              <dt className="text-xs font-semibold text-ink/50">Ministère</dt>
                              <dd className="mt-0.5 break-words text-sm text-navy">{item.ministry}</dd>
                            </div>
                          ) : null}
                        </dl>

                        <div className="mt-3">
                          <h4 className="text-sm font-bold text-navy">Description</h4>
                          <p className="mt-0.5 whitespace-pre-wrap break-words text-sm leading-5 text-ink/75">{item.description}</p>
                        </div>

                        {item.documentUrl ? (
                          <a
                            href={item.documentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 flex min-w-0 items-center gap-3 rounded-xl border border-line bg-white p-2.5 text-sm font-semibold text-blue transition hover:border-blue/30 hover:bg-paper"
                          >
                            <span aria-hidden="true" className="grid size-8 shrink-0 place-items-center rounded-lg bg-blue/10">
                              <svg viewBox="0 0 20 20" fill="none" className="size-4">
                                <path d="M10 3v9m0 0 3-3m-3 3L7 9m-3 4v3h12v-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </span>
                            <span className="min-w-0 break-all">{item.documentName || "Ouvrir le document joint"}</span>
                          </a>
                        ) : null}
                      </div>

                      <ManagerExamConcoursActions
                        id={item.id}
                        title={item.title}
                        initiallyValidated={item.validatedAt !== null}
                      />
                    </article>
                  ))}
                </div>
              ) : (
                <Empty
                  title={`Aucun ${group.type === "examen" ? "examen" : "concours"} pour le moment`}
                  text={`Les ${group.type === "examen" ? "examens" : "concours"} ajoutés apparaîtront ici.`}
                />
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
