import { ExploreScreen } from "@/components/explore-screen";

export const instant = false;
export const metadata = { title: "Explorer" };

export default function RoleExplorer(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <ExploreScreen searchParams={props.searchParams} />;
}
