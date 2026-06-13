"use client";

import DataTable from "@/components/shared/table/DataTable";
import { useRowActionModalState } from "@/hooks/useRowActionModalState";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import {
  serverManagedFilter,
  useServerManagedDataTableFilters,
} from "@/hooks/useServerManagedDataTableFilters";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";
import { getMyAppointments } from "@/services/appointment.services";
import { IAppointment } from "@/types/appointment.types";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ViewAppointmentModal from "./Viewappointmentmodal";
import { myAppointmentsColumns } from "./myAppointmentsColumns";

const STATUS_FILTER_OPTIONS = [
  { label: "Scheduled", value: "SCHEDULED" },
  { label: "In Progress", value: "INPROGRESS" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Canceled", value: "CANCELED" },
];

const PAYMENT_STATUS_FILTER_OPTIONS = [
  { label: "Paid", value: "PAID" },
  { label: "Unpaid", value: "UNPAID" },
  { label: "Failed", value: "FAILED" },
];

const MyAppointmentsView = () => {
  const searchParams = useSearchParams();

  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const {
    optimisticSortingState,
    optimisticPaginationState,
    updateParams,
    handleSortingChange,
    handlePaginationChange,
  } = useServerManagedDataTable({ searchParams });

  const { searchTermFromUrl, handleDebouncedSearchChange } =
    useServerManagedDataTableSearch({ searchParams, updateParams });

  const { filterValues, handleFilterChange, clearAllFilters } =
    useServerManagedDataTableFilters({
      searchParams,
      updateParams,
      definitions: [
        serverManagedFilter.single("status"),
        serverManagedFilter.single("paymentStatus"),
      ],
    });

  const { viewingItem, isViewDialogOpen, onViewOpenChange, tableActions } =
    useRowActionModalState<IAppointment>({
      enableEdit: false,
      enableDelete: false,
    });

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setIsLoading(true);
        const response = await getMyAppointments();
        setAppointments(response?.data ?? []);
      } catch (error) {
        console.error("Error fetching my appointments:", error);
        setAppointments([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
    // Re-fetch whenever the URL query (search/sort/filter/pagination) changes.
    // Backend currently returns all appointments regardless of params.
  }, [searchParams]);

  // Client-side application of search/sort/filter/pagination as a fallback
  // since the backend does not yet support these query params.
  const filteredAppointments = appointments.filter((appointment) => {
    const statusFilter = filterValues.status;
    const paymentStatusFilter = filterValues.paymentStatus;

    if (
      typeof statusFilter === "string" &&
      statusFilter &&
      appointment.status !== statusFilter
    ) {
      return false;
    }

    if (
      typeof paymentStatusFilter === "string" &&
      paymentStatusFilter &&
      appointment.paymentStatus !== paymentStatusFilter
    ) {
      return false;
    }

    if (searchTermFromUrl) {
      const term = searchTermFromUrl.toLowerCase();
      const doctorName = appointment.doctor?.name?.toLowerCase() ?? "";
      if (!doctorName.includes(term)) {
        return false;
      }
    }

    return true;
  });

  const sortedAppointments = [...filteredAppointments];
  const sort = optimisticSortingState[0];
  if (sort) {
    sortedAppointments.sort((a, b) => {
      const getValue = (item: IAppointment) => {
        if (sort.id === "status") return item.status ?? "";
        if (sort.id === "paymentStatus") return item.paymentStatus ?? "";
        if (sort.id === "createdAt") return item.createdAt ? new Date(item.createdAt).getTime() : 0;
        return "";
      };

      const valueA = getValue(a);
      const valueB = getValue(b);

      if (valueA < valueB) return sort.desc ? 1 : -1;
      if (valueA > valueB) return sort.desc ? -1 : 1;
      return 0;
    });
  }

  const totalRows = sortedAppointments.length;
  const pageSize = optimisticPaginationState.pageSize;
  const totalPages = Math.max(Math.ceil(totalRows / pageSize), 1);
  const pageIndex = Math.min(optimisticPaginationState.pageIndex, totalPages - 1);

  const paginatedAppointments = sortedAppointments.slice(
    pageIndex * pageSize,
    pageIndex * pageSize + pageSize,
  );

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">My Appointments</h1>
        <p className="text-sm text-muted-foreground">
          View and manage your booked appointments.
        </p>
      </div>

      <DataTable
        data={paginatedAppointments}
        columns={myAppointmentsColumns}
        actions={{
          onView: tableActions.onView,
        }}
        isLoading={isLoading}
        emptyMessage="No appointments found."
        sorting={{
          state: optimisticSortingState,
          onSortingChange: handleSortingChange,
        }}
        pagination={{
          state: { ...optimisticPaginationState, pageIndex },
          onPaginationChange: handlePaginationChange,
        }}
        search={{
          initialValue: searchTermFromUrl,
          placeholder: "Search by doctor name...",
          onDebouncedChange: handleDebouncedSearchChange,
        }}
        filters={{
          configs: [
            {
              id: "status",
              label: "Status",
              type: "single-select",
              options: STATUS_FILTER_OPTIONS,
            },
            {
              id: "paymentStatus",
              label: "Payment Status",
              type: "single-select",
              options: PAYMENT_STATUS_FILTER_OPTIONS,
            },
          ],
          values: filterValues,
          onFilterChange: handleFilterChange,
          onClearAll: clearAllFilters,
        }}
        meta={{
          page: pageIndex + 1,
          limit: pageSize,
          total: totalRows,
          totalPages,
        }}
      />

      <ViewAppointmentModal
        appointment={viewingItem}
        open={isViewDialogOpen}
        onOpenChange={onViewOpenChange}
      />
    </div>
  );
};

export default MyAppointmentsView;