import Link from "next/link";
import { PageTitle } from "@/components/ui";
import { searchAll } from "@/lib/data";
import { one } from "@/lib/http";
import { requireMember } from "@/lib/member";
import { exploreHref } from "@/lib/space";

export async function ExploreScreen({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const member = await requireMember();
  const q = one((await searchParams).q);
  const result = q ? await searchAll(q) : null;
  return (
    <div>
      <PageTitle
        title="Explorer"
        text="Recherchez une personne, une compétence, un emploi, une entreprise ou une formation à venir."
      />
      <form action={exploreHref(member.role)} className="mb-6 flex gap-2">
        <input
          name="q"
          defaultValue={q}
          className="h-11 flex-1 rounded-xl border border-line bg-white px-3"
          placeholder="Compétence, métier, ville, entreprise"
        />
        <button className="btn" type="submit">
          Rechercher
        </button>
      </form>
      {result ? (
        <div className="grid gap-6">
          <section>
            <h2 className="mb-2 font-bold text-navy">Emplois</h2>
            {result.offers.map((row) => (
              <Link key={row.job.id} href={`/emplois/${row.job.id}`} className="block py-2 text-sm">
                {row.job.title} · {row.company.legalName}
              </Link>
            ))}
            {result.offers.length === 0 ? <p className="text-sm text-ink/60">Aucun emploi.</p> : null}
          </section>
          <section>
            <h2 className="mb-2 font-bold text-navy">Talents autorisés</h2>
            {result.talents.map((member) => (
              <Link key={member.id} href={`/talents/${member.id}`} className="block py-2 text-sm">
                {member.firstName} {member.lastName} · {member.domain}
              </Link>
            ))}
          </section>
          <section>
            <h2 className="mb-2 font-bold text-navy">Entreprises</h2>
            {result.companies.map((company) => (
              <Link key={company.id} href={`/entreprises/${company.id}`} className="block py-2 text-sm">
                {company.legalName} · {company.city}
              </Link>
            ))}
          </section>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          <Link className="card p-4 font-semibold text-navy" href="/emplois">
            Emplois et stages
          </Link>
          <Link className="card p-4 font-semibold text-navy" href="/talents">
            Talents
          </Link>
          <Link className="card p-4 font-semibold text-navy" href="/entreprises">
            Entreprises
          </Link>
          <Link className="card p-4 font-semibold text-navy" href="/modules">
            Modules à venir
          </Link>
        </div>
      )}
    </div>
  );
}
