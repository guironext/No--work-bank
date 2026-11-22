"use client";

import { useState, useTransition } from "react";
import { validateEmploymentPost } from "@/lib/actions";

export function AdminEmploymentValidation({
  id,
  title,
  initiallyValidated,
}: {
  id: string;
  title: string;
  initiallyValidated: boolean;
}) {
  const [validated, setValidated] = useState(initiallyValidated);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function validate() {
    setError("");
    startTransition(async () => {
      const result = await validateEmploymentPost(id);
      if (result.error) {
        setError(result.error);
        return;
      }
      setValidated(true);
    });
  }

  return (
    <footer className="mt-4 border-t border-line/80 pt-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className={`text-sm font-bold ${validated ? "text-leaf" : "text-[#82570d]"}`}>
            {validated ? "Validée" : "À valider"}
          </p>
          <p className="mt-0.5 text-xs text-ink/55">
            {validated ? "Cette offre est active." : "Validez cette offre pour l’activer."}
          </p>
        </div>
        <button
          type="button"
          aria-label={validated ? `Offre déjà validée : ${title}` : `Valider l’offre : ${title}`}
          title={validated ? "Déjà validée" : "Valider l’offre"}
          className={`inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border px-3 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green disabled:cursor-not-allowed disabled:opacity-55 ${validated ? "border-green/20 bg-green/10 text-green" : "border-line bg-white text-ink/60 hover:border-green/30 hover:bg-green/5 hover:text-green"}`}
          disabled={pending || validated}
          onClick={validate}
        >
          {pending ? (
            <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
          ) : (
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m5 12 4 4L19 6" />
              <circle cx="12" cy="12" r="9" />
            </svg>
          )}
          {pending ? "Validation…" : validated ? "Validée" : "Valider"}
        </button>
      </div>
      {error ? (
        <p role="alert" className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      ) : null}
    </footer>
  );
}
