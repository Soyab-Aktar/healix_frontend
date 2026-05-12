export default function DoctorDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <h5>Doctor Dashboard Layout</h5>
      {children}
    </>
  );
}
