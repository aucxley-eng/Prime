import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/avif", "avif"],
]);

let storageClient: ReturnType<typeof createClient> | undefined;

function getStorageClient() {
  if (storageClient) return storageClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) {
    throw new Error(
      "Image storage is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  storageClient = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return storageClient;
}

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

  const bucket = process.env.SUPABASE_STORAGE_BUCKET?.trim() || "property-images";
  const filename = `${prefix}/${Date.now()}-${randomUUID().slice(0, 8)}.${extension}`;
  const bytes = new Uint8Array(await file.arrayBuffer());
  const storage = getStorageClient();

  const { error } = await storage.storage
    .from(bucket)
    .upload(filename, bytes, {
      contentType: file.type,
      cacheControl: "31536000",
      upsert: false,
    });

  if (error) {
    throw new Error(`Image upload failed: ${error.message}`);
  }

  const { data } = storage.storage.from(bucket).getPublicUrl(filename);
  return data.publicUrl;
}
