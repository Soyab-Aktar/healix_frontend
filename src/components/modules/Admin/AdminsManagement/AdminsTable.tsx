"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import DataTable from "@/components/shared/table/DataTable";
import { useRowActionModalState } from "@/hooks/useRowActionModalState";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";
import { getAllAdmins } from "@/services/admin.services";
import { IAdmin } from "@/types/admin.types";
import { adminColumns } from "./adminsColumns";
import CreateAdminFormModal from "./CreateAdminFormModal";
import ViewAdminDialog from "./ViewAdminDialog";
import DeleteAdminConfirmationDialog from "./DeleteAdminConfirmationDialog";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const AdminsTable = () => {
  const searchParams = useSearchParams();

  const {
    viewingItem,
    deletingItem,
    isViewDialogOpen,
    isDeleteDialogOpen,
    onViewOpenChange,
    onDeleteOpenChange,
    tableActions,
  } = useRowActionModalState<IAdmin>();

  const {
    optimisticSortingState,
    optimisticPaginationState,
    updateParams,
    handleSortingChange,
    handlePaginationChange,
  } = useServerManagedDataTable({
    searchParams,
    defaultPage: DEFAULT_PAGE,
    defaultLimit: DEFAULT_LIMIT,
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

  const { data: adminsResponse, isLoading, isFetching } = useQuery({
    queryKey: ["admins"],
    queryFn: getAllAdmins,
  });

  const allAdmins = adminsResponse?.data ?? [];

  // Client-side filtering logic
  const filteredAndSortedAdmins = useMemo(() => {
    let result = [...allAdmins];

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(term) ||
          item.email.toLowerCase().includes(term) ||
          (item.contactNumber && item.contactNumber.includes(term))
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
  }, [allAdmins, searchTerm, sorting]);

  const paginatedAdmins = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredAndSortedAdmins.slice(start, start + limit);
  }, [filteredAndSortedAdmins, page, limit]);

  const totalPages = Math.ceil(filteredAndSortedAdmins.length / limit);

  const meta = useMemo(() => {
    return {
      page,
      limit,
      total: filteredAndSortedAdmins.length,
      totalPages: Math.max(totalPages, 1),
    };
  }, [page, limit, filteredAndSortedAdmins.length, totalPages]);

  return (
    <>
      <DataTable
        data={paginatedAdmins}
        columns={adminColumns}
        isLoading={isLoading || isFetching}
        emptyMessage="No administrators found."
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
          placeholder: "Search admins by name, email or phone...",
          debounceMs: 300,
          onDebouncedChange: handleDebouncedSearchChange,
        }}
        toolbarAction={<CreateAdminFormModal />}
        meta={meta}
        actions={{
          onView: tableActions.onView,
          onDelete: tableActions.onDelete,
        }}
      />

      <ViewAdminDialog
        open={isViewDialogOpen}
        onOpenChange={onViewOpenChange}
        admin={viewingItem}
      />

      <DeleteAdminConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={onDeleteOpenChange}
        admin={deletingItem}
      />
    </>
  );
};

export default AdminsTable;
