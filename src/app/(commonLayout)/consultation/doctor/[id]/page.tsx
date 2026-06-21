import BookAppointmentModal from "@/components/modules/Patient/Appointments/BookAppointmentModal";
import { getUserinfo } from "@/services/auth.services";
import { getDoctorById } from "@/services/doctor.services";
import { type IDoctorDetails } from "@/types/doctor.types";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Star,
  Briefcase,
  IndianRupee,
  ShieldCheck,
  GraduationCap,
  MapPin,
  Mail,
  Phone,
  Calendar,
  User,
  Clock3,
  Stethoscope,
  Award,
} from "lucide-react";

const formatDateTime = (value?: string | Date | null) => {
  if (!value) {
    return "N/A";
  }

  const dateValue = new Date(value);
  if (Number.isNaN(dateValue.getTime())) {
    return "N/A";
  }

  return format(dateValue, "MMM dd, yyyy hh:mm a");
};

const getInitials = (name?: string) => {
  if (!name) {
    return "DR";
  }

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((item) => item[0]?.toUpperCase() ?? "")
    .join("");
};

const getTodayStart = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

const ConsultationDoctorByIdPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const currentUser = await getUserinfo();

  let doctorDetails: IDoctorDetails | null = null;
  let errorMessage = "";

  try {
    const response = await getDoctorById(id);
    doctorDetails = response.data;
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "response" in error &&
      error.response &&
      typeof error.response === "object" &&
      "data" in error.response &&
      error.response.data &&
      typeof error.response.data === "object" &&
      "message" in error.response.data &&
      typeof error.response.data.message === "string"
    ) {
      errorMessage = error.response.data.message;
    } else {
      errorMessage = "Failed to load doctor details";
    }
  }

  if (!doctorDetails) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <Link
          href="/consultation"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-emerald-700 transition-colors group mb-2"
        >
          <ChevronLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Consultation
        </Link>
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive font-medium shadow-xs">
          {errorMessage || "Doctor details not available."}
        </div>
      </section>
    );
  }

  const todayStart = getTodayStart();

  const availableUpcomingSchedules = (doctorDetails.doctorSchedules ?? [])
    .filter((item) => {
      if (item.isBooked) {
        return false;
      }

      if (!item.schedule?.startDateTime) {
        return false;
      }

      const startDate = new Date(item.schedule.startDateTime);
      if (Number.isNaN(startDate.getTime())) {
        return false;
      }

      return startDate >= todayStart;
    })
    .sort((a, b) => {
      const leftValue = new Date(a.schedule?.startDateTime ?? 0).getTime();
      const rightValue = new Date(b.schedule?.startDateTime ?? 0).getTime();
      return leftValue - rightValue;
    });

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Back button */}
      <Link
        href="/consultation"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-emerald-700 transition-colors group"
      >
        <ChevronLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to Consultation
      </Link>

      {/* Hero Profile Banner Card */}
      <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white p-8 md:p-10 shadow-xs">
        {/* Background Decorative Blurs */}
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 -ml-16 -mb-16 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left relative z-10">
          {/* Squircle Avatar Container */}
          <div className="relative shrink-0">
            <div className="relative w-28 h-28 rounded-[24px] overflow-hidden bg-emerald-50 border border-slate-100 shadow-md">
              {doctorDetails.profilePhoto ? (
                <Image
                  src={doctorDetails.profilePhoto}
                  alt={doctorDetails.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-emerald-600 font-extrabold text-4xl bg-emerald-50">
                  {getInitials(doctorDetails.name)}
                </div>
              )}
            </div>
            {/* Verified Check Badge */}
            <div className="absolute -bottom-1.5 -left-1.5 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg border border-slate-50">
              <div className="w-6.5 h-6.5 rounded-full bg-emerald-50 flex items-center justify-center">
                <ShieldCheck className="h-4.5 w-4.5 text-[#047857] fill-[#047857]/10" />
              </div>
            </div>
          </div>

          {/* Doctor Meta Info */}
          <div className="flex-1 min-w-0 space-y-4">
            <div className="space-y-1.5">
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {doctorDetails.name}
              </h1>
              <p className="text-sm font-bold text-emerald-700 uppercase tracking-wider">
                {doctorDetails.designation || "Specialist Doctor"}
              </p>
              <p className="text-sm text-slate-500 font-medium">
                {doctorDetails.currentWorkingPlace || "Healix Partner Hospital"}
              </p>
            </div>

            {/* Specialties Badges */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              {(doctorDetails.specialties ?? []).map((item) => (
                <span
                  key={item.specialty.id}
                  className="inline-flex items-center gap-1.5 text-xs bg-[#eefcf7] text-[#047857] px-3.5 py-1.5 rounded-full font-semibold border border-emerald-100/30"
                >
                  <Stethoscope className="h-3.5 w-3.5 text-emerald-600" />
                  {item.specialty.title}
                </span>
              ))}
              {(!doctorDetails.specialties || doctorDetails.specialties.length === 0) && (
                <span className="text-xs bg-slate-50 text-slate-500 px-3 py-1.5 rounded-full font-semibold border border-slate-100">
                  No specialties listed
                </span>
              )}
            </div>

            {/* Metrics cards row */}
            <div className="grid grid-cols-3 max-w-sm mx-auto md:mx-0 gap-3 pt-1">
              <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-3 text-center">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Exp</div>
                <div className="text-sm font-extrabold text-slate-800">{doctorDetails.experience ?? 0} yrs</div>
              </div>
              <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-3 text-center">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Rating</div>
                <div className="text-sm font-extrabold text-slate-800 flex items-center justify-center gap-1">
                  <Star className="h-3.5 w-3.5 text-emerald-600 fill-emerald-600" />
                  <span>{doctorDetails.averageRating?.toFixed(1) ?? "0.0"}</span>
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-3 text-center">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Fee</div>
                <div className="text-sm font-extrabold text-slate-800">₹{doctorDetails.appointmentFee ?? 0}</div>
              </div>
            </div>

            {/* CTA Button Wrapper */}
            <div className="pt-2 flex justify-center md:justify-start">
              <BookAppointmentModal
                doctorId={String(doctorDetails.id)}
                doctorName={doctorDetails.name}
                isAuthenticated={Boolean(currentUser)}
                viewerRole={currentUser?.role ?? null}
                triggerClassName="bg-[#047857] hover:bg-[#035f43] text-white text-sm font-bold px-6 py-3 h-auto rounded-xl shadow-xs border-0 transition-colors flex items-center gap-2 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Grid Content Split Area */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left main info column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Professional Information Card */}
          <div className="bg-white border border-slate-200 rounded-[24px] p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2.5">
              <Award className="h-5 w-5 text-emerald-600" />
              Professional Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-1">
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Qualification</div>
                <div className="text-slate-800 font-semibold">{doctorDetails.qualification || "N/A"}</div>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-1">
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Registration Number</div>
                <div className="text-slate-800 font-semibold">{doctorDetails.registrationNumber || "N/A"}</div>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-1">
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Designation</div>
                <div className="text-slate-800 font-semibold">{doctorDetails.designation || "N/A"}</div>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-1">
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Practice Years</div>
                <div className="text-slate-800 font-semibold">{doctorDetails.experience ?? 0} years experience</div>
              </div>
            </div>
          </div>

          {/* Schedules Card */}
          <div className="bg-white border border-slate-200 rounded-[24px] p-6 sm:p-8 shadow-xs">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2.5">
                <Calendar className="h-5 w-5 text-emerald-600" />
                Available Doctor Schedules
              </h2>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100/50">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                Today onward
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {availableUpcomingSchedules.slice(0, 18).map((item, index) => (
                <div
                  key={item.id ?? item.schedule?.id ?? `schedule-${index}`}
                  className="rounded-2xl border border-slate-200 bg-slate-50/40 p-4.5 transition-all hover:border-emerald-100 hover:bg-emerald-50/5 flex items-start gap-3.5"
                >
                  <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Clock3 className="h-4.5 w-4.5" />
                  </div>
                  <div className="text-xs space-y-1.5 flex-1 min-w-0">
                    <p className="truncate">
                      <span className="font-bold text-slate-400 uppercase tracking-wider mr-1">Start:</span>
                      <span className="text-slate-700 font-semibold">{formatDateTime(item.schedule?.startDateTime)}</span>
                    </p>
                    <p className="truncate">
                      <span className="font-bold text-slate-400 uppercase tracking-wider mr-1">End:</span>
                      <span className="text-slate-600 font-medium">{formatDateTime(item.schedule?.endDateTime)}</span>
                    </p>
                    <p className="pt-0.5 text-emerald-700 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
                      Available Slot
                    </p>
                  </div>
                </div>
              ))}
              {availableUpcomingSchedules.length === 0 && (
                <div className="col-span-full text-center py-10 bg-slate-50/30 rounded-2xl border border-dashed border-slate-200">
                  <Calendar className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-400 font-semibold">No available schedules from today onward.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right side contact & reviews column */}
        <div className="space-y-8">
          {/* Contact Details Card */}
          <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2.5">
              <Mail className="h-5 w-5 text-emerald-600" />
              Contact Information
            </h2>

            <div className="space-y-5 text-sm">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Email Address</div>
                  <div className="text-slate-800 font-semibold truncate">{doctorDetails.email || "N/A"}</div>
                </div>
              </div>
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                  <Phone className="h-4.5 w-4.5" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Contact Number</div>
                  <div className="text-slate-800 font-semibold">{doctorDetails.contactNumber || "N/A"}</div>
                </div>
              </div>
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                  <User className="h-4.5 w-4.5" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Gender</div>
                  <div className="text-slate-800 font-semibold capitalize">{doctorDetails.gender ? doctorDetails.gender.toLowerCase() : "N/A"}</div>
                </div>
              </div>
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                  <MapPin className="h-4.5 w-4.5" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Clinic Address</div>
                  <div className="text-slate-800 font-semibold leading-relaxed">{doctorDetails.address || "N/A"}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Patient Reviews Card */}
          <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2.5">
              <Star className="h-5 w-5 text-emerald-600" />
              Patient Reviews
            </h2>

            <div className="space-y-4">
              {(doctorDetails.reviews ?? []).map((review, index) => (
                <div key={review.id ?? `review-${index}`} className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2.5 shadow-2xs">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <Star className="h-4 w-4 text-emerald-600 fill-emerald-600" />
                      <span className="text-sm font-bold text-slate-700">{review.rating ?? "N/A"} / 5</span>
                    </div>
                    <time className="text-xs text-slate-400 font-medium">{formatDateTime(review.createdAt)}</time>
                  </div>
                  {review.comment && (
                    <p className="text-sm text-slate-600 leading-relaxed font-medium">"{review.comment}"</p>
                  )}
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-1">
                    Patient: {review.patientId ? `${review.patientId.slice(0, 8)}...` : "Anonymous"}
                  </div>
                </div>
              ))}
              {(!doctorDetails.reviews || doctorDetails.reviews.length === 0) && (
                <div className="text-center py-8 bg-slate-50/30 rounded-2xl border border-dashed border-slate-200">
                  <Star className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-400 font-semibold">No reviews yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConsultationDoctorByIdPage;