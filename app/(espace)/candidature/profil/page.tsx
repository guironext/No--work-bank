import { CvBuilder } from "@/components/cv-builder";
import { listCities, listCountries, profileBundle } from "@/lib/data";
import { one } from "@/lib/http";
import { requireMember } from "@/lib/member";

export const instant = false;
export const metadata = { title: "CV professionnel" };

export default async function Page(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const member = await requireMember();
  const [bundle, countries, cities, searchParams] = await Promise.all([
    profileBundle(member.id),
    listCountries(),
    listCities(),
    props.searchParams,
  ]);

  return (
    <CvBuilder
      member={member}
      bundle={bundle}
      countries={countries}
      cities={cities}
      error={one(searchParams.erreur)}
      ok={one(searchParams.ok)}
    />
  );
}
