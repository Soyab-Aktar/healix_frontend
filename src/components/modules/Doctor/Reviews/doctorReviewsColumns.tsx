"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Star } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { IReview } from "@/types/review.types";

export const doctorReviewsColumns: ColumnDef<IReview>[] = [
  {
    accessorKey: "patient",
    header: "Patient",
    cell: ({ row }) => {
      const patient = row.original.patient;

      return (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={patient?.profilePhoto} />
            <AvatarFallback>
              {patient?.name?.charAt(0)?.toUpperCase() ?? "P"}
            </AvatarFallback>
          </Avatar>

          <div>
            <p className="font-medium">{patient?.name ?? "Unknown"}</p>

            {patient?.email && (
              <p className="text-xs text-muted-foreground">
                {patient.email}
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
              size={16}
              className={
                index < rating
                  ? "fill-yellow-500 text-yellow-500"
                  : "text-muted-foreground/30"
              }
            />
          ))}

          <Badge variant="secondary" className="ml-2">
            {rating}/5
          </Badge>
        </div>
      );
    },
  },

  {
    accessorKey: "comment",
    header: "Review",
    cell: ({ row }) => (
      <p className="max-w-md whitespace-normal text-sm">
        {row.original.comment}
      </p>
    ),
  },

  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) =>
      format(new Date(row.original.createdAt), "dd MMM yyyy"),
  },
];