import type { InvitationEnglishCopy } from "@/db/schema";
import type { Locale } from "@/lib/i18n/config";

export const INVITATION_ID = "00000000-0000-0000-0000-000000000001";

export type { InvitationEnglishCopy };

export type InvitationData = {
  celebrantName: string;
  tagline: string;
  heroEyebrow: string;
  date: Date;
  endDate?: Date;
  timeLabel: string;
  locationName: string;
  address: string;
  dressCode: string;
  rsvpDeadline: Date;
  rsvpEmail: string;
  rsvpPhone?: string;
  rsvpMessage: string;
  detailsTitle: string;
  detailsSubtitle: string;
  rsvpTitle: string;
  pageTitle: string;
  pageDescription: string;
  heroImageUrl?: string | null;
  galleryImages: string[];
  contentEn?: InvitationEnglishCopy;
};

export const DEFAULT_CONTENT_EN: InvitationEnglishCopy = {
  tagline: "Please join us for an afternoon of celebration",
  heroEyebrow: "You're invited",
  timeLabel: "2:00 PM – 6:00 PM",
  dressCode: "Garden party chic — soft pinks and golds welcome",
  rsvpMessage:
    "Let us know if you'll be joining the celebration. We'd love to see you there!",
  detailsTitle: "Event Details",
  detailsSubtitle: "We can't wait to celebrate with you",
  rsvpTitle: "RSVP",
  pageTitle: "You're Invited — Alyssa's Birthday",
  pageDescription:
    "Join us to celebrate Alyssa's birthday. View event details and RSVP.",
};

export const DEFAULT_INVITATION: InvitationData = {
  celebrantName: "Alyssa",
  tagline: "Sila sertai kami untuk petang penuh dengan sambutan",
  heroEyebrow: "Anda dijemput",
  date: new Date("2026-07-15T14:00:00"),
  endDate: new Date("2026-07-15T18:00:00"),
  timeLabel: "2:00 petang – 6:00 petang",
  locationName: "The Garden Pavilion",
  address: "123 Rose Lane, Springfield",
  dressCode: "Gaya garden party — warna merah jambu lembut dan emas dialu-alukan",
  rsvpDeadline: new Date("2026-07-01T23:59:59"),
  rsvpEmail: "rsvp@example.com",
  rsvpMessage:
    "Beritahu kami jika anda akan menyertai sambutan. Kami ingin berjumpa dengan anda!",
  detailsTitle: "Butiran Acara",
  detailsSubtitle: "Kami tidak sabar untuk meraikan bersama anda",
  rsvpTitle: "Pengesahan Kehadiran",
  pageTitle: "Anda Dijemput — Hari Lahir Alyssa",
  pageDescription:
    "Sertai kami meraikan hari lahir Alyssa. Lihat butiran acara dan sahkan kehadiran.",
  heroImageUrl: null,
  galleryImages: [],
  contentEn: DEFAULT_CONTENT_EN,
};

const localeToDateLocale = (locale: Locale) =>
  locale === "ms" ? "ms-MY" : "en-MY";

export const formatEventDate = (date: Date, locale: Locale = "ms") => {
  const dateLocale = localeToDateLocale(locale);

  return {
    day: date.getDate(),
    month: date.toLocaleDateString(dateLocale, { month: "long" }),
    weekday: date.toLocaleDateString(dateLocale, { weekday: "long" }),
    year: date.getFullYear(),
  };
};

