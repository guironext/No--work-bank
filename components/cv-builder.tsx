import Link from "next/link";
import { DocumentUpload } from "@/components/document-upload";
import { SubmitButton } from "@/components/submit";
import { Flash } from "@/components/ui";
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
import type { profileBundle } from "@/lib/data";
import type { Member } from "@/lib/db/schema";
import { cvHref } from "@/lib/space";

type Bundle = Awaited<ReturnType<typeof profileBundle>>;
type Country = { code: string; name: string };
type City = { id: string; name: string };

const SAVE = "btn w-full sm:w-auto";

const JUMPS = [
  ["#identite", "Identité"],
  ["#experiences", "Expériences"],
  ["#competences", "Compétences"],
  ["#diplomes", "Diplômes"],
  ["#certificats", "Certificats"],
  ["#portfolio", "Portfolio"],
  ["#references", "Références"],
] as const;

export function CvBuilder({
  member,
  bundle,
  countries,
  cities,
  error,
  ok,
}: {
  member: Member;
  bundle: Bundle;
  countries: Country[];
  cities: City[];
  error?: string;
  ok?: string;
}) {
  const diplomas = bundle.educations.filter((item) => item.kind !== "certificat");
  const certificates = bundle.educations.filter((item) => item.kind === "certificat");
  const checks = [
    { label: "Identité", done: Boolean(member.headline && member.bio) },
    { label: "Expériences", done: bundle.experiences.length > 0 },
    { label: "Compétences", done: bundle.skills.length > 0 },
    { label: "Diplômes", done: diplomas.length > 0 },
    { label: "Certificats", done: certificates.length > 0 },
  ];
  const doneCount = checks.filter((item) => item.done).length;
  const percent = Math.round((doneCount / checks.length) * 100);
  const generate = cvHref(member.role);

  return (
    <div className="cv-studio grid gap-4 sm:gap-6">
      <header className="no-print -mx-4 overflow-hidden bg-navy text-white sm:mx-0 sm:rounded-[1.75rem]">
        <div className="grid gap-5 px-4 py-6 sm:px-7 sm:py-7">
          <p className="text-[11px] font-bold tracking-[0.18em] text-gold uppercase">{member.professionalId}</p>
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="min-w-0">
              <h1 className="display text-[2.05rem] leading-[1.05] sm:text-5xl">CV professionnel</h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/75">
                Remplissez le dossier, joignez vos diplômes et certificats, puis générez la version imprimable.
              </p>
              <p className="mt-3 line-clamp-2 text-sm font-semibold text-white sm:line-clamp-none">
                {member.firstName} {member.lastName}
                {member.headline ? <span className="font-medium text-white/70"> · {member.headline}</span> : null}
              </p>
            </div>
            <Link className="btn btn-gold w-full lg:w-auto" href={generate}>
              Générer Mon CV
            </Link>
          </div>
          <div>
            <div
              className="h-1.5 overflow-hidden rounded-full bg-white/15"
              role="progressbar"
              aria-valuenow={doneCount}
              aria-valuemin={0}
              aria-valuemax={checks.length}
              aria-label="Complétion du CV"
            >
              <div className="h-full rounded-full bg-gold" style={{ width: `${percent}%` }} />
            </div>
            <ul className="mt-3 flex flex-wrap gap-2">
              {checks.map((item) => (
                <li
                  key={item.label}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                    item.done ? "bg-gold text-[#241804]" : "bg-white/10 text-white/75"
                  }`}
                >
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </header>

      <Flash error={error} ok={ok} />

      <nav className="cv-jumps no-print sticky top-0 z-20 -mx-4 flex gap-2 overflow-x-auto border-b border-line bg-paper/95 px-4 py-2.5 backdrop-blur-md sm:mx-0 sm:rounded-2xl sm:border sm:px-3" aria-label="Sections du CV">
        {JUMPS.map(([href, label]) => (
          <a key={href} href={href} className="inline-flex min-h-11 shrink-0 items-center rounded-full border border-line bg-white px-3.5 text-sm font-semibold text-navy">
            {label}
          </a>
        ))}
      </nav>

      <Section id="identite" step="01" title="Identité" text="Les informations qui ouvrent le CV.">
        <form action={updateProfile} className="grid gap-3 sm:grid-cols-2">
          <label className="field">
            <span>Prénoms</span>
            <input name="firstName" defaultValue={member.firstName} required autoComplete="given-name" />
          </label>
          <label className="field">
            <span>Nom</span>
            <input name="lastName" defaultValue={member.lastName} required autoComplete="family-name" />
          </label>
          <label className="field">
            <span>Téléphone</span>
            <input name="phone" defaultValue={member.phone ?? ""} placeholder="+225 …" autoComplete="tel" inputMode="tel" />
          </label>
          <label className="field">
            <span>E-mail</span>
            <input name="email" type="email" defaultValue={member.email ?? ""} autoComplete="email" inputMode="email" />
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
            <input name="city" defaultValue={member.city ?? ""} list="villes-cv" placeholder="Abidjan" autoComplete="address-level2" />
            <datalist id="villes-cv">
              {cities.map((city) => (
                <option key={city.id} value={city.name} />
              ))}
            </datalist>
          </label>
          <label className="field sm:col-span-2">
            <span>Titre professionnel</span>
            <input name="headline" defaultValue={member.headline ?? ""} placeholder="Développeuse junior, assistante comptable…" />
          </label>
          <label className="field">
            <span>Domaine</span>
            <input name="domain" defaultValue={member.domain ?? ""} placeholder="Numérique, finance, santé…" />
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
          <label className="field sm:col-span-2">
            <span>Profil</span>
            <textarea
              name="bio"
              defaultValue={member.bio ?? ""}
              placeholder="Quelques lignes sur votre parcours, ce que vous savez faire et ce que vous recherchez."
            />
          </label>
          <div className="sm:col-span-2">
            <SubmitButton variant={SAVE}>Enregistrer l&apos;identité</SubmitButton>
          </div>
        </form>
      </Section>

      <Section id="experiences" step="02" title="Expériences" text="Les postes, stages et missions, du plus récent au plus ancien.">
        <EntryList
          empty="Aucune expérience pour le moment."
          items={bundle.experiences.map((item) => ({
            id: item.id,
            label: `${item.title} · ${item.organization}`,
          }))}
          action={deleteExperience}
        />
        <form action={addExperience} className="grid gap-3 sm:grid-cols-2">
          <label className="field">
            <span>Poste</span>
            <input name="title" required placeholder="Chargé de clientèle" />
          </label>
          <label className="field">
            <span>Organisation</span>
            <input name="organization" required placeholder="Société, école, projet" />
          </label>
          <label className="field">
            <span>Début</span>
            <input name="startDate" placeholder="2024-01" inputMode="numeric" />
          </label>
          <label className="field">
            <span>Fin</span>
            <input name="endDate" placeholder="2025-06" inputMode="numeric" />
          </label>
          <label className="flex min-h-11 items-center gap-3 text-sm sm:col-span-2">
            <input className="size-4" type="checkbox" name="current" /> Poste actuel
          </label>
          <label className="field sm:col-span-2">
            <span>Missions</span>
            <textarea name="description" placeholder="Ce que vous avez réalisé, en deux ou trois phrases." />
          </label>
          <div className="sm:col-span-2">
            <SubmitButton variant={SAVE}>Ajouter l&apos;expérience</SubmitButton>
          </div>
        </form>
      </Section>

      <Section id="competences" step="03" title="Compétences" text="Techniques ou comportementales, notées de 1 à 5.">
        <div className="flex flex-wrap gap-2">
          {bundle.skills.length === 0 ? <p className="text-sm text-ink/60">Aucune compétence ajoutée.</p> : null}
          {bundle.skills.map((skill) => (
            <form key={skill.id} action={deleteSkill}>
              <input type="hidden" name="id" value={skill.id} />
              <button className="chip min-h-11 px-3 text-sm" type="submit">
                {skill.name} · {skill.level}/5 ×
              </button>
            </form>
          ))}
        </div>
        <form action={addSkill} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="field sm:col-span-2">
            <span>Compétence</span>
            <input name="name" required placeholder="Excel, accueil, React…" />
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
            <input name="level" type="number" min={1} max={5} defaultValue={3} inputMode="numeric" />
          </label>
          <div className="sm:col-span-2 lg:col-span-4">
            <SubmitButton variant={SAVE}>Ajouter</SubmitButton>
          </div>
        </form>
      </Section>

      <Section id="diplomes" step="04" title="Diplômes" text="Formation initiale ou continue. Joignez le scan du diplôme.">
        <CredentialList items={diplomas} empty="Aucun diplôme ajouté." />
        <CredentialForm kind="diplome" titleLabel="Diplôme" orgLabel="Établissement" submitLabel="Ajouter le diplôme" />
      </Section>

      <Section id="certificats" step="05" title="Certificats" text="Attestations, formations courtes et certifications. Joignez le document.">
        <CredentialList items={certificates} empty="Aucun certificat ajouté." />
        <CredentialForm kind="certificat" titleLabel="Certificat" orgLabel="Organisme" submitLabel="Ajouter le certificat" />
      </Section>

      <Section id="portfolio" step="06" title="Portfolio" text="Réalisations, projets ou liens que vous voulez montrer.">
        <EntryList
          empty="Aucune réalisation ajoutée."
          items={bundle.portfolio.map((item) => ({ id: item.id, label: item.title }))}
          action={deletePortfolio}
        />
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
            <input name="url" placeholder="https://" inputMode="url" autoComplete="url" />
          </label>
          <SubmitButton variant={SAVE}>Ajouter au portfolio</SubmitButton>
        </form>
      </Section>

      <Section id="references" step="07" title="Références" text="Personnes qui peuvent confirmer votre parcours.">
        <EntryList
          empty="Aucune référence ajoutée."
          items={bundle.references.map((item) => ({
            id: item.id,
            label: `${item.name}${item.organization ? ` · ${item.organization}` : ""}`,
          }))}
          action={deleteReference}
        />
        <form action={addReference} className="grid gap-3 sm:grid-cols-2">
          <label className="field">
            <span>Nom</span>
            <input name="name" required autoComplete="name" />
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
            <input name="contact" autoComplete="tel" />
          </label>
          <label className="field sm:col-span-2">
            <span>Note</span>
            <textarea name="note" />
          </label>
          <div className="sm:col-span-2">
            <SubmitButton variant={SAVE}>Ajouter la référence</SubmitButton>
          </div>
        </form>
      </Section>

      <div className="no-print card flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="min-w-0">
          <p className="font-bold text-navy">Prêt à sortir le CV</p>
          <p className="mt-1 text-sm leading-6 text-ink/65">Enregistrez chaque partie, puis ouvrez la version à imprimer ou à enregistrer en PDF.</p>
        </div>
        <Link className="btn btn-gold w-full shrink-0 sm:w-auto" href={generate}>
          Générer Mon CV
        </Link>
      </div>
    </div>
  );
}

function Section({
  id,
  step,
  title,
  text,
  children,
}: {
  id: string;
  step: string;
  title: string;
  text: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="card scroll-mt-20 overflow-hidden">
      <div className="flex items-start gap-3 border-b border-line/80 bg-[#f7fafc] px-4 py-4 sm:px-6">
        <span className="display grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-navy text-sm text-gold">{step}</span>
        <div className="min-w-0 pt-0.5">
          <h2 className="text-lg font-bold text-navy">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-ink/65">{text}</p>
        </div>
      </div>
      <div className="grid gap-4 p-4 sm:p-6">{children}</div>
    </section>
  );
}

function EntryList({
  items,
  empty,
  action,
}: {
  items: { id: string; label: string }[];
  empty: string;
  action: (formData: FormData) => Promise<void>;
}) {
  if (items.length === 0) return <p className="text-sm text-ink/60">{empty}</p>;
  return (
    <div className="grid gap-2">
      {items.map((item) => (
        <form key={item.id} action={action} className="flex flex-col gap-3 rounded-2xl bg-paper p-3 sm:flex-row sm:items-center sm:justify-between">
          <input type="hidden" name="id" value={item.id} />
          <span className="min-w-0 font-medium break-words text-navy">{item.label}</span>
          <button className="btn btn-ghost btn-small w-full sm:w-auto" type="submit">
            Retirer
          </button>
        </form>
      ))}
    </div>
  );
}

function CredentialList({
  items,
  empty,
}: {
  items: Bundle["educations"];
  empty: string;
}) {
  if (items.length === 0) return <p className="text-sm text-ink/60">{empty}</p>;
  return (
    <div className="grid gap-2">
      {items.map((item) => (
        <form key={item.id} action={deleteEducation} className="flex flex-col gap-3 rounded-2xl bg-paper p-3 sm:flex-row sm:items-center sm:justify-between">
          <input type="hidden" name="id" value={item.id} />
          <div className="min-w-0">
            <p className="font-medium break-words text-navy">
              {item.title} — {item.institution}
              {item.year ? ` (${item.year})` : ""}
            </p>
            {item.documentUrl ? (
              <a className="mt-1 inline-flex text-sm font-semibold text-blue" href={item.documentUrl} target="_blank" rel="noreferrer">
                Voir le document
              </a>
            ) : null}
          </div>
          <button className="btn btn-ghost btn-small w-full shrink-0 sm:w-auto" type="submit">
            Retirer
          </button>
        </form>
      ))}
    </div>
  );
}

function CredentialForm({
  kind,
  titleLabel,
  orgLabel,
  submitLabel,
}: {
  kind: "diplome" | "certificat";
  titleLabel: string;
  orgLabel: string;
  submitLabel: string;
}) {
  return (
    <form action={addEducation} className="grid gap-3 sm:grid-cols-2">
      <input type="hidden" name="kind" value={kind} className="hidden" />
      <label className="field">
        <span>{titleLabel}</span>
        <input name="title" required />
      </label>
      <label className="field">
        <span>{orgLabel}</span>
        <input name="institution" required />
      </label>
      <label className="field sm:col-span-2">
        <span>Année</span>
        <input name="year" placeholder="2024" inputMode="numeric" />
      </label>
      <DocumentUpload name="document" />
      <div className="sm:col-span-2">
        <SubmitButton variant={SAVE}>{submitLabel}</SubmitButton>
      </div>
    </form>
  );
}
