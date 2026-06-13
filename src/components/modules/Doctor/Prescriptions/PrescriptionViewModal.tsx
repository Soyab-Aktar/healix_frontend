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
  <div className="flex items-start justify-between gap-4">
    <span className="text-muted-foreground shrink-0 w-36 text-sm">{label}</span>
    <span
      className={`text-foreground text-right break-all text-sm ${mono ? "font-mono text-xs" : ""
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
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Prescription Details
          </DialogTitle>
        </DialogHeader>

        {item && (
          <div className="space-y-4">
            {/* Meta */}
            <div className="rounded-md border bg-muted/40 p-4 space-y-2.5">
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
            <div className="rounded-md border p-4 space-y-2.5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                {counterpartLabel}
              </p>
              <DetailRow label="Name" value={counterpart?.name ?? "—"} />
              <DetailRow label="Email" value={counterpart?.email ?? "—"} />
            </div>

            {/* Instructions */}
            <div className="rounded-md border p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Instructions & Medications
              </p>
              <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                {item.instructions}
              </p>
            </div>

            {/* PDF */}
            {item.pdfUrl && (
              <a
                href={item.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-md border border-primary/30 bg-primary/5 px-4 py-3 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
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