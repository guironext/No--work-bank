import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
import { Suspense } from "react";
import { Logo } from "@/components/logo";

export default function SignInPage() {
  return (
    <div className="grid min-h-screen bg-paper lg:grid-cols-2">
      <div className="relative hidden min-h-screen lg:block">
        <Image src="/brand/siege.jpg" alt="Siège NOÉ WORK BANK" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-navy/10" />
        <div className="absolute right-10 bottom-10 left-10 text-white">
          <Logo size={72} />
          <p className="display mt-4 text-4xl">Booster l&apos;emploi en Afrique</p>
          <p className="mt-2 max-w-md text-sm text-white/80">
            Ensemble pour un emploi durable. Votre prochaine opportunité commence ici.
          </p>
        </div>
      </div>
      <div className="grid place-items-center px-4 py-12">
        <Suspense>
          <SignIn fallbackRedirectUrl="/bienvenue" />
        </Suspense>
      </div>
    </div>
  );
}
