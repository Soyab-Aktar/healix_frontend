import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IAppointment } from "@/types/appointment.types";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Video, CreditCard, Stethoscope } from "lucide-react";
import { format } from "date-fns";

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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Appointment Details
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Appointment Meta */}
          <div className="space-y-4">
            <div className="rounded-lg border bg-muted/40 p-4">
              <h3 className="font-semibold text-sm text-muted-foreground mb-2">Overview</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID:</span>
                  <span className="font-mono text-xs">{appointment.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant="outline" className="capitalize">
                    {appointment.status?.toLowerCase()}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Payment:</span>
                  <Badge variant="outline" className="capitalize">
                    {appointment.paymentStatus?.toLowerCase()}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span>{formatDate(appointment.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Video Call Session */}
            <div className="rounded-lg border bg-muted/40 p-4">
              <h3 className="font-semibold text-sm text-primary flex items-center gap-2 mb-2">
                <Video className="h-4 w-4" /> Telehealth Session
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground">Video Calling ID:</span>
                  <span className="font-mono text-xs break-all bg-background border rounded p-1.5">
                    {appointment.videoCallingId || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Patient and Doctor */}
          <div className="space-y-4">
            {/* Patient Info */}
            <div className="rounded-lg border p-4">
              <h3 className="font-semibold text-sm flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-sky-500" /> Patient Info
              </h3>
              <div className="text-sm space-y-1">
                <p className="font-medium">{appointment.patient?.name || "N/A"}</p>
                <p className="text-muted-foreground text-xs">{appointment.patient?.email || "N/A"}</p>
                <p className="text-xs text-muted-foreground mt-2">ID: <span className="font-mono">{appointment.patientId}</span></p>
              </div>
            </div>

            {/* Doctor Info */}
            <div className="rounded-lg border p-4">
              <h3 className="font-semibold text-sm flex items-center gap-2 mb-2">
                <Stethoscope className="h-4 w-4 text-emerald-500" /> Doctor Info
              </h3>
              <div className="text-sm space-y-1">
                <p className="font-medium">{appointment.doctor?.name || "N/A"}</p>
                <p className="text-muted-foreground text-xs">{appointment.doctor?.email || "N/A"}</p>
                {appointment.doctor?.designation && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {appointment.doctor.designation} at {appointment.doctor.currentWorkingPlace || "Clinic"}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-2">ID: <span className="font-mono">{appointment.doctorId}</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule & Payment Detail */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold text-sm flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-purple-500" /> Timing Schedule
            </h3>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Start Time:</span>
                <span>{formatDate(appointment.schedule?.startDateTime)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">End Time:</span>
                <span>{formatDate(appointment.schedule?.endDateTime)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="font-semibold text-sm flex items-center gap-2 mb-2">
              <CreditCard className="h-4 w-4 text-indigo-500" /> Payment Info
            </h3>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fee Amount:</span>
                <span className="font-semibold text-green-600">₹{appointment.payment?.amount?.toFixed(2) || appointment.doctor?.appointmentFee?.toFixed(2) || "0.00"}</span>
              </div>
              {appointment.payment?.transactionId && (
                <div className="flex flex-col gap-0.5 mt-1">
                  <span className="text-muted-foreground text-xs">Transaction ID:</span>
                  <span className="font-mono text-[10px] break-all bg-background border p-1 rounded">
                    {appointment.payment.transactionId}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewAppointmentDialog;
