import {
  AddToCalendar,
  Button,
  Card,
  EventDate,
  Section,
} from "@/components/ui";
import type { Locale } from "@/lib/i18n/config";
import {
  getGoogleMapsUrl,
  getWazeUrl,
  type InvitationData,
} from "@/lib/invitation";

type DetailsSectionProps = {
  data: InvitationData;
  locale: Locale;
  labels: {
    location: string;
    dressCode: string;
    googleMaps: string;
    waze: string;
    googleMapsAria: string;
    wazeAria: string;
  };
  calendarLabels: {
    google: string;
    ics: string;
    googleAria: string;
    icsAria: string;
  };
  eventTitle: string;
};

export const DetailsSection = ({
  data,
  locale,
  labels,
  calendarLabels,
  eventTitle,
}: DetailsSectionProps) => {
  const googleMapsUrl = getGoogleMapsUrl(data);
  const wazeUrl = getWazeUrl(data);

  return (
    <Section id="details" title={data.detailsTitle} subtitle={data.detailsSubtitle}>
      <Card>
        <Card.Content className="space-y-8">
          <EventDate date={data.date} timeLabel={data.timeLabel} locale={locale} />

          <div className="space-y-6 border-t border-gold-light/40 pt-8">
            <div>
              <h3 className="font-display text-lg font-medium text-gold">
                {labels.location}
              </h3>
              <p className="mt-1 text-base text-ink">{data.locationName}</p>
              <p className="text-base text-ink/70">{data.address}</p>
              <div className="mt-4 flex w-full flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap">
                <Button
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="secondary"
                  size="sm"
                  fullWidth
                  className="sm:w-auto sm:flex-1"
                  aria-label={labels.googleMapsAria}
                >
                  {labels.googleMaps}
                </Button>
                <Button
                  href={wazeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="secondary"
                  size="sm"
                  fullWidth
                  className="sm:w-auto sm:flex-1"
                  aria-label={labels.wazeAria}
                >
                  {labels.waze}
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-display text-lg font-medium text-gold">
                {labels.dressCode}
              </h3>
              <p className="mt-1 text-base text-ink/80">{data.dressCode}</p>
            </div>
          </div>

          <AddToCalendar
            data={data}
            eventTitle={eventTitle}
            labels={calendarLabels}
          />
        </Card.Content>
      </Card>
    </Section>
  );
};
