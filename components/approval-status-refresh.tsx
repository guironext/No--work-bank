"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function ApprovalStatusRefresh() {
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => router.refresh(), 8000);
    return () => clearInterval(timer);
  }, [router]);

  return <p className="mt-4 text-sm text-ink/60">Cette page se mettra à jour automatiquement.</p>;
}
