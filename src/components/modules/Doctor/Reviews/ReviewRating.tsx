"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewRatingProps {
  rating: number;
  size?: number;
  showText?: boolean;
  className?: string;
}

const ReviewRating = ({
  rating,
  size = 18,
  showText = false,
  className,
}: ReviewRatingProps) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = rating >= star;
          const half = rating >= star - 0.5 && rating < star;

          return (
            <div key={star} className="relative">
              {/* Empty Star */}
              <Star
                size={size}
                className="text-muted-foreground/30"
                fill="currentColor"
              />

              {/* Filled / Half Filled */}
              {(filled || half) && (
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{
                    width: filled ? "100%" : "50%",
                  }}
                >
                  <Star
                    size={size}
                    className="text-yellow-500"
                    fill="currentColor"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showText && (
        <span className="text-sm font-medium text-muted-foreground">
          {rating.toFixed(1)} / 5
        </span>
      )}
    </div>
  );
};

export default ReviewRating;