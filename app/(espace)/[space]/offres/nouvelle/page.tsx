import { redirect } from "next/navigation";
import { SubmitButton } from "@/components/submit";
import { Flash, PageTitle } from "@/components/ui";
import { publishJob } from "@/lib/actions";
import { CONTRACTS, EDUCATION_LEVELS, SECTORS, canPostJobs } from "@/lib/constants";
import { companyByOwner } from "@/lib/data";
import { one } from "@/lib/http";
import { requireMember } from "@/lib/member";
import { companyHref, spaceHome } from "@/lib/space";

export const instant = false;
export const metadata = { title: "Publier une offre" };

export default async function NewJobPage(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const member = await requireMember();
  if (!canPostJobs(member.role)) redirect(spaceHome(member.role));
  const company = await companyByOwner(member.id);
  if (!company) redirect(companyHref(member.role));
  const sp = await props.searchParams;
  return (
    <div>
      <PageTitle title="Publier une offre" text={`Au nom de ${company.legalName}. Sans abonnement actif, une facture de publication est créée.`} />
      <Flash error={one(sp.erreur)} />
      <form action={publishJob} className="card mt-4 grid gap-3 p-5 md:grid-cols-2">
        <label className="field md:col-span-2"><span>Intitulé du poste</span><input name="title" required /></label>
        <label className="field md:col-span-2"><span>Description</span><textarea name="description" required /></label>
        <label className="field md:col-span-2"><span>Missions</span><textarea name="missions" /></label>
        <label className="field md:col-span-2"><span>Compétences requises</span><input name="requiredSkills" placeholder="SQL, entretien, rigueur" /></label>
        <label className="field">
          <span>Niveau d&apos;études</span>
          <select name="educationLevel">{EDUCATION_LEVELS.map((item) => <option key={item}>{item}</option>)}</select>
        </label>
        <label className="field"><span>Expérience</span><input name="experience" placeholder="1 an" /></label>
        <label className="field"><span>Ville</span><input name="city" defaultValue={company.city ?? ""} /></label>
        <label className="field">
          <span>Secteur</span>
          <select name="sector" defaultValue={company.sector ?? ""}>
            {SECTORS.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="field">
          <span>Contrat</span>
          <select name="contractType">{CONTRACTS.map((item) => <option key={item}>{item}</option>)}</select>
        </label>
        <label className="field"><span>Nombre de postes</span><input name="openings" type="number" min={1} defaultValue={1} /></label>
        <label className="field"><span>Rémunération min. XOF</span><input name="salaryMin" inputMode="numeric" /></label>
        <label className="field"><span>Rémunération max. XOF</span><input name="salaryMax" inputMode="numeric" /></label>
        <label className="field"><span>Date limite</span><input name="deadline" type="date" /></label>
        <input type="hidden" name="countryCode" value={company.countryCode} />
        <SubmitButton>Publier l&apos;offre</SubmitButton>
      </form>
    </div>
  );
}
