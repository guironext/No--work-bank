import Link from "next/link";
import { SubmitButton } from "@/components/submit";
import { Empty, Flash } from "@/components/ui";
import { closeTicket } from "@/lib/actions";
import { adminOverview, listReportedMessages, listTicketsAdmin } from "@/lib/data";
import { one } from "@/lib/http";

export const instant = false;
export const metadata = { title: "Administration" };

function count(value: number) {
  return new Intl.NumberFormat("fr-FR").format(value);
}

function MetricCard({
  label,
  value,
  note,
  featured = false,
}: {
  label: string;
  value: string;
  note: string;
  featured?: boolean;
}) {
  return (
    <article
      className={`card relative overflow-hidden p-5 transition-transform duration-200 hover:-translate-y-0.5 ${
        featured ? "border-l-4 border-l-gold" : ""
      }`}
    >
      <p className="text-sm font-semibold text-ink/65">{label}</p>
      <p className="mt-4 break-words text-3xl font-bold tracking-tight text-navy sm:text-4xl">{value}</p>
      <p className="mt-2 text-xs leading-5 text-ink/55">{note}</p>
    </article>
  );
}

export default async function AdminHome(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [stats, tickets, reported, sp] = await Promise.all([
    adminOverview(),
    listTicketsAdmin(),
    listReportedMessages(),
    props.searchParams,
  ]);

  const activityMetrics = [
    { label: "Membres inscrits", value: count(stats.people), note: "Depuis l’ouverture de la plateforme", featured: true },
    { label: "Actifs sur 30 jours", value: count(stats.active), note: "Membres vus au cours des 30 derniers jours", featured: true },
    { label: "Offres publiées", value: count(stats.openJobs), note: "Offres actuellement en ligne" },
    { label: "Candidatures", value: count(stats.applications), note: "Toutes les candidatures reçues" },
  ];

  const overviewMetrics = [
    { label: "Profils vérifiés", value: count(stats.verifiedPeople), note: "Membres vérifiés" },
    { label: "Entreprises", value: count(stats.companies), note: "Organisations enregistrées" },
    { label: "Entreprises vérifiées", value: count(stats.verifiedCompanies), note: "Organisations validées" },
    { label: "Recrutements confirmés", value: count(stats.hires), note: "Candidatures converties en recrutement" },
  ];

  return (
    <div className="grid gap-8">
      <header className="relative isolate overflow-hidden rounded-[2rem] bg-gradient-to-br from-navy via-blue to-[#0c6b30] p-6 text-white shadow-xl shadow-navy/10 sm:p-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-28 size-80 rounded-full border border-white/10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-8 -top-16 size-56 rounded-full border border-white/10"
        />
        <div className="relative max-w-2xl">
          <p className="text-xs font-bold tracking-[0.2em] text-[#f3c56a] uppercase">Espace administration</p>
          <h1 className="display mt-3 text-4xl sm:text-5xl">Vue d’ensemble</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-white/75 sm:text-base">
            Suivez l’activité, la croissance et les opérations de NOÉ Work Bank depuis un seul endroit.
          </p>
        </div>
      </header>

      <Flash ok={one(sp.ok)} />

      <section className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <p className="text-xs font-bold tracking-[0.16em] text-green uppercase">Validation</p>
          <h2 className="mt-1 text-lg font-bold text-navy">Emplois et stages des managers</h2>
          <p className="mt-1 text-sm leading-6 text-ink/60">
            Consultez les offres soumises et activez celles qui sont prêtes.
          </p>
        </div>
        <Link href="/admin/offres" className="btn btn-ghost min-h-11 shrink-0 justify-center">
          Examiner les offres
          <span aria-hidden="true">→</span>
        </Link>
      </section>

      <section aria-labelledby="activity-title" className="grid gap-4">
        <div>
          <p className="text-xs font-bold tracking-[0.16em] text-green uppercase">Indicateurs clés</p>
          <h2 id="activity-title" className="mt-1 text-xl font-bold text-navy">Activité de la plateforme</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {activityMetrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </div>
      </section>

      <section aria-labelledby="overview-title" className="grid gap-4">
        <div>
          <p className="text-xs font-bold tracking-[0.16em] text-green uppercase">Suivi opérationnel</p>
          <h2 id="overview-title" className="mt-1 text-xl font-bold text-navy">Qualité et développement</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {overviewMetrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <div aria-labelledby="tickets-title" className="card min-w-0 p-5 sm:p-6">
          <header className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold tracking-[0.16em] text-green uppercase">Assistance</p>
              <h2 id="tickets-title" className="mt-1 text-xl font-bold text-navy">Réclamations</h2>
            </div>
            <span className="chip">{tickets.length}</span>
          </header>
          {tickets.length > 0 ? (
            <div className="grid gap-3">
              {tickets.map((ticket) => (
                <form
                  key={ticket.id}
                  action={closeTicket}
                  className="flex flex-col gap-4 rounded-2xl border border-line bg-paper/60 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <input type="hidden" name="ticketId" value={ticket.id} />
                  <div className="min-w-0">
                    <p className="font-semibold text-navy">{ticket.subject}</p>
                    <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-ink/65">{ticket.body}</p>
                  </div>
                  {ticket.status === "clos" ? (
                    <span className="chip chip-green shrink-0">Clos</span>
                  ) : (
                    <SubmitButton variant="btn btn-small shrink-0">Clore</SubmitButton>
                  )}
                </form>
              ))}
            </div>
          ) : (
            <Empty title="Aucune réclamation" text="Les nouvelles demandes apparaîtront ici." />
          )}
        </div>

        <div aria-labelledby="reports-title" className="card min-w-0 p-5 sm:p-6">
          <header className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold tracking-[0.16em] text-green uppercase">Modération</p>
              <h2 id="reports-title" className="mt-1 text-xl font-bold text-navy">Messages signalés</h2>
            </div>
            <span className="chip">{reported.length}</span>
          </header>
          {reported.length > 0 ? (
            <div className="grid gap-3">
              {reported.map((row) => (
                <article key={row.message.id} className="rounded-2xl border border-line bg-paper/60 p-4">
                  <p className="text-sm font-semibold text-navy">
                    {row.sender.firstName} {row.sender.lastName}
                  </p>
                  <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-ink/70">
                    {row.message.body}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <Empty title="Aucun signalement" text="Les messages signalés apparaîtront ici." />
          )}
        </div>
      </section>
    </div>
  );
}
