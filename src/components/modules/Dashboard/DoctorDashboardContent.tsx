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

  // Toast greetings and queries failure alerting
  useEffect(() => {
    toast.success(`Welcome back, Dr. ${userInfo.name}!`, {
      description: "Clinical telemetry synced successfully.",
      duration: 3000,
    });
  }, [userInfo.name]);

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
      if (!a.schedule?.startDateTime) return false;
      return isToday(new Date(a.schedule.startDateTime));
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

  // If no appointments today, display the next 3 upcoming ones
  const displayedAppointments = useMemo(() => {
    if (todayAppointments.length > 0) {
      return todayAppointments.slice(0, 3);
    }
    return [...appointments]
      .filter((a) => a.status === "SCHEDULED" || a.status === "INPROGRESS")
      .sort((a, b) => {
        const aTime = a.schedule?.startDateTime ? new Date(a.schedule.startDateTime).getTime() : 0;
        const bTime = b.schedule?.startDateTime ? new Date(b.schedule.startDateTime).getTime() : 0;
        return aTime - bTime;
      })
      .slice(0, 3);
  }, [todayAppointments, appointments]);

  const formatDateTime = (value?: string | Date | null) => {
    if (!value) return "Pending";
    const dateValue = new Date(value);
    if (isNaN(dateValue.getTime())) return "Pending";
    return format(dateValue, "MMM dd, yyyy • hh:mm a");
  };

  return (
    <div className="space-y-6">
      {/* Welcome Practitioner Card */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-violet-600 via-indigo-600 to-blue-600 p-6 md:p-8 text-white shadow-lg shadow-indigo-500/10">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold backdrop-blur-md">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" /> Practitioner Command
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Welcome back, Dr. {userInfo.name}</h1>
            <p className="text-sm md:text-base text-indigo-100 max-w-xl">
              Track your diagnostic sessions, write electronic prescriptions, configure available time-slots, and inspect reviews.
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
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
        <Card className="hover:scale-[1.02] transition-transform duration-200 border-indigo-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Today's Visits</CardTitle>
            <div className="h-9 w-9 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-600">
              <Clock className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-bold text-indigo-600">{todayAppointments.length}</div>
            <p className="text-xs text-muted-foreground">Sessions scheduled for today</p>
          </CardContent>
        </Card>

        {/* Total Appointments */}
        <Card className="hover:scale-[1.02] transition-transform duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600">
              <Calendar className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-bold">{appointments.length}</div>
            <p className="text-xs text-muted-foreground">Total diagnostic encounters</p>
          </CardContent>
        </Card>

        {/* Available Schedules */}
        <Card className="hover:scale-[1.02] transition-transform duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Slots</CardTitle>
            <div className="h-9 w-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <Compass className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-bold text-emerald-600">{activeSchedulesCount}</div>
            <p className="text-xs text-muted-foreground">Available slots for booking</p>
          </CardContent>
        </Card>

        {/* Average Reviews */}
        <Card className="hover:scale-[1.02] transition-transform duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Clinic Rating</CardTitle>
            <div className="h-9 w-9 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600">
              <Star className="w-5 h-5 fill-amber-500" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-bold text-amber-600 flex items-center gap-1.5">
              {averageRating} <span className="text-xs text-muted-foreground">({reviews.length} reviews)</span>
            </div>
            <p className="text-xs text-muted-foreground">Patient review telemetry</p>
          </CardContent>
        </Card>
      </div>

      {/* Grid Content: Patient visits (col-span-2) & Reviews feed (col-span-1) */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {/* Today's Schedule */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle>
                {todayAppointments.length > 0 ? "Today's Clinic Schedule" : "Upcoming Consultations"}
              </CardTitle>
              <CardDescription>
                {todayAppointments.length > 0 
                  ? "Daily checkups needing diagnostic review." 
                  : "Next consultations booked by patients."}
              </CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm" className="gap-1 text-primary">
              <Link href="/doctor/dashboard/appointments">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {displayedAppointments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed rounded-xl">
                <Stethoscope className="h-10 w-10 text-muted-foreground/60 mb-2 animate-pulse" />
                <p className="text-sm font-medium text-muted-foreground">No upcoming appointments found</p>
                <p className="text-xs text-muted-foreground/80 mt-1">Configure slot availability in Schedules to accept bookings.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {displayedAppointments.map((appointment) => (
                  <div 
                    key={appointment.id} 
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl border bg-muted/20 hover:bg-muted/40 transition-all duration-200"
                  >
                    <div className="space-y-1">
                      <div className="font-semibold text-base">{appointment.patient?.name || "Patient visit"}</div>
                      <div className="text-xs text-muted-foreground font-medium">{appointment.patient?.email}</div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{formatDateTime(appointment.schedule?.startDateTime)}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="flex gap-2">
                        <Badge variant="outline" className="bg-white">{appointment.status}</Badge>
                        <Badge 
                          variant="secondary"
                          className={
                            appointment.paymentStatus === "PAID" 
                              ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" 
                              : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                          }
                        >
                          {appointment.paymentStatus}
                        </Badge>
                      </div>
                      
                      <Button asChild size="sm" variant="outline" className="w-full sm:w-auto">
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle>Recent Reviews</CardTitle>
              <CardDescription>Clinical evaluations.</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm" className="gap-1 text-primary">
              <Link href="/doctor/dashboard/my-reviews">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentReviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed rounded-xl">
                <Smile className="h-10 w-10 text-muted-foreground/60 mb-2" />
                <p className="text-sm font-medium text-muted-foreground">No patient reviews yet</p>
                <p className="text-xs text-muted-foreground/80 mt-1">Patient commentary will be loaded here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentReviews.map((review) => (
                  <div 
                    key={review.id} 
                    className="p-4 rounded-xl border bg-muted/10 hover:bg-muted/30 transition-all duration-200 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-xs text-foreground">
                        {review.patient?.name || "Patient Comment"}
                      </div>
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-3 w-3 ${i < (review.rating ?? 0) ? "fill-amber-500 text-amber-500" : "text-muted-foreground/30"}`} 
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground italic line-clamp-3">
                      "{review.comment}"
                    </p>

                    <div className="text-[10px] text-muted-foreground pt-1 border-t text-right">
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
      <Card>
        <CardHeader>
          <CardTitle>Doctor Shortcuts</CardTitle>
          <CardDescription>Direct navigation commands.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 grid-cols-2 md:grid-cols-4">
          <Button asChild variant="outline" className="flex flex-col items-center justify-center p-6 h-28 gap-2 hover:bg-violet-50/10 hover:border-violet-500/30 transition-all border-dashed rounded-xl">
            <Link href="/doctor/dashboard/appointments">
              <Calendar className="h-6 w-6 text-violet-500" />
              <span className="text-sm font-semibold">Manage Appointments</span>
            </Link>
          </Button>

          <Button asChild variant="outline" className="flex flex-col items-center justify-center p-6 h-28 gap-2 hover:bg-indigo-50/10 hover:border-indigo-500/30 transition-all border-dashed rounded-xl">
            <Link href="/doctor/dashboard/my-schedules">
              <Clock className="h-6 w-6 text-indigo-500" />
              <span className="text-sm font-semibold">Doctor Schedules</span>
            </Link>
          </Button>

          <Button asChild variant="outline" className="flex flex-col items-center justify-center p-6 h-28 gap-2 hover:bg-blue-50/10 hover:border-blue-500/30 transition-all border-dashed rounded-xl">
            <Link href="/doctor/dashboard/prescriptions">
              <FileText className="h-6 w-6 text-blue-500" />
              <span className="text-sm font-semibold">Prescriptions</span>
            </Link>
          </Button>

          <Button asChild variant="outline" className="flex flex-col items-center justify-center p-6 h-28 gap-2 hover:bg-amber-50/10 hover:border-amber-500/30 transition-all border-dashed rounded-xl">
            <Link href="/doctor/dashboard/my-reviews">
              <Star className="h-6 w-6 text-amber-500" />
              <span className="text-sm font-semibold">Reviews Feed</span>
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorDashboardContent;
