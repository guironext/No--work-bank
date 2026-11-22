import Link from "next/link";

export const metadata = { title: "Espace Manager" };

const modules = [
  {
    number: "01",
    category: "Découvrir",
    title: "Opportunités",
    description: "Repérez les pistes et projets adaptés à vos objectifs.",
    href: "/manager/opportunites",
    accent: "bg-green/10 text-green",
  },
  {
    number: "02",
    category: "Travailler",
    title: "Offres d'emplois et stages",
    description: "Consultez les offres et préparez vos prochaines candidatures.",
    href: "/manager/emplois-stages",
    accent: "bg-blue/10 text-blue",
  },
  {
    number: "03",
    category: "Se préparer",
    title: "Examens et Concours",
    description: "Retrouvez les examens, concours et échéances à venir.",
    href: "/manager/examen-concours",
    accent: "bg-gold/15 text-[#8a5b08]",
  },
  {
    number: "04",
    category: "Progresser",
    title: "Formation",
    description: "Explorez des parcours pour renforcer vos compétences.",
    href: "/manager/formation",
    accent: "bg-navy/10 text-navy",
  },
];

export default function ManagerHomePage() {
  return (
    <div className="mx-auto grid w-full max-w-6xl gap-5 sm:gap-8">
      <section className="relative isolate overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-navy via-blue to-[#0c6b30] p-4 text-white shadow-xl shadow-navy/10 sm:rounded-[2rem] sm:p-8 xl:p-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full border border-white/10 sm:size-80"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-8 -top-12 size-44 rounded-full border border-white/10 sm:size-56"
        />

        <div className="relative grid gap-5 sm:gap-7 lg:grid-cols-[minmax(0,1.3fr)_minmax(13rem,0.7fr)] lg:items-end">
          <div>
            <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold tracking-[0.16em] text-[#f3c56a] uppercase">
              Espace Manager
            </p>
            <h1 className="display mt-4 max-w-2xl text-2xl leading-tight sm:text-4xl xl:text-5xl">
              Faites avancer les projets qui comptent.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/75 sm:text-base">
              Retrouvez vos opportunités, offres d’emploi et de stage, concours et formations depuis un espace pensé
              pour vous aider à passer à l’action.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/manager/opportunites" className="btn btn-gold w-full justify-center px-3 text-center sm:w-auto sm:px-5">
                Explorer les opportunités
              </Link>
              <Link href="/manager/emplois-stages" className="btn btn-white w-full justify-center px-3 text-center sm:w-auto sm:px-5">
                Voir les offres
              </Link>
            </div>
          </div>


        </div>
      </section>

      <section aria-labelledby="manager-modules-title" className="grid gap-4">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold tracking-[0.16em] text-green uppercase">Accès rapide</p>
            <h2 id="manager-modules-title" className="mt-1 text-xl font-bold text-navy sm:text-2xl">
              Vos espaces de travail
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-ink/65">
            Choisissez un domaine pour découvrir les ressources et prochaines étapes.
          </p>
        </header>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {modules.map((module) => (
            <Link
              key={module.number}
              href={module.href}
              className="group card flex min-w-0 flex-col p-3 transition duration-200 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green sm:p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <span className={`grid size-11 shrink-0 place-items-center rounded-2xl text-sm font-bold ${module.accent}`}>
                  {module.number}
                </span>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="size-5 text-ink/40 transition group-hover:translate-x-1 group-hover:text-green"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
                </svg>
              </div>
              <p className="mt-5 text-xs font-bold tracking-[0.12em] text-green uppercase">{module.category}</p>
              <h3 className="mt-2 text-lg font-bold leading-snug text-navy">{module.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-ink/65">{module.description}</p>
              <span className="mt-5 text-sm font-semibold text-navy group-hover:text-green">Découvrir</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-3xl border border-line bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="min-w-0">
          <p className="text-xs font-bold tracking-[0.16em] text-green uppercase">Un espace à votre rythme</p>
          <h2 className="mt-1 text-base font-bold text-navy sm:text-lg">Une prochaine étape commence par une découverte.</h2>
          <p className="mt-1 text-sm leading-6 text-ink/65">
            Parcourez les rubriques et choisissez celle qui correspond à votre priorité du moment.
          </p>
        </div>
        <Link href="/manager/formation" className="btn btn-ghost w-full shrink-0 justify-center sm:w-auto">
          Voir les formations
        </Link>
      </section>
    </div>
  );
}
