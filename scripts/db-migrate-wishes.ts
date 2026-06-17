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

  console.log("Adding wishes column if missing…");

  await db.execute(sql`
    ALTER TABLE rsvp_responses
    ADD COLUMN IF NOT EXISTS wishes text;
  `);

  console.log("Done — wishes column is ready.");
  await closeDb();
};

main().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
