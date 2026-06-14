import PatientDashboardContent from "@/components/modules/Dashboard/PatientDashboardContent";
import { getMyAppointments } from "@/services/appointment.services";
import { getMyPrescriptions } from "@/services/prescription.services";
import { getUserinfo } from "@/services/auth.services";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import React from "react";

const PatientDashboardPage = async () => {
  const userInfo = await getUserinfo();

  if (!userInfo) {
    redirect("/login");
  }

  const queryClient = new QueryClient();

  // Prefetch my appointments
  await queryClient.prefetchQuery({
    queryKey: ["my-appointments"],
    queryFn: getMyAppointments,
    staleTime: 30 * 1000,
  });

  // Prefetch my prescriptions
  await queryClient.prefetchQuery({
    queryKey: ["my-prescriptions"],
    queryFn: getMyPrescriptions,
    staleTime: 30 * 1000,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PatientDashboardContent userInfo={userInfo} />
    </HydrationBoundary>
  );
};

export default PatientDashboardPage;