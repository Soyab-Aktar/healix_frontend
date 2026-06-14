"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { changeAppointmentStatusAction } from "@/app/_actions/appointment.actions";
import { IAppointment, AppointmentStatus } from "@/types/appointment.types";

interface EditAppointmentStatusModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: IAppointment | null;
}

const APPOINTMENT_STATUSES = [
  { label: "Scheduled", value: "SCHEDULED" },
  { label: "In Progress", value: "INPROGRESS" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Canceled", value: "CANCELED" },
];

const EditAppointmentStatusModal = ({
  open,
  onOpenChange,
  appointment,
}: EditAppointmentStatusModalProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  useEffect(() => {
    if (appointment) {
      setSelectedStatus(appointment.status || "SCHEDULED");
    }
  }, [appointment, open]);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({
      appointmentId,
      status,
    }: {
      appointmentId: string;
      status: string;
    }) => changeAppointmentStatusAction(appointmentId, status),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointment) return;

    try {
      const result = await mutateAsync({
        appointmentId: appointment.id,
        status: selectedStatus,
      });

      if (!result.success) {
        toast.error(result.message || "Failed to update appointment status");
        return;
      }

      toast.success(result.message || "Appointment status updated successfully");
      onOpenChange(false);

      void queryClient.invalidateQueries({ queryKey: ["appointments"] });
      void queryClient.refetchQueries({
        queryKey: ["appointments"],
        type: "active",
      });
      router.refresh();
    } catch (err) {
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Update Appointment Status</DialogTitle>
          <DialogDescription>
            Change the current status of this appointment. This update will be
            reflected immediately.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Select Status
            </label>
            <Select
              value={selectedStatus}
              onValueChange={setSelectedStatus}
              disabled={isPending}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {APPOINTMENT_STATUSES.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditAppointmentStatusModal;
