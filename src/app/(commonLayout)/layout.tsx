import Navbar from "@/components/modules/Home/Navbar";
import PageWrapper from "@/components/shared/PageWrapper";

export default function CommonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <PageWrapper>{children}</PageWrapper>
    </>
  );
}
