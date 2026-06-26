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
import { getMyReviews } from "@/services/review.services";
import { IAppointment } from "@/types/appointment.types";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import ViewAppointmentModal from "./Viewappointmentmodal";
import { getMyAppointmentsColumns } from "./myAppointmentsColumns";
import WriteReviewModal from "./WriteReviewModal";

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
  const [reviewedAppointmentIds, setReviewedAppointmentIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  const [reviewAppointment, setReviewAppointment] = useState<IAppointment | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

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
    const fetchAppointmentsAndReviews = async () => {
      try {
        setIsLoading(true);
        const [apptsRes, reviewsRes] = await Promise.all([
          getMyAppointments(),
          getMyReviews(),
        ]);
        setAppointments(apptsRes?.data ?? []);

        const ids = new Set<string>();
        for (const review of reviewsRes?.data ?? []) {
          if (review.appointmentId) {
            ids.add(review.appointmentId);
          }
        }
        setReviewedAppointmentIds(ids);
      } catch (error) {
        console.error("Error fetching patient appointments and reviews:", error);
        setAppointments([]);
        setReviewedAppointmentIds(new Set());
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointmentsAndReviews();
  }, [searchParams, fetchTrigger]);

  const handleOpenWriteReview = (appointment: IAppointment) => {
    setReviewAppointment(appointment);
    setIsReviewOpen(true);
  };

  const handleReviewSuccess = () => {
    setFetchTrigger((prev) => prev + 1);
  };

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

  const columns = useMemo(
    () => getMyAppointmentsColumns(reviewedAppointmentIds, handleOpenWriteReview),
    [reviewedAppointmentIds]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="h-10 w-1 bg-gradient-to-b from-[#0d9488] to-[#047857] rounded-full shrink-0 mt-1" />
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-[#0d9488] to-[#047857] bg-clip-text text-transparent">My Appointments</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            View and manage your booked clinical appointments, schedules, and submit reviews for completed visits.
          </p>
        </div>
      </div>

      <div className="rounded-[24px] border border-slate-200/60 bg-white shadow-sm overflow-hidden p-2">
        <DataTable
          data={paginatedAppointments}
          columns={columns}
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
      </div>

      <ViewAppointmentModal
        appointment={viewingItem}
        open={isViewDialogOpen}
        onOpenChange={onViewOpenChange}
      />

      <WriteReviewModal
        appointment={reviewAppointment}
        open={isReviewOpen}
        onOpenChange={setIsReviewOpen}
        onSuccess={handleReviewSuccess}
      />
    </div>
  );
};

export default MyAppointmentsView;