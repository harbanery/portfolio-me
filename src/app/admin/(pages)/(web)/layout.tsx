import { redirect } from "next/navigation";
import BaseLayout from "../../components/layout";
import AdminMenuGuard from "../../components/protected";
import { verifyServerSession } from "@/lib/auth/server";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Verify session on server side
  const isAuthenticated = await verifyServerSession();

  if (!isAuthenticated) {
    redirect("/admin/auth");
  }

  return (
    <BaseLayout>
      <AdminMenuGuard>
        <div className="px-12 py-8">{children}</div>
      </AdminMenuGuard>
    </BaseLayout>
  );
}
