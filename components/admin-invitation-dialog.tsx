"use client";

import { useState, useTransition, type FormEvent } from "react";
import { createAdminInvitation } from "@/lib/actions";
import { ROLES } from "@/lib/constants";

export function AdminInvitationDialog() {
  const [open, setOpen] = useState(false);
  const [link, setLink] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [pending, startTransition] = useTransition();

  function close() {
    setOpen(false);
    setLink("");
    setError("");
    setCopied(false);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setError("");
    setLink("");
    startTransition(async () => {
      const result = await createAdminInvitation(formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      if (!result.path) {
        setError("Le lien d’invitation n’a pas pu être généré.");
        return;
      }
      setLink(new URL(result.path, window.location.origin).toString());
    });
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setError("");
    } catch {
      setCopied(false);
      setError("La copie automatique a échoué. Sélectionnez le lien pour le copier manuellement.");
    }
  }

  return (
    <>
      <button type="button" className="btn" onClick={() => setOpen(true)}>
        Créer une invitation
      </button>
      {open ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-navy/55 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !pending) close();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="invitation-title"
            className="card w-full max-w-xl p-5 shadow-2xl sm:p-7"
          >
            <header className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold tracking-[0.16em] text-green uppercase">Nouvel accès</p>
                <h2 id="invitation-title" className="display mt-1 text-3xl text-navy">
                  Créer une invitation
                </h2>
                <p className="mt-2 text-sm leading-6 text-ink/65">
                  Le lien est valable 7 jours. Vous pourrez le copier et l’envoyer à la personne invitée.
                </p>
              </div>
              <button
                type="button"
                aria-label="Fermer"
                className="grid size-10 shrink-0 place-items-center rounded-full text-xl text-ink/55 hover:bg-paper hover:text-navy"
                disabled={pending}
                onClick={close}
              >
                ×
              </button>
            </header>

            {link ? (
              <div className="grid gap-3">
                <label className="field">
                  <span>Lien d’invitation à partager</span>
                  <input
                    type="url"
                    readOnly
                    value={link}
                    onFocus={(event) => event.currentTarget.select()}
                  />
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  <button type="button" className="btn btn-green" onClick={copyLink}>
                    {copied ? "Lien copié" : "Copier le lien"}
                  </button>
                  <button type="button" className="btn btn-ghost" onClick={() => setLink("")}>
                    Créer une autre
                  </button>
                </div>
              </div>
            ) : (
              <form className="grid gap-4" onSubmit={submit}>
                <label className="field">
                  <span>Adresse e-mail</span>
                  <input name="email" type="email" autoComplete="email" required maxLength={120} />
                </label>
                <label className="field">
                  <span>Rôle prévu</span>
                  <select name="role" required defaultValue="candidat">
                    {ROLES.map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </label>
                <button type="submit" className="btn" disabled={pending}>
                  {pending ? "Génération…" : "Générer le lien"}
                </button>
              </form>
            )}

            {error ? <p role="alert" className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p> : null}
          </section>
        </div>
      ) : null}
    </>
  );
}
