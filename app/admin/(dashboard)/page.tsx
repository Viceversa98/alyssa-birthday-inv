import { InvitationEditor } from "@/components/admin/InvitationEditor";
import { getInvitation } from "@/lib/get-invitation";

export default async function AdminPage() {
  const invitation = await getInvitation();

  return <InvitationEditor initialData={invitation} />;
}
