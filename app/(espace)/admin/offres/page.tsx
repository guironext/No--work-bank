import Link from "next/link";
import { AdminEmploymentValidation } from "@/components/admin-employment-validation";
import { Empty, PageTitle } from "@/components/ui";
import { formatDate } from "@/lib/format";
import { listJobsAdmin, listManagerEmploymentPosts } from "@/lib/data";

export const instant = false;
export const metadata = { title: "Offres" };

export default async function JobsAdminPage() {
  const [rows, employmentPosts] = await Promise.all([
    listJobsAdmin(),
    listManagerEmploymentPosts(),
  ]);
  return (
    <div className="grid gap-8">
      <section>
        <PageTitle title="Offres" />
        <div className="grid gap-2">
          {rows.map((row) => (
            <Link key={row.job.id} href={`/emplois/${row.job.id}`} className="card flex items-center justify-between p-4 text-sm">
              <span>{row.job.title} · {row.company.legalName}</span>
              <span className="chip">{row.job.status}</span>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="manager-employment-review-title" className="grid gap-4">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold tracking-[0.16em] text-green uppercase">Modération</p>
            <h2 id="manager-employment-review-title" className="mt-1 text-xl font-bold text-navy sm:text-2xl">
              Emplois et stages des managers
            </h2>
            <p className="mt-1 text-sm leading-6 text-ink/60">
              Vérifiez et activez les offres soumises par les managers.
            </p>
          </div>
          {employmentPosts.length > 0 ? <span className="chip">{employmentPosts.length} offres</span> : null}
        </header>

        {employmentPosts.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {employmentPosts.map((post) => (
              <article key={post.id} className="card min-w-0 overflow-hidden p-4 sm:p-6">
                <div aria-hidden="true" className="mb-4 h-1 rounded-full bg-gradient-to-r from-green via-blue to-gold" />
                <p className="text-[11px] font-bold tracking-[0.14em] text-green uppercase">Offre manager</p>
                <h3 className="mt-2 break-words text-xl font-bold leading-snug text-navy sm:text-2xl">{post.title}</h3>
                <dl className="mt-4 grid gap-3 rounded-2xl bg-paper p-3 sm:grid-cols-2 sm:p-4">
                  <div className="min-w-0">
                    <dt className="text-xs font-semibold text-ink/50">Entreprise</dt>
                    <dd className="mt-1 break-words text-sm font-semibold text-navy">{post.companyName}</dd>
                  </div>
                  <div className="min-w-0">
                    <dt className="text-xs font-semibold text-ink/50">Localisation</dt>
                    <dd className="mt-1 break-words text-sm text-navy">{post.location}</dd>
                  </div>
                  <div className="min-w-0">
                    <dt className="text-xs font-semibold text-ink/50">Date</dt>
                    <dd className="mt-1 text-sm text-navy">
                      <time dateTime={post.offerDate.toISOString().slice(0, 10)}>{formatDate(post.offerDate)}</time>
                    </dd>
                  </div>
                  <div className="min-w-0">
                    <dt className="text-xs font-semibold text-ink/50">E-mail</dt>
                    <dd className="mt-1 break-all text-sm text-blue">{post.email}</dd>
                  </div>
                </dl>
                <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-6 text-ink/70">{post.description}</p>
                {post.mission || post.profile || post.level || post.workplace || post.experience || post.salary ? (
                  <dl className="mt-4 grid gap-3 border-t border-line pt-4 sm:grid-cols-2">
                    {post.mission ? <div><dt className="text-xs font-semibold text-ink/50">Mission</dt><dd className="mt-1 whitespace-pre-wrap break-words text-sm text-navy">{post.mission}</dd></div> : null}
                    {post.profile ? <div><dt className="text-xs font-semibold text-ink/50">Profil recherché</dt><dd className="mt-1 whitespace-pre-wrap break-words text-sm text-navy">{post.profile}</dd></div> : null}
                    {post.level ? <div><dt className="text-xs font-semibold text-ink/50">Niveau</dt><dd className="mt-1 break-words text-sm text-navy">{post.level}</dd></div> : null}
                    {post.workplace ? <div><dt className="text-xs font-semibold text-ink/50">Lieu précis</dt><dd className="mt-1 break-words text-sm text-navy">{post.workplace}</dd></div> : null}
                    {post.experience ? <div><dt className="text-xs font-semibold text-ink/50">Expérience</dt><dd className="mt-1 break-words text-sm text-navy">{post.experience}</dd></div> : null}
                    {post.salary ? <div><dt className="text-xs font-semibold text-ink/50">Salaire</dt><dd className="mt-1 break-words text-sm text-navy">{post.salary}</dd></div> : null}
                  </dl>
                ) : null}
                <AdminEmploymentValidation
                  id={post.id}
                  title={post.title}
                  initiallyValidated={post.validatedAt !== null}
                />
              </article>
            ))}
          </div>
        ) : (
          <Empty
            title="Aucune offre à valider"
            text="Les offres d’emploi et de stage soumises par les managers apparaîtront ici."
          />
        )}
      </section>
    </div>
  );
}
