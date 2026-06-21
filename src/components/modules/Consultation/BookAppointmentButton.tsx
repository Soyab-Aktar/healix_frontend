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
        className="flex items-center gap-2 bg-[#047857] hover:bg-[#035f43] text-white text-sm font-bold px-5 py-3 rounded-xl transition-all shadow-xs shrink-0 h-auto cursor-pointer border-0"
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