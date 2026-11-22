import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Suspense } from "react";
import { Logo } from "./logo";
import { AppNav } from "./app-nav";
import { NavbarCandidat } from "./navbarCandidat";
import { NavbarAdmin } from "./navbarAdmin";
import type { Member } from "@/lib/db/schema";
import { roleLabel } from "@/lib/constants";
import { notificationsHref, spaceHome } from "@/lib/space";

export function Shell({
  member,
  unread,
  children,
}: {
  member: Member;
  unread: number;
  children: React.ReactNode;
}) {
  const home = spaceHome(member.role);
  const manager = member.role === "manager";
  const admin = (member.isAdmin || member.role === "admin") && !manager;
  const candidat = member.role === "candidat" && !admin;
  return (
    <div
      className={
        manager
          ? "min-h-screen bg-paper"
          : candidat
          ? "candidat-shell min-h-screen bg-paper"
          : admin
            ? "min-h-screen bg-paper"
            : "min-h-screen bg-paper lg:grid lg:grid-cols-[250px_1fr]"
      }
    >
      {admin || manager ? null : candidat ? (
        <NavbarCandidat />
      ) : (
        <aside className="no-print hidden bg-navy px-4 py-6 text-white lg:sticky lg:top-0 lg:block lg:max-h-screen lg:overflow-y-auto">
          <Link href={home} className="mb-6 flex items-center gap-2 px-2">
            <Logo size={42} />
            <span className="text-sm font-extrabold leading-tight">NOÉ<br />WORK BANK</span>
          </Link>
          <p className="mb-3 px-3 text-[11px] font-bold tracking-[0.16em] text-[#e39b1a] uppercase">
            {roleLabel(member.role)}
          </p>
          <AppNav variant="side" role={member.role} />
        </aside>
      )}
      <div
        className={`min-w-0 max-w-full overflow-x-clip ${
          candidat ? "pb-24 lg:pb-0" : admin || manager ? "pb-6" : "pb-20 lg:pb-0"
        }`}
      >
        <header className="no-print flex items-center justify-between border-b border-line bg-white px-4 py-3 sm:px-6">
          <div>
            <p className="text-xs font-bold tracking-[0.16em] text-green uppercase">Bonjour</p>
            <p className="font-semibold text-navy">
              {member.firstName} {member.lastName}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {admin || manager ? null : (
              <Link href={notificationsHref(member.role)} className="chip">
                {unread > 0 ? `${unread} alerte${unread > 1 ? "s" : ""}` : "Alertes"}
              </Link>
            )}
            <Suspense>
              <UserButton />
            </Suspense>
          </div>
        </header>
        <main
          className={
            manager
              ? "w-full min-w-0 max-w-none overflow-x-clip p-0"
              : `mx-auto w-full min-w-0 overflow-x-clip px-4 py-6 ${
                  admin ? "max-w-6xl sm:px-8 lg:py-8" : "max-w-5xl sm:px-6"
                }`
          }
        >
          {admin ? <NavbarAdmin /> : null}
          {children}
        </main>
      </div>
      {admin || candidat || manager ? null : <AppNav variant="bottom" role={member.role} />}
    </div>
  );
}
