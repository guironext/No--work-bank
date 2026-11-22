import { PageTitle } from "@/components/ui";
import { listPayments } from "@/lib/data";
import { formatDate, formatMoney } from "@/lib/format";
import { requireMember } from "@/lib/member";
import { Flash } from "@/components/ui";
import { one } from "@/lib/http";

export const instant = false;
export const metadata = { title: "Paiements" };

const labels: Record<string, string> = {
  en_attente: "En attente",
  paye: "Payé",
  echoue: "Échoué",
  rembourse: "Remboursé",
};

export default async function PaymentsPage(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const member = await requireMember();
  const rows = await listPayments(member.id);
  const sp = await props.searchParams;
  return (
    <div>
      <PageTitle title="Paiements" text="Historique des demandes. Un paiement en attente n'est pas un encaissement." />
      <Flash ok={one(sp.ok)} error={one(sp.erreur)} />
      <div className="mt-4 grid gap-2">
        {rows.map((payment) => (
          <article key={payment.id} className="card flex items-center justify-between gap-3 p-4 text-sm">
            <span>
              <span className="font-semibold text-navy">{payment.purpose}</span>
              <span className="mt-1 block text-ink/60">{payment.reference} · {payment.provider} · {formatDate(payment.createdAt)}</span>
            </span>
            <span className="text-right">
              <span className="block font-bold">{formatMoney(payment.amount, payment.currency)}</span>
              <span className="chip">{labels[payment.status]}</span>
            </span>
          </article>
        ))}
        {rows.length === 0 ? <p className="text-sm text-ink/65">Aucun paiement.</p> : null}
      </div>
    </div>
  );
}
