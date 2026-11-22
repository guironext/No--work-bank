import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/format";
import { SiteFooter, SiteHeader } from "./chrome";
import { Logo } from "./logo";
import { EmploymentPostCard, type EmploymentPostCardData } from "./employment-post-card";
import { PublicExamConcoursCard, type PublicExamConcoursCardData } from "./public-exam-concours-card";
import { PublicOnlineEmploymentCard, type PublicOnlineEmploymentCardData } from "./public-online-employment-card";
import { PublicManagerCompanyCard, type PublicManagerCompanyCardData } from "./public-manager-company-card";
import { PublicTrainingCard, type PublicTrainingCardData } from "./public-training-card";

const copy = {
  fr: {
    kicker: "Ensemble pour un emploi durable",
    title: "Booster l'emploi en Afrique",
    text: "La banque de la connaissance et des opportunités. Construisez votre identité professionnelle, trouvez un emploi et développez votre entreprise.",
    account: "Créer mon compte",
    jobs: "Trouver un emploi",
    opportunityKicker: "À saisir",
    opportunityTitle: "Opportunités",
    opportunityText: "Découvrez les opportunités vérifiées et publiées par les managers.",
    opportunityEmpty: "Aucune opportunité validée pour le moment. Revenez bientôt.",
    opportunityLink: "Découvrir l’opportunité",
    opportunitySeeAll: "Voir toutes les opportunités",
    validated: "Validée",
    employmentKicker: "NOÉ JOBS",
    employmentTitle: "Emplois et stages",
    employmentText: "Découvrez les offres d’emploi et de stage approuvées par nos managers.",
    employmentEmpty: "Aucun emploi ou stage validé pour le moment. Revenez bientôt.",
    employmentSeeAll: "Voir tous les emplois et stages",
    trainingKicker: "Se former",
    trainingTitle: "Formations",
    trainingText: "Découvrez les formations approuvées par nos managers.",
    trainingEmpty: "Aucune formation validée pour le moment. Revenez bientôt.",
    trainingSeeAll: "Voir toutes les formations",
    examConcoursKicker: "Se préparer",
    examConcoursTitle: "Examens et concours",
    examConcoursText: "Découvrez les examens et concours approuvés par nos managers.",
    examConcoursEmpty: "Aucun examen ou concours validé pour le moment. Revenez bientôt.",
    examConcoursSeeAll: "Voir tous les examens et concours",
    onlineEmploymentKicker: "NOÉ JOBS",
    onlineEmploymentTitle: "Emplois en ligne",
    onlineEmploymentText: "Découvrez les emplois en ligne approuvés par nos managers.",
    onlineEmploymentEmpty: "Aucun emploi en ligne validé pour le moment. Revenez bientôt.",
    onlineEmploymentSeeAll: "Voir tous les emplois en ligne",
    companyListingsKicker: "NOÉ BUSINESS",
    companyListingsTitle: "Entreprises",
    companyListingsText: "Découvrez les entreprises présentées et approuvées par nos managers.",
    companyListingsEmpty: "Aucune entreprise validée pour le moment. Revenez bientôt.",
    companyListingsSeeAll: "Voir toutes les entreprises",
    motto: ["Formation", "Innovation", "Emplois", "Business"],
    pillarsKicker: "Disponible maintenant",
    pillarsTitle: "Quatre modules pour lancer",
    pillarCta: "Découvrir",
    pillars: [
      ["NOÉ TALENTS", "Le portefeuille de compétences : profil, CV, diplômes, expériences et identifiant professionnel.", "/talents"],
      ["NOÉ JOBS", "Les offres, les stages, les missions, la candidature en un clic et le suivi jusqu'au recrutement.", "/emplois"],
      ["NOÉ BUSINESS", "Le compte entreprise, la publication des besoins et la rencontre avec les talents.", "/entreprises"],
    ],
    pathKicker: "Parcours",
    pathTitle: "Deux parcours, une même plateforme",
    youngKicker: "Candidat",
    young: "Jeune diplômé",
    youngSteps: ["Inscription", "Profil et CV", "Recommandations", "Candidature", "Recrutement"],
    companyKicker: "Recruteur",
    company: "Entreprise",
    companySteps: ["Compte vérifié", "Publication", "Présélection", "Entretien", "Confirmation"],
    nextKicker: "Feuille de route",
    nextTitle: "La suite de la chaîne de valeur",
    modules: "Tous les modules",
    ctaTitle: "Votre identité professionnelle commence ici",
    ctaText: "Un compte pour le profil, le CV et les candidatures. Les entreprises publient leurs besoins sur la même plateforme.",
    next: [
      ["NOÉ PROJECTS", "Version 2", "Transformer une idée en projet structuré."],
      ["NOÉ MARKETS", "Version 2", "Appels d'offres, cotations et sous-traitance."],
      ["NOÉ JOB ACADEMY", "Version 2", "Formations, quiz et certificats vérifiables."],
      ["NOÉ INVEST", "Version 3", "Mise en relation uniquement, dans le cadre autorisé."],
      ["NOÉ INTELLIGENCE", "Version 3", "Indicateurs agrégés et anonymisés."],
    ],
  },
  en: {
    kicker: "Together for lasting employment",
    title: "Boost employment across Africa",
    text: "The bank of knowledge and opportunity. Build a professional identity, find work and grow a business.",
    account: "Create my account",
    jobs: "Find a job",
    opportunityKicker: "Explore",
    opportunityTitle: "Validated opportunities",
    opportunityText: "Discover opportunities reviewed and published by managers.",
    opportunityEmpty: "There are no validated opportunities yet. Check back soon.",
    opportunityLink: "Explore opportunity",
    opportunitySeeAll: "View all opportunities",
    validated: "Validated",
    employmentKicker: "NOÉ JOBS",
    employmentTitle: "Validated jobs and internships",
    employmentText: "Explore job and internship offers approved by our managers.",
    employmentEmpty: "There are no validated jobs or internships yet. Check back soon.",
    employmentSeeAll: "View all jobs and internships",
    trainingKicker: "Learn and grow",
    trainingTitle: "Validated training",
    trainingText: "Explore training courses approved by our managers.",
    trainingEmpty: "There are no validated training courses yet. Check back soon.",
    trainingSeeAll: "View all training",
    examConcoursKicker: "Get prepared",
    examConcoursTitle: "Validated exams and competitions",
    examConcoursText: "Explore exams and competitions approved by our managers.",
    examConcoursEmpty: "There are no validated exams or competitions yet. Check back soon.",
    examConcoursSeeAll: "View all exams and competitions",
    onlineEmploymentKicker: "NOÉ JOBS",
    onlineEmploymentTitle: "Validated online jobs",
    onlineEmploymentText: "Discover online job listings approved by our managers.",
    onlineEmploymentEmpty: "There are no validated online jobs yet. Check back soon.",
    onlineEmploymentSeeAll: "View all online jobs",
    companyListingsKicker: "NOÉ BUSINESS",
    companyListingsTitle: "Validated companies",
    companyListingsText: "Discover companies featured and approved by our managers.",
    companyListingsEmpty: "There are no validated companies yet. Check back soon.",
    companyListingsSeeAll: "View all companies",
    motto: ["Train", "Innovate", "Build", "Create jobs"],
    pillarsKicker: "Available now",
    pillarsTitle: "Three modules to launch",
    pillarCta: "Explore",
    pillars: [
      ["NOÉ TALENTS", "A skills portfolio: profile, CV, diplomas, experience and a professional ID.", "/talents"],
      ["NOÉ JOBS", "Jobs, internships, missions, one-click applications and hiring follow-up.", "/emplois"],
      ["NOÉ BUSINESS", "A company account, published needs and a meeting place with talent.", "/entreprises"],
    ],
    pathKicker: "Journeys",
    pathTitle: "Two journeys, one platform",
    youngKicker: "Candidate",
    young: "Graduate",
    youngSteps: ["Sign up", "Profile and CV", "Recommendations", "Application", "Hiring"],
    companyKicker: "Employer",
    company: "Company",
    companySteps: ["Verified account", "Publish", "Shortlist", "Interview", "Confirmation"],
    nextKicker: "Roadmap",
    nextTitle: "The rest of the value chain",
    modules: "All modules",
    ctaTitle: "Your professional identity starts here",
    ctaText: "One account for the profile, the CV and applications. Companies publish their needs on the same platform.",
    next: [
      ["NOÉ PROJECTS", "Version 2", "Turn an idea into a structured project."],
      ["NOÉ MARKETS", "Version 2", "Tenders, quotes and subcontracting."],
      ["NOÉ JOB ACADEMY", "Version 2", "Courses, quizzes and verifiable certificates."],
      ["NOÉ INVEST", "Version 3", "Introductions only, within the authorized scope."],
      ["NOÉ INTELLIGENCE", "Version 3", "Aggregated and anonymized indicators."],
    ],
  },
} as const;

