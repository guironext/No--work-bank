import { SubmitButton } from "@/components/submit";
import { Flash, PageTitle } from "@/components/ui";
import { createTicket } from "@/lib/actions";
import { one } from "@/lib/http";
import { requireMember } from "@/lib/member";

export const instant = false;
export const metadata = { title: "Assistance" };

export default async function SupportPage(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireMember();
  const sp = await props.searchParams;
  return (
    <div>
      <PageTitle title="Assistance" text="Réclamation, question de compte ou signalement. L'équipe NOÉ répond depuis l'administration." />
      <Flash error={one(sp.erreur)} ok={one(sp.ok)} />
      <form action={createTicket} className="card mt-4 grid gap-3 p-5">
        <label className="field"><span>Sujet</span><input name="subject" required /></label>
        <label className="field"><span>Message</span><textarea name="body" required /></label>
        <SubmitButton>Envoyer</SubmitButton>
      </form>
    </div>
  );
}
