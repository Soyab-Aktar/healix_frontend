import DateCell from "@/components/shared/cell/DateCell";
import UserInfoCell from "@/components/shared/cell/UserInfoCell";
import { Badge } from "@/components/ui/badge";
import { IAppointment } from "@/types/appointment.types";
import { ColumnDef } from "@tanstack/react-table";

export const appointmentColumns: ColumnDef<IAppointment>[] = [
  {
    id: "id",
    accessorKey: "id",
    header: "Appointment ID",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-muted-foreground">
        {row.original.id}
      </span>
    ),
  },
  {
    id: "patient",
    header: "Patient",
    enableSorting: false,
    cell: ({ row }) => {
      const patient = row.original.patient;
      return (
        <UserInfoCell
          name={patient?.name || "N/A"}
          email={patient?.email || "N/A"}
        />
      );
    },
  },
  {
    id: "doctor",
    header: "Doctor",
    enableSorting: false,
    cell: ({ row }) => {
      const doctor = row.original.doctor;
      return (
        <UserInfoCell
          name={doctor?.name || "N/A"}
          email={doctor?.email || "N/A"}
          profilePhoto={doctor?.profilePhoto || undefined}
        />
      );
    },
  },
  {
    id: "schedule",
    accessorKey: "schedule.startDateTime",
    header: "Schedule Date & Time",
    cell: ({ row }) => {
      const date = row.original.schedule?.startDateTime;
      return date ? (
        <DateCell date={date} formatString="MMM dd, yyyy - hh:mm a" />
      ) : (
        <span className="text-sm text-muted-foreground">N/A</span>
      );
    },
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status || "SCHEDULED";
      let variant: "default" | "secondary" | "destructive" | "outline" = "outline";
      let classes = "";

      switch (status) {
        case "SCHEDULED":
          variant = "outline";
          classes = "border-sky-300 bg-sky-50 text-sky-700 hover:bg-sky-50";
          break;
        case "INPROGRESS":
          variant = "secondary";
          classes = "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-50";
          break;
        case "COMPLETED":
          variant = "default";
          classes = "border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-50";
          break;
        case "CANCELED":
          variant = "destructive";
          classes = "border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-50";
          break;
      }

      return (
        <Badge variant={variant} className={classes}>
          {status}
        </Badge>
      );
    },
  },
  {
    id: "paymentStatus",
    accessorKey: "paymentStatus",
    header: "Payment",
    cell: ({ row }) => {
      const paymentStatus = row.original.paymentStatus || "UNPAID";
      let classes = "";

      switch (paymentStatus) {
        case "PAID":
          classes = "border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-50";
          break;
        case "UNPAID":
          classes = "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-50";
          break;
        default:
          classes = "border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-50";
          break;
      }

      return (
        <Badge variant="outline" className={classes}>
          {paymentStatus}
        </Badge>
      );
    },
  },
];
