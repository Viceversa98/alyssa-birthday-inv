import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import {
  getStorageBucket,
  getSupabaseAdmin,
  isSupabaseStorageConfigured,
} from "@/lib/supabase-admin";

const uploadRoot = () => path.join(process.cwd(), "public", "uploads");

const getFileExtension = (fileName: string) =>
  fileName.split(".").pop()?.toLowerCase() ?? "jpg";

const saveToLocal = async (file: File, type: "hero" | "gallery") => {
  if (process.env.VERCEL) {
    throw new Error(
      "Local uploads are not available on Vercel. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, then create a public Storage bucket (run: bun run storage:setup).",
    );
  }

  const ext = getFileExtension(file.name);
  const fileName = `${crypto.randomUUID()}.${ext}`;
  const dir = path.join(uploadRoot(), type);

  await mkdir(dir, { recursive: true });
  await writeFile(
    path.join(dir, fileName),
    Buffer.from(await file.arrayBuffer()),
  );

  return `/uploads/${type}/${fileName}`;
};

const saveToSupabase = async (file: File, type: "hero" | "gallery") => {
  const supabase = getSupabaseAdmin();
  const bucket = getStorageBucket();
  const ext = getFileExtension(file.name);
  const fileName = `${crypto.randomUUID()}.${ext}`;
  const objectPath = `${type}/${fileName}`;
  const body = Buffer.from(await file.arrayBuffer());
  const contentType = file.type || `image/${ext}`;

  const { error } = await supabase.storage.from(bucket).upload(objectPath, body, {
    contentType,
    upsert: false,
  });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath);

  return data.publicUrl;
};

export const saveUpload = async (file: File, type: "hero" | "gallery") => {
  if (isSupabaseStorageConfigured()) {
    return saveToSupabase(file, type);
  }

  return saveToLocal(file, type);
};

const deleteFromLocal = async (publicUrl: string) => {
  if (!publicUrl.startsWith("/uploads/")) return;

  const filePath = path.join(process.cwd(), "public", publicUrl);

  try {
    await unlink(filePath);
  } catch {
    // File may already be removed
  }
};

const extractSupabaseObjectPath = (publicUrl: string, bucket: string) => {
  const marker = `/storage/v1/object/public/${bucket}/`;
  const markerIndex = publicUrl.indexOf(marker);

  if (markerIndex === -1) return null;

  return decodeURIComponent(publicUrl.slice(markerIndex + marker.length));
};

const deleteFromSupabase = async (publicUrl: string) => {
  const supabase = getSupabaseAdmin();
  const bucket = getStorageBucket();
  const objectPath = extractSupabaseObjectPath(publicUrl, bucket);

  if (!objectPath) return;

  const { error } = await supabase.storage.from(bucket).remove([objectPath]);

  if (error) {
    throw new Error(error.message);
  }
};

export const deleteUpload = async (publicUrl: string) => {
  if (publicUrl.startsWith("/uploads/")) {
    await deleteFromLocal(publicUrl);
    return;
  }

  if (!isSupabaseStorageConfigured()) return;

  await deleteFromSupabase(publicUrl);
};
