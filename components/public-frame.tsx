import { Suspense } from "react";
import { SiteFooter, SiteHeader } from "./chrome";
import { getLocale } from "@/lib/locale";

async function Frame({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <SiteHeader locale={locale} />
      <div className="page-offset mx-auto w-full max-w-6xl flex-1 px-4 pb-10 sm:px-8">{children}</div>
      <SiteFooter locale={locale} />
    </div>
  );
}

export function PublicFrame({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-paper" />}>
      <Frame>{children}</Frame>
    </Suspense>
  );
}
