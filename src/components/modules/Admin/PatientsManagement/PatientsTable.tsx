"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import DataTable from "@/components/shared/table/DataTable";
import { useRowActionModalState } from "@/hooks/useRowActionModalState";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";
import { getAllPatients } from "@/services/patient.services";
import { PaginationMeta } from "@/types/api.types";
import { IPatient } from "@/types/patient.types";
import { patientColumns } from "./patientsColumns";
import ViewPatientDialog from "./ViewPatientDialog";
import ChangePatientStatusModal from "./ChangePatientStatusModal";
import DeletePatientConfirmationDialog from "./DeletePatientConfirmationDialog";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const PatientsTable = ({ initialQueryString }: { initialQueryString: string }) => {
  const searchParams = useSearchParams();

  const {
    viewingItem,
    editingItem,
    deletingItem,
    isViewDialogOpen,
    isEditModalOpen,
    isDeleteDialogOpen,
    onViewOpenChange,
    onEditOpenChange,
    onDeleteOpenChange,
    tableActions,
  } = useRowActionModalState<IPatient>();

  const {
    queryStringFromUrl,
    optimisticSortingState,
    optimisticPaginationState,
    isRouteRefreshPending,
    updateParams,
    handleSortingChange,
    handlePaginationChange,
  } = useServerManagedDataTable({
    searchParams,
    defaultPage: DEFAULT_PAGE,
    defaultLimit: DEFAULT_LIMIT,
  });

  const queryString = queryStringFromUrl || initialQueryString;

  const { searchTermFromUrl, handleDebouncedSearchChange } =
    useServerManagedDataTableSearch({
      searchParams,
      updateParams,
    });

  const { data: patientsResponse, isLoading, isFetching } = useQuery({
    queryKey: ["patients", queryString],
    queryFn: () => getAllPatients(queryString),
  });

  const patients = patientsResponse?.data ?? [];
  const meta: PaginationMeta | undefined = patientsResponse?.meta;

  return (
    <>
      <DataTable
        data={patients}
        columns={patientColumns}
        isLoading={isLoading || isFetching || isRouteRefreshPending}
        emptyMessage="No patient records found."
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
          placeholder: "Search patients by name, email or phone...",
          debounceMs: 700,
          onDebouncedChange: handleDebouncedSearchChange,
        }}
        meta={meta}
        actions={{
          onView: tableActions.onView,
          onEdit: tableActions.onEdit, // change status
          onDelete: tableActions.onDelete, // soft delete
        }}
      />

      <ViewPatientDialog
        open={isViewDialogOpen}
        onOpenChange={onViewOpenChange}
        patient={viewingItem}
      />

      <ChangePatientStatusModal
        open={isEditModalOpen}
        onOpenChange={onEditOpenChange}
        patient={editingItem}
      />

      <DeletePatientConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={onDeleteOpenChange}
        patient={deletingItem}
      />
    </>
  );
};

export default PatientsTable;
