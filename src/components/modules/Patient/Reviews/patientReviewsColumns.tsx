"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { IReview } from "@/types/review.types";

export const getPatientReviewsColumns = (
  onEdit: (review: IReview) => void,
  onDelete: (review: IReview) => void
): ColumnDef<IReview>[] => [
  {
    accessorKey: "doctor",
    header: "Doctor",
    cell: ({ row }) => {
      const doctor = row.original.doctor;

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 rounded-lg">
            <AvatarImage src={doctor?.profilePhoto} className="object-cover" />
            <AvatarFallback className="rounded-lg bg-emerald-50 text-emerald-700 font-bold">
              {doctor?.name?.charAt(0)?.toUpperCase() ?? "D"}
            </AvatarFallback>
          </Avatar>

          <div>
            <p className="font-bold text-slate-800 text-sm">{doctor?.name ?? "Unknown"}</p>
            {doctor?.email && (
              <p className="text-xs text-slate-500 font-medium">
                {doctor.email}
              </p>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => {
      const rating = row.original.rating;

      return (
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              size={15}
              className={
                index < rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-slate-200"
              }
            />
          ))}

          <Badge variant="secondary" className="ml-1.5 font-bold text-xs bg-slate-100 text-slate-600 rounded-md">
            {rating}/5
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "comment",
    header: "Your Review",
    cell: ({ row }) => (
      <p className="max-w-md whitespace-normal text-sm font-medium text-slate-600 italic">
        "{row.original.comment}"
      </p>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Submitted On",
    cell: ({ row }) => {
      try {
        return (
          <span className="text-sm font-medium text-slate-500">
            {format(new Date(row.original.createdAt), "dd MMM yyyy")}
          </span>
        );
      } catch {
        return <span className="text-sm font-medium text-slate-500">-</span>;
      }
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right pr-4">Actions</div>,
    enableSorting: false,
    cell: ({ row }) => {
      const review = row.original;
      return (
        <div className="flex justify-end gap-2 pr-2">
          <button
            onClick={() => onEdit(review)}
            className="inline-flex items-center text-xs font-bold px-2.5 py-1.5 rounded-lg border border-emerald-500/20 bg-emerald-50 text-[#047857] hover:bg-[#047857] hover:text-white hover:border-[#047857] transition-all cursor-pointer shadow-3xs"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(review)}
            className="inline-flex items-center text-xs font-bold px-2.5 py-1.5 rounded-lg border border-rose-500/20 bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all cursor-pointer shadow-3xs"
          >
            Delete
          </button>
        </div>
      );
    },
  },
];
