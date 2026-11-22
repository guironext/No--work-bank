import { PublicFrame } from "@/components/public-frame";
import { PageTitle } from "@/components/ui";

export const metadata = { title: "Modules" };

const modules = [
  ["NOÉ TALENTS", "Disponible", "Identité professionnelle, CV, compétences et identifiant NOÉ."],
  ["NOÉ JOBS", "Disponible", "Offres, candidatures, entretiens et confirmation des recrutements."],
  ["NOÉ BUSINESS", "Disponible", "Compte entreprise, vérification et publication des besoins."],
  ["NOÉ PROJECTS", "Version 2", "Idées, business model, partenaires et incubation."],
  ["NOÉ MARKETS", "Version 2", "Appels d'offres, soumissions et sous-traitance."],
  ["NOÉ JOB ACADEMY", "Version 2", "Formations, évaluations et certificats, avec NOÉ Polytechnique."],
  ["NOÉ INVEST", "Version 3", "Présentation et mise en relation. Aucune intermédiation financière n'est active."],
  ["NOÉ INTELLIGENCE", "Version 3", "Statistiques agrégées, sans identification des personnes lorsque ce n'est pas nécessaire."],
];

export default function ModulesPage() {
  return (
    <PublicFrame>
      <PageTitle
        kicker="Plateforme"
        title="Huit modules, trois temps"
        text="Le lancement commercial repose sur Talents, Jobs et Business. Les autres modules sont prévus, pas simulés."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {modules.map(([title, phase, text]) => (
          <article key={title} className="card p-5">
            <p className={`text-xs font-bold ${phase === "Disponible" ? "text-green" : "text-sky"}`}>{phase}</p>
            <h2 className="mt-1 text-xl font-bold text-navy">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-ink/75">{text}</p>
          </article>
        ))}
      </div>
      <aside className="card mt-6 border-gold/40 p-5 text-sm leading-6">
        NOÉ INVEST reste un espace de présentation et de mise en relation. Toute collecte, tout placement,
        tout conseil financier réglementé ou toute intermédiation financière attendra les autorisations nécessaires.
      </aside>
    </PublicFrame>
  );
}
