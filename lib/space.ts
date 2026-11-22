const SPACE_BY_ROLE: Record<string, string> = {
  candidat: "candidature",
  professionnel: "professionnel",
  entrepreneur: "entrepreneur",
  entreprise: "entreprise",
  universite: "universite",
  recruteur: "recruteur",
  investisseur: "investisseur",
  formateur: "formateur",
  ambassadeur: "ambassadeur",
  manager: "manager",
  comptable: "comptable",
};

export const SPACE_SLUGS = Object.values(SPACE_BY_ROLE);

export function spaceSlug(role: string) {
  return SPACE_BY_ROLE[role] ?? role;
}

export function roleFromSpace(space: string) {
  return Object.entries(SPACE_BY_ROLE).find(([, slug]) => slug === space)?.[0] ?? null;
}

export function spacePrefix(role: string) {
  return `/${spaceSlug(role)}`;
}

export function spaceHome(role: string) {
  if (role === "admin") return "/admin";
  if (role === "manager") return "/manager";
  return spacePrefix(role);
}

export function profileHref(role: string) {
  return `${spacePrefix(role)}/profil`;
}

export function cvHref(role: string) {
  return `${spacePrefix(role)}/profil/cv`;
}

export function applicationsHref(role: string) {
  return `${spacePrefix(role)}/suivi`;
}

export function favoritesHref(role: string) {
  return `${spacePrefix(role)}/favoris`;
}

export function exploreHref(role: string) {
  return `${spacePrefix(role)}/explorer`;
}

export function publishHref(role: string) {
  return `${spacePrefix(role)}/publier`;
}

export function messagesHref(role: string) {
  return `${spacePrefix(role)}/messages`;
}

export function conversationHref(role: string, id: string) {
  return `${messagesHref(role)}/${id}`;
}

export function notificationsHref(role: string) {
  return `${spacePrefix(role)}/notifications`;
}

export function settingsHref(role: string) {
  return `${spacePrefix(role)}/parametres`;
}

export function referralHref(role: string) {
  return `${spacePrefix(role)}/parrainage`;
}

export function plansHref(role: string) {
  return `${spacePrefix(role)}/abonnements`;
}

export function paymentsHref(role: string) {
  return `${spacePrefix(role)}/paiements`;
}

export function supportHref(role: string) {
  return `${spacePrefix(role)}/assistance`;
}

export function companyHref(role: string) {
  return `${spacePrefix(role)}/organisation`;
}

export function newJobHref(role: string) {
  return `${spacePrefix(role)}/offres/nouvelle`;
}

export function receivedApplicationsHref(role: string) {
  return `${spacePrefix(role)}/candidatures`;
}

export function receivedApplicationHref(role: string, id: string) {
  return `${receivedApplicationsHref(role)}/${id}`;
}

function accountLinks(role: string): [string, string][] {
  return [
    [notificationsHref(role), "Alertes"],
    [settingsHref(role), "Paramètres"],
    [supportHref(role), "Assistance"],
  ];
}

