import { Suspense } from "react";
import Link from "next/link";
import { HomeView } from "@/components/home-view";
import { JobCard } from "@/components/job-card";
import {
  listJobs,
  listValidatedManagerExamConcours,
  listValidatedManagerEmploymentPosts,
  listValidatedManagerOnlineEmploymentPosts,
  listValidatedManagerCompanyListings,
  listValidatedManagerTrainings,
  listValidatedOpportunities,
} from "@/lib/data";
import { getLocale } from "@/lib/locale";
import { getMember } from "@/lib/member";

export const instant = false;

async function LocalizedHome() {
  const locale = await getLocale();
  let rows: Awaited<ReturnType<typeof listJobs>> = [];
  try {
    rows = (await listJobs()).slice(0, 3);
  } catch {
    rows = [];
  }
  const [opportunities, managerEmploymentPosts, managerTrainings, managerExamConcours, onlineEmploymentPosts, companyListings, member] = await Promise.all([
    listValidatedOpportunities(),
    listValidatedManagerEmploymentPosts(),
    listValidatedManagerTrainings(),
    listValidatedManagerExamConcours(),
    listValidatedManagerOnlineEmploymentPosts(),
    listValidatedManagerCompanyListings(),
    getMember(),
  ]);
  const preview =
    rows.length > 0 ? (
      <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-green uppercase">NOÉ JOBS</p>
            <h2 className="display mt-2 text-3xl text-navy sm:text-4xl">
              {locale === "en" ? "Recent opportunities" : "Opportunités récentes"}
            </h2>
          </div>
          <Link className="btn btn-ghost btn-small" href="/emplois">
            {locale === "en" ? "All openings" : "Toutes les offres"}
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {rows.map((row) => (
            <JobCard key={row.job.id} job={row.job} company={row.company} />
          ))}
        </div>
      </section>
    ) : null;
  return (
    <HomeView
      locale={locale}
      jobs={preview}
      opportunities={opportunities}
      employmentPosts={managerEmploymentPosts.slice(0, 3)}
      formations={managerTrainings.slice(0, 3)}
      examsConcours={managerExamConcours.slice(0, 3)}
      onlineEmploymentPosts={onlineEmploymentPosts.slice(0, 3)}
      companyListings={companyListings.slice(0, 3)}
      managerControls={member?.role === "manager" && member.approvalStatus === "approved"}
    />
  );
}

export default function Page() {
  return (
    <Suspense fallback={<HomeView locale="fr" />}>
      <LocalizedHome />
    </Suspense>
  );
}
