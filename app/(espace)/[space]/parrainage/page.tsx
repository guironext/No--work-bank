import { SubmitButton } from "@/components/submit";
import { Flash, PageTitle } from "@/components/ui";
import { requestPayout } from "@/lib/actions";
import { listCommissions, listPayouts, listReferrals } from "@/lib/data";
import { formatDate, formatMoney, fullName } from "@/lib/format";
import { one } from "@/lib/http";
import { requireMember } from "@/lib/member";

export const instant = false;
export const metadata = { title: "Parrainage" };

const labels: Record<string, string> = {
  en_attente: "En attente",
  validee: "Validée",
  payee: "Payée",
  rejetee: "Rejetée",
  demandee: "Demandée",
};

export default async function ReferralPage(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const member = await requireMember();
  const sp = await props.searchParams;
  const referrals = await listReferrals(member.id);
  const commissionRows = await listCommissions(member.id);
  const payoutRows = await listPayouts(member.id);
  return (
    <div className="grid gap-5">
      <PageTitle
        title="Parrainage"
        text="Partagez votre code. Les commissions sont calculées lorsque l'administration confirme un paiement apporté par un ambassadeur."
      />
      <Flash error={one(sp.erreur)} ok={one(sp.ok)} />
      <article className="card p-5">
        <p className="text-xs font-bold text-green uppercase">Votre code</p>
        <p className="mt-2 text-3xl font-bold tracking-wider text-navy">{member.referralCode}</p>
      </article>
      <section>
        <h2 className="mb-2 font-bold text-navy">Personnes parrainées</h2>
        {referrals.map((item) => (
          <p key={item.id} className="text-sm">{fullName(item)} · {formatDate(item.createdAt)}</p>
        ))}
        {referrals.length === 0 ? <p className="text-sm text-ink/65">Aucun filleul pour le moment.</p> : null}
      </section>
      {member.role === "ambassadeur" || member.isAdmin ? (
        <section className="grid gap-3">
          <h2 className="font-bold text-navy">Commissions</h2>
          {commissionRows.map((item) => (
            <p key={item.id} className="text-sm">{formatMoney(item.amount, item.currency)} · {labels[item.status]} · {formatDate(item.createdAt)}</p>
          ))}
          <form action={requestPayout}><SubmitButton variant="btn btn-gold">Demander le reversement</SubmitButton></form>
          {payoutRows.map((item) => (
            <p key={item.id} className="text-sm">Reversement {formatMoney(item.amount)} · {labels[item.status]}</p>
          ))}
        </section>
      ) : (
        <p className="text-sm text-ink/70">Le suivi des commissions est ouvert au profil Ambassadeur NOÉ.</p>
      )}
    </div>
  );
}
