"use client"

import { useQuery, useMutation } from "@tanstack/react-query";
import { getMyAppointments } from "@/services/appointment.services";
import { getMyPrescriptions } from "@/services/prescription.services";
import { initiateAppointmentPaymentAction } from "@/app/_actions/appointment.actions";
import { ApiResponse } from "@/types/api.types";
import { IAppointment } from "@/types/appointment.types";
import { IPrescription, PrescriptionRow } from "@/types/prescription.types";
import { UserInfo } from "@/types/user.type";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  FileText, 
  Activity, 
  ArrowRight, 
  CreditCard, 
  Sparkles,
  ClipboardList,
  Clock,
  User,
  Heart,
  PlusCircle
} from "lucide-react";
import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface PatientDashboardContentProps {
  userInfo: UserInfo;
}

const PatientDashboardContent = ({ userInfo }: PatientDashboardContentProps) => {
  const { data: appointmentsResponse, error: appointmentsError } = useQuery({
    queryKey: ["my-appointments"],
    queryFn: getMyAppointments,
    refetchOnWindowFocus: "always",
  });

  const { data: prescriptionsResponse, error: prescriptionsError } = useQuery({
    queryKey: ["my-prescriptions"],
    queryFn: getMyPrescriptions,
    refetchOnWindowFocus: "always",
  });

  const initiatePaymentMutation = useMutation({
    mutationFn: initiateAppointmentPaymentAction,
  });

  const appointments = appointmentsResponse?.data ?? [];
  const prescriptions = (prescriptionsResponse?.data ?? []) as PrescriptionRow[];

  useEffect(() => {
    if (appointmentsError) {
      toast.error("Failed to fetch your appointments");
    }
    if (prescriptionsError) {
      toast.error("Failed to fetch prescriptions list");
    }
  }, [appointmentsError, prescriptionsError]);

  // Derive Next Appointment client-side
  const nextAppointment = useMemo(() => {
    const active = appointments.filter(
      (item) => item.status === "SCHEDULED" || item.status === "INPROGRESS"
    );
    if (active.length === 0) return null;
    
    // Sort ascending by schedule time
    const sorted = [...active].sort((a, b) => {
      const aTime = a.schedule?.startDateTime ? new Date(a.schedule.startDateTime).getTime() : Infinity;
      const bTime = b.schedule?.startDateTime ? new Date(b.schedule.startDateTime).getTime() : Infinity;
      return aTime - bTime;
    });

    // Check if startDateTime is in the future
    const now = Date.now();
    const upcoming = sorted.find((item) => {
      const time = item.schedule?.startDateTime ? new Date(item.schedule.startDateTime).getTime() : 0;
      return time > now;
    });

    return upcoming || sorted[0];
  }, [appointments]);

  const sortedUpcomingAppointments = useMemo(() => {
    return [...appointments]
      .filter((a) => a.status === "SCHEDULED" || a.status === "INPROGRESS")
      .sort((a, b) => {
        const aTime = a.schedule?.startDateTime ? new Date(a.schedule.startDateTime).getTime() : 0;
        const bTime = b.schedule?.startDateTime ? new Date(b.schedule.startDateTime).getTime() : 0;
        return aTime - bTime;
      })
      .slice(0, 3);
  }, [appointments]);

  const recentPrescriptions = useMemo(() => {
    return [...prescriptions]
      .sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
      })
      .slice(0, 3);
  }, [prescriptions]);

  const handlePayNow = async (appointmentId: string) => {
    toast.loading("Initiating secure payment gateway...", { id: "payment-toast" });
    try {
      const result = await initiatePaymentMutation.mutateAsync(appointmentId);

      if (!result.success) {
        toast.error(result.message || "Failed to initiate payment", { id: "payment-toast" });
        return;
      }

      if (!('data' in result) || !result.data.paymentUrl) {
        toast.error("Payment link is unavailable right now", { id: "payment-toast" });
        return;
      }

      toast.success("Redirecting to payment gateway...", { id: "payment-toast" });
      window.location.assign(result.data.paymentUrl);
    } catch (err) {
      toast.error("An error occurred during payment processing", { id: "payment-toast" });
    }
  };

  const formatDateTime = (value?: string | Date | null) => {
    if (!value) return "N/A";
    const dateValue = new Date(value);
    if (isNaN(dateValue.getTime())) return "N/A";
    return format(dateValue, "MMM dd, yyyy • hh:mm a");
  };

  return (
    <div className="space-y-6">
      {/* Patient Welcome Banner */}
      <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#0d9488] to-[#047857] p-6 md:p-8 text-white shadow-lg shadow-emerald-500/10">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold backdrop-blur-md">
              <Heart className="h-3 w-3 text-rose-300 animate-pulse" /> Healthcare Portal Active
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Welcome back, {userInfo.name}</h1>
            <p className="text-sm md:text-base text-teal-100/90 max-w-xl">
              Track your appointments, view instructions from your doctors, and manage payments easily from your Healix account.
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" className="bg-white text-[#047857] hover:bg-teal-50 border-white rounded-lg font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all">
              <Link href="/dashboard/book-appointments">
                <PlusCircle className="mr-2 h-4 w-4" /> Book Appointment
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Next Appointment Card */}
        <Card className="relative overflow-hidden hover:scale-[1.02] hover:shadow-md transition-all duration-250 border-emerald-500/30 rounded-[20px] shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-slate-500">Next Appointment</CardTitle>
            <div className="h-9 w-9 rounded-[12px] bg-emerald-50 text-[#047857] flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {nextAppointment ? (
              <>
                <div className="text-lg font-extrabold text-slate-800 truncate">{nextAppointment.doctor?.name}</div>
                <p className="text-xs text-[#047857] font-semibold bg-emerald-50/50 px-2 py-0.5 rounded-md inline-block">
                  {nextAppointment.schedule?.startDateTime 
                    ? formatDistanceToNow(new Date(nextAppointment.schedule.startDateTime), { addSuffix: true })
                    : "Scheduled soon"}
                </p>
              </>
            ) : (
              <>
                <div className="text-lg font-extrabold text-slate-400">None Scheduled</div>
                <p className="text-xs text-slate-400">Stay healthy!</p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Total Appointments Card */}
        <Card className="hover:scale-[1.02] hover:shadow-md transition-all duration-250 border-slate-200/60 rounded-[20px] shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-slate-500">Total Appointments</CardTitle>
            <div className="h-9 w-9 rounded-[12px] bg-emerald-50 text-[#047857] flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-extrabold text-slate-800">{appointments.length}</div>
            <p className="text-xs text-slate-400 font-medium">Scheduled & historical visits</p>
          </CardContent>
        </Card>

        {/* Prescriptions Card */}
        <Card className="hover:scale-[1.02] hover:shadow-md transition-all duration-250 border-slate-200/60 rounded-[20px] shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-slate-500">My Prescriptions</CardTitle>
            <div className="h-9 w-9 rounded-[12px] bg-emerald-50 text-[#047857] flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-extrabold text-slate-800">{prescriptions.length}</div>
            <p className="text-xs text-slate-400 font-medium">Prescribed medical plans</p>
          </CardContent>
        </Card>

        {/* Health Records Profile Card */}
        <Card className="hover:scale-[1.02] hover:shadow-md transition-all duration-250 border-slate-200/60 rounded-[20px] shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-slate-500">Health Profile</CardTitle>
            <div className="h-9 w-9 rounded-[12px] bg-emerald-50 text-[#047857] flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-lg font-extrabold text-[#047857] flex items-center gap-1">
              Active <Sparkles className="h-4 w-4 text-[#047857] animate-pulse" />
            </div>
            <p className="text-xs text-slate-400 font-medium">Check your medical parameters</p>
          </CardContent>
        </Card>
      </div>

      {/* Grid: Upcoming Appointments (col-span-2) & Prescriptions (col-span-1) */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {/* Upcoming appointments */}
        <Card className="lg:col-span-2 rounded-[24px] border-slate-200/60 shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg font-bold text-slate-800">Upcoming Appointments</CardTitle>
              <CardDescription className="text-slate-400 font-medium">Booked slots requiring attendance or payment.</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm" className="gap-1 text-[#047857] hover:text-[#035f43] font-semibold hover:bg-emerald-50/50 transition-colors">
              <Link href="/dashboard/my-appointments">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {sortedUpcomingAppointments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed border-slate-200 rounded-2xl">
                <Calendar className="h-10 w-10 text-slate-300 mb-2 animate-bounce" />
                <p className="text-sm font-semibold text-slate-700">No upcoming appointments found</p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">Need to check up with a doctor? Click below to book.</p>
                <Button asChild size="sm" className="mt-4 rounded-lg bg-[#047857] hover:bg-[#035f43] text-white">
                  <Link href="/dashboard/book-appointments">Book Now</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3.5">
                {sortedUpcomingAppointments.map((appointment) => {
                  const isUnpaid = appointment.paymentStatus !== "PAID";
                  const isPendingPay = isUnpaid && appointment.status !== "CANCELED";

                  return (
                    <div 
                      key={appointment.id} 
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-[20px] border border-slate-200/60 bg-slate-50/30 hover:bg-slate-50/80 hover:border-emerald-100/80 transition-all duration-200"
                    >
                      <div className="space-y-1">
                        <div className="font-extrabold text-slate-800 text-base">{appointment.doctor?.name || "Consultation visit"}</div>
                        <div className="text-xs text-slate-400 font-semibold">{appointment.doctor?.designation || "Healthcare Doctor"}</div>
                        <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-505 font-medium">
                          <Clock className="h-3.5 w-3.5 text-[#047857]" />
                          <span>{formatDateTime(appointment.schedule?.startDateTime)}</span>
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
                        
                        {isPendingPay ? (
                          <Button 
                            size="sm" 
                            className="bg-[#047857] hover:bg-[#035f43] text-white rounded-lg font-semibold shadow-md shadow-emerald-500/10 transition-colors gap-1 w-full sm:w-auto"
                            onClick={() => handlePayNow(appointment.id)}
                            disabled={initiatePaymentMutation.isPending}
                          >
                            <CreditCard className="h-4 w-4" /> Pay Now
                          </Button>
                        ) : (
                          <Button asChild size="sm" variant="outline" className="w-full sm:w-auto rounded-lg border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold">
                            <Link href={`/consultation/doctor/${appointment.doctorId || appointment.doctor?.id || ""}`}>
                              Profile
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Prescriptions */}
        <Card className="rounded-[24px] border-slate-200/60 shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg font-bold text-slate-800">Recent Prescriptions</CardTitle>
              <CardDescription className="text-slate-400 font-medium">Guidelines from doctors.</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm" className="gap-1 text-[#047857] hover:text-[#035f43] font-semibold hover:bg-emerald-50/50 transition-colors">
              <Link href="/dashboard/my-prescriptions">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentPrescriptions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed border-slate-200 rounded-2xl">
                <FileText className="h-10 w-10 text-slate-300 mb-2" />
                <p className="text-sm font-semibold text-slate-700">No prescriptions yet</p>
                <p className="text-xs text-slate-400 mt-1">Prescriptions will appear here after diagnostic sessions.</p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {recentPrescriptions.map((prescription) => (
                  <div 
                    key={prescription.id} 
                    className="p-4 rounded-xl border border-slate-200/60 bg-slate-50/30 hover:bg-slate-50/80 hover:border-emerald-100/80 transition-all duration-200 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-extrabold text-sm text-slate-800">
                          {prescription.doctor?.name || "Dr. Practitioner"}
                        </div>
                        <div className="text-xs text-slate-400 font-semibold">
                          Date: {prescription.createdAt ? format(new Date(prescription.createdAt), "MMM dd, yyyy") : "N/A"}
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-emerald-50 text-[#047857] border-emerald-100 text-[10px] py-0.5 px-2 rounded-full font-semibold">Active</Badge>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 italic font-medium leading-relaxed bg-slate-100/30 p-2 rounded-lg border border-slate-100">
                      "{prescription.instructions}"
                    </p>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 font-medium">
                      <span className="text-slate-400">
                        Follow-up: {prescription.followUpDate ? format(new Date(prescription.followUpDate), "MMM dd, yyyy") : "N/A"}
                      </span>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-7 px-2.5 text-xs text-[#047857] font-bold hover:text-[#035f43] hover:bg-emerald-50/50 rounded-lg transition-colors"
                        asChild
                      >
                        <Link href="/dashboard/my-prescriptions">Details</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Patient Shortcuts Action Panel */}
      <Card className="rounded-[24px] border-slate-200/60 shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-800">Quick Patient Shortcuts</CardTitle>
          <CardDescription className="text-slate-400 font-medium">Get instant access to common diagnostic and booking functions.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 grid-cols-2 md:grid-cols-4">
          <Button asChild variant="outline" className="flex flex-col items-center justify-center p-6 h-28 gap-2 bg-white hover:bg-emerald-50/30 hover:border-emerald-300 border-slate-200/60 border-dashed rounded-2xl transition-all duration-200 group shadow-sm hover:shadow-md cursor-pointer">
            <Link href="/dashboard/book-appointments">
              <ClipboardList className="h-6 w-6 text-[#047857] group-hover:scale-110 transition-transform duration-200" />
              <span className="text-sm font-extrabold text-slate-700">Book Doctor</span>
            </Link>
          </Button>

          <Button asChild variant="outline" className="flex flex-col items-center justify-center p-6 h-28 gap-2 bg-white hover:bg-emerald-50/30 hover:border-emerald-300 border-slate-200/60 border-dashed rounded-2xl transition-all duration-200 group shadow-sm hover:shadow-md cursor-pointer">
            <Link href="/dashboard/my-appointments">
              <Calendar className="h-6 w-6 text-[#047857] group-hover:scale-110 transition-transform duration-200" />
              <span className="text-sm font-extrabold text-slate-700">My Bookings</span>
            </Link>
          </Button>

          <Button asChild variant="outline" className="flex flex-col items-center justify-center p-6 h-28 gap-2 bg-white hover:bg-emerald-50/30 hover:border-emerald-300 border-slate-200/60 border-dashed rounded-2xl transition-all duration-200 group shadow-sm hover:shadow-md cursor-pointer">
            <Link href="/dashboard/my-prescriptions">
              <FileText className="h-6 w-6 text-[#047857] group-hover:scale-110 transition-transform duration-200" />
              <span className="text-sm font-extrabold text-slate-700">Prescriptions</span>
            </Link>
          </Button>

          <Button asChild variant="outline" className="flex flex-col items-center justify-center p-6 h-28 gap-2 bg-white hover:bg-emerald-50/30 hover:border-emerald-300 border-slate-200/60 border-dashed rounded-2xl transition-all duration-200 group shadow-sm hover:shadow-md cursor-pointer">
            <Link href="/dashboard/health-records">
              <Activity className="h-6 w-6 text-[#047857] group-hover:scale-110 transition-transform duration-200" />
              <span className="text-sm font-extrabold text-slate-700">Health Records</span>
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientDashboardContent;
