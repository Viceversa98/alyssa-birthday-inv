import Image from "next/image";
import { Button, Container } from "@/components/ui";
import type { InvitationData } from "@/lib/invitation";

type HeroSectionProps = {
  data: InvitationData;
  birthdayLabel: string;
  photoAlt: string;
  ctaRsvp: string;
  ctaDetails: string;
  ctaRsvpAria: string;
  ctaDetailsAria: string;
};

export const HeroSection = ({
  data,
  birthdayLabel,
  photoAlt,
  ctaRsvp,
  ctaDetails,
  ctaRsvpAria,
  ctaDetailsAria,
}: HeroSectionProps) => {
  return (
    <header
      id="welcome"
      className="relative overflow-hidden bg-gradient-to-b from-blush via-pink-light/40 to-blush py-16 sm:py-24"
    >
      <div
        className="hero-sparkle pointer-events-none absolute inset-0 opacity-30"
        aria-hidden="true"
      />

      <Container className="relative text-center">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-gold">
          {data.heroEyebrow}
        </p>

        {data.heroImageUrl && (
          <div className="mx-auto mt-6 h-40 w-40 sm:h-48 sm:w-48">
            <Image
              src={data.heroImageUrl}
              alt={photoAlt}
              width={192}
              height={192}
              className="h-full w-full rounded-full object-cover ring-4 ring-gold-light/50"
              priority
              unoptimized
            />
          </div>
        )}

        <h1
          className={`font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl md:text-6xl ${data.heroImageUrl ? "mt-6" : "mt-4"}`}
        >
          {data.celebrantName}&apos;s
          <span className="block text-gold">{birthdayLabel}</span>
        </h1>
        <p className="mx-auto mt-6 max-w-md text-base text-ink/80 sm:text-lg md:text-xl">
          {data.tagline}
        </p>

        <div className="mx-auto mt-8 flex w-full max-w-sm flex-col gap-3 sm:max-w-md sm:flex-row sm:justify-center">
          <Button href="#rsvp" fullWidth aria-label={ctaRsvpAria}>
            {ctaRsvp}
          </Button>
          <Button
            href="#details"
            variant="secondary"
            fullWidth
            aria-label={ctaDetailsAria}
          >
            {ctaDetails}
          </Button>
        </div>
      </Container>
    </header>
  );
};
