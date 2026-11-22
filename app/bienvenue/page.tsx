import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/logo";
import { SubmitButton } from "@/components/submit";
import { Flash } from "@/components/ui";
import { completeOnboarding } from "@/lib/actions";
import { ROLES } from "@/lib/constants";
import { listCities, listCountries } from "@/lib/data";
import { one } from "@/lib/http";
import { getMember } from "@/lib/member";
import { spaceHome } from "@/lib/space";

export const instant = false;
export const metadata = { title: "Bienvenue" };

export default async function WelcomePage(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const member = await getMember();
  if (member) {
    redirect(member.approvalStatus === "approved" ? spaceHome(member.role) : "/validation-compte");
  }
  const user = await currentUser();
  const sp = await props.searchParams;
  const countries = await listCountries();
  const cities = await listCities();
  return (
    <div className="welcome">
      <header className="welcome-banner">
        <div>
          <Link href="/" className="welcome-brand">
            <Logo size={48} />
            <p>NOÉ WORK BANK</p>
          </Link>
          <h1 className="display">Créer votre espace</h1>
          <p className="welcome-lead">
            Le compte relie votre profil, vos candidatures et les entreprises qui recrutent.
          </p>
        </div>
        <ol className="welcome-steps">
          <li>
            <span>01</span>
            Identité
          </li>
          <li>
            <span>02</span>
            Parcours
          </li>
          <li>
            <span>03</span>
            Opportunités
          </li>
        </ol>
      </header>
      <div className="welcome-main">
        <Flash error={one(sp.erreur)} />
        <form action={completeOnboarding} className="welcome-form">
          <section className="card welcome-card">
            <p className="welcome-kicker">Identité</p>
            <h2>Vos coordonnées</h2>
            <div className="welcome-fields">
              <label className="field">
                <span>Prénoms</span>
                <input name="firstName" autoComplete="given-name" required defaultValue={user?.firstName ?? ""} />
              </label>
              <label className="field">
                <span>Nom</span>
                <input name="lastName" autoComplete="family-name" required defaultValue={user?.lastName ?? ""} />
              </label>
              <label className="field">
                <span>Téléphone</span>
                <input
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  required
                  defaultValue={user?.primaryPhoneNumber?.phoneNumber ?? ""}
                />
              </label>
              <label className="field">
                <span>E-mail</span>
                <input
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  defaultValue={user?.primaryEmailAddress?.emailAddress ?? ""}
                />
              </label>
              <label className="field">
                <span>Pays</span>
                <select name="countryCode" autoComplete="country" defaultValue="CI">
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Ville</span>
                <input name="city" autoComplete="address-level2" list="villes" placeholder="Abidjan" />
                <datalist id="villes">
                  {cities.map((city) => (
                    <option key={city.id} value={city.name} />
                  ))}
                </datalist>
              </label>
              <label className="field welcome-span">
                <span>Domaine professionnel</span>
                <input name="domain" placeholder="Numérique, agro-industrie, finance…" />
              </label>
            </div>
          </section>
          <section className="card welcome-card">
            <p className="welcome-kicker">Compte</p>
            <h2>Votre parcours</h2>
            <fieldset className="welcome-roles">
              <legend>Type de compte</legend>
              <div className="role-grid sm:grid-cols-2">
                {ROLES.filter(([value]) => value !== "admin").map(([value, label, text]) => (
                  <label key={value} className="role-option">
                    <input type="radio" name="role" value={value} required defaultChecked={value === "candidat"} />
                    <span className="role-option-label">{label}</span>
                    <span className="role-option-text">{text}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <label className="field">
              <span>Code de parrainage</span>
              <input name="referral" autoComplete="off" placeholder="Facultatif" />
            </label>
            <label className="welcome-consent">
              <input type="checkbox" name="consent" required />
              <span>
                J&apos;accepte les{" "}
                <Link href="/legal">conditions d&apos;utilisation et la politique de confidentialité</Link>, et je
                consens au traitement de mes données pour constituer mon portefeuille professionnel.
              </span>
            </label>
            <SubmitButton variant="btn btn-gold welcome-submit">Créer mon compte</SubmitButton>
          </section>
        </form>
      </div>
    </div>
  );
}
