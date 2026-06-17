import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const getDatabaseUrl = () => {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set in environment");
  }
  return url;
};

const createPostgresClient = () => {
  return postgres(getDatabaseUrl(), {
    // Required for Supabase transaction pooler (port 6543)
    prepare: false,
    max: 1,
  });
};

let client: ReturnType<typeof postgres> | undefined;

export const getDb = () => {
  if (!client) {
    client = createPostgresClient();
  }
  return drizzle(client, { schema });
};

export const closeDb = async () => {
  if (client) {
    await client.end();
    client = undefined;
  }
};
