import { ManagerTrainingActions } from "@/components/manager-training-actions";
import { ManagerTrainingDialog } from "@/components/manager-training-dialog";
import { Empty } from "@/components/ui";
import { formatDate } from "@/lib/format";
import { listManagerTrainings } from "@/lib/data";

export const instant = false;
export const metadata = { title: "Formations" };

export default async function ManagerTrainingPage() {
  const trainings = await listManagerTrainings();

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6 sm:gap-8">
      <header className="relative isolate flex flex-col gap-5 overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-navy via-blue to-[#0c6b30] p-5 text-white shadow-xl shadow-navy/10 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div aria-hidden="true" className="pointer-events-none absolute -right-14 -top-20 size-64 rounded-full border-[28px] border-white/10" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 right-36 size-56 rounded-full border-[22px] border-white/5" />
        <div className="relative min-w-0">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold tracking-[0.16em] text-[#f3c56a] uppercase sm:text-xs">
            Espace Manager · Formation
          </p>
          <h1 className="display mt-3 text-3xl sm:text-4xl">Formations</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/75">
            Publiez des formations utiles et suivez leur validation depuis un seul espace.
          </p>
        </div>
        <div className="relative shrink-0">
          <ManagerTrainingDialog />
        </div>
      </header>

      <section aria-labelledby="manager-training-list-title" className="grid gap-4">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold tracking-[0.16em] text-green uppercase">Votre espace formation</p>
            <h2 id="manager-training-list-title" className="mt-1 text-xl font-bold text-navy sm:text-2xl">
              Toutes les formations
            </h2>
          </div>
          {trainings.length > 0 ? (
            <span className="chip">
              {trainings.length} {trainings.length === 1 ? "formation" : "formations"}
            </span>
          ) : null}
        </header>

        {trainings.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {trainings.map((training) => {
              const details = [
                ["Lieu", training.location],
                ["Contact", training.contact],
                ["Personnes à contacter", training.contactPeople],
              ].filter((detail): detail is [string, string] => Boolean(detail[1]));

              return (
                <article
                  key={training.id}
                  className="card group relative flex h-[28rem] min-w-0 flex-col overflow-hidden p-4 transition-shadow hover:shadow-lg sm:p-6"
                >
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-green via-blue to-gold"
                  />
                  <div
                    tabIndex={0}
                    aria-label={`Contenu de la formation ${training.title}`}
                    className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1 [scrollbar-width:thin]"
                  >
                    <header className="flex min-w-0 items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-[11px] font-bold tracking-[0.14em] text-green uppercase">Formation</p>
                          <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${training.validatedAt ? "bg-green/10 text-leaf" : "bg-gold/15 text-[#82570d]"}`}>
                            {training.validatedAt ? "Validée" : "À valider"}
                          </span>
                        </div>
                        <h3 className="mt-2 break-words text-xl font-bold leading-snug text-navy sm:text-2xl">
                          {training.title}
                        </h3>
                      </div>
                      <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-2xl bg-green/10 text-green">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="size-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 20h16M6 17V7l6-3 6 3v10M9 10h.01M15 10h.01M9 13h.01M15 13h.01M10 17v-2h4v2" />
                        </svg>
                      </span>
                    </header>

                    <dl className="mt-4 grid gap-3 rounded-2xl bg-paper p-3 sm:grid-cols-2 sm:p-4">
                      <div className="min-w-0">
                        <dt className="text-xs font-semibold text-ink/50">Début de formation</dt>
                        <dd className="mt-1">
                          <time dateTime={training.startDate.toISOString().slice(0, 10)} className="text-sm font-medium text-navy">
                            {formatDate(training.startDate)}
                          </time>
                        </dd>
                      </div>
                      <div className="min-w-0">
                        <dt className="text-xs font-semibold text-ink/50">Période de validité</dt>
                        <dd className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium text-navy">
                          <time dateTime={training.validFrom.toISOString().slice(0, 10)}>{formatDate(training.validFrom)}</time>
                          <span aria-hidden="true" className="text-ink/40">→</span>
                          <time dateTime={training.validUntil.toISOString().slice(0, 10)}>{formatDate(training.validUntil)}</time>
                        </dd>
                      </div>
                    </dl>

                    <div className="mt-4">
                      <h4 className="text-sm font-bold text-navy">Description</h4>
                      <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-ink/75">
                        {training.description}
                      </p>
                    </div>

                    {details.length > 0 || training.registrationLink ? (
                      <dl className="mt-5 grid gap-3 border-t border-line pt-4 sm:grid-cols-2">
                        {details.map(([label, value]) => (
                          <div key={label} className="min-w-0">
                            <dt className="text-xs font-semibold text-ink/50">{label}</dt>
                            <dd className="mt-1 whitespace-pre-line break-words text-sm text-navy">{value}</dd>
                          </div>
                        ))}
                        {training.registrationLink ? (
                          <div className="min-w-0">
                            <dt className="text-xs font-semibold text-ink/50">Lien d’inscription</dt>
                            <dd className="mt-1">
                              <a
                                href={training.registrationLink}
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
                  </div>

                  <ManagerTrainingActions
                    id={training.id}
                    title={training.title}
                    initiallyValidated={training.validatedAt !== null}
                  />
                </article>
              );
            })}
          </div>
        ) : (
          <Empty
            title="Aucune formation pour le moment"
            text="Ajoutez votre première formation : elle apparaîtra ici après son enregistrement."
          />
        )}
      </section>
    </div>
  );
}
