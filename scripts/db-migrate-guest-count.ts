import { config } from "dotenv";
import { sql } from "drizzle-orm";
import { closeDb, getDb } from "../db";

config({ path: ".env.local" });

const main = async () => {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is missing from .env.local");
    process.exit(1);
  }

  const db = getDb();

  console.log("Updating rsvp_responses for guest count…");

  await db.execute(sql`
    ALTER TABLE rsvp_responses
    ADD COLUMN IF NOT EXISTS guest_count integer;
  `);

  await db.execute(sql`
    ALTER TABLE rsvp_responses
    ALTER COLUMN phone DROP NOT NULL;
  `);

  console.log("Done — guest_count column is ready and phone is optional.");
  await closeDb();
};

main().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
