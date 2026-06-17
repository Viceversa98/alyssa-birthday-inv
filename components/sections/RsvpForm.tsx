"use client";

import { useState, useTransition } from "react";
import { Button, Input, Label, Textarea } from "@/components/ui";
import { useTranslations } from "@/components/LocaleProvider";
import { useWishBubbles } from "@/components/WishBubblesLayer";
import { cn } from "@/lib/cn";
import { submitRsvp } from "@/lib/actions/rsvp";
import type { RsvpStatus } from "@/db/schema";

type RsvpFormProps = {
  celebrantName: string;
};

export const RsvpForm = ({ celebrantName }: RsvpFormProps) => {
  const { dict } = useTranslations();
  const wishBubbles = useWishBubbles();
  const t = dict.rsvp;
  const [status, setStatus] = useState<RsvpStatus | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!status) {
      setError(t.errorStatus);
      return;
    }

    const formData = new FormData(e.currentTarget);
    formData.set("status", status);

    const form = e.currentTarget;
    const submittedName = formData.get("name") as string;
    const submittedWishes = (formData.get("wishes") as string)?.trim();

    startTransition(async () => {
      const result = await submitRsvp(formData);
      if (result.error) {
        setError(result.error);
        return;
      }

      if (submittedWishes && wishBubbles) {
        wishBubbles.addWish({
          id: `temp-${Date.now()}`,
          name: submittedName,
          wishes: submittedWishes,
        });
      }

      setMessage(
        status === "going"
          ? t.successGoing(submittedName)
          : t.successNotGoing,
      );
      form.reset();
      setStatus(null);
    });
  };

  const handleStatusKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    next: RsvpStatus,
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setStatus(next);
    }
  };

  if (message) {
    return (
      <div
        className="rounded-xl bg-pink-light px-4 py-6 text-center"
        role="status"
      >
        <p className="text-base text-ink">{message}</p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mt-4"
          onClick={() => setMessage("")}
        >
          {t.submitAnother}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-5 text-left">
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-ink">
          {t.attendingLegend}
        </legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            role="radio"
            aria-checked={status === "going"}
            tabIndex={0}
            onClick={() => setStatus("going")}
            onKeyDown={(e) => handleStatusKeyDown(e, "going")}
            className={cn(
              "min-h-12 rounded-full border-2 px-4 py-3 text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-pink-light",
              status === "going"
                ? "border-gold bg-rose text-ink"
                : "border-gold-light bg-blush text-ink hover:bg-pink-light/40",
            )}
          >
            {t.going}
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={status === "not_going"}
            tabIndex={0}
            onClick={() => setStatus("not_going")}
            onKeyDown={(e) => handleStatusKeyDown(e, "not_going")}
            className={cn(
              "min-h-12 rounded-full border-2 px-4 py-3 text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-pink-light",
              status === "not_going"
                ? "border-gold bg-rose text-ink"
                : "border-gold-light bg-blush text-ink hover:bg-pink-light/40",
            )}
          >
            {t.notGoing}
          </button>
        </div>
      </fieldset>

      <div className="space-y-1.5">
        <Label htmlFor="rsvp-name">{t.name}</Label>
        <Input
          id="rsvp-name"
          name="name"
          required
          autoComplete="name"
          placeholder={t.namePlaceholder}
          disabled={isPending}
        />
      </div>

      {status === "going" && (
        <div className="space-y-1.5">
          <Label htmlFor="rsvp-guest-count">{t.guestCount}</Label>
          <p className="text-sm text-ink/60">{t.guestCountHint}</p>
          <Input
            id="rsvp-guest-count"
            name="guestCount"
            type="number"
            min={1}
            max={50}
            defaultValue={1}
            required
            disabled={isPending}
          />
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="rsvp-wishes">{t.wishes}</Label>
        <Textarea
          id="rsvp-wishes"
          name="wishes"
          rows={3}
          maxLength={500}
          placeholder={t.wishesPlaceholder(celebrantName)}
          disabled={isPending}
        />
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}

      <Button type="submit" fullWidth disabled={isPending} className="w-full">
        {isPending ? t.sending : t.submit(celebrantName)}
      </Button>
    </form>
  );
};
