"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { FileCheck2, FileText, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Appointment Details</DialogTitle>
          <DialogDescription>
            View and manage this appointment.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Patient</span>
            <span className="font-medium">{appointment.patient?.name ?? "-"}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Email</span>
            <span>{appointment.patient?.email ?? "-"}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Schedule</span>
            <span>{formatDateTime(appointment.schedule?.startDateTime)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Status</span>
            <Badge variant="outline">{appointment.status}</Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Payment Status</span>
            <Badge variant="outline">{appointment.paymentStatus}</Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Prescription</span>
            {hasPrescription ? (
              <Badge variant="outline" className="gap-1 text-emerald-600 border-emerald-200 bg-emerald-50">
                <FileCheck2 className="h-3.5 w-3.5" />
                Sent
              </Badge>
            ) : (
              <Badge variant="outline" className="text-muted-foreground">
                Not Sent
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Booked On</span>
            <span>{formatDateTime(appointment.createdAt)}</span>
          </div>

          {canUpdateStatus && (
            <div className="space-y-2 border-t pt-3">
              <span className="text-muted-foreground">Update Status</span>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full" disabled={isUpdating}>
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

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          {canCreatePrescription && (
            <Button
              variant="secondary"
              className="w-full"
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
              className="w-full"
              onClick={handleUpdateStatus}
              disabled={isUpdating || !selectedStatus}
            >
              {isUpdating && <Loader2 className="h-4 w-4 animate-spin" />}
              Update Status
            </Button>
          )}

          <Button variant="outline" className="w-full" onClick={() => onOpenChange(false)} disabled={isUpdating}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ManageAppointmentModal;