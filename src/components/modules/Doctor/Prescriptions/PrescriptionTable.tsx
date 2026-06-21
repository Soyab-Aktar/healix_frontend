"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DataTableFilters, {
  type DataTableFilterValue,
} from "@/components/shared/table/DataTableFilters";
import DataTablePagination from "@/components/shared/table/DataTablePagination";
import DataTableSearch from "@/components/shared/table/DataTableSearch";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { useMemo, useState } from "react";
import { PrescriptionRow } from "@/types/prescription.types";

interface PrescriptionTableProps {
  data: PrescriptionRow[];
  columns: ColumnDef<PrescriptionRow>[];
  /** Which name to label in the search placeholder */
  searchCounterpart?: "patient" | "doctor";
}

const FILTER_CONFIGS = [
  {
    id: "followup",
    label: "Follow-up",
    type: "single-select" as const,
    options: [
      { label: "Has Follow-up", value: "has_followup" },
      { label: "No Follow-up", value: "no_followup" },
    ],
  },
];

const PrescriptionTable = ({
  data,
  columns,
  searchCounterpart = "patient",
}: PrescriptionTableProps) => {
  // ── Search & filter ──────────────────────────────────────────────────
  const [searchTerm, setSearchTerm] = useState("");
  const [followUpFilter, setFollowUpFilter] = useState<string | undefined>(undefined);

  const filteredData = useMemo(() => {
    let rows = data;

    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase();
      rows = rows.filter((r) => {
        const person = searchCounterpart === "patient" ? r.patient : r.doctor;
        return (
          person?.name?.toLowerCase().includes(lower) ||
          person?.email?.toLowerCase().includes(lower)
        );
      });
    }

    if (followUpFilter === "has_followup") {
      rows = rows.filter((r) => !!r.followUpDate);
    } else if (followUpFilter === "no_followup") {
      rows = rows.filter((r) => !r.followUpDate);
    }

    return rows;
  }, [data, searchTerm, followUpFilter, searchCounterpart]);

  // ── Table state ──────────────────────────────────────────────────────
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const filterValues = { followup: followUpFilter ?? "" };

  const handleFilterChange = (
    filterId: string,
    value: DataTableFilterValue | undefined,
  ) => {
    if (filterId === "followup") {
      setFollowUpFilter(
        typeof value === "string" && value.length > 0 ? value : undefined,
      );
      setPagination((p) => ({ ...p, pageIndex: 0 }));
    }
  };

  const handleClearFilters = () => {
    setFollowUpFilter(undefined);
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  };

  const handleSearch = (val: string) => {
    setSearchTerm(val);
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  };

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
  });

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-start gap-3">
        <DataTableSearch
          placeholder={`Search by ${searchCounterpart} name or email…`}
          onDebouncedChange={handleSearch}
        />
        <DataTableFilters
          filters={FILTER_CONFIGS}
          values={filterValues}
          onFilterChange={handleFilterChange}
          onClearAll={handleClearFilters}
        />
      </div>

      {/* Table */}
      <div className="rounded-[24px] border border-slate-200/60 bg-white shadow-sm overflow-hidden p-2">
        <Table>
          <TableHeader className="bg-[#eefcf7]/40 border-b border-slate-100 hover:bg-transparent">
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="hover:bg-transparent border-b border-slate-100">
                {hg.headers.map((header) => (
                  <TableHead key={header.id} className="text-slate-800 font-bold h-12">
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <Button
                        variant="ghost"
                        className="h-auto cursor-pointer p-0 font-semibold hover:bg-transparent hover:text-emerald-700 focus-visible:ring-0"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {header.column.getIsSorted() === "asc" ? (
                          <ArrowUp className="ml-1 h-4 w-4 text-[#047857]" />
                        ) : header.column.getIsSorted() === "desc" ? (
                          <ArrowDown className="ml-1 h-4 w-4 text-[#047857]" />
                        ) : (
                          <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />
                        )}
                      </Button>
                    ) : (
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-slate-50/50 border-b border-slate-100/80 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3.5">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No prescriptions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <DataTablePagination
          table={table}
          totalRows={filteredData.length}
          totalPages={table.getPageCount()}
        />
      </div>
    </div>
  );
};

export default PrescriptionTable;