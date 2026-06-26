"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/prescription.utils";
import { PrescriptionRow } from "@/types/prescription.types";
import { ExternalLink, FileText } from "lucide-react";

interface PrescriptionViewModalProps {
  item: PrescriptionRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Show doctor info (patient view) or patient info (doctor view) */
  perspective?: "doctor" | "patient";
}

const DetailRow = ({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) => (
  <div className="flex items-start justify-between gap-4 py-0.5">
    <span className="text-slate-400 shrink-0 w-36 text-sm font-semibold">{label}</span>
    <span
      className={`text-slate-700 text-right break-all text-sm font-semibold ${
        mono
          ? "font-mono text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/40"
          : ""
      }`}
    >
      {value}
    </span>
  </div>
);

const PrescriptionViewModal = ({
  item,
  open,
  onOpenChange,
  perspective = "doctor",
}: PrescriptionViewModalProps) => {
  const counterpart = perspective === "doctor" ? item?.patient : item?.doctor;
  const counterpartLabel = perspective === "doctor" ? "Patient" : "Doctor";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 overflow-hidden border-slate-200/80">
        <DialogHeader className="px-6 py-5 border-b shrink-0 bg-slate-50/50">
          <DialogTitle className="text-xl font-extrabold flex items-center gap-2.5 text-slate-800">
            <FileText className="h-5.5 w-5.5 text-[#047857]" />
            <span className="bg-gradient-to-r from-teal-800 to-emerald-700 bg-clip-text text-transparent">Prescription Details</span>
          </DialogTitle>
        </DialogHeader>

        {item && (
          <div className="px-6 py-5 space-y-4">
            {/* Meta */}
            <div className="rounded-[20px] border border-slate-200/60 bg-slate-50/15 p-4.5 space-y-2.5">
              <DetailRow label="Prescription ID" value={item.id} mono />
              <DetailRow label="Appointment ID" value={item.appointmentId} mono />
              <DetailRow label="Issued On" value={formatDate(item.createdAt)} />
              <DetailRow
                label="Follow-up Date"
                value={
                  item.followUpDate
                    ? formatDate(item.followUpDate)
                    : "No follow-up scheduled"
                }
              />
            </div>

            {/* Counterpart person */}
            <div className="rounded-[20px] border border-slate-200/60 p-4.5 space-y-2.5">
              <p className="text-xs font-bold text-[#047857] uppercase tracking-wide mb-1">
                {counterpartLabel} Details
              </p>
              <DetailRow label="Name" value={counterpart?.name ?? "—"} />
              <DetailRow label="Email" value={counterpart?.email ?? "—"} />
            </div>

            {/* Instructions */}
            <div className="rounded-[20px] border border-slate-200/60 p-4.5">
              <p className="text-xs font-bold text-[#047857] uppercase tracking-wide mb-2">
                Instructions & Medications
              </p>
              <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed font-medium">
                {item.instructions}
              </p>
            </div>

            {/* PDF */}
            {item.pdfUrl && (
              <a
                href={item.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-lg bg-[#047857] hover:bg-[#035f43] px-5 py-3 text-sm font-bold text-white shadow-xs transition-colors"
              >
                <ExternalLink className="h-4 w-4 shrink-0" />
                Open Prescription PDF
              </a>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PrescriptionViewModal;