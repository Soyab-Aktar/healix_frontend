"use client";

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
import { PrescriptionRow } from "@/types/prescription.types";
import { Loader2 } from "lucide-react";
import { useTransition } from "react";

interface PrescriptionDeleteDialogProps {
  item: PrescriptionRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: (id: string) => Promise<void>;
}

const PrescriptionDeleteDialog = ({
  item,
  open,
  onOpenChange,
  onDelete,
}: PrescriptionDeleteDialogProps) => {
  const [isPending, startTransition] = useTransition();

  const handleConfirm = () => {
    if (!item) return;
    startTransition(async () => {
      await onDelete(item.id);
      onOpenChange(false);
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Prescription</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the prescription
            {item?.patient?.name ? ` for ${item.patient.name}` : ""} and its
            associated PDF. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PrescriptionDeleteDialog;