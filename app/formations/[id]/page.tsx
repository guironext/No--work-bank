import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicFrame } from "@/components/public-frame";
import { getValidatedManagerTraining } from "@/lib/data";
import { formatDate } from "@/lib/format";

export const instant = false;
export const metadata = { title: "Formation" };

type TrainingPageProps = {
  params: Promise<{ id: string }>;
};

async function TrainingDetails({ params }: TrainingPageProps) {
  const { id } = await params;
  const training = await getValidatedManagerTraining(id);
  if (!training) notFound();

  const details = [
    ["Lieu", training.location],
    ["Contact", training.contact],
    ["Personnes à contacter", training.contactPeople],
  ].filter((detail): detail is [string, string] => Boolean(detail[1]));

  return (
    <PublicFrame>
      <main className="mx-auto w-full max-w-5xl">
        <Link
          href="/formations"
          className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-blue transition hover:text-navy focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
        >
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-4">
            <path d="M16 10H4m5 5-5-5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Toutes les formations
        </Link>

        <header className="relative mt-3 overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-navy via-blue to-leaf px-5 py-7 text-white shadow-xl shadow-navy/15 sm:px-8 sm:py-10">
          <div aria-hidden="true" className="absolute -right-10 -top-16 size-56 rounded-full border-[28px] border-white/10" />
          <div className="relative">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">
              <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-4">
                <path d="m4 10 4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Formation validée
            </span>
            <h1 className="display mt-4 max-w-3xl break-words text-3xl leading-tight sm:text-5xl">
              {training.title}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/85">
              <p>
                Début : <time dateTime={training.startDate.toISOString().slice(0, 10)}>{formatDate(training.startDate)}</time>
              </p>
              {training.location ? <p>{training.location}</p> : null}
            </div>
          </div>
        </header>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <article className="card min-w-0 p-5 sm:p-7">
            <h2 className="text-lg font-bold text-navy">À propos de la formation</h2>
            <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-ink/75">
              {training.description}
            </p>
            {details.length > 0 || training.registrationLink ? (
              <dl className="mt-6 grid gap-4 border-t border-line pt-5 sm:grid-cols-2">
                {details.map(([label, value]) => (
                  <div key={label} className="min-w-0">
                    <dt className="text-xs font-semibold text-ink/50">{label}</dt>
                    <dd className="mt-1 whitespace-pre-line break-words text-sm text-navy">{value}</dd>
                  </div>
                ))}
                {training.registrationLink ? (
                  <div className="min-w-0">
                    <dt className="text-xs font-semibold text-ink/50">Lien d’inscription</dt>
                    <dd className="mt-1">
                      <a
                        href={training.registrationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="break-all text-sm font-semibold text-blue underline decoration-blue/30 underline-offset-4 hover:decoration-blue"
                      >
                        Ouvrir le lien
                      </a>
                    </dd>
                  </div>
                ) : null}
              </dl>
            ) : null}
          </article>

          <aside className="card grid content-start gap-3 p-5">
            <p className="text-xs font-bold tracking-[0.16em] text-green uppercase">Période de validité</p>
            <p className="font-semibold text-navy">Du {formatDate(training.validFrom)}</p>
            <p className="-mt-2 text-sm text-ink/65">Au {formatDate(training.validUntil)}</p>
            {training.registrationLink ? (
              <a
                href={training.registrationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-gold mt-2 w-full"
              >
                S’inscrire
              </a>
            ) : null}
          </aside>
        </div>
      </main>
    </PublicFrame>
  );
}

export default function FormationPage({ params }: TrainingPageProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-paper" />}>
      <TrainingDetails params={params} />
    </Suspense>
  );
}
