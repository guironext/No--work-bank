import Link from "next/link";
import { PageTitle } from "@/components/ui";
import { canPostJobs, roleLabel } from "@/lib/constants";
import { companyByOwner } from "@/lib/data";
import { requireMember } from "@/lib/member";
import { companyHref, newJobHref, profileHref } from "@/lib/space";

export const instant = false;
export const metadata = { title: "Publier" };

export default async function PublishPage() {
  const member = await requireMember();
  const company = canPostJobs(member.role) ? await companyByOwner(member.id) : null;
  return (
    <div>
      <PageTitle title="Publier" text={`Espace ${roleLabel(member.role)}. Chaque action ouvre un formulaire utile.`} />
      <div className="grid gap-3">
        <Link className="card p-5" href={profileHref(member.role)}>
          <h2 className="font-bold text-navy">Compléter mon profil</h2>
          <p className="mt-1 text-sm text-ink/70">CV, compétences, diplômes et expériences.</p>
        </Link>
        {canPostJobs(member.role) ? (
          <>
            <Link className="card p-5" href={companyHref(member.role)}>
              <h2 className="font-bold text-navy">{company ? "Mettre à jour l'entreprise" : "Créer le compte entreprise"}</h2>
              <p className="mt-1 text-sm text-ink/70">Identité, représentant et documents.</p>
            </Link>
            <Link className="card p-5" href={newJobHref(member.role)}>
              <h2 className="font-bold text-navy">Publier une offre</h2>
              <p className="mt-1 text-sm text-ink/70">Emploi, stage, alternance ou mission.</p>
            </Link>
          </>
        ) : (
          <article className="card p-5">
            <h2 className="font-bold text-navy">Projets, marchés et formations</h2>
            <p className="mt-1 text-sm leading-6 text-ink/70">
              La publication de projets, d&apos;appels d&apos;offres et de formations arrive avec les versions 2 et 3.
              Le MVP ouvre le recrutement et le portefeuille de compétences.
            </p>
          </article>
        )}
      </div>
    </div>
  );
}
