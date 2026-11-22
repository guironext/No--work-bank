import Link from "next/link";
import { SubmitButton } from "@/components/submit";
import { Flash, PageTitle } from "@/components/ui";
import {
  addEducation,
  addExperience,
  addPortfolio,
  addReference,
  addSkill,
  deleteEducation,
  deleteExperience,
  deletePortfolio,
  deleteReference,
  deleteSkill,
  updateProfile,
} from "@/lib/actions";
import { AVAILABILITY, CONTRACTS, EDUCATION_LEVELS } from "@/lib/constants";
import { listCities, listCountries, profileBundle } from "@/lib/data";
import { one } from "@/lib/http";
import { requireMember } from "@/lib/member";
import { cvHref, settingsHref } from "@/lib/space";

export async function ProfileScreen({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const member = await requireMember();
  const bundle = await profileBundle(member.id);
  const countries = await listCountries();
  const cities = await listCities();
  const sp = await searchParams;
  return (
    <div className="grid gap-6">
      <div id="identifiant" className="scroll-mt-24">
        <PageTitle
          kicker={member.professionalId}
          title="Mon profil"
          text="Construisez le portefeuille que les recruteurs pourront consulter avec votre autorisation."
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <Link className="btn" href={cvHref(member.role)}>
          Générer mon CV
        </Link>
        <Link className="btn btn-ghost" href={settingsHref(member.role)}>
          Autorisations
        </Link>
      </div>
      <Flash error={one(sp.erreur)} ok={one(sp.ok)} />
      <form id="identite" action={updateProfile} className="card grid scroll-mt-24 gap-3 p-5 md:grid-cols-2">
        <label className="field">
          <span>Prénoms</span>
          <input name="firstName" defaultValue={member.firstName} required />
        </label>
        <label className="field">
          <span>Nom</span>
          <input name="lastName" defaultValue={member.lastName} required />
        </label>
        <label className="field">
          <span>Téléphone</span>
          <input name="phone" defaultValue={member.phone ?? ""} />
        </label>
        <label className="field">
          <span>E-mail</span>
          <input name="email" defaultValue={member.email ?? ""} />
        </label>
        <label className="field">
          <span>Pays</span>
          <select name="countryCode" defaultValue={member.countryCode}>
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Ville</span>
          <input name="city" defaultValue={member.city ?? ""} list="villes" />
          <datalist id="villes">
            {cities.map((city) => (
              <option key={city.id} value={city.name} />
            ))}
          </datalist>
        </label>
        <label className="field md:col-span-2">
          <span>Titre</span>
          <input name="headline" defaultValue={member.headline ?? ""} placeholder="Développeuse junior, assistante comptable…" />
        </label>
        <label className="field">
          <span>Domaine</span>
          <input name="domain" defaultValue={member.domain ?? ""} />
        </label>
        <label className="field">
          <span>Niveau d&apos;études</span>
          <select name="educationLevel" defaultValue={member.educationLevel ?? ""}>
            <option value="">—</option>
            {EDUCATION_LEVELS.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Disponibilité</span>
          <select name="availability" defaultValue={member.availability ?? ""}>
            <option value="">—</option>
            {AVAILABILITY.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Emploi recherché</span>
          <select name="jobType" defaultValue={member.jobType ?? ""}>
            <option value="">—</option>
            {CONTRACTS.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="field md:col-span-2">
          <span>Présentation</span>
          <textarea name="bio" defaultValue={member.bio ?? ""} />
        </label>
        <SubmitButton>Enregistrer le profil</SubmitButton>
      </form>

      <section id="competences" className="card grid scroll-mt-24 gap-3 p-5">
        <h2 className="font-bold text-navy">Compétences</h2>
        <div className="flex flex-wrap gap-2">
          {bundle.skills.map((skill) => (
            <form key={skill.id} action={deleteSkill}>
              <input type="hidden" name="id" value={skill.id} />
              <button className="chip" type="submit">
                {skill.name} · {skill.kind} · {skill.level}/5 ×
              </button>
            </form>
          ))}
        </div>
        <form id="evaluation" action={addSkill} className="grid scroll-mt-24 gap-3 md:grid-cols-4">
          <label className="field md:col-span-2">
            <span>Nom</span>
            <input name="name" required />
          </label>
          <label className="field">
            <span>Type</span>
            <select name="kind">
              <option value="technique">Technique</option>
              <option value="comportementale">Comportementale</option>
            </select>
          </label>
          <label className="field">
            <span>Niveau 1-5</span>
            <input name="level" type="number" min={1} max={5} defaultValue={3} />
          </label>
          <SubmitButton>Ajouter</SubmitButton>
        </form>
      </section>

      <section id="diplomes" className="card grid scroll-mt-24 gap-3 p-5">
        <h2 className="font-bold text-navy">Diplômes et attestations</h2>
        {bundle.educations.map((item) => (
          <form key={item.id} action={deleteEducation} className="flex items-center justify-between gap-3 text-sm">
            <input type="hidden" name="id" value={item.id} />
            <span>
              {item.title} — {item.institution} {item.year}
            </span>
            <button className="btn btn-ghost btn-small" type="submit">
              Retirer
            </button>
          </form>
        ))}
        <form action={addEducation} className="grid gap-3 md:grid-cols-2">
          <label className="field">
            <span>Diplôme</span>
            <input name="title" required />
          </label>
          <label className="field">
            <span>Établissement</span>
            <input name="institution" required />
          </label>
          <label className="field">
            <span>Année</span>
            <input name="year" />
          </label>
          <label className="field">
            <span>Lien du document</span>
            <input name="documentUrl" placeholder="https://" />
          </label>
          <SubmitButton>Ajouter le diplôme</SubmitButton>
        </form>
      </section>

      <section id="experiences" className="card grid scroll-mt-24 gap-3 p-5">
        <h2 className="font-bold text-navy">Expériences</h2>
        {bundle.experiences.map((item) => (
          <form key={item.id} action={deleteExperience} className="flex items-center justify-between text-sm">
            <input type="hidden" name="id" value={item.id} />
            <span>
              {item.title} · {item.organization}
            </span>
            <button className="btn btn-ghost btn-small" type="submit">
              Retirer
            </button>
          </form>
        ))}
        <form action={addExperience} className="grid gap-3 md:grid-cols-2">
          <label className="field">
            <span>Poste</span>
            <input name="title" required />
          </label>
          <label className="field">
            <span>Organisation</span>
            <input name="organization" required />
          </label>
          <label className="field">
            <span>Début</span>
            <input name="startDate" placeholder="2024-01" />
          </label>
          <label className="field">
            <span>Fin</span>
            <input name="endDate" placeholder="2025-06" />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="current" /> Poste actuel
          </label>
          <label className="field md:col-span-2">
            <span>Description</span>
            <textarea name="description" />
          </label>
          <SubmitButton>Ajouter l&apos;expérience</SubmitButton>
        </form>
      </section>

      <section id="portfolio" className="card grid scroll-mt-24 gap-3 p-5">
        <h2 className="font-bold text-navy">Portfolio</h2>
        {bundle.portfolio.map((item) => (
          <form key={item.id} action={deletePortfolio} className="flex items-center justify-between text-sm">
            <input type="hidden" name="id" value={item.id} />
            <span>{item.title}</span>
            <button className="btn btn-ghost btn-small" type="submit">
              Retirer
            </button>
          </form>
        ))}
        <form action={addPortfolio} className="grid gap-3">
          <label className="field">
            <span>Titre</span>
            <input name="title" required />
          </label>
          <label className="field">
            <span>Description</span>
            <textarea name="description" />
          </label>
          <label className="field">
            <span>Lien</span>
            <input name="url" placeholder="https://" />
          </label>
          <SubmitButton>Ajouter au portfolio</SubmitButton>
        </form>
      </section>

      <section id="references" className="card grid scroll-mt-24 gap-3 p-5">
        <h2 className="font-bold text-navy">Références professionnelles</h2>
        {bundle.references.map((item) => (
          <form key={item.id} action={deleteReference} className="flex items-center justify-between text-sm">
            <input type="hidden" name="id" value={item.id} />
            <span>
              {item.name} · {item.organization}
            </span>
            <button className="btn btn-ghost btn-small" type="submit">
              Retirer
            </button>
          </form>
        ))}
        <form action={addReference} className="grid gap-3 md:grid-cols-2">
          <label className="field">
            <span>Nom</span>
            <input name="name" required />
          </label>
          <label className="field">
            <span>Fonction</span>
            <input name="role" />
          </label>
          <label className="field">
            <span>Organisation</span>
            <input name="organization" />
          </label>
          <label className="field">
            <span>Contact</span>
            <input name="contact" />
          </label>
          <label className="field md:col-span-2">
            <span>Note</span>
            <textarea name="note" />
          </label>
          <SubmitButton>Ajouter la référence</SubmitButton>
        </form>
      </section>
    </div>
  );
}