export function navLinks(role: string, showAdmin = false) {
  const home = spaceHome(role);
  let main: [string, string][];
  let extra: [string, string][];
  switch (role) {
    case "candidat":
      main = [
        [home, "Accueil"],
        [exploreHref(role), "Explorer"],
        [applicationsHref(role), "Suivi"],
        [messagesHref(role), "Messages"],
        [profileHref(role), "Profil"],
      ];
      extra = [
        ["/emplois", "Emplois"],
        [favoritesHref(role), "Favoris"],
        [cvHref(role), "Mon CV"],
        [plansHref(role), "Formations"],
        [referralHref(role), "Parrainage"],
        [paymentsHref(role), "Paiements"],
        ...accountLinks(role),
      ];
      break;
    case "professionnel":
      main = [
        [home, "Accueil"],
        [exploreHref(role), "Missions"],
        [applicationsHref(role), "Suivi"],
        [messagesHref(role), "Messages"],
        [profileHref(role), "Profil"],
      ];
      extra = [
        ["/emplois", "Emplois"],
        [favoritesHref(role), "Favoris"],
        [cvHref(role), "Portfolio"],
        [publishHref(role), "Publier"],
        [plansHref(role), "Abonnements"],
        [paymentsHref(role), "Paiements"],
        [referralHref(role), "Parrainage"],
        ...accountLinks(role),
      ];
      break;
    case "entrepreneur":
      main = [
        [home, "Accueil"],
        [exploreHref(role), "Marchés"],
        [publishHref(role), "Projets"],
        [messagesHref(role), "Partenaires"],
        [profileHref(role), "Profil"],
      ];
      extra = [
        [favoritesHref(role), "Favoris"],
        [cvHref(role), "Portfolio"],
        [plansHref(role), "Abonnements"],
        [paymentsHref(role), "Paiements"],
        [referralHref(role), "Parrainage"],
        ...accountLinks(role),
      ];
      break;
    case "entreprise":
      main = [
        [home, "Accueil"],
        [companyHref(role), "Organisation"],
        [receivedApplicationsHref(role), "Candidatures"],
        [messagesHref(role), "Messages"],
        [profileHref(role), "Profil"],
      ];
      extra = [
        [newJobHref(role), "Offres"],
        [exploreHref(role), "Talents"],
        [plansHref(role), "Abonnements"],
        [paymentsHref(role), "Paiements"],
        ...accountLinks(role),
      ];
      break;
    case "universite":
      main = [
        [home, "Accueil"],
        [companyHref(role), "École"],
        [newJobHref(role), "Offres"],
        [receivedApplicationsHref(role), "Insertion"],
        [profileHref(role), "Profil"],
      ];
      extra = [
        [exploreHref(role), "Diplômés"],
        [messagesHref(role), "Messages"],
        [plansHref(role), "Abonnements"],
        [paymentsHref(role), "Paiements"],
        ...accountLinks(role),
      ];
      break;
    case "recruteur":
      main = [
        [home, "Accueil"],
        [exploreHref(role), "Recherche"],
        [receivedApplicationsHref(role), "Présélection"],
        [messagesHref(role), "Messages"],
        [profileHref(role), "Profil"],
      ];
      extra = [
        [companyHref(role), "Cabinet"],
        [newJobHref(role), "Nouvelle offre"],
        [favoritesHref(role), "Vivier"],
        [plansHref(role), "Abonnements"],
        [paymentsHref(role), "Paiements"],
        ...accountLinks(role),
      ];
      break;
    case "investisseur":
      main = [
        [home, "Accueil"],
        [exploreHref(role), "Projets"],
        [messagesHref(role), "Messages"],
        [plansHref(role), "Abonnements"],
        [profileHref(role), "Profil"],
      ];
      extra = [
        [paymentsHref(role), "Paiements"],
        [referralHref(role), "Parrainage"],
        ...accountLinks(role),
      ];
      break;
    case "formateur":
      main = [
        [home, "Accueil"],
        [exploreHref(role), "Parcours"],
        [publishHref(role), "Cours"],
        [messagesHref(role), "Messages"],
        [profileHref(role), "Profil"],
      ];
      extra = [
        [cvHref(role), "Profil formateur"],
        [plansHref(role), "Abonnements"],
        [paymentsHref(role), "Paiements"],
        ...accountLinks(role),
      ];
      break;
    case "ambassadeur":
      main = [
        [home, "Accueil"],
        [referralHref(role), "Parrainage"],
        [exploreHref(role), "Prospection"],
        [messagesHref(role), "Messages"],
        [profileHref(role), "Profil"],
      ];
      extra = [
        [paymentsHref(role), "Commissions"],
        [plansHref(role), "Abonnements"],
        ...accountLinks(role),
      ];
      break;
    default:
      main = [
        [home, "Accueil"],
        [exploreHref(role), "Explorer"],
        [messagesHref(role), "Messages"],
        [profileHref(role), "Profil"],
        [settingsHref(role), "Paramètres"],
      ];
      extra = accountLinks(role);
  }
  if (showAdmin) extra.push(["/admin", "Administration"]);
  return { home, main, extra };
}

export function withSearch(
  path: string,
  searchParams: Record<string, string | string[] | undefined>,
) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === "string") params.set(key, value);
    else if (value) for (const item of value) params.append(key, item);
  }
  const query = params.toString();
  return query ? `${path}?${query}` : path;
}
