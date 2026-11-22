import { PublicFrame } from "@/components/public-frame";
import { SubmitButton } from "@/components/submit";
import { Flash, PageTitle } from "@/components/ui";
import { setLocale } from "@/lib/actions";
import { one } from "@/lib/http";
import { getLocale } from "@/lib/locale";

export const instant = false;
export const metadata = { title: "Langue" };

export default async function LanguagePage(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await props.searchParams;
  const locale = await getLocale();
  return (
    <PublicFrame>
      <PageTitle
        kicker="UX03"
        title="Choisir la langue"
        text="L'accueil public suit ce choix. L'espace de travail du MVP est en français, langue du lancement en Côte d'Ivoire. L'anglais sera étendu à tous les écrans dans la version panafricaine."
      />
      <Flash ok={one(sp.ok)} />
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {[
          ["fr", "Français", "Côte d'Ivoire et pays francophones"],
          ["en", "English", "Welcome screen and navigation"],
        ].map(([value, label, text]) => (
          <form key={value} action={setLocale} className="card grid gap-3 p-5">
            <input type="hidden" name="locale" value={value} />
            <h2 className="text-xl font-bold text-navy">{label}</h2>
            <p className="text-sm text-ink/70">{text}</p>
            <SubmitButton variant={locale === value ? "btn" : "btn btn-ghost"}>
              {locale === value ? "Langue active" : "Choisir"}
            </SubmitButton>
          </form>
        ))}
      </div>
    </PublicFrame>
  );
}
