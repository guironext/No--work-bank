"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ROLE_NAV, type RoleNavLink, type RoleNavSection } from "./role-nav";

function pathOf(href: string) {
  return href.split("#")[0].split("?")[0];
}

function active(path: string, href: string, home: string, hash: string) {
  const [target, anchor] = href.split("#");
  const targetPath = target.split("?")[0];
  if (anchor) return path === targetPath && hash === `#${anchor}`;
  if (targetPath === pathOf(home)) return path === targetPath;
  return path === targetPath || path.startsWith(`${targetPath}/`);
}

function sectionsFor(role: string): RoleNavSection[] {
  const entry = ROLE_NAV[role] ?? [];
  if (entry.length > 0 && "links" in entry[0]) return entry as RoleNavSection[];
  return [{ title: "", links: entry as RoleNavLink[] }];
}

export function AppNav({ variant, role }: { variant: "side" | "bottom"; role: string }) {
  const path = usePathname();
  const [hash, setHash] = useState("");
  const sections = sectionsFor(role);
  const links = sections.flatMap((section) => section.links);
  const home = links[0]?.href ?? "/";

  useEffect(() => {
    const sync = () => setHash(window.location.hash);
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [path]);

  if (variant === "bottom") {
    return (
      <nav className="no-print fixed inset-x-0 bottom-0 z-30 flex gap-1 overflow-x-auto border-t border-line bg-white px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] lg:hidden">
        {links.map(({ href, label }) => {
          const on = active(path, href, home, hash);
          return (
            <Link
              key={`${href}-${label}`}
              href={href}
              className={`shrink-0 px-2 text-center text-[11px] font-semibold ${on ? "text-green" : "text-navy/70"}`}
            >
              <span className="block text-base">{label.slice(0, 1)}</span>
              {label}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="shell-nav grid gap-1 text-sm">
      {sections.map((section) => (
        <div key={section.title || "links"} className="grid gap-1">
          {section.title ? (
            <p className="px-3 pt-3 text-[11px] font-bold tracking-[0.14em] text-[#e39b1a] uppercase">
              {section.title}
            </p>
          ) : null}
          {section.links.map(({ href, label }) => (
            <Link
              key={`${href}-${label}`}
              href={href}
              data-active={active(path, href, home, hash)}
              className="rounded-xl px-3 py-2 font-semibold text-white/80"
            >
              {label}
            </Link>
          ))}
        </div>
      ))}
    </nav>
  );
}
