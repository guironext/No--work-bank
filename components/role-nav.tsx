"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type RoleNavLink = { href: string; label: string };
export type RoleNavSection = { title: string; links: RoleNavLink[] };

export const ROLE_NAV: Record<string, Array<RoleNavLink | RoleNavSection>> = {
  candidat: [
    {
      title: "NOÉ Talents",
      links: [
        { href: "/candidature", label: "Tableau de bord" },
        { href: "/candidature/profil", label: "CV professionnel" },
        { href: "/candidature/profil#diplomes", label: "CV et Diplômes" },
        { href: "/emplois", label: "Offres d'emploi" },
        { href: "/candidature/profil#portfolio", label: "Portfolio" },
        { href: "/candidature/suivi", label: "Suivi des candidatures" },

      ],
    },

  ],
  professionnel: [
    { href: "/professionnel", label: "Accueil" },
    { href: "/professionnel/explorer", label: "Missions" },
    { href: "/professionnel/suivi", label: "Suivi" },
    { href: "/professionnel/messages", label: "Messages" },
    { href: "/professionnel/profil", label: "Profil" },
  ],
  entrepreneur: [
    { href: "/entrepreneur", label: "Accueil" },
    { href: "/entrepreneur/explorer", label: "Marchés" },
    { href: "/entrepreneur/publier", label: "Projets" },
    { href: "/entrepreneur/messages", label: "Partenaires" },
    { href: "/entrepreneur/profil", label: "Profil" },
  ],
  entreprise: [
    { href: "/entreprise", label: "Accueil" },
    { href: "/entreprise/organisation", label: "Organisation" },
    { href: "/entreprise/candidatures", label: "Candidatures" },
    { href: "/entreprise/messages", label: "Messages" },
    { href: "/entreprise/profil", label: "Profil" },
  ],
  universite: [
    { href: "/universite", label: "Accueil" },
    { href: "/universite/organisation", label: "École" },
    { href: "/universite/offres/nouvelle", label: "Offres" },
    { href: "/universite/candidatures", label: "Insertion" },
    { href: "/universite/profil", label: "Profil" },
  ],
  recruteur: [
    { href: "/recruteur", label: "Accueil" },
    { href: "/recruteur/explorer", label: "Recherche" },
    { href: "/recruteur/candidatures", label: "Présélection" },
    { href: "/recruteur/messages", label: "Messages" },
    { href: "/recruteur/profil", label: "Profil" },
  ],
  investisseur: [
    { href: "/investisseur", label: "Accueil" },
    { href: "/investisseur/explorer", label: "Projets" },
    { href: "/investisseur/messages", label: "Messages" },
    { href: "/investisseur/abonnements", label: "Abonnements" },
    { href: "/investisseur/profil", label: "Profil" },
  ],
  formateur: [
    { href: "/formateur", label: "Accueil" },
    { href: "/formateur/explorer", label: "Parcours" },
    { href: "/formateur/publier", label: "Cours" },
    { href: "/formateur/messages", label: "Messages" },
    { href: "/formateur/profil", label: "Profil" },
  ],
  ambassadeur: [
    { href: "/ambassadeur", label: "Accueil" },
    { href: "/ambassadeur/parrainage", label: "Parrainage" },
    { href: "/ambassadeur/explorer", label: "Prospection" },
    { href: "/ambassadeur/messages", label: "Messages" },
    { href: "/ambassadeur/profil", label: "Profil" },
  ],
  manager: [
    { href: "/manager", label: "Accueil" },
    { href: "/manager/opportunites", label: "Opportunités" },
    { href: "/manager/emplois-stages", label: "Emplois & stages" },
    { href: "/manager/examen-concours", label: "Examens & concours" },
    { href: "/manager/formation", label: "Formations" },
    { href: "/manager/emploi-ligne", label: "Emplois en ligne" },
    { href: "/manager/entreprises", label: "Entreprises qui recrutent" },

  ],
  comptable: [
    { href: "/comptable", label: "Accueil" },
    { href: "/comptable/notifications", label: "Alertes" },
    { href: "/comptable/profil", label: "Profil" },
    { href: "/comptable/parametres", label: "Paramètres" },
  ],
};

function isActive(path: string, href: string, home: string) {
  if (href === home) return path === href;
  return path === href || path.startsWith(`${href}/`);
}

export function roleNavLinks(role: string): RoleNavLink[] {
  return (ROLE_NAV[role] ?? []).flatMap((item) => ("links" in item ? item.links : [item]));
}

export function RoleNav({ role, label }: { role: string; label: string }) {
  const path = usePathname();
  const links = roleNavLinks(role);
  const home = links[0]?.href ?? "/";

  return (
    <nav aria-label={label} className="no-print flex gap-1 overflow-x-auto rounded-2xl border border-line bg-white p-1.5">
      {links.map(({ href, label: text }) => {
        const on = isActive(path, href, home);
        return (
          <Link
            key={href}
            href={href}
            aria-current={on ? "page" : undefined}
            className={`whitespace-nowrap rounded-xl px-3 py-2 text-sm font-semibold ${
              on ? "bg-navy text-white" : "text-navy/75 hover:bg-paper"
            }`}
          >
            {text}
          </Link>
        );
      })}
    </nav>
  );
}
