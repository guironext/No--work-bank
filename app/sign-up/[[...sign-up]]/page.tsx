import { SignUp } from "@clerk/nextjs";
import Image from "next/image";
import { Suspense } from "react";
import { connection } from "next/server";
import { Logo } from "@/components/logo";
import { findActiveInvitation } from "@/lib/invitations";
import { one } from "@/lib/http";

export const instant = false;

async function SignUpContent(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const searchParams = await props.searchParams;
  const token = one(searchParams.invitation);
  if (token) await connection();
  const invitation = token ? await findActiveInvitation(token) : null;
  if (token && !invitation) {
    return (
      <main className="grid min-h-screen place-items-center bg-paper px-4 py-10">
        <section className="card max-w-lg p-6 text-center">
          <h1 className="display text-3xl text-navy">Invitation indisponible</h1>
          <p className="mt-3 text-sm leading-6 text-ink/70">
            Ce lien est invalide, a déjà été utilisé ou a expiré. Demandez une nouvelle invitation à l’administrateur.
          </p>
        </section>
      </main>
    );
  }

  const redirectUrl = invitation ? `/onboarding?invitation=${encodeURIComponent(token)}` : "/bienvenue";

  return (
    <div className="grid min-h-screen bg-paper lg:grid-cols-2">
      <div className="relative hidden min-h-screen lg:block">
        <Image src="/brand/siege.jpg" alt="Siège NOÉ WORK BANK" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/55 to-navy/15" />
        <div className="absolute right-10 bottom-10 left-10 text-white">
          <Logo size={72} />
          <p className="display mt-4 text-4xl">La banque de la connaissance et des opportunités</p>
        </div>
      </div>
      <div className="grid place-items-center px-4 py-12">
        <Suspense>
          <SignUp
            fallbackRedirectUrl={redirectUrl}
            forceRedirectUrl={invitation ? redirectUrl : undefined}
            signInUrl={
              invitation
                ? `/sign-in?redirect_url=${encodeURIComponent(redirectUrl)}`
                : undefined
            }
            initialValues={invitation ? { emailAddress: invitation.email } : undefined}
          />
        </Suspense>
      </div>
    </div>
  );
}

export default function SignUpPage(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense
      fallback={
        <main className="grid min-h-screen place-items-center bg-paper px-4 py-10">
          <p role="status" className="text-sm text-ink/65">Chargement de l’inscription…</p>
        </main>
      }
    >
      <SignUpContent searchParams={props.searchParams} />
    </Suspense>
  );
}
