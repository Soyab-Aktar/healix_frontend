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
import { deleteAdmin } from "@/services/admin.services";
import { IAdmin } from "@/types/admin.types";

interface DeleteAdminConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  admin: IAdmin | null;
}

const DeleteAdminConfirmationDialog = ({
  open,
  onOpenChange,
  admin,
}: DeleteAdminConfirmationDialogProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (id: string) => deleteAdmin(id),
  });

  const handleDelete = async () => {
    if (!admin) return;

    try {
      const result = await mutateAsync(admin.id);

      if (!result.success) {
        toast.error(result.message || "Failed to delete admin");
        return;
      }

      toast.success(result.message || "Admin account deleted successfully");
      onOpenChange(false);

      void queryClient.invalidateQueries({ queryKey: ["admins"] });
      void queryClient.refetchQueries({
        queryKey: ["admins"],
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
            This action will soft-delete the admin credentials for{" "}
            <span className="font-semibold text-foreground font-medium">
              "{admin?.name}"
            </span>{" "}
            and set their user status to DELETED.
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
            {isPending ? "Deleting..." : "Delete Admin"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAdminConfirmationDialog;
