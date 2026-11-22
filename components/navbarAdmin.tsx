"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  ["/admin/utilisateurs", "Utilisateurs"],
  ["/admin/comptes-inactifs", "Comptes inactifs"],
] as const;

export function NavbarAdmin() {
  const path = usePathname();

  return (
    <nav
      aria-label="Navigation administration"
      className="no-print mb-5 flex gap-2 overflow-x-auto rounded-2xl border border-line bg-white p-2"
    >
      {links.map(([href, label]) => {
        const active = path === href || path.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold ${
              active ? "bg-navy text-white" : "text-navy/75 hover:bg-paper"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
