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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { givePrescription } from "@/services/prescription.services";
import { IAppointment } from "@/types/appointment.types";
import {
  createPrescriptionFormZodSchema,
  type ICreatePrescriptionFormValues,
} from "@/zod/prescription.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Send } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface CreatePrescriptionModalProps {
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

const CreatePrescriptionModal = ({
  appointment,
  open,
  onOpenChange,
}: CreatePrescriptionModalProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ICreatePrescriptionFormValues>({
    resolver: zodResolver(createPrescriptionFormZodSchema),
    defaultValues: {
      appointmentId: appointment?.id ?? "",
      instructions: "",
      followUpDate: "",
    },
  });

  useEffect(() => {
    if (appointment) {
      reset({
        appointmentId: appointment.id,
        instructions: "",
        followUpDate: "",
      });
    }
  }, [appointment, reset]);

  const { mutate, isPending } = useMutation({
    mutationFn: (values: ICreatePrescriptionFormValues) => {
      const payload = {
        appointmentId: values.appointmentId,
        instructions: values.instructions,
        ...(values.followUpDate ? { followUpDate: values.followUpDate } : {}),
      };

      return givePrescription(payload);
    },
    onSuccess: (response) => {
      if (!response?.success) {
        toast.error(response?.message || "Failed to create prescription");
        return;
      }

      toast.success("Prescription created and sent to the patient");
      onOpenChange(false);

      void queryClient.invalidateQueries({ queryKey: ["my-appointments"] });
      void queryClient.invalidateQueries({ queryKey: ["my-prescriptions"] });
      router.refresh();
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Failed to create prescription";
      toast.error(message);
    },
  });

  if (!appointment) return null;

  const onSubmit = (values: ICreatePrescriptionFormValues) => {
    mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !isPending && onOpenChange(next)}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Prescription</DialogTitle>
          <DialogDescription>
            Add prescription details for {appointment.patient?.name ?? "this patient"}. The
            patient will receive it via email once submitted.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between rounded-md border bg-muted/30 p-3">
            <div>
              <p className="font-medium">{appointment.patient?.name ?? "-"}</p>
              <p className="text-xs text-muted-foreground">{appointment.patient?.email ?? "-"}</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Appointment: {formatDateTime(appointment.schedule?.startDateTime)}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register("appointmentId")} />

          <div className="space-y-2">
            <Label htmlFor="instructions">Instructions</Label>
            <Textarea
              id="instructions"
              placeholder="Medication, dosage, advice, etc."
              rows={5}
              disabled={isPending}
              {...register("instructions")}
            />
            {errors.instructions && (
              <p className="text-sm text-destructive">{errors.instructions.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="followUpDate">Follow-up Date</Label>
            <Input
              id="followUpDate"
              type="date"
              disabled={isPending}
              {...register("followUpDate")}
            />
            {errors.followUpDate && (
              <p className="text-sm text-destructive">{errors.followUpDate.message}</p>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Send Prescription
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePrescriptionModal;