import { SubmitButton } from "@/components/submit";
import { Flash, PageTitle } from "@/components/ui";
import { requestPlan } from "@/lib/actions";
import { PROVIDERS } from "@/lib/constants";
import { listPlans } from "@/lib/data";
import { formatMoney } from "@/lib/format";
import { one } from "@/lib/http";
import { requireMember } from "@/lib/member";

export const instant = false;
export const metadata = { title: "Abonnements" };

const interval: Record<string, string> = { acte: "à l'acte", mois: "/ mois", an: "/ an" };

export default async function PlansPage(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireMember();
  const plans = (await listPlans()).filter((plan) => plan.active);
  const sp = await props.searchParams;
  return (
    <div className="grid gap-4">
      <PageTitle
        title="Abonnements et services"
        text="Les prix sont ceux de l'administration. Le paiement crée une demande. CinetPay confirmera le règlement lorsqu'il sera activé."
      />
      <Flash error={one(sp.erreur)} ok={one(sp.ok)} />
      {plans.map((plan) => (
        <form key={plan.id} action={requestPlan} className="card grid gap-3 p-5 md:grid-cols-[1fr_auto]">
          <div>
            <h2 className="font-bold text-navy">{plan.name}</h2>
            <p className="text-sm text-ink/70">{plan.description}</p>
            <p className="mt-2 text-lg font-bold text-navy">{formatMoney(plan.amount, plan.currency)} {interval[plan.interval]}</p>
          </div>
          <div className="grid content-end gap-2">
            <input type="hidden" name="planId" value={plan.id} />
            <label className="field">
              <span>Moyen</span>
              <select name="provider">
                {PROVIDERS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
            <SubmitButton>Payer</SubmitButton>
          </div>
        </form>
      ))}
    </div>
  );
}
