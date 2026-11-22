import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicFrame } from "@/components/public-frame";
import { SubmitButton } from "@/components/submit";
import { Flash } from "@/components/ui";
import { applyToJob, startConversation, toggleFavorite } from "@/lib/actions";
import { VERIFICATION_LABELS } from "@/lib/constants";
import { existingApplication, getJob, isFavorite } from "@/lib/data";
import { formatRange } from "@/lib/format";
import { one } from "@/lib/http";
import { getMember } from "@/lib/member";

export const instant = false;
export const metadata = { title: "Offre" };

export default async function JobPage(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await props.params;
  const sp = await props.searchParams;
  const row = await getJob(id);
  if (!row || row.job.status !== "publiee") notFound();
  const member = await getMember();
  const application = member ? await existingApplication(id, member.id) : null;
  const saved = member ? await isFavorite(member.id, id) : false;
  const job = row.job;
  const company = row.company;
  return (
    <PublicFrame>
      <Flash error={one(sp.erreur)} ok={one(sp.ok)} />
      <p className="mt-4 text-xs font-bold tracking-[0.16em] text-green uppercase">{company.legalName}</p>
      <h1 className="display mt-2 text-4xl text-navy">{job.title}</h1>
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="chip">{job.contractType}</span>
        <span className="chip">{job.city}</span>
        <span className="chip">{job.sector}</span>
        <span className="chip">{VERIFICATION_LABELS[company.verification]}</span>
        {job.isDemo ? <span className="chip chip-gold">Catalogue de démonstration</span> : null}
      </div>
      <p className="mt-4 text-lg font-semibold text-navy">
        {formatRange(job.salaryMin, job.salaryMax, job.currency)}
      </p>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <article className="card grid gap-4 p-5 text-sm leading-7">
          <section>
            <h2 className="font-bold text-navy">Description</h2>
            <p>{job.description}</p>
          </section>
          {job.missions ? (
            <section>
              <h2 className="font-bold text-navy">Missions</h2>
              <p>{job.missions}</p>
            </section>
          ) : null}
          <section>
            <h2 className="font-bold text-navy">Conditions</h2>
            <p>Compétences : {job.requiredSkills || "—"}</p>
            <p>Niveau d&apos;études : {job.educationLevel || "—"}</p>
            <p>Expérience : {job.experience || "—"}</p>
            <p>Postes : {job.openings}</p>
            <p>Date limite : {job.deadline || "Non précisée"}</p>
          </section>
        </article>
        <aside className="grid content-start gap-3">
          <div className="card grid gap-3 p-5">
            <h2 className="font-bold text-navy">Candidature</h2>
            {application ? (
              <p className="text-sm">Votre dossier est déjà transmis. Suivez-le dans vos candidatures.</p>
            ) : member ? (
              <form action={applyToJob} className="grid gap-3">
                <input type="hidden" name="jobId" value={job.id} />
                <label className="field">
                  <span>Message d&apos;accompagnement</span>
                  <textarea name="coverLetter" placeholder="Pourquoi ce poste vous correspond." />
                </label>
                <SubmitButton>Postuler</SubmitButton>
              </form>
            ) : (
              <Link className="btn" href="/sign-up">
                Créer mon compte pour postuler
              </Link>
            )}
            {member ? (
              <form action={toggleFavorite}>
                <input type="hidden" name="jobId" value={job.id} />
                <SubmitButton variant="btn btn-ghost">{saved ? "Retirer des favoris" : "Enregistrer"}</SubmitButton>
              </form>
            ) : null}
          </div>
          {member && company.ownerMemberId ? (
            <form action={startConversation} className="card grid gap-3 p-5">
              <input type="hidden" name="jobId" value={job.id} />
              <label className="field">
                <span>Contacter le recruteur</span>
                <textarea name="body" placeholder="Bonjour, je souhaite échanger au sujet de cette offre." />
              </label>
              <SubmitButton variant="btn btn-green">Contacter</SubmitButton>
            </form>
          ) : null}
          <Link className="text-sm font-semibold text-blue" href={`/entreprises/${company.id}`}>
            Voir l&apos;entreprise
          </Link>
        </aside>
      </div>
    </PublicFrame>
  );
}
