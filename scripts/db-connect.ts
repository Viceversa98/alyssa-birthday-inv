import { config } from "dotenv";
import { sql } from "drizzle-orm";
import { eq } from "drizzle-orm";
import { closeDb, getDb } from "../db";
import { invitation } from "../db/schema";
import { INVITATION_ID } from "../lib/invitation";

config({ path: ".env.local" });

const main = async () => {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is missing from .env.local");
    process.exit(1);
  }

  const db = getDb();

  console.log("Connecting to Supabase Postgres…");

  const [{ dbTime }] = await db.execute<{ dbTime: string }>(
    sql`select now() as "dbTime"`,
  );

  console.log("Connected. Server time:", dbTime);

  const rows = await db
    .select({
      id: invitation.id,
      celebrantName: invitation.celebrantName,
      tagline: invitation.tagline,
      updatedAt: invitation.updatedAt,
    })
    .from(invitation)
    .where(eq(invitation.id, INVITATION_ID))
    .limit(1);

  if (rows.length === 0) {
    console.log(
      "No invitation row found. Run: npm run db:seed",
    );
  } else {
    console.log("Invitation row:", rows[0]);
  }

  await closeDb();
  console.log("Done.");
};

main().catch((error) => {
  console.error("Database connection failed:", error);
  process.exit(1);
});
