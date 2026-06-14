"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import DataTable from "@/components/shared/table/DataTable";
import { useRowActionModalState } from "@/hooks/useRowActionModalState";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";
import {
  serverManagedFilter,
  useServerManagedDataTableFilters,
} from "@/hooks/useServerManagedDataTableFilters";
import { getAllPayments } from "@/services/payment.services";
import { PaginationMeta } from "@/types/api.types";
import { IPayment } from "@/types/payment.types";
import { paymentColumns } from "./paymentsColumns";
import ViewPaymentDialog from "./ViewPaymentDialog";
import {
  DataTableFilterConfig,
  DataTableFilterValues,
} from "@/components/shared/table/DataTableFilters";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const PAYMENTS_FILTER_DEFINITIONS = [
  serverManagedFilter.single("status"),
];

const PaymentsTable = ({
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
  } = useRowActionModalState<IPayment>();

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

  const { filterValues, handleFilterChange, clearAllFilters } =
    useServerManagedDataTableFilters({
      searchParams,
      definitions: PAYMENTS_FILTER_DEFINITIONS,
      updateParams,
    });

  const {
    data: paymentsResponse,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["payments", queryString],
    queryFn: () => getAllPayments(queryString),
  });

  const payments = paymentsResponse?.data ?? [];
  const meta: PaginationMeta | undefined = paymentsResponse?.meta;

  const filterConfigs = useMemo<DataTableFilterConfig[]>(() => {
    return [
      {
        id: "status",
        label: "Payment Status",
        type: "single-select",
        options: [
          { label: "Paid", value: "PAID" },
          { label: "Unpaid", value: "UNPAID" },
          { label: "Failed", value: "FAILED" },
        ],
      },
    ];
  }, []);

  const filterValuesForTable = useMemo<DataTableFilterValues>(() => {
    return {
      status: filterValues.status,
    };
  }, [filterValues]);

  // Read-only actions (only onView, no edit/delete for admins on payment transactions)
  const readOnlyActions = useMemo(() => {
    return {
      onView: tableActions.onView,
    };
  }, [tableActions.onView]);

  return (
    <>
      <DataTable
        data={payments}
        columns={paymentColumns}
        isLoading={isLoading || isFetching || isRouteRefreshPending}
        emptyMessage="No payment records found."
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
          placeholder: "Search payments by transaction ID...",
          debounceMs: 700,
          onDebouncedChange: handleDebouncedSearchChange,
        }}
        filters={{
          configs: filterConfigs,
          values: filterValuesForTable,
          onFilterChange: handleFilterChange,
          onClearAll: clearAllFilters,
        }}
        meta={meta}
        actions={readOnlyActions}
      />

      <ViewPaymentDialog
        open={isViewDialogOpen}
        onOpenChange={onViewOpenChange}
        payment={viewingItem}
      />
    </>
  );
};

export default PaymentsTable;
