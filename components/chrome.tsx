"use client";

import { useAuth, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "./logo";

export function AuthButtons({
  signIn,
  signUp,
  space,
  light = false,
}: {
  signIn: string;
  signUp: string;
  space: string;
  light?: boolean;
}) {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) {
    return <span className="inline-block h-11 w-36" aria-hidden />;
  }
  if (!isSignedIn) {
    return (
      <>
        <Link className={light ? "btn btn-white" : "btn btn-ghost"} href="/sign-in">
          {signIn}
        </Link>
        <Link className="btn btn-gold" href="/sign-up">
          {signUp}
        </Link>
      </>
    );
  }
  return (
    <>
      <Link className={light ? "btn btn-white" : "btn"} href="/tableau-de-bord">
        {space}
      </Link>
      <UserButton />
    </>
  );
}

export function SiteHeader({
  locale,
  overlay = false,
}: {
  locale: "fr" | "en";
  overlay?: boolean;
}) {
  const fr = locale !== "en";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const links = [
    ["/emplois-et-stages", fr ? "Emplois" : "Jobs"],
    ["/entreprises", fr ? "Entreprises" : "Companies"],
    ["/formations", fr ? "Formations" : "Trainings"],
    ["/emploi-en-ligne", fr ? "Emplois en ligne" : "Online Jobs"],
  ];
  const solid = !overlay || scrolled || open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return (
    <header className={`site-header no-print ${open ? "site-header-menu" : solid ? "site-header-solid" : "site-header-clear"}`}>
      <div className="site-header-bar">
        <Link href="/" className="flex min-w-0 items-center gap-2.5" onClick={() => setOpen(false)}>
          <Logo size={40} />
          <span className="whitespace-nowrap text-xs font-extrabold tracking-[0.08em] sm:text-sm">NOÉ WORK BANK</span>
        </Link>
        <nav className="header-links" aria-label={fr ? "Navigation" : "Navigation"}>
          {links.map(([href, label]) => (
            <Link key={href} className="nav-link" href={href}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="header-auth">
          <AuthButtons
            light={!solid}
            signIn={fr ? "Connexion" : "Sign in"}
            signUp={fr ? "Créer mon compte" : "Create account"}
            space={fr ? "Mon espace" : "My space"}
          />
        </div>
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="site-header-menu"
          aria-label={open ? (fr ? "Fermer le menu" : "Close menu") : fr ? "Ouvrir le menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
      <div
        id="site-header-menu"
        className={`mobile-panel ${open ? "mobile-panel-open" : ""}`}
        aria-hidden={!open}
      >
        <div className="mobile-panel-heading">
          <span>{fr ? "Explorer NOÉ" : "Explore NOÉ"}</span>
          <p>{fr ? "Tout pour la suite de votre parcours professionnel." : "Everything for your next professional step."}</p>
        </div>
        <nav className="mobile-links" aria-label={fr ? "Navigation mobile" : "Mobile navigation"}>
          {links.map(([href, label], index) => (
            <Link
              key={href}
              href={href}
              className="mobile-link"
              style={{ animationDelay: `${0.05 + index * 0.06}s` }}
              onClick={() => setOpen(false)}
            >
              <span className="mobile-link-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <span>{label}</span>
              <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
                <path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          ))}
        </nav>
        <div className="mobile-auth" style={{ animationDelay: "0.32s" }}>
          <AuthButtons
            light
            signIn={fr ? "Connexion" : "Sign in"}
            signUp={fr ? "Créer mon compte" : "Create account"}
            space={fr ? "Mon espace" : "My space"}
          />
        </div>
      </div>
    </header>
  );
}

export function SiteFooter({ locale }: { locale: "fr" | "en" }) {
  const fr = locale !== "en";
  return (
    <footer className="no-print bg-navy px-4 py-10 text-white sm:px-8">
      <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2">
            <Logo size={40} />
            <p className="font-extrabold">NOÉ WORK BANK</p>
          </div>
          <p className="mt-3 max-w-sm text-sm leading-6 text-white/75">
            {fr
              ? "La banque de la connaissance et des opportunités. Connecter les compétences. Accélérer l'emploi. Développer les entreprises."
              : "The bank of knowledge and opportunity. Connect skills. Accelerate employment. Grow businesses."}
          </p>
        </div>
        <div className="grid gap-2 text-sm text-white/80">
          <Link href="/emplois-et-stages">{fr ? "Trouver un emploi" : "Find a job"}</Link>
          <Link href="/entreprises">{fr ? "Espace entreprises" : "For companies"}</Link>
          <Link href="/formations">{fr ? "Formations" : "Trainings"}</Link>
          <Link href="/langue">{fr ? "Langue" : "Language"}</Link>
        </div>
        <p className="text-sm leading-6 text-white/70">
          {fr
            ? "Lancement prévu en Côte d'Ivoire, conçu dès l'origine pour plusieurs pays, devises et langues."
            : "Launching in Côte d'Ivoire, designed from the start for several countries, currencies and languages."}
        </p>
      </div>
    </footer>
  );
}
