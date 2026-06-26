"use client"

import { createMyDoctorScheduleAction } from "@/app/(dashboardLayout)/doctor/dashboard/my-schedules/_action"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { getMyDoctorSchedules } from "@/services/doctorSchedule.services"
import { getSchedules } from "@/services/schedule.services"
import { type IDoctorSchedule } from "@/types/doctorSchedule.types"
import { type ISchedule } from "@/types/schedule.types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { CalendarPlus, Calendar, Clock, Loader2, Check, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const getTodayStartIsoString = () => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today.toISOString()
}

const formatTimeRange = (start: string | Date, end: string | Date) => {
  const startDate = new Date(start)
  const endDate = new Date(end)
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return "Invalid time"
  }
  return `${format(startDate, "hh:mm a")} - ${format(endDate, "hh:mm a")}`
}

const BookScheduleModal = () => {
  const [open, setOpen] = useState(false)
  const [selectedScheduleIds, setSelectedScheduleIds] = useState<string[]>([])
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null)

  const queryClient = useQueryClient()
  const router = useRouter()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createMyDoctorScheduleAction,
  })

  const futureSchedulesQueryString = useMemo(() => {
    const params = new URLSearchParams()
    params.set("page", "1")
    params.set("limit", "500")
    params.set("sortBy", "startDateTime")
    params.set("sortOrder", "asc")
    params.set("startDateTime[gte]", getTodayStartIsoString())
    return params.toString()
  }, [])

  const { data: schedulesResponse, isLoading: isLoadingSchedules } = useQuery({
    queryKey: ["bookable-schedules", futureSchedulesQueryString],
    queryFn: () => getSchedules(futureSchedulesQueryString),
    enabled: open,
    staleTime: 1000 * 60,
  })

  const { data: mySchedulesResponse, isLoading: isLoadingMySchedules } = useQuery({
    queryKey: ["my-doctor-schedules", "book-modal"] as const,
    queryFn: () => getMyDoctorSchedules("page=1&limit=1000"),
    enabled: open,
    staleTime: 1000 * 30,
  })

  const availableSchedules = useMemo<ISchedule[]>(() => {
    const now = new Date()
    const allFutureSchedules = (schedulesResponse?.data ?? []).filter((item) => {
      const startDateTime = new Date(item.startDateTime)
      return !Number.isNaN(startDateTime.getTime()) && startDateTime >= now
    })

    const existingScheduleIds = new Set(
      (mySchedulesResponse?.data ?? []).map((item: IDoctorSchedule) => item.scheduleId),
    )

    return allFutureSchedules.filter((item) => !existingScheduleIds.has(item.id))
  }, [mySchedulesResponse?.data, schedulesResponse?.data])

  // Group schedules by Date (Chronological)
  const groupedSchedules = useMemo(() => {
    const groups: Record<string, { date: Date; dateStr: string; label: string; slots: ISchedule[] }> = {}
    for (const schedule of availableSchedules) {
      const date = new Date(schedule.startDateTime)
      if (Number.isNaN(date.getTime())) continue
      const dateStr = format(date, "yyyy-MM-dd")
      if (!groups[dateStr]) {
        groups[dateStr] = {
          date,
          dateStr,
          label: format(date, "eeee, MMMM d, yyyy"),
          slots: [],
        }
      }
      groups[dateStr].slots.push(schedule)
    }

    const result = Object.values(groups).sort((a, b) => a.dateStr.localeCompare(b.dateStr))
    for (const group of result) {
      group.slots.sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime())
    }
    return result
  }, [availableSchedules])

  const activeDateStr = selectedDateStr || (groupedSchedules[0]?.dateStr ?? null)
  const activeGroup = useMemo(() => {
    return groupedSchedules.find((g) => g.dateStr === activeDateStr) || groupedSchedules[0] || null
  }, [groupedSchedules, activeDateStr])

  const activeDateSlotsIds = activeGroup ? activeGroup.slots.map((s) => s.id) : []
  const isAllSelectedOnActiveDate =
    activeGroup && activeDateSlotsIds.length > 0 && activeDateSlotsIds.every((id) => selectedScheduleIds.includes(id))

  const toggleSelectAllActiveDate = () => {
    if (!activeGroup) return
    if (isAllSelectedOnActiveDate) {
      setSelectedScheduleIds((prev) => prev.filter((id) => !activeDateSlotsIds.includes(id)))
    } else {
      setSelectedScheduleIds((prev) => {
        const toAdd = activeDateSlotsIds.filter((id) => !prev.includes(id))
        return [...prev, ...toAdd]
      })
    }
  }

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)

    if (!nextOpen) {
      setSelectedScheduleIds([])
      setSelectedDateStr(null)
    }
  }

  const toggleScheduleSelection = (scheduleId: string, checked: boolean) => {
    setSelectedScheduleIds((prev) => {
      if (checked) {
        if (prev.includes(scheduleId)) {
          return prev
        }
        return [...prev, scheduleId]
      }
      return prev.filter((id) => id !== scheduleId)
    })
  }

  const clearAllSelections = () => {
    setSelectedScheduleIds([])
  }

  const handleBookSchedules = async () => {
    if (selectedScheduleIds.length === 0) {
      toast.error("Please select at least one schedule")
      return
    }

    try {
      const result = await mutateAsync({ scheduleIds: selectedScheduleIds })

      if (!result.success) {
        toast.error(result.message || "Failed to book schedules")
        return
      }

      toast.success(result.message || "Schedules booked successfully")
      setOpen(false)
      setSelectedScheduleIds([])
      setSelectedDateStr(null)

      void queryClient.invalidateQueries({ queryKey: ["my-doctor-schedules"] })
      void queryClient.refetchQueries({ queryKey: ["my-doctor-schedules"], type: "active" })
      router.refresh()
    } catch (error) {
      toast.error("Something went wrong. Please try again.")
    }
  }

  const isLoading = isLoadingSchedules || isLoadingMySchedules

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button type="button" className="ml-auto shrink-0 bg-[#047857] hover:bg-[#035f43] text-white hover:text-white rounded-lg font-bold gap-1.5 transition-colors cursor-pointer">
          <CalendarPlus className="size-4" />
          Book Schedule
        </Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-4xl h-[600px] max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden rounded-[24px]"
        onInteractOutside={(event) => event.preventDefault()}
        onEscapeKeyDown={(event) => event.preventDefault()}
      >
        <DialogHeader className="border-b px-6 py-4 pr-14 shrink-0 bg-white">
          <div className="flex items-center gap-2 mb-0.5">
            <CalendarPlus className="h-5 w-5 text-emerald-600 fill-emerald-600/10" />
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-[#0d9488] to-[#047857] bg-clip-text text-transparent">
              Book Schedules
            </DialogTitle>
          </div>
          <DialogDescription className="text-slate-500 font-medium">
            Select available schedule slots from today onwards.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {isLoading && (
            <div className="flex-1 flex flex-col items-center justify-center py-10 text-center bg-white">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mb-2" />
              <p className="text-sm font-semibold text-slate-600">Loading available slots...</p>
            </div>
          )}

          {!isLoading && availableSchedules.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white m-6 border border-dashed border-slate-200 rounded-2xl">
              <Calendar className="h-10 w-10 text-slate-300 mb-2" />
              <p className="text-sm font-bold text-slate-700">No schedules available</p>
              <p className="text-xs text-slate-400 mt-1">There are no available admin-created slots from today onward.</p>
            </div>
          )}

          {!isLoading && availableSchedules.length > 0 && (
            <div className="flex flex-col sm:flex-row flex-1 min-h-0 overflow-hidden divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
              {/* Left Pane: Date tabs */}
              <div className="flex flex-row sm:flex-col overflow-x-auto sm:overflow-y-auto sm:w-1/3 sm:min-w-[240px] bg-slate-50/50 p-4 gap-2.5 shrink-0 select-none">
                {groupedSchedules.map((g) => {
                  const isSelected = activeGroup?.dateStr === g.dateStr
                  const slotsSelectedCount = g.slots.filter((s) => selectedScheduleIds.includes(s.id)).length

                  const monthLabel = format(g.date, "MMM").toUpperCase()
                  const dayLabel = format(g.date, "d")
                  const weekdayLabel = format(g.date, "EEE")

                  return (
                    <button
                      key={g.dateStr}
                      type="button"
                      onClick={() => setSelectedDateStr(g.dateStr)}
                      className={cn(
                        "flex items-center text-left gap-3 rounded-xl border p-2.5 transition-all duration-200 shrink-0 sm:shrink cursor-pointer",
                        isSelected
                          ? "border-emerald-500 bg-emerald-50/40 shadow-sm ring-1 ring-emerald-500/30 font-semibold"
                          : "border-slate-200/60 bg-white hover:border-slate-350 hover:bg-slate-50"
                      )}
                    >
                      {/* Calendar Card Graphic */}
                      <div className={cn(
                        "w-12 h-12 flex flex-col rounded-lg border overflow-hidden shadow-xs shrink-0 items-center justify-between",
                        isSelected ? "border-emerald-200" : "border-slate-200"
                      )}>
                        <div className={cn(
                          "w-full text-[9px] font-extrabold text-center py-0.5 border-b uppercase tracking-wider",
                          isSelected ? "bg-emerald-500 text-white border-emerald-500" : "bg-slate-100 text-slate-500 border-slate-200"
                        )}>
                          {monthLabel}
                        </div>
                        <div className="flex-1 flex flex-col justify-center items-center bg-white leading-none">
                          <span className={cn("text-sm font-extrabold", isSelected ? "text-emerald-950" : "text-slate-800")}>{dayLabel}</span>
                          <span className="text-[8px] text-slate-400 font-semibold">{weekdayLabel}</span>
                        </div>
                      </div>

                      {/* Texts */}
                      <div className="flex-1 min-w-0 pr-1">
                        <p className={cn("text-xs font-bold truncate leading-snug", isSelected ? "text-emerald-950" : "text-slate-700")}>
                          {weekdayLabel}, {format(g.date, "MMMM d")}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] font-semibold text-slate-400">
                            {g.slots.length} slots
                          </span>
                          {slotsSelectedCount > 0 && (
                            <span className="inline-flex items-center justify-center size-4 text-[9px] font-bold text-white bg-emerald-600 rounded-full">
                              {slotsSelectedCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Right Pane: Slots for selected date */}
              <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-white">
                {activeGroup ? (
                  <>
                    {/* Active Date Header & Action Bar */}
                    <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/20 flex flex-wrap items-center justify-between gap-3 shrink-0">
                      <div>
                        <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
                          <Calendar className="h-4 w-4 text-emerald-600" />
                          {activeGroup.label}
                        </h3>
                        <p className="text-[11px] text-slate-400 font-medium">
                          Select time slots for consultation on this date.
                        </p>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        onClick={toggleSelectAllActiveDate}
                        className={cn(
                          "h-8 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer",
                          isAllSelectedOnActiveDate
                            ? "bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/50"
                            : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-100"
                        )}
                      >
                        {isAllSelectedOnActiveDate ? "Deselect All" : "Select All"}
                      </Button>
                    </div>

                    {/* Scrollable Slots Grid */}
                    <div className="flex-1 overflow-y-auto p-6">
                      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                        {activeGroup.slots.map((schedule) => {
                          const checked = selectedScheduleIds.includes(schedule.id)
                          return (
                            <label
                              key={schedule.id}
                              className={cn(
                                "flex cursor-pointer items-center justify-between rounded-xl border p-3.5 text-sm transition-all duration-200 select-none",
                                checked
                                  ? "border-emerald-500 bg-emerald-50/20 shadow-xs ring-1 ring-emerald-500/20"
                                  : "border-slate-200 bg-white hover:border-emerald-350 hover:bg-slate-50/50 text-slate-700"
                              )}
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={(e) => toggleScheduleSelection(schedule.id, e.target.checked)}
                                className="sr-only"
                              />
                              <div className="flex items-center gap-2.5">
                                <Clock className={cn("h-4 w-4 shrink-0", checked ? "text-emerald-600" : "text-slate-400")} />
                                <span className={cn("text-sm font-bold tracking-tight", checked ? "text-emerald-950 font-bold" : "text-slate-700")}>
                                  {formatTimeRange(schedule.startDateTime, schedule.endDateTime)}
                                </span>
                              </div>

                              {/* Custom checkbox indicator */}
                              <div className={cn(
                                "h-5 w-5 rounded-full flex items-center justify-center border transition-all duration-200",
                                checked
                                  ? "bg-emerald-600 border-emerald-600 text-white"
                                  : "border-slate-300 bg-white"
                              )}>
                                {checked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                              </div>
                            </label>
                          )
                        })}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-400">
                    <AlertCircle className="h-8 w-8 text-slate-300 mb-2" />
                    <p className="text-sm font-semibold">No date selected</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="border-t px-6 py-4 flex flex-row items-center justify-end gap-3 bg-slate-50 shrink-0 select-none">
          {selectedScheduleIds.length > 0 && (
            <div className="mr-auto hidden sm:flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg">
                {selectedScheduleIds.length} slot{selectedScheduleIds.length > 1 ? "s" : ""} selected
              </span>
              <button
                type="button"
                onClick={clearAllSelections}
                className="text-xs text-slate-400 hover:text-slate-600 font-bold transition-colors cursor-pointer"
              >
                Clear selection
              </button>
            </div>
          )}

          <DialogClose asChild>
            <Button type="button" variant="outline" className="rounded-lg font-bold border-slate-350 text-slate-700 hover:bg-slate-100 transition-colors" disabled={isPending}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={() => void handleBookSchedules()}
            disabled={isPending || selectedScheduleIds.length === 0}
            className="bg-[#047857] hover:bg-[#035f43] text-white hover:text-white rounded-lg font-bold transition-colors cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Booking...
              </>
            ) : (
              `Book Selected (${selectedScheduleIds.length})`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default BookScheduleModal
