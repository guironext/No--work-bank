import Link from "next/link";
import { formatDate } from "@/lib/format";

export type EmploymentPostCardData = {
  id: string;
  title: string;
  companyName: string;
  location: string;
  offerDate: Date;
  description: string;
  mission: string;
  profile: string;
  level: string;
  workplace: string;
  experience: string;
  salary: string | null;
  email: string;
};

export function EmploymentPostCard({
  post,
  compact = false,
}: {
  post: EmploymentPostCardData;
  compact?: boolean;
}) {
  const Heading = compact ? "h3" : "h2";
  const details = [
    ["Missions", post.mission],
    ["Profil recherché", post.profile],
    ["Niveau", post.level],
    ["Lieu précis", post.workplace],
    ["Expérience", post.experience],
    ["Salaire", post.salary],
  ].filter((detail): detail is [string, string] => Boolean(detail[1]));

  return (
    <article className="card flex min-w-0 flex-col overflow-hidden p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-green/10 px-2.5 py-1 text-[11px] font-bold text-leaf">
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-3.5">
            <path d="m4 10 4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Validée
        </span>
        <time
          dateTime={post.offerDate.toISOString().slice(0, 10)}
          className="text-xs font-medium text-ink/55"
        >
          {formatDate(post.offerDate)}
        </time>
      </div>

      <Heading className="mt-4 break-words text-xl font-bold leading-snug text-navy">
        {post.title}
      </Heading>
      <p className="mt-1 break-words text-sm font-semibold text-green">{post.companyName}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        <span className="chip">{post.location}</span>
        {!compact ? <span className="chip">{post.level}</span> : null}
      </div>

      <p className={`mt-4 whitespace-pre-line text-sm leading-6 text-ink/70 ${compact ? "line-clamp-3" : ""}`}>
        {post.description}
      </p>

      {!compact ? (
        <dl className="mt-5 grid gap-3 border-t border-line pt-4 sm:grid-cols-2">
          {details.map(([label, value]) => (
            <div key={label} className="min-w-0">
              <dt className="text-xs font-semibold text-ink/50">{label}</dt>
              <dd className="mt-1 whitespace-pre-line break-words text-sm text-navy">{value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      <div className="mt-auto flex flex-wrap gap-3 pt-5">
        <Link href={`/emplois-et-stages/${post.id}`} className="btn btn-green min-h-11">
          Voir plus
        </Link>
        {!compact ? (
          <a
            href={`mailto:${post.email}`}
            className="btn btn-ghost min-h-11"
          >
            Contacter l’entreprise
          </a>
        ) : null}
      </div>
    </article>
  );
}
