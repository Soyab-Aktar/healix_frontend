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
    <span className="text-slate-500 shrink-0 w-36 text-sm font-medium">{label}</span>
    <span
      className={`text-slate-800 text-right break-all text-sm font-semibold ${
        mono
          ? "font-mono text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/40"
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
      <DialogContent className="max-w-lg rounded-[24px] border border-slate-200/60 p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-slate-800">
            <FileText className="h-5 w-5 text-[#047857]" />
            Prescription Details
          </DialogTitle>
        </DialogHeader>

        {item && (
          <div className="space-y-4">
            {/* Meta */}
            <div className="rounded-[20px] border border-slate-200/60 bg-slate-50/50 p-4.5 space-y-2.5">
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
              <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                {item.instructions}
              </p>
            </div>

            {/* PDF */}
            {item.pdfUrl && (
              <a
                href={item.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-lg bg-[#047857] hover:bg-[#035f43] px-5 py-3 text-sm font-semibold text-white shadow-xs transition-colors"
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