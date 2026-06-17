"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui";
import { cn } from "@/lib/cn";
import { setLocale } from "@/lib/i18n/actions";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

type LanguageSwitcherProps = {
  locale: Locale;
  className?: string;
};

export const LanguageSwitcher = ({ locale, className }: LanguageSwitcherProps) => {
  const dict = getDictionary(locale);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSelect = (next: Locale) => {
    if (next === locale || isPending) return;

    startTransition(async () => {
      await setLocale(next);
      router.refresh();
    });
  };

  const options: { value: Locale; label: string; fullLabel: string }[] = [
    { value: "ms", label: dict.language.ms, fullLabel: dict.language.msFull },
    { value: "en", label: dict.language.en, fullLabel: dict.language.enFull },
  ];

  return (
    <div
      className={cn("flex items-center gap-1", className)}
      role="group"
      aria-label={dict.language.switchLabel}
      aria-busy={isPending}
    >
      <span className="sr-only" aria-live="polite">
        {isPending ? dict.language.loading : ""}
      </span>
      {options.map((option) => {
        const isActive = locale === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => handleSelect(option.value)}
            disabled={isPending}
            aria-pressed={isActive}
            aria-label={option.fullLabel}
            className={cn(
              "relative min-h-9 min-w-11 rounded-full px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-blush",
              isActive
                ? "bg-rose text-ink"
                : "border border-gold-light/60 bg-blush/80 text-ink/80 hover:bg-pink-light/60",
              isPending && "opacity-70",
            )}
          >
            {isPending && isActive && (
              <Spinner
                size="sm"
                className="absolute inset-0 m-auto border-t-rose"
              />
            )}
            <span className={cn(isPending && isActive && "opacity-0")}>
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
