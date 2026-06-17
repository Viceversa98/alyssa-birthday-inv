"use client";

import { cn } from "@/lib/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "@/components/LocaleProvider";

export const AdminNav = () => {
  const pathname = usePathname();
  const { dict } = useTranslations();
  const t = dict.admin.nav;

  const links = [
    { href: "/admin", label: t.edit },
    { href: "/admin/rsvps", label: t.rsvps },
  ];

  return (
    <nav
      className="flex flex-col gap-2 sm:flex-row"
      aria-label="Admin navigation"
    >
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "inline-flex min-h-11 items-center justify-center rounded-full px-4 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
              isActive
                ? "bg-rose text-ink"
                : "border-2 border-gold-light text-ink hover:bg-gold-light/30",
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
};
