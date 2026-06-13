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
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Review Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Patient */}
          <div className="flex items-center gap-4 rounded-lg border p-4">
            <Avatar className="h-14 w-14">
              <AvatarImage src={review.patient?.profilePhoto} />
              <AvatarFallback>
                {review.patient?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />

                <p className="font-semibold">
                  {review.patient?.name ?? "Unknown Patient"}
                </p>
              </div>

              {review.patient?.email && (
                <p className="text-sm text-muted-foreground">
                  {review.patient.email}
                </p>
              )}
            </div>
          </div>

          <Separator />

          {/* Rating */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />

              <h3 className="font-semibold">Rating</h3>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <ReviewRating rating={review.rating} size={24} />

              <Badge className="text-base px-3 py-1">
                {review.rating}/5
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Review */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />

              <h3 className="font-semibold">Review</h3>
            </div>

            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="whitespace-pre-wrap leading-7">
                {review.comment}
              </p>
            </div>
          </div>

          <Separator />

          {/* Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />

              <span>
                {format(new Date(review.createdAt), "dd MMM yyyy • hh:mm a")}
              </span>
            </div>

            <Badge variant="outline">
              Appointment ID: {review.appointmentId}
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewReviewDialog;