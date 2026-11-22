import Link from "next/link";
import { ManagerCompanyActions } from "@/components/manager-company-actions";

export type PublicManagerCompanyCardData = {
  id: string;
  title: string;
  description: string;
  companyName: string;
  location: string;
  website: string | null;
  contact: string | null;
};

export function PublicManagerCompanyCard({
  company,
  managerControls = false,
}: {
  company: PublicManagerCompanyCardData;
  managerControls?: boolean;
}) {
  return (
    <article className="card group relative flex h-full min-w-0 flex-col overflow-hidden transition duration-200 hover:-translate-y-0.5 hover:shadow-xl">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-green via-blue to-gold" />
      <Link
        href={`/entreprises/${company.id}`}
        aria-label={`Voir la fiche de ${company.title}`}
        className="flex min-h-0 flex-1 flex-col p-4 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-blue sm:p-5"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1 rounded-full bg-green/10 px-2.5 py-1 text-[10px] font-bold text-leaf">
              <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-3.5">
                <path d="m4 10 4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Entreprise validée
            </span>
            <h3 className="mt-3 break-words text-lg font-bold leading-snug text-navy transition group-hover:text-blue sm:text-xl">
              {company.title}
            </h3>
          </div>
          <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-xl bg-green/10 text-green">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="size-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 20h16M6 17V7l6-3 6 3v13M9 10h.01M15 10h.01M9 13h.01M15 13h.01M10 17v-2h4v2" />
            </svg>
          </span>
        </div>

        <p className="mt-3 line-clamp-3 whitespace-pre-wrap break-words text-sm leading-6 text-ink/65">
          {company.description}
        </p>

        <dl className="mt-4 grid gap-2 border-t border-line pt-3 text-xs text-ink/65">
          <div className="break-words">
            <dt className="inline font-semibold text-navy">Entreprise : </dt>
            <dd className="inline">{company.companyName}</dd>
          </div>
          <div className="break-words">
            <dt className="inline font-semibold text-navy">Localisation : </dt>
            <dd className="inline">{company.location}</dd>
          </div>
          {company.contact ? (
            <div className="break-words">
              <dt className="inline font-semibold text-navy">Contact : </dt>
              <dd className="inline whitespace-pre-line">{company.contact}</dd>
            </div>
          ) : null}
          {company.website ? (
            <div className="break-words">
              <dt className="inline font-semibold text-navy">Site web : </dt>
              <dd className="inline break-all">{company.website}</dd>
            </div>
          ) : null}
        </dl>

        <span className="mt-auto inline-flex min-h-10 items-center gap-2 pt-4 text-sm font-bold text-blue">
          Voir la fiche complète
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-4 transition-transform group-hover:translate-x-1">
            <path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </Link>

      {managerControls ? (
        <div className="px-4 pb-4 sm:px-5 sm:pb-5">
          <ManagerCompanyActions id={company.id} title={company.title} initiallyValidated />
        </div>
      ) : null}
    </article>
  );
}
