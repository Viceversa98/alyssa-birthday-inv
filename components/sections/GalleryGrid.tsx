"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Spinner, Skeleton } from "@/components/ui";
import { cn } from "@/lib/cn";

type GalleryGridProps = {
  images: string[];
  photoAlt: string;
  openPhotoLabel: string;
  closeLightboxLabel: string;
};

export const GalleryGrid = ({
  images,
  photoAlt,
  openPhotoLabel,
  closeLightboxLabel,
}: GalleryGridProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const activeUrl = activeIndex !== null ? images[activeIndex] : null;

  const handleOpen = (index: number, trigger: HTMLElement) => {
    triggerRef.current = trigger;
    setImageLoaded(false);
    setActiveIndex(index);
  };

  const handleClose = useCallback(() => {
    setActiveIndex(null);
    setImageLoaded(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (activeIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeIndex, handleClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {images.map((url, index) => (
          <button
            key={url}
            type="button"
            onClick={(e) => handleOpen(index, e.currentTarget)}
            aria-label={`${openPhotoLabel} ${index + 1}`}
            className="group overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-blush active:scale-[0.98] motion-safe:transition-transform"
          >
            <Image
              src={url}
              alt={photoAlt}
              width={400}
              height={400}
              className="aspect-square w-full object-cover group-hover:scale-105 motion-safe:transition-transform motion-safe:duration-300"
              unoptimized
            />
          </button>
        ))}
      </div>

      {activeUrl && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={openPhotoLabel}
          className="fixed inset-0 z-30 flex items-center justify-center bg-ink/70 p-4"
          onClick={handleBackdropClick}
        >
          <div className="relative flex max-h-[85vh] max-w-3xl flex-col items-center">
            <button
              ref={closeButtonRef}
              type="button"
              onClick={handleClose}
              aria-label={closeLightboxLabel}
              className="absolute -top-12 right-0 z-10 inline-flex min-h-10 items-center justify-center rounded-full border-2 border-gold-light bg-transparent px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-gold-light/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-blush"
            >
              {closeLightboxLabel}
            </button>

            <div className="relative w-full overflow-hidden rounded-xl">
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Skeleton className="aspect-square w-full max-w-lg" />
                  <Spinner
                    size="md"
                    className="absolute border-t-rose"
                    aria-hidden={false}
                  />
                </div>
              )}
              <Image
                src={activeUrl}
                alt={photoAlt}
                width={800}
                height={800}
                className={cn(
                  "max-h-[75vh] w-auto max-w-full object-contain",
                  !imageLoaded && "opacity-0",
                )}
                unoptimized
                onLoad={() => setImageLoaded(true)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
