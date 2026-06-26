"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { IAppointment } from "@/types/appointment.types";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Calendar,
  User,
  Video,
  CreditCard,
  Stethoscope,
  Clock,
  Copy,
  Check,
  FileText,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ViewAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: IAppointment | null;
}

const ViewAppointmentDialog = ({
  open,
  onOpenChange,
  appointment,
}: ViewAppointmentDialogProps) => {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  if (!appointment) return null;

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return "N/A";
    try {
      return format(new Date(date), "PPP p");
    } catch (e) {
      return "N/A";
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(key);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-[calc(100vw-1.5rem)] max-w-[calc(100vw-1.5rem)] gap-0 overflow-hidden p-0 sm:w-[calc(100vw-3rem)] sm:max-w-[calc(100vw-3rem)] md:w-[calc(100vw-4rem)] md:max-w-[calc(100vw-4rem)] lg:w-[min(92vw,56rem)] lg:max-w-[min(92vw,56rem)] rounded-[24px] border border-slate-200/60 shadow-lg">
        <DialogHeader className="border-b bg-slate-50/50 px-6 py-5 pr-14 shrink-0">
          <DialogTitle className="text-xl font-extrabold text-slate-800 flex items-center gap-2.5">
            <Calendar className="h-5.5 w-5.5 text-[#047857]" />
            <span className="bg-gradient-to-r from-teal-850 to-emerald-700 bg-clip-text text-transparent">
              Appointment Details
            </span>
          </DialogTitle>
          <DialogDescription className="text-slate-450 font-medium text-sm">
            Comprehensive view of appointment overview, schedule timings, patient details, consulting doctor, and billing records.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-7.5rem)]">
          <div className="px-6 py-6 space-y-6">
            {/* Overview Card Banner */}
            <div className="rounded-[20px] bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-[#047857]/10 p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-center">
              <div className="space-y-1">
                <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Appointment ID
                </span>
                <div className="flex items-center gap-1.5">
                  <span
                    className="font-mono text-xs font-bold text-slate-750 bg-white/80 px-2 py-0.5 rounded border border-slate-200/50 truncate max-w-[130px]"
                    title={appointment.id}
                  >
                    {appointment.id}
                  </span>
                  <button
                    onClick={() => handleCopy(appointment.id, "id")}
                    className="text-slate-400 hover:text-[#047857] transition-colors p-0.5 rounded hover:bg-white/50"
                    title="Copy ID"
                  >
                    {copiedText === "id" ? (
                      <Check className="size-3 text-emerald-600" />
                    ) : (
                      <Copy className="size-3" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Status
                </span>
                <div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "capitalize font-bold rounded-full px-3 py-0.5 text-xs border shadow-3xs",
                      appointment.status === "COMPLETED" &&
                        "bg-emerald-50 text-emerald-700 border-emerald-200/80",
                      appointment.status === "CANCELED" &&
                        "bg-rose-50 text-rose-700 border-rose-200/80",
                      appointment.status === "INPROGRESS" &&
                        "bg-amber-50 text-amber-800 border-amber-200/80",
                      appointment.status === "SCHEDULED" &&
                        "bg-sky-50 text-sky-700 border-sky-200/80"
                    )}
                  >
                    {appointment.status?.toLowerCase()}
                  </Badge>
                </div>
              </div>

              <div className="space-y-1">
                <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Payment Status
                </span>
                <div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "capitalize font-bold rounded-full px-3 py-0.5 text-xs border shadow-3xs",
                      appointment.paymentStatus === "PAID" &&
                        "bg-emerald-50 text-emerald-700 border-emerald-200/80",
                      appointment.paymentStatus === "UNPAID" &&
                        "bg-amber-50 text-amber-700 border-amber-200/80",
                      appointment.paymentStatus === "FAILED" &&
                        "bg-rose-50 text-rose-750 border-rose-200/80"
                    )}
                  >
                    {appointment.paymentStatus?.toLowerCase()}
                  </Badge>
                </div>
              </div>

              <div className="space-y-1">
                <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Created Date
                </span>
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Clock className="size-3.5 text-[#047857]" />
                  {formatDate(appointment.createdAt)}
                </span>
              </div>
            </div>

            {/* Patient & Doctor Grid */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Patient Info Card */}
              <div className="rounded-[20px] border border-slate-200/60 p-5 bg-white space-y-4 shadow-2xs hover:border-[#047857]/30 transition-all duration-300">
                <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2.5 flex items-center gap-2">
                  <User className="size-4 text-sky-500" /> Patient Details
                </h3>

                <div className="flex items-center gap-3">
                  <div className="size-11 rounded-full bg-sky-50 border border-sky-100 flex items-center justify-center font-bold text-sky-600 text-sm shrink-0">
                    {appointment.patient?.name?.charAt(0).toUpperCase() || "P"}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-slate-850 text-base leading-tight truncate">
                      {appointment.patient?.name || "N/A"}
                    </h4>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                      Patient Account
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5 text-sm font-semibold text-slate-750 pt-1">
                  <div className="flex justify-between items-center py-0.5 border-b border-slate-5">
                    <span className="text-slate-400">Email</span>
                    <a
                      href={`mailto:${appointment.patient?.email}`}
                      className="text-slate-800 hover:text-sky-600 hover:underline truncate max-w-[200px]"
                      title={appointment.patient?.email}
                    >
                      {appointment.patient?.email || "N/A"}
                    </a>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-slate-400">Patient ID</span>
                    <span className="text-slate-800 font-mono text-xs bg-slate-50 border border-slate-150 px-2 py-0.5 rounded">
                      {appointment.patientId || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Doctor Info Card */}
              <div className="rounded-[20px] border border-slate-200/60 p-5 bg-white space-y-4 shadow-2xs hover:border-[#047857]/30 transition-all duration-300">
                <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2.5 flex items-center gap-2">
                  <Stethoscope className="size-4 text-emerald-500" /> Doctor Details
                </h3>

                <div className="flex items-center gap-3">
                  <div className="size-11 rounded-full bg-emerald-50 border border-emerald-100 overflow-hidden flex items-center justify-center font-bold text-emerald-600 text-sm shrink-0">
                    {appointment.doctor?.profilePhoto ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={appointment.doctor.profilePhoto}
                        alt={appointment.doctor.name || "Doctor"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      appointment.doctor?.name?.charAt(0).toUpperCase() || "D"
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-slate-850 text-base leading-tight truncate">
                      {appointment.doctor?.name || "N/A"}
                    </h4>
                    <p className="text-xs font-semibold text-[#047857] truncate">
                      {appointment.doctor?.designation || "Practitioner"}
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5 text-sm font-semibold text-slate-750 pt-1">
                  <div className="flex justify-between items-center py-0.5 border-b border-slate-5">
                    <span className="text-slate-400">Email</span>
                    <a
                      href={`mailto:${appointment.doctor?.email}`}
                      className="text-slate-800 hover:text-[#047857] hover:underline truncate max-w-[200px]"
                      title={appointment.doctor?.email}
                    >
                      {appointment.doctor?.email || "N/A"}
                    </a>
                  </div>
                  {appointment.doctor?.currentWorkingPlace && (
                    <div className="flex justify-between items-center py-0.5 border-b border-slate-5">
                      <span className="text-slate-400">Workplace</span>
                      <span
                        className="text-slate-800 text-right truncate max-w-[180px]"
                        title={appointment.doctor.currentWorkingPlace}
                      >
                        {appointment.doctor.currentWorkingPlace}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-slate-400">Doctor ID</span>
                    <span className="text-slate-800 font-mono text-xs bg-slate-50 border border-slate-150 px-2 py-0.5 rounded">
                      {appointment.doctorId || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule, Session & Billing Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Timing Schedule Card */}
              <div className="rounded-[20px] border border-slate-200/60 p-5 bg-white space-y-4 shadow-2xs hover:border-[#047857]/20 transition-all duration-300">
                <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2.5 flex items-center gap-2">
                  <Clock className="size-4 text-violet-500" /> Timing Schedule
                </h3>
                <div className="space-y-3.5 text-xs font-semibold text-slate-700">
                  <div className="space-y-1">
                    <span className="text-slate-400 block uppercase tracking-wider text-[9px] font-extrabold">
                      Start Time
                    </span>
                    <span className="text-slate-805 font-bold block bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      {formatDate(appointment.schedule?.startDateTime)}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400 block uppercase tracking-wider text-[9px] font-extrabold">
                      End Time
                    </span>
                    <span className="text-slate-805 font-bold block bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      {formatDate(appointment.schedule?.endDateTime)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Telehealth Session Card */}
              <div className="rounded-[20px] border border-slate-200/60 p-5 bg-white space-y-4 shadow-2xs hover:border-[#047857]/20 transition-all duration-300">
                <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2.5 flex items-center gap-2">
                  <Video className="size-4 text-rose-500" /> Telehealth Session
                </h3>
                <div className="space-y-3.5 text-xs font-semibold text-slate-750">
                  <div className="space-y-1">
                    <span className="text-slate-400 block uppercase tracking-wider text-[9px] font-extrabold">
                      Video Calling ID
                    </span>
                    {appointment.videoCallingId ? (
                      <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <span
                          className="font-mono text-slate-700 font-bold truncate max-w-[130px]"
                          title={appointment.videoCallingId}
                        >
                          {appointment.videoCallingId}
                        </span>
                        <button
                          onClick={() =>
                            handleCopy(appointment.videoCallingId || "", "video")
                          }
                          className="text-slate-400 hover:text-rose-500 transition-colors p-0.5 rounded hover:bg-slate-100/80 ml-auto shrink-0"
                          title="Copy ID"
                        >
                          {copiedText === "video" ? (
                            <Check className="size-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="size-3.5" />
                          )}
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic block p-2">
                        No active video session ID
                      </span>
                    )}
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#047857]/5 border border-[#047857]/10 text-[#047857] text-[10px] leading-relaxed">
                    Patients can connect using this secure Telehealth room ID once the appointment starts.
                  </div>
                </div>
              </div>

              {/* Billing & Payment Card */}
              <div className="rounded-[20px] border border-slate-200/60 p-5 bg-white space-y-4 shadow-2xs hover:border-[#047857]/20 transition-all duration-300">
                <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2.5 flex items-center gap-2">
                  <CreditCard className="size-4 text-indigo-500" /> Billing & Payment
                </h3>
                <div className="space-y-3.5 text-xs font-semibold text-slate-750">
                  <div className="space-y-1">
                    <span className="text-slate-400 block uppercase tracking-wider text-[9px] font-extrabold">
                      Fee Amount
                    </span>
                    <span className="text-xl font-black text-[#047857] block">
                      ₹
                      {(
                        appointment.payment?.amount ??
                        appointment.doctor?.appointmentFee ??
                        0
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400 block uppercase tracking-wider text-[9px] font-extrabold">
                      Transaction ID
                    </span>
                    {appointment.payment?.transactionId ? (
                      <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <span
                          className="font-mono text-slate-700 font-bold truncate max-w-[130px]"
                          title={appointment.payment.transactionId}
                        >
                          {appointment.payment.transactionId}
                        </span>
                        <button
                          onClick={() =>
                            handleCopy(
                              appointment.payment?.transactionId || "",
                              "tx"
                            )
                          }
                          className="text-slate-400 hover:text-indigo-500 transition-colors p-0.5 rounded hover:bg-slate-100/80 ml-auto shrink-0"
                          title="Copy Transaction ID"
                        >
                          {copiedText === "tx" ? (
                            <Check className="size-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="size-3.5" />
                          )}
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic block p-2">
                        Payment pending / unpaid
                      </span>
                    )}
                  </div>
                  {appointment.payment?.invoiceUrl && (
                    <div className="pt-1.5 border-t border-slate-100 flex justify-end">
                      <a
                        href={appointment.payment.invoiceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#047857] hover:underline"
                      >
                        <FileText className="size-3" /> View Invoice{" "}
                        <ExternalLink className="size-2.5" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ViewAppointmentDialog;
