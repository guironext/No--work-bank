import { SignOutButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { completeInvitedOnboarding } from "@/lib/actions";
import { Flash, PageTitle } from "@/components/ui";
import { listCities, listCountries } from "@/lib/data";
import { one } from "@/lib/http";
import { findActiveInvitation } from "@/lib/invitations";
import { getMember } from "@/lib/member";
import { roleLabel } from "@/lib/constants";
import { spaceHome } from "@/lib/space";

export const instant = false;
export const metadata = { title: "Finaliser mon inscription" };

export default async function OnboardingPage(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const searchParams = await props.searchParams;
  const token = one(searchParams.invitation);
  if (!token) redirect("/sign-up");

  const { userId } = await auth();
  if (!userId) redirect(`/sign-up?invitation=${encodeURIComponent(token)}`);

  const member = await getMember();
  if (member) {
    redirect(member.approvalStatus === "approved" ? spaceHome(member.role) : "/validation-compte");
  }

  const invitation = await findActiveInvitation(token);
  const user = await currentUser();
  const primaryEmail = user?.primaryEmailAddress;
  const email = primaryEmail?.emailAddress?.trim().toLowerCase();
  const message = one(searchParams.erreur);

  if (!invitation) {
    return (
      <main className="mx-auto grid min-h-screen max-w-2xl content-center gap-4 px-4 py-10">
        <PageTitle title="Invitation indisponible" text="Ce lien est invalide, a déjà été utilisé ou a expiré." />
        <Flash error={message || "Demandez une nouvelle invitation à l’administrateur."} />
        <Link href="/sign-in" className="btn btn-ghost w-fit">Se connecter</Link>
      </main>
    );
  }

  if (!email || email !== invitation.email || primaryEmail?.verification?.status !== "verified") {
    return (
      <main className="mx-auto grid min-h-screen max-w-2xl content-center gap-4 px-4 py-10">
        <PageTitle title="Vérifiez votre compte" text={`Cette invitation a été envoyée à ${invitation.email}.`} />
        <Flash error="Connectez-vous avec l’adresse invitée et confirmez-la pour continuer." />
        <SignOutButton redirectUrl={`/sign-up?invitation=${encodeURIComponent(token)}`}>
          <button type="button" className="btn">Changer de compte</button>
        </SignOutButton>
      </main>
    );
  }

  const [countries, cities] = await Promise.all([listCountries(), listCities()]);

  return (
    <div className="welcome">
      <header className="welcome-banner">
        <div>
          <p className="welcome-kicker">Invitation NOÉ Work Bank</p>
          <h1 className="display">Finaliser votre inscription</h1>
          <p className="welcome-lead">
            Complétez vos coordonnées. Votre accès sera activé après validation par l’administration.
          </p>
        </div>
        <p className="welcome-steps">
          Rôle invité : <strong>{roleLabel(invitation.role)}</strong>
        </p>
      </header>
      <main className="welcome-main">
        <Flash error={message} />
        <form action={completeInvitedOnboarding} className="welcome-form">
          <input type="hidden" name="invitation" value={token} />
          <section className="card welcome-card">
            <p className="welcome-kicker">Identité et contact</p>
            <h2>Vos coordonnées</h2>
            <p className="text-sm text-ink/65">{email}</p>
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
                <input name="phone" type="tel" autoComplete="tel" required />
              </label>
              <label className="field">
                <span>Pays</span>
                <select name="countryCode" autoComplete="country" defaultValue="CI" required>
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>{country.name}</option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Ville / commune</span>
                <input name="city" autoComplete="address-level2" list="onboarding-cities" required />
                <datalist id="onboarding-cities">
                  {cities.map((city) => <option key={city.id} value={city.name} />)}
                </datalist>
              </label>
              <label className="field">
                <span>Département / domaine</span>
                <input name="domain" required />
              </label>
            </div>
            <label className="welcome-consent">
              <input type="checkbox" name="consent" required />
              <span>
                J’accepte les <Link href="/legal">conditions d’utilisation et la politique de confidentialité</Link>.
              </span>
            </label>
            <button type="submit" className="btn btn-gold welcome-submit">Envoyer pour validation</button>
          </section>
        </form>
      </main>
    </div>
  );
}
