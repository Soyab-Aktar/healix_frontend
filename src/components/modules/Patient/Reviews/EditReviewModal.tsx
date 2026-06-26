"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Star, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { updateReview } from "@/services/review.services";
import { IReview } from "@/types/review.types";

interface EditReviewModalProps {
  review: IReview | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function EditReviewModal({
  review,
  open,
  onOpenChange,
  onSuccess,
}: EditReviewModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (review) {
      setRating(review.rating);
      setComment(review.comment);
    }
  }, [review]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!review) return;
    if (!comment.trim()) {
      toast.error("Please enter a review comment.");
      return;
    }

    try {
      setIsSubmitting(true);
      await updateReview(review.id, {
        rating,
        comment: comment.trim(),
      });
      toast.success("Review updated successfully.");
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error updating review:", error);
      toast.error(error?.response?.data?.message || "Failed to update review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-[24px]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Star className="h-5 w-5 text-emerald-600 fill-emerald-600" />
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-[#0d9488] to-[#047857] bg-clip-text text-transparent">
              Edit Review
            </DialogTitle>
          </div>
          <DialogDescription className="text-slate-500 font-medium">
            Update your rating or comments for Dr. {review?.doctor?.name ?? "your practitioner"}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-3">
          {/* Rating Stars */}
          <div className="space-y-2">
            <Label className="text-sm font-bold text-slate-700">Rating</Label>
            <div className="flex items-center gap-1.5 py-1">
              {[1, 2, 3, 4, 5].map((star) => {
                const isHighlighted = hoveredRating !== null ? star <= hoveredRating : star <= rating;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(null)}
                    className="p-1 hover:scale-115 transition-transform duration-150 cursor-pointer focus:outline-none"
                    aria-label={`Rate ${star} Stars`}
                  >
                    <Star
                      className={`h-8 w-8 transition-colors duration-150 ${
                        isHighlighted
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-slate-200 fill-transparent"
                      }`}
                    />
                  </button>
                );
              })}
              <span className="text-sm font-bold text-slate-500 ml-2">
                ({rating} / 5)
              </span>
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment" className="text-sm font-bold text-slate-700">
              Review Comment
            </Label>
            <Textarea
              id="comment"
              placeholder="Write your review details..."
              className="min-h-[100px] rounded-lg border-slate-200 hover:border-emerald-500/30 focus-visible:border-[#047857] focus-visible:ring-emerald-500/20 transition-all bg-white"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

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
              type="submit"
              disabled={isSubmitting}
              className="bg-[#047857] hover:bg-[#035f43] text-white font-bold rounded-lg transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Review"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
