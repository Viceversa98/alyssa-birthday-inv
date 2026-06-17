import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const rsvpStatusEnum = pgEnum("rsvp_status", ["going", "not_going"]);

export const invitation = pgTable("invitation", {
  id: uuid("id")
    .primaryKey()
    .default("00000000-0000-0000-0000-000000000001"),
  celebrantName: text("celebrant_name").notNull(),
  tagline: text("tagline").notNull(),
  heroEyebrow: text("hero_eyebrow").notNull().default("You're invited"),
  date: timestamp("date", { withTimezone: true, mode: "string" }).notNull(),
  endDate: timestamp("end_date", { withTimezone: true, mode: "string" }),
  timeLabel: text("time_label").notNull(),
  locationName: text("location_name").notNull(),
  address: text("address").notNull(),
  dressCode: text("dress_code").notNull(),
  rsvpDeadline: timestamp("rsvp_deadline", {
    withTimezone: true,
    mode: "string",
  }).notNull(),
  rsvpEmail: text("rsvp_email").notNull(),
  rsvpPhone: text("rsvp_phone"),
  rsvpMessage: text("rsvp_message"),
  detailsTitle: text("details_title").notNull().default("Event Details"),
  detailsSubtitle: text("details_subtitle"),
  rsvpTitle: text("rsvp_title").notNull().default("RSVP"),
  pageTitle: text("page_title"),
  pageDescription: text("page_description"),
  heroImageUrl: text("hero_image_url"),
  galleryImages: jsonb("gallery_images")
    .$type<string[]>()
    .notNull()
    .default([]),
  contentEn: jsonb("content_en").$type<InvitationEnglishCopy>(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

export const rsvpResponses = pgTable("rsvp_responses", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  phone: text("phone"),
  guestCount: integer("guest_count"),
  status: rsvpStatusEnum("status").notNull(),
  wishes: text("wishes"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

export type InvitationEnglishCopy = {
  tagline?: string;
  heroEyebrow?: string;
  timeLabel?: string;
  dressCode?: string;
  rsvpMessage?: string;
  detailsTitle?: string;
  detailsSubtitle?: string;
  rsvpTitle?: string;
  pageTitle?: string;
  pageDescription?: string;
};

export type InvitationRow = typeof invitation.$inferSelect;
export type InvitationInsert = typeof invitation.$inferInsert;
export type RsvpResponseRow = typeof rsvpResponses.$inferSelect;
export type RsvpStatus = "going" | "not_going";
