import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

const TYPES: Record<string, string> = {
  "application/pdf": "pdf",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const MANAGER_EXAM_TYPES: Record<string, string> = {
  ...TYPES,
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
};

const MAX_BYTES = 6 * 1024 * 1024;

export async function storeCvDocument(memberId: string, entry: FormDataEntryValue | null) {
  if (!(entry instanceof File) || entry.size === 0) return { url: "" };
  if (entry.size > MAX_BYTES) return { error: "Le document dépasse 6 Mo." };
  const extension = TYPES[entry.type];
  if (!extension) return { error: "Joignez un PDF, JPG, PNG ou WEBP." };
  if (!/^[0-9a-f-]{36}$/i.test(memberId)) return { error: "Envoi refusé." };

  const folder = path.join(process.cwd(), "public", "uploads", "cv", memberId);
  await mkdir(folder, { recursive: true });
  const filename = `${randomUUID()}.${extension}`;
  await writeFile(path.join(folder, filename), Buffer.from(await entry.arrayBuffer()));
  return { url: `/uploads/cv/${memberId}/${filename}` };
}

export async function removeCvDocument(memberId: string, url: string | null) {
  if (!url?.startsWith(`/uploads/cv/${memberId}/`)) return;
  const root = path.resolve(process.cwd(), "public", "uploads", "cv", memberId);
  const target = path.resolve(process.cwd(), "public", url.replace(/^\//, ""));
  if (target !== root && !target.startsWith(`${root}${path.sep}`)) return;
  await unlink(target).catch(() => undefined);
}

export async function storeManagerExamDocument(managerId: string, entry: FormDataEntryValue | null) {
  if (!(entry instanceof File) || entry.size === 0) return { url: null, name: null };
  if (entry.size > MAX_BYTES) return { error: "Le document dépasse 6 Mo." };
  const extension = MANAGER_EXAM_TYPES[entry.type];
  if (!extension) return { error: "Joignez un PDF, un fichier Word, JPG, PNG ou WEBP." };
  if (!/^[0-9a-f-]{36}$/i.test(managerId)) return { error: "Envoi refusé." };

  const folder = path.join(process.cwd(), "public", "uploads", "manager-examens", managerId);
  await mkdir(folder, { recursive: true });
  const filename = `${randomUUID()}.${extension}`;
  await writeFile(path.join(folder, filename), Buffer.from(await entry.arrayBuffer()));
  const name = entry.name.replace(/[\\/\0-\x1f\x7f]/g, "_").trim().slice(0, 180) || `document.${extension}`;
  return { url: `/uploads/manager-examens/${managerId}/${filename}`, name };
}

export async function removeManagerExamDocument(managerId: string, url: string | null) {
  const prefix = `/uploads/manager-examens/${managerId}/`;
  if (!url?.startsWith(prefix) || !/^[0-9a-f-]{36}$/i.test(managerId)) return;
  const root = path.resolve(process.cwd(), "public", "uploads", "manager-examens", managerId);
  const target = path.resolve(process.cwd(), "public", url.replace(/^\//, ""));
  if (target === root || !target.startsWith(`${root}${path.sep}`)) return;

  try {
    await unlink(target);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
}
