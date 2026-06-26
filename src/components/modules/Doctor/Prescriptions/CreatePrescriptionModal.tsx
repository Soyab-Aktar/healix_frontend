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
import { Loader2, Send, FileText } from "lucide-react";
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
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden border-slate-200/80">
        <DialogHeader className="px-6 py-5 border-b shrink-0 bg-slate-50/50">
          <DialogTitle className="text-xl font-extrabold flex items-center gap-2.5 text-slate-800">
            <FileText className="h-5.5 w-5.5 text-[#047857]" />
            <span className="bg-gradient-to-r from-teal-800 to-emerald-700 bg-clip-text text-transparent">Create Prescription</span>
          </DialogTitle>
          <DialogDescription className="px-1 text-slate-500 font-medium">
            Add prescription details for {appointment.patient?.name ?? "this patient"}. The patient will receive it via email once submitted.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pt-5 pb-0 text-sm">
          <div className="flex items-center justify-between rounded-xl border border-slate-200/60 bg-slate-50/15 p-4">
            <div>
              <p className="font-extrabold text-slate-800">{appointment.patient?.name ?? "-"}</p>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">{appointment.patient?.email ?? "-"}</p>
            </div>
            <p className="text-xs text-slate-400 font-semibold">
              Appointment: {formatDateTime(appointment.schedule?.startDateTime)}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-4">
          <input type="hidden" {...register("appointmentId")} />

          <div className="space-y-1.5">
            <Label htmlFor="instructions" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Instructions</Label>
            <Textarea
              id="instructions"
              placeholder="Medication, dosage, advice, etc."
              rows={5}
              disabled={isPending}
              className="rounded-xl border-slate-300 focus-visible:ring-emerald-500/10 focus-visible:border-emerald-650"
              {...register("instructions")}
            />
            {errors.instructions && (
              <p className="text-xs text-destructive font-semibold">{errors.instructions.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="followUpDate" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Follow-up Date</Label>
            <Input
              id="followUpDate"
              type="date"
              disabled={isPending}
              className="rounded-xl border-slate-300 focus-visible:ring-emerald-500/10 focus-visible:border-emerald-650"
              {...register("followUpDate")}
            />
            {errors.followUpDate && (
              <p className="text-xs text-destructive font-semibold">{errors.followUpDate.message}</p>
            )}
          </div>

          <DialogFooter className="border-t pt-4 flex flex-row items-center justify-end gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="rounded-lg font-bold hover:bg-slate-100 hover:text-slate-800 transition-colors"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="bg-[#047857] hover:bg-[#035f43] text-white hover:text-white rounded-lg font-bold gap-2 transition-colors">
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