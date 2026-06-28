"use client"

import { useQuery, useMutation } from "@tanstack/react-query";
import { getMyAppointments } from "@/services/appointment.services";
import { getMyPrescriptions } from "@/services/prescription.services";
import { initiateAppointmentPaymentAction } from "@/app/_actions/appointment.actions";
import { IAppointment } from "@/types/appointment.types";
import { PrescriptionRow } from "@/types/prescription.types";
import { UserInfo } from "@/types/user.type";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Calendar,
  FileText,
  Activity,
  ArrowRight,
  CreditCard,
  Sparkles,
  ClipboardList,
  Clock,
  Heart,
  PlusCircle,
  Star
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
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

  // Derive Pending Payments count
  const pendingPaymentsCount = useMemo(() => {
    return appointments.filter(
      (a) => a.paymentStatus !== "PAID" && a.status !== "CANCELED"
    ).length;
  }, [appointments]);

  // Recent Appointments (include upcoming, sorted chronologically, followed by recent past desc)
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
        {/* Pending Payments Card (Replaces Next Appointment) */}
        <Card className={cn(
          "hover:scale-[1.02] hover:shadow-md transition-all duration-250 rounded-[20px] shadow-sm bg-white border",
          pendingPaymentsCount > 0 ? "border-amber-450 bg-amber-50/5 shadow-xs" : "border-slate-200/60"
        )}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-slate-500">Pending Payments</CardTitle>
            <div className={cn(
              "h-9 w-9 rounded-[12px] flex items-center justify-center",
              pendingPaymentsCount > 0 ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-[#047857]"
            )}>
              <CreditCard className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className={cn("text-2xl font-extrabold", pendingPaymentsCount > 0 ? "text-amber-700" : "text-slate-800")}>
              {pendingPaymentsCount}
            </div>
            <p className="text-xs text-slate-400 font-medium">
              {pendingPaymentsCount > 0 ? "Action required before visit" : "No outstanding bills"}
            </p>
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
      </div>      {/* Grid: Recent Appointments (col-span-2) & Quick Shortcuts (col-span-1) */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {/* Recent appointments */}
        <Card className="lg:col-span-2 rounded-[24px] border-slate-200/60 shadow-sm bg-white overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div className="space-y-1">
              <CardTitle className="text-lg font-bold text-slate-800">Recent Appointments</CardTitle>
              <CardDescription className="text-slate-400 font-medium">Your upcoming consultations and past medical encounters.</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm" className="gap-1 text-[#047857] hover:text-[#035f43] font-semibold hover:bg-emerald-50/50 transition-colors">
              <Link href="/dashboard/my-appointments">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {recentAppointments.length === 0 ? (
              <div className="mx-6 mb-6 flex flex-col items-center justify-center py-10 text-center border border-dashed border-slate-200 rounded-2xl">
                <Calendar className="h-10 w-10 text-slate-300 mb-2" />
                <p className="text-sm font-semibold text-slate-700">No appointments found</p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">Need to check up with a doctor? Click below to book.</p>
                <Button asChild size="sm" className="mt-4 rounded-lg bg-[#047857] hover:bg-[#035f43] text-white">
                  <Link href="/dashboard/book-appointments">Book Now</Link>
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto w-full">
                <Table className="w-full min-w-[600px]">
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-slate-100 bg-slate-50/40">
                      <TableHead className="font-bold text-slate-800 text-xs uppercase tracking-wider pl-6 py-3">Doctor</TableHead>
                      <TableHead className="font-bold text-slate-800 text-xs uppercase tracking-wider py-3">Schedule</TableHead>
                      <TableHead className="font-bold text-slate-800 text-xs uppercase tracking-wider py-3">Status</TableHead>
                      <TableHead className="font-bold text-slate-800 text-xs uppercase tracking-wider py-3">Payment</TableHead>
                      <TableHead className="font-bold text-slate-800 text-xs uppercase tracking-wider text-right pr-6 py-3">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentAppointments.map((appointment) => {
                      const isUnpaid = appointment.paymentStatus !== "PAID";
                      const isPendingPay = isUnpaid && appointment.status !== "CANCELED";
                      const doctor = appointment.doctor;
                      const initial = doctor?.name?.charAt(0).toUpperCase() ?? "D";

                      return (
                        <TableRow key={appointment.id} className="hover:bg-slate-50/40 border-slate-100 transition-colors">
                          <TableCell className="align-middle pl-6 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="relative shrink-0 w-9 h-9 rounded-[10px] overflow-hidden bg-emerald-50 border border-slate-100 flex items-center justify-center text-emerald-600 font-extrabold text-sm shadow-2xs">
                                {doctor?.profilePhoto ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={doctor.profilePhoto}
                                    alt={doctor.name ?? "Doctor"}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  initial
                                )}
                              </div>
                              <div className="min-w-0">
                                <span className="font-bold text-slate-800 text-sm truncate block">{doctor?.name ?? "-"}</span>
                                {doctor?.designation && (
                                  <span className="text-[10px] font-bold text-slate-400 block tracking-wide uppercase mt-0.5">{doctor.designation}</span>
                                )}
                              </div>
                            </div>
                          </TableCell>

                          <TableCell className="align-middle py-3.5">
                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                              <Clock className="h-3.5 w-3.5 text-[#047857]" />
                              <span>{formatDateTime(appointment.schedule?.startDateTime ?? appointment.appointmentStart)}</span>
                            </div>
                          </TableCell>

                          <TableCell className="align-middle py-3.5">
                            <Badge
                              variant="outline"
                              className={cn(
                                "bg-white rounded-full font-semibold border-slate-200/60 px-2.5 py-0.5 text-[11px]",
                                appointment.status === "SCHEDULED" && "text-blue-700 bg-blue-50/20 border-blue-100",
                                appointment.status === "COMPLETED" && "text-[#047857] bg-emerald-50/20 border-emerald-100",
                                appointment.status === "CANCELED" && "text-rose-700 bg-rose-50/20 border-rose-100",
                                appointment.status === "INPROGRESS" && "text-amber-700 bg-amber-50/20 border-amber-100"
                              )}
                            >
                              {appointment.status}
                            </Badge>
                          </TableCell>

                          <TableCell className="align-middle py-3.5">
                            <Badge
                              variant="secondary"
                              className={cn(
                                "rounded-full font-semibold border px-2.5 py-0.5 text-[11px]",
                                appointment.paymentStatus === "PAID"
                                  ? "bg-emerald-50 text-[#047857] border-emerald-100/50"
                                  : "bg-amber-50 text-amber-700 border-amber-100/50"
                              )}
                            >
                              {appointment.paymentStatus}
                            </Badge>
                          </TableCell>

                          <TableCell className="align-middle pr-6 py-3.5 text-right">
                            {isPendingPay ? (
                              <Button
                                size="sm"
                                className="bg-[#047857] hover:bg-[#035f43] text-white rounded-lg font-semibold shadow-md shadow-emerald-500/10 transition-all duration-200 gap-1 text-xs px-3 py-1.5 h-auto inline-flex items-center cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                                onClick={() => handlePayNow(appointment.id)}
                                disabled={initiatePaymentMutation.isPending}
                              >
                                <CreditCard className="h-3.5 w-3.5" /> Pay Now
                              </Button>
                            ) : (
                              <Button asChild size="sm" variant="outline" className="rounded-lg border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-350 font-semibold text-xs px-3 py-1.5 h-auto inline-flex items-center cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all">
                                <Link href={`/consultation/doctor/${appointment.doctorId || appointment.doctor?.id || ""}`}>
                                  Profile
                                </Link>
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Shortcuts (5 X 1 Vertical alignment) */}
        <Card className="rounded-[24px] border-slate-200/60 shadow-sm bg-white overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold text-slate-800">Quick Shortcuts</CardTitle>
            <CardDescription className="text-slate-400 font-medium">Get instant access to common patient actions.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2.5 pb-6 px-6">
            {/* Book Doctor */}
            <Button asChild variant="outline" className="flex items-center justify-between p-3.5 h-auto bg-white hover:bg-emerald-50/30 hover:border-emerald-300 border-slate-200/60 rounded-xl transition-all duration-200 group shadow-2xs hover:shadow-xs cursor-pointer text-left w-full">
              <Link href="/dashboard/book-appointments" className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center text-[#047857] group-hover:scale-105 transition-transform duration-200">
                    <ClipboardList className="h-4.5 w-4.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-700">Book Doctor</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-450 group-hover:translate-x-0.5 transition-transform duration-200" />
              </Link>
            </Button>

            {/* My Bookings */}
            <Button asChild variant="outline" className="flex items-center justify-between p-3.5 h-auto bg-white hover:bg-emerald-50/30 hover:border-emerald-300 border-slate-200/60 rounded-xl transition-all duration-200 group shadow-2xs hover:shadow-xs cursor-pointer text-left w-full">
              <Link href="/dashboard/my-appointments" className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center text-[#047857] group-hover:scale-105 transition-transform duration-200">
                    <Calendar className="h-4.5 w-4.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-700">My Bookings</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-450 group-hover:translate-x-0.5 transition-transform duration-200" />
              </Link>
            </Button>

            {/* Prescriptions */}
            <Button asChild variant="outline" className="flex items-center justify-between p-3.5 h-auto bg-white hover:bg-emerald-50/30 hover:border-emerald-300 border-slate-200/60 rounded-xl transition-all duration-200 group shadow-2xs hover:shadow-xs cursor-pointer text-left w-full">
              <Link href="/dashboard/my-prescriptions" className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center text-[#047857] group-hover:scale-105 transition-transform duration-200">
                    <FileText className="h-4.5 w-4.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-700">Prescriptions</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-450 group-hover:translate-x-0.5 transition-transform duration-200" />
              </Link>
            </Button>

            {/* Health Records */}
            <Button asChild variant="outline" className="flex items-center justify-between p-3.5 h-auto bg-white hover:bg-emerald-50/30 hover:border-emerald-300 border-slate-200/60 rounded-xl transition-all duration-200 group shadow-2xs hover:shadow-xs cursor-pointer text-left w-full">
              <Link href="/dashboard/health-records" className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center text-[#047857] group-hover:scale-105 transition-transform duration-200">
                    <Activity className="h-4.5 w-4.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-700">Health Records</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-450 group-hover:translate-x-0.5 transition-transform duration-200" />
              </Link>
            </Button>

            {/* My Reviews */}
            <Button asChild variant="outline" className="flex items-center justify-between p-3.5 h-auto bg-white hover:bg-emerald-50/30 hover:border-emerald-300 border-slate-200/60 rounded-xl transition-all duration-200 group shadow-2xs hover:shadow-xs cursor-pointer text-left w-full">
              <Link href="/dashboard/my-reviews" className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center text-[#047857] group-hover:scale-105 transition-transform duration-200">
                    <Star className="h-4.5 w-4.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-700">My Reviews</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-450 group-hover:translate-x-0.5 transition-transform duration-200" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Prescriptions (Swapped here from right sidebar) */}
      <Card className="rounded-[24px] border-slate-200/60 shadow-sm bg-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-bold text-slate-800">Recent Prescriptions</CardTitle>
            <CardDescription className="text-slate-400 font-medium">Guidelines, dosages, and instructions issued by your doctors.</CardDescription>
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
            <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
              {recentPrescriptions.map((prescription) => (
                <div
                  key={prescription.id}
                  className="p-4 rounded-xl border border-slate-200/60 bg-slate-50/30 hover:bg-slate-50/80 hover:border-emerald-100/80 transition-all duration-200 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-extrabold text-sm text-slate-800">
                          {prescription.doctor?.name || "Dr. Practitioner"}
                        </div>
                        <div className="text-xs text-slate-400 font-semibold mt-0.5">
                          Date: {prescription.createdAt ? format(new Date(prescription.createdAt), "MMM dd, yyyy") : "N/A"}
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-emerald-50 text-[#047857] border-emerald-100 text-[10px] py-0.5 px-2 rounded-full font-semibold">Active</Badge>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 italic font-medium leading-relaxed bg-slate-100/30 p-2.5 rounded-lg border border-slate-100">
                      "{prescription.instructions}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2.5 border-t border-slate-100 font-medium mt-1.5">
                    <span className="text-slate-450 text-[11px] font-semibold">
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
  );
};

export default PatientDashboardContent;
