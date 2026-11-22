import Link from "next/link";
import { PublicFrame } from "@/components/public-frame";
import { PageTitle } from "@/components/ui";
import { listTalents } from "@/lib/data";
import { roleLabel } from "@/lib/constants";

export const instant = false;
export const metadata = { title: "Talents" };

export default async function TalentsPage() {
  const rows = await listTalents();
  return (
    <PublicFrame>
      <PageTitle
        kicker="NOÉ TALENTS"
        title="Portefeuilles ouverts aux recruteurs"
        text="Seuls les membres qui ont autorisé la consultation apparaissent ici. Le CV complet reste soumis à cette autorisation ou à une candidature."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {rows.map((member) => (
          <Link key={member.id} href={`/talents/${member.id}`} className="card p-5">
            <p className="text-xs font-bold text-green">{member.professionalId}</p>
            <h2 className="mt-1 text-lg font-bold text-navy">
              {member.firstName} {member.lastName}
            </h2>
            <p className="text-sm text-ink/70">
              {roleLabel(member.role)} · {member.domain || "Domaine à préciser"} · {member.city}
            </p>
          </Link>
        ))}
      </div>
      {rows.length === 0 ? (
        <p className="text-sm text-ink/70">Aucun talent n&apos;a encore ouvert son profil.</p>
      ) : null}
    </PublicFrame>
  );
}
