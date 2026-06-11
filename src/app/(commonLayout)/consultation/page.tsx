import DoctorsList from '@/components/modules/Consultation/DoctorsList';
import { getDoctors } from '@/services/doctor.services';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

interface ConsultationPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const ConsultationPage = async ({ searchParams }: ConsultationPageProps) => {
  const resolvedSearchParams = await searchParams;

  const queryString = new URLSearchParams(
    Object.entries(resolvedSearchParams)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => [k, Array.isArray(v) ? v[0] : v!])
  ).toString();

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["doctors", queryString],
    queryFn: () => getDoctors(queryString),
    staleTime: 1000 * 60 * 60,      // 1 hour
    gcTime: 1000 * 60 * 60 * 6,     // 6 hours
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DoctorsList />
    </HydrationBoundary>
  );
};

export default ConsultationPage;