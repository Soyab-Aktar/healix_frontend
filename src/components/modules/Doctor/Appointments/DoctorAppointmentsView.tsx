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
import { getMyPrescriptions } from "@/services/prescription.services";
import { IAppointment } from "@/types/appointment.types";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useMemo, useState, useEffect } from "react";

import ManageAppointmentModal from "./ManageAppointmentModal";
import { getDoctorAppointmentsColumns } from "./doctorAppointmentsColumns";
import CreatePrescriptionModal from "../Prescriptions/CreatePrescriptionModal";


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

const DoctorAppointmentsView = () => {
  const searchParams = useSearchParams();

  const [prescriptionAppointment, setPrescriptionAppointment] = useState<IAppointment | null>(null);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  const {
    data: appointmentsResponse,
    isLoading: isAppointmentsLoading,
    isFetching: isAppointmentsFetching,
  } = useQuery({
    queryKey: ["my-appointments"],
    queryFn: () => getMyAppointments(),
  });

  const {
    data: prescriptionsResponse,
    isLoading: isPrescriptionsLoading,
  } = useQuery({
    queryKey: ["my-prescriptions"],
    queryFn: () => getMyPrescriptions(),
  });

  const appointments = appointmentsResponse?.data ?? [];

  const prescribedAppointmentIds = useMemo(() => {
    const ids = new Set<string>();
    for (const prescription of prescriptionsResponse?.data ?? []) {
      if (prescription.appointmentId) {
        ids.add(prescription.appointmentId);
      }
    }
    return ids;
  }, [prescriptionsResponse?.data]);

  // Client-side application of search/sort/filter/pagination as a fallback
  // since the backend does not yet support these query params for this endpoint.
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
      const patientName = appointment.patient?.name?.toLowerCase() ?? "";
      const patientEmail = appointment.patient?.email?.toLowerCase() ?? "";
      if (!patientName.includes(term) && !patientEmail.includes(term)) {
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

  const handleOpenCreatePrescription = (appointment: IAppointment) => {
    onViewOpenChange(false);
    setPrescriptionAppointment(appointment);
    setIsPrescriptionModalOpen(true);
  };

  const handlePrescriptionModalOpenChange = (open: boolean) => {
    setIsPrescriptionModalOpen(open);
    if (!open) {
      setPrescriptionAppointment(null);
    }
  };

  const columns = useMemo(
    () => getDoctorAppointmentsColumns(prescribedAppointmentIds),
    [prescribedAppointmentIds],
  );

  const isLoading = !isMounted || isAppointmentsLoading || isPrescriptionsLoading || isAppointmentsFetching;

  const viewingItemHasPrescription = viewingItem ? prescribedAppointmentIds.has(viewingItem.id) : false;

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="h-10 w-1 bg-gradient-to-b from-[#0d9488] to-[#047857] rounded-full shrink-0 mt-1" />
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-[#0d9488] to-[#047857] bg-clip-text text-transparent">My Appointments</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            View your appointments, update their status, and create prescriptions for completed visits.
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
            placeholder: "Search by patient name or email...",
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

      <ManageAppointmentModal
        appointment={viewingItem}
        open={isViewDialogOpen}
        onOpenChange={onViewOpenChange}
        onCreatePrescription={handleOpenCreatePrescription}
        hasPrescription={viewingItemHasPrescription}
      />

      <CreatePrescriptionModal
        appointment={prescriptionAppointment}
        open={isPrescriptionModalOpen}
        onOpenChange={handlePrescriptionModalOpenChange}
      />
    </div>
  );
};

export default DoctorAppointmentsView;