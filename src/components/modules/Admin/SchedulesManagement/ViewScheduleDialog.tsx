"use client"

import { getScheduleByIdAction } from "@/app/(dashboardLayout)/admin/dashboard/schedules-management/_action"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { type ISchedule } from "@/types/schedule.types"
import { useQuery } from "@tanstack/react-query"
import { differenceInMinutes, format } from "date-fns"
import { cn } from "@/lib/utils"

interface ViewScheduleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  schedule: ISchedule | null
}

const formatDateTime = (value?: string | Date | null) => {
  if (!value) {
    return "N/A"
  }

  const dateValue = new Date(value)
  if (Number.isNaN(dateValue.getTime())) {
    return "N/A"
  }

  return format(dateValue, "MMM dd, yyyy hh:mm a")
}

const getDurationLabel = (startDateTime?: string | Date, endDateTime?: string | Date) => {
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

const ViewScheduleDialog = ({
  open,
  onOpenChange,
  schedule,
}: ViewScheduleDialogProps) => {
  const scheduleId = schedule?.id ?? ""

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["schedule-details", scheduleId],
    queryFn: () => getScheduleByIdAction(scheduleId),
    enabled: open && scheduleId.length > 0,
    staleTime: 1000 * 60,
  })

  const hasError = data && !data.success
  const scheduleDetails = data && data.success && 'data' in data
    ? {
      ...schedule,
      ...data.data,
      appointments: data.data.appointments ?? schedule?.appointments,
      doctorSchedules: data.data.doctorSchedules ?? schedule?.doctorSchedules,
    }
    : schedule

  const bookedCount = scheduleDetails?.doctorSchedules?.filter((item) => item.isBooked).length ?? 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-[calc(100vw-1.5rem)] sm:max-w-4xl gap-0 overflow-hidden p-0 border-slate-200/80">
        <DialogHeader className="border-b px-6 py-5 pr-14 bg-slate-50/50">
          <DialogTitle className="text-xl font-extrabold bg-gradient-to-r from-teal-800 to-emerald-700 bg-clip-text text-transparent">Schedule Details</DialogTitle>
          <DialogDescription className="text-slate-500 font-medium">
            Review schedule timing, doctor assignments, and linked appointments.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-5.5rem)]">
          <div className="space-y-6 px-6 py-5">
            {(isLoading || isFetching) && (
              <div className="rounded-xl border border-slate-200 p-4 text-sm text-slate-500 font-medium">
                Loading schedule details...
              </div>
            )}

            {hasError && (
              <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-4 text-sm text-rose-700 font-medium">
                {data.message || "Failed to load schedule details."}
              </div>
            )}

            {!isLoading && !isFetching && scheduleDetails && (
              <>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-xl border border-slate-200/60 p-4 space-y-3 bg-slate-50/15">
                    <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-1.5">Timing</h3>
                    <div className="space-y-2 text-sm text-slate-700">
                      <div className="flex justify-between"><span className="text-slate-400 font-semibold">Schedule ID:</span> <span className="font-mono text-xs font-semibold bg-slate-100 px-1.5 py-0.5 rounded">{scheduleDetails.id}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400 font-semibold">Start:</span> <span className="font-semibold">{formatDateTime(scheduleDetails.startDateTime)}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400 font-semibold">End:</span> <span className="font-semibold">{formatDateTime(scheduleDetails.endDateTime)}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400 font-semibold">Duration:</span> <span className="font-bold text-slate-800">{getDurationLabel(scheduleDetails.startDateTime, scheduleDetails.endDateTime)}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400 font-semibold">Created:</span> <span className="font-medium text-slate-500">{formatDateTime(scheduleDetails.createdAt)}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400 font-semibold">Updated:</span> <span className="font-medium text-slate-500">{formatDateTime(scheduleDetails.updatedAt)}</span></div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-emerald-100/60 p-4 bg-emerald-50/10 flex flex-col justify-between">
                    <div>
                      <h3 className="mb-3 text-sm font-bold text-emerald-800 border-b border-emerald-100/50 pb-1.5">Summary Status</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="border-emerald-300 bg-emerald-50 text-emerald-700 font-semibold">
                          {(scheduleDetails.doctorSchedules?.length ?? 0)} doctor slots
                        </Badge>
                        <Badge variant="outline" className={cn(
                          "font-semibold",
                          bookedCount > 0 ? "border-amber-300 bg-amber-50 text-amber-700" : "border-slate-300 bg-slate-50 text-slate-650"
                        )}>
                          {bookedCount} booked
                        </Badge>
                        <Badge variant="outline" className="border-teal-300 bg-teal-50 text-teal-700 font-semibold">
                          {(scheduleDetails.appointments?.length ?? 0)} appointments
                        </Badge>
                      </div>
                    </div>
                    <div className="text-xs text-slate-400 font-medium mt-4">
                      * Weekly slots are automatically generated in 30-minute intervals.
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-xl border border-slate-200/60 p-4 space-y-3 bg-white">
                    <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-1.5">Doctor Assignments</h3>
                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                      {(scheduleDetails.doctorSchedules ?? []).slice(0, 10).map((item, index) => (
                        <div key={`${item.doctorId}-${index}`} className="flex justify-between items-center rounded-lg border border-slate-100 p-2.5 text-xs hover:bg-slate-50/50 transition-colors">
                          <div>
                            <span className="text-slate-450 block font-semibold mb-0.5">Doctor ID:</span>
                            <span className="font-mono font-semibold text-slate-650">{item.doctorId}</span>
                          </div>
                          <Badge variant="outline" className={cn(
                            "font-semibold rounded-full",
                            item.isBooked ? "border-amber-300 bg-amber-50 text-amber-700" : "border-emerald-300 bg-emerald-50 text-emerald-700"
                          )}>
                            {item.isBooked ? "Booked" : "Available"}
                          </Badge>
                        </div>
                      ))}
                      {!scheduleDetails.doctorSchedules?.length && (
                        <p className="text-sm text-slate-400 italic py-2">No doctor assignments available.</p>
                      )}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200/60 p-4 space-y-3 bg-white">
                    <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-1.5">Appointments</h3>
                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                      {(scheduleDetails.appointments ?? []).slice(0, 10).map((item, index) => (
                        <div key={item.id ?? `appointment-${index}`} className="rounded-lg border border-slate-100 p-2.5 text-xs space-y-1.5 hover:bg-slate-50/50 transition-colors">
                          <div className="flex justify-between items-center">
                            <span className="font-mono font-bold text-slate-800">ID: {item.id ? item.id.substring(0, 8) + "..." : "N/A"}</span>
                            <Badge variant="outline" className="capitalize font-semibold rounded-full">
                              {item.status?.toLowerCase()}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-slate-550 pt-1 border-t border-slate-50">
                            <div>
                              <span className="text-slate-400 block font-semibold">Doctor:</span>
                              <span className="font-bold text-slate-700 truncate block">{item.doctor?.name || "N/A"}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block font-semibold">Patient:</span>
                              <span className="font-bold text-slate-700 truncate block">{item.patient?.name || "N/A"}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      {!scheduleDetails.appointments?.length && (
                        <p className="text-sm text-slate-400 italic py-2">No appointments available in this schedule slot.</p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default ViewScheduleDialog
