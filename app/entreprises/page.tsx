import { ValidatedCompaniesPage } from "@/components/validated-companies-page";

export const instant = false;
export const metadata = { title: "Entreprises validées" };

export default function CompaniesPage() {
  return <ValidatedCompaniesPage />;
}
