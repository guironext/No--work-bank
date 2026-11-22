import { SubmitButton } from "@/components/submit";
import { Flash, PageTitle } from "@/components/ui";
import { setCommissionStatus, setPayoutStatus } from "@/lib/actions";
import { listCommissionsAdmin, listPayoutsAdmin } from "@/lib/data";
import { formatMoney, fullName } from "@/lib/format";
import { one } from "@/lib/http";

export const instant = false;
export const metadata = { title: "Commissions" };

export default async function CommissionsAdminPage(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const commissions = await listCommissionsAdmin();
  const payoutRows = await listPayoutsAdmin();
  const sp = await props.searchParams;
  return (
    <div className="grid gap-6">
      <PageTitle title="Commissions et reversements" />
      <Flash ok={one(sp.ok)} error={one(sp.erreur)} />
      <section className="grid gap-3">
        {commissions.map((row) => (
          <form key={row.commission.id} action={setCommissionStatus} className="card flex flex-wrap items-center justify-between gap-3 p-4 text-sm">
            <input type="hidden" name="commissionId" value={row.commission.id} />
            <span>{fullName(row.member)} · {formatMoney(row.commission.amount, row.commission.currency)}</span>
            <span className="flex gap-2">
              <select name="status" defaultValue={row.commission.status} className="rounded-xl border border-line bg-white px-2">
                <option value="en_attente">En attente</option>
                <option value="validee">Validée</option>
                <option value="payee">Payée</option>
                <option value="rejetee">Rejetée</option>
              </select>
              <SubmitButton variant="btn btn-small">OK</SubmitButton>
            </span>
          </form>
        ))}
        {commissions.length === 0 ? <p className="text-sm text-ink/60">Aucune commission.</p> : null}
      </section>
      <section className="grid gap-3">
        <h2 className="font-bold text-navy">Demandes de reversement</h2>
        {payoutRows.map((row) => (
          <form key={row.payout.id} action={setPayoutStatus} className="card flex flex-wrap items-center justify-between gap-3 p-4 text-sm">
            <input type="hidden" name="payoutId" value={row.payout.id} />
            <span>{fullName(row.member)} · {formatMoney(row.payout.amount)}</span>
            <span className="flex gap-2">
              <select name="status" defaultValue={row.payout.status} className="rounded-xl border border-line bg-white px-2">
                <option value="demandee">Demandée</option>
                <option value="validee">Validée</option>
                <option value="payee">Payée</option>
                <option value="rejetee">Rejetée</option>
              </select>
              <SubmitButton variant="btn btn-small">OK</SubmitButton>
            </span>
          </form>
        ))}
      </section>
    </div>
  );
}
