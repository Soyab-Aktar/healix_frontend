export default function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <h5>Admin Dashboard Layout</h5>
      {children}
    </>
  );
}
