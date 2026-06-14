import DoctorDashboardContent from "@/components/modules/Dashboard/DoctorDashboardContent";
import { getMyAppointments } from "@/services/appointment.services";
import { getMyDoctorSchedules } from "@/services/doctorSchedule.services";
import { getMyReviews } from "@/services/review.services";
import { getUserinfo } from "@/services/auth.services";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import React from "react";

const DoctorDashboardPage = async () => {
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

  // Prefetch my schedules
  await queryClient.prefetchQuery({
    queryKey: ["my-doctor-schedules"],
    queryFn: () => getMyDoctorSchedules(""),
    staleTime: 30 * 1000,
  });

  // Prefetch my reviews
  await queryClient.prefetchQuery({
    queryKey: ["my-reviews"],
    queryFn: getMyReviews,
    staleTime: 30 * 1000,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DoctorDashboardContent userInfo={userInfo} />
    </HydrationBoundary>
  );
};

export default DoctorDashboardPage;