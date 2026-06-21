import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IPrescription } from "@/types/prescription.types";
import { FileText, Calendar, User, Stethoscope, Download, ExternalLink } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
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
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col gap-0 p-0 overflow-hidden border-slate-200/80">
        <DialogHeader className="px-6 py-5 border-b shrink-0 bg-slate-50/50">
          <DialogTitle className="text-xl font-extrabold flex items-center gap-2.5 text-slate-800">
            <FileText className="h-5.5 w-5.5 text-[#047857]" />
            <span className="bg-gradient-to-r from-teal-800 to-emerald-700 bg-clip-text text-transparent">Prescription Details</span>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-y-auto max-h-[calc(90vh-8rem)]">
          <div className="px-6 py-5 space-y-5">
            {/* Main Info Box */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-200/60 bg-slate-50/15 p-3.5 text-xs">
                <span className="text-slate-400 font-semibold block mb-1">Prescription ID:</span>
                <span className="font-mono font-bold text-slate-700 break-all">{prescription.id}</span>
              </div>
              <div className="rounded-xl border border-slate-200/60 bg-slate-50/15 p-3.5 text-xs">
                <span className="text-slate-400 font-semibold block mb-1">Appointment ID:</span>
                <span className="font-mono font-bold text-slate-700 break-all">{prescription.appointmentId}</span>
              </div>
            </div>

            {/* Instructions Box */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Instructions & Dosage</span>
              <div className="p-5 bg-gradient-to-br from-emerald-50/10 to-teal-50/5 border border-emerald-100/60 rounded-xl text-sm text-slate-750 font-medium whitespace-pre-wrap leading-relaxed shadow-xs">
                {prescription.instructions || "No instructions provided."}
              </div>
            </div>

            {/* Patient and Doctor */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
              {/* Patient Info */}
              <div className="flex items-start gap-3 rounded-xl border border-slate-200/60 p-4 bg-white hover:border-emerald-100/50 transition-colors">
                <User className="h-5 w-5 text-sky-500 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <span className="font-bold text-slate-400 block">Patient Details</span>
                  <span className="font-bold text-slate-800 text-sm block">{patient?.name || "N/A"}</span>
                  <span className="text-slate-500 font-medium block">{patient?.email || "N/A"}</span>
                </div>
              </div>

              {/* Doctor Info */}
              <div className="flex items-start gap-3 rounded-xl border border-slate-200/60 p-4 bg-white hover:border-emerald-100/50 transition-colors">
                <Stethoscope className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <span className="font-bold text-slate-400 block">Prescribed By Doctor</span>
                  <span className="font-bold text-slate-800 text-sm block">{doctor?.name || "N/A"}</span>
                  <span className="text-slate-500 font-medium block">{doctor?.email || "N/A"}</span>
                </div>
              </div>
            </div>

            {/* Timing details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
              <div className="flex items-start gap-3 bg-slate-50/15 border border-slate-200/60 rounded-xl p-3.5">
                <Calendar className="h-4.5 w-4.5 text-purple-500 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-slate-400 block">Issued On:</span>
                  <span className="text-slate-700 font-semibold">{formatDate(prescription.createdAt)}</span>
                </div>
              </div>

              {/* Follow-up date */}
              <div className="flex items-start gap-3 bg-slate-50/15 border border-slate-200/60 rounded-xl p-3.5">
                <Calendar className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-slate-400 block">Follow-Up Date:</span>
                  <span className="text-slate-700 font-semibold">{formatSimpleDate(prescription.followUpDate)}</span>
                </div>
              </div>
            </div>

            {/* PDF Link */}
            {prescription.pdfUrl && (
              <div className="border-t border-slate-100 pt-4 flex justify-end">
                <Button size="sm" className="bg-[#047857] hover:bg-[#035f43] text-white font-bold rounded-lg transition-all duration-300 cursor-pointer gap-2" asChild>
                  <a href={prescription.pdfUrl} target="_blank" rel="noopener noreferrer">
                    Download / View PDF <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ViewPrescriptionDialog;
