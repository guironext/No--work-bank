import { JobCard } from "@/components/job-card";
import { PageTitle } from "@/components/ui";
import { listFavorites } from "@/lib/data";
import { requireMember } from "@/lib/member";

export async function FavoritesScreen() {
  const member = await requireMember();
  const rows = await listFavorites(member.id);
  return (
    <div>
      <PageTitle title="Offres sauvegardées" />
      <div className="grid gap-4">
        {rows.map((row) => (
          <JobCard key={row.job.id} job={row.job} company={row.company} />
        ))}
      </div>
      {rows.length === 0 ? <p className="text-sm text-ink/65">Aucune offre enregistrée.</p> : null}
    </div>
  );
}
