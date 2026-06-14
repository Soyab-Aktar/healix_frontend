"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import DataTable from "@/components/shared/table/DataTable";
import { useRowActionModalState } from "@/hooks/useRowActionModalState";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";
import { getAllSpecialties } from "@/services/specialty.services";
import { ISpecialty } from "@/types/specialty.types";
import { specialtyColumns } from "./specialtiesColumns";
import CreateSpecialtyFormModal from "./CreateSpecialtyFormModal";
import DeleteSpecialtyConfirmationDialog from "./DeleteSpecialtyConfirmationDialog";

const SpecialtiesTable = () => {
  const searchParams = useSearchParams();

  const {
    deletingItem,
    isDeleteDialogOpen,
    onDeleteOpenChange,
    tableActions,
  } = useRowActionModalState<ISpecialty>();

  const {
    optimisticSortingState,
    optimisticPaginationState,
    updateParams,
    handleSortingChange,
    handlePaginationChange,
  } = useServerManagedDataTable({
    searchParams,
    defaultPage: 1,
    defaultLimit: 10,
  });

  const { searchTermFromUrl, handleDebouncedSearchChange } =
    useServerManagedDataTableSearch({
      searchParams,
      updateParams,
    });

  const page = optimisticPaginationState.pageIndex + 1;
  const limit = optimisticPaginationState.pageSize;
  const searchTerm = searchTermFromUrl || "";
  const sorting = optimisticSortingState;

  const { data: specialtiesResponse, isLoading, isFetching } = useQuery({
    queryKey: ["specialties"],
    queryFn: getAllSpecialties,
  });

  const allSpecialties = specialtiesResponse?.data ?? [];

  // Client-side search, sort and pagination logic
  const filteredAndSortedSpecialties = useMemo(() => {
    let result = [...allSpecialties];

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter((item) =>
        item.title.toLowerCase().includes(term)
      );
    }

    // Sorting
    if (sorting.length > 0) {
      const { id, desc } = sorting[0];
      result.sort((a, b) => {
        const aVal = (a as any)[id] ?? "";
        const bVal = (b as any)[id] ?? "";
        if (aVal < bVal) return desc ? 1 : -1;
        if (aVal > bVal) return desc ? -1 : 1;
        return 0;
      });
    }

    return result;
  }, [allSpecialties, searchTerm, sorting]);

  const paginatedSpecialties = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredAndSortedSpecialties.slice(start, start + limit);
  }, [filteredAndSortedSpecialties, page, limit]);

  const totalPages = Math.ceil(filteredAndSortedSpecialties.length / limit);

  const meta = useMemo(() => {
    return {
      page,
      limit,
      total: filteredAndSortedSpecialties.length,
      totalPages: Math.max(totalPages, 1),
    };
  }, [page, limit, filteredAndSortedSpecialties.length, totalPages]);

  return (
    <>
      <DataTable
        data={paginatedSpecialties}
        columns={specialtyColumns}
        isLoading={isLoading || isFetching}
        emptyMessage="No specialties found."
        sorting={{
          state: optimisticSortingState,
          onSortingChange: handleSortingChange,
        }}
        pagination={{
          state: optimisticPaginationState,
          onPaginationChange: handlePaginationChange,
        }}
        search={{
          initialValue: searchTermFromUrl,
          placeholder: "Search specialties by title...",
          debounceMs: 300,
          onDebouncedChange: handleDebouncedSearchChange,
        }}
        toolbarAction={<CreateSpecialtyFormModal />}
        meta={meta}
        actions={{
          onDelete: tableActions.onDelete,
        }}
      />

      <DeleteSpecialtyConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={onDeleteOpenChange}
        specialty={deletingItem}
      />
    </>
  );
};

export default SpecialtiesTable;
