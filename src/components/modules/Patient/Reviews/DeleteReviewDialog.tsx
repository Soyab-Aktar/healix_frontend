"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { deleteReview } from "@/services/review.services";
import { IReview } from "@/types/review.types";

interface DeleteReviewDialogProps {
  review: IReview | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function DeleteReviewDialog({
  review,
  open,
  onOpenChange,
  onSuccess,
}: DeleteReviewDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDelete = async () => {
    if (!review) return;

    try {
      setIsSubmitting(true);
      await deleteReview(review.id);
      toast.success("Review deleted successfully.");
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error deleting review:", error);
      toast.error(error?.response?.data?.message || "Failed to delete review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-[24px]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="h-5 w-5 text-rose-600" />
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-rose-650 to-rose-800 bg-clip-text text-transparent">
              Delete Review
            </DialogTitle>
          </div>
          <DialogDescription className="text-slate-500 font-medium">
            Are you sure you want to delete this review? This action cannot be undone and will recalculate the doctor's average rating.
          </DialogDescription>
        </DialogHeader>

        {review && (
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Review for Dr. {review.doctor?.name}
            </p>
            <p className="text-sm text-slate-650 italic">"{review.comment}"</p>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0 pt-2">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => onOpenChange(false)}
            className="rounded-lg font-bold border-slate-350 text-slate-700"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={isSubmitting}
            onClick={handleDelete}
            className="bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg transition-all"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Yes, Delete Review"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
