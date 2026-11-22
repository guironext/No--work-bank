import { redirect } from "next/navigation";
import { ApprovalStatusRefresh } from "@/components/approval-status-refresh";
import { PageTitle } from "@/components/ui";
import { getMember } from "@/lib/member";
import { roleLabel } from "@/lib/constants";
import { spaceHome } from "@/lib/space";

export const instant = false;
export const metadata = { title: "Validation du compte" };

export default async function AccountApprovalPage() {
  const member = await getMember();
  if (!member) redirect("/bienvenue");
  if (member.approvalStatus === "approved") redirect(spaceHome(member.role));

  const rejected = member.approvalStatus === "rejected";

  return (
    <main className="grid min-h-screen place-items-center bg-paper px-4 py-10">
      <section className="card w-full max-w-xl p-6 sm:p-8">
        <p className="text-xs font-bold tracking-[0.18em] text-green uppercase">Espace NOÉ Work Bank</p>
        <PageTitle
          title={rejected ? "Demande non approuvée" : "Votre compte est en attente"}
          text={
            rejected
              ? "L’administration n’a pas validé cette demande. Contactez l’équipe pour plus d’informations."
              : "Votre inscription a bien été reçue. Les fonctionnalités de votre espace seront accessibles dès sa validation."
          }
        />
        <div className="rounded-2xl bg-paper p-4 text-sm">
          <p><span className="font-semibold text-navy">E-mail :</span> {member.email}</p>
          <p className="mt-1"><span className="font-semibold text-navy">Rôle demandé :</span> {roleLabel(member.role)}</p>
        </div>
        {rejected ? (
          <p className="mt-4 text-sm text-ink/60">Votre accès reste suspendu.</p>
        ) : (
          <ApprovalStatusRefresh />
        )}
      </section>
    </main>
  );
}