type HomeOpportunity = {
  id: string;
  title: string;
  description: string;
  validFrom: Date;
  validUntil: Date;
  location: string | null;
};

export function HomeView({
  locale,
  opportunities = [],
  employmentPosts = [],
  formations = [],
  examsConcours = [],
  onlineEmploymentPosts = [],
  companyListings = [],
  managerControls = false,
}: {
  locale: "fr" | "en";
  jobs?: React.ReactNode;
  opportunities?: HomeOpportunity[];
  employmentPosts?: EmploymentPostCardData[];
  formations?: PublicTrainingCardData[];
  examsConcours?: PublicExamConcoursCardData[];
  onlineEmploymentPosts?: PublicOnlineEmploymentCardData[];
  companyListings?: PublicManagerCompanyCardData[];
  managerControls?: boolean;
}) {
  const t = copy[locale];
  return (
    <div
      className="flex min-h-full flex-col bg-paper"
      style={{
        background:
          "radial-gradient(ellipse at 7% 36%, rgb(20 138 60 / 7%), transparent 26rem), radial-gradient(ellipse at 92% 61%, rgb(26 142 200 / 8%), transparent 28rem), linear-gradient(180deg, #f8fafc 0%, #fff 48%, #f1f7f4 100%)",
      }}
    >
      <SiteHeader locale={locale} overlay />
      <section className="hero">
        <div className="hero-photo">
          <Image
            src="/brand/siege.jpg"
            alt={locale === "fr" ? "Siège NOÉ WORK BANK" : "NOÉ WORK BANK headquarters"}
            fill
            priority
            className="object-cover object-[center_40%]"
            sizes="100vw"
          />
        </div>
        <div className="hero-veil" />
        <div className="hero-copy">
          <div className="hero-brand hero-in" style={{ animationDelay: "0.15s" }}>
            <span className="hero-orbit" aria-hidden />
            <Logo size={76} priority />
            <p className="text-xs font-bold tracking-[0.22em] text-gold">NOÉ WORK BANK</p>
          </div>
          <p className="hero-in text-sm font-semibold text-white/80" style={{ animationDelay: "0.32s" }}>
            {t.kicker}
          </p>
          <h1 className="display hero-title">
            {t.title.split(" ").map((word, index) => (
              <span key={`${word}-${index}`} className="hero-word" style={{ animationDelay: `${0.48 + index * 0.12}s` }}>
                {word}{" "}
              </span>
            ))}
          </h1>
          <span className="hero-rule" />
          <p className="hero-in mt-5 max-w-xl text-lg leading-8 text-white/85" style={{ animationDelay: "1.05s" }}>
            {t.text}
          </p>
          <div className="hero-actions">
            <Link className="btn btn-gold hero-in" href="/sign-up" style={{ animationDelay: "1.22s" }}>
              {t.account}
            </Link>
            <Link className="btn btn-white hero-in" href="/emplois" style={{ animationDelay: "1.34s" }}>
              {t.jobs}
            </Link>
          </div>
        </div>
      </section>
      <section className="motto" aria-label={locale === "fr" ? "Devise" : "Motto"}>
        <ol className="motto-list">
          {t.motto.map((item, index) => (
            <li key={item} className="motto-item hero-in" style={{ animationDelay: `${1.45 + index * 0.08}s` }}>
              <span className="motto-index" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="motto-word">{item}</span>
            </li>
          ))}
        </ol>
      </section>

      <section
        id="opportunites"
        className="px-4 py-14 sm:px-8 sm:py-18"
        style={{
          background:
            "radial-gradient(ellipse at 8% 12%, rgb(20 138 60 / 10%), transparent 26rem), linear-gradient(145deg, #f2faf4 0%, #e9f5ed 100%)",
        }}
      >
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold tracking-[0.18em] text-green uppercase">{t.opportunityKicker}</p>
              <h2 className="display mt-2 text-3xl text-navy sm:text-4xl">{t.opportunityTitle}</h2>
              <p className="mt-2 text-sm leading-6 text-ink/65">{t.opportunityText}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
              {opportunities.length > 0 ? <span className="chip">{opportunities.length}</span> : null}
              <Link
                href="/opportunités"
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-white px-4 text-sm font-bold text-blue shadow-sm transition hover:border-blue/30 hover:bg-blue/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
              >
                {t.opportunitySeeAll}
                <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-4">
                  <path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>

          {opportunities.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {opportunities.map((opportunity) => (
                <Link
                  key={opportunity.id}
                  href={`/opportunites/${opportunity.id}`}
                  aria-label={`${t.opportunityLink} : ${opportunity.title}`}
                  className="card group flex min-w-0 flex-col overflow-hidden p-5 transition duration-200 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue sm:p-6"
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green/10 px-2.5 py-1 text-[11px] font-bold text-leaf">
                      <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-3.5">
                        <path d="m4 10 4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {t.validated}
                    </span>
                    <span className="grid size-9 place-items-center rounded-xl bg-paper text-green transition group-hover:bg-green/10">
                      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 3v3m10-3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13H4V6a1 1 0 0 1 1-1Z" />
                      </svg>
                    </span>
                  </div>

                  <h3 className="break-words text-xl font-bold leading-snug text-navy transition group-hover:text-blue">
                    {opportunity.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-ink/65">{opportunity.description}</p>

                  <div className="mt-5 grid gap-2 border-t border-line pt-4 text-xs text-ink/65">
                    <p className="flex items-start gap-2">
                      <span className="shrink-0 font-semibold text-navy">{locale === "fr" ? "Période :" : "Period:"}</span>
                      <time dateTime={opportunity.validFrom.toISOString().slice(0, 10)}>{formatDate(opportunity.validFrom)}</time>
                      <span aria-hidden="true">–</span>
                      <time dateTime={opportunity.validUntil.toISOString().slice(0, 10)}>{formatDate(opportunity.validUntil)}</time>
                    </p>
                    {opportunity.location ? (
                      <p className="flex items-start gap-2">
                        <span className="shrink-0 font-semibold text-navy">{locale === "fr" ? "Lieu :" : "Location:"}</span>
                        <span className="break-words">{opportunity.location}</span>
                      </p>
                    ) : null}
                  </div>

                  <span className="mt-auto flex items-center gap-2 pt-5 text-sm font-bold text-blue">
                    {t.opportunityLink}
                    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-4 transition-transform group-hover:translate-x-1">
                      <path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="card flex flex-col items-center px-5 py-10 text-center sm:py-14">
              <span className="grid size-12 place-items-center rounded-2xl bg-green/10 text-green">
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 3v3m10-3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13H4V6a1 1 0 0 1 1-1Z" />
                </svg>
              </span>
              <p className="mt-4 max-w-md text-sm leading-6 text-ink/65">{t.opportunityEmpty}</p>
            </div>
          )}
        </div>
      </section>

      <section
        id="emplois-et-stages"
        className="px-4 py-14 sm:px-8 sm:py-18"
        style={{
          background:
            "radial-gradient(ellipse at 92% 18%, rgb(26 142 200 / 10%), transparent 28rem), linear-gradient(150deg, #f5f9ff 0%, #eaf2fc 100%)",
        }}
      >
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold tracking-[0.18em] text-green uppercase">{t.employmentKicker}</p>
              <h2 className="display mt-2 text-3xl text-navy sm:text-4xl">{t.employmentTitle}</h2>
              <p className="mt-2 text-sm leading-6 text-ink/65">{t.employmentText}</p>
            </div>
            <Link
              href="/emplois-et-stages"
              className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-full border border-line bg-white px-4 text-sm font-bold text-blue shadow-sm transition hover:border-blue/30 hover:bg-blue/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue sm:self-auto"
            >
              {t.employmentSeeAll}
              <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-4">
                <path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          {employmentPosts.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {employmentPosts.map((post) => (
                <EmploymentPostCard key={post.id} post={post} compact />
              ))}
            </div>
          ) : (
            <div className="card px-5 py-10 text-center sm:py-14">
              <p className="text-sm leading-6 text-ink/65">{t.employmentEmpty}</p>
            </div>
          )}
        </div>
      </section>



      <section
        id="formations"
        className="px-4 py-14 sm:px-8 sm:py-18"
        style={{
          background:
            "radial-gradient(ellipse at 10% 12%, rgb(227 155 26 / 12%), transparent 26rem), linear-gradient(140deg, #fffaf0 0%, #f8efd9 100%)",
        }}
      >
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold tracking-[0.18em] text-green uppercase">{t.trainingKicker}</p>
              <h2 className="display mt-2 text-3xl text-navy sm:text-4xl">{t.trainingTitle}</h2>
              <p className="mt-2 text-sm leading-6 text-ink/65">{t.trainingText}</p>
            </div>
            <Link
              href="/formations"
              className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-full border border-line bg-white px-4 text-sm font-bold text-blue shadow-sm transition hover:border-blue/30 hover:bg-blue/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue sm:self-auto"
            >
              {t.trainingSeeAll}
              <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-4">
                <path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          {formations.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {formations.map((training) => (
                <PublicTrainingCard key={training.id} training={training} />
              ))}
            </div>
          ) : (
            <div className="card px-5 py-10 text-center sm:py-14">
              <p className="text-sm leading-6 text-ink/65">{t.trainingEmpty}</p>
            </div>
          )}
        </div>
      </section>

      <section
        id="examens-concours"
        className="px-4 py-14 sm:px-8 sm:py-18"
        style={{
          background:
            "radial-gradient(ellipse at 90% 14%, rgb(102 88 190 / 10%), transparent 28rem), linear-gradient(145deg, #f7f6ff 0%, #eeedfb 100%)",
        }}
      >
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold tracking-[0.18em] text-green uppercase">{t.examConcoursKicker}</p>
              <h2 className="display mt-2 text-3xl text-navy sm:text-4xl">{t.examConcoursTitle}</h2>
              <p className="mt-2 text-sm leading-6 text-ink/65">{t.examConcoursText}</p>
            </div>
            <Link
              href="/concours-examens"
              className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-full border border-line bg-white px-4 text-sm font-bold text-blue shadow-sm transition hover:border-blue/30 hover:bg-blue/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue sm:self-auto"
            >
              {t.examConcoursSeeAll}
              <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-4">
                <path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          {examsConcours.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {examsConcours.map((item) => (
                <PublicExamConcoursCard key={item.id} item={item} managerControls={managerControls} />
              ))}
            </div>
          ) : (
            <div className="card px-5 py-10 text-center sm:py-14">
              <p className="text-sm leading-6 text-ink/65">{t.examConcoursEmpty}</p>
            </div>
          )}
        </div>
      </section>

      <section
        id="emplois-en-ligne"
        className="px-4 py-14 sm:px-8 sm:py-18"
        style={{
          background:
            "radial-gradient(ellipse at 9% 12%, rgb(26 142 200 / 10%), transparent 26rem), linear-gradient(145deg, #effbfa 0%, #e3f5f2 100%)",
        }}
      >
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold tracking-[0.18em] text-green uppercase">{t.onlineEmploymentKicker}</p>
              <h2 className="display mt-2 text-3xl text-navy sm:text-4xl">{t.onlineEmploymentTitle}</h2>
              <p className="mt-2 text-sm leading-6 text-ink/65">{t.onlineEmploymentText}</p>
            </div>
            <Link
              href="/emploi-en-ligne"
              className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-full border border-line bg-white px-4 text-sm font-bold text-blue shadow-sm transition hover:border-blue/30 hover:bg-blue/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue sm:self-auto"
            >
              {t.onlineEmploymentSeeAll}
              <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-4">
                <path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          {onlineEmploymentPosts.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {onlineEmploymentPosts.map((post) => (
                <PublicOnlineEmploymentCard key={post.id} post={post} managerControls={managerControls} />
              ))}
            </div>
          ) : (
            <div className="card px-5 py-10 text-center sm:py-14">
              <p className="text-sm leading-6 text-ink/65">{t.onlineEmploymentEmpty}</p>
            </div>
          )}
        </div>
      </section>

      <section
        id="entreprises"
        className="relative isolate overflow-hidden px-4 py-14 text-white sm:px-8 sm:py-18"
        style={{
          background:
            "radial-gradient(ellipse at 82% 18%, rgb(26 142 200 / 48%), transparent 32rem), radial-gradient(ellipse at 10% 100%, rgb(20 138 60 / 40%), transparent 34rem), linear-gradient(128deg, #062957 0%, #0b427d 53%, #084d37 100%)",
        }}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-36 -top-72 z-0 size-[42rem] rounded-full border border-white/10"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-28 -top-64 z-0 size-[38rem] rounded-full border border-white/5"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-80 left-[12%] z-0 size-[38rem] rounded-full border border-white/10"
        />
        <div className="relative z-10 mx-auto w-full max-w-6xl">
          <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold tracking-[0.18em] text-gold uppercase">{t.companyListingsKicker}</p>
              <h2 className="display mt-2 text-3xl text-white sm:text-4xl">{t.companyListingsTitle}</h2>
              <p className="mt-2 text-sm leading-6 text-white/75">{t.companyListingsText}</p>
            </div>
            <Link
              href="/entreprises"
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 self-start rounded-full border border-white/25 bg-white/10 px-4 text-sm font-bold text-white shadow-sm transition hover:border-white/40 hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:w-auto sm:self-auto"
            >
              {t.companyListingsSeeAll}
              <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-4">
                <path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          {companyListings.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {companyListings.map((company) => (
                <PublicManagerCompanyCard key={company.id} company={company} managerControls={managerControls} />
              ))}
            </div>
          ) : (
            <div className="card px-5 py-10 text-center sm:py-14">
              <p className="text-sm leading-6 text-ink/65">{t.companyListingsEmpty}</p>
            </div>
          )}
        </div>
      </section>


      <section
        className="px-4 py-16 sm:px-8"
        style={{
          background:
            "radial-gradient(ellipse at 90% 50%, rgb(227 155 26 / 15%), transparent 30rem), linear-gradient(135deg, #fff9ee 0%, #f4efe5 100%)",
        }}
      >
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 rounded-[1.75rem] bg-navy px-6 py-10 text-white sm:px-10 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-bold tracking-[0.2em] text-gold uppercase">{t.kicker}</p>
            <h2 className="display mt-2 text-3xl sm:text-4xl">{t.ctaTitle}</h2>
            <p className="mt-3 text-sm leading-6 text-white/75">{t.ctaText}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link className="btn btn-gold" href="/sign-up">
              {t.account}
            </Link>
            <Link className="btn btn-white" href="/emplois">
              {t.jobs}
            </Link>
          </div>
        </div>
      </section>
      <SiteFooter locale={locale} />
    </div>
  );
}
