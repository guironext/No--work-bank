import { SubmitButton } from "@/components/submit";
import { Flash, PageTitle } from "@/components/ui";
import { setPaymentStatus } from "@/lib/actions";
import { listPaymentsAdmin } from "@/lib/data";
import { formatDate, formatMoney } from "@/lib/format";
import { one } from "@/lib/http";

export const instant = false;
export const metadata = { title: "Paiements" };

export default async function PaymentsAdminPage(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const rows = await listPaymentsAdmin();
  const sp = await props.searchParams;
  return (
    <div>
      <PageTitle title="Paiements" text="Confirmer un paiement déclenche l'abonnement éventuel et la commission d'un ambassadeur parrain." />
      <Flash ok={one(sp.ok)} error={one(sp.erreur)} />
      <div className="mt-4 grid gap-3">
        {rows.map((payment) => (
          <form key={payment.id} action={setPaymentStatus} className="card flex flex-wrap items-center justify-between gap-3 p-4 text-sm">
            <input type="hidden" name="paymentId" value={payment.id} />
            <span>
              <span className="font-semibold">{payment.purpose}</span>
              <span className="mt-1 block text-ink/60">{payment.reference} · {formatMoney(payment.amount, payment.currency)} · {formatDate(payment.createdAt)}</span>
            </span>
            <span className="flex gap-2">
              <select name="status" defaultValue={payment.status} className="rounded-xl border border-line bg-white px-2">
                <option value="en_attente">En attente</option>
                <option value="paye">Payé</option>
                <option value="echoue">Échoué</option>
                <option value="rembourse">Remboursé</option>
              </select>
              <SubmitButton variant="btn btn-small">Mettre à jour</SubmitButton>
            </span>
          </form>
        ))}
      </div>
    </div>
  );
}
