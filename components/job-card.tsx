import Link from "next/link";
import { formatRange } from "@/lib/format";
import type { Company, Job } from "@/lib/db/schema";

export function JobCard({ job, company }: { job: Job; company: Company }) {
  return (
    <Link href={`/emplois/${job.id}`} className="card grid gap-3 p-5 transition hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-wide text-green uppercase">{company.legalName}</p>
          <h2 className="mt-1 text-lg font-semibold text-balance text-navy">{job.title}</h2>
        </div>
        {job.isDemo ? <span className="chip chip-gold">Démo</span> : null}
      </div>
      <p className="line-clamp-2 text-sm leading-6 text-ink/70">{job.description}</p>
      <div className="flex flex-wrap gap-2">
        <span className="chip">{job.contractType}</span>
        <span className="chip">{job.city}</span>
        {job.sector ? <span className="chip">{job.sector}</span> : null}
      </div>
      <p className="text-sm font-semibold text-navy">
        {formatRange(job.salaryMin, job.salaryMax, job.currency)}
      </p>
    </Link>
  );
}
