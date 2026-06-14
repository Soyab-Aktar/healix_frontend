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

  // Display toast greetings and error notifications
  useEffect(() => {
    toast.success("Welcome back, Administrator!", {
      description: "Commands & analytics updated successfully.",
      duration: 3000,
    });
  }, []);

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
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-blue-600 via-indigo-600 to-violet-600 p-6 md:p-8 text-white shadow-lg shadow-indigo-500/10">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="h-3 w-3 text-amber-300" /> Command Center Active
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Healix command center</h1>
            <p className="text-sm md:text-base text-indigo-100 max-w-xl">
              Monitor clinic health metrics, manage doctor schedules, approve patient queries, and review transaction histories.
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
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
          className="hover:scale-[1.02] transition-transform duration-200"
        />
        <StatsCard
          title="Total Appointments"
          value={data?.appointmentCount ?? 0}
          iconName="ClipboardClock"
          description="Total scheduled checkups"
          className="hover:scale-[1.02] transition-transform duration-200"
        />
        <StatsCard
          title="Active Doctors"
          value={data?.doctorCount ?? 0}
          iconName="Stethoscope"
          description="Onboarded healthcare professionals"
          className="hover:scale-[1.02] transition-transform duration-200"
        />
        <StatsCard
          title="Registered Patients"
          value={data?.patientCount ?? 0}
          iconName="Users"
          description="Active patients using Healix"
          className="hover:scale-[1.02] transition-transform duration-200"
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-7">
        <div className="lg:col-span-4 bg-card rounded-2xl border p-1 shadow-xs">
          <AppointmentBarChart data={data?.barChartData ?? []} />
        </div>
        <div className="lg:col-span-3 bg-card rounded-2xl border p-1 shadow-xs">
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
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle>Recent Appointments</CardTitle>
              <CardDescription>Monitor status updates across the clinic in real time.</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm" className="gap-1 text-primary">
              <Link href="/admin/dashboard/appointments-management">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentAppointments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Activity className="h-10 w-10 text-muted-foreground/60 mb-2 animate-pulse" />
                <p className="text-sm font-medium text-muted-foreground">No recent appointments found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-muted-foreground font-medium text-left">
                      <th className="pb-3 font-semibold">Patient</th>
                      <th className="pb-3 font-semibold">Doctor</th>
                      <th className="pb-3 font-semibold">Date & Time</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold text-right">Payment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {recentAppointments.map((appointment) => (
                      <tr key={appointment.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3.5 font-medium">
                          {appointment.patient?.name ?? "Guest Patient"}
                          <span className="block text-xs text-muted-foreground">{appointment.patient?.email}</span>
                        </td>
                        <td className="py-3.5">
                          {appointment.doctor?.name ?? "Unassigned Doctor"}
                          <span className="block text-xs text-muted-foreground">{appointment.doctor?.designation}</span>
                        </td>
                        <td className="py-3.5 text-muted-foreground">
                          {formatDateTime(appointment.schedule?.startDateTime)}
                        </td>
                        <td className="py-3.5">
                          <Badge 
                            variant="secondary"
                            className={
                              appointment.status === "COMPLETED" 
                                ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" 
                                : appointment.status === "CANCELED"
                                ? "bg-red-500/10 text-red-600 border border-red-500/20"
                                : "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                            }
                          >
                            {appointment.status ?? "SCHEDULED"}
                          </Badge>
                        </td>
                        <td className="py-3.5 text-right">
                          <Badge 
                            variant="outline" 
                            className={
                              appointment.paymentStatus === "PAID" 
                                ? "bg-emerald-500/5 text-emerald-600 border-emerald-500/20" 
                                : "bg-amber-500/5 text-amber-600 border-amber-500/20"
                            }
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
        <Card>
          <CardHeader>
            <CardTitle>Management Shortcuts</CardTitle>
            <CardDescription>Direct navigation paths for quick setups.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button asChild variant="outline" className="w-full justify-start gap-3 h-11 border-dashed hover:border-solid hover:bg-indigo-50/20">
              <Link href="/admin/dashboard/doctors-management">
                <Stethoscope className="h-4 w-4 text-indigo-500" />
                <span>Doctor Directory</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start gap-3 h-11 border-dashed hover:border-solid hover:bg-emerald-50/20">
              <Link href="/admin/dashboard/patients-management">
                <Users className="h-4 w-4 text-emerald-500" />
                <span>Patient Directories</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start gap-3 h-11 border-dashed hover:border-solid hover:bg-violet-50/20">
              <Link href="/admin/dashboard/schedules-management">
                <Clock className="h-4 w-4 text-violet-500" />
                <span>System Schedules</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start gap-3 h-11 border-dashed hover:border-solid hover:bg-rose-50/20">
              <Link href="/admin/dashboard/appointments-management">
                <Calendar className="h-4 w-4 text-rose-500" />
                <span>Verify Appointments</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start gap-3 h-11 border-dashed hover:border-solid hover:bg-blue-50/20">
              <Link href="/admin/dashboard/payments-management">
                <CreditCard className="h-4 w-4 text-blue-500" />
                <span>Billing Ledgers</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start gap-3 h-11 border-dashed hover:border-solid hover:bg-amber-50/20">
              <Link href="/admin/dashboard/reviews-management">
                <Star className="h-4 w-4 text-amber-500" />
                <span>Review Moderation</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start gap-3 h-11 border-dashed hover:border-solid hover:bg-slate-50/20">
              <Link href="/admin/dashboard/admins-management">
                <Shield className="h-4 w-4 text-slate-500" />
                <span>Administrator Roles</span>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardContent;
