import "server-only";

import { cookies } from "next/headers";
import { connection } from "next/server";

export async function getLocale(): Promise<"fr" | "en"> {
  await connection();
  const value = (await cookies()).get("noe-locale")?.value;
  return value === "en" ? "en" : "fr";
}
