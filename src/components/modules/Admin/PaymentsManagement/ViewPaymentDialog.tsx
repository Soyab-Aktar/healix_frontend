import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IPayment } from "@/types/payment.types";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Calendar, User, Stethoscope, FileText, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Payment Transaction Details
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Transaction Meta */}
          <div className="space-y-4">
            <div className="rounded-lg border bg-muted/40 p-4">
              <h3 className="font-semibold text-sm text-muted-foreground mb-2">Billing Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-semibold text-green-600">₹{payment.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant="outline" className="capitalize">
                    {payment.status?.toLowerCase()}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Paid Date:</span>
                  <span>{formatDate(payment.createdAt)}</span>
                </div>
                {payment.stripeEventId && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Stripe Event ID:</span>
                    <span className="font-mono text-[10px] truncate max-w-[150px]">{payment.stripeEventId}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Document / Invoice */}
            {payment.invoiceUrl && (
              <div className="rounded-lg border bg-emerald-50/30 border-emerald-200 p-4 flex flex-col items-center gap-3 text-center">
                <FileText className="h-8 w-8 text-emerald-600" />
                <div>
                  <h4 className="font-semibold text-sm">Invoice PDF Available</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Download or view the payment invoice.</p>
                </div>
                <Button variant="outline" size="sm" className="w-full gap-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50" asChild>
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
            <div className="rounded-lg border p-4 space-y-2 text-xs">
              <h3 className="font-semibold text-sm mb-1 text-muted-foreground">Identifiers</h3>
              <div className="flex flex-col gap-0.5">
                <span className="text-muted-foreground font-medium">Payment ID:</span>
                <span className="font-mono bg-muted p-1 rounded break-all">{payment.id}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-muted-foreground font-medium">Transaction ID:</span>
                <span className="font-mono bg-muted p-1 rounded break-all">{payment.transactionId}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-muted-foreground font-medium">Appointment ID:</span>
                <span className="font-mono bg-muted p-1 rounded break-all">{payment.appointmentId}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Patient and Doctor */}
        {payment.appointment && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {/* Patient Info */}
            <div className="rounded-lg border p-4">
              <h3 className="font-semibold text-sm flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-sky-500" /> Patient Info
              </h3>
              <div className="text-sm space-y-1">
                <p className="font-medium">{payment.appointment.patient?.name || "N/A"}</p>
                <p className="text-muted-foreground text-xs">{payment.appointment.patient?.email || "N/A"}</p>
              </div>
            </div>

            {/* Doctor Info */}
            <div className="rounded-lg border p-4">
              <h3 className="font-semibold text-sm flex items-center gap-2 mb-2">
                <Stethoscope className="h-4 w-4 text-emerald-500" /> Doctor Info
              </h3>
              <div className="text-sm space-y-1">
                <p className="font-medium">{payment.appointment.doctor?.name || "N/A"}</p>
                <p className="text-muted-foreground text-xs">{payment.appointment.doctor?.email || "N/A"}</p>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewPaymentDialog;
