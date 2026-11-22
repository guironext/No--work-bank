import Link from "next/link";
import { formatDate } from "@/lib/format";

export type PublicTrainingCardData = {
  id: string;
  title: string;
  startDate: Date;
  validFrom: Date;
  validUntil: Date;
  description: string;
  location: string | null;
};

export function PublicTrainingCard({ training }: { training: PublicTrainingCardData }) {
  return (
    <article className="card group relative flex h-full min-w-0 flex-col overflow-hidden p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl sm:p-6">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-green via-blue to-gold" />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-green/10 px-2.5 py-1 text-[11px] font-bold text-leaf">
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-3.5">
            <path d="m4 10 4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Validée
        </span>
        <time
          dateTime={training.startDate.toISOString().slice(0, 10)}
          className="text-xs font-medium text-ink/55"
        >
          Début : {formatDate(training.startDate)}
        </time>
      </div>

      <h3 className="mt-4 break-words text-xl font-bold leading-snug text-navy transition group-hover:text-blue">
        {training.title}
      </h3>
      <p className="mt-2 line-clamp-3 text-sm leading-6 text-ink/65">{training.description}</p>

      <div className="mt-5 grid gap-2 border-t border-line pt-4 text-xs text-ink/65">
        <p className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
          <span className="font-semibold text-navy">Période de validité :</span>
          <time dateTime={training.validFrom.toISOString().slice(0, 10)}>{formatDate(training.validFrom)}</time>
          <span aria-hidden="true">–</span>
          <time dateTime={training.validUntil.toISOString().slice(0, 10)}>{formatDate(training.validUntil)}</time>
        </p>
        {training.location ? (
          <p className="break-words">
            <span className="font-semibold text-navy">Lieu :</span> {training.location}
          </p>
        ) : null}
      </div>

      <Link
        href={`/formations/${training.id}`}
        aria-label={`Voir plus : ${training.title}`}
        className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-bold text-blue focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
      >
        Voir plus
        <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-4 transition-transform group-hover:translate-x-1">
          <path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </article>
  );
}
