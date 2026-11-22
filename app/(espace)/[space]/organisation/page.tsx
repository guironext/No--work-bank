import Link from "next/link";
import { SubmitButton } from "@/components/submit";
import { Flash, PageTitle } from "@/components/ui";
import { saveCompany, setJobStatus } from "@/lib/actions";
import { redirect } from "next/navigation";
import { canPostJobs, SECTORS, VERIFICATION_LABELS } from "@/lib/constants";
import { activeSubscription, companyByOwner, companyJobs, getCompany, listCountries } from "@/lib/data";
import { one } from "@/lib/http";
import { requireMember } from "@/lib/member";
import { newJobHref, receivedApplicationsHref, spaceHome } from "@/lib/space";

export const instant = false;
export const metadata = { title: "Entreprise" };

export default async function CompanySpacePage(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const member = await requireMember();
  if (!canPostJobs(member.role)) redirect(spaceHome(member.role));
  const company = await companyByOwner(member.id);
  const countries = await listCountries();
  const sp = await props.searchParams;
  const detail = company ? await getCompany(company.id) : null;
  const offers = company ? await companyJobs(company.id) : [];
  const subscription = company ? await activeSubscription(company.id) : null;
  return (
    <div className="grid gap-6">
      <PageTitle
        kicker="NOÉ BUSINESS"
        title={company ? company.legalName : "Créer le compte entreprise"}
        text="La vérification des documents est faite par l'administration avant de considérer l'organisation comme vérifiée."
      />
      <Flash error={one(sp.erreur)} ok={one(sp.ok)} />
      {company ? (
        <div className="flex flex-wrap gap-2">
          <span className="chip">{VERIFICATION_LABELS[company.verification]}</span>
          <span className="chip">{subscription ? "Abonnement actif" : "Sans abonnement actif"}</span>
          <Link className="btn" href={newJobHref(member.role)}>Publier une offre</Link>
          <Link className="btn btn-ghost" href={receivedApplicationsHref(member.role)}>Candidatures reçues</Link>
        </div>
      ) : null}
      <form action={saveCompany} className="card grid gap-3 p-5 md:grid-cols-2">
        <label className="field md:col-span-2"><span>Dénomination sociale</span><input name="legalName" required defaultValue={company?.legalName ?? ""} /></label>
        <label className="field"><span>Immatriculation</span><input name="registrationNumber" defaultValue={company?.registrationNumber ?? ""} /></label>
        <label className="field">
          <span>Secteur</span>
          <input name="sector" list="secteurs" defaultValue={company?.sector ?? ""} />
          <datalist id="secteurs">{SECTORS.map((item) => <option key={item} value={item} />)}</datalist>
        </label>
        <label className="field md:col-span-2"><span>Adresse</span><input name="address" defaultValue={company?.address ?? ""} /></label>
        <label className="field"><span>Ville</span><input name="city" defaultValue={company?.city ?? ""} /></label>
        <label className="field">
          <span>Pays</span>
          <select name="countryCode" defaultValue={company?.countryCode ?? "CI"}>
            {countries.map((country) => <option key={country.code} value={country.code}>{country.name}</option>)}
          </select>
        </label>
        <label className="field"><span>Téléphone</span><input name="phone" defaultValue={company?.phone ?? ""} /></label>
        <label className="field"><span>E-mail professionnel</span><input name="email" defaultValue={company?.email ?? ""} /></label>
        <label className="field md:col-span-2"><span>Représentant légal</span><input name="representative" defaultValue={company?.representative ?? ""} /></label>
        <label className="field md:col-span-2"><span>Présentation</span><textarea name="description" defaultValue={company?.description ?? ""} /></label>
        <label className="field"><span>Document</span><input name="documentLabel" placeholder="RCCM, statuts…" /></label>
        <label className="field"><span>Lien du document</span><input name="documentUrl" placeholder="https://" /></label>
        <SubmitButton>Enregistrer</SubmitButton>
      </form>
      {detail && detail.documents.length > 0 ? (
        <ul className="text-sm">
          {detail.documents.map((doc) => (
            <li key={doc.id}><a className="text-blue" href={doc.url}>{doc.label}</a></li>
          ))}
        </ul>
      ) : null}
      {offers.length > 0 ? (
        <section className="grid gap-3">
          <h2 className="font-bold text-navy">Mes offres</h2>
          {offers.map((job) => (
            <article key={job.id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <p className="font-semibold text-navy">{job.title}</p>
                <p className="text-sm text-ink/65">{job.status} · {job.city}</p>
              </div>
              <form action={setJobStatus} className="flex gap-2">
                <input type="hidden" name="jobId" value={job.id} />
                <select name="status" defaultValue={job.status} className="rounded-xl border border-line bg-white px-2">
                  <option value="publiee">Publiée</option>
                  <option value="brouillon">Brouillon</option>
                  <option value="cloturee">Clôturée</option>
                </select>
                <SubmitButton variant="btn btn-small">Mettre à jour</SubmitButton>
              </form>
            </article>
          ))}
        </section>
      ) : null}
    </div>
  );
}
