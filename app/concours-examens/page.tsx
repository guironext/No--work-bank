import { Suspense } from "react";
import Link from "next/link";
import { PublicExamConcoursCard } from "@/components/public-exam-concours-card";
import { PublicFrame } from "@/components/public-frame";
import { Empty } from "@/components/ui";
import { listValidatedManagerExamConcours } from "@/lib/data";
import { getMember } from "@/lib/member";

export const instant = false;
export const metadata = { title: "Examens et concours validés" };

async function ValidatedExamConcoursList() {
  const [items, member] = await Promise.all([listValidatedManagerExamConcours(), getMember()]);
  const managerControls = member?.role === "manager" && member.approvalStatus === "approved";
  const groups = [
    { type: "examen", title: "Examens", eyebrow: "Épreuves et certifications" },
    { type: "concours", title: "Concours", eyebrow: "Candidatures et admissions" },
  ] as const;

  if (items.length === 0) {
    return (
      <Empty
        title="Aucun examen ou concours validé pour le moment"
        text="Revenez bientôt pour découvrir les prochaines échéances."
      />
    );
  }

  return (
    <div className="grid gap-8">
      {groups.map((group) => {
        const entries = items.filter((item) => item.type === group.type);
        if (entries.length === 0) return null;

        return (
          <section key={group.type} aria-labelledby={`public-${group.type}-title`} className="grid gap-4">
            <header className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-bold tracking-[0.16em] text-green uppercase">{group.eyebrow}</p>
                <h2 id={`public-${group.type}-title`} className="mt-1 text-xl font-bold text-navy sm:text-2xl">
                  {group.title}
                </h2>
              </div>
              <span className="chip">{entries.length} {entries.length === 1 ? "résultat" : "résultats"}</span>
            </header>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {entries.map((item) => (
                <PublicExamConcoursCard key={item.id} item={item} managerControls={managerControls} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export default function ConcoursExamensPage() {
  return (
    <PublicFrame>
      <main className="mx-auto w-full max-w-6xl">
        <header className="relative isolate mb-8 overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-navy via-blue to-[#0c6b30] px-5 py-7 text-white shadow-xl shadow-navy/10 sm:px-8 sm:py-9">
          <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-16 size-64 rounded-full border-[32px] border-white/10" />
          <div className="relative max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-bold tracking-[0.14em] text-white/90 uppercase ring-1 ring-white/15">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-[#f3c56a]" />
              Examens et concours validés
            </span>
            <h1 className="display mt-4 text-3xl leading-tight sm:text-5xl">Toutes les échéances</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80 sm:text-base sm:leading-7">
              Consultez les examens et concours validés par les managers et préparez vos prochaines candidatures.
            </p>
          </div>
        </header>

        <Suspense fallback={<div aria-hidden="true" className="card h-64 animate-pulse" />}>
          <ValidatedExamConcoursList />
        </Suspense>

        <Link
          href="/#examens-concours"
          className="mt-8 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-blue transition hover:text-navy focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
        >
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-4">
            <path d="M16 10H4m5 5-5-5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Retour à l’accueil
        </Link>
      </main>
    </PublicFrame>
  );
}
