import { SubmitButton } from "@/components/submit";
import { AdminDeleteMemberButton } from "@/components/admin-delete-member-button";
import { AdminInvitationDialog } from "@/components/admin-invitation-dialog";
import { Empty, Flash, PageTitle } from "@/components/ui";
import { setMemberApproval, setMemberFlags } from "@/lib/actions";
import { ROLES, VERIFICATION_LABELS } from "@/lib/constants";
import { listMembersAdmin } from "@/lib/data";
import { fullName } from "@/lib/format";
import { one } from "@/lib/http";

export const instant = false;
export const metadata = { title: "Utilisateurs" };

export default async function UsersAdminPage(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const rows = await listMembersAdmin();
  const sp = await props.searchParams;
  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <PageTitle
          title="Utilisateurs"
          text="Gérez les rôles, les accès et les demandes d’inscription de votre plateforme."
        />
        <AdminInvitationDialog />
      </div>
      <Flash ok={one(sp.ok)} error={one(sp.erreur)} />
      <div className="mt-4 grid gap-3">
        {rows.map((member) => (
          <article key={member.id} className="card grid gap-4 p-4 sm:p-5">
            <header className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-navy">{fullName(member)}</p>
                <p className="mt-1 text-sm text-ink/65">{member.email || "Aucune adresse e-mail"}</p>
                <p className="mt-1 text-xs text-ink/50">{member.professionalId}</p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`chip ${
                    member.approvalStatus === "approved"
                      ? "chip-green"
                      : member.approvalStatus === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "chip-gold"
                  }`}
                >
                  {member.approvalStatus === "approved"
                    ? "Validé"
                    : member.approvalStatus === "rejected"
                      ? "Rejeté"
                      : "En attente"}
                </span>
                <AdminDeleteMemberButton memberId={member.id} name={fullName(member)} />
              </div>
            </header>

            <form action={setMemberFlags} className="grid gap-3 border-t border-line pt-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto]">
              <input type="hidden" name="memberId" value={member.id} />
              <label className="field">
                <span>Rôle</span>
                <select name="role" defaultValue={member.role}>
                  {ROLES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </label>
              <label className="field">
                <span>Vérification du profil</span>
                <select name="verification" defaultValue={member.verification}>
                  {Object.entries(VERIFICATION_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </label>
              <div className="flex flex-wrap items-end gap-3">
                <label className="flex min-h-11 items-center gap-2 text-sm font-medium text-navy">
                  <input type="checkbox" name="isAdmin" defaultChecked={member.isAdmin} /> Admin
                </label>
                <SubmitButton variant="btn btn-small">Enregistrer</SubmitButton>
              </div>
            </form>

            <form action={setMemberApproval} className="flex flex-wrap gap-2 border-t border-line pt-4">
              <input type="hidden" name="memberId" value={member.id} />
              <button
                type="submit"
                name="approvalStatus"
                value="approved"
                disabled={member.approvalStatus === "approved"}
                className="btn btn-small btn-green"
              >
                Valider
              </button>
              <button
                type="submit"
                name="approvalStatus"
                value="rejected"
                disabled={member.approvalStatus === "rejected"}
                className="btn btn-small btn-ghost"
              >
                Rejeter
              </button>
              <button
                type="submit"
                name="approvalStatus"
                value="pending"
                disabled={member.approvalStatus === "pending"}
                className="btn btn-small btn-ghost"
              >
                Mettre en attente
              </button>
            </form>
          </article>
        ))}
        {rows.length === 0 ? (
          <Empty title="Aucun utilisateur" text="Les comptes et invitations finalisées apparaîtront ici." />
        ) : null}
      </div>
    </div>
  );
}
