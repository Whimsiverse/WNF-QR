import AdminNav from '@/components/AdminNav';

export default function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="page-shell">
      <AdminNav />
      <div className="container">{children}</div>
    </div>
  );
}
