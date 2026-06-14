import DateCell from "@/components/shared/cell/DateCell";
import UserInfoCell from "@/components/shared/cell/UserInfoCell";
import { Badge } from "@/components/ui/badge";
import { IPayment } from "@/types/payment.types";
import { ColumnDef } from "@tanstack/react-table";

export const paymentColumns: ColumnDef<IPayment>[] = [
  {
    id: "id",
    accessorKey: "id",
    header: "Payment ID",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-muted-foreground">
        {row.original.id}
      </span>
    ),
  },
  {
    id: "transactionId",
    accessorKey: "transactionId",
    header: "Transaction ID",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-muted-foreground">
        {row.original.transactionId}
      </span>
    ),
  },
  {
    id: "patient",
    header: "Patient",
    enableSorting: false,
    cell: ({ row }) => {
      const patient = row.original.appointment?.patient;
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
      const doctor = row.original.appointment?.doctor;
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
    id: "amount",
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => (
      <span className="text-sm font-semibold text-green-600">
        ₹{row.original.amount.toFixed(2)}
      </span>
    ),
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status || "UNPAID";
      let classes = "";

      switch (status) {
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
          {status}
        </Badge>
      );
    },
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Date Paid",
    cell: ({ row }) => (
      <DateCell date={row.original.createdAt} formatString="MMM dd, yyyy" />
    ),
  },
];
