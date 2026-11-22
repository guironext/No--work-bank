"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({
  children,
  variant = "btn",
}: {
  children: React.ReactNode;
  variant?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button className={variant} disabled={pending} type="submit">
      {pending ? "Traitement…" : children}
    </button>
  );
}
