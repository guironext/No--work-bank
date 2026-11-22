import Link from "next/link";
import { redirect } from "next/navigation";
import { AppNav } from "@/components/app-nav";
import { Logo } from "@/components/logo";
import { NavbarManager } from "@/components/navbarManager";
import { requireMember } from "@/lib/member";
import { spaceHome } from "@/lib/space";

export const instant = false;

export default async function ManagerLayout({ children }: { children: React.ReactNode }) {
  const member = await requireMember();
  if (member.role !== "manager") redirect(spaceHome(member.role));

  return (
    <>
      <div className="min-h-[calc(100vh-4rem)] lg:grid lg:grid-cols-[250px_minmax(0,1fr)]">
        <aside className="no-print hidden bg-navy px-4 py-6 text-white lg:sticky lg:top-0 lg:block lg:h-[calc(100vh-4rem)] lg:overflow-y-auto">
          <Link href="/manager" className="mb-6 flex items-center gap-2 px-2">
            <Logo size={42} />
            <span className="text-sm font-extrabold leading-tight">NOÉ<br />WORK BANK</span>
          </Link>
          <p className="mb-3 px-3 text-[11px] font-bold tracking-[0.16em] text-[#e39b1a] uppercase">
            Espace Manager
          </p>
          <NavbarManager />
        </aside>
        <div className="min-w-0 px-3 py-4 pb-24 sm:px-6 sm:py-6 lg:pb-6">{children}</div>
      </div>
      <AppNav variant="bottom" role="manager" />
    </>
  );
}
