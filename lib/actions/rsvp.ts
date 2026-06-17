"use server";

import { desc } from "drizzle-orm";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { getDb } from "@/db";
import { rsvpResponses, type RsvpStatus } from "@/db/schema";
import { isAuthenticated } from "@/lib/auth";
import { DEFAULT_LOCALE, isLocale, LOCALE_COOKIE } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export type RsvpSubmission = {
  id: string;
  name: string;
  guestCount: number | null;
  status: RsvpStatus;
  wishes: string | null;
  createdAt: string;
};

const getRequestLocale = async () => {
  const cookieStore = await cookies();
  const value = cookieStore.get(LOCALE_COOKIE)?.value;
  return value && isLocale(value) ? value : DEFAULT_LOCALE;
};

export const submitRsvp = async (formData: FormData) => {
  const locale = await getRequestLocale();
  const t = getDictionary(locale).rsvp;

  const name = (formData.get("name") as string)?.trim();
  const status = formData.get("status") as RsvpStatus;
  const wishesRaw = (formData.get("wishes") as string)?.trim();
  const wishes = wishesRaw || null;
  const guestCountRaw = formData.get("guestCount") as string;

  if (!name || name.length < 2) {
    return { error: t.errorName };
  }

  if (status !== "going" && status !== "not_going") {
    return { error: t.errorStatus };
  }

  let guestCount: number | null = null;

  if (status === "going") {
    const parsed = Number.parseInt(guestCountRaw, 10);
    if (!Number.isFinite(parsed) || parsed < 1 || parsed > 50) {
      return { error: t.errorGuestCount };
    }
    guestCount = parsed;
  }

  if (wishes && wishes.length > 500) {
    return { error: t.errorWishes };
  }

  try {
    const db = getDb();
    await db.insert(rsvpResponses).values({
      name,
      status,
      wishes,
      guestCount,
      phone: null,
    });

    revalidatePath("/");
    revalidatePath("/admin/rsvps");

    return { success: true };
  } catch {
    return { error: t.errorSave };
  }
};

export const getRsvpResponses = async (): Promise<RsvpSubmission[]> => {
  if (!(await isAuthenticated())) {
    throw new Error("Unauthorized");
  }

  const db = getDb();
  const rows = await db
    .select()
    .from(rsvpResponses)
    .orderBy(desc(rsvpResponses.createdAt));

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    guestCount: row.guestCount,
    status: row.status,
    wishes: row.wishes,
    createdAt: row.createdAt,
  }));
};
