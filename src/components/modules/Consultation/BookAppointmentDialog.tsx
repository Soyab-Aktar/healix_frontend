"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, Wallet, Loader2, CalendarX2, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { IDoctorScheduleItem } from "@/types/doctor.types";
import { bookAppointmentWithPayLater } from "@/services/appointment.services";
import { bookAppointmentAction } from "@/app/_actions/appointment.actions";

interface BookAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doctorId: string;
  doctorName: string;
  appointmentFee: number;
  doctorSchedules?: IDoctorScheduleItem[];
}

interface GroupedSchedule {
  dateLabel: string;
  dateKey: string;
  slots: {
    scheduleId: string;
    startDateTime: string | Date;
    endDateTime?: string | Date;
  }[];
}

const formatTime = (date: string | Date) =>
  new Date(date).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

const formatDateLabel = (date: string | Date) => {
  const d = new Date(date);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  if (isSameDay(d, today)) return "Today";
  if (isSameDay(d, tomorrow)) return "Tomorrow";

  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
};

export default function BookAppointmentDialog({
  open,
  onOpenChange,
  doctorId,
  doctorName,
  appointmentFee,
  doctorSchedules,
}: BookAppointmentDialogProps) {
  const router = useRouter();
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);

  // Group available (not booked) schedules by date
  const groupedSchedules = useMemo<GroupedSchedule[]>(() => {
    const available = (doctorSchedules ?? []).filter(
      (item) => !item.isBooked && item.schedule?.id && item.schedule?.startDateTime,
    );

    const groups = new Map<string, GroupedSchedule>();

    for (const item of available) {
      const startDateTime = item.schedule!.startDateTime!;
      const date = new Date(startDateTime);
      const dateKey = date.toDateString();

      if (!groups.has(dateKey)) {
        groups.set(dateKey, {
          dateKey,
          dateLabel: formatDateLabel(date),
          slots: [],
        });
      }

      groups.get(dateKey)!.slots.push({
        scheduleId: item.schedule!.id!,
        startDateTime,
        endDateTime: item.schedule?.endDateTime,
      });
    }

    return Array.from(groups.values())
      .map((g) => ({
        ...g,
        slots: g.slots.sort(
          (a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime(),
        ),
      }))
      .sort((a, b) => new Date(a.slots[0].startDateTime).getTime() - new Date(b.slots[0].startDateTime).getTime());
  }, [doctorSchedules]);

  const hasAvailableSlots = groupedSchedules.length > 0;

  const resetAndClose = () => {
    setSelectedScheduleId(null);
    onOpenChange(false);
  };

  const payLaterMutation = useMutation({
    mutationFn: () => bookAppointmentWithPayLater({ doctorId, scheduleId: selectedScheduleId! }),
    onSuccess: (response) => {
      if (!response?.success) {
        toast.error(response?.message || "Failed to book appointment. Please try again.");
        return;
      }

      toast.success("Appointment booked! You can pay anytime from My Appointments.");
      resetAndClose();
      router.push("/dashboard/my-appointments");
      router.refresh();
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Failed to book appointment. Please try again.";
      toast.error(message);
    },
  });

  const payNowMutation = useMutation({
    mutationFn: () => bookAppointmentAction({ doctorId, scheduleId: selectedScheduleId! }),
    onSuccess: (response) => {
      if (!response?.success) {
        toast.error(response?.message || "Failed to book appointment. Please try again.");
        return;
      }
      if (!('data' in response) || !response.data?.paymentUrl) {
        toast.error("Payment link is unavailable right now");
        return;
      }
      toast.success("Redirecting to payment gateway...");
      window.location.assign(response.data.paymentUrl);
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Failed to book appointment. Please try again.";
      toast.error(message);
    },
  });

  const isSubmitting = payLaterMutation.isPending || payNowMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={(next) => !isSubmitting && (next ? onOpenChange(next) : resetAndClose())}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Book Appointment</DialogTitle>
          <DialogDescription>
            Select an available time slot with Dr. {doctorName}
          </DialogDescription>
        </DialogHeader>

        {!hasAvailableSlots ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <CalendarX2 className="h-10 w-10 text-gray-300 mb-3" />
            <p className="text-sm font-medium text-gray-600">No available slots</p>
            <p className="text-xs text-gray-400 mt-1">
              This doctor currently has no open schedules. Please check back later.
            </p>
          </div>
        ) : (
          <ScrollArea className="max-h-80 pr-2">
            <div className="space-y-4">
              {groupedSchedules.map((group) => (
                <div key={group.dateKey}>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-3.5 w-3.5 text-gray-400" />
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      {group.dateLabel}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {group.slots.map((slot) => {
                      const isSelected = selectedScheduleId === slot.scheduleId;
                      return (
                        <button
                          key={slot.scheduleId}
                          type="button"
                          disabled={isSubmitting}
                          onClick={() => setSelectedScheduleId(slot.scheduleId)}
                          className={`flex items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-xs font-medium transition-colors ${isSelected
                            ? "border-blue-600 bg-blue-50 text-blue-700"
                            : "border-gray-200 text-gray-600 hover:border-blue-200 hover:bg-blue-50/50"
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          <Clock className="h-3 w-3" />
                          {formatTime(slot.startDateTime)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        {hasAvailableSlots && (
          <>
            <Separator />
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Consultation Fee</span>
              <span className="font-semibold text-gray-900">₹{appointmentFee}</span>
            </div>
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="text-xs">
                Stripe payment gateway supported
              </Badge>
            </div>
          </>
        )}

        <DialogFooter className="flex flex-col sm:flex-col gap-2">
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={!selectedScheduleId || isSubmitting || !hasAvailableSlots}
            onClick={() => payNowMutation.mutate()}
          >
            {payNowMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CreditCard className="h-4 w-4" />
            )}
            Confirm &amp; Pay Now
          </Button>
          <Button
            variant="outline"
            className="w-full"
            disabled={!selectedScheduleId || isSubmitting || !hasAvailableSlots}
            onClick={() => payLaterMutation.mutate()}
          >
            {payLaterMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Wallet className="h-4 w-4" />
            )}
            Book &amp; Pay Later
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}