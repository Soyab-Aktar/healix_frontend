"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { changeAppointmentStatus } from "@/services/appointment.services";
import { AppointmentStatus, IAppointment } from "@/types/appointment.types";
import { FileCheck2, FileText, Loader2, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ManageAppointmentModalProps {
  appointment: IAppointment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreatePrescription: (appointment: IAppointment) => void;
  hasPrescription: boolean;
}

const formatDateTime = (value?: string | Date) => {
  if (!value) return "-";
  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

// Allowed next statuses for a doctor based on the current status.
const NEXT_STATUS_OPTIONS: Record<string, AppointmentStatus[]> = {
  SCHEDULED: ["INPROGRESS", "CANCELED"],
  INPROGRESS: ["COMPLETED"],
  COMPLETED: [],
  CANCELED: [],
};

const STATUS_LABELS: Record<AppointmentStatus, string> = {
  SCHEDULED: "Scheduled",
  INPROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELED: "Canceled",
};

const ManageAppointmentModal = ({
  appointment,
  open,
  onOpenChange,
  onCreatePrescription,
  hasPrescription,
}: ManageAppointmentModalProps) => {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setSelectedStatus("");
  }, [appointment?.id]);

  if (!appointment) return null;

  const currentStatus = appointment.status ?? "";
  const nextStatusOptions = NEXT_STATUS_OPTIONS[currentStatus] ?? [];
  const canUpdateStatus = nextStatusOptions.length > 0;
  const canCreatePrescription = appointment.status === "COMPLETED";

  const handleUpdateStatus = async () => {
    if (!selectedStatus) {
      toast.error("Select a status to update");
      return;
    }

    try {
      setIsUpdating(true);
      const response = await changeAppointmentStatus(appointment.id, selectedStatus);

      if (response?.success) {
        toast.success("Appointment status updated successfully");
        onOpenChange(false);
        router.refresh();
      } else {
        toast.error(response?.message || "Failed to update appointment status");
      }
    } catch (error) {
      console.error("Error updating appointment status:", error);
      toast.error("Failed to update appointment status");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden border-slate-200/80">
        <DialogHeader className="px-6 py-5 border-b shrink-0 bg-slate-50/50">
          <DialogTitle className="text-xl font-extrabold flex items-center gap-2.5 text-slate-800">
            <Calendar className="h-5.5 w-5.5 text-[#047857]" />
            <span className="bg-gradient-to-r from-teal-800 to-emerald-700 bg-clip-text text-transparent">Appointment Details</span>
          </DialogTitle>
          <DialogDescription className="px-1 text-slate-500 font-medium">
            View and manage this appointment.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-5 space-y-4">
          <div className="rounded-xl border border-slate-200/60 bg-slate-50/15 p-5 space-y-3.5 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-semibold">Patient</span>
              <span className="font-extrabold text-slate-850">{appointment.patient?.name ?? "-"}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-semibold">Email</span>
              <span className="font-semibold text-slate-700">{appointment.patient?.email ?? "-"}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-semibold">Schedule</span>
              <span className="font-semibold text-slate-750">{formatDateTime(appointment.schedule?.startDateTime ?? appointment.appointmentStart ?? undefined)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-semibold">Status</span>
              <Badge variant="outline" className={cn(
                "capitalize font-semibold rounded-full px-2.5 py-0.5 text-xs border-slate-200/60",
                appointment.status === "SCHEDULED" && "bg-sky-50 text-sky-700 border-sky-100",
                appointment.status === "INPROGRESS" && "bg-amber-50 text-amber-700 border-amber-100",
                appointment.status === "COMPLETED" && "bg-emerald-50 text-emerald-700 border-emerald-100",
                appointment.status === "CANCELED" && "bg-rose-50 text-rose-750 border-rose-100"
              )}>
                {appointment.status?.toLowerCase()}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-semibold">Payment Status</span>
              <Badge variant="outline" className={cn(
                "capitalize font-semibold rounded-full px-2.5 py-0.5 text-xs border-slate-200/60",
                appointment.paymentStatus === "PAID" && "bg-emerald-50 text-emerald-700 border-emerald-100",
                appointment.paymentStatus === "UNPAID" && "bg-amber-50 text-amber-700 border-amber-100",
                appointment.paymentStatus === "FAILED" && "bg-rose-50 text-rose-750 border-rose-100"
              )}>
                {appointment.paymentStatus?.toLowerCase()}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-semibold">Prescription</span>
              {hasPrescription ? (
                <Badge variant="outline" className="gap-1 text-emerald-600 border-emerald-250 bg-emerald-50 font-semibold rounded-full px-2.5 py-0.5 text-xs">
                  <FileCheck2 className="h-3.5 w-3.5" />
                  Sent
                </Badge>
              ) : (
                <Badge variant="outline" className="text-slate-400 border-slate-200/60 font-semibold rounded-full px-2.5 py-0.5 text-xs">
                  Not Sent
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-semibold">Booked On</span>
              <span className="font-semibold text-slate-700">{formatDateTime(appointment.createdAt)}</span>
            </div>
          </div>

          {canUpdateStatus && (
            <div className="space-y-2 border-t pt-4">
              <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Update Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full rounded-xl border-slate-300 bg-white text-slate-900 focus:ring-emerald-500/10 focus:border-emerald-650" disabled={isUpdating}>
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  {nextStatusOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {STATUS_LABELS[option] ?? option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <DialogFooter className="px-6 py-5 border-t bg-slate-50/50 flex flex-col gap-2 sm:flex-col shrink-0">
          {canCreatePrescription && (
            <Button
              className="w-full bg-[#047857] hover:bg-[#035f43] text-white hover:text-white rounded-lg font-bold gap-2 cursor-pointer transition-colors"
              onClick={() => onCreatePrescription(appointment)}
              disabled={isUpdating || hasPrescription}
              title={hasPrescription ? "Prescription already sent for this appointment" : undefined}
            >
              {hasPrescription ? (
                <FileCheck2 className="h-4 w-4" />
              ) : (
                <FileText className="h-4 w-4" />
              )}
              {hasPrescription ? "Prescription Already Sent" : "Create Prescription"}
            </Button>
          )}

          {canUpdateStatus && (
            <Button
              className="w-full bg-[#047857] hover:bg-[#035f43] text-white hover:text-white rounded-lg font-bold gap-2 cursor-pointer transition-colors"
              onClick={handleUpdateStatus}
              disabled={isUpdating || !selectedStatus}
            >
              {isUpdating && <Loader2 className="h-4 w-4 animate-spin" />}
              Update Status
            </Button>
          )}

          <Button variant="outline" className="w-full rounded-lg font-bold hover:bg-slate-100 hover:text-slate-800 transition-colors" onClick={() => onOpenChange(false)} disabled={isUpdating}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ManageAppointmentModal;