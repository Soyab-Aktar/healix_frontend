import AdminDashboardContent from '@/components/modules/Dashboard/AdminDashboardContent';
import { getDashboardData } from '@/services/dashboard.services';
import { ApiResponse } from '@/types/api.types';
import { IAdminDashboardData } from '@/types/dashboard.types';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import React from 'react';

const AdminDashboradPage = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["admin-dashboard-data"],
    queryFn: getDashboardData,
  })
  const dashboardData = queryClient.getQueryData(["admin-dashboard-data"]) as ApiResponse<IAdminDashboardData>;
  console.log(dashboardData, "Dashboard data of Admin");
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminDashboardContent />
    </HydrationBoundary>
  );
};

export default AdminDashboradPage;