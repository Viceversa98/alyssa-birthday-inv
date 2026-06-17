import { Card, Section } from "@/components/ui";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { formatRsvpDeadline, type InvitationData } from "@/lib/invitation";
import { RsvpForm } from "./RsvpForm";

type RsvpSectionProps = {
  data: InvitationData;
  locale: Locale;
};

export const RsvpSection = ({ data, locale }: RsvpSectionProps) => {
  const dict = getDictionary(locale);
  const deadline = formatRsvpDeadline(data.rsvpDeadline, locale);

  return (
    <Section
      id="rsvp"
      title={data.rsvpTitle}
      subtitle={dict.rsvp.deadline(deadline)}
    >
      <Card>
        <Card.Content className="flex flex-col items-center gap-6">
          <p className="max-w-md text-center text-base text-ink/80">
            {data.rsvpMessage}
          </p>
          <RsvpForm celebrantName={data.celebrantName} />
        </Card.Content>
      </Card>
    </Section>
  );
};
