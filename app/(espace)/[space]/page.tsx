import { DashboardScreen } from "@/components/dashboard-screen";

export const instant = false;
export const metadata = { title: "Accueil" };

export default function RoleHome(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <DashboardScreen searchParams={props.searchParams} />;
}
