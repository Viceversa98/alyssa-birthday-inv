import "dotenv/config";
import {
  getStorageBucket,
  getSupabaseAdmin,
  isSupabaseStorageConfigured,
} from "../lib/supabase-admin";

const main = async () => {
  if (!isSupabaseStorageConfigured()) {
    console.error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.",
    );
    process.exit(1);
  }

  const supabase = getSupabaseAdmin();
  const bucket = getStorageBucket();

  const { data: buckets, error: listError } =
    await supabase.storage.listBuckets();

  if (listError) {
    console.error("Failed to list buckets:", listError.message);
    process.exit(1);
  }

  const exists = buckets?.some((item) => item.name === bucket);

  if (exists) {
    console.log(`Bucket "${bucket}" already exists.`);
    return;
  }

  const { error: createError } = await supabase.storage.createBucket(bucket, {
    public: true,
    fileSizeLimit: 10 * 1024 * 1024,
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  });

  if (createError) {
    console.error("Failed to create bucket:", createError.message);
    process.exit(1);
  }

  console.log(`Created public bucket "${bucket}".`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
