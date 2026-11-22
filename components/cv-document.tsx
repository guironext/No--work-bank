import { Logo } from "./logo";
import type { Member } from "@/lib/db/schema";

type Skill = { id: string; name: string; kind: string; level: number };
type Education = {
  id: string;
  title: string;
  institution: string;
  year: string | null;
  kind?: string | null;
  documentUrl?: string | null;
};
type Experience = {
  id: string;
  title: string;
  organization: string;
  startDate: string | null;
  endDate: string | null;
  current: boolean;
  description: string | null;
};
type Portfolio = { id: string; title: string; description: string | null; url: string | null };
type Reference = { id: string; name: string; role: string | null; organization: string | null };

function EducationLines({ items, empty }: { items: Education[]; empty: string }) {
  if (items.length === 0) return empty ? <p className="mt-2 text-sm text-ink/60">{empty}</p> : null;
  return (
    <div className="mt-2 grid gap-2">
      {items.map((item) => (
        <p key={item.id} className="text-sm">
          <span className="font-semibold">{item.title}</span> — {item.institution}
          {item.year ? ` (${item.year})` : ""}
          {item.documentUrl ? (
            <>
              {" · "}
              <a className="font-semibold text-blue" href={item.documentUrl}>
                Pièce jointe
              </a>
            </>
          ) : null}
        </p>
      ))}
    </div>
  );
}

export function CvDocument({
  member,
  skills,
  educations,
  experiences,
  portfolio,
  references,
  showContacts,
}: {
  member: Member;
  skills: Skill[];
  educations: Education[];
  experiences: Experience[];
  portfolio: Portfolio[];
  references: Reference[];
  showContacts: boolean;
}) {
  return (
    <article className="card overflow-hidden">
      <header className="flex items-center gap-4 bg-navy px-6 py-6 text-white">
        <span className="no-print">
          <Logo size={64} />
        </span>
        <div>
          <p className="no-print text-xs font-bold tracking-[0.2em] text-gold">NOÉ WORK BANK</p>
          <h1 className="display text-3xl">
            {member.firstName} {member.lastName}
          </h1>
          <p className="text-sm text-white/80">{member.headline || member.domain || "Profil professionnel"}</p>
          <p className="no-print mt-1 text-xs text-white/70">Identifiant {member.professionalId}</p>
        </div>
      </header>
      <div className="grid gap-6 px-6 py-6 md:grid-cols-[1fr_220px]">
        <div className="grid gap-5">
          {member.bio ? (
            <section>
              <h2 className="text-sm font-bold tracking-wide text-green uppercase">Profil</h2>
              <p className="mt-2 text-sm leading-6">{member.bio}</p>
            </section>
          ) : null}
          <section>
            <h2 className="text-sm font-bold tracking-wide text-green uppercase">Expériences</h2>
            <div className="mt-2 grid gap-3">
              {experiences.length === 0 ? <p className="text-sm text-ink/60">Aucune expérience renseignée.</p> : null}
              {experiences.map((item) => (
                <div key={item.id}>
                  <p className="font-semibold text-navy">{item.title}</p>
                  <p className="text-sm">
                    {item.organization} · {item.startDate || "—"} — {item.current ? "Aujourd'hui" : item.endDate || "—"}
                  </p>
                  {item.description ? <p className="mt-1 text-sm leading-6 text-ink/75">{item.description}</p> : null}
                </div>
              ))}
            </div>
          </section>
          <section>
            <h2 className="text-sm font-bold tracking-wide text-green uppercase">Diplômes</h2>
            <EducationLines items={educations.filter((item) => item.kind !== "certificat")} empty="Aucun diplôme renseigné." />
          </section>
          {educations.some((item) => item.kind === "certificat") ? (
            <section>
              <h2 className="text-sm font-bold tracking-wide text-green uppercase">Certificats</h2>
              <EducationLines items={educations.filter((item) => item.kind === "certificat")} empty="" />
            </section>
          ) : null}
          {portfolio.length > 0 ? (
            <section>
              <h2 className="text-sm font-bold tracking-wide text-green uppercase">Portfolio</h2>
              {portfolio.map((item) => (
                <p key={item.id} className="mt-1 text-sm">
                  <span className="font-semibold">{item.title}</span>
                  {item.description ? ` — ${item.description}` : ""}
                </p>
              ))}
            </section>
          ) : null}
        </div>
        <aside className="grid content-start gap-4 text-sm">
          <div>
            <h2 className="text-xs font-bold tracking-wide text-green uppercase">Repères</h2>
            <p className="mt-2">{member.city} · {member.countryCode}</p>
            <p>{member.availability}</p>
            <p>{member.jobType}</p>
            {showContacts ? (
              <>
                <p className="mt-2">{member.phone}</p>
                <p>{member.email}</p>
              </>
            ) : (
              <p className="mt-2 text-ink/60">Coordonnées visibles après candidature ou autorisation.</p>
            )}
          </div>
          <div>
            <h2 className="text-xs font-bold tracking-wide text-green uppercase">Compétences</h2>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {skills.map((skill) => (
                <span key={skill.id} className="chip">
                  {skill.name} · {skill.level}/5
                </span>
              ))}
            </div>
          </div>
          {references.length > 0 ? (
            <div>
              <h2 className="text-xs font-bold tracking-wide text-green uppercase">Références</h2>
              {references.map((item) => (
                <p key={item.id} className="mt-2">
                  <span className="font-semibold">{item.name}</span>
                  <br />
                  {item.role} {item.organization ? `· ${item.organization}` : ""}
                </p>
              ))}
            </div>
          ) : null}
        </aside>
      </div>
    </article>
  );
}
