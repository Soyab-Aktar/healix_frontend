import DateCell from "@/components/shared/cell/DateCell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ISpecialty } from "@/types/specialty.types";
import { ColumnDef } from "@tanstack/react-table";
import { Stethoscope } from "lucide-react";

export const specialtyColumns: ColumnDef<ISpecialty>[] = [
  {
    id: "icon",
    header: "Icon",
    enableSorting: false,
    cell: ({ row }) => {
      const icon = row.original.icon;
      const title = row.original.title || "";
      const initials = title.substring(0, 2).toUpperCase();

      return (
        <Avatar className="h-10 w-10 border bg-muted">
          <AvatarImage src={icon || undefined} alt={title} className="object-cover" />
          <AvatarFallback className="bg-primary/5 text-primary">
            {initials || <Stethoscope className="h-4 w-4" />}
          </AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    id: "title",
    accessorKey: "title",
    header: "Specialty Title",
    cell: ({ row }) => (
      <span className="font-semibold text-sm">{row.original.title}</span>
    ),
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Created On",
    cell: ({ row }) => {
      const date = row.original.createdAt;
      return date ? (
        <DateCell date={date} formatString="MMM dd, yyyy" />
      ) : (
        <span className="text-sm text-muted-foreground">N/A</span>
      );
    },
  },
];
