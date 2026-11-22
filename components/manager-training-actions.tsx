"use client";

import { useState, useTransition } from "react";
import { deleteManagerTraining, validateManagerTraining } from "@/lib/actions";

export function ManagerTrainingActions({
  id,
  title,
  initiallyValidated,
}: {
  id: string;
  title: string;
  initiallyValidated: boolean;
}) {
  const [validated, setValidated] = useState(initiallyValidated);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function validate() {
    setError("");
    startTransition(async () => {
      const result = await validateManagerTraining(id);
      if (result.error) {
        setError(result.error);
        return;
      }
      setValidated(true);
    });
  }

  function remove() {
    setError("");
    startTransition(async () => {
      const result = await deleteManagerTraining(id);
      if (result.error) {
        setError(result.error);
        return;
      }
    });
  }

  return (
    <footer className="mt-5 shrink-0 border-t border-line/80 pt-4">
      {confirmingDelete ? (
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <div className="min-w-0">
            <p className="text-sm font-bold text-navy">Supprimer cette formation ?</p>
            <p className="mt-1 break-words text-xs leading-5 text-ink/60">
              « {title} » sera supprimée définitivement.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex">
            <button
              type="button"
              className="btn btn-ghost min-h-11 rounded-xl px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue sm:w-auto"
              disabled={pending}
              onClick={() => {
                setConfirmingDelete(false);
                setError("");
              }}
            >
              Annuler
            </button>
            <button
              type="button"
              className="btn min-h-11 rounded-xl bg-red-700 px-3 text-sm hover:bg-red-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700 sm:w-auto"
              disabled={pending}
              onClick={remove}
            >
              {pending ? "Suppression…" : "Supprimer"}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3" role="status" aria-live="polite">
            <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${validated ? "bg-green/10 text-green" : "bg-gold/15 text-[#82570d]"}`}>
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5">
                {validated ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="m5 12 4 4L19 6" />
                ) : (
                  <>
                    <circle cx="12" cy="12" r="9" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 2" />
                  </>
                )}
              </svg>
            </span>
            <div>
              <p className={`text-sm font-bold ${validated ? "text-leaf" : "text-navy"}`}>
                {validated ? "Validée" : "À valider"}
              </p>
              <p className="mt-0.5 text-xs text-ink/55">
                {validated ? "Cette formation a été confirmée." : "Validez cette formation pour la confirmer."}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              aria-label={validated ? `Formation déjà validée : ${title}` : `Valider la formation : ${title}`}
              title={validated ? "Déjà validée" : "Valider la formation"}
              className={`grid size-11 shrink-0 place-items-center rounded-xl border transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green disabled:cursor-not-allowed disabled:opacity-55 ${validated ? "border-green/20 bg-green/10 text-green" : "border-line bg-white text-ink/60 hover:border-green/30 hover:bg-green/5 hover:text-green"}`}
              disabled={pending || validated}
              onClick={validate}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m5 12 4 4L19 6" />
                <circle cx="12" cy="12" r="9" />
              </svg>
            </button>
            <button
              type="button"
              aria-label={`Supprimer la formation : ${title}`}
              title="Supprimer la formation"
              className="grid size-11 shrink-0 place-items-center rounded-xl border border-red-200 bg-white text-red-700 transition hover:border-red-300 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700 disabled:cursor-wait disabled:opacity-60"
              disabled={pending}
              onClick={() => {
                setError("");
                setConfirmingDelete(true);
              }}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16m-10 4v6m4-6v6M6 7l1 13h10l1-13M9 7V4h6v3" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {error ? (
        <p role="alert" className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      ) : null}
    </footer>
  );
}
