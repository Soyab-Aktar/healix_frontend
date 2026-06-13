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
import { Loader2 } from "lucide-react";
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
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Prescription</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="pe-instructions">Instructions & Medications</Label>
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
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pe-followup">Follow-up Date (optional)</Label>
            <Input
              id="pe-followup"
              type="date"
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
              disabled={isPending}
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isPending}>
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