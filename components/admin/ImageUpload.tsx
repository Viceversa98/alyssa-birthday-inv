"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui";
import { isUploadTooLarge, MAX_UPLOAD_SIZE_LABEL } from "@/lib/upload-limits";
import { removeHeroImage, uploadImage } from "@/lib/actions/invitation";

type ImageUploadProps = {
  currentUrl?: string | null;
  label: string;
};

export const ImageUpload = ({ currentUrl, label }: ImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(currentUrl ?? "");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (isUploadTooLarge(file.size)) {
      setError(`Image must be smaller than ${MAX_UPLOAD_SIZE_LABEL}`);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setError("");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "hero");

    startTransition(async () => {
      const result = await uploadImage(formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      if (result.url) {
        setPreview(result.url);
      }
    });
  };

  const handleRemove = () => {
    setError("");
    startTransition(async () => {
      const result = await removeHeroImage();
      if (!result.success) return;
      setPreview("");
      if (inputRef.current) inputRef.current.value = "";
    });
  };

  const handleUploadClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-ink">{label}</p>

      {preview ? (
        <div className="relative mx-auto w-full max-w-xs">
          <Image
            src={preview}
            alt="Hero preview"
            width={192}
            height={192}
            className="aspect-square w-full rounded-full object-cover"
            unoptimized
          />
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              fullWidth
              onClick={handleUploadClick}
              disabled={isPending}
              aria-label="Replace hero image"
            >
              Replace
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              fullWidth
              onClick={handleRemove}
              disabled={isPending}
              aria-label="Remove hero image"
            >
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleUploadClick}
          disabled={isPending}
          className="flex min-h-32 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-gold-light/60 bg-blush px-4 py-6 text-base text-ink/70 transition-colors hover:border-gold hover:bg-pink-light/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-blush"
          aria-label="Upload hero image"
        >
          {isPending ? "Uploading…" : "Tap to upload hero photo"}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        aria-hidden="true"
      />

      <input type="hidden" name="heroImageUrl" value={preview} />

      {error && <p className="text-sm text-red-700">{error}</p>}
    </div>
  );
};
