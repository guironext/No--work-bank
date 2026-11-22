import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicFrame } from "@/components/public-frame";
import { getValidatedManagerEmploymentPost } from "@/lib/data";
import { formatDate } from "@/lib/format";

export const instant = false;
export const metadata = { title: "Emploi ou stage" };

type EmploymentPostPageProps = {
  params: Promise<{ id: string }>;
};

async function EmploymentPostDetails({ params }: EmploymentPostPageProps) {
  const { id } = await params;
  const post = await getValidatedManagerEmploymentPost(id);
  if (!post) notFound();

  const details = [
    ["Missions", post.mission],
    ["Profil recherché", post.profile],
    ["Niveau", post.level],
    ["Lieu précis", post.workplace],
    ["Expérience", post.experience],
    ["Salaire", post.salary],
  ].filter((detail): detail is [string, string] => Boolean(detail[1]));

  return (
    <PublicFrame>
      <main className="mx-auto w-full max-w-5xl">
        <Link
          href="/emplois-et-stages"
          className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-blue transition hover:text-navy focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
        >
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-4">
            <path d="M16 10H4m5 5-5-5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Tous les emplois et stages
        </Link>

        <header className="relative mt-3 overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-navy via-blue to-leaf px-5 py-7 text-white shadow-xl shadow-navy/15 sm:px-8 sm:py-10">
          <div aria-hidden="true" className="absolute -right-10 -top-16 size-56 rounded-full border-[28px] border-white/10" />
          <div className="relative">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">
              <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-4">
                <path d="m4 10 4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Offre validée
            </span>
            <p className="mt-4 text-sm font-semibold text-white/80">{post.companyName}</p>
            <h1 className="display mt-2 max-w-3xl break-words text-3xl leading-tight sm:text-5xl">
              {post.title}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/85">
              <p>{post.location}</p>
              <p>
                Publiée le <time dateTime={post.offerDate.toISOString().slice(0, 10)}>{formatDate(post.offerDate)}</time>
              </p>
            </div>
          </div>
        </header>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <article className="card min-w-0 p-5 sm:p-7">
            <h2 className="text-lg font-bold text-navy">Description de l’offre</h2>
            <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-ink/75">
              {post.description}
            </p>

            {details.length > 0 ? (
              <dl className="mt-6 grid gap-4 border-t border-line pt-5 sm:grid-cols-2">
                {details.map(([label, value]) => (
                  <div key={label} className="min-w-0">
                    <dt className="text-xs font-semibold text-ink/50">{label}</dt>
                    <dd className="mt-1 whitespace-pre-wrap break-words text-sm text-navy">{value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </article>

          <aside className="card grid content-start gap-3 p-5">
            <p className="text-xs font-bold tracking-[0.16em] text-green uppercase">Entreprise</p>
            <h2 className="break-words font-semibold text-navy">{post.companyName}</h2>
            <p className="text-sm text-ink/65">{post.location}</p>
            <a href={`mailto:${post.email}`} className="btn btn-green mt-2 w-full">
              Contacter l’entreprise
            </a>
          </aside>
        </div>
      </main>
    </PublicFrame>
  );
}

export default function EmploymentPostPage({ params }: EmploymentPostPageProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-paper" />}>
      <EmploymentPostDetails params={params} />
    </Suspense>
  );
}
