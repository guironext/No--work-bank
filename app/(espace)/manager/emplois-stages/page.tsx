import { ManagerEmploymentDialog } from "@/components/manager-employment-dialog";
import { ManagerEmploymentActions } from "@/components/manager-employment-actions";
import { Empty } from "@/components/ui";
import { formatDate } from "@/lib/format";
import { listManagerEmploymentPosts } from "@/lib/data";

export const instant = false;
export const metadata = { title: "Emplois et stages" };

export default async function ManagerEmploymentPage() {
  const posts = await listManagerEmploymentPosts();

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6 sm:gap-8">
      <header className="flex flex-col gap-4 rounded-3xl bg-gradient-to-br from-navy via-blue to-[#0c6b30] p-5 text-white shadow-xl shadow-navy/10 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="min-w-0">
          <p className="text-xs font-bold tracking-[0.18em] text-[#f3c56a] uppercase">Espace Manager · Recrutement</p>
          <h1 className="display mt-2 text-3xl sm:text-4xl">Emplois et stages</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/75">
            Ajoutez une offre et retrouvez toutes les publications de l’équipe dans cet espace.
          </p>
        </div>
        <ManagerEmploymentDialog />
      </header>

      <section aria-labelledby="manager-employment-list-title" className="grid gap-4">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold tracking-[0.16em] text-green uppercase">Votre espace recrutement</p>
            <h2 id="manager-employment-list-title" className="mt-1 text-xl font-bold text-navy sm:text-2xl">
              Offres d’emploi et stages
            </h2>
          </div>
          {posts.length > 0 ? (
            <span className="chip">{posts.length} {posts.length === 1 ? "offre" : "offres"}</span>
          ) : null}
        </header>

        {posts.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {posts.map((post) => {
              const details = [
                ["Mission", post.mission],
                ["Profil recherché", post.profile],
                ["Niveau", post.level],
                ["Lieu précis", post.workplace],
                ["Expérience", post.experience],
                ["Salaire", post.salary],
              ].filter((detail): detail is [string, string] => Boolean(detail[1]));

              return (
                <article
                  key={post.id}
                  className="card group relative flex h-[36rem] min-w-0 flex-col overflow-hidden p-4 transition-shadow hover:shadow-lg sm:h-[38rem] sm:p-6"
                >
                  <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-green via-blue to-gold" />

                  <div
                    tabIndex={0}
                    aria-label={`Contenu de l’offre ${post.title}`}
                    className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1 [scrollbar-width:thin]"
                  >
                    <header className="flex min-w-0 items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold tracking-[0.14em] text-green uppercase">Emploi · Stage</p>
                        <h3 className="mt-2 break-words text-xl font-bold leading-snug text-navy sm:text-2xl">
                          {post.title}
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
                        <dt className="text-xs font-semibold text-ink/50">Entreprise</dt>
                        <dd className="mt-1 break-words text-sm font-semibold text-navy">{post.companyName}</dd>
                      </div>
                      <div className="min-w-0">
                        <dt className="text-xs font-semibold text-ink/50">Localisation</dt>
                        <dd className="mt-1 break-words text-sm font-medium text-navy">{post.location}</dd>
                      </div>
                      <div className="min-w-0">
                        <dt className="text-xs font-semibold text-ink/50">Date</dt>
                        <dd className="mt-1">
                          <time dateTime={post.offerDate.toISOString().slice(0, 10)} className="text-sm font-medium text-navy">
                            {formatDate(post.offerDate)}
                          </time>
                        </dd>
                      </div>
                      <div className="min-w-0">
                        <dt className="text-xs font-semibold text-ink/50">E-mail</dt>
                        <dd className="mt-1 break-all">
                          <a href={`mailto:${post.email}`} className="text-sm font-semibold text-blue underline decoration-blue/30 underline-offset-4 hover:decoration-blue">
                            {post.email}
                          </a>
                        </dd>
                      </div>
                    </dl>

                    <div className="mt-4">
                      <h4 className="text-sm font-bold text-navy">Description</h4>
                      <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-ink/75">
                        {post.description}
                      </p>
                    </div>

                    {details.length > 0 ? (
                      <dl className="mt-5 grid gap-3 border-t border-line pt-4 sm:grid-cols-2">
                        {details.map(([label, value]) => (
                          <div key={label} className="min-w-0">
                            <dt className="text-xs font-semibold text-ink/50">{label}</dt>
                            <dd className="mt-1 whitespace-pre-wrap break-words text-sm text-navy">{value}</dd>
                          </div>
                        ))}
                      </dl>
                    ) : null}
                  </div>
                  <ManagerEmploymentActions
                    id={post.id}
                    title={post.title}
                    initiallyValidated={post.validatedAt !== null}
                  />
                </article>
              );
            })}
          </div>
        ) : (
          <Empty
            title="Aucune offre pour le moment"
            text="Ajoutez votre première offre d’emploi ou de stage : elle apparaîtra ici après son enregistrement."
          />
        )}
      </section>
    </div>
  );
}
