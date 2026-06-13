import { Badge } from "@/components/ui/badge";
import { IAppointment, AppointmentStatus, PaymentStatus } from "@/types/appointment.types";
import { ColumnDef } from "@tanstack/react-table";

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

export const myAppointmentsColumns: ColumnDef<IAppointment>[] = [
  {
    accessorKey: "doctor.name",
    header: "Doctor",
    enableSorting: false,
    cell: ({ row }) => {
      const doctor = row.original.doctor;
      return (
        <div className="flex flex-col">
          <span className="font-medium">{doctor?.name ?? "-"}</span>
          {doctor?.designation && (
            <span className="text-xs text-muted-foreground">{doctor.designation}</span>
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
      return <span>{formatDateTime(schedule?.startDateTime)}</span>;
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
    accessorKey: "createdAt",
    header: "Booked On",
    cell: ({ row }) => formatDateTime(row.original.createdAt),
  },
];