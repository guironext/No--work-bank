import { JobCard } from "@/components/job-card";
import { PublicFrame } from "@/components/public-frame";
import { PageTitle } from "@/components/ui";
import { CONTRACTS, SECTORS } from "@/lib/constants";
import { listJobs } from "@/lib/data";
import { one } from "@/lib/http";

export const instant = false;
export const metadata = { title: "Emplois" };

export default async function JobsPage(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await props.searchParams;
  const q = one(sp.q);
  const city = one(sp.ville);
  const sector = one(sp.secteur);
  const contract = one(sp.contrat);
  const min = Number(one(sp.salaire)) || undefined;
  const rows = await listJobs({ q, city, sector, contract, min });
  return (
    <PublicFrame>
      <PageTitle
        kicker="NOÉ JOBS"
        title="Offres, stages et missions"
        text="Recherchez par métier, secteur, ville et rémunération. Les fiches marquées Démo présentent le catalogue en attendant les entreprises vérifiées."
      />
      <form id="recherche" action="/emplois" className="card mb-6 grid scroll-mt-24 gap-3 p-4 md:grid-cols-6">
        <label className="field md:col-span-2">
          <span>Métier ou compétence</span>
          <input name="q" defaultValue={q} placeholder="développeur, comptable…" />
        </label>
        <label className="field">
          <span>Ville</span>
          <input name="ville" defaultValue={city} placeholder="Abidjan" />
        </label>
        <label className="field">
          <span>Secteur</span>
          <select name="secteur" defaultValue={sector}>
            <option value="">Tous</option>
            {SECTORS.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Contrat</span>
          <select name="contrat" defaultValue={contract}>
            <option value="">Tous</option>
            {CONTRACTS.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Rémunération min.</span>
          <input name="salaire" inputMode="numeric" defaultValue={min ? String(min) : ""} placeholder="200000" />
        </label>
        <button className="btn md:col-span-6" type="submit">
          Rechercher
        </button>
      </form>
      <div className="grid gap-4 md:grid-cols-2">
        {rows.map((row) => (
          <JobCard key={row.job.id} job={row.job} company={row.company} />
        ))}
      </div>
      {rows.length === 0 ? <p className="text-sm text-ink/70">Aucune offre ne correspond à ces critères.</p> : null}
    </PublicFrame>
  );
}
