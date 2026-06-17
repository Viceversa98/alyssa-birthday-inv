import { createClient } from "@supabase/supabase-js";

export const getSupabaseUrl = () =>
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;

export const getStorageBucket = () =>
  process.env.SUPABASE_STORAGE_BUCKET ?? "uploads";

export const isSupabaseStorageConfigured = () =>
  Boolean(getSupabaseUrl() && process.env.SUPABASE_SERVICE_ROLE_KEY);

export const getSupabaseAdmin = () => {
  const url = getSupabaseUrl();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY for storage uploads.",
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};
