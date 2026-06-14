import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IPrescription } from "@/types/prescription.types";
import { FileText, Calendar, User, Stethoscope, Download, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

interface ViewPrescriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prescription: IPrescription | null;
}

const ViewPrescriptionDialog = ({
  open,
  onOpenChange,
  prescription,
}: ViewPrescriptionDialogProps) => {
  if (!prescription) return null;

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return "N/A";
    return format(new Date(date), "PPP p");
  };

  const formatSimpleDate = (date: string | Date | undefined) => {
    if (!date) return "N/A";
    return format(new Date(date), "PPP");
  };

  const patient = (prescription as any).patient;
  const doctor = (prescription as any).doctor;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Prescription Details
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-5">
          {/* Main Info Box */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border bg-muted/40 p-3 text-xs">
              <span className="text-muted-foreground font-semibold block mb-1">Prescription ID:</span>
              <span className="font-mono break-all">{prescription.id}</span>
            </div>
            <div className="rounded-lg border bg-muted/40 p-3 text-xs">
              <span className="text-muted-foreground font-semibold block mb-1">Appointment ID:</span>
              <span className="font-mono break-all">{prescription.appointmentId}</span>
            </div>
          </div>

          {/* Instructions Box */}
          <div className="space-y-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Instructions</span>
            <div className="p-4 bg-muted/20 border rounded-lg text-sm text-foreground whitespace-pre-wrap leading-relaxed">
              {prescription.instructions || "No instructions provided."}
            </div>
          </div>

          {/* Patient and Doctor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
            {/* Patient Info */}
            <div className="flex items-start gap-3">
              <User className="h-4 w-4 text-sky-500 mt-0.5" />
              <div className="text-xs space-y-0.5">
                <span className="font-semibold block">Patient Details:</span>
                <span className="font-medium text-foreground block">{patient?.name || "N/A"}</span>
                <span className="text-muted-foreground block">{patient?.email || "N/A"}</span>
              </div>
            </div>

            {/* Doctor Info */}
            <div className="flex items-start gap-3">
              <Stethoscope className="h-4 w-4 text-emerald-500 mt-0.5" />
              <div className="text-xs space-y-0.5">
                <span className="font-semibold block">Prescribed By Doctor:</span>
                <span className="font-medium text-foreground block">{doctor?.name || "N/A"}</span>
                <span className="text-muted-foreground block">{doctor?.email || "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Timing details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-4 w-4 text-purple-500 mt-0.5" />
              <div className="text-xs">
                <span className="font-semibold block">Issued On:</span>
                <span className="text-muted-foreground">{formatDate(prescription.createdAt)}</span>
              </div>
            </div>

            {/* Follow-up date */}
            <div className="flex items-start gap-3">
              <Calendar className="h-4 w-4 text-amber-500 mt-0.5" />
              <div className="text-xs">
                <span className="font-semibold block">Follow-Up Date:</span>
                <span className="text-muted-foreground">{formatSimpleDate(prescription.followUpDate)}</span>
              </div>
            </div>
          </div>

          {/* PDF Link */}
          {prescription.pdfUrl && (
            <div className="border-t pt-4 flex justify-end">
              <Button size="sm" className="gap-2" asChild>
                <a href={prescription.pdfUrl} target="_blank" rel="noopener noreferrer">
                  Download / View PDF <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewPrescriptionDialog;
