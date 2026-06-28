"use client"

import { useQuery } from "@tanstack/react-query";
import { getMyAppointments } from "@/services/appointment.services";
import { getMyDoctorSchedules } from "@/services/doctorSchedule.services";
import { getMyReviews } from "@/services/review.services";
import { ApiResponse } from "@/types/api.types";
import { IAppointment } from "@/types/appointment.types";
import { IDoctorSchedule } from "@/types/doctorSchedule.types";
import { IReview } from "@/types/review.types";
import { UserInfo } from "@/types/user.type";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  FileText, 
  Clock, 
  Star, 
  ArrowRight, 
  Activity, 
  Stethoscope, 
  Sparkles,
  Users,
  Compass,
  Smile,
  ShieldCheck,
  Plus
} from "lucide-react";
import Link from "next/link";
import { format, isToday } from "date-fns";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface DoctorDashboardContentProps {
  userInfo: UserInfo;
}

const DoctorDashboardContent = ({ userInfo }: DoctorDashboardContentProps) => {
  const { data: appointmentsResponse, error: appointmentsError } = useQuery({
    queryKey: ["my-appointments"],
    queryFn: getMyAppointments,
    refetchOnWindowFocus: "always",
  });

  const { data: schedulesResponse, error: schedulesError } = useQuery({
    queryKey: ["my-doctor-schedules"],
    queryFn: () => getMyDoctorSchedules(""),
    refetchOnWindowFocus: "always",
  });

  const { data: reviewsResponse, error: reviewsError } = useQuery({
    queryKey: ["my-reviews"],
    queryFn: getMyReviews,
    refetchOnWindowFocus: "always",
  });

  const appointments = appointmentsResponse?.data ?? [];
  const schedules = schedulesResponse?.data ?? [];
  const reviews = reviewsResponse?.data ?? [];

  // Query failure alerts (toast welcome removed)
  useEffect(() => {
    if (appointmentsError) {
      toast.error("Failed to load appointments");
    }
    if (schedulesError) {
      toast.error("Failed to load doctor schedules");
    }
    if (reviewsError) {
      toast.error("Failed to load patient reviews");
    }
  }, [appointmentsError, schedulesError, reviewsError]);

  // Derive metrics
  const todayAppointments = useMemo(() => {
    return appointments.filter((a) => {
      const start = a.schedule?.startDateTime ?? a.appointmentStart;
      if (!start) return false;
      return isToday(new Date(start));
    });
  }, [appointments]);

  const activeSchedulesCount = useMemo(() => {
    return schedules.filter((s) => s.isBooked === false).length;
  }, [schedules]);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return "0.0";
    const sum = reviews.reduce((acc, r) => acc + (r.rating ?? 0), 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews]);

  const recentReviews = useMemo(() => {
    return [...reviews]
      .sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
      })
      .slice(0, 3);
  }, [reviews]);

  const recentAppointments = useMemo(() => {
    const now = Date.now();

    const upcoming = [...appointments].filter((a) => {
      const isScheduled = a.status === "SCHEDULED" || a.status === "INPROGRESS";
      const start = a.schedule?.startDateTime ?? a.appointmentStart;
      const startTime = start ? new Date(start).getTime() : 0;
      return isScheduled && startTime > now;
    }).sort((a, b) => {
      const aStart = a.schedule?.startDateTime ?? a.appointmentStart;
      const bStart = b.schedule?.startDateTime ?? b.appointmentStart;
      const aTime = aStart ? new Date(aStart).getTime() : 0;
      const bTime = bStart ? new Date(bStart).getTime() : 0;
      return aTime - bTime;
    });

    const past = [...appointments].filter((a) => {
      const isScheduled = a.status === "SCHEDULED" || a.status === "INPROGRESS";
      const start = a.schedule?.startDateTime ?? a.appointmentStart;
      const startTime = start ? new Date(start).getTime() : 0;
      return !isScheduled || startTime <= now;
    }).sort((a, b) => {
      const aStart = a.schedule?.startDateTime ?? a.appointmentStart;
      const bStart = b.schedule?.startDateTime ?? b.appointmentStart;
      const aTime = aStart ? new Date(aStart).getTime() : 0;
      const bTime = bStart ? new Date(bStart).getTime() : 0;
      return bTime - aTime;
    });

    return [...upcoming, ...past].slice(0, 3);
  }, [appointments]);

  const formatDateTime = (value?: string | Date | null) => {
    if (!value) return "Pending";
    const dateValue = new Date(value);
    if (isNaN(dateValue.getTime())) return "Pending";
    return format(dateValue, "MMM dd, yyyy • hh:mm a");
  };

  return (
    <div className="space-y-6">
      {/* Welcome Practitioner Card */}
      <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#0d9488] to-[#047857] p-6 md:p-8 text-white shadow-lg shadow-emerald-500/10">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold backdrop-blur-md">
              <ShieldCheck className="h-3.5 w-3.5 text-white/90" /> Practitioner Command
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Welcome back, Dr. {userInfo.name}</h1>
            <p className="text-sm md:text-base text-teal-100/90 max-w-xl">
              Track your diagnostic sessions, write electronic prescriptions, configure available time-slots, and inspect reviews.
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" className="bg-white text-[#047857] hover:bg-teal-50 border-white rounded-lg font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all">
              <Link href="/doctor/dashboard/my-schedules">
                <Plus className="mr-1.5 h-4 w-4" /> Add Slot
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Doctor Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Today's Appointments */}
        <Card className="hover:scale-[1.02] hover:shadow-md transition-all duration-250 border-slate-200/60 rounded-[20px] shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-slate-500">Today's Visits</CardTitle>
            <div className="h-9 w-9 rounded-[12px] bg-emerald-50 text-[#047857] flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-extrabold text-[#047857]">{todayAppointments.length}</div>
            <p className="text-xs text-slate-400 font-medium">Sessions scheduled for today</p>
          </CardContent>
        </Card>

        {/* Total Appointments */}
        <Card className="hover:scale-[1.02] hover:shadow-md transition-all duration-250 border-slate-200/60 rounded-[20px] shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-slate-500">Total Appointments</CardTitle>
            <div className="h-9 w-9 rounded-[12px] bg-emerald-50 text-[#047857] flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-extrabold text-slate-800">{appointments.length}</div>
            <p className="text-xs text-slate-400 font-medium">Total diagnostic encounters</p>
          </CardContent>
        </Card>

        {/* Available Schedules */}
        <Card className="hover:scale-[1.02] hover:shadow-md transition-all duration-250 border-slate-200/60 rounded-[20px] shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-slate-500">Active Slots</CardTitle>
            <div className="h-9 w-9 rounded-[12px] bg-emerald-50 text-[#047857] flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-extrabold text-[#047857]">{activeSchedulesCount}</div>
            <p className="text-xs text-slate-400 font-medium">Available slots for booking</p>
          </CardContent>
        </Card>

        {/* Average Reviews */}
        <Card className="hover:scale-[1.02] hover:shadow-md transition-all duration-250 border-slate-200/60 rounded-[20px] shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-slate-500">Clinic Rating</CardTitle>
            <div className="h-9 w-9 rounded-[12px] bg-emerald-50 text-[#047857] flex items-center justify-center">
              <Star className="w-5 h-5 fill-[#047857] text-[#047857]" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-extrabold text-[#047857] flex items-center gap-1.5">
              {averageRating} <span className="text-xs text-slate-400 font-medium">({reviews.length} reviews)</span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Patient review telemetry</p>
          </CardContent>
        </Card>
      </div>

      {/* Grid Content: Patient visits (col-span-2) & Reviews feed (col-span-1) */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {/* Recent Appointments */}
        <Card className="lg:col-span-2 rounded-[24px] border-slate-200/60 shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg font-bold text-slate-800">
                Recent Appointments
              </CardTitle>
              <CardDescription className="text-slate-400 font-medium">
                Your upcoming scheduled consultations and recent patient encounters.
              </CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm" className="gap-1 text-[#047857] hover:text-[#035f43] font-semibold hover:bg-emerald-50/50 transition-colors">
              <Link href="/doctor/dashboard/appointments">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentAppointments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed border-slate-200 rounded-2xl">
                <Stethoscope className="h-10 w-10 text-slate-300 mb-2 animate-pulse" />
                <p className="text-sm font-semibold text-slate-700">No appointments found</p>
                <p className="text-xs text-slate-400 mt-1">Configure slot availability in Schedules to accept bookings.</p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {recentAppointments.map((appointment) => (
                  <div 
                    key={appointment.id} 
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-[20px] border border-slate-200/60 bg-slate-50/30 hover:bg-slate-50/80 hover:border-emerald-100/80 transition-all duration-200"
                  >
                    <div className="space-y-1">
                      <div className="font-extrabold text-slate-800 text-base">{appointment.patient?.name || "Patient visit"}</div>
                      <div className="text-xs text-slate-400 font-semibold">{appointment.patient?.email}</div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 font-medium">
                        <Clock className="h-3.5 w-3.5 text-[#047857]" />
                        <span>{formatDateTime(appointment.schedule?.startDateTime ?? appointment.appointmentStart)}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="flex gap-2">
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "bg-white rounded-full font-semibold border-slate-200/60 px-2.5 py-0.5 text-xs",
                            appointment.status === "SCHEDULED" && "text-blue-700 bg-blue-50/20 border-blue-100",
                            appointment.status === "COMPLETED" && "text-[#047857] bg-emerald-50/20 border-emerald-100",
                            appointment.status === "CANCELED" && "text-rose-700 bg-rose-50/20 border-rose-100"
                          )}
                        >
                          {appointment.status}
                        </Badge>
                        <Badge 
                          variant="secondary"
                          className={cn(
                            "rounded-full font-semibold border px-2.5 py-0.5 text-xs",
                            appointment.paymentStatus === "PAID" 
                              ? "bg-emerald-50 text-[#047857] border-emerald-100/50" 
                              : "bg-amber-50 text-amber-700 border-amber-100/50"
                          )}
                        >
                          {appointment.paymentStatus}
                        </Badge>
                      </div>
                      
                      <Button asChild size="sm" variant="outline" className="w-full sm:w-auto rounded-lg border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold">
                        <Link href="/doctor/dashboard/appointments">
                          Manage
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reviews Feed */}
        <Card className="rounded-[24px] border-slate-200/60 shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg font-bold text-slate-800">Recent Reviews</CardTitle>
              <CardDescription className="text-slate-400 font-medium">Clinical evaluations.</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm" className="gap-1 text-[#047857] hover:text-[#035f43] font-semibold hover:bg-emerald-50/50 transition-colors">
              <Link href="/doctor/dashboard/my-reviews">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentReviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed border-slate-200 rounded-2xl">
                <Smile className="h-10 w-10 text-slate-300 mb-2" />
                <p className="text-sm font-semibold text-slate-700">No patient reviews yet</p>
                <p className="text-xs text-slate-400 mt-1">Patient commentary will be loaded here.</p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {recentReviews.map((review) => (
                  <div 
                    key={review.id} 
                    className="p-4 rounded-xl border border-slate-200/60 bg-slate-50/30 hover:bg-slate-50/80 hover:border-emerald-100/80 transition-all duration-200 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-extrabold text-xs text-slate-850">
                        {review.patient?.name || "Patient Comment"}
                      </div>
                      <div className="flex items-center gap-0.5 text-[#047857]">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-3 w-3 ${i < (review.rating ?? 0) ? "fill-[#047857] text-[#047857]" : "text-slate-200"}`} 
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-3 italic font-medium leading-relaxed bg-slate-100/30 p-2 rounded-lg border border-slate-105">
                      "{review.comment}"
                    </p>

                    <div className="text-[10px] text-slate-400 font-semibold pt-1 border-t border-slate-100 text-right">
                      {review.createdAt ? format(new Date(review.createdAt), "MMM dd, yyyy") : "N/A"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Practitioner Quick Shortcuts */}
      <Card className="rounded-[24px] border-slate-200/60 shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-800">Doctor Shortcuts</CardTitle>
          <CardDescription className="text-slate-400 font-medium">Direct navigation commands.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 grid-cols-2 md:grid-cols-4">
          <Button asChild variant="outline" className="flex flex-col items-center justify-center p-6 h-28 gap-2 bg-white hover:bg-emerald-50/30 hover:border-emerald-300 border-slate-200/60 border-dashed rounded-2xl transition-all duration-200 group shadow-sm hover:shadow-md cursor-pointer">
            <Link href="/doctor/dashboard/appointments">
              <Calendar className="h-6 w-6 text-[#047857] group-hover:scale-110 transition-transform duration-200" />
              <span className="text-sm font-extrabold text-slate-700">Appointments</span>
            </Link>
          </Button>

          <Button asChild variant="outline" className="flex flex-col items-center justify-center p-6 h-28 gap-2 bg-white hover:bg-emerald-50/30 hover:border-emerald-300 border-slate-200/60 border-dashed rounded-2xl transition-all duration-200 group shadow-sm hover:shadow-md cursor-pointer">
            <Link href="/doctor/dashboard/my-schedules">
              <Clock className="h-6 w-6 text-[#047857] group-hover:scale-110 transition-transform duration-200" />
              <span className="text-sm font-extrabold text-slate-700">My Schedules</span>
            </Link>
          </Button>

          <Button asChild variant="outline" className="flex flex-col items-center justify-center p-6 h-28 gap-2 bg-white hover:bg-emerald-50/30 hover:border-emerald-300 border-slate-200/60 border-dashed rounded-2xl transition-all duration-200 group shadow-sm hover:shadow-md cursor-pointer">
            <Link href="/doctor/dashboard/prescriptions">
              <FileText className="h-6 w-6 text-[#047857] group-hover:scale-110 transition-transform duration-200" />
              <span className="text-sm font-extrabold text-slate-700">Prescriptions</span>
            </Link>
          </Button>

          <Button asChild variant="outline" className="flex flex-col items-center justify-center p-6 h-28 gap-2 bg-white hover:bg-emerald-50/30 hover:border-emerald-300 border-slate-200/60 border-dashed rounded-2xl transition-all duration-200 group shadow-sm hover:shadow-md cursor-pointer">
            <Link href="/doctor/dashboard/my-reviews">
              <Star className="h-6 w-6 text-[#047857] group-hover:scale-110 transition-transform duration-200" />
              <span className="text-sm font-extrabold text-slate-700">Reviews Feed</span>
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorDashboardContent;
