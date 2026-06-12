import DoctorsList from "@/components/modules/Consultation/DoctorsList";
import { getAllSpecialties, getDoctors } from "@/services/doctor.services";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

interface BookAppointmentPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const BookAppointmentPage = async ({ searchParams }: BookAppointmentPageProps) => {
  const resolvedSearchParams = await searchParams;

  const queryString = new URLSearchParams(
    Object.entries(resolvedSearchParams)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => [k, Array.isArray(v) ? v[0] : v!])
  ).toString();

  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["doctors", queryString],
      queryFn: () => getDoctors(queryString),
      staleTime: 1000 * 60 * 60,
      gcTime: 1000 * 60 * 60 * 6,
    }),
    queryClient.prefetchQuery({
      queryKey: ["specialties"],
      queryFn: () => getAllSpecialties(),
      staleTime: 1000 * 60 * 60 * 6,
      gcTime: 1000 * 60 * 60 * 24,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DoctorsList />
    </HydrationBoundary>
  );
};

export default BookAppointmentPage;