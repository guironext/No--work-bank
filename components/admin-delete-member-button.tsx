"use client";

import { deleteMemberAdmin } from "@/lib/actions";

export function AdminDeleteMemberButton({
  memberId,
  name,
}: {
  memberId: string;
  name: string;
}) {
  return (
    <form
      action={deleteMemberAdmin}
      onSubmit={(event) => {
        const confirmed = window.confirm(
          `Supprimer définitivement le compte de ${name} ? Son accès sera révoqué et son profil ainsi que les données associées seront supprimés.`,
        );
        if (!confirmed) event.preventDefault();
      }}
    >
      <input type="hidden" name="memberId" value={memberId} />
      <button
        type="submit"
        aria-label={`Supprimer ${name}`}
        title="Supprimer l’utilisateur"
        className="flex size-9 items-center justify-center rounded-full border border-red-200 text-red-700 transition hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="size-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 7h16m-10 4v6m4-6v6M5 7l1 13h12l1-13M9 7V4h6v3"
          />
        </svg>
      </button>
    </form>
  );
}
