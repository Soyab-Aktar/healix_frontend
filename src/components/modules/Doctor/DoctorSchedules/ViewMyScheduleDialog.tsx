"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { type IDoctorSchedule } from "@/types/doctorSchedule.types"
import { differenceInMinutes, format } from "date-fns"
import { Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

interface ViewMyScheduleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  doctorSchedule: IDoctorSchedule | null
}

const formatDateTime = (value?: string | Date) => {
  if (!value) {
    return "N/A"
  }

  const dateValue = new Date(value)
  if (Number.isNaN(dateValue.getTime())) {
    return "N/A"
  }

  return format(dateValue, "MMM dd, yyyy hh:mm a")
}

const getDurationLabel = (doctorSchedule: IDoctorSchedule | null) => {
  const startDateTime = doctorSchedule?.schedule?.startDateTime
  const endDateTime = doctorSchedule?.schedule?.endDateTime

  if (!startDateTime || !endDateTime) {
    return "N/A"
  }

  const startDate = new Date(startDateTime)
  const endDate = new Date(endDateTime)

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return "N/A"
  }

  const durationInMinutes = differenceInMinutes(endDate, startDate)
  return durationInMinutes > 0 ? `${durationInMinutes} mins` : "N/A"
}

const ViewMyScheduleDialog = ({
  open,
  onOpenChange,
  doctorSchedule,
}: ViewMyScheduleDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-[calc(100vw-1.5rem)] max-w-xl gap-0 p-0 overflow-hidden border-slate-200/80">
        <DialogHeader className="px-6 py-5 border-b shrink-0 bg-slate-50/50">
          <DialogTitle className="text-xl font-extrabold flex items-center gap-2.5 text-slate-800">
            <Calendar className="h-5.5 w-5.5 text-[#047857]" />
            <span className="bg-gradient-to-r from-teal-800 to-emerald-700 bg-clip-text text-transparent">My Schedule Details</span>
          </DialogTitle>
          <DialogDescription className="px-1 text-slate-500 font-medium">
            Review your assigned schedule slot information.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-5 space-y-4">
          <div className="rounded-xl border border-slate-200/60 bg-slate-50/15 p-5 space-y-3.5 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-semibold">Schedule ID</span>
              <span className="font-mono text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded truncate max-w-[180px]" title={doctorSchedule?.scheduleId ?? "N/A"}>
                {doctorSchedule?.scheduleId ?? "N/A"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-semibold">Start Time</span>
              <span className="font-semibold text-slate-700">{formatDateTime(doctorSchedule?.schedule?.startDateTime)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-semibold">End Time</span>
              <span className="font-semibold text-slate-700">{formatDateTime(doctorSchedule?.schedule?.endDateTime)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-semibold">Duration</span>
              <span className="font-semibold text-slate-750">{getDurationLabel(doctorSchedule)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-semibold">Booked by Patient</span>
              <span className={cn(
                "font-bold text-xs rounded-full px-2.5 py-0.5 border",
                doctorSchedule?.isBooked
                  ? "bg-amber-50 text-amber-700 border-amber-100"
                  : "bg-emerald-50 text-emerald-700 border-emerald-100"
              )}>
                {doctorSchedule?.isBooked ? "Yes" : "No"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-semibold">Assigned On</span>
              <span className="font-semibold text-slate-700">{formatDateTime(doctorSchedule?.createdAt)}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ViewMyScheduleDialog
