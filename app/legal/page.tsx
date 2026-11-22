import { PublicFrame } from "@/components/public-frame";
import { PageTitle } from "@/components/ui";

export const metadata = { title: "Conditions" };

export default function LegalPage() {
  return (
    <PublicFrame>
      <PageTitle
        kicker="Confiance"
        title="Conditions d'utilisation et confidentialité"
        text="Ces règles décrivent le fonctionnement actuel de NOÉ WORK BANK. Elles seront complétées par les formalités applicables en Côte d'Ivoire et dans chaque pays de déploiement."
      />
      <div className="card grid gap-4 p-6 text-sm leading-7">
        <p>
          Le compte est créé avec le consentement de la personne. Les données demandées servent à constituer
          le portefeuille de compétences, à transmettre les candidatures et à administrer les services payants.
        </p>
        <p>
          Le CV, les diplômes et les coordonnées ne sont pas ouverts à tous. Un recruteur les consulte si la
          personne l&apos;autorise, ou si elle a postulé à l&apos;une de ses offres. L&apos;administration y accède pour la
          vérification et la modération.
        </p>
        <p>
          Chacun peut demander la correction ou la suppression de son compte depuis les paramètres. La demande
          est tracée et traitée par l&apos;équipe NOÉ. Les journaux d&apos;audit conservent l&apos;action, pas le contenu effacé.
        </p>
        <p>
          Les analyses futures de NOÉ INTELLIGENCE devront être agrégées et anonymisées lorsqu&apos;elles n&apos;ont pas
          besoin d&apos;identifier une personne. NOÉ INVEST ne collecte pas de fonds et ne fournit pas de conseil financier.
        </p>
        <p>
          Les mots de passe et les sessions sont gérés par Clerk. Les échanges avec la plateforme passent par HTTPS.
          Les prix sont fixés dans l&apos;administration, sans modification du code.
        </p>
      </div>
    </PublicFrame>
  );
}
