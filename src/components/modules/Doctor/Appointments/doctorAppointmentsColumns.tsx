import { Badge } from "@/components/ui/badge";
import { IAppointment, AppointmentStatus, PaymentStatus } from "@/types/appointment.types";
import { ColumnDef } from "@tanstack/react-table";
import { FileCheck2, FileX2 } from "lucide-react";

const formatDateTime = (value?: string | Date) => {
  if (!value) return "-";
  const date = new Date(value);
  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const statusBadgeVariant: Record<AppointmentStatus, "default" | "secondary" | "destructive" | "outline"> = {
  SCHEDULED: "default",
  INPROGRESS: "secondary",
  COMPLETED: "outline",
  CANCELED: "destructive",
};

const paymentBadgeVariant: Record<PaymentStatus, "default" | "secondary" | "destructive" | "outline"> = {
  PAID: "default",
  UNPAID: "secondary",
  FAILED: "destructive",
};

// `prescribedAppointmentIds` is injected via column meta so the cell can check
// whether a prescription already exists for this appointment.
export const getDoctorAppointmentsColumns = (
  prescribedAppointmentIds: Set<string>,
): ColumnDef<IAppointment>[] => [
  {
    accessorKey: "patient.name",
    header: "Patient",
    enableSorting: false,
    cell: ({ row }) => {
      const patient = row.original.patient;
      return (
        <div className="flex flex-col">
          <span className="font-medium">{patient?.name ?? "-"}</span>
          {patient?.email && (
            <span className="text-xs text-muted-foreground">{patient.email}</span>
          )}
        </div>
      );
    },
  },
  {
    id: "schedule",
    header: "Schedule",
    enableSorting: false,
    cell: ({ row }) => {
      const schedule = row.original.schedule;
      return <span>{formatDateTime(schedule?.startDateTime ?? row.original.appointmentStart ?? undefined)}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const appointmentStatus = row.original.status as AppointmentStatus;
      return (
        <Badge variant={statusBadgeVariant[appointmentStatus] ?? "outline"}>
          {appointmentStatus}
        </Badge>
      );
    },
  },
  {
    accessorKey: "paymentStatus",
    header: "Payment",
    cell: ({ row }) => {
      const paymentStatus = row.original.paymentStatus as PaymentStatus;
      return (
        <Badge variant={paymentBadgeVariant[paymentStatus] ?? "outline"}>
          {paymentStatus}
        </Badge>
      );
    },
  },
  {
    id: "prescription",
    header: "Prescription",
    enableSorting: false,
    cell: ({ row }) => {
      const hasPrescription = prescribedAppointmentIds.has(row.original.id);

      if (hasPrescription) {
        return (
          <Badge variant="outline" className="gap-1 text-emerald-600 border-emerald-200 bg-emerald-50">
            <FileCheck2 className="h-3.5 w-3.5" />
            Sent
          </Badge>
        );
      }

      return (
        <Badge variant="outline" className="gap-1 text-muted-foreground">
          <FileX2 className="h-3.5 w-3.5" />
          Not Sent
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Booked On",
    cell: ({ row }) => formatDateTime(row.original.createdAt),
  },
];