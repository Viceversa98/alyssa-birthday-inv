"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui";
import { isUploadTooLarge, MAX_UPLOAD_SIZE_LABEL } from "@/lib/upload-limits";
import { removeGalleryImage, uploadImage } from "@/lib/actions/invitation";

type GalleryManagerProps = {
  images: string[];
  onImagesChange: (images: string[]) => void;
};

export const GalleryManager = ({
  images,
  onImagesChange,
}: GalleryManagerProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
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
    formData.append("type", "gallery");

    startTransition(async () => {
      const result = await uploadImage(formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      if (result.url) {
        onImagesChange([...images, result.url]);
      }
      if (inputRef.current) inputRef.current.value = "";
    });
  };

  const handleRemove = (url: string) => {
    setError("");
    startTransition(async () => {
      await removeGalleryImage(url);
      onImagesChange(images.filter((img) => img !== url));
    });
  };

  const handleAddClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-ink">Gallery photos</p>

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((url) => (
            <div key={url} className="relative">
              <Image
                src={url}
                alt="Gallery photo"
                width={200}
                height={200}
                className="aspect-square w-full rounded-xl object-cover"
                unoptimized
              />
              <button
                type="button"
                onClick={() => handleRemove(url)}
                disabled={isPending}
                className="absolute right-2 top-2 flex min-h-8 min-w-8 items-center justify-center rounded-full bg-ink/70 text-sm text-blush focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                aria-label="Remove gallery image"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <Button
        type="button"
        variant="secondary"
        size="sm"
        fullWidth
        onClick={handleAddClick}
        disabled={isPending}
        aria-label="Add gallery photo"
      >
        {isPending ? "Uploading…" : "Add photo"}
      </Button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        aria-hidden="true"
      />

      <input
        type="hidden"
        name="galleryImages"
        value={JSON.stringify(images)}
      />

      {error && <p className="text-sm text-red-700">{error}</p>}
    </div>
  );
};
