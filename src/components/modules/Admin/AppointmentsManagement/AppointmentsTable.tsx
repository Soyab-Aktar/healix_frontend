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
import { getAllAppointments } from "@/services/appointment.services";
import { PaginationMeta } from "@/types/api.types";
import { IAppointment } from "@/types/appointment.types";
import { appointmentColumns } from "./appointmentsColumns";
import ViewAppointmentDialog from "./ViewAppointmentDialog";
import EditAppointmentStatusModal from "./EditAppointmentStatusModal";
import {
  DataTableFilterConfig,
  DataTableFilterValues,
} from "@/components/shared/table/DataTableFilters";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const APPOINTMENTS_FILTER_DEFINITIONS = [
  serverManagedFilter.single("status"),
  serverManagedFilter.single("paymentStatus"),
];

const AppointmentsTable = ({
  initialQueryString,
}: {
  initialQueryString: string;
}) => {
  const searchParams = useSearchParams();

  const {
    viewingItem,
    editingItem,
    isViewDialogOpen,
    isEditModalOpen,
    onViewOpenChange,
    onEditOpenChange,
    tableActions,
  } = useRowActionModalState<IAppointment>();

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
      definitions: APPOINTMENTS_FILTER_DEFINITIONS,
      updateParams,
    });

  const {
    data: appointmentsResponse,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["appointments", queryString],
    queryFn: () => getAllAppointments(queryString),
  });

  const appointments = appointmentsResponse?.data ?? [];
  const meta: PaginationMeta | undefined = appointmentsResponse?.meta;

  const filterConfigs = useMemo<DataTableFilterConfig[]>(() => {
    return [
      {
        id: "status",
        label: "Appointment Status",
        type: "single-select",
        options: [
          { label: "Scheduled", value: "SCHEDULED" },
          { label: "In Progress", value: "INPROGRESS" },
          { label: "Completed", value: "COMPLETED" },
          { label: "Canceled", value: "CANCELED" },
        ],
      },
      {
        id: "paymentStatus",
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
      paymentStatus: filterValues.paymentStatus,
    };
  }, [filterValues]);

  return (
    <>
      <DataTable
        data={appointments}
        columns={appointmentColumns}
        isLoading={isLoading || isFetching || isRouteRefreshPending}
        emptyMessage="No appointments found."
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
          placeholder: "Search appointments by patient, doctor, status...",
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
        actions={tableActions}
      />

      <ViewAppointmentDialog
        open={isViewDialogOpen}
        onOpenChange={onViewOpenChange}
        appointment={viewingItem}
      />

      <EditAppointmentStatusModal
        open={isEditModalOpen}
        onOpenChange={onEditOpenChange}
        appointment={editingItem}
      />
    </>
  );
};

export default AppointmentsTable;
