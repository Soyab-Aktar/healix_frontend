export default function PatientDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <h5>Patient Dashboard Layout</h5>
      {children}
    </>
  );
}
