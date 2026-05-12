export default function CommonProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <h5>Common Protected Layout</h5>
      {children}
    </>
  );
}
