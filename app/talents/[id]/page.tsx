import { notFound } from "next/navigation";
import { CvDocument } from "@/components/cv-document";
import { PublicFrame } from "@/components/public-frame";
import { getTalent, viewerCanSeeTalent } from "@/lib/data";
import { getMember } from "@/lib/member";

export const instant = false;
export const metadata = { title: "Talent" };

export default async function TalentPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const talent = await getTalent(id);
  if (!talent) notFound();
  const viewer = await getMember();
  const allowed = await viewerCanSeeTalent(viewer, talent.member);
  if (!allowed) {
    return (
      <PublicFrame>
        <h1 className="display text-3xl text-navy">Profil non partagé</h1>
        <p className="mt-3 max-w-xl text-sm leading-6">
          Ce membre n&apos;a pas autorisé la consultation de son portefeuille. Les recruteurs y accèdent
          lorsqu&apos;une candidature leur est adressée.
        </p>
      </PublicFrame>
    );
  }
  const showContacts = Boolean(
    viewer && (viewer.id === talent.member.id || viewer.isAdmin || !talent.member.shareWithRecruiters),
  );
  return (
    <PublicFrame>
      <CvDocument {...talent} showContacts={showContacts || talent.member.cvPublic} />
    </PublicFrame>
  );
}
