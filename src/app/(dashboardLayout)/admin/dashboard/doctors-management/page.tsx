import DoctorsTable from '@/components/modules/Admin/DoctorsManagement/DoctorsTable';
import { getDoctors } from '@/services/doctor.services';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import React from 'react';

const DoctorManagementPage = async ({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) => {
  const queryParamsObjects = await searchParams;
  const queryString = Object.keys(queryParamsObjects)
    .map((key) => {
      const value = queryParamsObjects[key];
      if (value === undefined) {
        return "";
      }

      if (Array.isArray(value)) {
        return value
          .map((v) => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`)
          .join("&");
      }

      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    })
    .filter(Boolean)
    .join("&");
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["doctors", queryParamsObjects],
    queryFn: () => getDoctors(queryString),
    staleTime: 1000 * 60 * 60,  // 1hr
    gcTime: 1000 * 60 * 60 * 6, // 6hr
  })
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DoctorsTable queryString={queryString} queryParamsObjects={queryParamsObjects} />
    </HydrationBoundary>
  );
};

export default DoctorManagementPage;