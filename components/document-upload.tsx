"use client";

import { useRef, useState } from "react";

export function DocumentUpload({ name }: { name: string }) {
  const input = useRef<HTMLInputElement>(null);
  const [label, setLabel] = useState("PDF, JPG, PNG ou WEBP · 6 Mo maximum");

  return (
    <div className="field sm:col-span-2">
      <span>Document</span>
      <button
        className="flex min-h-28 w-full flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-blue/30 bg-paper px-4 py-4 text-center"
        type="button"
        onClick={() => input.current?.click()}
      >
        <span className="text-sm font-bold text-navy">Joindre un fichier</span>
        <span className="max-w-full text-xs leading-5 break-words text-ink/65">{label}</span>
      </button>
      <input
        ref={input}
        className="sr-only"
        type="file"
        name={name}
        aria-label="Document"
        accept="application/pdf,image/jpeg,image/png,image/webp,.pdf,.jpg,.jpeg,.png,.webp"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file) {
            setLabel("PDF, JPG, PNG ou WEBP · 6 Mo maximum");
            return;
          }
          if (file.size > 6 * 1024 * 1024) {
            event.target.value = "";
            setLabel("Ce fichier dépasse 6 Mo. Choisissez-en un plus léger.");
            return;
          }
          const size = file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)} Mo` : `${Math.ceil(file.size / 1024)} Ko`;
          setLabel(`${file.name} · ${size}`);
        }}
      />
    </div>
  );
}
