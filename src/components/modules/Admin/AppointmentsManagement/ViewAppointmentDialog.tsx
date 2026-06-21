import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IAppointment } from "@/types/appointment.types";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, User, Video, CreditCard, Stethoscope } from "lucide-react";
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
  if (!appointment) return null;

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return "N/A";
    return format(new Date(date), "PPP p");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col gap-0 p-0 overflow-hidden border-slate-200/80">
        <DialogHeader className="px-6 py-5 border-b shrink-0 bg-slate-50/50">
          <DialogTitle className="text-xl font-extrabold flex items-center gap-2.5 text-slate-800">
            <Calendar className="h-5.5 w-5.5 text-[#047857]" />
            <span className="bg-gradient-to-r from-teal-800 to-emerald-700 bg-clip-text text-transparent">Appointment Details</span>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-y-auto max-h-[calc(90vh-8rem)]">
          <div className="px-6 py-5 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Appointment Meta */}
              <div className="space-y-4">
                <div className="rounded-xl border border-slate-200/60 bg-slate-50/15 p-4 space-y-3">
                  <h3 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-1.5 flex items-center gap-2">
                    Overview
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-semibold">Appointment ID:</span>
                      <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">{appointment.id}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-semibold">Status:</span>
                      <Badge variant="outline" className={cn(
                        "capitalize font-semibold rounded-full px-2.5 py-0.5 text-xs",
                        appointment.status === "COMPLETED" && "bg-emerald-50 text-emerald-700 border-emerald-100",
                        appointment.status === "CANCELED" && "bg-rose-50 text-rose-700 border-rose-100",
                        appointment.status === "INPROGRESS" && "bg-amber-50 text-amber-750 border-amber-100",
                        appointment.status === "SCHEDULED" && "bg-sky-50 text-sky-700 border-sky-100"
                      )}>
                        {appointment.status?.toLowerCase()}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-semibold">Payment Status:</span>
                      <Badge variant="outline" className={cn(
                        "capitalize font-semibold rounded-full px-2.5 py-0.5 text-xs",
                        appointment.paymentStatus === "PAID" && "bg-emerald-50 text-emerald-700 border-emerald-100",
                        appointment.paymentStatus === "UNPAID" && "bg-amber-50 text-amber-700 border-amber-100",
                        appointment.paymentStatus === "FAILED" && "bg-rose-50 text-rose-750 border-rose-100"
                      )}>
                        {appointment.paymentStatus?.toLowerCase()}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-semibold">Created Date:</span>
                      <span className="font-semibold text-slate-700">{formatDate(appointment.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Video Call Session */}
                <div className="rounded-xl border border-slate-200/60 bg-slate-50/15 p-4 space-y-2.5">
                  <h3 className="font-bold text-sm text-[#047857] flex items-center gap-2 border-b border-slate-100 pb-1.5">
                    <Video className="h-4.5 w-4.5" /> Telehealth Session
                  </h3>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex flex-col gap-1">
                      <span className="text-slate-400 font-semibold text-xs">Video Calling ID:</span>
                      <span className="font-mono text-xs font-semibold text-slate-700 break-all bg-white border border-slate-200/80 rounded-lg p-2.5">
                        {appointment.videoCallingId || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Patient and Doctor */}
              <div className="space-y-4">
                {/* Patient Info */}
                <div className="rounded-xl border border-slate-200/60 p-4 hover:border-emerald-100/80 transition-colors bg-white">
                  <h3 className="font-bold text-sm flex items-center gap-2 mb-3 border-b border-slate-100 pb-1.5 text-slate-800">
                    <User className="h-4.5 w-4.5 text-sky-500" /> Patient Info
                  </h3>
                  <div className="text-sm space-y-1.5">
                    <p className="font-bold text-slate-800">{appointment.patient?.name || "N/A"}</p>
                    <p className="text-slate-500 font-medium text-xs">{appointment.patient?.email || "N/A"}</p>
                    <div className="text-xs text-slate-400 font-mono mt-2 pt-2 border-t border-slate-50">ID: {appointment.patientId}</div>
                  </div>
                </div>

                {/* Doctor Info */}
                <div className="rounded-xl border border-slate-200/60 p-4 hover:border-emerald-100/80 transition-colors bg-white">
                  <h3 className="font-bold text-sm flex items-center gap-2 mb-3 border-b border-slate-100 pb-1.5 text-slate-800">
                    <Stethoscope className="h-4.5 w-4.5 text-emerald-500" /> Doctor Info
                  </h3>
                  <div className="text-sm space-y-1.5">
                    <p className="font-bold text-slate-800">{appointment.doctor?.name || "N/A"}</p>
                    <p className="text-slate-500 font-medium text-xs">{appointment.doctor?.email || "N/A"}</p>
                    {appointment.doctor?.designation && (
                      <p className="text-xs text-slate-450 font-semibold mt-1">
                        {appointment.doctor.designation} • {appointment.doctor.currentWorkingPlace || "Clinic"}
                      </p>
                    )}
                    <div className="text-xs text-slate-400 font-mono mt-2 pt-2 border-t border-slate-50">ID: {appointment.doctorId}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule & Payment Detail */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-200/60 p-4 bg-slate-50/15">
                <h3 className="font-bold text-sm flex items-center gap-2 mb-3 border-b border-slate-100 pb-1.5 text-slate-800">
                  <Calendar className="h-4.5 w-4.5 text-purple-500" /> Timing Schedule
                </h3>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-semibold">Start Time:</span>
                    <span className="font-semibold text-slate-700">{formatDate(appointment.schedule?.startDateTime)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-semibold">End Time:</span>
                    <span className="font-semibold text-slate-700">{formatDate(appointment.schedule?.endDateTime)}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200/60 p-4 bg-slate-50/15">
                <h3 className="font-bold text-sm flex items-center gap-2 mb-3 border-b border-slate-100 pb-1.5 text-slate-800">
                  <CreditCard className="h-4.5 w-4.5 text-indigo-500" /> Payment Info
                </h3>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-semibold">Fee Amount:</span>
                    <span className="font-extrabold text-emerald-600">₹{appointment.payment?.amount?.toFixed(2) || appointment.doctor?.appointmentFee?.toFixed(2) || "0.00"}</span>
                  </div>
                  {appointment.payment?.transactionId && (
                    <div className="flex flex-col gap-1.5 mt-2 pt-2 border-t border-slate-100/50">
                      <span className="text-slate-400 font-semibold text-xs">Transaction ID:</span>
                      <span className="font-mono text-xs font-medium text-slate-700 break-all bg-white border border-slate-200/85 p-2 rounded-lg">
                        {appointment.payment.transactionId}
                      </span>
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
