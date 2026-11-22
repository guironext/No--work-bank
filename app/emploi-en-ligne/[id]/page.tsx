import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicFrame } from "@/components/public-frame";
import { getValidatedManagerOnlineEmploymentPost } from "@/lib/data";

export const instant = false;
export const metadata = { title: "Emploi en ligne" };

type OnlineEmploymentPageProps = {
  params: Promise<{ id: string }>;
};

async function OnlineEmploymentDetails({ params }: OnlineEmploymentPageProps) {
  const { id } = await params;
  const post = await getValidatedManagerOnlineEmploymentPost(id);
  if (!post) notFound();

  return (
    <PublicFrame>
      <main className="mx-auto w-full max-w-5xl">
        <Link
          href="/emploi-en-ligne"
          className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-blue transition hover:text-navy focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
        >
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-4">
            <path d="M16 10H4m5 5-5-5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Tous les emplois en ligne
        </Link>

        <header className="relative mt-3 overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-navy via-blue to-leaf px-5 py-7 text-white shadow-xl shadow-navy/15 sm:px-8 sm:py-10">
          <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-16 size-56 rounded-full border-[28px] border-white/10" />
          <div className="relative">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">
              <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-4">
                <path d="m4 10 4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Emploi en ligne validé
            </span>
            <h1 className="display mt-4 max-w-3xl break-words text-3xl leading-tight sm:text-5xl">{post.title}</h1>
            <p className="mt-4 text-sm font-semibold text-white/85 sm:text-base">{post.companyName}</p>
          </div>
        </header>

        <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <article className="card min-w-0 p-5 sm:p-7">
            <h2 className="text-lg font-bold text-navy">Description du poste</h2>
            <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-ink/75">{post.description}</p>

            {post.contact ? (
              <div className="mt-6 border-t border-line pt-5">
                <h3 className="text-xs font-semibold text-ink/50">Contact</h3>
                <p className="mt-1 whitespace-pre-line break-words text-sm text-navy">{post.contact}</p>
              </div>
            ) : null}
          </article>

          <aside className="card grid content-start gap-3 p-5">
            <p className="text-xs font-bold tracking-[0.16em] text-green uppercase">Entreprise</p>
            <p className="break-words font-semibold text-navy">{post.companyName}</p>
            {post.registrationLink ? (
              <a
                href={post.registrationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-gold mt-2 w-full"
              >
                Candidater en ligne
              </a>
            ) : null}
          </aside>
        </div>
      </main>
    </PublicFrame>
  );
}

export default function OnlineEmploymentDetailPage({ params }: OnlineEmploymentPageProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-paper" />}>
      <OnlineEmploymentDetails params={params} />
    </Suspense>
  );
}
