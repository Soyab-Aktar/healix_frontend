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
import { changeUserStatus } from "@/services/patient.services";
import { IPatient } from "@/types/patient.types";

interface ChangePatientStatusModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: IPatient | null;
}

const ChangePatientStatusModal = ({
  open,
  onOpenChange,
  patient,
}: ChangePatientStatusModalProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    if (patient) {
      setStatus(patient.user?.status || "ACTIVE");
    }
  }, [patient, open]);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: string }) =>
      changeUserStatus(userId, status),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patient) return;

    try {
      const result = await mutateAsync({
        userId: patient.userId,
        status,
      });

      if (!result.success) {
        toast.error(result.message || "Failed to change patient status");
        return;
      }

      toast.success(result.message || "Patient account status updated successfully");
      onOpenChange(false);

      void queryClient.invalidateQueries({ queryKey: ["patients"] });
      void queryClient.refetchQueries({
        queryKey: ["patients"],
        type: "active",
      });
      router.refresh();
    } catch (err) {
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-slate-200/80">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-teal-800 to-emerald-700 bg-clip-text text-transparent">Moderate Patient Status</DialogTitle>
          <DialogDescription className="text-slate-500 font-medium">
            Activate or suspend this patient's system credentials. Suspended
            (blocked) patients won't be able to log in or schedule consultations.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-3">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">
              Account Status
            </label>
            <Select
              value={status}
              onValueChange={setStatus}
              disabled={isPending}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="BLOCKED">Blocked</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-4 border-t border-slate-100 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="rounded-lg cursor-pointer"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isPending}
              className="bg-[#047857] hover:bg-[#035f43] text-white font-bold rounded-lg transition-all duration-300 cursor-pointer"
            >
              {isPending ? "Updating..." : "Update Status"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePatientStatusModal;
