import { SubmitButton } from "@/components/submit";
import { Flash, PageTitle } from "@/components/ui";
import { updatePlan } from "@/lib/actions";
import { listPlans } from "@/lib/data";
import { one } from "@/lib/http";

export const instant = false;
export const metadata = { title: "Tarifs" };

export default async function PricingAdminPage(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const plans = await listPlans();
  const sp = await props.searchParams;
  return (
    <div>
      <PageTitle title="Tarifs" text="Modifiables sans intervention sur le code." />
      <Flash ok={one(sp.ok)} error={one(sp.erreur)} />
      <div className="mt-4 grid gap-3">
        {plans.map((plan) => (
          <form key={plan.id} action={updatePlan} className="card grid gap-2 p-4 md:grid-cols-4">
            <input type="hidden" name="planId" value={plan.id} />
            <label className="field md:col-span-2"><span>Nom</span><input name="name" defaultValue={plan.name} /></label>
            <label className="field"><span>Montant</span><input name="amount" defaultValue={plan.amount} /></label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="active" defaultChecked={plan.active} /> Actif
              <SubmitButton variant="btn btn-small">Enregistrer</SubmitButton>
            </label>
          </form>
        ))}
      </div>
    </div>
  );
}
