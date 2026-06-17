import { desc, isNotNull } from "drizzle-orm";
import { getDb } from "@/db";
import { rsvpResponses } from "@/db/schema";

export type PublicWish = {
  id: string;
  name: string;
  wishes: string;
};

const MAX_PUBLIC_WISHES = 30;

export const getPublicWishes = async (): Promise<PublicWish[]> => {
  if (!process.env.DATABASE_URL) {
    return [];
  }

  try {
    const db = getDb();
    const rows = await db
      .select({
        id: rsvpResponses.id,
        name: rsvpResponses.name,
        wishes: rsvpResponses.wishes,
      })
      .from(rsvpResponses)
      .where(isNotNull(rsvpResponses.wishes))
      .orderBy(desc(rsvpResponses.createdAt))
      .limit(MAX_PUBLIC_WISHES);

    return rows
      .filter((row) => row.wishes?.trim())
      .map((row) => ({
        id: row.id,
        name: row.name,
        wishes: row.wishes!.trim(),
      }));
  } catch {
    return [];
  }
};
