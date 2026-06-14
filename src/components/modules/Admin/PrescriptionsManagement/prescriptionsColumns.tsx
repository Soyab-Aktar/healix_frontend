import DateCell from "@/components/shared/cell/DateCell";
import UserInfoCell from "@/components/shared/cell/UserInfoCell";
import { Button } from "@/components/ui/button";
import { IPrescription } from "@/types/prescription.types";
import { ColumnDef } from "@tanstack/react-table";
import { Download, FileText } from "lucide-react";

export const prescriptionColumns: ColumnDef<IPrescription>[] = [
  {
    id: "patient",
    header: "Patient",
    enableSorting: false,
    cell: ({ row }) => {
      const patient = (row.original as any).patient;
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
      const doctor = (row.original as any).doctor;
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
    id: "instructions",
    accessorKey: "instructions",
    header: "Instructions",
    enableSorting: false,
    cell: ({ row }) => {
      const instructions = row.original.instructions || "";
      return (
        <p className="text-sm text-muted-foreground line-clamp-2 max-w-xs">
          {instructions}
        </p>
      );
    },
  },
  {
    id: "followUpDate",
    accessorKey: "followUpDate",
    header: "Follow-Up Date",
    cell: ({ row }) => {
      const date = row.original.followUpDate;
      return date ? (
        <DateCell date={date} formatString="MMM dd, yyyy" />
      ) : (
        <span className="text-sm text-muted-foreground">None</span>
      );
    },
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Issued On",
    cell: ({ row }) => {
      const date = row.original.createdAt;
      return date ? (
        <DateCell date={date} formatString="MMM dd, yyyy" />
      ) : (
        <span className="text-sm text-muted-foreground">N/A</span>
      );
    },
  },
  {
    id: "pdfUrl",
    accessorKey: "pdfUrl",
    header: "Prescription PDF",
    enableSorting: false,
    cell: ({ row }) => {
      const pdfUrl = row.original.pdfUrl;
      return pdfUrl ? (
        <Button variant="outline" size="sm" className="h-8 gap-1 border-primary/30 text-primary hover:bg-primary/5" asChild>
          <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
            <Download className="h-3.5 w-3.5" /> PDF
          </a>
        </Button>
      ) : (
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <FileText className="h-3.5 w-3.5 opacity-50" /> No PDF
        </span>
      );
    },
  },
];
