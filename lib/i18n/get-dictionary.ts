import type { Locale } from "./config";
import { en } from "./dictionaries/en";
import { ms } from "./dictionaries/ms";

type AdminLoginDict = {
  title: string;
  subtitle: string;
  password: string;
  signIn: string;
  invalidPassword: string;
};

type AdminEditorDict = {
  hero: string;
  event: string;
  location: string;
  rsvp: string;
  images: string;
  seo: string;
  bahasaMelayu: string;
  english: string;
  eyebrow: string;
  celebrantName: string;
  tagline: string;
  heroPhoto: string;
  startDate: string;
  endDate: string;
  timeLabel: string;
  detailsTitle: string;
  detailsSubtitle: string;
  venueName: string;
  address: string;
  dressCode: string;
  rsvpTitle: string;
  rsvpDeadline: string;
  rsvpEmail: string;
  rsvpPhone: string;
  rsvpMessage: string;
  pageTitle: string;
  pageDescription: string;
  save: string;
  saving: string;
  saved: string;
  viewInvitation: string;
  failedSave: string;
};

export type Dictionary = {
  language: {
    switchLabel: string;
    ms: string;
    en: string;
    msFull: string;
    enFull: string;
    loading: string;
  };
  hero: {
    birthday: string;
    photoAlt: (name: string) => string;
    ctaRsvp: string;
    ctaDetails: string;
    ctaRsvpAria: string;
    ctaDetailsAria: string;
  };
  journey: {
    navLabel: string;
    welcome: string;
    details: string;
    gallery: string;
    rsvp: string;
  };
  details: {
    location: string;
    dressCode: string;
    googleMaps: string;
    waze: string;
    googleMapsAria: string;
    wazeAria: string;
  };
  gallery: {
    title: string;
    subtitle: string;
    photoAlt: string;
    openPhoto: string;
    closeLightbox: string;
  };
  calendar: {
    google: string;
    ics: string;
    googleAria: string;
    icsAria: string;
    eventTitle: (name: string) => string;
  };
  rsvp: {
    deadline: (date: string) => string;
    stepAttend: string;
    stepDetails: string;
    stepWishes: string;
    attendingLegend: string;
    going: string;
    notGoing: string;
    name: string;
    namePlaceholder: string;
    guestCount: string;
    guestCountHint: string;
    wishes: string;
    wishesPlaceholder: (name: string) => string;
    submit: (name: string) => string;
    sending: string;
    submitAnother: string;
    errorStatus: string;
    errorName: string;
    errorGuestCount: string;
    errorWishes: string;
    errorSave: string;
    successGoing: (name: string) => string;
    successNotGoing: string;
    successWishHint: string;
  };
  admin: {
    login: AdminLoginDict;
    header: {
      label: string;
      title: string;
      viewSite: string;
      signOut: string;
    };
    nav: {
      edit: string;
      rsvps: string;
    };
    editor: AdminEditorDict;
    upload: {
      missingFile: string;
      tooLarge: (max: string) => string;
      uploadFailed: string;
    };
    rsvpList: {
      empty: string;
      going: string;
      notGoing: string;
      statusGoing: (count: number) => string;
      statusNotGoing: string;
      guestCount: (count: number) => string;
    };
  };
};

const dictionaries: Record<Locale, Dictionary> = { ms, en };

export const getDictionary = (locale: Locale): Dictionary => dictionaries[locale];
