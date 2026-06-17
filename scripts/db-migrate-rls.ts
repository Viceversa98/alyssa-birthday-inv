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

  console.log("Enabling RLS and applying policies…");

  await db.execute(sql`
    ALTER TABLE invitation ENABLE ROW LEVEL SECURITY;
    ALTER TABLE rsvp_responses ENABLE ROW LEVEL SECURITY;
  `);

  await db.execute(sql`
    DROP POLICY IF EXISTS "invitation_public_read" ON invitation;
    DROP POLICY IF EXISTS "invitation_allow_all" ON invitation;
    DROP POLICY IF EXISTS "rsvp_public_insert" ON rsvp_responses;
    DROP POLICY IF EXISTS "rsvp_allow_all" ON rsvp_responses;
  `);

  await db.execute(sql`
    CREATE POLICY "invitation_public_read"
      ON invitation
      FOR SELECT
      TO anon, authenticated
      USING (true);
  `);

  await db.execute(sql`
    CREATE POLICY "rsvp_public_insert"
      ON rsvp_responses
      FOR INSERT
      TO anon, authenticated
      WITH CHECK (true);
  `);

  console.log("Done — RLS enabled:");
  console.log("  invitation: public read only (no anon/authenticated writes)");
  console.log("  rsvp_responses: public insert only (no anon/authenticated reads)");
  console.log("");
  console.log("Your Next.js app uses DATABASE_URL (postgres role) and is unaffected.");

  await closeDb();
};

main().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