export const formatRsvpDeadline = (date: Date, locale: Locale = "ms") => {
  return date.toLocaleDateString(localeToDateLocale(locale), {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export const localizeInvitation = (
  data: InvitationData,
  locale: Locale,
): InvitationData => {
  if (locale === "ms" || !data.contentEn) {
    return data;
  }

  const en = data.contentEn;

  return {
    ...data,
    tagline: en.tagline || data.tagline,
    heroEyebrow: en.heroEyebrow || data.heroEyebrow,
    timeLabel: en.timeLabel || data.timeLabel,
    dressCode: en.dressCode || data.dressCode,
    rsvpMessage: en.rsvpMessage || data.rsvpMessage,
    detailsTitle: en.detailsTitle || data.detailsTitle,
    detailsSubtitle: en.detailsSubtitle || data.detailsSubtitle,
    rsvpTitle: en.rsvpTitle || data.rsvpTitle,
    pageTitle: en.pageTitle || data.pageTitle,
    pageDescription: en.pageDescription || data.pageDescription,
  };
};

export const getGoogleCalendarUrl = (
  config: InvitationData,
  eventTitle: string,
) => {
  const start =
    config.date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const end =
    (config.endDate ?? config.date).toISOString().replace(/[-:]/g, "").split(".")[0] +
    "Z";
  const title = encodeURIComponent(eventTitle);
  const details = encodeURIComponent(config.tagline);
  const location = encodeURIComponent(
    `${config.locationName}, ${config.address}`,
  );

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
};

export const getIcsDataUri = (config: InvitationData, eventTitle: string) => {
  const formatIcsDate = (date: Date) =>
    date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Alyssa Birthday//EN",
    "BEGIN:VEVENT",
    `DTSTART:${formatIcsDate(config.date)}`,
    `DTEND:${formatIcsDate(config.endDate ?? config.date)}`,
    `SUMMARY:${eventTitle}`,
    `DESCRIPTION:${config.tagline}`,
    `LOCATION:${config.locationName}, ${config.address}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
};

export const getLocationQuery = (config: InvitationData) =>
  `${config.locationName}, ${config.address}`;

export const getGoogleMapsUrl = (config: InvitationData) => {
  const query = encodeURIComponent(getLocationQuery(config));
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
};

export const getWazeUrl = (config: InvitationData) => {
  const query = encodeURIComponent(getLocationQuery(config));
  return `https://www.waze.com/ul?q=${query}&navigate=yes`;
};

export const parseContentEn = (formData: FormData): InvitationEnglishCopy => ({
  tagline: (formData.get("contentEn.tagline") as string) || undefined,
  heroEyebrow: (formData.get("contentEn.heroEyebrow") as string) || undefined,
  timeLabel: (formData.get("contentEn.timeLabel") as string) || undefined,
  dressCode: (formData.get("contentEn.dressCode") as string) || undefined,
  rsvpMessage: (formData.get("contentEn.rsvpMessage") as string) || undefined,
  detailsTitle:
    (formData.get("contentEn.detailsTitle") as string) || undefined,
  detailsSubtitle:
    (formData.get("contentEn.detailsSubtitle") as string) || undefined,
  rsvpTitle: (formData.get("contentEn.rsvpTitle") as string) || undefined,
  pageTitle: (formData.get("contentEn.pageTitle") as string) || undefined,
  pageDescription:
    (formData.get("contentEn.pageDescription") as string) || undefined,
});

export const invitationToFormValues = (data: InvitationData) => {
  const en = data.contentEn ?? DEFAULT_CONTENT_EN;

  return {
    celebrantName: data.celebrantName,
    tagline: data.tagline,
    heroEyebrow: data.heroEyebrow,
    date: data.date.toISOString().slice(0, 16),
    endDate: data.endDate?.toISOString().slice(0, 16) ?? "",
    timeLabel: data.timeLabel,
    locationName: data.locationName,
    address: data.address,
    dressCode: data.dressCode,
    rsvpDeadline: data.rsvpDeadline.toISOString().slice(0, 16),
    rsvpEmail: data.rsvpEmail,
    rsvpPhone: data.rsvpPhone ?? "",
    rsvpMessage: data.rsvpMessage,
    detailsTitle: data.detailsTitle,
    detailsSubtitle: data.detailsSubtitle,
    rsvpTitle: data.rsvpTitle,
    pageTitle: data.pageTitle,
    pageDescription: data.pageDescription,
    heroImageUrl: data.heroImageUrl ?? "",
    galleryImages: data.galleryImages,
    contentEn: {
      tagline: en.tagline ?? "",
      heroEyebrow: en.heroEyebrow ?? "",
      timeLabel: en.timeLabel ?? "",
      dressCode: en.dressCode ?? "",
      rsvpMessage: en.rsvpMessage ?? "",
      detailsTitle: en.detailsTitle ?? "",
      detailsSubtitle: en.detailsSubtitle ?? "",
      rsvpTitle: en.rsvpTitle ?? "",
      pageTitle: en.pageTitle ?? "",
      pageDescription: en.pageDescription ?? "",
    },
  };
};
