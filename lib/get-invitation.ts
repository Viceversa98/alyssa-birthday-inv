import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { invitation } from "@/db/schema";
import type { InvitationRow } from "@/db/schema";
import {
  DEFAULT_CONTENT_EN,
  DEFAULT_INVITATION,
  INVITATION_ID,
  type InvitationData,
} from "@/lib/invitation";

export const getInvitation = async (): Promise<InvitationData> => {
  if (!process.env.DATABASE_URL) {
    return DEFAULT_INVITATION;
  }

  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(invitation)
      .where(eq(invitation.id, INVITATION_ID))
      .limit(1);

    if (!rows[0]) {
      return DEFAULT_INVITATION;
    }

    return fromDrizzleRow(rows[0]);
  } catch {
    return DEFAULT_INVITATION;
  }
};

export const fromDrizzleRow = (row: InvitationRow): InvitationData => ({
  celebrantName: row.celebrantName,
  tagline: row.tagline,
  heroEyebrow: row.heroEyebrow,
  date: new Date(row.date),
  endDate: row.endDate ? new Date(row.endDate) : undefined,
  timeLabel: row.timeLabel,
  locationName: row.locationName,
  address: row.address,
  dressCode: row.dressCode,
  rsvpDeadline: new Date(row.rsvpDeadline),
  rsvpEmail: row.rsvpEmail,
  rsvpPhone: row.rsvpPhone ?? undefined,
  rsvpMessage:
    row.rsvpMessage ??
    "Beritahu kami jika anda akan menyertai sambutan. Kami ingin berjumpa dengan anda!",
  detailsTitle: row.detailsTitle,
  detailsSubtitle:
    row.detailsSubtitle ?? "Kami tidak sabar untuk meraikan bersama anda",
  rsvpTitle: row.rsvpTitle,
  pageTitle: row.pageTitle ?? DEFAULT_INVITATION.pageTitle,
  pageDescription:
    row.pageDescription ?? DEFAULT_INVITATION.pageDescription,
  heroImageUrl: row.heroImageUrl,
  galleryImages: Array.isArray(row.galleryImages) ? row.galleryImages : [],
  contentEn: row.contentEn ?? DEFAULT_CONTENT_EN,
});
