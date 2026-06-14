import DateCell from "@/components/shared/cell/DateCell";
import UserInfoCell from "@/components/shared/cell/UserInfoCell";
import { IReview } from "@/types/review.types";
import { ColumnDef } from "@tanstack/react-table";
import { Star } from "lucide-react";

export const reviewColumns: ColumnDef<IReview>[] = [
  {
    id: "patient",
    header: "Patient",
    enableSorting: false,
    cell: ({ row }) => {
      const patient = row.original.patient;
      return (
        <UserInfoCell
          name={patient?.name || "N/A"}
          email={patient?.email || "N/A"}
        />
      );
    },
  },
  {
    id: "doctor",
    header: "Doctor",
    enableSorting: false,
    cell: ({ row }) => {
      const doctor = row.original.doctor;
      return (
        <UserInfoCell
          name={doctor?.name || "N/A"}
          email={doctor?.email || "N/A"}
          profilePhoto={doctor?.profilePhoto || undefined}
        />
      );
    },
  },
  {
    id: "rating",
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => {
      const rating = row.original.rating ?? 0;
      return (
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground/30 fill-transparent"
              }`}
            />
          ))}
          <span className="text-xs font-semibold ml-1">({rating.toFixed(1)})</span>
        </div>
      );
    },
  },
  {
    id: "comment",
    accessorKey: "comment",
    header: "Comment",
    enableSorting: false,
    cell: ({ row }) => {
      const comment = row.original.comment || "";
      return (
        <p className="text-sm text-muted-foreground line-clamp-2 max-w-xs">
          {comment}
        </p>
      );
    },
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Reviewed On",
    cell: ({ row }) => (
      <DateCell date={row.original.createdAt} formatString="MMM dd, yyyy" />
    ),
  },
];
