import { Section } from "@/components/ui";
import type { InvitationData } from "@/lib/invitation";
import { GalleryGrid } from "./GalleryGrid";

type GallerySectionProps = {
  data: InvitationData;
  title: string;
  subtitle: string;
  photoAlt: string;
  openPhotoLabel: string;
  closeLightboxLabel: string;
};

export const GallerySection = ({
  data,
  title,
  subtitle,
  photoAlt,
  openPhotoLabel,
  closeLightboxLabel,
}: GallerySectionProps) => {
  if (data.galleryImages.length === 0) return null;

  return (
    <Section id="gallery" title={title} subtitle={subtitle}>
      <GalleryGrid
        images={data.galleryImages}
        photoAlt={photoAlt}
        openPhotoLabel={openPhotoLabel}
        closeLightboxLabel={closeLightboxLabel}
      />
    </Section>
  );
};
