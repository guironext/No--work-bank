import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicFrame } from "@/components/public-frame";
import { getValidatedManagerExamConcours } from "@/lib/data";
import { formatDate } from "@/lib/format";

export const instant = false;
export const metadata = { title: "Examen ou concours" };

type ExamConcoursPageProps = {
  params: Promise<{ id: string }>;
};

async function ExamConcoursDetails({ params }: ExamConcoursPageProps) {
  const { id } = await params;
  const item = await getValidatedManagerExamConcours(id);
  if (!item) notFound();

  const isExam = item.type === "examen";

  return (
    <PublicFrame>
      <main className="mx-auto w-full max-w-5xl">
        <Link
          href="/concours-examens"
          className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-blue transition hover:text-navy focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
        >
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-4">
            <path d="M16 10H4m5 5-5-5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Tous les examens et concours
        </Link>

        <header className="relative mt-3 overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-navy via-blue to-leaf px-5 py-7 text-white shadow-xl shadow-navy/15 sm:px-8 sm:py-10">
          <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-16 size-56 rounded-full border-[28px] border-white/10" />
          <div className="relative">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">
              <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-4">
                <path d="m4 10 4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {isExam ? "Examen validé" : "Concours validé"}
            </span>
            <p className="mt-4 text-xs font-bold tracking-[0.16em] text-white/70 uppercase">{item.type}</p>
            <h1 className="display mt-1 max-w-3xl break-words text-3xl leading-tight sm:text-5xl">{item.title}</h1>
          </div>
        </header>

        <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <article className="card min-w-0 p-5 sm:p-7">
            <h2 className="text-lg font-bold text-navy">Description</h2>
            <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-ink/75">{item.description}</p>

            {item.ministry || item.documentUrl ? (
              <dl className="mt-6 grid gap-4 border-t border-line pt-5 sm:grid-cols-2">
                {item.ministry ? (
                  <div className="min-w-0">
                    <dt className="text-xs font-semibold text-ink/50">Ministère</dt>
                    <dd className="mt-1 whitespace-pre-line break-words text-sm text-navy">{item.ministry}</dd>
                  </div>
                ) : null}
                {item.documentUrl ? (
                  <div className="min-w-0">
                    <dt className="text-xs font-semibold text-ink/50">Document</dt>
                    <dd className="mt-1">
                      <a
                        href={item.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="break-all text-sm font-semibold text-blue underline decoration-blue/30 underline-offset-4 hover:decoration-blue"
                      >
                        {item.documentName || "Ouvrir le document"}
                      </a>
                    </dd>
                  </div>
                ) : null}
              </dl>
            ) : null}
          </article>

          <aside className="card grid content-start gap-3 p-5">
            <p className="text-xs font-bold tracking-[0.16em] text-green uppercase">Période de validité</p>
            <p className="font-semibold text-navy">Du {formatDate(item.validFrom)}</p>
            <p className="-mt-2 text-sm text-ink/65">Au {formatDate(item.validUntil)}</p>
          </aside>
        </div>
      </main>
    </PublicFrame>
  );
}

export default function ExamConcoursPage({ params }: ExamConcoursPageProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-paper" />}>
      <ExamConcoursDetails params={params} />
    </Suspense>
  );
}
