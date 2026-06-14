"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import DataTable from "@/components/shared/table/DataTable";
import { useRowActionModalState } from "@/hooks/useRowActionModalState";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";
import { getAllPrescriptions } from "@/services/prescription.services";
import { PaginationMeta } from "@/types/api.types";
import { IPrescription } from "@/types/prescription.types";
import { prescriptionColumns } from "./prescriptionsColumns";
import ViewPrescriptionDialog from "./ViewPrescriptionDialog";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const PrescriptionsTable = ({
  initialQueryString,
}: {
  initialQueryString: string;
}) => {
  const searchParams = useSearchParams();

  const {
    viewingItem,
    isViewDialogOpen,
    onViewOpenChange,
    tableActions,
  } = useRowActionModalState<IPrescription>();

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

  const {
    data: prescriptionsResponse,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["prescriptions", queryString],
    queryFn: () => getAllPrescriptions(queryString),
  });

  const prescriptions = prescriptionsResponse?.data ?? [];
  const meta: PaginationMeta | undefined = prescriptionsResponse?.meta;

  const readOnlyActions = useMemo(() => {
    return {
      onView: tableActions.onView,
    };
  }, [tableActions.onView]);

  return (
    <>
      <DataTable
        data={prescriptions}
        columns={prescriptionColumns}
        isLoading={isLoading || isFetching || isRouteRefreshPending}
        emptyMessage="No prescriptions found."
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
          placeholder: "Search prescriptions by instructions, doctor, or patient...",
          debounceMs: 700,
          onDebouncedChange: handleDebouncedSearchChange,
        }}
        meta={meta}
        actions={readOnlyActions}
      />

      <ViewPrescriptionDialog
        open={isViewDialogOpen}
        onOpenChange={onViewOpenChange}
        prescription={viewingItem}
      />
    </>
  );
};

export default PrescriptionsTable;
