import { cn } from "@/lib/cn";
import type { Locale } from "@/lib/i18n/config";
import { formatEventDate } from "@/lib/invitation";

type EventDateProps = {
  date: Date;
  timeLabel: string;
  locale?: Locale;
  className?: string;
};

export const EventDate = ({
  date,
  timeLabel,
  locale = "ms",
  className,
}: EventDateProps) => {
  const { day, month, weekday, year } = formatEventDate(date, locale);

  return (
    <div
      className={cn(
        "flex flex-col items-center text-center sm:flex-row sm:items-center sm:gap-8 sm:text-left",
        className,
      )}
      aria-label={`${weekday}, ${month} ${day}, ${year} — ${timeLabel}`}
    >
      <div className="flex flex-col items-center sm:items-start">
        <span className="font-display text-5xl font-bold leading-none text-gold sm:text-6xl md:text-7xl">
          {day}
        </span>
        <span className="mt-1 font-display text-lg font-medium uppercase tracking-widest text-rose sm:text-xl md:text-2xl">
          {month}
        </span>
        <span className="mt-1 text-base text-ink/70">{year}</span>
      </div>

      <div
        className="my-4 h-px w-16 bg-gold-light sm:my-0 sm:h-20 sm:w-px"
        aria-hidden="true"
      />

      <div className="flex flex-col gap-1">
        <span className="font-display text-lg font-medium text-ink sm:text-xl md:text-2xl">
          {weekday}
        </span>
        <span className="text-base text-ink/80 sm:text-lg">{timeLabel}</span>
      </div>
    </div>
  );
};
