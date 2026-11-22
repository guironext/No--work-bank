"use client";

import { useEffect, useRef, useState, useTransition, type FormEvent } from "react";
import { createManagerExamConcours } from "@/lib/actions";

export function ManagerExamConcoursDialog() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  function close() {
    if (pending) return;
    setOpen(false);
    setError("");
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setError("");
    setSaved(false);
    startTransition(async () => {
      const result = await createManagerExamConcours(formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      formRef.current?.reset();
      setOpen(false);
      setSaved(true);
    });
  }

  return (
    <>
      <div className="flex flex-col items-stretch gap-3 sm:items-end">
        <button
          type="button"
          className="btn btn-gold min-h-12 w-full gap-3 rounded-2xl px-5 shadow-lg shadow-gold/20 transition hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:w-auto sm:rounded-full"
          onClick={() => {
            setError("");
            setSaved(false);
            setOpen(true);
          }}
        >
          <span aria-hidden="true" className="grid size-7 place-items-center rounded-full bg-navy/10 text-lg leading-none">+</span>
          Ajouter Examen ou Concours
        </button>
        {saved ? (
          <p role="status" className="flex items-center gap-2 text-sm font-medium text-leaf">
            <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-4">
              <path d="m4 10 4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Examen ou concours enregistré avec succès.
          </p>
        ) : null}
      </div>

      <dialog
        ref={dialogRef}
        aria-labelledby="manager-exam-title"
        aria-describedby="manager-exam-description"
        className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-hidden border-0 bg-transparent p-0 text-left backdrop:bg-navy/70 backdrop:backdrop-blur-sm"
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        onClose={() => setOpen(false)}
      >
        <div
          className="flex h-full items-end justify-center sm:items-center sm:p-5"
          onClick={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <section className="relative flex max-h-[96dvh] w-full max-w-3xl flex-col overflow-hidden rounded-t-[1.75rem] border border-white/80 bg-white shadow-2xl shadow-navy/30 sm:max-h-[min(92dvh,900px)] sm:rounded-[1.75rem]">
            <div aria-hidden="true" className="absolute inset-x-0 top-0 z-10 h-1.5 bg-gradient-to-r from-green via-blue to-gold" />
            <header className="flex shrink-0 items-start gap-3 border-b border-line/80 px-4 pb-4 pt-6 sm:gap-4 sm:px-7 sm:pb-5 sm:pt-7">
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-green/10 text-green sm:size-12">
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                  <circle cx="12" cy="12" r="9" />
                </svg>
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold tracking-[0.18em] text-green uppercase sm:text-xs">Espace Manager · Publication</p>
                <h2 id="manager-exam-title" className="display mt-1 text-[1.55rem] leading-tight text-navy sm:text-3xl">Ajouter un examen ou concours</h2>
                <p id="manager-exam-description" className="mt-1.5 text-xs leading-5 text-ink/60 sm:text-sm sm:leading-6">
                  Complétez les informations principales. Le ministère et le document sont facultatifs.
                </p>
              </div>
              <button
                type="button"
                aria-label="Fermer la fenêtre"
                className="grid size-11 shrink-0 place-items-center rounded-2xl border border-line/80 text-2xl leading-none text-ink/55 transition hover:bg-paper hover:text-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
                disabled={pending}
                onClick={close}
              >
                ×
              </button>
            </header>

            <form ref={formRef} className="flex min-h-0 flex-1 flex-col" onSubmit={submit}>
              <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-4 sm:space-y-5 sm:px-7 sm:py-6">
                <section aria-labelledby="manager-exam-main-fields" className="grid gap-4 rounded-2xl border border-line/80 bg-paper/55 p-4 sm:gap-5 sm:p-5">
                  <div className="flex items-start gap-3">
                    <span aria-hidden="true" className="grid size-7 shrink-0 place-items-center rounded-lg bg-white text-xs font-bold text-navy shadow-sm">01</span>
                    <div>
                      <h3 id="manager-exam-main-fields" className="text-sm font-bold text-navy sm:text-base">Informations principales</h3>
                      <p className="mt-0.5 text-xs leading-5 text-ink/55">Les champs marqués d’un astérisque sont obligatoires.</p>
                    </div>
                  </div>

                  <label className="field">
                    <span>Titre <strong aria-hidden="true" className="text-red-600">*</strong></span>
                    <input name="title" required maxLength={180} placeholder="Ex. Concours d’entrée à l’ENA" className="min-h-12" />
                  </label>

                  <label className="field">
                    <span>Type <strong aria-hidden="true" className="text-red-600">*</strong></span>
                    <select name="type" required defaultValue="" className="min-h-12">
                      <option value="" disabled>Choisir un type</option>
                      <option value="examen">Examen</option>
                      <option value="concours">Concours</option>
                    </select>
                  </label>

                  <fieldset className="grid gap-3">
                    <legend className="mb-1 text-sm font-semibold text-navy">Période de validité <strong aria-hidden="true" className="text-red-600">*</strong></legend>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="field">
                        <span>Du</span>
                        <input name="validFrom" type="date" required className="min-h-12" />
                      </label>
                      <label className="field">
                        <span>Au</span>
                        <input name="validUntil" type="date" required className="min-h-12" />
                      </label>
                    </div>
                  </fieldset>

                  <label className="field">
                    <span>Description <strong aria-hidden="true" className="text-red-600">*</strong></span>
                    <textarea name="description" required maxLength={5000} rows={5} placeholder="Présentez les conditions et les informations importantes…" className="min-h-32" />
                  </label>
                </section>

                <section aria-labelledby="manager-exam-optional-fields" className="grid gap-4 rounded-2xl border border-line/80 bg-white p-4 sm:gap-5 sm:p-5">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 id="manager-exam-optional-fields" className="text-sm font-bold text-navy sm:text-base">Informations complémentaires</h3>
                      <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-bold tracking-wide text-[#82570d] uppercase">Facultatif</span>
                    </div>
                    <p className="mt-0.5 text-xs leading-5 text-ink/55">Ajoutez le ministère concerné et joignez un document si disponible.</p>
                  </div>
                  <label className="field">
                    <span>Ministère</span>
                    <input name="ministry" maxLength={180} placeholder="Ex. Ministère de la Fonction publique" className="min-h-12" />
                  </label>
                  <label className="field">
                    <span>Document</span>
                    <input
                      name="document"
                      type="file"
                      accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png,image/webp,.pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
                      className="block min-h-12 w-full rounded-xl border border-line bg-white p-2 text-sm text-ink file:mr-3 file:rounded-lg file:border-0 file:bg-green/10 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-leaf"
                    />
                    <span className="text-xs leading-5 text-ink/55">PDF, Word, JPG, PNG ou WEBP · 6 Mo maximum</span>
                  </label>
                </section>

                {error ? (
                  <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-sm leading-5 text-red-800">{error}</p>
                ) : null}
              </div>

              <footer className="grid shrink-0 grid-cols-2 gap-3 border-t border-line/80 bg-white/95 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur sm:flex sm:justify-end sm:px-7 sm:py-5">
                <button type="button" className="btn btn-ghost min-h-12 w-full rounded-2xl px-3 sm:w-auto sm:rounded-full sm:px-5" disabled={pending} onClick={close}>
                  Annuler
                </button>
                <button type="submit" className="btn btn-green min-h-12 w-full gap-2 rounded-2xl px-3 sm:w-auto sm:rounded-full sm:px-6" disabled={pending} aria-busy={pending}>
                  {pending ? "Enregistrement…" : "Enregistrer"}
                </button>
              </footer>
            </form>
          </section>
        </div>
      </dialog>
    </>
  );
}
