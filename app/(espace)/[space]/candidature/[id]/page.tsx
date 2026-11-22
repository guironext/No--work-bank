import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CvDocument } from "@/components/cv-document";
import { SubmitButton } from "@/components/submit";
import { Flash, PageTitle } from "@/components/ui";
import { scheduleInterview, updateApplication } from "@/lib/actions";
import { APPLICATION_LABELS, canPostJobs } from "@/lib/constants";
import { companyByOwner, getApplication } from "@/lib/data";
import { formatDateTime } from "@/lib/format";
import { one } from "@/lib/http";
import { requireMember } from "@/lib/member";
import { companyHref, spaceHome } from "@/lib/space";

export const instant = false;
export const metadata = { title: "Candidat" };

export default async function ApplicationDetailPage(props: {
  params: Promise<{ space: string; id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const member = await requireMember();
  if (!canPostJobs(member.role)) redirect(spaceHome(member.role));
  const company = await companyByOwner(member.id);
  if (!company) redirect(companyHref(member.role));
  const { id } = await props.params;
  const row = await getApplication(id);
  if (!row || row.company.id !== company.id) notFound();
  const sp = await props.searchParams;
  return (
    <div className="grid gap-5">
      <PageTitle
        kicker={APPLICATION_LABELS[row.application.status]}
        title={`${row.member.firstName} ${row.member.lastName}`}
        text={row.job.title}
      />
      <Flash error={one(sp.erreur)} ok={one(sp.ok)} />
      {row.application.coverLetter ? (
        <blockquote className="card p-4 text-sm leading-6">{row.application.coverLetter}</blockquote>
      ) : null}
      <form action={updateApplication} className="card flex flex-wrap items-end gap-3 p-4">
        <input type="hidden" name="applicationId" value={row.application.id} />
        <label className="field">
          <span>Statut</span>
          <select name="status" defaultValue={row.application.status}>
            {Object.entries(APPLICATION_LABELS).map(([status, label]) => (
              <option key={status} value={status}>{label}</option>
            ))}
          </select>
        </label>
        <SubmitButton>Enregistrer le statut</SubmitButton>
      </form>
      <form action={scheduleInterview} className="card grid gap-3 p-4 md:grid-cols-2">
        <input type="hidden" name="applicationId" value={row.application.id} />
        <label className="field"><span>Entretien</span><input type="datetime-local" name="scheduledAt" required /></label>
        <label className="field"><span>Lieu ou lien</span><input name="location" placeholder="Abidjan, Plateau ou lien visio" /></label>
        <label className="field md:col-span-2"><span>Notes</span><textarea name="notes" /></label>
        <SubmitButton variant="btn btn-green">Programmer l&apos;entretien</SubmitButton>
      </form>
      {row.meetings.length > 0 ? (
        <ul className="text-sm">
          {row.meetings.map((meeting) => (
            <li key={meeting.id}>{formatDateTime(meeting.scheduledAt)} · {meeting.location}</li>
          ))}
        </ul>
      ) : null}
      <CvDocument
        member={row.member}
        skills={row.skills}
        educations={row.educations}
        experiences={row.experiences}
        portfolio={row.portfolio}
        references={row.references}
        showContacts
      />
      <Link className="text-sm font-semibold text-blue" href={`/talents/${row.member.id}`}>Ouvrir la fiche talent</Link>
    </div>
  );
}
