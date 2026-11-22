import { Suspense } from "react";
import Link from "next/link";
import { EmploymentPostCard } from "@/components/employment-post-card";
import { PublicFrame } from "@/components/public-frame";
import { listValidatedManagerEmploymentPosts } from "@/lib/data";

export const instant = false;
export const metadata = { title: "Emplois et stages validés" };

async function ValidatedEmploymentPostList() {
  const posts = await listValidatedManagerEmploymentPosts();

  if (posts.length === 0) {
    return (
      <div className="card flex flex-col items-center px-5 py-10 text-center sm:py-14">
        <span className="grid size-14 place-items-center rounded-2xl bg-green/10 text-green">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="size-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 20h16M6 17V7l6-3 6 3v10M9 10h.01M15 10h.01M9 13h.01M15 13h.01M10 17v-2h4v2" />
          </svg>
        </span>
        <p className="mt-4 font-semibold text-navy">Aucun emploi ou stage validé pour le moment.</p>
        <p className="mt-2 max-w-md text-sm leading-6 text-ink/65">Revenez bientôt pour découvrir les nouvelles offres.</p>
      </div>
    );
  }

  return (
    <section aria-labelledby="validated-employment-title">
      <header className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold tracking-[0.16em] text-green uppercase">Recrutement</p>
          <h2 id="validated-employment-title" className="mt-1 text-xl font-bold text-navy sm:text-2xl">
            Les offres disponibles
          </h2>
        </div>
        <span className="chip self-start sm:self-auto">
          {posts.length} {posts.length === 1 ? "offre validée" : "offres validées"}
        </span>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => (
          <EmploymentPostCard key={post.id} post={post} compact />
        ))}
      </div>
    </section>
  );
}

export default function EmploymentAndInternshipsPage() {
  return (
    <PublicFrame>
      <main className="mx-auto w-full max-w-6xl">
        <header className="relative isolate overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-navy via-blue to-[#0c6b30] px-5 py-7 text-white shadow-xl shadow-navy/10 sm:px-8 sm:py-10">
          <div aria-hidden="true" className="absolute -right-12 -top-16 size-64 rounded-full border-[32px] border-white/10" />
          <div aria-hidden="true" className="absolute -bottom-28 right-24 size-56 rounded-full border-[24px] border-white/5" />
          <div className="relative max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-bold tracking-[0.14em] text-white/90 uppercase ring-1 ring-white/15">
              <span className="size-1.5 rounded-full bg-[#f3c56a]" />
              NOÉ Jobs · Offres validées
            </span>
            <h1 className="display mt-4 text-4xl leading-tight sm:text-5xl">
              Emplois <span className="text-[#f3c56a]">&</span> stages
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80 sm:text-base sm:leading-7">
              Parcourez les offres vérifiées et approuvées par nos managers. Sélectionnez une annonce pour en découvrir tous les détails.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="inline-flex min-h-10 items-center gap-2 rounded-full bg-white/10 px-4 text-sm font-semibold text-white ring-1 ring-white/15">
                <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-4 text-[#f3c56a]">
                  <path d="m4 10 4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Offres approuvées par l’équipe NOÉ
              </span>
            </div>
          </div>
        </header>

        <div className="mt-8 sm:mt-10">
          <Suspense fallback={<div aria-hidden="true" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"><div className="card h-64 animate-pulse" /><div className="card hidden h-64 animate-pulse sm:block" /><div className="card hidden h-64 animate-pulse xl:block" /></div>}>
          <ValidatedEmploymentPostList />
          </Suspense>
        </div>

        <Link
          href="/#emplois-et-stages"
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
