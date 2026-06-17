import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";

const uploadRoot = () => path.join(process.cwd(), "public", "uploads");

export const saveUpload = async (file: File, type: "hero" | "gallery") => {
  const ext = file.name.split(".").pop() ?? "jpg";
  const fileName = `${crypto.randomUUID()}.${ext}`;
  const dir = path.join(uploadRoot(), type);

  await mkdir(dir, { recursive: true });
  await writeFile(
    path.join(dir, fileName),
    Buffer.from(await file.arrayBuffer()),
  );

  return `/uploads/${type}/${fileName}`;
};

export const deleteUpload = async (publicUrl: string) => {
  if (!publicUrl.startsWith("/uploads/")) return;

  const filePath = path.join(process.cwd(), "public", publicUrl);

  try {
    await unlink(filePath);
  } catch {
    // File may already be removed
  }
};
