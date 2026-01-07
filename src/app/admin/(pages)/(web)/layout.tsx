import BaseLayout from "../../components/layout";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <BaseLayout>
      <div className="px-12 py-8">{children}</div>
    </BaseLayout>
  );
}
