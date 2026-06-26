"use client";

import { useMemo, useState } from "react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Search } from "lucide-react";

import { IReview } from "@/types/review.types";
import { doctorReviewsColumns } from "./doctorReviewsColumns";
import ViewReviewDialog from "./ViewReviewDialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DoctorReviewsTableProps {
  reviews: IReview[];
}

const DoctorReviewsTable = ({
  reviews,
}: DoctorReviewsTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] =
    useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>({});

  const [selectedReview, setSelectedReview] =
    useState<IReview | null>(null);

  const columns = useMemo(() => {
    return doctorReviewsColumns.map((column) => {
      if (column.id === "actions") return column;

      return column;
    });
  }, []);

  const table = useReactTable({
    data: reviews,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,

    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),

    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <>
      <div className="rounded-[24px] border border-slate-200/60 bg-white shadow-sm overflow-hidden p-5 sm:p-6">
        <div className="space-y-5">

          {/* Search */}
          <div className="group relative max-w-sm">
            <Search className="text-[#047857]/60 group-focus-within:text-[#047857] pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transition-colors" />
            <Input
              placeholder="Search patient..."
              className="h-9 pr-9 pl-9 rounded-lg border-slate-200 hover:border-emerald-500/30 focus-visible:border-[#047857] focus-visible:ring-emerald-500/20 transition-all bg-white"
              value={
                (table
                  .getColumn("patient")
                  ?.getFilterValue() as string) ?? ""
              }
              onChange={(e) =>
                table
                  .getColumn("patient")
                  ?.setFilterValue(e.target.value)
              }
            />
          </div>

          {/* Table */}
          <div className="rounded-xl border border-slate-100 overflow-hidden">
            <Table>
              <TableHeader className="bg-[#eefcf7]/40 border-b border-slate-100 hover:bg-transparent">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="hover:bg-transparent border-b border-slate-100">
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="text-slate-800 font-bold h-12">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableHead>
                    ))}

                    <TableHead className="text-slate-800 font-bold h-12 text-right">
                      Action
                    </TableHead>
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      className="hover:bg-slate-50/50 border-b border-slate-100/85 transition-colors cursor-pointer"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="py-3.5">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}

                      <TableCell className="py-3.5 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setSelectedReview(row.original)
                          }
                          className="hover:border-emerald-500/50 hover:bg-emerald-50/40 hover:text-emerald-700 transition-colors rounded-lg font-bold"
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={
                        doctorReviewsColumns.length + 1
                      }
                      className="h-32 text-center text-muted-foreground"
                    >
                      No reviews found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t pt-4">
            <p className="text-sm text-slate-500 font-medium">
              Showing{" "}
              {table.getRowModel().rows.length} of{" "}
              {reviews.length} reviews
            </p>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="hover:border-emerald-500/50 hover:bg-emerald-50/40 hover:text-emerald-700 transition-colors rounded-lg cursor-pointer font-bold"
              >
                Previous
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="hover:border-emerald-500/50 hover:bg-emerald-50/40 hover:text-emerald-700 transition-colors rounded-lg cursor-pointer font-bold"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ViewReviewDialog
        open={!!selectedReview}
        review={selectedReview}
        onOpenChange={(open) => {
          if (!open) setSelectedReview(null);
        }}
      />
    </>
  );
};

export default DoctorReviewsTable;