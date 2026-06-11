"use client";

import { useQuery } from "@tanstack/react-query";
import { getReviewsByDoctorId } from "@/services/review.services";
import { IReview } from "@/types/review.types";
import { Star, MessageSquare, User } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

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

  // Rating distribution (from current page data — ideally your API returns aggregated stats)
  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.round(r.rating) === star).length,
  }));

  const handleSortChange = (next: "newest" | "highest" | "lowest") => {
    setSortBy(next);
    setPage(1);
  };

  return (
    <div className= "bg-white rounded-2xl border border-gray-200 p-6" >
    {/* Section Header */ }
    < div className = "flex items-center justify-between mb-6" >
      <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2" >
        <MessageSquare className="h-5 w-5 text-blue-500" />
          Patient Reviews
  {
    total > 0 && (
      <span className="text-sm font-normal text-gray-400 ml-1" > ({ total }) </span>
          )
  }
  </h2>

  {/* Sort */ }
  {
    total > 0 && (
      <select
            value={ sortBy }
    onChange = {(e) => handleSortChange(e.target.value as typeof sortBy)
  }
  className = "text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
    <option value="newest" > Newest first </option>
      < option value = "highest" > Highest rated </option>
        < option value = "lowest" > Lowest rated </option>
          </select>
        )
}
</div>

{/* Summary row */ }
{
  total > 0 && averageRating !== undefined && (
    <div className="flex items-start gap-8 mb-6 p-4 bg-gray-50 rounded-xl" >
      {/* Big avg */ }
      < div className = "text-center shrink-0" >
        <p className="text-5xl font-bold text-gray-900" > { averageRating.toFixed(1) } </p>
          < StarRow rating = { averageRating } size = "md" />
            <p className="text-xs text-gray-400 mt-1" > { total } review{ total !== 1 ? "s" : "" } </p>
              </div>
  {/* Bar breakdown */ }
  <div className="flex-1 space-y-1.5" >
  {
    ratingCounts.map(({ star, count }) => {
      const pct = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
      return (
        <div key= { star } className = "flex items-center gap-2 text-xs text-gray-500" >
          <span className="w-4 text-right" > { star } </span>
            < Star className = "h-3 w-3 text-amber-400 fill-amber-400 shrink-0" />
              <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden" >
                <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-500"
      style = {{ width: `${pct}%` }
    }
                    />
      </div>
      < span className = "w-6 text-right" > { count } </span>
      </div>
    );
  })
}
</div>
  </div>
      )}

{/* Loading */ }
{
  isLoading && (
    <div className="space-y-4" >
    {
      Array.from({ length: 3 }).map((_, i) => (
        <div key= { i } className = "animate-pulse flex gap-3" >
        <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
      <div className="flex-1" >
      <div className="h-3 bg-gray-200 rounded w-1/3 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-full mb-1" />
      <div className="h-3 bg-gray-200 rounded w-2/3" />
      </div>
      </div>
      ))
    }
      </div>
      )
}

{/* Error */ }
{
  isError && (
    <p className="text-center text-sm text-red-500 py-8" >
      Failed to load reviews.Please try again.
        </p>
      )
}

{/* Empty */ }
{
  !isLoading && !isError && reviews.length === 0 && (
    <div className="text-center py-10" >
      <MessageSquare className="h-10 w-10 text-gray-200 mx-auto mb-2" />
        <p className="text-gray-400 text-sm" > No reviews yet for this doctor.</p>
          </div>
      )}

{/* Review list */ }
{
  !isLoading && !isError && reviews.length > 0 && (
    <div className="divide-y divide-gray-100" >
    {
      reviews.map((review) => (
        <ReviewItem key= { review.id } review = { review } />
          ))
    }
      </div>
      )
}

{/* Pagination */ }
{
  !isLoading && totalPages > 1 && (
    <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-gray-100" >
      <button
            onClick={ () => setPage((p) => Math.max(1, p - 1)) }
  disabled = { page <= 1
}
className = "px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
  >
            ← Prev
  </button>
  < span className = "text-sm text-gray-500" >
    Page { page } of { totalPages }
</span>
  < button
onClick = {() => setPage((p) => Math.min(totalPages, p + 1))}
disabled = { page >= totalPages}
className = "px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
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
    <div className= "py-4 flex gap-3" >
    {/* Avatar */ }
    < div className = "relative w-10 h-10 rounded-full overflow-hidden bg-blue-50 shrink-0" >
      {
        photo?(
          <Image src = { photo } alt = { name } fill className = "object-cover" />
        ): (
            <div className = "w-full h-full flex items-center justify-center text-blue-500">
            <User className = "h-5 w-5" />
      </div>
        )
}
</div>

{/* Content */ }
<div className="flex-1 min-w-0" >
  <div className="flex items-center justify-between gap-2 flex-wrap" >
    <div>
    <p className="text-sm font-semibold text-gray-800" > { name } </p>
      < StarRow rating = { review.rating } size = "sm" />
        </div>
        < time className = "text-xs text-gray-400 shrink-0" > { date } </time>
          </div>
{
  review.comment && (
    <p className="text-sm text-gray-600 mt-1.5 leading-relaxed" > { review.comment } </p>
        )
}
</div>
  </div>
  );
}

function StarRow({ rating, size }: { rating: number; size: "sm" | "md" }) {
  const cls = size === "md" ? "h-4 w-4" : "h-3.5 w-3.5";
  return (
    <div className= "flex items-center gap-0.5 mt-0.5" >
    {
      Array.from({ length: 5 }).map((_, i) => {
        const filled = i < Math.floor(rating);
        const half = !filled && i < rating;
        return (
          <span key= { i } className = "relative inline-block" >
            <Star className={ `${cls} text-gray-200` } />
        {
          (filled || half) && (
            <span
                className="absolute inset-0 overflow-hidden"
          style = {{ width: filled ? "100%" : "50%" }
        }
              >
          <Star className={ `${cls} text-amber-400 fill-amber-400` } />
            </span>
            )
    }
    </span>
        );
})}
</div>
  );
}