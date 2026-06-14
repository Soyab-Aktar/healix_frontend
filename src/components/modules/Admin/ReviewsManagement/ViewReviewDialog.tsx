import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IReview } from "@/types/review.types";
import { Star, MessageSquare, User, Stethoscope, Calendar } from "lucide-react";
import { format } from "date-fns";

interface ViewReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  review: IReview | null;
}

const ViewReviewDialog = ({
  open,
  onOpenChange,
  review,
}: ViewReviewDialogProps) => {
  if (!review) return null;

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return "N/A";
    return format(new Date(date), "PPP p");
  };

  const rating = review.rating ?? 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Patient Feedback & Review
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {/* Rating Header */}
          <div className="flex flex-col items-center justify-center p-4 border rounded-lg bg-muted/40 gap-1.5">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-6 w-6 ${
                    i < rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground/30 fill-transparent"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-semibold">
              Rating: {rating.toFixed(1)} / 5.0
            </span>
          </div>

          {/* Comment Box */}
          <div className="space-y-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Comment</span>
            <div className="p-3 bg-muted/20 border rounded-lg text-sm text-foreground italic break-words">
              "{review.comment || "No comment provided."}"
            </div>
          </div>

          {/* Metadata */}
          <div className="border-t pt-4 space-y-3">
            {/* Patient Info */}
            <div className="flex items-start gap-3">
              <User className="h-4 w-4 text-sky-500 mt-0.5" />
              <div className="text-xs">
                <span className="font-semibold block">Written By Patient:</span>
                <span className="text-muted-foreground">{review.patient?.name || "N/A"} ({review.patient?.email || "N/A"})</span>
              </div>
            </div>

            {/* Doctor Info */}
            <div className="flex items-start gap-3">
              <Stethoscope className="h-4 w-4 text-emerald-500 mt-0.5" />
              <div className="text-xs">
                <span className="font-semibold block">For Doctor:</span>
                <span className="text-muted-foreground">{review.doctor?.name || "N/A"} ({review.doctor?.email || "N/A"})</span>
              </div>
            </div>

            {/* Timings */}
            <div className="flex items-start gap-3">
              <Calendar className="h-4 w-4 text-purple-500 mt-0.5" />
              <div className="text-xs">
                <span className="font-semibold block">Date Submitted:</span>
                <span className="text-muted-foreground">{formatDate(review.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewReviewDialog;
