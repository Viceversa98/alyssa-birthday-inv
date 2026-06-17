import { Button } from "./Button";
import {
  getGoogleCalendarUrl,
  getIcsDataUri,
  type InvitationData,
} from "@/lib/invitation";

type AddToCalendarProps = {
  data: InvitationData;
  eventTitle: string;
  labels: {
    google: string;
    ics: string;
    googleAria: string;
    icsAria: string;
  };
  className?: string;
};

export const AddToCalendar = ({
  data,
  eventTitle,
  labels,
  className,
}: AddToCalendarProps) => {
  const googleUrl = getGoogleCalendarUrl(data, eventTitle);
  const icsUrl = getIcsDataUri(data, eventTitle);

  return (
    <div className={className}>
      <div className="flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
        <Button
          href={googleUrl}
          target="_blank"
          rel="noopener noreferrer"
          variant="secondary"
          size="sm"
          fullWidth
          aria-label={labels.googleAria}
        >
          {labels.google}
        </Button>
        <Button
          href={icsUrl}
          download="alyssa-birthday.ics"
          variant="ghost"
          size="sm"
          fullWidth
          aria-label={labels.icsAria}
        >
          {labels.ics}
        </Button>
      </div>
    </div>
  );
};
