import type { Metadata } from "next";
import { WishBubblesLayer } from "@/components/WishBubblesLayer";
import { DetailsSection } from "@/components/sections/DetailsSection";
import { FloatingBalloons } from "@/components/sections/FloatingBalloons";
import { GallerySection } from "@/components/sections/GallerySection";
import { HeroSection } from "@/components/sections/HeroSection";
import { RsvpSection } from "@/components/sections/RsvpSection";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { localizeInvitation } from "@/lib/invitation";
import { getInvitation } from "@/lib/get-invitation";
import { getPublicWishes } from "@/lib/get-public-wishes";

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = await getLocale();
  const invitation = localizeInvitation(await getInvitation(), locale);

  return {
    title: invitation.pageTitle,
    description: invitation.pageDescription,
  };
};

export default async function Home() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const invitation = localizeInvitation(await getInvitation(), locale);
  const publicWishes = await getPublicWishes();

  return (
    <WishBubblesLayer initialWishes={publicWishes}>
      <main className="relative z-10 min-h-full flex-1">
        <HeroSection
          data={invitation}
          birthdayLabel={dict.hero.birthday}
          photoAlt={dict.hero.photoAlt(invitation.celebrantName)}
        />
        <DetailsSection
          data={invitation}
          locale={locale}
          labels={{
            location: dict.details.location,
            dressCode: dict.details.dressCode,
            googleMaps: dict.details.googleMaps,
            waze: dict.details.waze,
            googleMapsAria: dict.details.googleMapsAria,
            wazeAria: dict.details.wazeAria,
          }}
          calendarLabels={{
            google: dict.calendar.google,
            ics: dict.calendar.ics,
            googleAria: dict.calendar.googleAria,
            icsAria: dict.calendar.icsAria,
          }}
          eventTitle={dict.calendar.eventTitle(invitation.celebrantName)}
        />
        {invitation.galleryImages.length > 0 && (
          <GallerySection
            data={invitation}
            title={dict.gallery.title}
            subtitle={dict.gallery.subtitle}
            photoAlt={dict.gallery.photoAlt}
          />
        )}
        <RsvpSection data={invitation} locale={locale} />
      </main>
      <FloatingBalloons />
    </WishBubblesLayer>
  );
}
