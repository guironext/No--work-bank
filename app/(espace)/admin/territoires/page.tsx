import { SubmitButton } from "@/components/submit";
import { Flash, PageTitle } from "@/components/ui";
import { addCity } from "@/lib/actions";
import { listCities, listCountries } from "@/lib/data";
import { one } from "@/lib/http";

export const instant = false;
export const metadata = { title: "Territoires" };

export default async function PlacesAdminPage(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const countries = await listCountries();
  const cities = await listCities();
  const sp = await props.searchParams;
  return (
    <div className="grid gap-5">
      <PageTitle title="Pays et villes" text="Le lancement commence en Côte d'Ivoire. D'autres pays sont déjà prévus dans le référentiel." />
      <Flash ok={one(sp.ok)} error={one(sp.erreur)} />
      <form action={addCity} className="card grid gap-3 p-4 md:grid-cols-3">
        <label className="field">
          <span>Pays</span>
          <select name="countryCode">{countries.map((country) => <option key={country.code} value={country.code}>{country.name}</option>)}</select>
        </label>
        <label className="field"><span>Ville</span><input name="name" required /></label>
        <div className="self-end"><SubmitButton>Ajouter</SubmitButton></div>
      </form>
      <ul className="grid gap-1 text-sm sm:grid-cols-2">
        {cities.map((city) => (
          <li key={city.id}>{city.name} · {city.countryCode}</li>
        ))}
      </ul>
    </div>
  );
}
