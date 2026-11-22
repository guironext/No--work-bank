import { Suspense } from "react";
import { CompaniesDirectoryPage } from "@/components/companies-directory-page";
import { DashboardScreen } from "@/components/dashboard-screen";
import { Shell } from "@/components/shell";
import { unreadCount } from "@/lib/data";
import { getMember } from "@/lib/member";

export const instant = false;
export const metadata = { title: "Entreprises" };

type EntreprisePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

async function EntreprisePageContent({ searchParams }: EntreprisePageProps) {
  const member = await getMember();
  if (member?.role === "entreprise" && member.approvalStatus === "approved") {
    const unread = await unreadCount(member.id);
    return (
      <Shell member={member} unread={unread}>
        <DashboardScreen searchParams={searchParams} />
      </Shell>
    );
  }

  return <CompaniesDirectoryPage />;
}

export default function EntreprisePage(props: EntreprisePageProps) {
  return (
    <Suspense fallback={<div aria-hidden="true" className="min-h-screen bg-paper" />}>
      <EntreprisePageContent searchParams={props.searchParams} />
    </Suspense>
  );
}
