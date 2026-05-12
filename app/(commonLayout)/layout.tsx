export default function CommonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <h5>Common Layout</h5>
      {children}
    </>
  );
}
