"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/db";
import { invitation } from "@/db/schema";
import {
  clearSession,
  createSession,
  isAuthenticated,
} from "@/lib/auth";
import {
  DEFAULT_INVITATION,
  INVITATION_ID,
  parseContentEn,
  type InvitationData,
} from "@/lib/invitation";
import { deleteUpload, saveUpload } from "@/lib/uploads";
import { isUploadTooLarge, MAX_UPLOAD_SIZE_LABEL } from "@/lib/upload-limits";

const requireAuth = async () => {
  if (!(await isAuthenticated())) {
    throw new Error("Unauthorized");
  }
};

const toDrizzleValues = (data: InvitationData) => ({
  id: INVITATION_ID,
  celebrantName: data.celebrantName,
  tagline: data.tagline,
  heroEyebrow: data.heroEyebrow,
  date: data.date.toISOString(),
  endDate: data.endDate?.toISOString() ?? null,
  timeLabel: data.timeLabel,
  locationName: data.locationName,
  address: data.address,
  dressCode: data.dressCode,
  rsvpDeadline: data.rsvpDeadline.toISOString(),
  rsvpEmail: data.rsvpEmail,
  rsvpPhone: data.rsvpPhone ?? null,
  rsvpMessage: data.rsvpMessage,
  detailsTitle: data.detailsTitle,
  detailsSubtitle: data.detailsSubtitle,
  rsvpTitle: data.rsvpTitle,
  pageTitle: data.pageTitle,
  pageDescription: data.pageDescription,
  heroImageUrl: data.heroImageUrl ?? null,
  galleryImages: data.galleryImages,
  contentEn: data.contentEn ?? null,
  updatedAt: new Date().toISOString(),
});

export const signIn = async (formData: FormData) => {
  const password = formData.get("password") as string;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || password !== adminPassword) {
    redirect("/admin/login?error=invalid_password");
  }

  await createSession();
  redirect("/admin");
};

export const signOut = async () => {
  await clearSession();
  redirect("/admin/login");
};

export const updateInvitation = async (formData: FormData) => {
  await requireAuth();

  const galleryRaw = formData.get("galleryImages") as string;
  let galleryImages: string[] = [];
  try {
    galleryImages = JSON.parse(galleryRaw || "[]");
  } catch {
    galleryImages = [];
  }

  const data: InvitationData = {
    ...DEFAULT_INVITATION,
    celebrantName:
      (formData.get("celebrantName") as string) ||
      DEFAULT_INVITATION.celebrantName,
    tagline: (formData.get("tagline") as string) || DEFAULT_INVITATION.tagline,
    heroEyebrow:
      (formData.get("heroEyebrow") as string) || DEFAULT_INVITATION.heroEyebrow,
    date: new Date(formData.get("date") as string),
    endDate: formData.get("endDate")
      ? new Date(formData.get("endDate") as string)
      : undefined,
    timeLabel:
      (formData.get("timeLabel") as string) || DEFAULT_INVITATION.timeLabel,
    locationName:
      (formData.get("locationName") as string) ||
      DEFAULT_INVITATION.locationName,
    address: (formData.get("address") as string) || DEFAULT_INVITATION.address,
    dressCode:
      (formData.get("dressCode") as string) || DEFAULT_INVITATION.dressCode,
    rsvpDeadline: new Date(formData.get("rsvpDeadline") as string),
    rsvpEmail:
      (formData.get("rsvpEmail") as string) || DEFAULT_INVITATION.rsvpEmail,
    rsvpPhone: (formData.get("rsvpPhone") as string) || undefined,
    rsvpMessage:
      (formData.get("rsvpMessage") as string) || DEFAULT_INVITATION.rsvpMessage,
    detailsTitle:
      (formData.get("detailsTitle") as string) ||
      DEFAULT_INVITATION.detailsTitle,
    detailsSubtitle:
      (formData.get("detailsSubtitle") as string) ||
      DEFAULT_INVITATION.detailsSubtitle,
    rsvpTitle:
      (formData.get("rsvpTitle") as string) || DEFAULT_INVITATION.rsvpTitle,
    pageTitle:
      (formData.get("pageTitle") as string) || DEFAULT_INVITATION.pageTitle,
    pageDescription:
      (formData.get("pageDescription") as string) ||
      DEFAULT_INVITATION.pageDescription,
    heroImageUrl: (formData.get("heroImageUrl") as string) || null,
    galleryImages,
    contentEn: parseContentEn(formData),
  };

  const db = getDb();
  const values = toDrizzleValues(data);

  try {
    await db
      .insert(invitation)
      .values(values)
      .onConflictDoUpdate({
        target: invitation.id,
        set: values,
      });
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to save",
    };
  }

  revalidatePath("/");
  revalidatePath("/admin");

  return { success: true };
};

export const uploadImage = async (formData: FormData) => {
  await requireAuth();

  const file = formData.get("file") as File;
  const type = formData.get("type") as "hero" | "gallery";

  if (!file || !type) {
    return { error: "Missing file or type" };
  }

  if (isUploadTooLarge(file.size)) {
    return { error: `Image must be smaller than ${MAX_UPLOAD_SIZE_LABEL}` };
  }

  try {
    const publicUrl = await saveUpload(file, type);
    const db = getDb();

    if (type === "hero") {
      await db
        .update(invitation)
        .set({
          heroImageUrl: publicUrl,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(invitation.id, INVITATION_ID));
    } else {
      const rows = await db
        .select({ galleryImages: invitation.galleryImages })
        .from(invitation)
        .where(eq(invitation.id, INVITATION_ID))
        .limit(1);

      const gallery = Array.isArray(rows[0]?.galleryImages)
        ? [...rows[0].galleryImages, publicUrl]
        : [publicUrl];

      await db
        .update(invitation)
        .set({
          galleryImages: gallery,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(invitation.id, INVITATION_ID));
    }

    revalidatePath("/");
    revalidatePath("/admin");

    return { url: publicUrl };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
};

export const removeGalleryImage = async (imageUrl: string) => {
  await requireAuth();

  await deleteUpload(imageUrl);

  const db = getDb();
  const rows = await db
    .select({ galleryImages: invitation.galleryImages })
    .from(invitation)
    .where(eq(invitation.id, INVITATION_ID))
    .limit(1);

  const gallery = Array.isArray(rows[0]?.galleryImages)
    ? rows[0].galleryImages.filter((url) => url !== imageUrl)
    : [];

  await db
    .update(invitation)
    .set({
      galleryImages: gallery,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(invitation.id, INVITATION_ID));

  revalidatePath("/");
  revalidatePath("/admin");

  return { success: true };
};

export const removeHeroImage = async () => {
  await requireAuth();

  const db = getDb();
  const rows = await db
    .select({ heroImageUrl: invitation.heroImageUrl })
    .from(invitation)
    .where(eq(invitation.id, INVITATION_ID))
    .limit(1);

  if (rows[0]?.heroImageUrl) {
    await deleteUpload(rows[0].heroImageUrl);
  }

  await db
    .update(invitation)
    .set({
      heroImageUrl: null,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(invitation.id, INVITATION_ID));

  revalidatePath("/");
  revalidatePath("/admin");

  return { success: true };
};
