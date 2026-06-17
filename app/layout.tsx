import type { Metadata } from "next";
import { Lato, Playfair_Display } from "next/font/google";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { LocaleProvider } from "@/components/LocaleProvider";
import { getLocale } from "@/lib/i18n/get-locale";
import { DEFAULT_INVITATION } from "@/lib/invitation";
import "./globals.css";

export const dynamic = "force-dynamic";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
});

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: DEFAULT_INVITATION.pageTitle,
    description: DEFAULT_INVITATION.pageDescription,
  };
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      className={`${playfair.variable} ${lato.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-blush text-ink font-sans">
        <LocaleProvider locale={locale}>
          <LanguageSwitcher
            locale={locale}
            className="fixed top-4 right-4 z-20"
          />
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
