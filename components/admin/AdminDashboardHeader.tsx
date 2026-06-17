"use client";

import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";
import { Container } from "@/components/ui";
import { useTranslations } from "@/components/LocaleProvider";
import { signOut } from "@/lib/actions/invitation";

export const AdminDashboardHeader = () => {
  const { dict } = useTranslations();
  const t = dict.admin.header;

  return (
    <header className="border-b border-gold-light/40 bg-pink-light/50 px-4 py-4">
      <Container className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-gold">
              {t.label}
            </p>
            <h1 className="font-display text-xl font-semibold text-ink sm:text-2xl">
              {t.title}
            </h1>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Link
              href="/"
              className="inline-flex min-h-11 items-center justify-center rounded-full border-2 border-gold-light px-4 py-2 text-sm font-medium text-ink hover:bg-gold-light/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              {t.viewSite}
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-rose px-4 py-2 text-sm font-medium text-ink hover:bg-rose/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:w-auto"
              >
                {t.signOut}
              </button>
            </form>
          </div>
        </div>
        <AdminNav />
      </Container>
    </header>
  );
};
