import { RsvpList } from "@/components/admin/RsvpList";
import { getRsvpResponses } from "@/lib/actions/rsvp";

export default async function AdminRsvpsPage() {
  const responses = await getRsvpResponses();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-ink sm:text-2xl">
          Guest responses
        </h2>
        <p className="mt-1 text-base text-ink/70">
          {responses.length} total response{responses.length === 1 ? "" : "s"}
        </p>
      </div>
      <RsvpList responses={responses} />
    </div>
  );
}
