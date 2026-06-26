"use client";

import { format } from "date-fns";
import { CalendarDays, MessageSquare, Star, User } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { IReview } from "@/types/review.types";
import ReviewRating from "./ReviewRating";

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden border-slate-200/80">
        <DialogHeader className="px-6 py-5 border-b shrink-0 bg-slate-50/50">
          <DialogTitle className="text-xl font-extrabold flex items-center gap-2.5 text-slate-800">
            <MessageSquare className="h-5.5 w-5.5 text-[#047857]" />
            <span className="bg-gradient-to-r from-teal-800 to-emerald-700 bg-clip-text text-transparent">Patient Review Details</span>
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-5 space-y-5">
          {/* Patient */}
          <div className="flex items-center gap-4 rounded-xl border border-slate-200/60 bg-slate-50/15 p-4">
            <Avatar className="h-14 w-14 border border-slate-200/80">
              <AvatarImage src={review.patient?.profilePhoto} />
              <AvatarFallback className="bg-emerald-50 text-[#047857] font-bold">
                {review.patient?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-emerald-600" />
                <p className="font-semibold text-slate-800">
                  {review.patient?.name ?? "Unknown Patient"}
                </p>
              </div>

              {review.patient?.email && (
                <p className="text-sm text-slate-500 font-medium mt-0.5">
                  {review.patient.email}
                </p>
              )}
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Star className="h-4.5 w-4.5 text-yellow-500 fill-yellow-500" />
              <h3 className="font-bold text-sm text-slate-700 uppercase tracking-wider">Rating</h3>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-200/60 bg-white p-4">
              <ReviewRating rating={review.rating} size={24} />
              <Badge className="text-sm font-bold bg-[#047857] text-white hover:bg-[#035f43] rounded-full px-3 py-0.5">
                {review.rating}/5
              </Badge>
            </div>
          </div>

          {/* Review Text */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4.5 w-4.5 text-emerald-600" />
              <h3 className="font-bold text-sm text-slate-700 uppercase tracking-wider">Comments</h3>
            </div>

            <div className="rounded-xl border border-slate-200/60 bg-slate-50/15 p-4">
              <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed font-medium">
                {review.comment}
              </p>
            </div>
          </div>

          <Separator className="bg-slate-100" />

          {/* Footer Info */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 font-semibold pb-1">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-slate-450" />
              <span>
                {format(new Date(review.createdAt), "dd MMM yyyy • hh:mm a")}
              </span>
            </div>

            <Badge variant="outline" className="font-mono text-slate-500 border-slate-200/80 rounded-md">
              Appointment: {review.appointmentId}
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewReviewDialog;