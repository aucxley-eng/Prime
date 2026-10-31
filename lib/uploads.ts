import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/avif", "avif"],
]);

export async function saveUpload(
  file: File | null,
  prefix = "property"
): Promise<string | null> {
  if (!file || file.size === 0) return null;
  if (file.size > MAX_BYTES) {
    throw new Error("Each image must be smaller than 8 MB.");
  }

  const extension = ALLOWED.get(file.type);
  if (!extension) {
    throw new Error("Images must be JPEG, PNG, WebP or AVIF.");
  }

  const directory = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(directory, { recursive: true });

  const filename = `${prefix}-${Date.now()}-${randomUUID().slice(0, 8)}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(directory, filename), buffer);
  return `/uploads/${filename}`;
}
