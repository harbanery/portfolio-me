import BaseLayout from "../../components/layout";
import AdminMenuGuard from "../../components/protected";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <BaseLayout>
      <AdminMenuGuard>
        <div className="px-12 py-8">{children}</div>
      </AdminMenuGuard>
    </BaseLayout>
  );
}
