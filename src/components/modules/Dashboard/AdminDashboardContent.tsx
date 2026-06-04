"use client"

import AppointmentBarChart from "@/components/shared/AppointmentBarChart";
import AppointmentPieChart from "@/components/shared/AppointmentPieChart";
import StatsCard from "@/components/shared/StatsCard";
import { getDashboardData } from "@/services/dashboard.services";
import { ApiResponse } from "@/types/api.types";
import { IAdminDashboardData } from "@/types/dashboard.types";
import { useQuery } from "@tanstack/react-query";

const AdminDashboardContent = () => {
  const { data: adminDashboardData } = useQuery({
    queryKey: ["admin-dashboard-data"],
    queryFn: getDashboardData,
    refetchOnWindowFocus: "always",
  });
  const { data } = adminDashboardData as ApiResponse<IAdminDashboardData>
  const appointmentPieChartData = data?.pieChartData ?? data?.piChartData ?? [];
  console.log(data);
  return (
    <div>
      <StatsCard
        title="Total Appointments"
        value={data.appointmentCount}
        iconName="ClipboardClock"
        description="Number of Appointments Scheduled"
      />
      <StatsCard
        title="Total Doctors"
        value={data.doctorCount}
        iconName="CircleUserRound"
        description="Total number of Doctors"
      />
      <StatsCard
        title="Total Patient"
        value={data.patientCount}
        iconName="Users"
        description="Total number of Doctors"
      />
      <AppointmentBarChart data={data?.barChartData || []} />
      <AppointmentPieChart
        data={appointmentPieChartData}
        title="Appointment Pie Chat Data"
        description="Visual Represtation of Appointment as Pie Chart"
      />
    </div>
  );
};

export default AdminDashboardContent;
