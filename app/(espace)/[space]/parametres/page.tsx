import { SubmitButton } from "@/components/submit";
import { Flash, PageTitle } from "@/components/ui";
import { requestDeletion, updateSettings } from "@/lib/actions";
import { one } from "@/lib/http";
import { requireMember } from "@/lib/member";

export const instant = false;
export const metadata = { title: "Paramètres" };

export default async function SettingsPage(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const member = await requireMember();
  const sp = await props.searchParams;
  return (
    <div className="grid gap-5">
      <PageTitle title="Paramètres" text="Autorisations de consultation, langue du profil et demande de suppression." />
      <Flash error={one(sp.erreur)} ok={one(sp.ok)} />
      <form action={updateSettings} className="card grid gap-3 p-5">
        <label className="field">
          <span>Langue enregistrée</span>
          <select name="locale" defaultValue={member.locale}>
            <option value="fr">Français</option>
            <option value="en">English</option>
          </select>
        </label>
        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" name="shareWithRecruiters" defaultChecked={member.shareWithRecruiters} />
          Autoriser les recruteurs à consulter mon portefeuille
        </label>
        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" name="cvPublic" defaultChecked={member.cvPublic} />
          Afficher aussi mes coordonnées sur le CV partagé
        </label>
        <SubmitButton>Enregistrer</SubmitButton>
      </form>
      <form action={requestDeletion} className="card grid gap-3 p-5">
        <h2 className="font-bold text-navy">Suppression des données</h2>
        <p className="text-sm leading-6 text-ink/70">
          Cette demande est tracée. Elle ne ferme pas immédiatement la session Clerk : l&apos;équipe NOÉ traite la suppression.
        </p>
        {member.deletionRequestedAt ? <p className="text-sm text-leaf">Une demande est déjà en cours.</p> : null}
        <SubmitButton variant="btn btn-ghost">Demander la suppression</SubmitButton>
      </form>
      <p className="text-sm">
        <a className="font-semibold text-blue" href="/api/moi">Télécharger mes données</a>
      </p>
    </div>
  );
}
