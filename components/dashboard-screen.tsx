import Link from "next/link";
import { Flash, PageTitle } from "@/components/ui";
import { APPLICATION_LABELS, canPostJobs, roleLabel } from "@/lib/constants";
import { companyByOwner, completion, listApplications, profileBundle, recommendJobs } from "@/lib/data";
import { formatRange } from "@/lib/format";
import { one } from "@/lib/http";
import { requireMember } from "@/lib/member";
import { companyHref, cvHref, newJobHref, profileHref } from "@/lib/space";

export async function DashboardScreen({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const member = await requireMember();
  const sp = await searchParams;
  const bundle = await profileBundle(member.id);
  const score = completion(member, {
    skills: bundle.skills.length,
    educations: bundle.educations.length,
    experiences: bundle.experiences.length,
  });
  const applications = await listApplications(member.id);
  const recommendations = await recommendJobs(member);
  const company = canPostJobs(member.role) ? await companyByOwner(member.id) : null;
  return (
    <div className="grid gap-6">
      <PageTitle
        kicker={roleLabel(member.role)}
        title={`Bonjour ${member.firstName}`}
        text="Votre prochaine opportunité commence ici."
      />
      <Flash error={one(sp.erreur)} ok={one(sp.ok)} />
      <section className="grid gap-3 sm:grid-cols-3">
        <article className="card p-4">
          <p className="text-xs font-bold text-green uppercase">Identifiant NOÉ</p>
          <p className="mt-2 font-bold text-navy">{member.professionalId}</p>
        </article>
        <article className="card p-4">
          <p className="text-xs font-bold text-green uppercase">Profil</p>
          <p className="mt-2 text-2xl font-bold text-navy">{score}%</p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-paper">
            <div className="h-full bg-green" style={{ width: `${score}%` }} />
          </div>
        </article>
        <article className="card p-4">
          <p className="text-xs font-bold text-green uppercase">Candidatures</p>
          <p className="mt-2 text-2xl font-bold text-navy">{applications.length}</p>
        </article>
      </section>
      <section className="flex flex-wrap gap-2">
        <Link className="btn" href={profileHref(member.role)}>
          Compléter mon profil
        </Link>
        <Link className="btn btn-green" href="/emplois">
          Trouver un emploi
        </Link>
        <Link className="btn btn-ghost" href={cvHref(member.role)}>
          Générer mon CV
        </Link>
        {canPostJobs(member.role) ? (
          <Link className="btn btn-gold" href={company ? newJobHref(member.role) : companyHref(member.role)}>
            Publier une offre
          </Link>
        ) : null}
      </section>
      <section>
        <h2 className="mb-3 text-xl font-bold text-navy">Recommandations</h2>
        <div className="grid gap-3">
          {recommendations.map((row) => (
            <Link key={row.job.id} href={`/emplois/${row.job.id}`} className="card flex items-center justify-between gap-3 p-4">
              <span>
                <span className="font-semibold text-navy">{row.job.title}</span>
                <span className="mt-1 block text-sm text-ink/65">
                  {row.company.legalName} · {row.job.city}
                </span>
              </span>
              <span className="text-sm font-semibold">{formatRange(row.job.salaryMin, row.job.salaryMax)}</span>
            </Link>
          ))}
        </div>
      </section>
      <section>
        <h2 className="mb-3 text-xl font-bold text-navy">Dernières candidatures</h2>
        <div className="grid gap-2">
          {applications.slice(0, 4).map((row) => (
            <div key={row.application.id} className="card flex items-center justify-between p-4 text-sm">
              <span>{row.job.title}</span>
              <span className="chip">{APPLICATION_LABELS[row.application.status]}</span>
            </div>
          ))}
          {applications.length === 0 ? <p className="text-sm text-ink/65">Aucune candidature pour le moment.</p> : null}
        </div>
      </section>
    </div>
  );
}
