import { redirect } from "next/navigation";

export function one(value: string | string[] | undefined) {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

export function text(form: FormData, key: string, max: number) {
  return String(form.get(key) ?? "")
    .trim()
    .slice(0, max);
}

export function integer(form: FormData, key: string) {
  const raw = String(form.get(key) ?? "").replace(/\s/g, "");
  if (!raw) return null;
  const value = Number(raw);
  if (!Number.isFinite(value)) return null;
  return Math.round(value);
}

export function fail(path: string, message: string): never {
  const join = path.includes("?") ? "&" : "?";
  redirect(`${path}${join}erreur=${encodeURIComponent(message)}`);
}

export function done(path: string, message: string): never {
  const join = path.includes("?") ? "&" : "?";
  redirect(`${path}${join}ok=${encodeURIComponent(message)}`);
}

export function isUniqueViolation(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    ((error as { code?: string }).code === "23505" || (error as { code?: string }).code === "P2002")
  );
}

export function pair(left: string, right: string) {
  return left < right ? ([left, right] as const) : ([right, left] as const);
}
