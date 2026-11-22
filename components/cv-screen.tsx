import Link from "next/link";
import { CvDocument } from "@/components/cv-document";
import { PrintButton } from "@/components/print-button";
import { profileBundle } from "@/lib/data";
import { requireMember } from "@/lib/member";
import { profileHref } from "@/lib/space";

export async function CvScreen() {
  const member = await requireMember();
  const bundle = await profileBundle(member.id);
  return (
    <div className="grid gap-4">
      <div id="generer" className="no-print flex scroll-mt-24 flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <Link className="btn btn-ghost" href={profileHref(member.role)}>
            Retour
          </Link>
          <p className="text-sm text-ink/70">
            Le bouton ouvre la fenêtre d&apos;impression du téléphone ou de l&apos;ordinateur. Choisissez « Enregistrer en PDF ».
          </p>
        </div>
        <PrintButton label="Générer mon CV" />
      </div>
      <CvDocument member={member} {...bundle} showContacts />
    </div>
  );
}
