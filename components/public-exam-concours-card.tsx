import Link from "next/link";
import { formatDate } from "@/lib/format";
import { ManagerExamConcoursActions } from "@/components/manager-exam-concours-actions";

export type PublicExamConcoursCardData = {
  id: string;
  title: string;
  type: "examen" | "concours";
  validFrom: Date;
  validUntil: Date;
  description: string;
  ministry: string | null;
  documentUrl: string | null;
  documentName: string | null;
};

export function PublicExamConcoursCard({
  item,
  managerControls = false,
}: {
  item: PublicExamConcoursCardData;
  managerControls?: boolean;
}) {
  return (
    <article className="card group relative flex h-full min-w-0 flex-col overflow-hidden p-4 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl sm:p-5">
      <div aria-hidden="true" className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${item.type === "examen" ? "from-blue via-green to-gold" : "from-green via-blue to-gold"}`} />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${item.type === "examen" ? "bg-blue/10 text-blue" : "bg-green/10 text-leaf"}`}>
              {item.type}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-green/10 px-2.5 py-1 text-[10px] font-bold text-leaf">
              <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-3.5">
                <path d="m4 10 4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Validé
            </span>
          </div>
          <h3 className="mt-3 break-words text-lg font-bold leading-snug text-navy transition group-hover:text-blue sm:text-xl">
            {item.title}
          </h3>
        </div>
        <span aria-hidden="true" className={`grid size-10 shrink-0 place-items-center rounded-xl ${item.type === "examen" ? "bg-blue/10 text-blue" : "bg-green/10 text-green"}`}>
          {item.type === "examen" ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="size-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 3.75h7l4 4V20a.75.75 0 0 1-.75.75h-9.5A.75.75 0 0 1 7 20V3.75Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 4v4h4M9.5 13h5m-5 3h5" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="size-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m12 3 2.3 5.2 5.7.5-4.3 3.8 1.3 5.6-5-3-5 3 1.3-5.6L4 8.7l5.7-.5L12 3Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 21h8" />
            </svg>
          )}
        </span>
      </div>

      <p className="mt-3 line-clamp-3 whitespace-pre-wrap break-words text-sm leading-6 text-ink/65">
        {item.description}
      </p>

      <dl className="mt-4 grid gap-2 border-t border-line pt-3 text-xs text-ink/65">
        <div>
          <dt className="inline font-semibold text-navy">Période de validité : </dt>
          <dd className="inline">
            <time dateTime={item.validFrom.toISOString().slice(0, 10)}>{formatDate(item.validFrom)}</time>
            {" – "}
            <time dateTime={item.validUntil.toISOString().slice(0, 10)}>{formatDate(item.validUntil)}</time>
          </dd>
        </div>
        {item.ministry ? (
          <div className="break-words">
            <dt className="inline font-semibold text-navy">Ministère : </dt>
            <dd className="inline">{item.ministry}</dd>
          </div>
        ) : null}
      </dl>

      {item.documentUrl ? (
        <a
          href={item.documentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex min-h-9 w-fit max-w-full items-center gap-2 rounded-lg bg-paper px-3 py-1.5 text-xs font-semibold text-blue transition hover:bg-blue/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
        >
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-4 shrink-0">
            <path d="M10 3v9m0 0 3-3m-3 3L7 9m-3 4v3h12v-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="truncate">{item.documentName || "Document joint"}</span>
        </a>
      ) : null}

      <Link
        href={`/concours-examens/${item.id}`}
        aria-label={`Voir plus : ${item.title}`}
        className="mt-auto inline-flex min-h-10 items-center gap-2 pt-4 text-sm font-bold text-blue focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
      >
        Voir plus
        <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-4 transition-transform group-hover:translate-x-1">
          <path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>

      {managerControls ? (
        <ManagerExamConcoursActions id={item.id} title={item.title} initiallyValidated />
      ) : null}
    </article>
  );
}
