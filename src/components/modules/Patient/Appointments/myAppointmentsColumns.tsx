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

const statusBadgeStyles: Record<AppointmentStatus, string> = {
  SCHEDULED: "bg-blue-50 text-blue-700 border-blue-100/80",
  INPROGRESS: "bg-amber-50 text-amber-700 border-amber-100/80",
  COMPLETED: "bg-emerald-50 text-[#047857] border-emerald-100/80",
  CANCELED: "bg-rose-50 text-rose-700 border-rose-100/80",
};

const paymentBadgeStyles: Record<PaymentStatus, string> = {
  PAID: "bg-emerald-50 text-[#047857] border-emerald-100/80",
  UNPAID: "bg-amber-50 text-amber-700 border-amber-100/80",
  FAILED: "bg-rose-50 text-rose-700 border-rose-100/80",
};

export const getMyAppointmentsColumns = (
  reviewedAppointmentIds: Set<string>,
  onWriteReview: (appointment: IAppointment) => void
): ColumnDef<IAppointment>[] => [
  {
    accessorKey: "doctor.name",
    header: "Doctor",
    enableSorting: false,
    cell: ({ row }) => {
      const doctor = row.original.doctor;
      const initial = doctor?.name?.charAt(0).toUpperCase() ?? "D";
      return (
        <div className="flex items-center gap-3">
          <div className="relative shrink-0 w-9 h-9 rounded-[10px] overflow-hidden bg-emerald-50 border border-slate-100 flex items-center justify-center text-emerald-600 font-extrabold text-sm shadow-2xs">
            {doctor?.profilePhoto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={doctor.profilePhoto}
                alt={doctor.name ?? "Doctor"}
                className="w-full h-full object-cover"
              />
            ) : (
              initial
            )}
          </div>
          <div className="min-w-0">
            <span className="font-bold text-slate-800 text-sm truncate block">{doctor?.name ?? "-"}</span>
            {doctor?.designation && (
              <span className="text-[10px] font-bold text-slate-400 block tracking-wide uppercase mt-0.5">{doctor.designation}</span>
            )}
          </div>
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
      const startDateTime = schedule?.startDateTime ?? row.original.appointmentStart ?? undefined;
      return <span className="text-sm font-semibold text-slate-700">{formatDateTime(startDateTime)}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const appointmentStatus = row.original.status as AppointmentStatus;
      return (
        <span className={`inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full border ${statusBadgeStyles[appointmentStatus] || "bg-slate-50 text-slate-750 border-slate-100"}`}>
          {appointmentStatus}
        </span>
      );
    },
  },
  {
    accessorKey: "paymentStatus",
    header: "Payment",
    cell: ({ row }) => {
      const paymentStatus = row.original.paymentStatus as PaymentStatus;
      return (
        <span className={`inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full border ${paymentBadgeStyles[paymentStatus] || "bg-slate-50 text-slate-750 border-slate-100"}`}>
          {paymentStatus}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Booked On",
    cell: ({ row }) => (
      <span className="text-sm font-medium text-slate-500">
        {formatDateTime(row.original.createdAt)}
      </span>
    ),
  },
  {
    id: "review",
    header: "Review Feedback",
    enableSorting: false,
    cell: ({ row }) => {
      const appointment = row.original;
      const isCompleted = appointment.status === "COMPLETED";
      const isPaid = appointment.paymentStatus === "PAID";

      if (!isCompleted) {
        return <span className="text-slate-450 text-xs italic font-medium">Available on completion</span>;
      }

      if (!isPaid) {
        return (
          <span 
            className="inline-flex items-center text-xs font-bold text-amber-600 bg-amber-50/50 px-2 py-0.5 rounded-lg border border-amber-100/50 cursor-help"
            title="Payment is required to submit reviews"
          >
            Requires Payment
          </span>
        );
      }

      const hasReviewed = reviewedAppointmentIds.has(appointment.id);
      if (hasReviewed) {
        return (
          <span className="inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700">
            Reviewed
          </span>
        );
      }

      return (
        <button
          onClick={() => onWriteReview(appointment)}
          className="inline-flex items-center text-xs font-bold px-3 py-1 rounded-lg border border-emerald-500/20 bg-emerald-50 text-[#047857] hover:bg-[#047857] hover:text-white hover:border-[#047857] transition-all cursor-pointer shadow-3xs"
        >
          Write Review
        </button>
      );
    },
  },
];