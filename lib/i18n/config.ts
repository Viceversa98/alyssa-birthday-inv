export const LOCALES = ["ms", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "ms";

export const LOCALE_COOKIE = "locale";

export const isLocale = (value: string): value is Locale =>
  LOCALES.includes(value as Locale);
