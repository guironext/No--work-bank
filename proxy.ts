import { NextResponse, type NextRequest } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { spaceHome, spacePrefix } from "@/lib/space";

const candidatRoutes = createRouteMatcher(["/candidature(.*)"]);
const professionnelRoutes = createRouteMatcher(["/professionnel(.*)"]);
const entrepreneurRoutes = createRouteMatcher(["/entrepreneur(.*)"]);
const entrepriseRoutes = (request: NextRequest) => {
  const pathname = request.nextUrl.pathname.replace(/\/+$/, "");
  return pathname.startsWith("/entreprise/");
};
const universiteRoutes = createRouteMatcher(["/universite(.*)"]);
const recruteurRoutes = createRouteMatcher(["/recruteur(.*)"]);
const investisseurRoutes = createRouteMatcher(["/investisseur(.*)"]);
const formateurRoutes = createRouteMatcher(["/formateur(.*)"]);
const ambassadeurRoutes = createRouteMatcher(["/ambassadeur(.*)"]);

const roleRoutes = [
  ["candidat", candidatRoutes],
  ["professionnel", professionnelRoutes],
  ["entrepreneur", entrepreneurRoutes],
  ["entreprise", entrepriseRoutes],
  ["universite", universiteRoutes],
  ["recruteur", recruteurRoutes],
  ["investisseur", investisseurRoutes],
  ["formateur", formateurRoutes],
  ["ambassadeur", ambassadeurRoutes],
] as const;

const isSharedRoute = createRouteMatcher([
  "/bienvenue(.*)",
  "/tableau-de-bord(.*)",
  "/profil(.*)",
  "/candidatures(.*)",
  "/favoris(.*)",
  "/explorer(.*)",
  "/publier(.*)",
  "/messages(.*)",
  "/notifications(.*)",
  "/parrainage(.*)",
  "/abonnements(.*)",
  "/paiements(.*)",
  "/parametres(.*)",
  "/assistance(.*)",
  "/admin(.*)",
  "/manager(.*)",
  "/comptable(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  const matched = roleRoutes.find(([, match]) => match(request));
  if (matched || isSharedRoute(request)) await auth.protect();
  if (!matched) return;

  const { userId } = await auth();
  if (!userId) return;

  const member = await db.member.findUnique({
    where: { clerkUserId: userId },
    select: { role: true },
  });
  if (!member) return NextResponse.redirect(new URL("/bienvenue", request.url));

  const [expectedRole] = matched;
  if (member.role === expectedRole) return;

  const nextPath = request.nextUrl.pathname.replace(spacePrefix(expectedRole), spaceHome(member.role));
  const url = new URL(nextPath || spaceHome(member.role), request.url);
  url.search = request.nextUrl.search;
  return NextResponse.redirect(url);
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
