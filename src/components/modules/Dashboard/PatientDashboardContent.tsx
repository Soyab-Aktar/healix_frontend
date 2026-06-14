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

  // Toast feedback for load and error states
  useEffect(() => {
    toast.success(`Welcome back, ${userInfo.name}!`, {
      description: "We hope you are feeling well today.",
      duration: 3000,
    });
  }, [userInfo.name]);

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
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-teal-500 via-cyan-500 to-blue-500 p-6 md:p-8 text-white shadow-lg shadow-teal-500/10">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold backdrop-blur-md">
              <Heart className="h-3 w-3 text-rose-300 animate-pulse" /> Healthcare Portal Active
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Welcome back, {userInfo.name}</h1>
            <p className="text-sm md:text-base text-teal-50 max-w-xl">
              Track your appointments, view instructions from your doctors, and manage payments easily from your Healix account.
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
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
        <Card className="relative overflow-hidden hover:scale-[1.02] transition-transform duration-200 border-teal-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Next Appointment</CardTitle>
            <div className="h-9 w-9 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-600">
              <Clock className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {nextAppointment ? (
              <>
                <div className="text-lg font-bold truncate">{nextAppointment.doctor?.name}</div>
                <p className="text-xs text-muted-foreground">
                  {nextAppointment.schedule?.startDateTime 
                    ? formatDistanceToNow(new Date(nextAppointment.schedule.startDateTime), { addSuffix: true })
                    : "Scheduled soon"}
                </p>
              </>
            ) : (
              <>
                <div className="text-lg font-bold text-muted-foreground">None Scheduled</div>
                <p className="text-xs text-muted-foreground">Stay healthy!</p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Total Appointments Card */}
        <Card className="hover:scale-[1.02] transition-transform duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <div className="h-9 w-9 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-600">
              <Calendar className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-bold">{appointments.length}</div>
            <p className="text-xs text-muted-foreground">Scheduled & historical visits</p>
          </CardContent>
        </Card>

        {/* Prescriptions Card */}
        <Card className="hover:scale-[1.02] transition-transform duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">My Prescriptions</CardTitle>
            <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600">
              <FileText className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-bold">{prescriptions.length}</div>
            <p className="text-xs text-muted-foreground">Prescribed medical plans</p>
          </CardContent>
        </Card>

        {/* Health Records Profile Card */}
        <Card className="hover:scale-[1.02] transition-transform duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Health Profile</CardTitle>
            <div className="h-9 w-9 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-600">
              <Activity className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-lg font-bold text-violet-600 flex items-center gap-1">
              Active <Sparkles className="h-4 w-4 text-violet-500 animate-pulse" />
            </div>
            <p className="text-xs text-muted-foreground">Check your medical parameters</p>
          </CardContent>
        </Card>
      </div>

      {/* Grid: Upcoming Appointments (col-span-2) & Prescriptions (col-span-1) */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {/* Upcoming appointments */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Booked slots requiring attendance or payment.</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm" className="gap-1 text-primary">
              <Link href="/dashboard/my-appointments">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {sortedUpcomingAppointments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed rounded-xl">
                <Calendar className="h-10 w-10 text-muted-foreground/60 mb-2 animate-bounce" />
                <p className="text-sm font-medium text-muted-foreground">No upcoming appointments found</p>
                <p className="text-xs text-muted-foreground/80 mt-1 max-w-xs">Need to check up with a doctor? Click below to book.</p>
                <Button asChild size="sm" className="mt-4">
                  <Link href="/dashboard/book-appointments">Book Now</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedUpcomingAppointments.map((appointment) => {
                  const isUnpaid = appointment.paymentStatus !== "PAID";
                  const isPendingPay = isUnpaid && appointment.status !== "CANCELED";

                  return (
                    <div 
                      key={appointment.id} 
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl border bg-muted/20 hover:bg-muted/40 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="font-semibold text-base">{appointment.doctor?.name || "Consultation visit"}</div>
                        <div className="text-xs text-muted-foreground font-medium">{appointment.doctor?.designation || "Healthcare Doctor"}</div>
                        <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
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
                        
                        {isPendingPay ? (
                          <Button 
                            size="sm" 
                            className="bg-indigo-600 hover:bg-indigo-700 text-white gap-1 w-full sm:w-auto"
                            onClick={() => handlePayNow(appointment.id)}
                            disabled={initiatePaymentMutation.isPending}
                          >
                            <CreditCard className="h-4 w-4" /> Pay Now
                          </Button>
                        ) : (
                          <Button asChild size="sm" variant="outline" className="w-full sm:w-auto">
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle>Recent Prescriptions</CardTitle>
              <CardDescription>Guidelines from doctors.</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm" className="gap-1 text-primary">
              <Link href="/dashboard/my-prescriptions">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentPrescriptions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed rounded-xl">
                <FileText className="h-10 w-10 text-muted-foreground/60 mb-2" />
                <p className="text-sm font-medium text-muted-foreground">No prescriptions yet</p>
                <p className="text-xs text-muted-foreground/80 mt-1">Prescriptions will appear here after diagnostic sessions.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentPrescriptions.map((prescription) => (
                  <div 
                    key={prescription.id} 
                    className="p-4 rounded-xl border bg-muted/10 hover:bg-muted/30 transition-all duration-200 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-semibold text-sm text-foreground">
                          {prescription.doctor?.name || "Dr. Practitioner"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Date: {prescription.createdAt ? format(new Date(prescription.createdAt), "MMM dd, yyyy") : "N/A"}
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-primary/5 text-primary text-[10px] py-0">Active</Badge>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2 italic">
                      "{prescription.instructions}"
                    </p>

                    <div className="flex items-center justify-between text-xs pt-1 border-t">
                      <span className="text-muted-foreground">
                        Follow-up: {prescription.followUpDate ? format(new Date(prescription.followUpDate), "MMM dd, yyyy") : "N/A"}
                      </span>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-7 px-2.5 text-xs text-indigo-600 font-medium hover:text-indigo-800"
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
      <Card>
        <CardHeader>
          <CardTitle>Quick Patient Shortcuts</CardTitle>
          <CardDescription>Get instant access to common diagnostic and booking functions.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 grid-cols-2 md:grid-cols-4">
          <Button asChild variant="outline" className="flex flex-col items-center justify-center p-6 h-28 gap-2 hover:bg-teal-50/10 hover:border-teal-500/30 transition-all border-dashed rounded-xl">
            <Link href="/dashboard/book-appointments">
              <ClipboardList className="h-6 w-6 text-teal-500" />
              <span className="text-sm font-semibold">Book Doctor</span>
            </Link>
          </Button>

          <Button asChild variant="outline" className="flex flex-col items-center justify-center p-6 h-28 gap-2 hover:bg-cyan-50/10 hover:border-cyan-500/30 transition-all border-dashed rounded-xl">
            <Link href="/dashboard/my-appointments">
              <Calendar className="h-6 w-6 text-cyan-500" />
              <span className="text-sm font-semibold">My Bookings</span>
            </Link>
          </Button>

          <Button asChild variant="outline" className="flex flex-col items-center justify-center p-6 h-28 gap-2 hover:bg-blue-50/10 hover:border-blue-500/30 transition-all border-dashed rounded-xl">
            <Link href="/dashboard/my-prescriptions">
              <FileText className="h-6 w-6 text-blue-500" />
              <span className="text-sm font-semibold">Prescriptions</span>
            </Link>
          </Button>

          <Button asChild variant="outline" className="flex flex-col items-center justify-center p-6 h-28 gap-2 hover:bg-violet-50/10 hover:border-violet-500/30 transition-all border-dashed rounded-xl">
            <Link href="/dashboard/health-records">
              <Activity className="h-6 w-6 text-violet-500" />
              <span className="text-sm font-semibold">Health Records</span>
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientDashboardContent;
