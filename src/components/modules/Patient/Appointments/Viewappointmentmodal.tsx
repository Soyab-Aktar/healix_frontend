"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { changeAppointmentStatus } from "@/services/appointment.services";
import { IAppointment, AppointmentStatus, PaymentStatus } from "@/types/appointment.types";
import { Loader2, Calendar, Stethoscope, Briefcase, Receipt, ShieldCheck, MapPin, IndianRupee } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface ViewAppointmentModalProps {
  appointment: IAppointment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formatDateTime = (value?: string | Date) => {
  if (!value) return "-";
  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const statusBadgeStyles: Record<AppointmentStatus, string> = {
  SCHEDULED: "bg-blue-50 text-blue-700 border-blue-100/80",
  INPROGRESS: "bg-amber-50 text-amber-700 border-amber-100/80",
  COMPLETED: "bg-emerald-50 text-[#047857] border-emerald-100/80",
  CANCELED: "bg-rose-50 text-rose-700 border-rose-100/80",
};

const paymentBadgeStyles: Record<PaymentStatus, string> = {
  PAID: "bg-emerald-50 text-[#047857] border-emerald-100/80",
  UNPAID: "bg-amber-50 text-amber-700 border-amber-100/80",
  FAILED: "bg-rose-50 text-rose-700 border-rose-100/80",
};

const ViewAppointmentModal = ({ appointment, open, onOpenChange }: ViewAppointmentModalProps) => {
  const router = useRouter();
  const [isCancelling, setIsCancelling] = useState(false);

  if (!appointment) return null;

  const canCancel = appointment.status === "SCHEDULED";
  const doctor = appointment.doctor;
  const initial = doctor?.name?.charAt(0).toUpperCase() ?? "D";

  const handleCancel = async () => {
    try {
      setIsCancelling(true);
      const response = await changeAppointmentStatus(appointment.id, "CANCELED");

      if (response?.success) {
        toast.success("Appointment cancelled successfully");
        onOpenChange(false);
        router.refresh();
      } else {
        toast.error(response?.message || "Failed to cancel appointment");
      }
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      toast.error("Failed to cancel appointment");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-[24px] border border-slate-200/60 p-6">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-xl font-bold text-slate-800">Appointment Details</DialogTitle>
          <DialogDescription className="text-slate-400 font-medium">
            Review detailed metrics about this slot.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Doctor Info squircle avatar card */}
          <div className="rounded-[20px] border border-slate-200/60 p-4.5 bg-slate-50/50 flex gap-4 items-start">
            <div className="relative shrink-0">
              <div className="relative w-16 h-16 rounded-[16px] overflow-hidden bg-emerald-50 border border-slate-100 flex items-center justify-center text-emerald-600 font-extrabold text-lg shadow-2xs">
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
              <div className="absolute -bottom-1 -left-1 w-5.5 h-5.5 rounded-full bg-white flex items-center justify-center shadow-md border border-slate-50">
                <div className="w-4.5 h-4.5 rounded-full bg-emerald-50 flex items-center justify-center">
                  <ShieldCheck className="h-3 w-3 text-[#047857] fill-[#047857]/10" />
                </div>
              </div>
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-slate-800 text-base mb-0.5 truncate">{doctor?.name ?? "-"}</h4>
              {doctor?.designation && (
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 truncate flex items-center gap-1">
                  <Briefcase className="h-3 w-3 text-slate-400" />
                  {doctor.designation}
                </p>
              )}
              {doctor?.currentWorkingPlace && (
                <p className="text-xs font-semibold text-slate-500 truncate flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-[#047857]" />
                  {doctor.currentWorkingPlace}
                </p>
              )}
            </div>
          </div>

          {/* Booking Details Card */}
          <div className="rounded-[20px] border border-slate-200/60 p-4.5 space-y-3.5 bg-white shadow-2xs">
            <p className="text-xs font-bold text-[#047857] uppercase tracking-wide flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Calendar className="h-4 w-4 text-[#047857]" /> Schedule Details
            </p>
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="text-slate-400">Appointment Time</span>
              <span className="text-slate-800 font-bold">{formatDateTime(appointment.schedule?.startDateTime)}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="text-slate-400">Appointment Status</span>
              <span className={`inline-flex items-center text-xs font-bold px-2.5 py-0.5 rounded-full border ${statusBadgeStyles[appointment.status as AppointmentStatus] || "bg-slate-50 text-slate-700 border-slate-100"}`}>
                {appointment.status}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="text-slate-400">Booked On</span>
              <span className="text-slate-600 font-semibold">{formatDateTime(appointment.createdAt)}</span>
            </div>
          </div>

          {/* Payment Details Card */}
          <div className="rounded-[20px] border border-slate-200/60 p-4.5 space-y-3.5 bg-white shadow-2xs">
            <p className="text-xs font-bold text-[#047857] uppercase tracking-wide flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Receipt className="h-4 w-4 text-[#047857]" /> Fee & Payment
            </p>
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="text-slate-400">Payment Status</span>
              <span className={`inline-flex items-center text-xs font-bold px-2.5 py-0.5 rounded-full border ${paymentBadgeStyles[appointment.paymentStatus as PaymentStatus] || "bg-slate-50 text-slate-700 border-slate-100"}`}>
                {appointment.paymentStatus}
              </span>
            </div>
            {appointment.payment?.amount !== undefined && (
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-slate-400">Appointment Fee</span>
                <span className="text-[#047857] font-extrabold flex items-center gap-0.5 text-base">
                  <IndianRupee className="h-3.5 w-3.5 fill-[#047857]/10" />
                  {appointment.payment.amount}
                </span>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="pt-2 gap-2 sm:gap-0">
          {canCancel && (
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={isCancelling}
              className="rounded-full font-bold shadow-sm"
            >
              {isCancelling && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
              Cancel Appointment
            </Button>
          )}

          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isCancelling}
            className="rounded-full font-bold border-slate-200 hover:bg-slate-50 transition-colors"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewAppointmentModal;