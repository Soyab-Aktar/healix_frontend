import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IPayment } from "@/types/payment.types";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CreditCard, Calendar, User, Stethoscope, FileText, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ViewPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: IPayment | null;
}

const ViewPaymentDialog = ({
  open,
  onOpenChange,
  payment,
}: ViewPaymentDialogProps) => {
  if (!payment) return null;

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return "N/A";
    return format(new Date(date), "PPP p");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col gap-0 p-0 overflow-hidden border-slate-200/80">
        <DialogHeader className="px-6 py-5 border-b shrink-0 bg-slate-50/50">
          <DialogTitle className="text-xl font-extrabold flex items-center gap-2.5 text-slate-800">
            <CreditCard className="h-5.5 w-5.5 text-[#047857]" />
            <span className="bg-gradient-to-r from-teal-800 to-emerald-700 bg-clip-text text-transparent">Payment Transaction Details</span>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-y-auto max-h-[calc(90vh-8rem)]">
          <div className="px-6 py-5 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Transaction Meta */}
              <div className="space-y-4">
                <div className="rounded-xl border border-slate-200/60 bg-slate-50/15 p-4 space-y-3">
                  <h3 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-1.5 flex items-center gap-2">
                    Billing Details
                  </h3>
                  <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-semibold">Amount:</span>
                      <span className="font-extrabold text-lg text-emerald-600">₹{payment.amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-semibold">Status:</span>
                      <Badge variant="outline" className={cn(
                        "capitalize font-semibold rounded-full px-2.5 py-0.5 text-xs",
                        payment.status === "PAID" && "bg-emerald-50 text-emerald-700 border-emerald-100",
                        payment.status === "UNPAID" && "bg-amber-50 text-amber-700 border-amber-100",
                        payment.status === "FAILED" && "bg-rose-50 text-rose-750 border-rose-100"
                      )}>
                        {payment.status?.toLowerCase()}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-semibold">Paid Date:</span>
                      <span className="font-semibold text-slate-700">{formatDate(payment.createdAt)}</span>
                    </div>
                    {payment.stripeEventId && (
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-semibold">Stripe Event ID:</span>
                        <span className="font-mono text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded truncate max-w-[150px]" title={payment.stripeEventId}>{payment.stripeEventId}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Document / Invoice */}
                {payment.invoiceUrl && (
                  <div className="rounded-xl border border-emerald-100/60 bg-emerald-50/10 p-4 flex flex-col items-center gap-3 text-center">
                    <FileText className="h-8 w-8 text-[#047857]" />
                    <div>
                      <h4 className="font-bold text-sm text-slate-800">Invoice PDF Available</h4>
                      <p className="text-xs text-slate-400 font-semibold mt-0.5">Download or view the payment invoice.</p>
                    </div>
                    <Button variant="outline" size="sm" className="w-full gap-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50/50 hover:border-emerald-400 rounded-lg cursor-pointer font-bold transition-colors" asChild>
                      <a href={payment.invoiceUrl} target="_blank" rel="noopener noreferrer">
                        View Invoice <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </Button>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="space-y-4">
                {/* IDs Info */}
                <div className="rounded-xl border border-slate-200/60 bg-white p-4 space-y-3 text-xs">
                  <h3 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-1.5">Identifiers</h3>
                  <div className="flex flex-col gap-1">
                    <span className="text-slate-400 font-semibold">Payment ID:</span>
                    <span className="font-mono bg-slate-50 border border-slate-100 p-2 rounded-lg text-slate-700 font-semibold break-all">{payment.id}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-slate-400 font-semibold">Transaction ID:</span>
                    <span className="font-mono bg-slate-50 border border-slate-100 p-2 rounded-lg text-slate-700 font-semibold break-all">{payment.transactionId}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-slate-400 font-semibold">Appointment ID:</span>
                    <span className="font-mono bg-slate-50 border border-slate-100 p-2 rounded-lg text-slate-700 font-semibold break-all">{payment.appointmentId}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Patient and Doctor */}
            {payment.appointment && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                {/* Patient Info */}
                <div className="rounded-xl border border-slate-200/60 p-4 hover:border-emerald-100/50 transition-colors bg-white">
                  <h3 className="font-bold text-sm flex items-center gap-2 mb-2.5 border-b border-slate-100 pb-1.5 text-slate-800">
                    <User className="h-4.5 w-4.5 text-sky-500" /> Patient Info
                  </h3>
                  <div className="text-sm space-y-1">
                    <p className="font-bold text-slate-800">{payment.appointment.patient?.name || "N/A"}</p>
                    <p className="text-slate-500 font-medium text-xs">{payment.appointment.patient?.email || "N/A"}</p>
                  </div>
                </div>

                {/* Doctor Info */}
                <div className="rounded-xl border border-slate-200/60 p-4 hover:border-emerald-100/50 transition-colors bg-white">
                  <h3 className="font-bold text-sm flex items-center gap-2 mb-2.5 border-b border-slate-100 pb-1.5 text-slate-800">
                    <Stethoscope className="h-4.5 w-4.5 text-emerald-500" /> Doctor Info
                  </h3>
                  <div className="text-sm space-y-1">
                    <p className="font-bold text-slate-800">{payment.appointment.doctor?.name || "N/A"}</p>
                    <p className="text-slate-500 font-medium text-xs">{payment.appointment.doctor?.email || "N/A"}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ViewPaymentDialog;
