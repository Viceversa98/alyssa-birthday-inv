"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Button, Input, Label, Textarea } from "@/components/ui";
import { useTranslations } from "@/components/LocaleProvider";
import { useWishBubbles } from "@/components/WishBubblesLayer";
import { cn } from "@/lib/cn";
import { submitRsvp } from "@/lib/actions/rsvp";
import type { RsvpStatus } from "@/db/schema";

type RsvpFormProps = {
  celebrantName: string;
};

const SuccessCheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="mx-auto size-12 text-gold animate-scale-in"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export const RsvpForm = ({ celebrantName }: RsvpFormProps) => {
  const { dict } = useTranslations();
  const wishBubbles = useWishBubbles();
  const t = dict.rsvp;
  const [status, setStatus] = useState<RsvpStatus | null>(null);
  const [message, setMessage] = useState("");
  const [wishHint, setWishHint] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const errorRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [error]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setWishHint(false);
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
        setWishHint(true);
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

  const handleReset = () => {
    setMessage("");
    setWishHint(false);
    setError("");
    setStatus(null);
  };

  if (message) {
    return (
      <div
        className="w-full animate-fade-in rounded-xl bg-pink-light px-4 py-8 text-center"
        role="status"
        aria-live="polite"
      >
        <SuccessCheckIcon />
        <p className="mt-4 text-base text-ink">{message}</p>
        {wishHint && (
          <p className="mt-2 text-sm text-gold">{t.successWishHint}</p>
        )}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mt-6"
          onClick={handleReset}
        >
          {t.submitAnother}
        </Button>
      </div>
    );
  }

  const sectionBlockClass =
    "rounded-xl border border-gold-light/50 bg-blush/50 p-4 sm:p-5";

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-5 text-left">
      <div className={sectionBlockClass}>
        <p className="mb-3 font-display text-base font-medium text-gold">
          {t.stepAttend}
        </p>
        <fieldset className="space-y-2">
          <legend className="sr-only">{t.attendingLegend}</legend>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              role="radio"
              aria-checked={status === "going"}
              tabIndex={0}
              onClick={() => setStatus("going")}
              onKeyDown={(e) => handleStatusKeyDown(e, "going")}
              className={cn(
                "min-h-12 rounded-full border-2 px-4 py-3 text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-pink-light active:scale-[0.98] motion-safe:transition-transform",
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
                "min-h-12 rounded-full border-2 px-4 py-3 text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-pink-light active:scale-[0.98] motion-safe:transition-transform",
                status === "not_going"
                  ? "border-gold bg-rose text-ink"
                  : "border-gold-light bg-blush text-ink hover:bg-pink-light/40",
              )}
            >
              {t.notGoing}
            </button>
          </div>
        </fieldset>
      </div>

      <div className={sectionBlockClass}>
        <p className="mb-3 font-display text-base font-medium text-gold">
          {t.stepDetails}
        </p>
        <div className="space-y-4">
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
            <div className="animate-fade-in space-y-1.5">
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
        </div>
      </div>

      <div className={sectionBlockClass}>
        <p className="mb-3 font-display text-base font-medium text-gold">
          {t.stepWishes}
        </p>
        <div className="space-y-1.5">
          <Label htmlFor="rsvp-wishes" className="sr-only">
            {t.wishes}
          </Label>
          <Textarea
            id="rsvp-wishes"
            name="wishes"
            rows={3}
            maxLength={500}
            placeholder={t.wishesPlaceholder(celebrantName)}
            disabled={isPending}
          />
        </div>
      </div>

      {error && (
        <p
          ref={errorRef}
          role="alert"
          className="animate-fade-in text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <Button
        type="submit"
        fullWidth
        loading={isPending}
        disabled={isPending}
        className="w-full"
      >
        {isPending ? t.sending : t.submit(celebrantName)}
      </Button>
    </form>
  );
};
