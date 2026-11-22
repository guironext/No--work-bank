import { ProfileScreen } from "@/components/profile-screen";

export const instant = false;
export const metadata = { title: "Mon profil" };

export default function RoleProfile(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <ProfileScreen searchParams={props.searchParams} />;
}
