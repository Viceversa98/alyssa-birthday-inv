import { AdminDashboardHeader } from "@/components/admin/AdminDashboardHeader";
import { Container } from "@/components/ui";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminDashboardHeader />
      <div className="px-4 py-6">
        <Container>{children}</Container>
      </div>
    </>
  );
}
