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
      <DialogContent className="sm:max-w-lg border-slate-200/80 p-0 overflow-hidden">
        <DialogHeader className="px-6 py-5 border-b shrink-0 bg-slate-50/50">
          <DialogTitle className="text-xl font-extrabold flex items-center gap-2.5 text-slate-800">
            <MessageSquare className="h-5.5 w-5.5 text-[#047857]" />
            <span className="bg-gradient-to-r from-teal-800 to-emerald-700 bg-clip-text text-transparent">Patient Feedback & Review</span>
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-5 space-y-5">
          {/* Rating Header */}
          <div className="flex flex-col items-center justify-center p-5 border border-emerald-100/60 rounded-xl bg-gradient-to-br from-emerald-50/10 to-teal-50/5 gap-2 shadow-xs">
            <div className="flex items-center gap-1.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-7 w-7 transition-all duration-300 ${
                    i < rating
                      ? "fill-amber-400 text-amber-400 drop-shadow-sm scale-110"
                      : "text-slate-200 fill-transparent"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-extrabold text-slate-800 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-xs mt-1">
              Rating: {rating.toFixed(1)} / 5.0
            </span>
          </div>

          {/* Comment Box */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Comment</span>
            <div className="p-4 bg-slate-50/15 border border-slate-200/60 rounded-xl text-sm font-medium text-slate-750 italic break-words leading-relaxed">
              "{review.comment || "No comment provided."}"
            </div>
          </div>

          {/* Metadata */}
          <div className="border-t border-slate-100 pt-4 space-y-4">
            {/* Patient Info */}
            <div className="flex items-start gap-3 bg-white border border-slate-200/60 rounded-xl p-3 hover:border-emerald-100/50 transition-colors">
              <User className="h-5 w-5 text-sky-500 mt-0.5 shrink-0" />
              <div className="text-xs space-y-0.5">
                <span className="font-bold text-slate-450 block">Written By Patient</span>
                <span className="font-bold text-slate-800">{review.patient?.name || "N/A"}</span>
                <span className="text-slate-400 font-medium block">{review.patient?.email || "N/A"}</span>
              </div>
            </div>

            {/* Doctor Info */}
            <div className="flex items-start gap-3 bg-white border border-slate-200/60 rounded-xl p-3 hover:border-emerald-100/50 transition-colors">
              <Stethoscope className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
              <div className="text-xs space-y-0.5">
                <span className="font-bold text-slate-450 block">For Doctor</span>
                <span className="font-bold text-slate-800">{review.doctor?.name || "N/A"}</span>
                <span className="text-slate-400 font-medium block">{review.doctor?.email || "N/A"}</span>
              </div>
            </div>

            {/* Timings */}
            <div className="flex items-start gap-3 bg-slate-50/15 border border-slate-200/60 rounded-xl p-3">
              <Calendar className="h-4.5 w-4.5 text-purple-500 mt-0.5 shrink-0" />
              <div className="text-xs space-y-0.5">
                <span className="font-bold text-slate-450 block">Date Submitted</span>
                <span className="text-slate-700 font-semibold">{formatDate(review.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewReviewDialog;
