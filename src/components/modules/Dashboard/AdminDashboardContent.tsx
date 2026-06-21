"use client"

import AppointmentBarChart from "@/components/shared/AppointmentBarChart";
import AppointmentPieChart from "@/components/shared/AppointmentPieChart";
import StatsCard from "@/components/shared/StatsCard";
import { getDashboardData } from "@/services/dashboard.services";
import { getAllAppointments } from "@/services/appointment.services";
import { ApiResponse } from "@/types/api.types";
import { IAdminDashboardData } from "@/types/dashboard.types";
import { IAppointment } from "@/types/appointment.types";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Shield, 
  Stethoscope, 
  Users, 
  Calendar, 
  Clock, 
  CreditCard, 
  Star, 
  Sparkles,
  TrendingUp,
  Activity
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const AdminDashboardContent = () => {
  const { data: adminDashboardData, error: statsError } = useQuery({
    queryKey: ["admin-dashboard-data"],
    queryFn: getDashboardData,
    refetchOnWindowFocus: "always",
  });

  const { data: appointmentsResponse, error: appointmentsError } = useQuery({
    queryKey: ["admin-recent-appointments"],
    queryFn: () => getAllAppointments("limit=5"),
  });

  // Display error notifications (greeting toast removed)
  useEffect(() => {
    if (statsError) {
      toast.error("Failed to load dashboard metrics");
    }
    if (appointmentsError) {
      toast.error("Failed to retrieve recent appointments");
    }
  }, [statsError, appointmentsError]);

  const { data } = (adminDashboardData ?? { data: {} }) as ApiResponse<IAdminDashboardData>;
  const appointmentPieChartData = data?.pieChartData ?? data?.piChartData ?? [];
  const recentAppointments = (appointmentsResponse?.data ?? []).slice(0, 5);

  const formatDateTime = (value?: string | Date | null) => {
    if (!value) return "Pending";
    const dateValue = new Date(value);
    if (isNaN(dateValue.getTime())) return "Pending";
    return format(dateValue, "MMM dd, yyyy • hh:mm a");
  };

  return (
    <div className="space-y-6">
      {/* Premium Welcome Banner */}
      <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#0d9488] to-[#047857] p-6 md:p-8 text-white shadow-lg shadow-emerald-500/10">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="h-3 w-3 text-amber-300" /> Command Center Active
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Healix command center Center</h1>
            <p className="text-sm md:text-base text-teal-100/90 max-w-xl">
              Monitor clinic health metrics, manage doctor schedules, approve patient queries, and review transaction histories.
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="bg-white text-[#047857] hover:bg-teal-50 border-white rounded-full font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
              onClick={() => {
                toast.promise(Promise.resolve(), {
                  loading: "Refetching stats...",
                  success: "System telemetry updated!",
                  error: "Telemetry sync failed",
                });
              }}
            >
              Sync Telemetry
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value={data?.totalRevenue !== undefined ? `₹${Number(data.totalRevenue).toLocaleString()}` : "₹0"}
          iconName="CircleDollarSign"
          description="Total financial collections"
        />
        <StatsCard
          title="Total Appointments"
          value={data?.appointmentCount ?? 0}
          iconName="ClipboardClock"
          description="Total scheduled checkups"
        />
        <StatsCard
          title="Active Doctors"
          value={data?.doctorCount ?? 0}
          iconName="Stethoscope"
          description="Onboarded healthcare professionals"
        />
        <StatsCard
          title="Registered Patients"
          value={data?.patientCount ?? 0}
          iconName="Users"
          description="Active patients using Healix"
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <AppointmentBarChart data={data?.barChartData ?? []} />
        </div>
        <div className="lg:col-span-3">
          <AppointmentPieChart
            data={appointmentPieChartData}
            title="Appointments Distribution"
            description="Visual status summary"
          />
        </div>
      </div>

      {/* Recent Appointments & Quick Actions Grid */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {/* Recent Appointments Card */}
        <Card className="lg:col-span-2 rounded-[24px] border-slate-200/60 shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg font-bold text-slate-800">Recent Appointments</CardTitle>
              <CardDescription className="text-slate-400 font-medium">Monitor status updates across the clinic in real time.</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm" className="gap-1 text-[#047857] hover:text-[#035f43] font-semibold hover:bg-emerald-50/50 transition-colors">
              <Link href="/admin/dashboard/appointments-management">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentAppointments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Activity className="h-10 w-10 text-slate-300 mb-2 animate-pulse" />
                <p className="text-sm font-medium text-slate-500">No recent appointments found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-450 font-medium text-left">
                      <th className="pb-3 font-bold text-xs uppercase tracking-wider text-slate-400">Patient</th>
                      <th className="pb-3 font-bold text-xs uppercase tracking-wider text-slate-400">Doctor</th>
                      <th className="pb-3 font-bold text-xs uppercase tracking-wider text-slate-400">Date & Time</th>
                      <th className="pb-3 font-bold text-xs uppercase tracking-wider text-slate-400">Status</th>
                      <th className="pb-3 font-bold text-xs uppercase tracking-wider text-slate-400 text-right">Payment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentAppointments.map((appointment) => (
                      <tr key={appointment.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 font-extrabold text-slate-800">
                          {appointment.patient?.name ?? "Guest Patient"}
                          <span className="block text-xs text-slate-400 font-semibold">{appointment.patient?.email}</span>
                        </td>
                        <td className="py-3.5 font-medium text-slate-700">
                          {appointment.doctor?.name ?? "Unassigned Doctor"}
                          <span className="block text-xs text-slate-400 font-semibold">{appointment.doctor?.designation}</span>
                        </td>
                        <td className="py-3.5 text-xs text-slate-500 font-medium">
                          {formatDateTime(appointment.schedule?.startDateTime)}
                        </td>
                        <td className="py-3.5">
                          <Badge 
                            variant="secondary"
                            className={cn(
                              "rounded-full font-semibold border px-2.5 py-0.5 text-xs",
                              appointment.status === "COMPLETED" && "bg-emerald-50 text-[#047857] border-emerald-100/50",
                              appointment.status === "CANCELED" && "bg-rose-50 text-rose-700 border-rose-100/50",
                              appointment.status !== "COMPLETED" && appointment.status !== "CANCELED" && "bg-blue-50 text-blue-700 border-blue-100/50"
                            )}
                          >
                            {appointment.status ?? "SCHEDULED"}
                          </Badge>
                        </td>
                        <td className="py-3.5 text-right">
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "rounded-full font-semibold border px-2.5 py-0.5 text-xs",
                              appointment.paymentStatus === "PAID" 
                                ? "bg-emerald-50 text-[#047857] border-emerald-100/50" 
                                : "bg-amber-50 text-amber-700 border-amber-100/50"
                            )}
                          >
                            {appointment.paymentStatus ?? "UNPAID"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions Panel */}
        <Card className="rounded-[24px] border-slate-200/60 shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-800">Management Shortcuts</CardTitle>
            <CardDescription className="text-slate-400 font-medium">Direct navigation paths for quick setups.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button asChild variant="outline" className="w-full justify-start h-11 border-dashed hover:border-solid border-slate-200/60 hover:border-emerald-300 hover:bg-emerald-50/30 hover:scale-[1.01] transition-all duration-200 rounded-xl cursor-pointer">
              <Link href="/admin/dashboard/doctors-management" className="flex items-center gap-3 w-full px-3">
                <Stethoscope className="h-4 w-4 text-[#047857]" />
                <span className="text-sm font-semibold text-slate-700">Doctor Directory</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start h-11 border-dashed hover:border-solid border-slate-200/60 hover:border-emerald-300 hover:bg-emerald-50/30 hover:scale-[1.01] transition-all duration-200 rounded-xl cursor-pointer">
              <Link href="/admin/dashboard/patients-management" className="flex items-center gap-3 w-full px-3">
                <Users className="h-4 w-4 text-[#047857]" />
                <span className="text-sm font-semibold text-slate-700">Patient Directories</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start h-11 border-dashed hover:border-solid border-slate-200/60 hover:border-emerald-300 hover:bg-emerald-50/30 hover:scale-[1.01] transition-all duration-200 rounded-xl cursor-pointer">
              <Link href="/admin/dashboard/schedules-management" className="flex items-center gap-3 w-full px-3">
                <Clock className="h-4 w-4 text-[#047857]" />
                <span className="text-sm font-semibold text-slate-700">System Schedules</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start h-11 border-dashed hover:border-solid border-slate-200/60 hover:border-emerald-300 hover:bg-emerald-50/30 hover:scale-[1.01] transition-all duration-200 rounded-xl cursor-pointer">
              <Link href="/admin/dashboard/appointments-management" className="flex items-center gap-3 w-full px-3">
                <Calendar className="h-4 w-4 text-[#047857]" />
                <span className="text-sm font-semibold text-slate-700">Verify Appointments</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start h-11 border-dashed hover:border-solid border-slate-200/60 hover:border-emerald-300 hover:bg-emerald-50/30 hover:scale-[1.01] transition-all duration-200 rounded-xl cursor-pointer">
              <Link href="/admin/dashboard/payments-management" className="flex items-center gap-3 w-full px-3">
                <CreditCard className="h-4 w-4 text-[#047857]" />
                <span className="text-sm font-semibold text-slate-700">Billing Ledgers</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start h-11 border-dashed hover:border-solid border-slate-200/60 hover:border-emerald-300 hover:bg-emerald-50/30 hover:scale-[1.01] transition-all duration-200 rounded-xl cursor-pointer">
              <Link href="/admin/dashboard/reviews-management" className="flex items-center gap-3 w-full px-3">
                <Star className="h-4 w-4 text-[#047857]" />
                <span className="text-sm font-semibold text-slate-700">Review Moderation</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start h-11 border-dashed hover:border-solid border-slate-200/60 hover:border-emerald-300 hover:bg-emerald-50/30 hover:scale-[1.01] transition-all duration-200 rounded-xl cursor-pointer">
              <Link href="/admin/dashboard/admins-management" className="flex items-center gap-3 w-full px-3">
                <Shield className="h-4 w-4 text-[#047857]" />
                <span className="text-sm font-semibold text-slate-700">Administrator Roles</span>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardContent;
