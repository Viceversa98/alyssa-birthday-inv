"use client";

import { createContext, useContext, useMemo } from "react";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary, type Dictionary } from "@/lib/i18n/get-dictionary";

type LocaleContextValue = {
  locale: Locale;
  dict: Dictionary;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

const getLocaleFallback = (): Locale => {
  if (typeof document === "undefined") {
    return DEFAULT_LOCALE;
  }

  const lang = document.documentElement.lang;
  return isLocale(lang) ? lang : DEFAULT_LOCALE;
};

type LocaleProviderProps = {
  locale: Locale;
  children: React.ReactNode;
};

export const LocaleProvider = ({ locale, children }: LocaleProviderProps) => {
  const dict = useMemo(() => getDictionary(locale), [locale]);

  return (
    <LocaleContext.Provider value={{ locale, dict }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useTranslations = () => {
  const context = useContext(LocaleContext);

  if (context) {
    return context;
  }

  const locale = getLocaleFallback();
  return { locale, dict: getDictionary(locale) };
};
