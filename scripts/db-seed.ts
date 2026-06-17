import { config } from "dotenv";
import { closeDb, getDb } from "../db";
import { invitation } from "../db/schema";
import {
  DEFAULT_CONTENT_EN,
  DEFAULT_INVITATION,
  INVITATION_ID,
} from "../lib/invitation";

config({ path: ".env.local" });

const main = async () => {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is missing from .env.local");
    process.exit(1);
  }

  const db = getDb();

  await db
    .insert(invitation)
    .values({
      id: INVITATION_ID,
      celebrantName: DEFAULT_INVITATION.celebrantName,
      tagline: DEFAULT_INVITATION.tagline,
      heroEyebrow: DEFAULT_INVITATION.heroEyebrow,
      date: DEFAULT_INVITATION.date.toISOString(),
      endDate: DEFAULT_INVITATION.endDate?.toISOString(),
      timeLabel: DEFAULT_INVITATION.timeLabel,
      locationName: DEFAULT_INVITATION.locationName,
      address: DEFAULT_INVITATION.address,
      dressCode: DEFAULT_INVITATION.dressCode,
      rsvpDeadline: DEFAULT_INVITATION.rsvpDeadline.toISOString(),
      rsvpEmail: DEFAULT_INVITATION.rsvpEmail,
      rsvpMessage: DEFAULT_INVITATION.rsvpMessage,
      detailsTitle: DEFAULT_INVITATION.detailsTitle,
      detailsSubtitle: DEFAULT_INVITATION.detailsSubtitle,
      rsvpTitle: DEFAULT_INVITATION.rsvpTitle,
      pageTitle: DEFAULT_INVITATION.pageTitle,
      pageDescription: DEFAULT_INVITATION.pageDescription,
      galleryImages: DEFAULT_INVITATION.galleryImages,
      contentEn: DEFAULT_CONTENT_EN,
    })
    .onConflictDoNothing();

  console.log("Seed complete (skipped if row already exists).");
  await closeDb();
};

main().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
