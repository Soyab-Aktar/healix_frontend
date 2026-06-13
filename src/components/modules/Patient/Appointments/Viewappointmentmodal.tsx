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
import { changeAppointmentStatus } from "@/services/appointment.services";
import { IAppointment } from "@/types/appointment.types";
import { Loader2 } from "lucide-react";
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

const ViewAppointmentModal = ({ appointment, open, onOpenChange }: ViewAppointmentModalProps) => {
  const router = useRouter();
  const [isCancelling, setIsCancelling] = useState(false);

  if (!appointment) return null;

  const canCancel = appointment.status === "SCHEDULED";

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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Appointment Details</DialogTitle>
          <DialogDescription>
            View your appointment information below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Doctor</span>
            <span className="font-medium">{appointment.doctor?.name ?? "-"}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Designation</span>
            <span>{appointment.doctor?.designation ?? "-"}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Workplace</span>
            <span>{appointment.doctor?.currentWorkingPlace ?? "-"}</span>
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

          {appointment.payment?.amount !== undefined && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Fee</span>
              <span>₹{appointment.payment.amount}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Booked On</span>
            <span>{formatDateTime(appointment.createdAt)}</span>
          </div>
        </div>

        <DialogFooter>
          {canCancel && (
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={isCancelling}
            >
              {isCancelling && <Loader2 className="h-4 w-4 animate-spin" />}
              Cancel Appointment
            </Button>
          )}

          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isCancelling}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewAppointmentModal;