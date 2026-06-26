"use client"

import { getDoctorByIdAction } from "@/app/(dashboardLayout)/admin/dashboard/doctors-management/_action"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { type IDoctor, type IDoctorDetails, type IDoctorSpecialty } from "@/types/doctor.types"
import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import {
  Mail,
  Phone,
  Calendar,
  Star,
  Shield,
  Award,
  Briefcase,
  MapPin,
  User,
  GraduationCap,
  DollarSign,
  Clock,
  CheckCircle2,
  XCircle,
  UserCheck
} from "lucide-react"

interface ViewDoctorProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  doctor: IDoctor | null
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

const getAverageRating = (reviews: IDoctorDetails["reviews"]) => {
  if (!reviews || reviews.length === 0) {
    return 0
  }

  const totalRating = reviews.reduce((sum, review) => sum + (review.rating ?? 0), 0)
  return totalRating / reviews.length
}

const getSpecialtyData = (specialtyItem: NonNullable<IDoctorDetails["specialties"]>[number]): IDoctorSpecialty => {
  return "specialty" in specialtyItem ? specialtyItem.specialty : specialtyItem
}

const renderStars = (rating: number) => {
  const stars = []
  const roundedRating = Math.round(rating)
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Star
        key={i}
        className={cn(
          "size-4 shrink-0",
          i <= roundedRating ? "fill-amber-400 text-amber-400" : "text-slate-200"
        )}
      />
    )
  }
  return <div className="flex gap-0.5">{stars}</div>
}

const ViewDoctorProfileDialog = ({
  open,
  onOpenChange,
  doctor,
}: ViewDoctorProfileDialogProps) => {
  const doctorId = doctor ? String(doctor.id) : ""

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["doctor-details", doctorId],
    queryFn: () => getDoctorByIdAction(doctorId),
    enabled: open && doctorId.length > 0,
    staleTime: 1000 * 60,
  })

  const hasError = Boolean(data && !("data" in data))
  const doctorDetails = data && "data" in data ? data.data : null
  const errorMessage = data && !("data" in data) ? data.message : "Failed to load doctor details."

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[90vh] w-[calc(100vw-1.5rem)] max-w-[calc(100vw-1.5rem)] gap-0 overflow-hidden p-0 sm:w-[calc(100vw-3rem)] sm:max-w-[calc(100vw-3rem)] md:w-[calc(100vw-4rem)] md:max-w-[calc(100vw-4rem)] lg:w-[min(92vw,78rem)] lg:max-w-[min(92vw,78rem)] xl:w-[min(88vw,88rem)] xl:max-w-[min(88vw,88rem)] 2xl:w-[min(84vw,96rem)] 2xl:max-w-[min(84vw,96rem)] rounded-[24px] border border-slate-200/60 shadow-lg"
      >
        <DialogHeader className="border-b bg-slate-50/50 px-6 py-5 pr-14">
          <DialogTitle className="text-xl font-extrabold text-slate-800">Doctor Profile</DialogTitle>
          <DialogDescription className="text-slate-405 font-medium text-sm">
            Comprehensive profile view with doctor info, user credentials, schedules, and patient reviews.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-6.5rem)]">
          <div className="px-6 py-6 space-y-6">
            {(isLoading || isFetching) && (
              <div className="flex flex-col items-center justify-center py-12 space-y-3">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#047857] border-t-transparent" />
                <p className="text-sm font-semibold text-slate-500">Loading doctor details...</p>
              </div>
            )}

            {hasError && (
              <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-4 text-sm font-semibold text-rose-700 flex items-center gap-2">
                <XCircle className="size-5 text-rose-600 shrink-0" />
                {errorMessage}
              </div>
            )}

            {!isLoading && !isFetching && doctorDetails && (
              <>
                {/* Profile Header Summary Card */}
                <div className="rounded-[20px] bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-slate-100 p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
                  {/* Photo Section */}
                  <div className="relative w-24 h-24 rounded-[20px] border-2 border-white shadow-md overflow-hidden shrink-0 bg-slate-50 flex items-center justify-center">
                    {doctorDetails.profilePhoto ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={doctorDetails.profilePhoto}
                        alt={doctorDetails.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="size-10 text-slate-400" />
                    )}
                  </div>

                  {/* Title & Specialties */}
                  <div className="flex-1 text-center md:text-left space-y-2">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 justify-center md:justify-start">
                      <h2 className="text-2xl font-extrabold text-slate-800">{doctorDetails.name}</h2>
                      <div className="flex items-center justify-center gap-1.5 mt-1 md:mt-0">
                        <Badge variant="secondary" className="bg-[#047857]/10 text-[#047857] hover:bg-[#047857]/15 border-transparent font-bold capitalize text-xs">
                          {doctorDetails.gender?.toLowerCase()}
                        </Badge>
                        <Badge variant="outline" className={cn(
                          "font-bold capitalize text-xs",
                          doctorDetails.user?.status === "ACTIVE" 
                            ? "bg-emerald-50 text-emerald-700 border-emerald-250" 
                            : "bg-rose-50 text-rose-700 border-rose-250"
                        )}>
                          {doctorDetails.user?.status?.toLowerCase()}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-sm font-bold text-slate-600 flex items-center justify-center md:justify-start gap-1">
                      <Briefcase className="size-4 text-[#047857]" />
                      {doctorDetails.designation} at <span className="text-slate-800">{doctorDetails.currentWorkingPlace}</span>
                    </p>

                    <div className="flex flex-wrap gap-1.5 justify-center md:justify-start pt-1">
                      {doctorDetails.specialties?.length ? (
                        doctorDetails.specialties.map((item: NonNullable<IDoctorDetails["specialties"]>[number]) => {
                          const specialty = getSpecialtyData(item)
                          return (
                            <Badge key={specialty.id} className="bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 font-bold text-xs rounded-full py-0.5 px-3.5">
                              {specialty.title}
                            </Badge>
                          )
                        })
                      ) : (
                        <span className="text-xs text-slate-400 font-medium italic">No specialties</span>
                      )}
                    </div>
                  </div>

                  {/* Rating / Fee summary card */}
                  <div className="bg-white/80 backdrop-blur-xs rounded-xl p-4 border border-slate-200/50 shadow-2xs self-center w-full md:w-auto grid grid-cols-2 md:grid-cols-1 gap-2 md:gap-3 text-center md:text-left">
                    <div>
                      <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Rating</span>
                      <div className="flex items-center justify-center md:justify-start gap-1.5 mt-0.5">
                        {renderStars(getAverageRating(doctorDetails.reviews))}
                        <span className="text-xs font-extrabold text-slate-750">
                          ({getAverageRating(doctorDetails.reviews).toFixed(1)})
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Appointment Fee</span>
                      <span className="text-lg font-black text-slate-800 mt-0.5 flex items-center justify-center md:justify-start gap-0.5">
                        <DollarSign className="size-4.5 text-[#047857]" />
                        {doctorDetails.appointmentFee}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Information Sections Grid */}
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Personal & Contact details */}
                  <div className="rounded-[20px] border border-slate-200/60 p-5 bg-white space-y-4 shadow-2xs">
                    <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2.5 flex items-center gap-2">
                      <User className="size-4 text-[#047857]" /> Personal & Contact Info
                    </h3>
                    <div className="space-y-3.5 text-sm font-semibold text-slate-750">
                      <div className="flex justify-between items-center py-0.5 border-b border-slate-50">
                        <span className="text-slate-400">Email Address</span>
                        <a href={`mailto:${doctorDetails.email}`} className="text-slate-800 hover:text-[#047857] hover:underline flex items-center gap-1.5">
                          <Mail className="size-4 text-slate-400" />
                          {doctorDetails.email || "N/A"}
                        </a>
                      </div>
                      <div className="flex justify-between items-center py-0.5 border-b border-slate-50">
                        <span className="text-slate-400">Contact Number</span>
                        <span className="text-slate-800 flex items-center gap-1.5">
                          <Phone className="size-4 text-slate-400" />
                          {doctorDetails.contactNumber || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-0.5 border-b border-slate-50">
                        <span className="text-slate-400">Gender</span>
                        <span className="text-slate-800">{doctorDetails.gender || "N/A"}</span>
                      </div>
                      <div className="flex justify-between items-start py-0.5">
                        <span className="text-slate-400 shrink-0">Residential Address</span>
                        <span className="text-slate-800 text-right max-w-[200px] break-words flex items-start gap-1 justify-end">
                          <MapPin className="size-4 text-slate-400 shrink-0 mt-0.5" />
                          {doctorDetails.address || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Professional & Clinical Info */}
                  <div className="rounded-[20px] border border-slate-200/60 p-5 bg-white space-y-4 shadow-2xs">
                    <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2.5 flex items-center gap-2">
                      <Award className="size-4 text-[#047857]" /> Professional Credentials
                    </h3>
                    <div className="space-y-3.5 text-sm font-semibold text-slate-750">
                      <div className="flex justify-between items-center py-0.5 border-b border-slate-50">
                        <span className="text-slate-400">Qualification</span>
                        <span className="text-slate-800 flex items-center gap-1.5">
                          <GraduationCap className="size-4 text-[#047857]" />
                          {doctorDetails.qualification || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-0.5 border-b border-slate-50">
                        <span className="text-slate-400">Registration Number</span>
                        <span className="text-slate-800 font-mono text-xs bg-slate-50 border border-slate-150 px-2 py-0.5 rounded-md">
                          {doctorDetails.registrationNumber || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-0.5 border-b border-slate-50">
                        <span className="text-slate-400">Professional Experience</span>
                        <span className="text-slate-800">{doctorDetails.experience ?? 0} Years</span>
                      </div>
                      <div className="flex justify-between items-start py-0.5">
                        <span className="text-slate-400 shrink-0">Current Workplace</span>
                        <span className="text-slate-800 text-right max-w-[200px] break-words">{doctorDetails.currentWorkingPlace || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* System Account & Verification Info */}
                <div className="rounded-[20px] border border-slate-200/60 p-5 bg-white space-y-4 shadow-2xs">
                  <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2.5 flex items-center gap-2">
                    <Shield className="size-4 text-[#047857]" /> System Account Credentials
                  </h3>
                  <div className="grid gap-6 md:grid-cols-2 text-sm font-semibold text-slate-750">
                    <div className="space-y-3.5">
                      <div className="flex justify-between items-center py-0.5 border-b border-slate-50">
                        <span className="text-slate-400">User ID</span>
                        <span className="text-slate-850 font-mono text-xs">{doctorDetails.user?.id || "N/A"}</span>
                      </div>
                      <div className="flex justify-between items-center py-0.5 border-b border-slate-50">
                        <span className="text-slate-400">System Username</span>
                        <span className="text-slate-850 flex items-center gap-1.5">
                          <UserCheck className="size-4 text-slate-400" />
                          {doctorDetails.user?.name || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-slate-400">System Role</span>
                        <Badge className="bg-slate-50 text-slate-700 border-slate-200 font-extrabold text-xs">
                          {doctorDetails.user?.role || "N/A"}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-3.5">
                      <div className="flex justify-between items-center py-0.5 border-b border-slate-50">
                        <span className="text-slate-400">Email Verification</span>
                        {doctorDetails.user?.emailVerified ? (
                          <span className="text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="size-4 text-emerald-600" /> Verified
                          </span>
                        ) : (
                          <span className="text-rose-700 flex items-center gap-1">
                            <XCircle className="size-4 text-rose-600" /> Unverified
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between items-center py-0.5 border-b border-slate-50">
                        <span className="text-slate-400">Registered On</span>
                        <span>{formatDateTime(doctorDetails.user?.createdAt)}</span>
                      </div>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-slate-400">Last Updated On</span>
                        <span>{formatDateTime(doctorDetails.user?.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Schedules & Reviews Sections */}
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Schedules Summary */}
                  <div className="rounded-[20px] border border-slate-200/60 p-5 bg-white space-y-4 shadow-2xs">
                    <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2.5 flex items-center gap-2">
                      <Calendar className="size-4 text-[#047857]" /> Doctor Schedules
                    </h3>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                      {doctorDetails.doctorSchedules?.length ? (
                        doctorDetails.doctorSchedules.slice(0, 5).map((item: NonNullable<IDoctorDetails["doctorSchedules"]>[number], index: number) => (
                          <div key={item.id ?? item.schedule?.id ?? `schedule-${index}`} className="flex items-center justify-between p-3 border border-slate-100 rounded-[14px] bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200 transition-all text-xs font-semibold">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 text-slate-700">
                                <Clock className="size-3.5 text-slate-450 shrink-0" />
                                <span>{formatDateTime(item.schedule?.startDateTime)}</span>
                              </div>
                              <p className="text-[10px] text-slate-400 pl-5">Expires: {formatDateTime(item.schedule?.endDateTime)}</p>
                            </div>
                            <Badge className={cn(
                              "font-bold text-[10px] rounded-full px-2 py-0.5 border-transparent",
                              item.isBooked 
                                ? "bg-rose-50 text-rose-700 hover:bg-rose-100/50" 
                                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100/50"
                            )}>
                              {item.isBooked ? "Booked" : "Available"}
                            </Badge>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-400 italic font-medium py-2">No schedules slots registered.</p>
                      )}
                    </div>
                  </div>

                  {/* Reviews Summary */}
                  <div className="rounded-[20px] border border-slate-200/60 p-5 bg-white space-y-4 shadow-2xs">
                    <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2.5 flex items-center gap-2">
                      <Star className="size-4 text-[#047857]" /> Patient Reviews
                    </h3>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                      {doctorDetails.reviews?.length ? (
                        doctorDetails.reviews.slice(0, 4).map((review: NonNullable<IDoctorDetails["reviews"]>[number], index: number) => (
                          <div key={review.id ?? `review-${index}`} className="p-3 border border-slate-100 rounded-[14px] bg-slate-50/50 space-y-2 hover:border-slate-200 hover:bg-slate-50 transition-all">
                            <div className="flex items-center justify-between">
                              {renderStars(review.rating ?? 0)}
                              <span className="text-[10px] text-slate-400 font-bold">{formatDateTime(review.createdAt)}</span>
                            </div>
                            <p className="text-xs font-semibold text-slate-650 italic leading-relaxed">
                              "{review.comment || "No written review comments"}"
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-400 italic font-medium py-2">No reviews submitted yet.</p>
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

export default ViewDoctorProfileDialog
