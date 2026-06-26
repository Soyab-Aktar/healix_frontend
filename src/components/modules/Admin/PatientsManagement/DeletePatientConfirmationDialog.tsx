"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deletePatient } from "@/services/patient.services";
import { IPatient } from "@/types/patient.types";

interface DeletePatientConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: IPatient | null;
}

const DeletePatientConfirmationDialog = ({
  open,
  onOpenChange,
  patient,
}: DeletePatientConfirmationDialogProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (id: string) => deletePatient(id),
  });

  const handleDelete = async () => {
    if (!patient) return;

    try {
      const result = await mutateAsync(patient.id);

      if (!result.success) {
        toast.error(result.message || "Failed to delete patient");
        return;
      }

      toast.success(result.message || "Patient deleted successfully");
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
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will soft-delete the patient account for{" "}
            <span className="font-semibold text-foreground">
              "{patient?.name}"
            </span>{" "}
            and mark their profile status as DELETED. Their active sessions and credentials will be purged.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={(e) => {
              e.preventDefault();
              void handleDelete();
            }}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete Patient"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeletePatientConfirmationDialog;
