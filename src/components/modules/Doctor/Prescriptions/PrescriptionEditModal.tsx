"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toDateInputValue } from "@/lib/prescription.utils";
import { PrescriptionRow, PrescriptionUpdatePayload } from "@/types/prescription.types";
import { Loader2, FileText } from "lucide-react";
import { useEffect, useState, useTransition } from "react";


interface PrescriptionEditModalProps {
  item: PrescriptionRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (id: string, payload: PrescriptionUpdatePayload) => Promise<void>;
}

const PrescriptionEditModal = ({
  item,
  open,
  onOpenChange,
  onUpdate,
}: PrescriptionEditModalProps) => {
  const [instructions, setInstructions] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  // Populate fields when item changes
  useEffect(() => {
    if (item) {
      setInstructions(item.instructions ?? "");
      setFollowUpDate(toDateInputValue(item.followUpDate));
      setError("");
    }
  }, [item]);

  const handleSubmit = () => {
    if (!item) return;
    if (!instructions.trim()) {
      setError("Instructions are required.");
      return;
    }
    setError("");
    startTransition(async () => {
      await onUpdate(item.id, {
        instructions: instructions.trim(),
        followUpDate: followUpDate || undefined,
      });
      onOpenChange(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 overflow-hidden border-slate-200/80">
        <DialogHeader className="px-6 py-5 border-b shrink-0 bg-slate-50/50">
          <DialogTitle className="text-xl font-extrabold flex items-center gap-2.5 text-slate-800">
            <FileText className="h-5.5 w-5.5 text-[#047857]" />
            <span className="bg-gradient-to-r from-teal-800 to-emerald-700 bg-clip-text text-transparent">Edit Prescription</span>
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-5 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="pe-instructions" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Instructions & Medications</Label>
            <Textarea
              id="pe-instructions"
              rows={5}
              placeholder="Enter instructions…"
              value={instructions}
              onChange={(e) => {
                setInstructions(e.target.value);
                if (error) setError("");
              }}
              disabled={isPending}
              className="rounded-xl border-slate-300 focus-visible:ring-emerald-500/10 focus-visible:border-emerald-650"
            />
            {error && <p className="text-xs text-destructive font-semibold">{error}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pe-followup" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Follow-up Date (optional)</Label>
            <Input
              id="pe-followup"
              type="date"
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
              disabled={isPending}
              className="rounded-xl border-slate-300 focus-visible:ring-emerald-500/10 focus-visible:border-emerald-650"
            />
          </div>

          <div className="flex justify-end gap-2 border-t pt-4 shrink-0">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="rounded-lg font-bold hover:bg-slate-100 hover:text-slate-800 transition-colors"
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isPending} className="bg-[#047857] hover:bg-[#035f43] text-white hover:text-white rounded-lg font-bold transition-colors">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrescriptionEditModal;