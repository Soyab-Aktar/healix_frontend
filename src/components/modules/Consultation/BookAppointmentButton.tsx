"use client";

import { useState } from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import BookAppointmentDialog from "./BookAppointmentDialog";
import { IDoctorScheduleItem } from "@/types/doctor.types";

interface BookAppointmentButtonProps {
  doctorId: string;
  doctorName: string;
  appointmentFee: number;
  doctorSchedules?: IDoctorScheduleItem[];
}

export default function BookAppointmentButton({
  doctorId,
  doctorName,
  appointmentFee,
  doctorSchedules,
}: BookAppointmentButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors shrink-0 h-auto"
      >
        <Calendar className="h-4 w-4" />
        Book Appointment
      </Button>

      <BookAppointmentDialog
        open={open}
        onOpenChange={setOpen}
        doctorId={doctorId}
        doctorName={doctorName}
        appointmentFee={appointmentFee}
        doctorSchedules={doctorSchedules}
      />
    </>
  );
}