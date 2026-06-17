import Image from "next/image";
import { Section } from "@/components/ui";
import type { InvitationData } from "@/lib/invitation";

type GallerySectionProps = {
  data: InvitationData;
  title: string;
  subtitle: string;
  photoAlt: string;
};

export const GallerySection = ({
  data,
  title,
  subtitle,
  photoAlt,
}: GallerySectionProps) => {
  if (data.galleryImages.length === 0) return null;

  return (
    <Section title={title} subtitle={subtitle}>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {data.galleryImages.map((url) => (
          <div key={url} className="overflow-hidden rounded-xl">
            <Image
              src={url}
              alt={photoAlt}
              width={400}
              height={400}
              className="aspect-square w-full object-cover"
              unoptimized
            />
          </div>
        ))}
      </div>
    </Section>
  );
};
