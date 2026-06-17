"use client";

import { cn } from "@/lib/cn";
import { useTranslations } from "@/components/LocaleProvider";
import type { RsvpSubmission } from "@/lib/actions/rsvp";

type RsvpListProps = {
  responses: RsvpSubmission[];
};

const formatDate = (iso: string, locale: string) => {
  return new Date(iso).toLocaleString(locale === "ms" ? "ms-MY" : "en-MY", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export const RsvpList = ({ responses }: RsvpListProps) => {
  const { locale, dict } = useTranslations();
  const t = dict.admin.rsvpList;
  const going = responses.filter((r) => r.status === "going");
  const notGoing = responses.filter((r) => r.status === "not_going");
  const totalGuests = going.reduce(
    (sum, r) => sum + (r.guestCount ?? 1),
    0,
  );

  if (responses.length === 0) {
    return (
      <p className="rounded-xl bg-pink-light px-4 py-6 text-center text-base text-ink/70">
        {t.empty}
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-pink-light px-4 py-3 text-center">
          <p className="font-display text-2xl font-semibold text-gold">
            {totalGuests}
          </p>
          <p className="text-sm text-ink/70">{t.going}</p>
        </div>
        <div className="rounded-xl bg-pink-light px-4 py-3 text-center">
          <p className="font-display text-2xl font-semibold text-ink/60">
            {notGoing.length}
          </p>
          <p className="text-sm text-ink/70">{t.notGoing}</p>
        </div>
      </div>

      <ul className="space-y-3">
        {responses.map((response) => (
          <li
            key={response.id}
            className="rounded-xl border border-gold-light/50 bg-blush px-4 py-4"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium text-ink">{response.name}</p>
                {response.status === "going" && response.guestCount && (
                  <p className="text-base text-ink/70">
                    {t.guestCount(response.guestCount)}
                  </p>
                )}
              </div>
              <span
                className={cn(
                  "inline-flex w-fit rounded-full px-3 py-1 text-sm font-medium",
                  response.status === "going"
                    ? "bg-rose text-ink"
                    : "bg-gold-light/40 text-ink/70",
                )}
              >
                {response.status === "going"
                  ? t.statusGoing(response.guestCount ?? 1)
                  : t.statusNotGoing}
              </span>
            </div>
            {response.wishes && (
              <p className="mt-3 rounded-lg bg-pink-light/60 px-3 py-2 text-base italic text-ink/80">
                &ldquo;{response.wishes}&rdquo;
              </p>
            )}
            <p className="mt-2 text-sm text-ink/50">
              {formatDate(response.createdAt, locale)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};
