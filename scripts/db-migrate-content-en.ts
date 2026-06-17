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

  console.log("Adding content_en column if missing…");

  await db.execute(sql`
    ALTER TABLE invitation
    ADD COLUMN IF NOT EXISTS content_en jsonb;
  `);

  console.log("Done — content_en column is ready.");
  await closeDb();
};

main().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
