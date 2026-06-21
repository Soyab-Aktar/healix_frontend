"use client";

import { useQuery } from "@tanstack/react-query";
import { getReviewsByDoctorId } from "@/services/review.services";
import { IReview } from "@/types/review.types";
import { Star, MessageSquare, User } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DoctorReviewsProps {
  doctorId: string;
  averageRating?: number;
}

const REVIEWS_PER_PAGE = 5;

export default function DoctorReviews({ doctorId, averageRating }: DoctorReviewsProps) {
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<"newest" | "highest" | "lowest">("newest");

  const queryString = new URLSearchParams({
    page: String(page),
    limit: String(REVIEWS_PER_PAGE),
    ...(sortBy === "newest" ? { sortBy: "createdAt", sortOrder: "desc" } : {}),
    ...(sortBy === "highest" ? { sortBy: "rating", sortOrder: "desc" } : {}),
    ...(sortBy === "lowest" ? { sortBy: "rating", sortOrder: "asc" } : {}),
  }).toString();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["reviews", doctorId, page, sortBy],
    queryFn: () => getReviewsByDoctorId(doctorId, queryString),
    staleTime: 1000 * 60 * 5,
  });

  const reviews: IReview[] = (data?.data as IReview[]) ?? [];
  const meta = data?.meta;
  const total = meta?.total ?? 0;
  const totalPages = Math.ceil(total / REVIEWS_PER_PAGE);

  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.round(r.rating) === star).length,
  }));

  const handleSortChange = (next: "newest" | "highest" | "lowest") => {
    setSortBy(next);
    setPage(1);
  };

  return (
    <div className="bg-white rounded-[24px] border border-slate-200 p-6 sm:p-8 shadow-xs">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2.5">
          <MessageSquare className="h-5 w-5 text-emerald-600" />
          <span>Patient Reviews</span>
          {total > 0 && (
            <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full ml-1">
              {total} total
            </span>
          )}
        </h2>

        {/* Sort select */}
        {total > 0 && (
          <Select value={sortBy} onValueChange={(val: any) => handleSortChange(val)} modal={false}>
            <SelectTrigger className="w-[150px] h-9 border-slate-200 rounded-xl bg-white shadow-2xs text-slate-600 focus:ring-emerald-500/20 focus:border-emerald-600 text-xs font-semibold cursor-pointer">
              <SelectValue placeholder="Newest first" />
            </SelectTrigger>
            <SelectContent className="bg-white rounded-xl border border-slate-200 shadow-lg p-1 z-50 text-xs">
              <SelectItem value="newest" className="rounded-lg cursor-pointer px-3 py-2">Newest first</SelectItem>
              <SelectItem value="highest" className="rounded-lg cursor-pointer px-3 py-2">Highest rated</SelectItem>
              <SelectItem value="lowest" className="rounded-lg cursor-pointer px-3 py-2">Lowest rated</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Summary row */}
      {total > 0 && averageRating !== undefined && (
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 p-5 bg-slate-50 border border-slate-100 rounded-2xl">
          {/* Big rating score */}
          <div className="text-center shrink-0 sm:pr-6 sm:border-r border-slate-200/60 space-y-1">
            <p className="text-5xl font-extrabold text-slate-900 tracking-tight">
              {averageRating.toFixed(1)}
            </p>
            <StarRow rating={averageRating} size="md" />
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {total} Review{total !== 1 ? "s" : ""}
            </p>
          </div>
          {/* Bar breakdown */}
          <div className="flex-1 w-full space-y-1.5">
            {ratingCounts.map(({ star, count }) => {
              const pct = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
              return (
                <div key={star} className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                  <span className="w-3 text-right">{star}</span>
                  <Star className="h-3.5 w-3.5 text-emerald-600 fill-emerald-600 shrink-0" />
                  <div className="flex-1 bg-slate-200/60 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-4 text-right text-slate-400">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse flex gap-4 p-4 border border-slate-100 rounded-2xl">
              <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0" />
              <div className="flex-1 space-y-2.5">
                <div className="h-3 bg-slate-200 rounded w-1/4" />
                <div className="h-3 bg-slate-200 rounded w-full" />
                <div className="h-3 bg-slate-200 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {isError && (
        <p className="text-center text-sm font-semibold text-red-500 py-8 bg-red-50/50 rounded-2xl border border-dashed border-red-100">
          Failed to load reviews. Please try again.
        </p>
      )}

      {/* Empty state */}
      {!isLoading && !isError && reviews.length === 0 && (
        <div className="text-center py-12 bg-slate-50/30 rounded-2xl border border-dashed border-slate-200">
          <MessageSquare className="h-10 w-10 text-slate-300 mx-auto mb-3 animate-pulse" />
          <p className="text-slate-400 text-sm font-semibold">No reviews yet for this doctor.</p>
        </div>
      )}

      {/* Review list */}
      {!isLoading && !isError && reviews.length > 0 && (
        <div className="divide-y divide-slate-100">
          {reviews.map((review) => (
            <ReviewItem key={review.id} review={review} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6 pt-5 border-t border-slate-100">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="px-4 py-2 text-xs font-bold border border-slate-200 text-slate-600 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors cursor-pointer"
          >
            ← Prev
          </button>
          <span className="text-xs font-bold text-slate-500">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="px-4 py-2 text-xs font-bold border border-slate-200 text-slate-600 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function ReviewItem({ review }: { review: IReview }) {
  const name = review.patient?.name ?? "Anonymous";
  const photo = review.patient?.profilePhoto;
  const date = new Date(review.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="py-5 flex gap-4 first:pt-0 last:pb-0">
      {/* Avatar */}
      <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-emerald-50 shrink-0 border border-slate-100 shadow-2xs">
        {photo ? (
          <Image src={photo} alt={name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-emerald-600">
            <User className="h-5 w-5" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div>
            <p className="text-sm font-bold text-slate-800 leading-tight">{name}</p>
            <StarRow rating={review.rating} size="sm" />
          </div>
          <time className="text-xs text-slate-400 font-semibold">{date}</time>
        </div>
        {review.comment && (
          <p className="text-sm text-slate-600 leading-relaxed font-medium">"{review.comment}"</p>
        )}
      </div>
    </div>
  );
}

function StarRow({ rating, size }: { rating: number; size: "sm" | "md" }) {
  const cls = size === "md" ? "h-4 w-4" : "h-3.5 w-3.5";
  return (
    <div className="flex items-center gap-0.5 mt-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < Math.floor(rating);
        const half = !filled && i < rating;
        return (
          <span key={i} className="relative inline-block">
            <Star className={`${cls} text-slate-200`} />
            {(filled || half) && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: filled ? "100%" : "50%" }}
              >
                <Star className={`${cls} text-emerald-600 fill-emerald-600`} />
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}