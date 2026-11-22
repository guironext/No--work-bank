"use client";

import { useEffect, useRef, useState, useTransition, type FormEvent } from "react";
import { createManagerOpportunity } from "@/lib/actions";

export function ManagerOpportunityDialog() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();
  const dialogRef = useRef<HTMLDialogElement>(null);

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
      const result = await createManagerOpportunity(formData);
      if (result.error) {
        setError(result.error);
        return;
      }
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
          Créer une Opportunité
        </button>
        {saved ? (
          <p role="status" className="flex items-center gap-2 text-sm font-medium text-leaf">
            <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-4">
              <path d="m4 10 4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Opportunité créée avec succès.
          </p>
        ) : null}
      </div>

      <dialog
        ref={dialogRef}
        aria-labelledby="manager-opportunity-title"
        aria-describedby="manager-opportunity-description"
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
            <div aria-hidden="true" className="absolute inset-x-0 top-0 z-10 h-1.5 bg-gradient-to-r from-green via-sky to-gold" />

            <header className="flex shrink-0 items-start gap-3 border-b border-line/80 bg-white px-4 pb-4 pt-6 sm:gap-4 sm:px-7 sm:pb-5 sm:pt-7">
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-green/10 text-green sm:size-12">
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                  <circle cx="12" cy="12" r="9" />
                </svg>
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold tracking-[0.18em] text-green uppercase sm:text-xs">
                  Espace Manager · Publication
                </p>
                <h2 id="manager-opportunity-title" className="display mt-1 text-[1.65rem] leading-tight text-navy sm:text-3xl">
                  Créer une opportunité
                </h2>
                <p id="manager-opportunity-description" className="mt-1.5 max-w-xl text-xs leading-5 text-ink/60 sm:text-sm sm:leading-6">
                  Partagez une nouvelle occasion avec votre communauté. Les champs marqués d’un astérisque sont obligatoires.
                </p>
              </div>
              <button
                type="button"
                aria-label="Fermer la fenêtre"
                className="grid size-11 shrink-0 place-items-center rounded-2xl border border-line/80 bg-white text-2xl leading-none text-ink/55 transition hover:border-line hover:bg-paper hover:text-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
                disabled={pending}
                onClick={close}
              >
                ×
              </button>
            </header>

            <form className="flex min-h-0 flex-1 flex-col" onSubmit={submit}>
              <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-4 sm:space-y-5 sm:px-7 sm:py-6">
                <section aria-labelledby="opportunity-main-fields" className="grid gap-4 rounded-2xl border border-line/80 bg-paper/55 p-4 sm:gap-5 sm:p-5">
                  <div className="flex items-start gap-3">
                    <span aria-hidden="true" className="grid size-7 shrink-0 place-items-center rounded-lg bg-white text-xs font-bold text-navy shadow-sm">01</span>
                    <div>
                      <h3 id="opportunity-main-fields" className="text-sm font-bold text-navy sm:text-base">Informations principales</h3>
                      <p className="mt-0.5 text-xs leading-5 text-ink/55">Présentez clairement l’opportunité et ses dates.</p>
                    </div>
                  </div>

                  <label className="field">
                    <span>Titre <strong aria-hidden="true" className="text-red-600">*</strong></span>
                    <input
                      name="title"
                      required
                      maxLength={160}
                      placeholder="Ex. Bourse d’excellence 2026"
                      className="min-h-12"
                    />
                  </label>

                  <fieldset className="grid gap-3">
                    <legend className="mb-1 text-sm font-semibold text-navy">
                      Période de validité <strong aria-hidden="true" className="text-red-600">*</strong>
                    </legend>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="field">
                        <span>Début</span>
                        <input name="validFrom" type="date" required className="min-h-12" />
                      </label>
                      <label className="field">
                        <span>Fin</span>
                        <input name="validUntil" type="date" required className="min-h-12" />
                      </label>
                    </div>
                  </fieldset>

                  <label className="field">
                    <span>Description <strong aria-hidden="true" className="text-red-600">*</strong></span>
                    <textarea
                      name="description"
                      required
                      maxLength={5000}
                      rows={4}
                      placeholder="Décrivez l’opportunité, les conditions de participation et les informations utiles…"
                      className="min-h-28"
                    />
                    <p className="text-xs leading-5 text-ink/50">Soyez précis pour aider les candidats à comprendre cette opportunité.</p>
                  </label>
                </section>

                <section aria-labelledby="opportunity-extra-fields" className="grid gap-4 rounded-2xl border border-line/80 bg-white p-4 sm:gap-5 sm:p-5">
                  <div className="flex items-start gap-3">
                    <span aria-hidden="true" className="grid size-7 shrink-0 place-items-center rounded-lg bg-paper text-xs font-bold text-ink/60">02</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 id="opportunity-extra-fields" className="text-sm font-bold text-navy sm:text-base">Informations complémentaires</h3>
                        <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-bold tracking-wide text-[#82570d] uppercase">Facultatif</span>
                      </div>
                      <p className="mt-0.5 text-xs leading-5 text-ink/55">Ajoutez des détails pratiques si vous en disposez.</p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="field">
                      <span>Lieu <em className="ml-1 text-xs font-normal not-italic text-ink/45">facultatif</em></span>
                      <input name="location" maxLength={180} placeholder="Ville ou lieu de l’événement" className="min-h-12" />
                    </label>
                    <label className="field">
                      <span>Contact <em className="ml-1 text-xs font-normal not-italic text-ink/45">facultatif</em></span>
                      <input name="contact" maxLength={180} placeholder="E-mail ou téléphone" className="min-h-12" />
                    </label>
                  </div>

                  <label className="field">
                    <span>Lien d’inscription <em className="ml-1 text-xs font-normal not-italic text-ink/45">facultatif</em></span>
                    <input
                      name="registrationLink"
                      type="url"
                      maxLength={1000}
                      placeholder="https://exemple.com/inscription"
                      className="min-h-12"
                    />
                  </label>

                  <label className="field">
                    <span>Personnes à contacter <em className="ml-1 text-xs font-normal not-italic text-ink/45">facultatif</em></span>
                    <textarea
                      name="contactPeople"
                      maxLength={1200}
                      rows={3}
                      placeholder="Nom, fonction et coordonnées"
                      className="min-h-24"
                    />
                  </label>
                </section>

                {error ? (
                  <p role="alert" className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-sm leading-5 text-red-800">
                    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="mt-0.5 size-4 shrink-0">
                      <path d="M10 6v4m0 3h.01M8.27 3.86 1.94 14.5A1.7 1.7 0 0 0 3.4 17h13.2a1.7 1.7 0 0 0 1.46-2.5L11.73 3.86a2 2 0 0 0-3.46 0Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {error}
                  </p>
                ) : null}
              </div>

              <footer className="grid shrink-0 grid-cols-2 gap-3 border-t border-line/80 bg-white/95 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur sm:flex sm:justify-end sm:px-7 sm:py-5">
                <button
                  type="button"
                  className="btn btn-ghost min-h-12 w-full rounded-2xl px-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue sm:w-auto sm:rounded-full sm:px-5"
                  disabled={pending}
                  onClick={close}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn btn-green min-h-12 w-full gap-2 rounded-2xl px-3 shadow-md shadow-green/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green sm:w-auto sm:rounded-full sm:px-6"
                  disabled={pending}
                  aria-busy={pending}
                >
                  {pending ? (
                    <>
                      <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
                      Enregistrement…
                    </>
                  ) : (
                    <>
                      <span className="sm:hidden">Enregistrer</span>
                      <span className="hidden sm:inline">Enregistrer l’opportunité</span>
                    </>
                  )}
                </button>
              </footer>
            </form>
          </section>
        </div>
      </dialog>
    </>
  );
}
