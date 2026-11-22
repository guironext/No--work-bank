import Link from "next/link";
import { ManagerOnlineEmploymentActions } from "@/components/manager-online-employment-actions";

export type PublicOnlineEmploymentCardData = {
  id: string;
  title: string;
  description: string;
  companyName: string;
  registrationLink: string | null;
  contact: string | null;
};

export function PublicOnlineEmploymentCard({
  post,
  managerControls = false,
}: {
  post: PublicOnlineEmploymentCardData;
  managerControls?: boolean;
}) {
  return (
    <article className="card group relative flex h-full min-w-0 flex-col overflow-hidden p-4 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl sm:p-5">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue via-green to-gold" />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-1 rounded-full bg-green/10 px-2.5 py-1 text-[10px] font-bold text-leaf">
            <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-3.5">
              <path d="m4 10 4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Emploi validé
          </span>
          <h3 className="mt-3 break-words text-lg font-bold leading-snug text-navy transition group-hover:text-blue sm:text-xl">
            {post.title}
          </h3>
        </div>
        <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue/10 text-blue">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="size-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 20h16M6 17V7l6-3 6 3v13M9 10h.01M15 10h.01M9 13h.01M15 13h.01M10 17v-2h4v2" />
          </svg>
        </span>
      </div>

      <p className="mt-3 line-clamp-3 whitespace-pre-wrap break-words text-sm leading-6 text-ink/65">
        {post.description}
      </p>

      <dl className="mt-4 grid gap-2 border-t border-line pt-3 text-xs text-ink/65">
        <div className="break-words">
          <dt className="inline font-semibold text-navy">Entreprise : </dt>
          <dd className="inline">{post.companyName}</dd>
        </div>
        {post.contact ? (
          <div className="break-words">
            <dt className="inline font-semibold text-navy">Contact : </dt>
            <dd className="inline whitespace-pre-line">{post.contact}</dd>
          </div>
        ) : null}
      </dl>

      {post.registrationLink ? (
        <a
          href={post.registrationLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex min-h-9 w-fit max-w-full items-center gap-2 rounded-lg bg-paper px-3 py-1.5 text-xs font-semibold text-blue transition hover:bg-blue/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
        >
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-4 shrink-0">
            <path d="M11 3h6v6m0-6-8 8M15 11v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="truncate">Lien d’inscription</span>
        </a>
      ) : null}

      <Link
        href={`/emploi-en-ligne/${post.id}`}
        aria-label={`Voir plus : ${post.title}`}
        className="mt-auto inline-flex min-h-10 items-center gap-2 pt-4 text-sm font-bold text-blue focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
      >
        Voir plus
        <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-4 transition-transform group-hover:translate-x-1">
          <path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>

      {managerControls ? (
        <ManagerOnlineEmploymentActions id={post.id} title={post.title} initiallyValidated />
      ) : null}
    </article>
  );
}
