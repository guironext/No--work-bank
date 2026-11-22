import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "NOÉ WORK BANK",
    template: "%s · NOÉ WORK BANK",
  },
  description:
    "La banque de la connaissance et des opportunités. Connecter les compétences, accélérer l'emploi et développer les entreprises.",
  icons: { icon: "/brand/logo.jpg" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${outfit.variable} ${fraunces.variable} h-full`} data-scroll-behavior="smooth">
      <body className="min-h-full">
        <ClerkProvider
          appearance={{
            variables: {
              colorPrimary: "#0d4f9c",
              borderRadius: "0.8rem",
              fontFamily: "var(--font-outfit), sans-serif",
            },
          }}
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
