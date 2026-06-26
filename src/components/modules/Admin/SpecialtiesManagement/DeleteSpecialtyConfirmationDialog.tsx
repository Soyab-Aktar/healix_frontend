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
import { deleteSpecialty } from "@/services/specialty.services";
import { ISpecialty } from "@/types/specialty.types";

interface DeleteSpecialtyConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  specialty: ISpecialty | null;
}

const DeleteSpecialtyConfirmationDialog = ({
  open,
  onOpenChange,
  specialty,
}: DeleteSpecialtyConfirmationDialogProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (id: string) => deleteSpecialty(id),
  });

  const handleDelete = async () => {
    if (!specialty) return;

    try {
      const result = await mutateAsync(specialty.id);

      if (!result.success) {
        toast.error(result.message || "Failed to delete specialty");
        return;
      }

      toast.success(result.message || "Specialty deleted successfully");
      onOpenChange(false);

      void queryClient.invalidateQueries({ queryKey: ["specialties"] });
      void queryClient.refetchQueries({
        queryKey: ["specialties"],
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
            This action cannot be undone. This will permanently delete the specialty
            category{" "}
            <span className="font-semibold text-foreground">
              "{specialty?.title}"
            </span>{" "}
            and remove it from the system.
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
            {isPending ? "Deleting..." : "Delete Specialty"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteSpecialtyConfirmationDialog;
