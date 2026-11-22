"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./logo";
import { ROLE_NAV, type RoleNavLink, type RoleNavSection } from "./role-nav";

function pathOf(href: string) {
  return href.split("#")[0].split("?")[0];
}

function isOn(path: string, href: string, home: string, hash: string) {
  const [target, anchor] = href.split("#");
  const targetPath = target.split("?")[0];
  if (anchor) return path === targetPath && hash === `#${anchor}`;
  if (targetPath === pathOf(home)) return path === targetPath && hash.length === 0;
  if (hash && path === targetPath) return false;
  return path === targetPath || path.startsWith(`${targetPath}/`);
}

function sections(): RoleNavSection[] {
  const entry = ROLE_NAV.candidat ?? [];
  if (entry.length > 0 && "links" in entry[0]) return entry as RoleNavSection[];
  return [{ title: "NOÉ Talents", links: entry as RoleNavLink[] }];
}

function shortLabel(label: string) {
  if (label.startsWith("Tableau")) return "Accueil";
  if (label.startsWith("CV")) return "CV";
  if (label.startsWith("Dipl")) return "Diplômes";
  if (label.startsWith("Port")) return "Portfolio";
  if (label.startsWith("Offre")) return "Offres";
  if (label.startsWith("Suivi")) return "Suivi";
  return label.split(" ")[0];
}

function iconName(href: string, label: string) {
  const blob = `${href} ${label}`.toLowerCase();
  if (blob.includes("dipl")) return "award";
  if (blob.includes("portfolio")) return "layers";
  if (blob.includes("emploi") || blob.includes("offre")) return "briefcase";
  if (blob.includes("suivi")) return "check";
  if (blob.includes("message")) return "chat";
  if (blob.includes("explorer")) return "search";
  if (blob.includes("cv") || blob.includes("profil")) return "file";
  return "home";
}

function NavIcon({ name }: { name: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-5 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {name === "home" ? <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z" /> : null}
      {name === "file" ? (
        <>
          <path d="M7 3.5h7l4 4V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1z" />
          <path d="M14 3.5V8h4.5M8.5 12.5h7M8.5 16h5" />
        </>
      ) : null}
      {name === "award" ? (
        <>
          <circle cx="12" cy="9" r="5" />
          <path d="m8.5 13.2-1.2 6.3L12 17l4.7 2.5-1.2-6.3" />
        </>
      ) : null}
      {name === "layers" ? (
        <>
          <path d="m12 4 8 4-8 4-8-4 8-4z" />
          <path d="m4 12 8 4 8-4" />
          <path d="m4 16 8 4 8-4" />
        </>
      ) : null}
      {name === "briefcase" ? (
        <>
          <path d="M4 8h16v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" />
          <path d="M9 8V6.5A1.5 1.5 0 0 1 10.5 5h3A1.5 1.5 0 0 1 15 6.5V8M4 13h16" />
        </>
      ) : null}
      {name === "check" ? (
        <>
          <path d="M8 4.5h8A1.5 1.5 0 0 1 17.5 6v13l-5.5-2.5L6.5 19V6A1.5 1.5 0 0 1 8 4.5z" />
          <path d="m9.2 11 1.8 1.8 3.8-3.8" />
        </>
      ) : null}
      {name === "chat" ? <path d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v7A2.5 2.5 0 0 1 16.5 16H9l-4 3v-3.2A2.5 2.5 0 0 1 5 13.5z" /> : null}
      {name === "search" ? (
        <>
          <circle cx="11" cy="11" r="6" />
          <path d="m16 16 4 4" />
        </>
      ) : null}
    </svg>
  );
}

export function NavbarCandidat() {
  const path = usePathname();
  const [hash, setHash] = useState("");
  const groups = sections();
  const links = groups.flatMap((section) => section.links);
  const home = links[0]?.href ?? "/candidature";

  useEffect(() => {
    const sync = () => setHash(window.location.hash);
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [path]);

  return (
    <>
      <div className="candidat-rail no-print fixed inset-y-0 left-0 z-40 hidden shadow-[12px_0_40px_rgb(8_53_111/0.18)] transition-[width,box-shadow] duration-300 ease-out lg:block">
      <nav
        aria-label="Espace candidat"
        className="flex h-full flex-col overflow-x-hidden overflow-y-auto bg-navy px-3.5 py-5 text-white"
      >
        <Link href={home} className="mb-6 flex items-center overflow-hidden rounded-2xl">
          <span className="grid size-12 shrink-0 place-items-center">
            <Logo size={40} />
          </span>
          <span className="rail-label text-sm leading-tight font-extrabold transition-all duration-300 ease-out">
            NOÉ
            <br />
            WORK BANK
          </span>
        </Link>

        <div className="grid gap-5">
          {groups.map((section) => (
            <div key={section.title || "links"} className="grid gap-1">
              {section.title ? (
                <p className="rail-title overflow-hidden px-3 text-[11px] font-bold tracking-[0.14em] text-[#e39b1a] uppercase transition-all duration-300 ease-out">
                  {section.title}
                </p>
              ) : null}
              {section.links.map(({ href, label }) => {
                const on = isOn(path, href, home, hash);
                return (
                  <Link
                    key={`${href}-${label}`}
                    href={href}
                    title={label}
                    aria-current={on ? "page" : undefined}
                    className="rail-link flex items-center overflow-hidden rounded-2xl transition-colors"
                  >
                    <span className="grid size-12 shrink-0 place-items-center">
                      <NavIcon name={iconName(href, label)} />
                    </span>
                    <span className="rail-label pr-3 text-sm font-semibold transition-all duration-300 ease-out">{label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </nav>
      </div>

      <nav
        aria-label="Espace candidat"
        className="candidat-dock no-print fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 px-2 pt-1.5 pb-[max(0.55rem,env(safe-area-inset-bottom))] shadow-[0_-10px_30px_rgb(8_53_111/0.08)] backdrop-blur lg:hidden"
      >
        <div className="flex gap-1 overflow-x-hidden">
          {links.map(({ href, label }) => {
            const on = isOn(path, href, home, hash);
            return (
              <Link
                key={`${href}-${label}`}
                href={href}
                aria-current={on ? "page" : undefined}
                title={label}
                className="rail-link flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-[10px] font-semibold"
              >
                <NavIcon name={iconName(href, label)} />
                <span className="max-w-full truncate">{shortLabel(label)}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
