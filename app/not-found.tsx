import Link from "next/link";
import { Logo } from "@/components/logo";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-navy px-6 text-center text-white">
      <div>
        <Logo size={72} />
        <h1 className="display mt-4 text-4xl">Page introuvable</h1>
        <p className="mt-2 text-sm text-white/75">Ce lien ne correspond à aucun écran de NOÉ WORK BANK.</p>
        <Link className="btn btn-gold mt-6" href="/">
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
