import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate } from "@/lib/prescription.utils";
import { PrescriptionRow, PrescriptionTableCallbacks } from "@/types/prescription.types";
import { ColumnDef } from "@tanstack/react-table";
import { ExternalLink, MoreHorizontal } from "lucide-react";

/**
 * Build prescription table columns.
 *
 * Pass `callbacks.onEdit` / `callbacks.onDelete` only for roles that need them.
 * If omitted the dropdown items are hidden automatically.
 */
export const buildPrescriptionColumns = (
  callbacks: PrescriptionTableCallbacks,
  /** Show doctor column for patient view, patient column for doctor view */
  perspective: "doctor" | "patient" = "doctor",
): ColumnDef<PrescriptionRow>[] => [
    // ── Counterpart person column ──────────────────────────────────────────
    {
      header: perspective === "doctor" ? "Patient" : "Doctor",
      id: "counterpart",
      enableSorting: true,
      sortingFn: (a, b) => {
        const nameA =
          perspective === "doctor"
            ? (a.original.patient?.name ?? "")
            : (a.original.doctor?.name ?? "");
        const nameB =
          perspective === "doctor"
            ? (b.original.patient?.name ?? "")
            : (b.original.doctor?.name ?? "");
        return nameA.localeCompare(nameB);
      },
      cell: ({ row }) => {
        const person = (
          perspective === "doctor" ? row.original.patient : row.original.doctor
        ) as any;
        const initial = person?.name?.charAt(0).toUpperCase() ?? "P";
        return (
          <div className="flex items-center gap-3">
            <div className="relative shrink-0 w-9 h-9 rounded-[10px] overflow-hidden bg-emerald-50 border border-slate-100 flex items-center justify-center text-emerald-600 font-extrabold text-sm shadow-2xs">
              {person?.profilePhoto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={person.profilePhoto}
                  alt={person.name ?? "User"}
                  className="w-full h-full object-cover"
                />
              ) : (
                initial
              )}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-slate-800 text-sm truncate">{person?.name ?? "—"}</p>
              <p className="text-xs text-slate-400 truncate">{person?.email ?? "—"}</p>
            </div>
          </div>
        );
      },
    },

    // ── Follow-up date ─────────────────────────────────────────────────────
    {
      header: "Follow-up Date",
      accessorKey: "followUpDate",
      enableSorting: true,
      cell: ({ row }) => {
        const date = row.original.followUpDate;
        return date ? (
          <span className="inline-flex items-center gap-1.5 text-xs bg-[#eefcf7] text-[#047857] px-2.5 py-1 rounded-full font-semibold border border-emerald-100/30">
            {formatDate(date)}
          </span>
        ) : (
          <span className="text-xs text-slate-400">No follow-up</span>
        );
      },
    },

    // ── Issued on ──────────────────────────────────────────────────────────
    {
      header: "Issued On",
      accessorKey: "createdAt",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="text-sm font-medium text-slate-600">
          {formatDate(row.original.createdAt)}
        </span>
      ),
    },

    // ── PDF link ───────────────────────────────────────────────────────────
    {
      header: "PDF",
      id: "pdf",
      enableSorting: false,
      cell: ({ row }) => {
        const url = row.original.pdfUrl;
        return url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#047857] hover:text-[#035f43] hover:underline"
          >
            <ExternalLink className="h-3.5 w-3.5 text-[#047857]" />
            View PDF
          </a>
        ) : (
          <span className="text-xs text-slate-400">—</span>
        );
      },
    },

    // ── Actions dropdown ───────────────────────────────────────────────────
    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      cell: ({ row }) => {
        const rowData = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => callbacks.onView(rowData)}>
                View Details
              </DropdownMenuItem>

              {callbacks.onEdit && (
                <DropdownMenuItem onClick={() => callbacks.onEdit!(rowData)}>
                  Edit
                </DropdownMenuItem>
              )}

              {callbacks.onDelete && (
                <DropdownMenuItem
                  onClick={() => callbacks.onDelete!(rowData)}
                  className="text-destructive focus:text-destructive"
                >
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];